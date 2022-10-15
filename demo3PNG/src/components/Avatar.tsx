import React from "react";
import { LayerName } from "../types";
import Layer from "./Layer";
import configs from "../configs";
import styles from "./Avatar.module.css";

type AvatarProps = {
  attributes: Record<LayerName, string>;
};

const Avatar = ({ attributes }: Props) => {
  const { layers, pngSource } = configs;
  return (
    <div className={styles.container}>
      {layers.map((layer) => {
        return attributes[layer] &&
          pngSource[layer] &&
          pngSource[layer][attributes[layer]] ? (
          <Layer
            key={layer}
            alt={layer}
            src={pngSource[layer][attributes[layer]]}
          />
        ) : null;
      })}
    </div>
  );
};

export default Avatar;
