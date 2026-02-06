import { openDB } from "idb";
import { TO_APPLY_STRATEGIES } from "../strategies/constants.strategy";

export function isResToAnalyze(response: Response): boolean {
  const contentType = response.headers.get("content-type");
  const isJson = Boolean(
    contentType && contentType.includes("application/json"),
  );
  const isOkResponse = response.status >= 200 && response.status < 300;
  return isJson && isOkResponse;
}

export async function analyzeResponse(url: string, response: Response) {
  try {
    const data = await response.json();

    const results: Record<string, any> = {};
    for (const strategy of TO_APPLY_STRATEGIES) {
      results[strategy.name] = strategy.run(data);
    }
    await saveOrUpdateDB(url, results);
  } catch (err) {
    console.error("[Analysis] Failed to parse JSON:", err);
  }
}

export async function saveOrUpdateDB(url: string, newResults: any) {
  const db = await openDB('NetworkAgentDB', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('traffic')) {
        db.deleteObjectStore('traffic');
      }
      db.createObjectStore('traffic', { keyPath: 'url' });
    }
  });

  const tx = db.transaction('traffic', 'readwrite');
  const store = tx.objectStore('traffic');

  const existingRecord = await store.get(url);

  let finalData = newResults;

  if (existingRecord) {
    finalData = mergeData(existingRecord.data, newResults);
  }

  await store.put({
    url: url,
    lastUpdated: Date.now(),
    data: finalData
  });
}

function mergeData(oldData: any, newData: any) {
  const merged = { ...oldData };

  if (newData.word_count && oldData.word_count) {
    merged.word_count = { ...oldData.word_count };
    for (const [word, count] of Object.entries(newData.word_count)) {
      merged.word_count[word] = (merged.word_count[word] || 0) + (count as number);
    }
  }

  return merged;
}