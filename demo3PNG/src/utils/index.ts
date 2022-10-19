import { saveAs } from "file-saver";
import { toBlob } from "html-to-image";
import JSZip from "jszip";
import configs from "../configs";
import { Attributes } from "../types";

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

function random<T>(options: T[]): T | undefined {
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * @param {number} total e.g. 3
 * @param {Record<string, Array<string>>} attributes e.g. {skin: ['default', 'white']}
 * @returns {Record<string, Record<string, number>>} e.g. {skin: {default: 2, white: 1}}
 */
export const getAttributesWithSupply = (
  total: number,
  attributes: Record<string, Array<string>>
) => {
  return Object.keys(attributes).reduce((accAttrs, attrName) => {
    const attrStyles = attributes[attrName];
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

/**
 * @param {number} total e.g. 3
 * @param {Record<string, Array<string>>} attributes e.g. {skin: ['default', 'white']}
 * @returns {Array<Record<string, string>>} e.g. [{skin: 'default'}, {skin: 'white'}, {skin: 'default'}]
 */
export const batchShuffle = (
  total: number,
  attributes: Record<string, Array<string>>
): Array<Record<string, string>> => {
  const suppliedAttributes = getAttributesWithSupply(total, attributes);
  const entities = new Array(total).fill(0).map((_, index) => {
    return Object.keys(suppliedAttributes).reduce((acc, attrName) => {
      const curAttrStyles = suppliedAttributes[attrName];
      const options = Object.keys(curAttrStyles).filter(
        (styleName) => curAttrStyles[styleName]
      );

      const randomStyle = random(options);

      if (randomStyle === undefined) return acc;

      curAttrStyles[randomStyle] -= 1;
      return {
        ...acc,
        [attrName]: randomStyle,
      };
    }, {} as Record<string, string>);
  });
  return entities;
};
