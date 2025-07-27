// Shared Types for Budget & Property Hub Latvia
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  category: string;
  allocated: number;
  spent: number;
  color: string;
}

// Re-export commonly used types
export type TransactionType = 'income' | 'expense';
export type CategoryType = string;