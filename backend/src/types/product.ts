/** A product record as stored and returned by the API. */
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
}
