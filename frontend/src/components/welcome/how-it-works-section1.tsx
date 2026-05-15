import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import CardStep1 from "./card-step1";
import styles from "./how-it-works-section1.module.css";

export type HowItWorksSection1Type = {
  className?: string;
};

/**
 * «Технологія врожаю» — секція з 4-ма стадіями.
 *
 * Pin реалізовано на НАТИВНОМУ `position: sticky` для stickyInner.
 * Це усуває дрижіння (jitter), яке було при JS-translateY-pin'і — нативний
 * sticky обробляється у composiotor-thread браузера й не має лагу від rAF.
 *
 * JS відповідає тільки за анімацію карточок (slide-up + fade) на основі
 * scroll-progress 0..1.
 *
 * Структура:
 *   <section>  ← висота = vh * SCROLL_VH / scale (скрол-бюджет)
 *     <div .stickyInner>  ← position: sticky, top: 0, висота = vh / scale
 *       <leaf .leftColumn .cardsHolder>
 *         <cardSlot×4>  ← z-stack, JS керує transform / opacity / z-index
 *       </cardsHolder>
 *     </stickyInner>
 *   </section>
 */

const N_CARDS = 4;
const SCROLL_VH = 4;
const SLIDE_FROM_DESIGN_PX = 1100;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const HowItWorksSection1: React.FC<HowItWorksSection1Type> = ({
  className = "",
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  /* Висоти в design-px. sticky має займати 1 viewport, а секція — N×VH
     виходячи з реального viewport / scale, щоб скрол-бюджет точно
     відповідав N×VH у viewport-пікселях. */
  const [stickyHeightPx, setStickyHeightPx] = useState<number>(0);
  const [sectionPxHeight, setSectionPxHeight] = useState<number>(0);

  useLayoutEffect(() => {
    const compute = () => {
      const scale = Math.min(
        1,
        Math.max(window.innerWidth, 1024) / 1920
      );
      const vhDesign = window.innerHeight / scale;
      setStickyHeightPx(vhDesign);
      setSectionPxHeight(vhDesign * SCROLL_VH);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      raf = 0;
      const section = sectionRef.current;
      const cardsHolder = cardsRef.current;
      if (!section || !cardsHolder) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionH = rect.height;
      const vh = window.innerHeight;

      const scrolledPx = Math.max(0, -sectionTop);
      const pinTotalPx = Math.max(1, sectionH - vh);
      const progress = clamp01(scrolledPx / pinTotalPx);

      const transitions = N_CARDS - 1; // 3

      const cardEls = cardsHolder.querySelectorAll<HTMLElement>(
        "[data-card-idx]"
      );

      cardEls.forEach((el, i) => {
        if (i === 0) {
          const t1 = clamp01(progress / (1 / transitions));
          const fade = easeOutCubic(t1);
          el.style.transform = "translate3d(0px, 0px, 0px)";
          el.style.opacity = String(1 - fade);
          el.style.visibility = fade < 1 ? "visible" : "hidden";
          el.style.zIndex = "10";
          return;
        }

        const winStart = (i - 1) / transitions;
        const winEnd = i / transitions;
        const localProg = clamp01(
          (progress - winStart) / (winEnd - winStart)
        );

        if (localProg <= 0) {
          el.style.visibility = "hidden";
          el.style.opacity = "0";
          el.style.transform = `translate3d(0px, ${SLIDE_FROM_DESIGN_PX}px, 0px)`;
          el.style.zIndex = String(10 + i * 10);
          return;
        }

        const eased = easeOutCubic(localProg);
        const y = SLIDE_FROM_DESIGN_PX * (1 - eased);

        el.style.visibility = "visible";
        el.style.opacity = String(clamp01(localProg * 2.5));
        el.style.transform = `translate3d(0px, ${y}px, 0px)`;
        el.style.zIndex = String(10 + i * 10);
      });

      /* Fade-out для проміжних карток коли над ними з'являється наступна. */
      cardEls.forEach((el, i) => {
        if (i === 0) return;
        if (i >= N_CARDS - 1) return;
        const winStart = (i - 1) / transitions;
        const winEnd = i / transitions;
        const localProg = clamp01(
          (progress - winStart) / (winEnd - winStart)
        );
        if (localProg < 1) return;

        const nextStart = i / transitions;
        const nextEnd = (i + 1) / transitions;
        const nextProg = clamp01(
          (progress - nextStart) / (nextEnd - nextStart)
        );
        if (nextProg <= 0) return;

        const f = easeOutCubic(nextProg);
        el.style.opacity = String(1 - f);
        el.style.visibility = f < 1 ? "visible" : "hidden";
      });
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(tick);
    };
    const onResize = () => onScroll();

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sectionPxHeight, stickyHeightPx]);

  return (
    <section
      ref={sectionRef}
      style={{ height: sectionPxHeight ? `${sectionPxHeight}px` : "400vh" }}
      className={[styles.howItWorksSection, className].join(" ")}
      data-testid="how-it-works-section"
    >
      <div
        className={styles.stickyInner}
        style={{
          height: stickyHeightPx ? `${stickyHeightPx}px` : "100vh",
        }}
      >
        <img
          className={styles.leaf}
          src="/watermark.svg"
          alt=""
          aria-hidden="true"
        />

        <div className={styles.leftColumn}>
          <h2 className={styles.title}>
            <span className={styles.titleBold}>технологія</span>
            <span>{` `}</span>
            <span className={styles.titleRegular}>врожаю</span>
          </h2>
          <h3 className={styles.subtitle}>
            Від старту насіння до захисту у коморі.
            <br />
            Оберіть технологію, що працює на ваш прибуток.
          </h3>
          <button
            type="button"
            className={styles.ctaButton}
            data-testid="how-it-works-cta"
          >
            <span className={styles.ctaIcon} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className={styles.ctaLabel}>Замовити дзвінок</span>
          </button>
        </div>

        <div ref={cardsRef} className={styles.cardsHolder}>
          <div data-card-idx={0} className={styles.cardSlot}>
            <CardStep1
              stepNumber="01"
              title="Внесення"
              description="Живі мікроорганізми потрапляють на насіння, лист або у ґрунт. Завдяки правильному зберіганню вони перебувають у стані максимальної активності та готові до роботи."
            />
          </div>
          <div data-card-idx={1} className={styles.cardSlot}>
            <CardStep1
              stepNumber="02"
              title="Активація"
              description="У природному середовищі бактерії «прокидаються», миттєво розмножуються та вступають із рослинами у взаємодію, стимулюючи їх природний імунітет."
            />
          </div>
          <div data-card-idx={2} className={styles.cardSlot}>
            <CardStep1
              stepNumber="03"
              title="Захист"
              description="Корисна мікрофлора витісняє хвороби та знищує шкідників без «хімічного стресу» для культури. Рослина розвивається природно і без затримок у рості."
            />
          </div>
          <div data-card-idx={3} className={styles.cardSlot}>
            <CardStep1
              stepNumber="04"
              title="Результат"
              description="Ви отримуєте максимальний врожай без залишків пестицидів. Ґрунт з кожним роком відтворюється, а продукція стає безпечною, якісною та придатною для тривалого зберігання."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection1;
