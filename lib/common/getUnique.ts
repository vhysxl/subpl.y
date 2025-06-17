import { DetailedProducts } from "@/type";

export function getUniqueGames(products: DetailedProducts[]) {
  const uniqueGames = Array.from(
    new Map(
      products.map((product) => [
        product.gameId,
        { gameId: product.gameId, gameName: product.gameName },
      ]),
    ).values(),
  );
  return uniqueGames;
}
