import { RELATIONSHIP } from "../constants";
import type {
  Inventory,
  Layer,
  LayerWithStyle,
  Restriction,
  Style,
} from "../types";
import createOptions from "./createOptions";

function random<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

const shuffle = (
  layers: Array<Layer>,
  restrictions: Array<Restriction>,
  inventory: Inventory
) => {
  const { isValid, combination } = layers.reduce(
    (acc, curLayer) => {
      if (acc.isValid !== true) return acc;

      const layerInventory = inventory[curLayer];
      const originOptions = Object.keys(layerInventory).filter(
        (style) => layerInventory[style] > 0
      );
      const options = createOptions(
        curLayer,
        acc.combination,
        restrictions,
        originOptions
      );
      if (options.length === 0) {
        return {
          ...acc,
          isValid: false,
        };
      }
      const curStyle = random(options);
      return {
        ...acc,
        combination: [...acc.combination, `${curLayer}.${curStyle}`],
      };
    },
    { isValid: true, combination: [] } as {
      isValid: boolean;
      combination: Array<LayerWithStyle>;
    }
  );
  const nextInventory: Inventory = JSON.parse(JSON.stringify(inventory));
  if (isValid) {
    // e.g. [['hair', 'gold'], ['skin', 'black']]
    const layerWithStyleList = combination.map((layerWithStyle) => {
      return layerWithStyle.split(".");
    });
    layerWithStyleList.forEach(([layer, style]) => {
      nextInventory[layer][style] = nextInventory[layer][style] - 1;
    });
  }
  return {
    isValid,
    combination,
    nextInventory,
  };
};

export default shuffle;
