import { ReactNode } from "react";

export interface User {
  userId: string;
  name: string;
  email: string;
  createdAt?: Date;
  iat?: number;
  exp?: number;
}

export interface Products {
  type: string;
  value: number;
  price: number;
  gameId: string;
  gameName: string;
  isPopular: boolean;
  stock?: number;
  currency: string;
}

export interface Orders {
  orderId: string;
  target?: string;
  status: "pending" | "completed" | "cancelled" | "processed";
  createdAt: string;
  priceTotal: number;
  value: number;
  type: string;
  gameName: string;
  quantity: number;
  redirectLink?: string;
  code?: string;
}

export interface GameGroup {
  gameId: string;
  gameName: string;
  isPopular: boolean;
  products: Products[];
}

// store zustand
export interface ProductStore {
  products: GameGroup[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export interface AuthStore {
  user: User | null;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  authLoading: boolean;
}

export interface OrderStore {
  orders: Orders[];
  loading: boolean;
  error: string | null;
  fetchOrders: (status?: string) => Promise<void>;
}

export interface GameCarouselProps {
  title: string;
  icon: ReactNode;
  data: GameGroup[];
}
