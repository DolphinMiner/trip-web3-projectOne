import React from "react";
import { LayerName } from "../types";
import Layer from "./Layer";
import styles from "./Avatar.module.css";
import classnames from "classnames";

type AvatarProps = {
  attributes: Record<LayerName, string>;
  layers: LayerName[];
  source: Record<string, Record<string, any>>;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const Avatar = ({
  attributes,
  layers,
  source,
  className,
  onClick,
}: AvatarProps) => {
  return (
    <div
      onClick={onClick}
      className={classnames([styles.container, className ? className : null])}
    >
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
