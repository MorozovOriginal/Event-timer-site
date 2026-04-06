// Подключаем функции из обычных скриптов (без ES-модулей).
// Важно: некоторые браузеры могут не загрузить файлы, если открыть index.html не из той папки.
const timerApi = window.timer;
const storageApi = window.storage;
const dayContentApi = window.dayContent;
const scriptsOk = Boolean(timerApi && storageApi && dayContentApi);

const startCountdown = scriptsOk ? timerApi.startCountdown : null;
const formatCountdown = scriptsOk ? timerApi.formatCountdown : null;
const formatEventDateHuman = scriptsOk ? timerApi.formatEventDateHuman : null;
const isPastDate = scriptsOk ? timerApi.isPastDate : null;
const stopCountdown = scriptsOk ? timerApi.stopCountdown : null;

const saveEventState = scriptsOk ? storageApi.saveEventState : null;
const loadEventState = scriptsOk ? storageApi.loadEventState : null;
const clearEventState = scriptsOk ? storageApi.clearEventState : null;

const getDailyFact = scriptsOk ? dayContentApi.getDailyFact : null;
const getDailyQuote = scriptsOk ? dayContentApi.getDailyQuote : null;
const getDailyImage = scriptsOk ? dayContentApi.getDailyImage : null;

const el = {
  eventForm: document.getElementById("eventForm"),
  eventSelect: document.getElementById("eventSelect"),
  customNameField: document.getElementById("customNameField"),
  customName: document.getElementById("customName"),
  eventDate: document.getElementById("eventDate"),

  applyBtn: document.getElementById("applyBtn"),
  clearBtn: document.getElementById("clearBtn"),
  statusMessage: document.getElementById("statusMessage"),

  activeEventBadge: document.getElementById("activeEventBadge"),
  eventName: document.getElementById("eventName"),
  eventDateLabel: document.getElementById("eventDateLabel"),

  daysValue: document.getElementById("daysValue"),
  hoursValue: document.getElementById("hoursValue"),
  minutesValue: document.getElementById("minutesValue"),
  secondsValue: document.getElementById("secondsValue"),

  confirmModal: document.getElementById("confirmModal"),
  confirmText: document.getElementById("confirmText"),
  confirmYes: document.getElementById("confirmYes"),
  confirmNo: document.getElementById("confirmNo"),

  factText: document.getElementById("factText"),
  quoteText: document.getElementById("quoteText"),
  dayImage: document.getElementById("dayImage"),
  imageCaption: document.getElementById("imageCaption"),
};

let pendingState = null;

let activeState = null;
let userInteracted = false;

function toEventName(eventId) {
  switch (eventId) {
    case "birthday":
      return "День рождения";
    case "vacations":
      return "Каникулы";
    case "newyear":
      return "Новый год";
    case "custom":
      return el.customName.value.trim() || "Своё событие";
    default:
      return "Событие";
  }
}

