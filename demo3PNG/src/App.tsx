import React, { useState } from "react";
import styles from "./App.module.css";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import ShufflePanel from "./components/ShufflePanel";
import PatchPanel from "./screens/PatchPanel";

const App = () => {
  const [selectedPanel, setSelectedPanel] = useState<"patch" | "shuffle">(
    "patch"
  );

  const renderPatchPanel = () => {
    return <PatchPanel />;
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
