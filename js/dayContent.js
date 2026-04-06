// Контент "дня": факт, картинка и цитата.

(() => {
  const FACTS = [
  "Вода расширяется при замерзании — поэтому лёд плавает.",
  "Бананы — ягоды, а клубника — не ягода ботанически.",
  "Самая высокая гора на Земле — Эверест — растёт на несколько миллиметров в год.",
  "Школьники запоминают лучше, если делают небольшие перерывы каждые 20–30 минут.",
  "В космосе нет звука: мы слышим звук только благодаря среде (воздуху).",
  "Свет от Солнца до Земли идёт примерно 8 минут 20 секунд.",
  "Отпечатки пальцев уникальны: у каждого человека — свой узор.",
  "Некоторые животные “видят” инфракрасный свет (например, питоны).",
  "Мозг тратит много энергии даже во сне.",
  "Самая быстрая рыба — парусник — может развивать очень высокие скорости.",
  "Тёплый хлеб пахнет вкуснее холодного — это химия и обоняние.",
  "Цвета влияют на настроение: именно поэтому дизайн бывает “успокаивающим”.",
  ];

  const QUOTES = [
  "Таймер не ругает — он просто напоминает: время идёт.",
  "Смешной секрет: начни — и мотивация найдёт тебя по дороге.",
  "Не нужно быть идеальным. Нужно просто продолжать.",
  "План есть — значит, есть и путь.",
  "Сегодня сделай маленькое дело, которое приблизит цель.",
  "Упорство побеждает вдохновение, когда вдохновение уходит.",
  "Ты справишься. Просто начни.",
  "Маленькие победы складываются в большие результаты.",
  "Главное — не скорость, а направление.",
  ];

  const IMAGES = [
    {
      caption: "Огоньки праздника",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#7c3aed" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#22c55e" stop-opacity="0.85"/>
    </linearGradient>
    <radialGradient id="r" cx="30%" cy="20%" r="70%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="900" height="600" rx="28" fill="#0b1020"/>
  <rect x="28" y="28" width="844" height="544" rx="24" fill="url(#g)" opacity="0.25"/>
  <rect x="28" y="28" width="844" height="544" rx="24" fill="url(#r)"/>
  <g fill="#fff" opacity="0.9">
    <circle cx="160" cy="180" r="10"/><circle cx="220" cy="120" r="6"/><circle cx="290" cy="200" r="8"/>
    <circle cx="740" cy="140" r="7"/><circle cx="780" cy="210" r="10"/><circle cx="690" cy="220" r="6"/>
    <circle cx="520" cy="100" r="8"/><circle cx="450" cy="160" r="6"/><circle cx="610" cy="180" r="7"/>
  </g>
  <g opacity="0.95">
    <path d="M450 140 C 520 210 520 320 450 390 C 380 320 380 210 450 140 Z" fill="rgba(255,255,255,0.16)"/>
    <path d="M450 190 C 495 235 495 310 450 355 C 405 310 405 235 450 190 Z" fill="rgba(255,255,255,0.22)"/>
  </g>
  <text x="450" y="470" text-anchor="middle" font-family="ui-sans-serif, system-ui" font-size="44" fill="rgba(255,255,255,0.9)" font-weight="800">Событие рядом</text>
</svg>`,
    },
    {
      caption: "Календарь времени",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#60a5fa" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#7c3aed" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect width="900" height="600" rx="28" fill="#0b1020"/>
  <rect x="50" y="60" width="800" height="480" rx="26" fill="url(#g)" opacity="0.25"/>
  <rect x="90" y="120" width="720" height="360" rx="20" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)"/>
  <g fill="rgba(255,255,255,0.85)" font-family="ui-sans-serif, system-ui" font-weight="800">
    <text x="450" y="230" text-anchor="middle" font-size="42">Таймер</text>
    <text x="450" y="285" text-anchor="middle" font-size="22" opacity="0.85">До важного дня</text>
  </g>
  <g opacity="0.9">
    <rect x="140" y="320" width="120" height="120" rx="18" fill="rgba(255,255,255,0.10)"/>
    <rect x="280" y="320" width="120" height="120" rx="18" fill="rgba(255,255,255,0.08)"/>
    <rect x="420" y="320" width="120" height="120" rx="18" fill="rgba(255,255,255,0.10)"/>
    <rect x="560" y="320" width="120" height="120" rx="18" fill="rgba(255,255,255,0.08)"/>
  </g>
</svg>`,
    },
    {
      caption: "С Новым годом!",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#f59e0b" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#22c55e" stop-opacity="0.8"/>
    </linearGradient>
    <radialGradient id="snow" cx="50%" cy="0%" r="70%">
      <stop offset="0" stop-color="#fff" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="900" height="600" rx="28" fill="#0b1020"/>
  <rect x="36" y="36" width="828" height="528" rx="24" fill="url(#g)" opacity="0.25"/>
  <rect x="36" y="36" width="828" height="528" rx="24" fill="url(#snow)"/>
  <g fill="rgba(255,255,255,0.85)">
    <circle cx="150" cy="160" r="4"/><circle cx="210" cy="120" r="3"/><circle cx="260" cy="190" r="3"/>
    <circle cx="690" cy="130" r="4"/><circle cx="760" cy="190" r="3"/><circle cx="640" cy="200" r="3"/>
    <circle cx="430" cy="110" r="3"/><circle cx="470" cy="170" r="4"/><circle cx="520" cy="145" r="3"/>
  </g>
  <g transform="translate(450 330)">
    <path d="M0 -190 L 90 -40 L -90 -40 Z" fill="rgba(255,255,255,0.14)"/>
    <path d="M0 -150 L 70 -30 L -70 -30 Z" fill="rgba(255,255,255,0.18)"/>
    <rect x="-14" y="-40" width="28" height="120" rx="8" fill="rgba(255,255,255,0.16)"/>
    <circle cx="0" cy="-190" r="16" fill="rgba(245,158,11,0.7)"/>
    <g fill="rgba(255,255,255,0.55)">
      <circle cx="-48" cy="-120" r="7"/><circle cx="48" cy="-120" r="7"/>
      <circle cx="-62" cy="-80" r="6"/><circle cx="62" cy="-80" r="6"/>
      <circle cx="-40" cy="-45" r="6"/><circle cx="40" cy="-45" r="6"/>
    </g>
  </g>
  <text x="450" y="520" text-anchor="middle" font-family="ui-sans-serif, system-ui" font-size="40" fill="rgba(255,255,255,0.9)" font-weight="900">Новый год</text>
</svg>`,
    },
    {
      caption: "Летние каникулы",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#22c55e" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#60a5fa" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect width="900" height="600" rx="28" fill="#0b1020"/>
  <rect x="40" y="40" width="820" height="520" rx="24" fill="url(#g)" opacity="0.25"/>
  <g opacity="0.9">
    <circle cx="720" cy="150" r="70" fill="rgba(245,158,11,0.35)"/>
    <circle cx="720" cy="150" r="42" fill="rgba(245,158,11,0.6)"/>
    <path d="M180 430 C 240 360 330 360 390 430 C 430 475 490 485 530 450 C 590 400 690 410 740 480 L 740 540 L 160 540 Z" fill="rgba(255,255,255,0.10)"/>
  </g>
  <text x="450" y="290" text-anchor="middle" font-family="ui-sans-serif, system-ui" font-size="46" fill="rgba(255,255,255,0.92)" font-weight="900">Каникулы</text>
  <text x="450" y="345" text-anchor="middle" font-family="ui-sans-serif, system-ui" font-size="22" fill="rgba(255,255,255,0.75)" font-weight="800">Отдых + энергия</text>
</svg>`,
    },
    {
      caption: "День рождения",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#fb7185" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#7c3aed" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect width="900" height="600" rx="28" fill="#0b1020"/>
  <rect x="36" y="36" width="828" height="528" rx="24" fill="url(#g)" opacity="0.24"/>
  <g opacity="0.95">
    <rect x="260" y="280" width="380" height="210" rx="24" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.16)"/>
    <rect x="220" y="250" width="460" height="60" rx="18" fill="rgba(255,255,255,0.08)"/>
    <g fill="rgba(255,255,255,0.55)">
      <rect x="320" y="210" width="16" height="90" rx="8"/><rect x="390" y="200" width="16" height="100" rx="8"/>
      <rect x="460" y="205" width="16" height="95" rx="8"/><rect x="530" y="215" width="16" height="85" rx="8"/>
    </g>
    <g>
      <path d="M328 182 C 340 160 350 182 342 194 C 336 203 324 200 328 182 Z" fill="rgba(245,158,11,0.75)"/>
      <path d="M398 172 C 410 150 420 172 412 184 C 406 193 394 190 398 172 Z" fill="rgba(245,158,11,0.72)"/>
      <path d="M468 177 C 480 155 490 177 482 189 C 476 198 464 195 468 177 Z" fill="rgba(245,158,11,0.7)"/>
      <path d="M538 187 C 550 165 560 187 552 199 C 546 208 534 205 538 187 Z" fill="rgba(245,158,11,0.68)"/>
    </g>
  </g>
  <g opacity="0.9">
    <circle cx="140" cy="170" r="12" fill="rgba(255,255,255,0.18)"/><circle cx="175" cy="130" r="8" fill="rgba(255,255,255,0.14)"/>
    <circle cx="760" cy="140" r="10" fill="rgba(255,255,255,0.17)"/><circle cx="800" cy="175" r="8" fill="rgba(255,255,255,0.12)"/>
  </g>
  <text x="450" y="520" text-anchor="middle" font-family="ui-sans-serif, system-ui" font-size="40" fill="rgba(255,255,255,0.92)" font-weight="900">Поздравляем!</text>
`,
    },
  ];

  function dayKeyUTC() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  }

  function hashString(str) {
    // Простой детерминированный хеш для выбора “случайного” элемента.
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
  }

  function pickDaily(list) {
    const key = dayKeyUTC();
    const h = hashString(key);
    return list[h % list.length];
  }

  function getDailyFact() {
    return pickDaily(FACTS);
  }

  function getDailyQuote() {
    return pickDaily(QUOTES);
  }

  function svgToDataUri(svg) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function getDailyImage() {
    const item = pickDaily(IMAGES);
    return {
      src: svgToDataUri(item.svg),
      caption: item.caption,
    };
  }

  // Экспорт в глобальную область (для запуска через обычные <script> без module).
  window.dayContent = {
    getDailyFact,
    getDailyQuote,
    getDailyImage,
  };
})();

