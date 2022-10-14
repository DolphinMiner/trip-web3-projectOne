import React from "react";
import { LayerName } from "../types";
import Layer from "./Layer";
import { layers, pngSource } from "../configs";
import styles from "./Avatar.module.css";

type AvatarProps = {
  attributes: Record<LayerName, string>;
};

const Avatar = ({ attributes }: Props) => {
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
