import { saveAs } from "file-saver";
import { toBlob } from "html-to-image";
import JSZip from "jszip";
import configs from "../configs";
import { Attributes } from "../types";

export const getSuppliedAttributes = (total: number) => {
  return Object.keys(configs.attributes).reduce((accAttrs, attrName) => {
    const attrStyles = configs.attributes[attrName];
    const len = attrStyles.length;
    const perSupply = len >= 0 ? Math.floor(total / len) : 0;
    const modSupply = len >= 0 ? total % len : 0;
    return {
      ...accAttrs,
      [attrName]: attrStyles.reduce((accStyles, styleName, index) => {
        return {
          ...accStyles,
          [styleName]: index === 0 ? perSupply + modSupply : perSupply,
        };
      }, {} as Record<string, number>),
    };
  }, {} as Record<string, Record<string, number>>);
};

export const shuffle = () => {
  return Object.keys(configs.attributes).reduce((accAttrs, attrName) => {
    const collection = configs.attributes[attrName];
    return {
      ...accAttrs,
      [attrName]: collection[Math.floor(Math.random() * collection.length)],
    };
  }, {} as Record<string, string>);
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
