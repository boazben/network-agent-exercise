import { getDB } from "./db.service"; // שימוש בשירות החדש
import { TO_APPLY_STRATEGIES } from "../strategies/constants.strategy";
import { NETWORK_AGENT_OBJECT_STORE_NAME } from "./constants/index-db.constant";

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
  const db = await getDB();

  const tx = db.transaction(NETWORK_AGENT_OBJECT_STORE_NAME, "readwrite");
  const store = tx.objectStore(NETWORK_AGENT_OBJECT_STORE_NAME);

  const existingRecord = await store.get(url);

  let finalData = newResults;

  if (existingRecord) {
    finalData = mergeData(existingRecord.data, newResults);
  }

  await store.put({
    url: url,
    lastUpdated: Date.now(),
    data: finalData,
  });
}

function mergeData(oldData: any, newData: any) {
  const merged = { ...oldData };

  for (const strategyName of Object.keys(newData)) {
    const newStrategyResult = newData[strategyName];
    const oldStrategyResult = oldData[strategyName];

    if (oldStrategyResult) {
      merged[strategyName] = mergeDeepCounters(
        oldStrategyResult,
        newStrategyResult,
      );
    } else {
      merged[strategyName] = newStrategyResult;
    }
  }

  return merged;
}

function mergeDeepCounters(
  oldObj: Record<string, number>,
  newObj: Record<string, number>,
) {
  const result = { ...oldObj };
  for (const [key, value] of Object.entries(newObj)) {
    result[key] = (result[key] || 0) + (value as number);
  }
  return result;
}
