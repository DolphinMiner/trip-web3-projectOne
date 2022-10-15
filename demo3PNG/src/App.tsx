import Image from "next/image";
import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "./App.module.css";
import Avatar from "./components/Avatar";
import { Attributes, LayerName } from "./types";
import { download, shuffle } from "./utils";
import configs from "./configs";
import useAvatar from "./hooks/useAvatar";

const App = () => {
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const { attributes, setAttributes } = useAvatar();

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

  return (
    <main className={styles.main}>
      <div className={styles.container} ref={avatarRef}>
        <Avatar
          source={configs.pngSource}
          layers={configs.layers}
          attributes={attributes}
        />
      </div>
      <div className={styles.btnContainer}>
        <button onClick={onShuffle}>Shuffle</button>
        <button onClick={onDownload}>Download</button>
      </div>
    </main>
  );
};

export default App;
