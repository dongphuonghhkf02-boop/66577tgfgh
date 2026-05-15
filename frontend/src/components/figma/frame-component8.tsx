import React from "react";
import styles from "./frame-component8.module.css";

export type FrameComponent8Type = {
  className?: string;
};

/**
 * Section: «Ми не просто виробляємо препарати»
 *
 * Layout per Figma:
 *   ┌─────────────────────────────────────────────────────┐
 *   │ HEADING (1680 wide, fs 82, uppercase)               │
 *   │                              ┌──────────────────┐    │
 *   │                              │ description text │    │
 *   │                              └──────────────────┘    │
 *   ├──────────────────┬──────────────────────────────────┤
 *   │ FIELD + BOTTLES  │   OLIVE-GREEN PANEL              │
 *   │  (838 × 911      │   (3 features stacked,           │
 *   │   composite)     │    cream-coloured text)          │
 *   └──────────────────┴──────────────────────────────────┘
 *
 *   - Bottles area frame:        838 × 911
 *   - Green-panel features frame: 483 × 478 (3 blocks total)
 *   - All feature texts are cream (#F9F7F2)
 */
const FrameComponent8: React.FC<FrameComponent8Type> = ({ className = "" }) => {
  return (
    <section className={[styles.parent, className].join(" ")}>
      {/* ===== Heading ===== */}
      <h1 className={styles.h1}>
        <span className={styles.span}>«Ми не просто виробляємо препарати</span>
        <span className={styles.span2}>
          {" "}
          - ми відновлюємо природний баланс ґрунту та рослин»
        </span>
      </h1>

      {/* ===== Description (right-aligned) ===== */}
      <div className={styles.descriptionRow}>
        <div className={styles.descriptionText}>
          <p className={styles.p}>
            <span>{`Кожен продукт Таміс Агро створений на основі `}</span>
            <b>живих мікроорганізмів</b>
            <span>{`, що працюють у гармонії з природою. `}</span>
            <b>Без агресивної хімії</b>
            <span>{`. Без компромісів з якістю.`}</span>
          </p>
        </div>
      </div>

      {/* ===== Split row: image (left) + green panel (right) ===== */}
      <div className={styles.splitRow}>
        {/* Field background only inside the left pane */}
        <div className={styles.imagePane}>
          <img
            className={styles.imgField}
            src="/image@2x.png"
            alt="Поле пшениці"
          />
        </div>

        {/* Olive-green panel (right half) — features anchored RIGHT, padding-left big enough
            so the bottles composite (which sits centered across the seam) doesn't overlap. */}
        <div className={styles.greenPane}>
          <div className={styles.featureStack}>
            <div className={styles.feature}>
              <div className={styles.featureRow}>
                <img
                  className={styles.featureIcon}
                  src="/icon-leaf.svg"
                  alt=""
                  width={60}
                  height={60}
                />
                <h3 className={styles.featureTitle}>100% органічно</h3>
              </div>
              <p className={styles.featureBody}>
                Біологічний склад без синтетичних компонентів
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureRow}>
                <img
                  className={styles.featureIcon}
                  src="/icon-trending.svg"
                  alt=""
                  width={60}
                  height={60}
                />
                <h3 className={styles.featureTitle}>+30% приріст</h3>
              </div>
              <p className={styles.featureBody}>
                Підвищення врожайності вже у перший сезон
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureRow}>
                <img
                  className={styles.featureIcon}
                  src="/icon-shield.svg"
                  alt=""
                  width={60}
                  height={60}
                />
                <h3 className={styles.featureTitle}>2 роки</h3>
              </div>
              <p className={styles.featureBody}>
                Гарантований термін зберігання препарату
              </p>
            </div>
          </div>
        </div>

        {/* Bottles composite — absolutely positioned ACROSS the split (centered between
            field and green panel). Slightly poking above and below the row. */}
      </div>
    </section>
  );
};

export default FrameComponent8;
