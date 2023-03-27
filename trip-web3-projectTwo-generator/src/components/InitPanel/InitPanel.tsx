import { useState } from "react";
import styles from "./InitPanel.module.css";

export type InitPanelProps = {
  projectName: string;
  onProjectNameChange: (v: string) => void;
  totalSupply: number;
  onTotalSupplyChange: (v: number) => void;
};

export default function InitPanel({
  projectName,
  onProjectNameChange,
  totalSupply,
  onTotalSupplyChange,
}: InitPanelProps) {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="projectName">
          Project Name
        </label>
        <input
          className={styles.input}
          id="projectName"
          type="text"
          value={projectName}
          onChange={(e) => {
            onProjectNameChange(e.target.value);
          }}
        />
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="totalSupply">
          Total Supply
        </label>
        <input
          className={styles.input}
          id="totalSupply"
          type="number"
          value={totalSupply}
          onChange={(e) => {
            onTotalSupplyChange(parseInt(e.target.value || '0'));
          }}
        />
      </div>
    </div>
  );
}
