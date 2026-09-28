export type Cuisine =
  | 'All cuisines'
  | 'Italian'
  | 'Burgers'
  | 'Asian'
  | 'Japanese'
  | 'Modern Australian'
  | 'Mexican';

export type DiningTime = 'Any time' | 'Lunch' | 'Dinner';

export type SortOption = 'recommended' | 'discount' | 'rating';

export interface Restaurant {
  id: string;
  name: string;
  cuisine: Exclude<Cuisine, 'All cuisines'>;
  suburb: string;
  discount: number;
  rating: number;
  time: DiningTime;
  keywords?: string;
  image: string;
  address?: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'Mains' | 'Starters' | 'Desserts' | 'Drinks';
  available: boolean;
}

export type UserRole = 'customer' | 'restaurant' | null;

export interface AuthState {
  isLoggedIn: boolean;
  role: UserRole;
  restaurantName: string;
}
