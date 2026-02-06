import type { IStrategy } from "./strategy.interafce";

const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it', 
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'is', 'are', 'was', 'were', 'has', 'had', 'been', 'can', 'could', 'did',
  'done', 'doing', 'your', 'yours', 'him', 'them', 'its', 'mine', 'our',
  'userid', 'title'
]);

export const relevantTermsStrategy: IStrategy = {
  name: "relevant-terms-density",
  run: (data: unknown) => {
    const counts: Record<string, number> = {};
    let totalSignificantWords = 0;

    const textString = JSON.stringify(data).toLowerCase();
    
    const words = textString
      .replace(/[^a-z\s]/g, " ") // just letters and spaces
      .split(/\s+/) // split by whitespace
      .filter(w => w.length > 2);

    // counting occurrences of each word, while ignoring stop words
      words.forEach(word => {
      if (!STOP_WORDS.has(word)) {
        counts[word] = (counts[word] || 0) + 1;
        totalSignificantWords++;
      }
    });


    const scores: Record<string, number> = {};
    
    if (totalSignificantWords > 0) {
        Object.keys(counts).forEach(word => {
            scores[word] = parseFloat(((counts[word] / totalSignificantWords) * 100).toFixed(2));
        });
    }

    return scores;
  },
};