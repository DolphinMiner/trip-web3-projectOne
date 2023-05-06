import promiseList from "promise-limit";
import { Entity, Inventory, Layer } from "@/src/types";
import classNames from "classnames";
import { useMemo, useState } from "react";
import styles from "./OverviewPanel.module.css";
import download from "@/src/utils/download";

const limit = promiseList<boolean>(1);

export type OverviewPanelProps = {
  projectDesc: string;
  imageType: string | undefined;
  layers: Array<Layer>;
  lockedEntities: Array<Entity>;
  inventorySrc: Inventory<string>;
  onRelease?: (from: number, to?: number) => void;
};

const OverviewPanel = ({
  projectDesc,
  imageType,
  layers,
  lockedEntities,
  inventorySrc,
  onRelease,
}: OverviewPanelProps) => {
  const perBatch = 1000;
  const total = useMemo(() => {
    return lockedEntities.length;
  }, [lockedEntities]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const isInvalidImageType = useMemo(() => {
    return !imageType;
  }, [imageType]);

  const batchDownload = () => {
    if (imageType === undefined) {
      return;
    }
    const paramsList: Array<
      [Array<Entity>, Array<Layer>, Inventory<string>, string, string, number]
    > = [];
    for (let offset = 0; offset < total; ) {
      paramsList.push([
        lockedEntities.slice(offset, offset + perBatch),
        layers,
        inventorySrc,
        projectDesc,
        imageType,
        offset,
      ]);
      offset = offset + perBatch;
    }

    Promise.all(
      paramsList.map((params): Promise<boolean> => {
        return limit(() => {
          return download(...params).then((isSuccess) => {
            setCurrentIndex((prevState) => prevState + 1);
            return isSuccess;
          });
        });
      })
    ).then((areAllSuccess) => {
      setIsDownloading(false);
      console.log(areAllSuccess);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}></div>
      <div className={styles.right}>
        <div className={styles.toolbar}>
          <div className={classNames([styles.button, styles.singleRelease])}>
            <input
              type="button"
              value="Single Release"
              disabled={isInvalidImageType || true}
              className={classNames({
                [styles.disabled]: isInvalidImageType || true,
              })}
              onClick={() => {
                // TODO:
                console.log("single release");
              }}
            />
          </div>
          <div className={classNames([styles.button, styles.batchRelease])}>
            <input
              type="button"
              value="Batch Release"
              disabled={
                isInvalidImageType || isDownloading || lockedEntities.length < 1
              }
              className={classNames({
                [styles.disabled]:
                  isInvalidImageType ||
                  isDownloading ||
                  lockedEntities.length < 1,
              })}
              onClick={() => {
                onRelease && onRelease(0);
                // const to = lockedEntities.length - 1;
                // const from = to - 1000 < 0 ? 0 : to - 1000;
                // onRelease && onRelease(from, to);
              }}
            />
          </div>
          <div className={classNames([styles.button, styles.singleDownload])}>
            <input
              type="button"
              value="Single Download"
              disabled={isInvalidImageType || true}
              className={classNames({
                [styles.disabled]: isInvalidImageType || true,
              })}
              onClick={() => {
                // TODO:
                console.log("single download");
              }}
            />
          </div>
          <div className={classNames([styles.button, styles.batchDownload])}>
            <input
              type="button"
              value="Batch Download"
              disabled={
                isInvalidImageType || isDownloading || lockedEntities.length < 1
              }
              className={classNames({
                [styles.disabled]:
                  isInvalidImageType ||
                  isDownloading ||
                  lockedEntities.length < 1,
              })}
              onClick={() => {
                setIsDownloading(true);
                setCurrentIndex(1);
                setTimeout(() => {
                  batchDownload();
                }, 0);
              }}
            />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.innerContainer}>
            {isDownloading ? (
              <div>{`${currentIndex}/${Math.ceil(
                total / perBatch
              )} downloading ... `}</div>
            ) : currentIndex === Math.ceil(total / perBatch) + 1 ? (
              <div>Done</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;
