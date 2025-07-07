import { ReactNode } from "react";

export interface User {
  userId: string;
  name: string;
  email: string;
  createdAt?: Date;
  iat?: number;
  exp?: number;
  roles: string[];
}

export interface Products {
  productId: string;
  type: string;
  value: number;
  price: number;
  gameId: string;
  gameName: string;
  isPopular: boolean;
  stock?: number;
  currency: string;
  imageUrl?: string;
}

export interface Games {
  gameId: string;
  name: string;
  isPopular: boolean;
  currency: string;
  imageUrl: string;
}

export interface DetailedProducts extends Products {
  code: string;
  status: string;
}

export interface Orders {
  orderId: string;
  target?: string;
  status: "pending" | "completed" | "cancelled" | "processed" | "failed";
  createdAt: string;
  priceTotal: number;
  value: number;
  type: string;
  gameName: string;
  quantity: number;
  paymentLink?: string;
  code?: string;
  paymentStatus: string;
}

export interface GameGroup {
  gameId: string;
  gameName: string;
  isPopular: boolean;
  imageUrl: string | undefined;
  currency: string;
  products: Products[];
}

// store zustand
export interface ProductStore {
  products: GameGroup[];
  adminProducts: DetailedProducts[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchAdminProducts: (force?: boolean) => Promise<void>;
  hasFetchedAdminProducts?: boolean;
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

export interface DashboardStats {
  dailyOrders: number;
  dailyUsers: number;
  dailyRevenue: number;
  unprocessedOrders: number;
}

export interface AuditLog {
  auditId: string;
  adminId: string;
  adminName: string;
  activity: string;
  createdAt: string;
}

export interface OrderDetail {
  orderId: string;
  userId: string;
  target: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  createdAt: string;
  priceTotal: number;
  value: number;
  type: "voucher" | "topup";
  gameName: string;
  quantity: number;
  paymentLink?: string | null;
  voucherCode?: string[];
}
