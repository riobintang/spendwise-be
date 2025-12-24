export interface Category {
  id: number;
  name: string;
  color: string; // TailwindCSS color class
  type: 'income' | 'expense';
  userId: number;
}

export interface CategoryCreateInput {
  name: string;
  color: string;
  type: 'income' | 'expense';
}

export interface CategoryUpdateInput {
  name?: string;
  color?: string;
  type?: 'income' | 'expense';
}

