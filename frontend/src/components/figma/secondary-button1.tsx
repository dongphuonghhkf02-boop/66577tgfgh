import React from "react";
import { useMemo, type CSSProperties } from "react";
import Call1 from "./call1";
import styles from "./secondary-button1.module.css";

export type SecondaryButton1Type = {
  className?: string;
  prop?: string;
  showIcon?: boolean;
  size?: any;

  /** Variant props */
  state?: any;
  type?: any;

  /** Style props */
  secondaryButtonHeight?: any;
  secondaryButtonWidth?: any;
  secondaryButtonAlignSelf?: any;
};

const SecondaryButton1: React.FC<SecondaryButton1Type> = ({
  className = "",
  state = "Default",
  type = "Filled",
  prop,
  showIcon = true,
  secondaryButtonHeight,
  secondaryButtonWidth,
  secondaryButtonAlignSelf,
  size = 24,
}) => {
  const secondaryButtonStyle: CSSProperties = useMemo(() => {
    return {
      height: secondaryButtonHeight,
      width: secondaryButtonWidth,
      alignSelf: secondaryButtonAlignSelf,
    };
  }, [secondaryButtonHeight, secondaryButtonWidth, secondaryButtonAlignSelf]);

  return (
    <button
      className={[styles.secondaryButton, className].join(" ")}
      data-state={state}
      data-type={type}
      style={secondaryButtonStyle}
    >
      {!!showIcon && <Call1 size={size} />}
      <div className={styles.div}>{prop}</div>
    </button>
  );
};

export default SecondaryButton1;
