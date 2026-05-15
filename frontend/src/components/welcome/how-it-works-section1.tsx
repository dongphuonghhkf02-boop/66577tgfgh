import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import CardStep1 from "./card-step1";
import styles from "./how-it-works-section1.module.css";

export type HowItWorksSection1Type = {
  className?: string;
};

/**
 * «Технологія врожаю» — секція з 4-ма стадіями.
 *
 * Логіка:
 *  • Зелена панель (stickyInner) — 600 design-px заввишки, пінитьcя через
 *    нативний `position: sticky` (без JS-translate → без дрижіння).
 *  • Sectionʼс height = 600 + 3×VH/scale → дає 3 viewport-висоти скрол-бюджету
 *    (по 1VH на кожен з 3-х переходів між 4-ма картками).
 *  • Картки лежать у z-stack, нова виїздить ЗНИЗУ, повністю замінює попередню.
 *  • Без фейдів-крос-фейдів: попередня картка миттєво ховається (`visibility:
 *    hidden`) щойно нова стала на місце — це усуває «мерехтіння» від
 *    напівпрозорого фону (rgba .2) накладеного один на одного.
 */

const N_CARDS = 4;
const SCROLL_PIN_VH = 3; // 3 transitions × 1VH each
const STICKY_HEIGHT_DESIGN = 600; // ~600px зелена панель за вимогою
const SLIDE_FROM_DESIGN_PX = 700; // звідки виїздить нова картка (нижче панелі)

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const HowItWorksSection1: React.FC<HowItWorksSection1Type> = ({
  className = "",
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  /* sectionPxHeight (design-px) = stickyHeight + 3 viewport-heights / scale */
  const [sectionPxHeight, setSectionPxHeight] = useState<number>(0);

  useLayoutEffect(() => {
    const compute = () => {
      const scale = Math.min(
        1,
        Math.max(window.innerWidth, 1024) / 1920
      );
      const vhDesign = window.innerHeight / scale;
      setSectionPxHeight(STICKY_HEIGHT_DESIGN + SCROLL_PIN_VH * vhDesign);
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
      const vh = window.innerHeight;

      /* Progress 0..1 над зоною pin'у (SCROLL_PIN_VH viewport-heights у real-px). */
      const scrolledPx = Math.max(0, -sectionTop);
      const pinTotalPx = Math.max(1, SCROLL_PIN_VH * vh);
      const progress = clamp01(scrolledPx / pinTotalPx);

      const transitions = N_CARDS - 1; // 3

      const cardEls = cardsHolder.querySelectorAll<HTMLElement>(
        "[data-card-idx]"
      );

      /* Знаходимо «активну» картку: ту, яка зараз ВЕРХНЯ у стопці.
         Активний індекс = floor(progress * transitions) для transitions=3:
           progress < 1/3   → активна 0 (показуємо card[0], card[1] виїздить)
           progress < 2/3   → активна 1
           progress < 1     → активна 2
           progress = 1     → активна 3
       */
      const activeIdx = Math.min(
        N_CARDS - 1,
        Math.floor(progress * transitions + 1e-6)
      );

      cardEls.forEach((el, i) => {
        if (i < activeIdx) {
          /* Усі попередні картки — повністю приховані. Жодного фейду,
             жодного накладання → жодного «мерехтіння» від rgba .2 фону. */
          el.style.visibility = "hidden";
          el.style.opacity = "0";
          el.style.transform = "translate3d(0, 0, 0)";
          el.style.zIndex = String(i + 1);
          return;
        }

        if (i === activeIdx) {
          /* Активна картка: за замовчуванням на місці (y=0). Але якщо
             це не нульова — і прогрес ще не досяг її reveal-точки повністю
             (через округлення Math.floor + epsilon), вона може ще проходити
             slide-up. Обчислимо локальний прогрес активної картки. */
          if (i === 0) {
            el.style.visibility = "visible";
            el.style.opacity = "1";
            el.style.transform = "translate3d(0, 0, 0)";
            el.style.zIndex = String(i + 10);
            return;
          }
          const winStart = (i - 1) / transitions;
          const winEnd = i / transitions;
          const localProg = clamp01(
            (progress - winStart) / (winEnd - winStart)
          );
          const eased = easeOutCubic(localProg);
          const y = SLIDE_FROM_DESIGN_PX * (1 - eased);
          el.style.visibility = "visible";
          el.style.opacity = "1";
          el.style.transform = `translate3d(0, ${y}px, 0)`;
          el.style.zIndex = String(i + 10);
          return;
        }

        /* i > activeIdx — наступні картки, ще під низом, не видно. */
        el.style.visibility = "hidden";
        el.style.opacity = "0";
        el.style.transform = `translate3d(0, ${SLIDE_FROM_DESIGN_PX}px, 0)`;
        el.style.zIndex = String(i + 1);
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
  }, [sectionPxHeight]);

  return (
    <section
      ref={sectionRef}
      style={{ height: sectionPxHeight ? `${sectionPxHeight}px` : "300vh" }}
      className={[styles.howItWorksSection, className].join(" ")}
      data-testid="how-it-works-section"
    >
      <div className={styles.stickyInner}>
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
