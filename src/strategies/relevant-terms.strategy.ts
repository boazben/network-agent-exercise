import { STOP_WORDS } from "./helpers/stop-words.helper";
import type { IStrategy } from "./strategy.interafce";

// Here I tried to implement a version of TD-IDF
// But since we don't have a corpus of documents, we can only calculate the term frequency part.
export const relevantTermsStrategy: IStrategy = {
  name: "relevant-terms-density",
  run: (data: unknown) => {
    const words = normalizedWords(data);

    const { totalSignificantWords, counts } =
      countingWordsAndSignificate(words);

    const scores = calculatePercentScores(totalSignificantWords, counts);

    return scores;
  },
};

function calculatePercentScores(
  totalSignificantWords: number,
  counts: Record<string, number>,
) {
  const scores: Record<string, number> = {};
  if (totalSignificantWords > 0) {
    Object.keys(counts).forEach((word) => {
      scores[word] = parseFloat(
        ((counts[word] / totalSignificantWords) * 100).toFixed(2),
      );
    });
  }
  return scores;
}

function normalizedWords(data: unknown) {
  const textString = JSON.stringify(data).toLowerCase();

  const words = textString
    .replace(/[^a-z\s]/g, " ") // just letters and spaces
    .split(/\s+/) // split by whitespace
    .filter((w) => w.length > 2);
  return words;
}

function countingWordsAndSignificate(words: string[]) {
  const counts: Record<string, number> = {};

  let totalSignificantWords = 0;

  words.forEach((word) => {
    if (!STOP_WORDS.has(word)) {
      counts[word] = (counts[word] || 0) + 1;
      totalSignificantWords++;
    }
  });
  return { totalSignificantWords, counts };
}
