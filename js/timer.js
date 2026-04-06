// Обратный отсчёт до выбранной даты.

(() => {
  let intervalId = null;
  let currentTarget = null;

  function stopCountdown() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  currentTarget = null;
  }

  function pad2(n) {
  return String(n).padStart(2, "0");
  }

  function parseLocalDateEndOfDay(dateStr) {
  // Берём дату из <input type="date"> и считаем, что событие наступает в конце дня.
  // Это делает UX понятнее: если выбрали "сегодня", таймер не должен сразу показывать "уже наступило".
  // dateStr: "YYYY-MM-DD"
  return new Date(`${dateStr}T23:59:59`);
  }

  function getTimeParts(targetDate) {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, done: false };
  }

  function startCountdown(dateStr, onTick) {
  // dateStr: "YYYY-MM-DD"
  stopCountdown();
  currentTarget = parseLocalDateEndOfDay(dateStr);

  const tick = () => {
    const parts = getTimeParts(currentTarget);
    onTick(parts);

    if (parts.done) {
      stopCountdown();
    }
  };

  // Сразу посчитаем без ожидания первой секунды.
  tick();
  intervalId = setInterval(tick, 1000);
  }

  function formatCountdown(parts) {
  return {
    days: pad2(parts.days),
    hours: pad2(parts.hours),
    minutes: pad2(parts.minutes),
    seconds: pad2(parts.seconds),
  };
  }

  function formatEventDateHuman(dateStr) {
  const d = new Date(`${dateStr}T12:00:00`); // полуденное время, чтобы снизить риск смещения
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  }

  function isPastDate(dateStr) {
  // Проверяем "на сегодня" с учётом конца дня (см. parseLocalDateEndOfDay).
  const target = parseLocalDateEndOfDay(dateStr);
  return target.getTime() - Date.now() <= 0;
  }

// Экспорт в глобальную область (для запуска через обычные <script> без module).
  window.timer = {
    startCountdown,
    formatCountdown,
    formatEventDateHuman,
    isPastDate,
    stopCountdown,
  };
})();

