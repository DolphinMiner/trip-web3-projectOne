import pngSource from "../png";

export type PngSource = typeof pngSource;
export type LayerName = keyof PngSource;
export type Attributes = Record<LayerName, string>;
