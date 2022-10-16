import React from "react";
import { LayerName } from "../types";
import Layer from "./Layer";
import styles from "./Avatar.module.css";

type AvatarProps = {
  attributes: Record<LayerName, string>;
  layers: LayerName[];
  source: Record<string, Record<string, any>>;
  isSmall?: boolean;
};

const Avatar = ({ attributes, layers, source, isSmall }: AvatarProps) => {
  return (
    <div className={[styles.container, isSmall ? styles.smallContainer : null]}>
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
