export const APP_SETTINGS = {
  projectVersion: 1,
  storageKey: "custom-token-maker-project-v1",
  themeStorageKey: "custom-token-maker-theme",
  canvasSize: 1254,
  tokenDiameterInches: 1.5,
  defaultTemplateId: "classic",
  fonts: {
    name: {
      family: "Token Name",
      fallback: "Arial Black, Arial, sans-serif",
      size: 54,
      weight: "900",
      style: "normal"
    },
    stats: {
      family: "Token Stats",
      fallback: "Arial, sans-serif",
      size: 70,
      weight: "800",
      style: "normal"
    },
    range: {
      family: "Token Stats",
      fallback: "Arial, sans-serif",
      size: 64,
      weight: "800",
      style: "normal"
    }
  },
  templates: [
    {
      id: "classic",
      label: "Classic blank token",
      image: "assets/templates/classic-token.png",
      layoutId: "classic"
    }
  ]
};
