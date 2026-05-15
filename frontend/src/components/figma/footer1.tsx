import React from "react";
import { type CSSProperties } from "react";
import FooterContainer1 from "./footer-container1";
import styles from "./footer1.module.css";

export type Footer1Type = {
  className?: string;

  /** Variant props */
  device?: any;
};

const Footer1: React.FC<Footer1Type> = ({
  className = "",
  device = "Desktop",
}) => {
  return (
    <footer
      className={[styles.footer, className].join(" ")}
      data-device={device}
    >
      <div className={styles.background} />
      <FooterContainer1 />
      <div className={styles.socialLinks}>
        <div className={styles.socialWrapper}>
          <div className={styles.socialInner}>
            <b className={styles.b}>Ми в соціальних мережах :</b>
            <div className={styles.iconsRow}>
              <img
                className={styles.groupIcon}
                loading="lazy"
                width={32}
                height={32}
                alt=""
                src="/Group.svg"
              />
              <img
                className={styles.groupIcon2}
                width={32}
                height={32}
                alt=""
                src="/Group.svg"
              />
            </div>
          </div>
          <div className={styles.wwwolhalazarievacom}>
            {`Сайт створено - `}
            <span className={styles.wwwolhalazarievacom2}>
              www.olhalazarieva.com
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer1;
