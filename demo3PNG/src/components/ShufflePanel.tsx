import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import styles from "./ShufflePanel.module.css";
import useBatch from "../hooks/useBatch";
import Avatar from "./Avatar";
import configs, { attributes } from "../configs";
import { IconButton, Pagination, Stack, TextField } from "@mui/material";
import classnames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { DEFAULT_TOTAL } from "../constants";
import DownloadIcon from "@mui/icons-material/Download";
import Image from "next/image";
import { batchDownload, convertTo } from "../utils";
import { Attributes } from "../types";
import CryptoJS from "crypto-js";

const PAGE_SIZE = 120;

const createDNA = (entity: Attributes): string => {
  const hash = CryptoJS.SHA1(JSON.stringify(entity));
  const dna = hash.toString(CryptoJS.enc.Hex);
  console.log(entity, dna);
  return dna;
};

const cachedDataURL = new WeakMap();

const ShufflePanel = () => {
  const [formedTotal, setFormedTotal] = useState(DEFAULT_TOTAL);
  const [total, setTotal] = useState(0);
  const { entities, updateEntity, shuffleEntities } = useBatch(total);
  const [curIdx, setCurIdx] = useState(-1);
  const [curPage, setCurPage] = useState(1);

  const [dataURL, setDataURL] = useState("");

  const dnaCollection = useMemo(() => {
    return entities.reduce((acc, entity, index) => {
      const dna = createDNA(entity);
      return {
        ...acc,
        [dna]: (acc[dna] || []).concat(index),
      };
    }, {} as Record<string, Array<number>>);
  }, [entities]);

  const pageCount = useMemo(() => {
    return Math.ceil(entities.length / PAGE_SIZE);
  }, [entities.length]);

  const [startIdx, endIdx] = useMemo(() => {
    const startIdx = (curPage - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    return [startIdx, endIdx];
  }, [curPage]);

  const onUpdate = () => {
    setTotal(formedTotal);
  };

  const onDownload = async () => {
    const isSuccess = await batchDownload(entities);
    console.log(isSuccess);
  };

  const renderTokenToolBar = () => {
    return (
      <div className={styles.infoBar}>
        <div className={styles.textContainer}>
          <span>{`Showing `}</span>
          <span className={styles.fontMedium}>{`${startIdx + 1} `}</span>
          <span>{`to `}</span>
          <span className={styles.fontMedium}>{`${endIdx} `}</span>
          <span>{`of `}</span>
          <span className={styles.fontMedium}>{`${total} `}</span>
          <span>{`tokens`}</span>
        </div>

        <div className={styles.downloadIconContainer}>
          <IconButton
            disabled={entities.length === 0}
            color="primary"
            aria-label="download tokens"
            component="label"
            onClick={onDownload}
          >
            <DownloadIcon />
          </IconButton>
        </div>
      </div>
    );
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
          value={formedTotal}
          onChange={(e) => setFormedTotal(parseInt(e.target.value || 0))}
        />
        <Button
          variant="contained"
          disabled={formedTotal === entities.length}
          onClick={onUpdate}
        >
          Update
        </Button>
      </Stack>
    );
  };

  const renderSelectedToken = () => {
    if (!dataURL || curIdx === -1) return null;

    const dna = createDNA(entities[curIdx]);
    return (
      <>
        <Image src={dataURL} width={360} height={360} alt="preview" />
        <div className={styles.dna}>
          <span>{`DNA\n`}</span>
          <span>{createDNA(entities[curIdx])}</span>
        </div>
        {dnaCollection[dna].length !== 1 ? <p>duplicate</p> : null}
      </>
    );
  };

  useEffect(() => {
    if (curIdx === -1) {
      setDataURL("");
      return;
    }

    const entity = entities[curIdx];
    if (cachedDataURL.has(entity)) {
      setDataURL(cachedDataURL.get(entity));
      return;
    }

    convertTo(entity).then((_dataURL) => {
      if (typeof _dataURL === "string") {
        setDataURL(_dataURL);
        cachedDataURL.set(entity, _dataURL);
      }
    });
    return;
  }, [curIdx]);

  useEffect(() => {
    setCurIdx(-1);
    setCurPage(1);
    shuffleEntities(total);
  }, [total]);

  useEffect(() => {
    onUpdate();
  }, []);

  return (
    <Grid className={styles.shufflePanelContainer} container spacing={0}>
      <Grid item xs={"auto"} className={styles.leftContainer}>
        {renderSupplyUpdateRow()}
        {renderSelectedToken()}
      </Grid>
      <Grid item xs className={styles.rightContainer}>
        {renderTokenToolBar()}
        {renderTokenList()}
        {renderTokenPagination()}
      </Grid>
    </Grid>
  );
};

export default ShufflePanel;
