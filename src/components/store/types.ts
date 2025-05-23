
export interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  bannerImage?: string;
  owner_id: string;
  created_at: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export interface DbProduct {
  id: string;
  store_id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  created_at: string;
  updated_at: string;
}
