import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import CardStep1 from "./card-step1";
import styles from "./how-it-works-section1.module.css";

export type HowItWorksSection1Type = {
  className?: string;
};

/**
 * «Технологія врожаю» — секція з 4-ма стадіями.
 *
 * НОВА анімація (per референс-відео):
 *  ─────────────────────────────────────────────────────────────────────
 *  • Секція ПІНИТЬСЯ через JS-translateY у viewport на час 4×VH скролу.
 *    (position: sticky не використовуємо — батьківський контейнер у
 *    App.tsx має transform:scale(), у якому sticky ненадійний.)
 *  • Усі 4 карточки лежать в одній точці (z-stack) у правій колонці.
 *    Карточка 0 — стартова, видима за замовчуванням.
 *  • При скролі вниз: карточка N (N=1..3) виїздить ЗНИЗУ ВВЕРХ, повністю
 *    перекриваючи попередню карточку. Кожна реалізація відбувається за
 *    1 VH скролу (3VH разом для 3-х переходів + 1VH для першої сцени).
 *  • Карточки мають напівпрозорий фон (rgba .2), тому щоб не було
 *    bleed-through, попередня карточка ВИДАЄТЬСЯ (opacity 1 → 0) синхронно
 *    з тим, як нова насувається. На фінальному localProgress = 1 попередня
 *    повністю прозора, нова — на 100% видима.
 *  • При скролі назад анімація реверсується.
 *  • Ліва колонка (заголовок / підпис / кнопка) — СТАТИЧНА під час pin'у.
 *    Не рухається.
 *  • Після завершення анімації (4VH) секція відпускає скрол.
 *  ─────────────────────────────────────────────────────────────────────
 */

const N_CARDS = 4;
/* Скільки viewport-heights займає секція. 1VH — стан спокою (показ карточки 0)
   + 3VH — по одному на кожен з трьох переходів (slide-in карточок 1, 2, 3). */
const SCROLL_VH = 4;
/* Стартовий offsetY для нової карточки в design-px (мусить бути більше
   за висоту карточки + щось зверху, щоб картку точно не було видно
   до старту її анімації). */
