// Хранилище выбранного события и даты.

(() => {
  const STORAGE_KEY = "timer.event.v1";

  function saveEventState(state) {
    const payload = {
      eventId: state.eventId,
      eventName: state.eventName,
      dateStr: state.dateStr, // "YYYY-MM-DD"
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function loadEventState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.eventId || !parsed.dateStr) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function clearEventState() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Экспорт в глобальную область (для запуска через обычные <script> без module).
  window.storage = {
    saveEventState,
    loadEventState,
    clearEventState,
  };
})();

