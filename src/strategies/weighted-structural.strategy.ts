import {
  WEIGHTED_CONTENT_KEYS,
  WEIGHTED_STRUCTURAL_KEYS,
  WEIGHTED_ZERO_KEYS,
} from "./helpers/weighted-structural.helper";
import type { IStrategy } from "./strategy.interafce";

// This strategy gives more weight to words found in certain keys that are likely to be more important (like title, headline, etc.)
export const weightedStructuralStrategy: IStrategy = {
  name: "weighted-structural",
  run: (data: unknown) => {
    const scores: Record<string, number> = {};

    const traverse = (value: any, currentWeight: number) => {
      if (!value) return;

      if (Array.isArray(value)) {
        value.forEach((item) => traverse(item, currentWeight));
        return;
      }

      if (typeof value === "object") {
        Object.keys(value).forEach((key) => {
          const newWeight = getWeight(key);
          if (newWeight > 0) {
            traverse(value[key], newWeight);
          }
        });
        return;
      }

      if (typeof value === "string") {
        const words = normalizeWords(value);
        calculateScore(words, scores, currentWeight);
      }
    };

    traverse(data, 1);

    return scores;
  },
};

const getWeight = (key: string): number => {
  const k = key.toLowerCase();
  if (WEIGHTED_STRUCTURAL_KEYS.some((w) => k.includes(w))) return 5;
  if (WEIGHTED_CONTENT_KEYS.some((w) => k.includes(w))) return 1;
  if (WEIGHTED_ZERO_KEYS.some((w) => k.includes(w))) return 0;
  return 1;
};

function calculateScore(words: string[], scores: Record<string, number>, currentWeight: number) {
  words.forEach((word) => {
    scores[word] = (scores[word] || 0) + currentWeight;
  });
}

function normalizeWords(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z\s]/g, "") // just letters and spaces
    .split(/\s+/) // split by whitespace
    .filter((w) => w.length > 2);
}
