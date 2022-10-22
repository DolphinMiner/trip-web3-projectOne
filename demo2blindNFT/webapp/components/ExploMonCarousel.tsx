import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useRef, useState } from "react";
import classnames from "classnames";

import styles from "../styles/ExploMonCarousel.module.css";

// 各个元素尺寸 用于计算
const ITEM_WIDTH = 120;
const ITEM_LEN = 10;
const TOTAL_WIDTH = ITEM_WIDTH * ITEM_LEN;
const WINDOW_SIZE =  1080;
const OFFSET = TOTAL_WIDTH - WINDOW_SIZE;

const ExploMonCarousel = () => {
  const [bigHeadNumber, setBigHead] = useState(0);
  const [styleMargin, setMargin] = useState(0);

  // 分组展示编号
  const SHOW_GROUP_1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const SHOW_GROUP_2 = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

  // 控制播放的偏移量
  const runningMargin = useRef(0);
  // 1或0控制播放方向
  const runningDirection = useRef(0);
  // 计时指针
  let runner: number;

  useEffect(() => {
    runner = setInterval(() => {
      // 更改偏移
      if (runningDirection.current) {
        runningMargin.current--;
      } else {
        runningMargin.current++;
      }

      // 更改方向
      if (runningMargin.current === 0 && runningDirection.current === 1) {
        runningDirection.current = 0;
      } else if (
        runningMargin.current === OFFSET &&
        runningDirection.current === 0
      ) {
        runningDirection.current = 1;
      }

      // 设置大头像的内容
      const nextBigHead = new Date().getSeconds() % (SHOW_GROUP_1.length + SHOW_GROUP_2.length);
      setBigHead(nextBigHead);

      setMargin(runningMargin.current);
    }, 16);

    // 清空指针 防止内存泄露
    return () => clearInterval(runner);
  }, []);

  const renderItem = (name: number) => {
    return (
      <div
        className={name % 2 ? styles.itemGradientBG1 : styles.itemGradientBG2}
        style={{
          width: ITEM_WIDTH,
          height: ITEM_WIDTH,
        }}
      >
        <img src={`\/${name}.png`} alt={`item${name}`} width={ITEM_WIDTH} />
      </div>
    );
  };

  const renderBigHead = () => {
    return (
      <div
        className={classnames([
          bigHeadNumber % 2 ? styles.itemGradientBG1 : styles.itemGradientBG2,
          `block basis-${ITEM_WIDTH * 2} shrink-0 grow-0`,
        ])}
      >
        <img
          src={`\/${bigHeadNumber}.png`}
          alt={`item${bigHeadNumber}`}
          width={ITEM_WIDTH * 2}
        />
      </div>
    );
  };

  return (
    <div className="flex -ml-16 mt-10 mb-10 shadow-2xl" style={{ width: WINDOW_SIZE }}>
      {renderBigHead()}
      <div className="block overflow-hidden">
        <div
          className="flex"
          style={{ width: TOTAL_WIDTH, marginLeft: -styleMargin }}
        >
          {SHOW_GROUP_1.map((name) => renderItem(name))}
        </div>
        <div
          className="flex"
          style={{ width: TOTAL_WIDTH, marginLeft: -OFFSET + styleMargin }}
        >
          {SHOW_GROUP_2.map((name) => renderItem(name))}
        </div>
      </div>
    </div>
  );
};

export default ExploMonCarousel;
