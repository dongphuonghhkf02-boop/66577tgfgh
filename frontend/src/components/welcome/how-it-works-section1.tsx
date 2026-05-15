import React, { useEffect, useRef } from "react";
import CardStep1 from "./card-step1";
import styles from "./how-it-works-section1.module.css";

export type HowItWorksSection1Type = {
  className?: string;
};

/**
 * «Технологія врожаю» — секция с 4 этапами работы биопрепаратов.
 *
 * Спека: /app/design_guidelines.md
 *
 * Поведение по требованию пользователя:
 *  - Title / subtitle / button — СТАТИЧНЫЕ.  Никакого JS-translate.
 *    Они отрисовываются на своих местах и просто скроллятся с пагой.
 *  - Карточки (640×340, OPAQUE cream) — единственный элемент с
 *    scroll-driven анимацией. Начальное состояние: сложены в стопку
 *    (STACK_PEEK = 22 px между ними).  При скролле — разворачиваются
 *    (CARD_OFFSET = 104 px между ними), как сдача игральных карт.
 *  - Лёгкий rotation (< 1°) и scale (< 2.4%) добавляют ощущение
 *    физических playing-cards.  z-index порядок: card 01 (top) → 04
 *    (deepest, z: 40 / 30 / 20 / 10).
 */

/* Высота секции в design-px (1920-canvas) — даёт scroll-room под анимацию. */
const TOTAL_HEIGHT = 2200;
/* Stack-state: карточки сдвинуты на 80 px каждая (минимальный overlap,
   peek 80 px ниже предыдущей карточки видим как «деку карт»). */
const STACK_PEEK = 80;
/* Spread-state: 412 px = 399 height + 13 gap → натуральный design layout
   БЕЗ overlap'а (карточки стоят вертикально, как на оригинальном скриншоте). */
const CARD_OFFSET = 412;
/* Микро-эффекты для playing-card feel ВЫКЛЮЧЕНЫ — пользователь хочет
   нативный Figma-дизайн карточек без изменений. */
const ROTATIONS_DEG = [0, 0, 0, 0];
const SCALES = [1.0, 1.0, 1.0, 1.0];

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

const HowItWorksSection1: React.FC<HowItWorksSection1Type> = ({
  className = "",
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      raf = 0;
      const section = sectionRef.current;
      const cardsCol = cardsRef.current;
      if (!section || !cardsCol) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top; // viewport-px
      const sectionH = rect.height; // viewport-px (после scale)
      const viewportH = window.innerHeight;

      /* Scale: соответствует transform:scale из App.tsx. */
      const scale = Math.min(
        1,
        Math.max(window.innerWidth, 1024) / 1920,
      );

      /* Scroll progress 0..1: 0 пока секция только что зашла, 1 когда
         мы прокрутили большую её часть. */
      const scrolledIntoSection = -sectionTop;
      const maxScroll = Math.max(1, sectionH - viewportH * 0.4);
      const raw = scrolledIntoSection / maxScroll;
      const progress = Math.max(0, Math.min(1, raw));
      const eased = easeOutQuart(progress);

      /* PIN cardsColumn (только её, не leftColumn).
         Перемещаем translateY так, чтобы стек оставался в viewport,
         пока проигрывается анимация.  Когда секция уходит — отпускаем. */
      if (scrolledIntoSection > 0) {
        const colHeightVp = cardsCol.offsetHeight * scale;
        const maxTranslateVp = Math.max(0, sectionH - colHeightVp - 80 * scale);
        const translateVp = Math.max(
          0,
          Math.min(scrolledIntoSection, maxTranslateVp),
        );
        cardsCol.style.transform = `translateY(${translateVp / scale}px)`;
      } else {
        cardsCol.style.transform = "translateY(0px)";
      }

      /* CARDS: параллельная анимация всех 4-х.
         translateY  : i * lerp(STACK_PEEK → CARD_OFFSET, eased)
         rotate      : lerp(ROTATION[i] → 0, eased)
         scale       : lerp(SCALES[i]   → 1, eased)
         z-index     : фиксированный (card 01 всегда сверху). */
      const cards = cardsCol.querySelectorAll<HTMLElement>("section");
      cards.forEach((card, i) => {
        const offset = STACK_PEEK + (CARD_OFFSET - STACK_PEEK) * eased;
        const y = i * offset;
        const rot = ROTATIONS_DEG[i] * (1 - eased);
        const sc = SCALES[i] + (1 - SCALES[i]) * eased;
        card.style.transform =
          `translateY(${y}px) rotate(${rot}deg) scale(${sc})`;
        card.style.transformOrigin = "50% 0%";
        card.style.zIndex = String(40 - i * 10);
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
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ minHeight: `${TOTAL_HEIGHT}px` }}
      className={[styles.howItWorksSection, className].join(" ")}
      data-testid="how-it-works-section"
    >
      {/* ОДИН большой декоративный лист на фоне. */}
      <img
        className={styles.leaf}
        src="/watermark.svg"
        alt=""
        aria-hidden="true"
      />

      {/* Левая колонка — СТАТИЧНАЯ.  Никакого pin / translateY. */}
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

      {/* Правая колонка: 4 карточки 640×340 (OPAQUE). JS управляет transform. */}
      <div ref={cardsRef} className={styles.cardsColumn}>
        <CardStep1
          stepNumber="01"
          title="Внесення"
          description="Живі мікроорганізми потрапляють на насіння, лист або у ґрунт. Завдяки правильному зберіганню вони перебувають у стані максимальної активності та готові до роботи."
        />
        <CardStep1
          stepNumber="02"
          title="Активація"
          description="У природному середовищі бактерії «прокидаються», миттєво розмножуються та вступають із рослинами у взаємодію, стимулюючи їх природний імунітет."
        />
        <CardStep1
          stepNumber="03"
          title="Захист"
          description="Корисна мікрофлора витісняє хвороби та знищує шкідників без «хімічного стресу» для культури. Рослина розвивається природно і без затримок у рості."
        />
        <CardStep1
          stepNumber="04"
          title="Результат"
          description="Ви отримуєте максимальний врожай без залишків пестицидів. Ґрунт з кожним роком відтворюється, а продукція стає безпечною, якісною та придатною для тривалого зберігання."
        />
      </div>
    </section>
  );
};

export default HowItWorksSection1;
