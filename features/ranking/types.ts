export interface RankingItem {
  custId: number;
  sum: number;
  isValid: boolean;
  results: Record<string, Record<string, number>>;
  position: number;
}
