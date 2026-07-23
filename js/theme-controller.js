import { APP_SETTINGS } from "../settings/app-settings.js";

export function initializeTheme(toggleButton) {
  const saved = localStorage.getItem(APP_SETTINGS.themeStorageKey);
  const initial = saved === "light" || saved === "dark"
    ? saved
    : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    toggleButton.setAttribute("aria-pressed", String(theme === "dark"));
    toggleButton.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    localStorage.setItem(APP_SETTINGS.themeStorageKey, theme);
  }

  apply(initial);
  toggleButton.addEventListener("click", () => {
    apply(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });
}
