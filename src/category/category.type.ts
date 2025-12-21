export interface Category {
  id: number;
  name: string;
  icon: string; // Lucide React icon name
  color: string; // TailwindCSS color class
  type: 'income' | 'expense';
  userId: number;
}

export interface CategoryCreateInput {
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export interface CategoryUpdateInput {
  name?: string;
  icon?: string;
  color?: string;
  type?: 'income' | 'expense';
}

