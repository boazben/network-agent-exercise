import type { IStrategy } from "./strategy.interafce";
import { weightedStructuralStrategy } from "./weighted-structural.strategy";
import { wordCountStrategy } from "./word-count.strategy";

export const TO_APPLY_STRATEGIES: IStrategy[] = [
  wordCountStrategy,
  weightedStructuralStrategy,
];
