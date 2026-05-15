import React from "react";
import PrimaryButton1 from "./primary-button1";
import styles from "./cta-section1.module.css";

export type CtaSection1Type = {
  className?: string;
};

const CtaSection1: React.FC<CtaSection1Type> = ({ className = "" }) => {
  return (
    <div className={[styles.ctaSection, className].join(" ")}>
      <img
        className={styles.image7Icon}
        width={1921}
        height={1206}
        alt=""
        src="/image-7@2x.png"
      />
      <div className={styles.mainContant}>
        <div className={styles.headline}>
          <h1 className={styles.h1}>Не знайшли ваш препарат?</h1>
          <h2 className={styles.h2}>
            Ми безкоштовно підберемо схему захисту під вашу культуру.
          </h2>
        </div>
        <div className={styles.buttonGroup}>
          <PrimaryButton1
            state="Default"
            type="Filled"
            prop="Отримати консультацію"
            primaryButtonPadding="18px 16px"
            primaryButtonWidth="364px"
            size="24"
            callHeight="24px"
            callWidth="24px"
          />
          <b className={styles.b}>+380 (50) 937-56-57</b>
        </div>
      </div>
    </div>
  );
};

export default CtaSection1;
