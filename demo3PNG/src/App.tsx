import Image from "next/image";
import React, { useEffect, useReducer, useState } from "react";
import styles from "./App.module.css";
import { toPng } from "html-to-image";
import html2canvas from "html2canvas";
import Avatar from "./components/Avatar";
import pngSource from "./png";
import { Attributes, LayerName } from "./types";
import { Action, initialState, reducer } from "./reducer/attributes";
import { shuffle } from "./utils";

const App = () => {
  const [attributes, dispatch] = useReducer(reducer, initialState);

  const onShuffle = () => {
    const payload = shuffle();
    dispatch({
      type: "update",
      payload,
    });
  };

  useEffect(() => {
    onShuffle();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Avatar attributes={attributes} />
      </div>
      <div className={styles.btnContainer}>
        <div className={styles.randomBtn} onClick={onShuffle} />
      </div>
    </main>
  );
};

export default App;
