import { Products, GameGroup } from "@/type";

export const groupProductsByGame = (products: Products[]): GameGroup[] => {
  const groupedMap: { [gameId: string]: GameGroup } = {};

  for (const product of products) {
    const { gameId, gameName, isPopular, imageUrl, currency } = product;

    if (!groupedMap[gameId]) {
      groupedMap[gameId] = {
        gameId,
        gameName,
        isPopular,
        imageUrl,
        currency,
        products: [],
      };
    }

    groupedMap[gameId].products.push({
      ...product,
    });

    if (product.isPopular) {
      groupedMap[gameId].isPopular = true;
    }
  }

  return Object.values(groupedMap);
};
