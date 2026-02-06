import type { IStrategy } from "./strategy.interafce";

export const wordCountStrategy: IStrategy = {
  name: "word-count",
  run: (data: unknown) => {
      try {
        const textString = JSON.stringify(data).toLowerCase();
        const cleanText = textString.replace(/[^a-z\s]/g, " ");
        const words = cleanText.split(/\s+/);
    
        return words.reduce((acc: Record<string, number>, word: string) => {
          if (word.length > 2) {
            acc[word] = (acc[word] || 0) + 1;
          }
          return acc;
        }, {});
        
    } catch (error) {
        throw new Error(`WordCountStrategy failed: ${(error as Error).message}`);
    }
  },
};
