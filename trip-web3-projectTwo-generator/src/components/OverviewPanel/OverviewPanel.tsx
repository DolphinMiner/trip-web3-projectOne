import { Entity, Inventory, Layer } from "@/src/types";
import classNames from "classnames";
import { useState } from "react";
import styles from "./OverviewPanel.module.css";
import download from "@/src/utils/download";

export type OverviewPanelProps = {
  layers: Array<Layer>;
  lockedEntities: Array<Entity>;
  inventorySrc: Inventory<string>;
  onRelease?: (from: number, to?: number) => void;
};

const OverviewPanel = ({
  layers,
  lockedEntities,
  inventorySrc,
  onRelease,
}: OverviewPanelProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  return (
    <div className={styles.container}>
      <div className={styles.left}></div>
      <div className={styles.right}>
        <div className={styles.toolbar}>
          <div className={classNames([styles.button, styles.singleRelease])}>
            <input
              type="button"
              value="Single Release"
              disabled={true}
              className={classNames({
                [styles.disabled]: true,
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
              disabled={isDownloading || lockedEntities.length < 1}
              className={classNames({
                [styles.disabled]: isDownloading || lockedEntities.length < 1,
              })}
              onClick={() => {
                onRelease && onRelease(0, 999);
              }}
            />
          </div>
          <div className={classNames([styles.button, styles.singleDownload])}>
            <input
              type="button"
              value="Single Download"
              disabled={true}
              className={classNames({
                [styles.disabled]: true,
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
              disabled={isDownloading || lockedEntities.length < 1}
              className={classNames({
                [styles.disabled]: isDownloading || lockedEntities.length < 1,
              })}
              onClick={() => {
                setIsDownloading(true);
                setTimeout(() => {
                  download(lockedEntities.slice(0, 1000), layers, inventorySrc).then(
                    (isSuccess) => {
                      setIsDownloading(false);
                      console.log({ isSuccess });
                    }
                  );
                }, 0);
              }}
            />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.innerContainer}>hello world</div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;
