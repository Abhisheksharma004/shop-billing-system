// Types for the dashboard
export interface Transaction {
  type: 'in' | 'out';
  productName: string;
  quantity: number;
  reason: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  lowStockAlert: number;
  category: string;
  price: number;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockCount: number;
  totalValue: number;
  recentSales: number;
}
