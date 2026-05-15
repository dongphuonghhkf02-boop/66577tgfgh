import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./figma-global.css";
import "./welcome-global.css";
import Desktop1 from "./pages/desktop1";
import Welcome from "./pages/welcome";
import ScrollToTop from "./ScrollToTop";

/**
 * Дизайн Figma зафиксирован на ширине 1920px.
 * Чтобы страница оставалась pixel-perfect на любом мониторе/ноутбуке,
 * мы рендерим её всегда в 1920px и пропорционально масштабируем
 * (CSS transform: scale) под фактическую ширину окна.
 *
 *   - viewport >= 1920  → scale = 1     (родной размер)
 *   - viewport  < 1920  → scale < 1     (равномерное уменьшение)
 *   - viewport  < 1024  → scale зафиксирован (мобильный адаптив будет отдельно)
 *
 * Высота внешнего контейнера пересчитывается = scale * realHeight, чтобы
 * не оставалось пустоты под страницей и не появлялся вертикальный «сдвиг».
 */
const DESIGN_WIDTH = 1920;
const MIN_DESKTOP_WIDTH = 1024;

const App: React.FC = () => {
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [outerHeight, setOuterHeight] = useState<number>(0);

  // Расчёт scale + высоты — пересчитываем при resize окна и при изменении
  // размеров содержимого (например, поздняя загрузка картинок).
  useLayoutEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const effective = Math.max(vw, MIN_DESKTOP_WIDTH);
      const s = Math.min(1, effective / DESIGN_WIDTH);
      const inner = innerRef.current;
      const realH = inner ? inner.offsetHeight : 0;
      setScale(s);
      setOuterHeight(realH * s);
    };

    compute();

    window.addEventListener("resize", compute);

    let ro: ResizeObserver | undefined;
    if (innerRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => compute());
      ro.observe(innerRef.current);
    }

    // Также пересчитать после полной загрузки картинок
    const onLoad = () => compute();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("load", onLoad);
      ro?.disconnect();
    };
  }, []);

  // Пока vw < 1024 — пользователь увидит горизонтальный скролл
  // (мобильный адаптив будет добавлен отдельно).
  return (
    <div
      style={{
        width: "100%",
        height: outerHeight ? `${outerHeight}px` : "auto",
        // overflow:clip — клипает scaled-контент по бокам, но НЕ создаёт
        // scroll-context, чтобы position:sticky внутри страниц работал
        // (например, scroll-driven анимация cards-stack).
        overflow: "clip",
      }}
    >
      <div
        ref={innerRef}
        style={{
          width: `${DESIGN_WIDTH}px`,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          willChange: "transform",
        }}
      >
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/product" element={<Desktop1 />} />
            <Route path="*" element={<Welcome />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

// useEffect explicitly imported just to satisfy CRA's strict-mode unused warnings.
// (kept on purpose — useEffect can be useful for future hooks)
void useEffect;

export default App;
