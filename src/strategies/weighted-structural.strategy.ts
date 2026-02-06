import type { IStrategy } from "./strategy.interafce";

export const weightedStructuralStrategy: IStrategy = {
  name: "weighted-structural",
  run: (data: unknown) => {
    const scores: Record<string, number> = {};

    const getWeight = (key: string): number => {
      const k = key.toLowerCase();
      if (['title', 'subject', 'name', 'headline', 'header'].some(w => k.includes(w))) return 5;
      if (['body', 'description', 'content', 'text', 'summary'].some(w => k.includes(w))) return 1;
      if (['id', 'url', 'href', 'src', 'date', 'time', 'token'].some(w => k.includes(w))) return 0;
      return 1;
    };

    const traverse = (value: any, currentWeight: number) => {
      if (!value) return;

      if (Array.isArray(value)) {
        value.forEach(item => traverse(item, currentWeight));
        return;
      }

      if (typeof value === 'object') {
        Object.keys(value).forEach(key => {
          const newWeight = getWeight(key);
          if (newWeight > 0) { 
             traverse(value[key], newWeight);
          }
        });
        return;
      }

      if (typeof value === 'string') {
        const words = value
          .toLowerCase()
          .replace(/[^a-z\s]/g, '')
          .split(/\s+/)
          .filter(w => w.length > 2);
        words.forEach(word => {
          scores[word] = (scores[word] || 0) + currentWeight;
        });
      }
    };

    traverse(data, 1);
    
    return scores;
  },
};