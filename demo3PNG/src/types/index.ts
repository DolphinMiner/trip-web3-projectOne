import { layers } from "../configs";

export type LayerName = (typeof layers)[number];
export type Attributes = Record<LayerName, string>;
