export interface Medicine {
  id: string;
  name: string;
  stock: number;
  price: number;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  medicines: Medicine[];
  latitude: number;
  longitude: number;
}
