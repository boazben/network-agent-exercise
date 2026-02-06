import type { IStrategy } from "./strategy.interafce";
import { wordCountStrategy } from "./word-count.strategy";

export const TO_APPLY_STRATEGIES: IStrategy[] = [wordCountStrategy];
