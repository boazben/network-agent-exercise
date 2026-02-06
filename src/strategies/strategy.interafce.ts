export interface IStrategy {
  name: string;
  run: (data: unknown) => Record<string, number>;
}