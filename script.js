const htmlElement = document.documentElement;
const themeToggleButton = document.querySelector("[data-theme-toggle]");
const textSyncElements = Array.from(
  document.querySelectorAll("[data-theme-light-text], [data-theme-dark-text]")
);
const imageSyncElements = Array.from(
  document.querySelectorAll("[data-theme-light-src], [data-theme-dark-src]")
);

const THEME_STORAGE_KEY = "preferred-theme";

textSyncElements.forEach((element) => {
  if (!element.dataset.themeOriginalText) {
    element.dataset.themeOriginalText = element.textContent;
  }
});

imageSyncElements.forEach((element) => {
  if (!element.dataset.themeOriginalSrc) {
    const currentSrc = element.getAttribute("src");
    if (currentSrc !== null) {
      element.dataset.themeOriginalSrc = currentSrc;
    }
  }
});

function syncCustomTargets(isLight) {
  textSyncElements.forEach((element) => {
    const fallback = element.dataset.themeOriginalText ?? "";
    const lightText = element.dataset.themeLightText ?? fallback;
    const darkText = element.dataset.themeDarkText ?? fallback;
    const nextText = isLight ? lightText : darkText;

    if (element.textContent !== nextText) {
      element.textContent = nextText;
    }
  });

  imageSyncElements.forEach((element) => {
    const fallback = element.dataset.themeOriginalSrc ?? element.getAttribute("src") ?? "";
    const lightSrc = element.dataset.themeLightSrc ?? fallback;
    const darkSrc = element.dataset.themeDarkSrc ?? fallback;
    const nextSrc = isLight ? lightSrc : darkSrc;

    if (nextSrc && element.getAttribute("src") !== nextSrc) {
      element.setAttribute("src", nextSrc);
    }
  });
}

function applyTheme(mode, options = {}) {
  const { persist = true } = options;
  const isLight = mode === "light";
  htmlElement.classList.toggle("light", isLight);

  if (themeToggleButton) {
    themeToggleButton.setAttribute("aria-pressed", String(isLight));
  }

  syncCustomTargets(isLight);

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn("Não foi possível salvar o tema selecionado.", error);
    }
  }
}

function resolveInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch {
    // Ignora erro de acesso ao localStorage e usa o tema padrão
  }

  return "dark";
}

function toggleMode() {
  const shouldEnableLight = !htmlElement.classList.contains("light");
  applyTheme(shouldEnableLight ? "light" : "dark");
}

function handleSystemThemeChange(event) {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      return;
    }
  } catch {
    // Se não conseguir ler, assume que podemos seguir preferência do sistema
  }

  applyTheme(event.matches ? "light" : "dark", { persist: false });
}

function registerEventListeners() {
  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", toggleMode);
  }

  if (window.matchMedia) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }
}

function init() {
  const initialTheme = resolveInitialTheme();
  const hasStoredPreference = (() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) === initialTheme;
    } catch {
      return false;
    }
  })();

  applyTheme(initialTheme, { persist: hasStoredPreference });
  registerEventListeners();
}

init();
