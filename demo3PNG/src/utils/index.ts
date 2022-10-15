import configs from "../configs";
import { Attributes } from "../types";

export const shuffle = (): Attributes => {
  const { pngSource } = configs;
  return Object.keys(pngSource).reduce((acc, cur) => {
    const collection = Object.keys(pngSource[cur]);
    return {
      ...acc,
      [cur]: collection[Math.floor(Math.random() * collection.length)],
    };
  }, {});
};
