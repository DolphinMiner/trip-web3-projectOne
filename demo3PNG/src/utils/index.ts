import { saveAs } from "file-saver";
import { toBlob } from "html-to-image";
import JSZip from "jszip";
import configs from "../configs";
import { Attributes } from "../types";

export const shuffle = (): Attributes => {
  const { pngSource } = configs;
  return Object.keys(pngSource).reduce((acc, cur) => {
    const collection = Object.keys(pngSource[cur]);
    return {
      ...acc,
      [cur]: collection[Math.floor(Math.random() * collection.length)],
    };
  }, {});
};

export const download = async (attributes: Attributes, ele: HTMLDivElement) => {
  try {
    const pngBlob = await toBlob(ele);
    const jsonBlob = new Blob([JSON.stringify(attributes)], {
      type: "text/plain;charset=utf-8",
    });
    if (!pngBlob || !jsonBlob) {
      throw new Error("Failed to get blob data", { pngBlob, jsonBlob });
    }
    const zip = new JSZip();
    zip.file("/png/avatar.png", pngBlob);
    zip.file("/json/metadata.json", jsonBlob);
    await zip.generateAsync({ type: "blob" }).then((blob) => {
      saveAs(blob, "avatar.zip");
    });
  } catch (e) {
    console.log("Failed to download", e);
  }
};
