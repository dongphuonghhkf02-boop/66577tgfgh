import React from "react";
import styles from "./footer-container1.module.css";

export type FooterContainer1Type = {
  className?: string;
};

const FooterContainer1: React.FC<FooterContainer1Type> = ({
  className = "",
}) => {
  return (
    <div className={[styles.footerContainer, className].join(" ")}>
      <div className={styles.mainRow}>
        <img
          className={styles.logoIcon}
          width={366}
          height={261}
          alt=""
          src="/logo@2x.png"
        />
        <div className={styles.colum}>
          <div className={styles.navColumn}>
            <b className={styles.b}>Нашим клієнтам:</b>
            <div className={styles.navLinks}>
              <div className={styles.div}>Товари та послуги</div>
              <div className={styles.div}>Про нас</div>
              <div className={styles.div}>Блог</div>
              <div className={styles.div}>Повернення товару</div>
            </div>
          </div>
          <div className={styles.navColumn}>
            <b className={styles.b}>Наша адреса:</b>
            <div className={styles.b}>
              55200, м. Первомайськ,
              <br />
              вул. Київська 135
              <br />
              Миколаївська область
            </div>
          </div>
          <div className={styles.navColumn}>
            <b className={styles.b}>Контакти:</b>
            <div className={styles.b}>
              050 937 56 57
              <br />
              067 510 13 07
              <br />
              tamisagro@gmail.com
            </div>
          </div>
        </div>
      </div>
      <div className={styles.copyrightContainer}>
        <div className={styles.copyrightInner}>
          <img
            className={styles.antDesigncopyrightCircleOuIcon}
            loading="lazy"
            width={18}
            height={18}
            alt=""
            src="/ant-design-copyright-circle-outlined.svg"
          />
          <div className={styles.div6}>2026. Всі права захищено</div>
        </div>
      </div>
    </div>
  );
};

export default FooterContainer1;