const SLIDE_FROM_DESIGN_PX = 1100;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/* Smooth, природна крива — повільніше біля 1, як на референсі. */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const HowItWorksSection1: React.FC<HowItWorksSection1Type> = ({
  className = "",
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  /* Висота секції рахується від реального viewportH / scale, щоб total scroll
     дорівнював саме N×VH у viewport-пікселях (а не у design-px). */
  const [sectionPxHeight, setSectionPxHeight] = useState<number>(0);

  useLayoutEffect(() => {
    const compute = () => {
      const scale = Math.min(
        1,
        Math.max(window.innerWidth, 1024) / 1920
      );
      // у design-px (CSS px усередині scaled-контейнера)
      const designHeight = (window.innerHeight * SCROLL_VH) / scale;
      setSectionPxHeight(designHeight);
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
      const sticky = stickyRef.current;
      const cardsHolder = cardsRef.current;
      if (!section || !sticky || !cardsHolder) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top; // viewport-px
      const sectionH = rect.height; // viewport-px (real, після scale)
      const vh = window.innerHeight;

      const scale = Math.min(
        1,
        Math.max(window.innerWidth, 1024) / 1920
      );

      /* Прокручено в межах секції (viewport-px). 0 коли вершина секції
         тільки-но дотягнулася до верху viewport'а. */
      const scrolledPx = Math.max(0, -sectionTop);
      /* Скільки реального scroll'у нам потрібно для анімації — від вершини
         секції і поки її низ не зрівняється з низом viewport'а. */
      const pinTotalPx = Math.max(1, sectionH - vh);

      /* Пінимо sticky-контейнер: він фізично знаходиться вгорі секції
         (top: 0), але через translateY ми «прикріплюємо» його до верху
         viewport'а на час pin'у. Усі transform всередині scaled-контейнера
         задаються в design-px → ділимо на scale. */
      const stickyTranslateReal = Math.max(
        0,
        Math.min(scrolledPx, pinTotalPx)
      );
      sticky.style.transform = `translateY(${stickyTranslateReal / scale}px)`;

      /* Прогрес 0..1 на час всієї pin-зони. */
      const progress = clamp01(scrolledPx / pinTotalPx);

      /* 3 transition-вікна: [0, 1/3], [1/3, 2/3], [2/3, 1].
         Картка 0 — завжди в стопці на translateY(0), її opacity тільки
         падає коли в неї «насувається» картка 1. */
      const transitions = N_CARDS - 1; // 3

      const cardEls = cardsHolder.querySelectorAll<HTMLElement>(
        "[data-card-idx]"
      );

      cardEls.forEach((el, i) => {
        if (i === 0) {
          // Базова картка: завжди в позиції, але fade'ається коли над
          // нею з'являється картка 1.
          const t1 = clamp01(progress / (1 / transitions));
          const fade = easeOutCubic(t1);
          el.style.transform = "translateY(0px)";
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
          /* Картка ще не з'явилася — повністю ховаємо. */
          el.style.visibility = "hidden";
          el.style.opacity = "0";
          el.style.transform = `translateY(${SLIDE_FROM_DESIGN_PX}px)`;
          el.style.zIndex = String(10 + i * 10);
          return;
        }

        /* Slide-up: from +SLIDE_FROM (нижче viewport) до 0 (точно
           над попередньою карткою). */
        const eased = easeOutCubic(localProg);
        const y = SLIDE_FROM_DESIGN_PX * (1 - eased);

        el.style.visibility = "visible";
        /* Opacity новонароджуваної картки: повністю прозора при localProg=0,
           full opacity при localProg ~0.4+, щоб уникнути блимання при
           crossfade'і з попередньою. */
        el.style.opacity = String(clamp01(localProg * 2.5));
        el.style.transform = `translateY(${y}px)`;
        el.style.zIndex = String(10 + i * 10);

        /* Якщо нижче по стеку є card i (індекс i), що зараз TOP — її попередня
           (i-1) має зникати. Ми це робимо в ітерації наступного i. Тут же,
           додатково, fade-out для CURRENT card коли над нею з'являється
           наступна. */
        if (i < N_CARDS - 1 && localProg === 1) {
          const nextStart = i / transitions;
          const nextEnd = (i + 1) / transitions;
          const nextProg = clamp01(
            (progress - nextStart) / (nextEnd - nextStart)
          );
          if (nextProg > 0) {
            const f = easeOutCubic(nextProg);
            el.style.opacity = String(1 - f);
            if (f >= 1) el.style.visibility = "hidden";
          }
        }
      });

      /* Окремий прохід — fade-out для middle-карточок коли над ними
         з'являється наступна. (Перевикористовуємо логіку, щоб не залежати
         від localProg === 1 умови.) */
      cardEls.forEach((el, i) => {
        if (i === 0) return; // вже оброблено вище
        if (i >= N_CARDS - 1) return; // в останньої наступної немає
        const winStart = (i - 1) / transitions;
        const winEnd = i / transitions;
        const localProg = clamp01(
          (progress - winStart) / (winEnd - winStart)
        );
        if (localProg < 1) return; // картка ще тільки заїжджає — не чіпаємо

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

    /* Init */
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
      style={{ height: sectionPxHeight ? `${sectionPxHeight}px` : "400vh" }}
      className={[styles.howItWorksSection, className].join(" ")}
      data-testid="how-it-works-section"
    >
      {/* sticky-pinned inner: займає рівно 1 viewport, JS тримає його
          translate'ом у верху viewport'а під час pin'у. */}
      <div ref={stickyRef} className={styles.stickyInner}>
        <img
          className={styles.leaf}
          src="/watermark.svg"
          alt=""
          aria-hidden="true"
        />

        {/* Ліва колонка — СТАТИЧНА всередині pinned inner. */}
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

        {/* Права колонка: 4 картки в одній точці (z-stack). JS управляє
            transform / opacity / visibility / z-index для кожної. */}
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
