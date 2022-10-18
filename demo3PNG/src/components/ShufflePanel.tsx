import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import styles from "./ShufflePanel.module.css";
import useBatch from "../hooks/useBatch";
import Avatar from "./Avatar";
import configs from "../configs";
import { Pagination, Stack } from "@mui/material";
import classnames from "classnames";
import React, { useMemo, useState } from "react";

const PAGE_SIZE = 20;

const ShufflePanel = () => {
  const { entities, selected, onNextBatch, onSelected } = useBatch();
  const [curIdx, setCurIdx] = useState(-1);
  const [curPage, setCurPage] = useState(1);

  const pageCount = useMemo(() => {
    return Math.ceil(entities.length / PAGE_SIZE);
  }, [entities.length]);

  const [startIdx, endIdx] = useMemo(() => {
    const startIdx = (curPage - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    return [startIdx, endIdx];
  }, [curPage]);

  const onBatchSave = () => {
    // TODO
  };

  const renderLeftPanel = () => {
    return (
      <Card variant="outlined" className={styles.leftPanelCard}>
        <h2>Configure Panel</h2>
        <h2>...</h2>
      </Card>
    );
  };

  const renderBatch = () => {
    return (
      <Grid container className={styles.batchContainer}>
        {entities.map((entity, idx) => {
          return (
            <div key={idx} className="p-2 text-center">
              <Avatar
                source={configs.pngSource}
                layers={configs.layers}
                attributes={entity}
                className={styles.smallAvatar}
              />
              <Checkbox
                checked={!!selected[idx]}
                onClick={() => onSelected(idx)}
              />
            </div>
          );
        })}
      </Grid>
    );
  };

  const renderActionButtons = () => {
    return (
      <div className="block p-10 mh-20 w-full text-center">
        <Button variant="contained" className="mr-4" onClick={onBatchSave}>
          批量生成
        </Button>
        <Button variant="contained" onClick={onNextBatch}>
          下一波
        </Button>
      </div>
    );
  };

  /* return (
    <div className="flex flex-1 w-full">
      {renderLeftPanel()}

      <div className="flex-1">
        {renderBatch()}
        {renderActionButtons()}
      </div>
    </div>
  ); */

  return (
    <Grid className={styles.shufflePanelContainer} container spacing={0}>
      <Grid item xs={"auto"} className={styles.leftContainer}></Grid>
      <Grid item xs className={styles.rightContainer}>
        <div className={styles.avatarListContainer}>
          <div className={styles.gridContainer}>
            {entities.slice(startIdx, endIdx).map((entity, idx) => {
              const actualIdx = idx + startIdx;
              return (
                <div key={actualIdx} className={styles.gridItem}>
                  <div className={styles.innerContainer}>
                    <div
                      className={classnames({
                        [styles.avatarContainer]: true,
                        [styles.active]: actualIdx === curIdx,
                      })}
                    >
                      <Avatar
                        source={configs.pngSource}
                        layers={configs.layers}
                        attributes={entity}
                        className={styles.avatar}
                        onClick={() => {
                          setCurIdx(actualIdx === curIdx ? -1 : actualIdx);
                        }}
                      />
                    </div>
                    <div className={styles.description}>{`Token #${
                      actualIdx + 1
                    }`}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Stack className={styles.pageContainer} spacing={2} padding={"10px"}>
          <Pagination
            count={pageCount}
            page={curPage}
            onChange={(e, value) => {
              setCurPage(value);
            }}
            shape="rounded"
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ShufflePanel;