function localDateToInputValue(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function defaultDateForEvent(eventId) {
  const now = new Date();

  if (eventId === "newyear") {
    let year = now.getFullYear();
    const jan1ThisYear = new Date(year, 0, 1, 23, 59, 59);
    if (jan1ThisYear.getTime() <= Date.now()) year += 1;
    return localDateToInputValue(new Date(year, 0, 1));
  }

  if (eventId === "vacations") {
    // Условно: “каникулы” начинаются 1 июня.
    let year = now.getFullYear();
    const start = new Date(year, 5, 1, 23, 59, 59);
    if (start.getTime() <= Date.now()) year += 1;
    return localDateToInputValue(new Date(year, 5, 1));
  }

  // Для дня рождения и “своего события”: по умолчанию завтра.
  const t = new Date(now);
  t.setDate(t.getDate() + 1);
  return localDateToInputValue(t);
}

function setCustomVisibility() {
  const show = el.eventSelect.value === "custom";
  el.customNameField.style.display = show ? "grid" : "none";
  if (!show) el.customName.value = "";
}

function setStatus(text, isDanger = false) {
  el.statusMessage.textContent = text || "";
  el.statusMessage.classList.toggle("notice--danger", Boolean(isDanger));
}

function setDigits(parts) {
  const formatted = formatCountdown(parts);

  const pairs = [
    [el.daysValue, formatted.days],
    [el.hoursValue, formatted.hours],
    [el.minutesValue, formatted.minutes],
    [el.secondsValue, formatted.seconds],
  ];

  for (const [node, value] of pairs) {
    if (node.textContent !== value) {
      node.textContent = value;
      node.classList.remove("animate");
      // небольшой реflow для воспроизведения анимации при смене цифр
      void node.offsetWidth;
      node.classList.add("animate");
      setTimeout(() => node.classList.remove("animate"), 320);
    }
  }
}

function updateEventSummary(state) {
  el.activeEventBadge.textContent = "Сейчас:";
  el.eventName.textContent = state.eventName;
  el.eventDateLabel.textContent = formatEventDateHuman(state.dateStr);
}

function openModal(text) {
  el.confirmText.textContent = text;
  el.confirmModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  el.confirmModal.setAttribute("aria-hidden", "true");
}

function getDraftState() {
  const eventId = el.eventSelect.value;
  const dateStr = el.eventDate.value;
  const eventName = toEventName(eventId);

  return { eventId, eventName, dateStr };
}

function validateDraft(state) {
  if (!state.dateStr) return { ok: false, message: "Выберите дату события." };
  if (state.eventId === "custom") {
    if (!el.customName.value.trim()) return { ok: false, message: "Введите название своего события." };
  }
  return { ok: true };
}

function applyState(state) {
  // Всегда сохраняем только после подтверждения пользователем.
  saveEventState({
    eventId: state.eventId,
    eventName: state.eventName,
    dateStr: state.dateStr,
  });

  updateEventSummary(state);
  setStatus("", false);

  stopCountdown();
  activeState = state;
  // Сначала покажем сообщение, если дата уже наступила.
  if (isPastDate(state.dateStr)) {
    setDigits({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setStatus("Событие уже наступило!", true);
    return;
  }

  startCountdown(state.dateStr, (parts) => {
    setDigits(parts);
    if (parts.done) {
      setStatus("Событие уже наступило!", true);
    }
  });
}

function showDraftConfirmation(state) {
  // Подтверждение: показываем сводку события, которое будет сохранено.
  const dateHuman = formatEventDateHuman(state.dateStr);
  pendingState = state;

  openModal(
    `Вы уверены, что хотите запустить таймер?\n\nСобытие: ${state.eventName}\nДата: ${dateHuman}\n\nТаймер начнётся после подтверждения.`
  );
}

function modalIsOpen() {
  return el.confirmModal.getAttribute("aria-hidden") === "false";
}

function draftEquals(a, b) {
  if (!a || !b) return false;
  return a.eventId === b.eventId && a.eventName === b.eventName && a.dateStr === b.dateStr;
}

function maybePromptAutoConfirm(draft) {
  // Открываем подтверждение при “выборе нового события/даты” после взаимодействия пользователя со страницей.
  if (!userInteracted) return;
  if (modalIsOpen()) return;
  if (activeState && draftEquals(activeState, draft)) return;

  const validation = validateDraft(draft);
  if (!validation.ok) {
    // Не открываем модалку, пока нет обязательных данных (например, для "своего события").
    setStatus(validation.message, true);
    return;
  }

  showDraftConfirmation(draft);
}

function initDailyBlocks() {
  el.factText.textContent = getDailyFact();
  el.quoteText.textContent = getDailyQuote();
  const img = getDailyImage();
  el.dayImage.src = img.src;
  el.imageCaption.textContent = img.caption;
}

function initFormFromSaved() {
  const saved = loadEventState();
  if (!saved) return false;

  el.eventSelect.value = saved.eventId || "custom";
  setCustomVisibility();

  if (saved.eventId === "custom") {
    el.customName.value = saved.eventName || "";
  }
  el.eventDate.value = saved.dateStr;

  const state = {
    eventId: saved.eventId,
    eventName: saved.eventId === "custom" ? (saved.eventName || "Своё событие") : toEventName(saved.eventId),
    dateStr: saved.dateStr,
  };

  activeState = state;
  updateEventSummary(state);

  // Таймер стартует автоматически только для сохранённого события.
  if (isPastDate(state.dateStr)) {
    setStatus("Событие уже наступило!", true);
    setDigits({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    return true;
  }

  startCountdown(state.dateStr, (parts) => {
    setDigits(parts);
    if (parts.done) setStatus("Событие уже наступило!", true);
  });

  return true;
}

function initPage() {
  setCustomVisibility();

  // Подставим дату по умолчанию, если ещё ничего не задано.
  if (!el.eventDate.value) {
    el.eventDate.value = defaultDateForEvent(el.eventSelect.value);
  }

  // Событие/дата показываются после подтверждения, но подсказка формы — сразу.
  const quickState = getDraftState();
  el.eventName.textContent = quickState.eventName;
  el.eventDateLabel.textContent = el.eventDate.value ? formatEventDateHuman(el.eventDate.value) : "—";

  initDailyBlocks();
  const hadSaved = initFormFromSaved();

  // Если не было сохранённого — выставим стартовые нули.
  if (!hadSaved) {
    setStatus("Выберите событие и подтвердите его.", false);
    setDigits({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  }
}

function bindEvents() {
  el.eventSelect.addEventListener("change", () => {
    userInteracted = true;
    setCustomVisibility();
    // Чтобы UX был удобным: меняем дату на дефолт только если пользователь ещё не выбрал конкретно.
    // (Если дата была вручную изменена, просто оставим её.)
    if (!el.eventDate.value) {
      el.eventDate.value = defaultDateForEvent(el.eventSelect.value);
    }

    const draft = getDraftState();
    el.eventName.textContent = draft.eventName;
    el.eventDateLabel.textContent = draft.dateStr ? formatEventDateHuman(draft.dateStr) : "—";

    // Подтверждение требуется при выборе нового события/даты.
    const past = draft.dateStr ? isPastDate(draft.dateStr) : false;
    setStatus(past ? "Событие уже наступило!" : "", past);
    maybePromptAutoConfirm(draft);
  });

  el.eventDate.addEventListener("change", () => {
    userInteracted = true;
    const draft = getDraftState();
    el.eventDateLabel.textContent = draft.dateStr ? formatEventDateHuman(draft.dateStr) : "—";

    const past = draft.dateStr ? isPastDate(draft.dateStr) : false;
    setStatus(past ? "Событие уже наступило!" : "", past);
    maybePromptAutoConfirm(draft);
  });

  el.customName.addEventListener("input", () => {
    if (el.eventSelect.value !== "custom") return;
    const draft = getDraftState();
    el.eventName.textContent = draft.eventName;
  });

  el.customName.addEventListener("blur", () => {
    if (el.eventSelect.value !== "custom") return;
    userInteracted = true;
    const draft = getDraftState();
    maybePromptAutoConfirm(draft);
  });

  el.applyBtn.addEventListener("click", () => {
    const draft = getDraftState();
    const validation = validateDraft(draft);
    if (!validation.ok) {
      setStatus(validation.message, true);
      return;
    }
    showDraftConfirmation(draft);
  });

  el.clearBtn.addEventListener("click", () => {
    stopCountdown();
    clearEventState();
    activeState = null;
    pendingState = null;
    userInteracted = false;
    setStatus("Настройки очищены. Выберите событие заново.", false);
    el.eventSelect.value = "birthday";
    setCustomVisibility();
    el.customName.value = "";
    el.eventDate.value = defaultDateForEvent("birthday");
    el.eventName.textContent = "День рождения";
    el.eventDateLabel.textContent = formatEventDateHuman(el.eventDate.value);
    setDigits({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  // Modal events
  el.confirmNo.addEventListener("click", () => {
    pendingState = null;
    closeModal();
  });

  el.confirmYes.addEventListener("click", () => {
    if (!pendingState) {
      closeModal();
      return;
    }
    applyState(pendingState);
    pendingState = null;
    closeModal();
  });

  el.confirmModal.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLElement && target.dataset.close === "true") {
      pendingState = null;
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && el.confirmModal.getAttribute("aria-hidden") === "false") {
      pendingState = null;
      closeModal();
    }
  });
}

function initApp() {
  if (!scriptsOk) {
    if (el.statusMessage) {
      el.statusMessage.textContent =
        "Ошибка: скрипты не загрузились. Откройте `index.html` вместе с папками `js` и `css`.";
      el.statusMessage.classList.add("notice--danger");
    }
    if (el.factText) el.factText.textContent = "Ошибка загрузки скриптов.";
    if (el.quoteText) el.quoteText.textContent = "Ошибка загрузки скриптов.";
    if (el.dayImage) el.dayImage.alt = "Ошибка загрузки скриптов.";
    return;
  }

  bindEvents();
  initPage();
}

// Если DOM уже готов (скрипты подключены в конце body), запускаем сразу.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Текущий год в подвале (обновляется автоматически).
(function updateFooterYear() {
  const yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

