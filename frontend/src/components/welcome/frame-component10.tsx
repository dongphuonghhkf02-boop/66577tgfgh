import React from "react";
import styles from "./frame-component10.module.css";

export type FrameComponent10Type = {
  className?: string;
};

/**
 * Section "Нам довіряють"
 *
 * Spec (Figma):
 *   - block: 1920 × 1176, background #F9F7F2
 *   - title: Golos Text SemiBold 82px, color #2C2C27, line-height 120%,
 *            letter-spacing -1px, uppercase
 *   - title position: top 152px, left margin 609 / right margin 609 (centered)
 *   - logos: rendered WITHOUT the rectangular white card behind them
 *            (the original PNG screenshots had a white card baked-in — we
 *             pre-processed them in /public to PNG-with-transparency, files
 *             named `*-clean.png`).
 *
 * Logo layout (3 cols × 3 rows):
 *   row 1:  НІБУЛОН       |  KERNEL          |  ЕПІЦЕНТР АГРО
 *   row 2:  ТОВ "Бургуджи" |  ТОВ «Агро-Південь» |  МХП
 *   row 3:  АГРОФИРМА КОРНАЦКИХ  |  (empty)  |  (empty)
 */
const FrameComponent10: React.FC<FrameComponent10Type> = ({
  className = "",
}) => {
  return (
    <section
      className={[styles.section, className].join(" ")}
      data-testid="trust-section"
    >
      <h2 className={styles.title}>Нам довіряють</h2>

      <div className={styles.grid}>
        {/* row 1 */}
        <div className={`${styles.cell} ${styles.cellLogo}`}>
          <img
            src="/Screenshot-2026-02-11-at-12-52-41-1@2x-clean.png"
            alt="Нібулон"
            loading="lazy"
            className={styles.logoNibulon}
          />
        </div>
        <div className={`${styles.cell} ${styles.cellLogo}`}>
          <img
            src="/Screenshot-2026-02-11-at-12-52-58-1@2x-clean.png"
            alt="Kernel"
            loading="lazy"
            className={styles.logoKernel}
          />
        </div>
        <div className={`${styles.cell} ${styles.cellLogo}`}>
          <img
            src="/Screenshot-2026-02-11-at-12-52-46-1@2x-clean.png"
            alt="Епіцентр Агро"
            loading="lazy"
            className={styles.logoEpicentr}
          />
        </div>

        {/* row 2 */}
        <div className={`${styles.cell} ${styles.cellText}`}>
          <img
            src="/Screenshot-2026-02-11-at-12-53-29-1@2x-clean.png"
            alt={`ТОВ "Бургуджи"`}
            loading="lazy"
            className={styles.logoBurgudzhi}
          />
        </div>
        <div className={`${styles.cell} ${styles.cellText}`}>
          <img
            src="/Screenshot-2026-02-11-at-12-53-09-1@2x-clean.png"
            alt="ТОВ Агро-Південь"
            loading="lazy"
            className={styles.logoAgroPivden}
          />
        </div>
        <div className={`${styles.cell} ${styles.cellLogo}`}>
          <img
            src="/Screenshot-2026-02-11-at-12-53-04-1@2x-clean.png"
            alt="МХП"
            loading="lazy"
            className={styles.logoMhp}
          />
        </div>

        {/* row 3: only left column has Агрофирма Корнацких */}
        <div className={`${styles.cell} ${styles.cellText}`}>
          <img
            src="/Screenshot-2026-02-11-at-12-52-52-1@2x-clean.png"
            alt="Агрофирма Корнацких"
            loading="lazy"
            className={styles.logoKornackih}
          />
        </div>
        <div className={styles.cell} aria-hidden="true" />
        <div className={styles.cell} aria-hidden="true" />
      </div>
    </section>
  );
};

export default FrameComponent10;
