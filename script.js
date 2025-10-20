const htmlElement = document.documentElement;
const themeToggleButton = document.querySelector("#theme-toggle");
const profileParagraph = document.querySelector("#paragraph");
const profileImage = document.querySelector("#profile img");

const THEME_STORAGE_KEY = "preferred-theme";
const profileCopy = {
  dark: "Cineasta frustrado, só uso preto.",
  light: "Se o fundo é claro, o humor continua sombrio."
};

function applyTheme(mode, options = {}) {
  const { persist = true } = options;
  const isLight = mode === "light";
  htmlElement.classList.toggle("light", isLight);

  if (themeToggleButton) {
    themeToggleButton.setAttribute("aria-pressed", String(isLight));
  }

  if (profileParagraph) {
    profileParagraph.textContent = isLight ? profileCopy.light : profileCopy.dark;
  }

  if (profileImage) {
    profileImage.setAttribute("src", isLight ? "./assets/avatar-light.jpg" : "./assets/avatar.jpg");
  }

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
    // Ignora erro de acesso ao localStorage e segue para preferência do sistema
  }

  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
  return prefersLight ? "light" : "dark";
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
