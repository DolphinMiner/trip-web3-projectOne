import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import styles from "./ShufflePanel.module.css";
import useBatch from "../hooks/useBatch";
import Avatar from "./Avatar";
import configs from "../configs";
import { Pagination, Stack, TextField } from "@mui/material";
import classnames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { DEFAULT_TOTAL } from "../constants";

const PAGE_SIZE = 120;

const ShufflePanel = () => {
  const [inputValue, setInputValue] = useState(1000);
  const [total, setTotal] = useState(inputValue);
  const { entities, updateEntity, shuffleEntities } = useBatch(DEFAULT_TOTAL);
  const [curIdx, setCurIdx] = useState(-1);
  const [curPage, setCurPage] = useState(1);

  useEffect(() => {
    setCurIdx(-1);
    setCurPage(1);
    shuffleEntities(total);
  }, [total]);

  const pageCount = useMemo(() => {
    return Math.ceil(entities.length / PAGE_SIZE);
  }, [entities.length]);

  const [startIdx, endIdx] = useMemo(() => {
    const startIdx = (curPage - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    return [startIdx, endIdx];
  }, [curPage]);

  const onUpdate = () => {
    setTotal(inputValue);
  };

  const renderTokenList = () => {
    return (
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
    );
  };

  const renderTokenPagination = () => {
    return (
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
    );
  };

  const renderSupplyUpdateRow = () => {
    return (
      <Stack direction={"row"} spacing={2}>
        <TextField
          size={"small"}
          label="Tokens"
          focused
          value={inputValue}
          onChange={(e) => setInputValue(parseInt(e.target.value || 0))}
        />
        <Button
          variant="contained"
          disabled={inputValue === entities.length}
          onClick={onUpdate}
        >
          Update
        </Button>
      </Stack>
    );
  };

  return (
    <Grid className={styles.shufflePanelContainer} container spacing={0}>
      <Grid item xs={"auto"} className={styles.leftContainer}>
        {renderSupplyUpdateRow()}
        {/* TODO: more action */}
      </Grid>
      <Grid item xs className={styles.rightContainer}>
        {renderTokenList()}
        {renderTokenPagination()}
      </Grid>
    </Grid>
  );
};

export default ShufflePanel;
