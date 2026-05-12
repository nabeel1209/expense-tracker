export type Transaction = {
  type: 'income'|'expense';
  date: string;
  account: string;
  category: string;
  notes: string;
  amount: number;
}