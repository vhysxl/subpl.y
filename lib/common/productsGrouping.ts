import { Products, GameGroup } from "@/type";

export const groupProductsByGame = (products: Products[]): GameGroup[] => {
  const groupedMap: { [gameId: string]: GameGroup } = {};

  for (const product of products) {
    const { gameId, gameName, isPopular } = product;

    if (!groupedMap[gameId]) {
      groupedMap[gameId] = {
        gameId,
        gameName,
        isPopular,

        products: [],
      };
    }

    groupedMap[gameId].products.push(product);
  }

  return Object.values(groupedMap);
};
