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

const App = () => {
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const [attributes, dispatch] = useReducer(reducer, initialState);

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
      .then(pngBlob => {
        // image
        saveAs(pngBlob, "avatar.png");
        // json
        const jsonBlob = new Blob(
          [JSON.stringify(attributes)],
          {type: "text/plain;charset=utf-8"}
        );
        saveAs(jsonBlob, 'metadata.json');
      })
      .catch(err => {
        console.log('Failed to download', err);
      });
  }

  useEffect(() => {
    onShuffle();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container} ref={avatarRef}>
        <Avatar attributes={attributes} />
      </div>
      <div className={styles.btnContainer}>
        <button onClick={onShuffle}>Shuffle</button>
        <button onClick={onDownload}>Download</button>
      </div>
    </main>
  );
};

export default App;
