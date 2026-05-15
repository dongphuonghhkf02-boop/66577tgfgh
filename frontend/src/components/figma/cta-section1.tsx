import React from "react";
import PrimaryButton1 from "./primary-button1";
import styles from "./cta-section1.module.css";

export type CtaSection1Type = {
  className?: string;
};

const CtaSection1: React.FC<CtaSection1Type> = ({ className = "" }) => {
  return (
    <section className={[styles.ctaSection, className].join(" ")}>
      <div className={styles.anna50943AModernAgronomistParent}>
        <img
          className={styles.anna50943AModernAgronomistIcon}
          width={1968}
          height={1103}
          alt=""
          src="/anna-50943-A-modern-agronomist-standing-in-a-lush-green-agricul-cf388352-4200-433f-9f6c-95455d39b194-1@2x.png"
        />
        <section className={styles.mainContant}>
          <div className={styles.headline}>
            <h2 className={styles.h2}>Не знайшли ваш препарат?</h2>
            <h1 className={styles.h1}>
              Ми безкоштовно підберемо схему захисту під вашу культуру.
            </h1>
          </div>
          <div className={styles.buttonGroup}>
            <PrimaryButton1
              state="Default"
              type="Filled"
              prop="Отримати консультацію"
              showCall
              primaryButtonPadding="18px 16px"
              primaryButtonWidth="364px"
              primaryButtonHeight="unset"
              primaryButtonFlex="unset"
              size="24"
            />
            <b className={styles.spacer}>+380 (50) 937-56-57</b>
          </div>
        </section>
      </div>
    </section>
  );
};

export default CtaSection1;
