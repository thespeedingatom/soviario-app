export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  region: string;
  price: number;
  currency: string;
  dataAllowance: string;
  validityDays: number;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
