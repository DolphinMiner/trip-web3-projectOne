import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Entity, Inventory, Layer } from "../types";
import convertTo from "./convertTo";

const formatMetadata = (entity: Entity, index: number) => {
  return {
    attributes: Object.keys(entity).map((key) => {
      return {
        trait_type: key,
        value: entity[key],
      };
    }),
    description: "The world's most beautiful avatar.",
    image: `ipfs://YourImageURI/${index}.jpg`,
    name: `#${index}`,
  };
};

const download = (
  entities: Array<Entity>,
  layers: Array<Layer>,
  inventorySrc: Inventory<string>,
  offset?: number = 0
): Promise<boolean> => {
  const tasks = entities.map((entity) => {
    return convertTo(entity, layers, inventorySrc, "blob") as Promise<Blob>;
  });
  return Promise.all(tasks)
    .then((imageBlobs) => {
      const zip = new JSZip();
      imageBlobs.forEach((imageBlob, index) => {
        const jsonBlob = new Blob(
          [JSON.stringify(formatMetadata(entities[index], index))],
          {
            type: "text/plain;charset=utf-8",
          }
        );
        zip.file(`/image/${offset + index}.png`, imageBlob);
        zip.file(`/json/${offset + index}.json`, jsonBlob);
      });

      return zip.generateAsync({ type: "blob" }).then((zipBlob) => {
        saveAs(zipBlob, `tokens.${offset}.zip`);
      }).then(() => {
        return true;
      });
    })
    .catch((err) => {
      return false;
    });
};

export default download;
