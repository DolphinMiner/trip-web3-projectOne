import { Entity, Layer } from "../types";

const createEntity = (
  layers: Array<Layer>,
  initEntity: Entity = {}
): Entity => {
  return layers.reduce((entity, layer) => {
    return {
      ...entity,
      [layer]: initEntity[layer] || "",
    };
  }, {} as Entity);
};

export default createEntity;
