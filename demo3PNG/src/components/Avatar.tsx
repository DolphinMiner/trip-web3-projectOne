import React from "react";
import { LayerName } from "../types";
import Layer from "./Layer";
import styles from "./Avatar.module.css";

type AvatarProps = {
  attributes: Record<LayerName, string>;
  layers: LayerName[];
  source: Record<string, Record<string, any>>;
};

const Avatar = ({ attributes, layers, source }: Props) => {
  return (
    <div className={styles.container}>
      {layers.map((layer) => {
        return attributes[layer] &&
          source[layer] &&
          source[layer][attributes[layer]] ? (
          <Layer
            key={layer}
            alt={layer}
            src={source[layer][attributes[layer]]}
          />
        ) : null;
      })}
    </div>
  );
};

export default Avatar;
