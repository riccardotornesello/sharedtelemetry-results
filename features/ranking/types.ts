export interface RankingItem {
  custId: number;
  sum: number;
  isValid: boolean;
  results: Record<number, Record<string, number>>;
  position: number;
}
