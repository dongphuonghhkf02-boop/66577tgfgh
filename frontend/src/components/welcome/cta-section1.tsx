import React from "react";
import styles from "./cta-section1.module.css";

export type CtaSection1Type = {
  className?: string;
};

/**
 * Section "Не знайшли ваш препарат?"
 *
 * Card: 1920 × 984, background image (man inspecting corn leaves).
 *
 * Layout (absolute positions per Figma spec):
 *   Title         : top 192, left 149  (2 lines: "НЕ ЗНАЙШЛИ" / "ВАШ ПРЕПАРАТ?")
 *   Subtitle      : 18px below title   (left 149)
 *   Button        : 60px below subtitle (left 149, width 364)
 *   Phone number  : top 610, left 241  (its own absolutely-positioned line)
 *
 * Type tokens:
 *   Title    Golos Text 600 / 82px / 120% / -1px / UPPERCASE / #F9F7F2
 *   Subtitle Golos Text 400 / 28px / 125%                    / #F9F7F2
 *   Button   Golos Text 700 / 18px / 140%, padding 18 16,
 *            bg #1B4332, color #F9F7F2, radius 6
 *
 * Plus a subtle left-side dark gradient overlay over the background so the
 * cream-white type reads cleanly against the bright green field.
 */
const CtaSection1: React.FC<CtaSection1Type> = ({ className = "" }) => {
  return (
    <section
      className={[styles.ctaSection, className].join(" ")}
      data-testid="cta-no-product"
    >
      <img
        className={styles.bg}
        width={1921}
        height={1206}
        alt=""
        src="/image-7@2x.png"
      />
      {/* darken the left half so the headline contrasts cleanly */}
      <div className={styles.darkOverlay} aria-hidden="true" />

      <div className={styles.mainColumn}>
        <h2 className={styles.title}>
          Не знайшли
          <br />
          ваш препарат?
        </h2>
        <p className={styles.subtitle}>
          Ми безкоштовно підберемо схему захисту під вашу культуру.
        </p>
        <button type="button" className={styles.cta} data-testid="cta-consult-btn">
          Отримати консультацію
        </button>
      </div>

      <a
        href="tel:+380509375657"
        className={styles.phone}
        data-testid="cta-phone"
      >
        +380 (50) 937-56-57
      </a>
    </section>
  );
};

export default CtaSection1;
