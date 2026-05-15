import React from "react";
import { useMemo, type CSSProperties } from "react";
import Call1 from "./call1";
import styles from "./primary-button1.module.css";

export type PrimaryButton1Type = {
  className?: string;
  prop?: string;
  size?: any;
  callHeight?: any;
  callWidth?: any;

  /** Variant props */
  state?: any;
  type?: any;

  /** Style props */
  primaryButtonPadding?: any;
  primaryButtonWidth?: any;
};

const PrimaryButton1: React.FC<PrimaryButton1Type> = ({
  className = "",
  state = "Default",
  type = "Filled",
  prop,
  primaryButtonPadding,
  primaryButtonWidth,
  size = 20,
  callHeight,
  callWidth,
}) => {
  const primaryButtonStyle: CSSProperties = useMemo(() => {
    return {
      padding: primaryButtonPadding,
      width: primaryButtonWidth,
    };
  }, [primaryButtonPadding, primaryButtonWidth]);

  return (
    <button
      className={[styles.primaryButton, className].join(" ")}
      data-state={state}
      data-type={type}
      style={primaryButtonStyle}
    >
      <div className={styles.div}>{prop}</div>
      <Call1 size={size} callHeight={callHeight} callWidth={callWidth} />
    </button>
  );
};

export default PrimaryButton1;
