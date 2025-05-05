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
