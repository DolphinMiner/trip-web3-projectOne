import React from "react";
import { LayerName } from "../types";
import Layer from "./Layer";
import styles from "./Avatar.module.css";
import classnames from "classnames";

type AvatarProps = {
  attributes: Record<LayerName, string>;
  layers: LayerName[];
  source: Record<string, Record<string, any>>;
  isSmall?: boolean;
  className?: string;
};

const Avatar = ({ attributes, layers, source, isSmall, className }: AvatarProps) => {
  return (
    <div className={classnames([
      styles.container,
      styles.normalSize,
      isSmall ? styles.smallSize : null,
      className ? className : null,
    ])}>
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
