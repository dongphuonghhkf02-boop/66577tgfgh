# PRD — ТАМІС АГРО (Figma → React/TypeScript вёрстка)

## Контекст
Проект: лендинг + страница товара для агрокомпании **«Торговий Дім ТАМІС АГРО»** (Україна, біорішення для агрокультур).
Исходник: pixel-perfect Figma-export, доставленный пользователем через репозиторий
https://github.com/dongphuonghhkf02-boop/23e234234.

Этап: **верстка** (только фронтенд). Бэкенд — стандартный FARM-шаблон (FastAPI/Mongo), пока не используется.

## Стек
- React 19 + TypeScript + react-router-dom v7
- Craco (поверх react-scripts 5)
- CSS Modules + глобальные CSS-переменные (Figma токены)
- shadcn/ui + Radix + Tailwind (присутствуют, в текущей вёрстке не задействованы — задел на будущее)
- Шрифты: Golos Text, Inter, Commissioner (Google Fonts)

## Страницы
- `/` — `pages/welcome.tsx` (главная)
  - Navbar (логотип ТАМІС АГРО, меню Каталог / Культури / Про нас / Контакти, иконки search/user/cart, CTA «Замовити дзвінок»)
  - Hero «ЧАС БІОРІШЕНЬ НАСТАВ»
  - Mission / Category / How-it-works
  - Block «Біологія замість хімії»
  - CTA / Reviews / About company / Blog / Footer
- `/product` — `pages/desktop1.tsx` (карточка товара «Антистресант ФЛОРЕС / FLORES»)
  - Галерея изображений + основная информация (4.9★, опис, ціна 2 400₴, обʼєм 1/5/10 Л)
  - Вкладки: Опис / Дозування / Склад / Сумісність / Характеристика
  - Logistics, related products carousel, CTA, Footer

## Дизайн-механика
- Фиксированная ширина 1920px, пропорциональное `transform: scale()` для меньших экранов (логика в `App.tsx`).
- Минимальная desktop-ширина 1024px; ниже — горизонтальный скролл (мобильный адаптив пока не реализован — отмечено в коде как TODO).

## Структура файлов
```
frontend/
├── tsconfig.json
├── craco.config.js          # содержит фикс css-loader для url(/file.png) → /public
├── public/                  # 116 файлов: PNG/SVG/JPG из Figma + index.html
└── src/
    ├── App.tsx              # обёртка со scale, роутер
    ├── ScrollToTop.tsx
    ├── index.js
    ├── index.css
    ├── figma-global.css     # переменные дизайн-системы для /product
    ├── welcome-global.css   # переменные для /
    ├── typings.d.ts         # *.css module declarations
    ├── pages/
    │   ├── welcome.tsx + welcome.module.css
    │   └── desktop1.tsx + desktop1.module.css
    └── components/
        ├── figma/           # ~58 компонентов страницы /product
        ├── welcome/         # ~46 компонентов страницы /
        └── ui/              # shadcn/ui (не используется текущей вёрсткой)
```

## Дизайн-токены (Figma → CSS variables)
- `--brand-accent-primary-default: #b3d217` (лайм)
- `--brand-accent-secondary-default: #1b4332` (тёмно-зелёный)
- `--bg-cream: #f9f7f2`, `--bg-card: #fff`
- `--text-black: #2c2c27`, `--text-grey: #93928c`
- `--decorative-1: #f7fae8` (бледно-лаймовый), `--decorative-2: #e7ebe7`

## Что было сделано в фазе аудита/деплоя
1. Локальный `/app` был не синхронизирован с GitHub-репо — содержал только базовый FARM-шаблон. Все ~200 файлов вёрстки и 116 ассетов скопированы из репозитория.
2. Установлен `typescript`, `@types/react`, `@types/react-dom`, `@types/node` через yarn.
3. Удалён конфликтующий `frontend/jsconfig.json` (запрет CRA: `tsconfig` + `jsconfig` вместе).
4. Удалён старый `App.js` / `App.css` шаблона.
5. В `craco.config.js` добавлен патч `css-loader.url.filter`: абсолютные пути `url(/file.png)` теперь не резолвятся как webpack-модули, а отдаются как есть через dev-server из `public/`.
6. Сервисы перезапущены, фронтенд `Compiled successfully`. Проверено скриншотами `/` и `/product` — рендер pixel-perfect.

## Известное / TODO
- Мобильная адаптация отсутствует — придётся делать отдельно (есть пометка в `App.tsx`).
- Pages навигация: вне статичных `Link`-ов навигация между `/` и `/product` ещё не подключена внутри вёрстки (кнопки/карточки не ведут на product page — будет на следующем шаге).
- Бэкенд — пустой шаблон, эндпоинты под формы заказа / корзину / отзывы ещё не созданы.
- Реальная корзина / оформление заказа / API-интеграции — на следующих фазах по запросу пользователя.

## Окружение
- Preview: https://code-review-278.preview.emergentagent.com
- Все сервисы (backend / frontend / mongodb) — RUNNING.
