import { saveAs } from "file-saver";
import { toBlob } from "html-to-image";
import JSZip from "jszip";
import { createDNA } from "../components/ShufflePanel";
import configs from "../configs";
import { Attributes } from "../types";
import mergeImages from "./mergeImages";
import store from "../store/spring.json";

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
          [styleName]: perSupply + (index < modSupply ? 1 : 0),
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
export const batchShuffleWithSupply = (
  total: number,
  attributes: Record<string, Array<string>> = configs.attributes
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

export const newSuppliedAttributes = (total: number) => {
  const result = [];
  const dnaStore: string | string[] = [];
  // 每一项的关系
  const relation = new Array(total).fill(null).map(() => {
    const item = {
      bind: [],
      exclude: [],
    } as any;
    return item;
  });
  // 收集所有属性
  const attribute = store.map((storeItem) => {
    return storeItem.className;
  });
  for (let index = 0; index < total; index++) {
    const valueStorePool: any[] = [];
    const resultItem = attribute.reduce(
      (total, currentItem, arrributeIndex) => {
        const currentStyle = store[arrributeIndex].classValues;
        // 排除库存为0的属性
        const optionalValueName = currentStyle
          .map((item) => {
            return item.valueStore > 0 ? item.valueName : null;
          })
          .filter((n) => n);
        const relationItem = relation[index];
        const currentBind = relationItem.bind;
        const currentExclude = relationItem.exclude;
        let currentStyleClassValue;
        // 强绑定 bind 库中的元素
        for (let i = 0; i < currentBind.length; i++) {
          if (currentBind[i].className === currentItem) {
            currentStyleClassValue = currentBind[i].classValue;
            break;
          }
        }
        if (!currentStyleClassValue) {
          // 删除 exclude 库中互斥的元素
          for (let i = 0; i < currentExclude.length; i++) {
            currentExclude[i].className === currentExclude &&
              optionalValueName.splice(
                optionalValueName.indexOf(currentExclude[i].classValue),1);
            break;
          }
          // 如果不存在强绑定的元素则进行随机匹配一个元素值
          currentStyleClassValue = random(optionalValueName);
        }
        // 将当前元素的 bind 库和 exclude 库添加上去
        for (let i = 0; i < currentStyle.length; i++) {
          if (currentStyle[i].valueName === currentStyleClassValue) {
            relationItem.exclude.push(...currentStyle[i].exclude);
            relationItem.bind.push(...currentStyle[i].bind);
            // 这一项存入StorePool中，后面验证dna通过再删库存
            valueStorePool.push(currentStyle[i]);
            break;
          }
        }
        // console.log({relation})
        return {
          ...total,
          [currentItem]: currentStyleClassValue,
        };
      },
      {}
    );
    // 对每一项生产dna
    const dna = createDNA(resultItem);
    if(dnaStore.includes(dna)) {
      // 由于重复，该项的强绑互斥关系置空
      relation[index].bind = [];
      relation[index].exclude = [];
      index--;
    } else {
      dnaStore.push(dna);
      result.push(resultItem);
      // 删库存
      valueStorePool.forEach((currentStyle) => {
        currentStyle.valueStore--;
      });
    }
  }
  return result;
};

export const convertTo = (
  entity: Attributes,
  rtn?: "blob" | "dataURL" = "dataURL"
) => {
  const sources = configs.layers
    .map((layerName) => {
      const layerStyle = entity[layerName];
      const source = configs.pngSource[layerName]?.[layerStyle];
      return source;
    })
    .filter((v) => !!v)
    .map((source) => source.default || source);

  return mergeImages(sources, { rtn });
};

const formatMetadata = (entity: Attributes, index: number) => {
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

export const batchDownload = (
  entities: Array<Attributes>
): Promise<boolean> => {
  const tasks = entities.map((entity) => {
    return convertTo(entity, "blob") as Promise<Blob>;
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
        zip.file(`/image/${index}.png`, imageBlob);
        zip.file(`/json/${index}.json`, jsonBlob);
      });

      return zip.generateAsync({ type: "blob" }).then((zipBlob) => {
        saveAs(zipBlob, "tokens.zip");
      });
    })
    .catch((err) => {
      return false;
    });
};
