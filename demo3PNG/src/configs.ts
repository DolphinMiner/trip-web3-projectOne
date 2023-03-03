import pngSource from "./png/spring";

export { default as pngSource } from "./png/spring";

export const layers = [
  "background",
  "skin",
  "accessory",
  "eye",
  "eyebrow",
  "mouth",
  "clothe",
  "hair",
  "eyeglass",
] as const;

export const attributes = {
  // visible attributes
  ...Object.keys(pngSource).reduce((layerAcc, layerName) => {
    const layerStyles = pngSource[layerName];
    return {
      ...layerAcc,
      [layerName]: Object.keys(layerStyles),
    };
  }, {} as Record<string, Array<string>>),

  // invisible attributes
  // ...
};

const configs = {
  pngSource,
  layers,
  attributes,
};

export default configs;
