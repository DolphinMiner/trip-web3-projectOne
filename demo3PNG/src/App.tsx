import Image from "next/image";
import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "./App.module.css";
import { toPng } from "html-to-image";
import Avatar from "./components/Avatar";
import pngSource from "./png";
import { Attributes, LayerName } from "./types";
import { Action, initialState, reducer } from "./reducer/attributes";
import { shuffle } from "./utils";
import { saveAs } from "file-saver";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import ShufflePanel from "./components/ShufflePanel";

const App = () => {
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const [attributes, dispatch] = useReducer(reducer, initialState);
  const [selectedPanel, setSelectedPanel] = useState<"patch" | "shuffle">(
    "patch"
  );

  const onShuffle = () => {
    const payload = shuffle();
    dispatch({
      type: "update",
      payload,
    });
  };

  const onDownload = () => {
    if (!window || !avatarRef.current) {
      return;
    }
    toPng(avatarRef.current)
      .then((pngBlob) => {
        // image
        saveAs(pngBlob, "avatar.png");
        // json
        const jsonBlob = new Blob([JSON.stringify(attributes)], {
          type: "text/plain;charset=utf-8",
        });
        saveAs(jsonBlob, "metadata.json");
      })
      .catch((err) => {
        console.log("Failed to download", err);
      });
  };

  useEffect(() => {
    onShuffle();
  }, []);

  const renderPatchPanel = () => {
    return (
      <>
        <div className={styles.container} ref={avatarRef}>
          <Avatar attributes={attributes} />
        </div>
        <div className={styles.btnContainer}>
          <Button variant="contained" onClick={onShuffle}>
            Shuffle
          </Button>
          <Button variant="contained" onClick={onDownload}>
            Download
          </Button>
        </div>
      </>
    );
  };

  const renderShufflePanel = () => {
    return <ShufflePanel />;
  };

  return (
    <main className={styles.main}>
      <div className={styles.headerButtonGroup}>
        <ButtonGroup variant="contained">
          <Button
            disabled={selectedPanel === "patch"}
            onClick={() => setSelectedPanel("patch")}
            variant={selectedPanel === "patch" ? "outlined" : "contained"}
          >
            手动组合
          </Button>
          <Button
            disabled={selectedPanel === "shuffle"}
            onClick={() => setSelectedPanel("shuffle")}
            variant={selectedPanel === "shuffle" ? "outlined" : "contained"}
          >
            批量生成
          </Button>
        </ButtonGroup>
      </div>

      <div className={styles.panelBox}>
        {selectedPanel === "patch" ? renderPatchPanel() : renderShufflePanel()}
      </div>
    </main>
  );
};

export default App;
