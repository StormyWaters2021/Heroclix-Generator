export const APP_SETTINGS = {
  projectVersion: 2,
  versionmsg: {
	  visible: true,
	  text: "HeroClix Bystander Generator v0.2.0"
	},
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
      label: "Default",
      image: "assets/templates/classic-token.png",
      bleedImage: "assets/templates/classic-token-bleed.png",
      layoutId: "classic",
      shape: "circle"
    },
	{
      id: "art-only",
      label: "Art Only",
      image: "assets/templates/art-only-token.png",
      bleedImage: "assets/templates/art-only-token-bleed.png",
      layoutId: "art-only",
      shape: "circle"
    }
  ]
};
