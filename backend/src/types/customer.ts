/** A customer record as stored and returned by the API. */
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}
