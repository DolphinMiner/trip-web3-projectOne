import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "./App.module.css";
import Avatar from "./components/Avatar";
import { download, shuffle } from "./utils";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import ShufflePanel from "./components/ShufflePanel";
import configs from "./configs";
import useAvatar from "./hooks/useAvatar";

const App = () => {
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const { attributes, setAttributes } = useAvatar();
  const [selectedPanel, setSelectedPanel] = useState<"patch" | "shuffle">(
    "patch"
  );

  const onShuffle = () => {
    const payload = shuffle();
    setAttributes(payload);
    console.log(payload);
  };

  const onDownload = () => {
    if (!avatarRef.current) {
      return;
    }
    download(attributes, avatarRef.current);
  };

  useEffect(() => {
    onShuffle();
  }, []);

  const renderPatchPanel = () => {
    return (
      <div className={styles.container}>
        <div className={styles.avatarContainer} ref={avatarRef}>
          <Avatar
            source={configs.pngSource}
            layers={configs.layers}
            attributes={attributes}
          />
        </div>
        <div className={styles.btnContainer}>
          <Button variant="contained" onClick={onShuffle}>
            Shuffle
          </Button>
          <Button variant="contained" onClick={onDownload}>
            Download
          </Button>
        </div>
      </div>
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
