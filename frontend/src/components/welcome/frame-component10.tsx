import React from "react";
import styles from "./frame-component10.module.css";

export type FrameComponent10Type = {
  className?: string;
};

const FrameComponent10: React.FC<FrameComponent10Type> = ({
  className = "",
}) => {
  return (
    <div className={[styles.rectangleParent, className].join(" ")}>
      <div className={styles.frameChild} />
      <img
        className={styles.patternIcon}
        width={2571}
        height={1165}
        alt=""
        src="/Pattern.svg"
      />
      <div className={styles.wrapper}>
        <h2 className={styles.h2}>Нам довіряють</h2>
      </div>
      <div className={styles.logo}>
        <div className={styles.screenshot20260211At1252Wrapper}>
          <img
            className={styles.screenshot20260211At1252}
            loading="lazy"
            width={426.1}
            height={161.3}
            alt=""
            src="/Screenshot-2026-02-11-at-12-52-41-1@2x.png"
          />
        </div>
        <div className={styles.screenshot20260211At1252Container}>
          <img
            className={styles.screenshot20260211At12522}
            loading="lazy"
            width={420.5}
            height={151.5}
            alt=""
            src="/Screenshot-2026-02-11-at-12-52-58-1@2x.png"
          />
        </div>
        <div className={styles.screenshot20260211At1252Frame}>
          <img
            className={styles.screenshot20260211At12523}
            loading="lazy"
            width={442}
            height={171.9}
            alt=""
            src="/Screenshot-2026-02-11-at-12-52-46-1@2x.png"
          />
        </div>
        <div className={styles.screenshot20260211At1253Wrapper}>
          <img
            className={styles.screenshot20260211At1253}
            loading="lazy"
            width={442}
            height={173.2}
            alt=""
            src="/Screenshot-2026-02-11-at-12-53-29-1@2x.png"
          />
        </div>
        <div className={styles.screenshot20260211At1253Container}>
          <img
            className={styles.screenshot20260211At12532}
            loading="lazy"
            width={454.5}
            height={152.7}
            alt=""
            src="/Screenshot-2026-02-11-at-12-53-09-1@2x.png"
          />
        </div>
        <div className={styles.screenshot20260211At1252Frame}>
          <img
            className={styles.screenshot20260211At12533}
            loading="lazy"
            width={432.5}
            height={167.9}
            alt=""
            src="/Screenshot-2026-02-11-at-12-53-04-1@2x.png"
          />
        </div>
        <div className={styles.screenshot20260211At1253Container}>
          <img
            className={styles.screenshot20260211At12524}
            loading="lazy"
            width={453}
            height={152.5}
            alt=""
            src="/Screenshot-2026-02-11-at-12-52-52-1@2x.png"
          />
        </div>
      </div>
    </div>
  );
};

export default FrameComponent10;
