import React from "react";
import { useMemo, type CSSProperties } from "react";
import Call1 from "./call1";
import styles from "./primary-button1.module.css";

export type PrimaryButton1Type = {
  className?: string;
  prop?: string;
  showCall?: boolean;
  size?: any;

  /** Variant props */
  state?: any;
  type?: any;

  /** Style props */
  primaryButtonPadding?: any;
  primaryButtonWidth?: any;
  primaryButtonHeight?: any;
  primaryButtonFlex?: any;
};

const PrimaryButton1: React.FC<PrimaryButton1Type> = ({
  className = "",
  state = "Default",
  type = "Filled",
  prop,
  showCall,
  primaryButtonPadding,
  primaryButtonWidth,
  primaryButtonHeight,
  primaryButtonFlex,
  size = 24,
}) => {
  const primaryButtonStyle: CSSProperties = useMemo(() => {
    return {
      padding: primaryButtonPadding,
      width: primaryButtonWidth,
      height: primaryButtonHeight,
      flex: primaryButtonFlex,
    };
  }, [
    primaryButtonPadding,
    primaryButtonWidth,
    primaryButtonHeight,
    primaryButtonFlex,
  ]);

  return (
    <button
      className={[styles.primaryButton, className].join(" ")}
      data-state={state}
      data-type={type}
      style={primaryButtonStyle}
    >
      <div className={styles.div}>{prop}</div>
      {!!showCall && <Call1 size={size} />}
    </button>
  );
};

export default PrimaryButton1;
