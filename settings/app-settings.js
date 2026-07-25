export const APP_SETTINGS = {
  projectVersion: 4,
  versionmsg: {
    visible: true,
    text: "HeroClix Bystander Generator v0.4.0"
  },
  storageKey: "custom-token-maker-project-v1",
  themeStorageKey: "custom-token-maker-theme",
  canvasSize: 1254,
  tokenDiameterInches: 1.5,
  defaultTemplateId: "classic",
  defaultFontId: "default",
  fontCatalog: {
    default: {
      family: "Arial",
      fallback: "sans-serif"
    },
    "token-name": {
      family: "Token Name",
      fallback: "Arial Black, Arial, sans-serif"
    },
    "token-stats": {
      family: "Token Stats",
      fallback: "Arial, sans-serif"
    }
  },

  fontRoles: {
    name: {
      fontId: "token-name",
      size: 54,
      minSize: 18,
      weight: "900",
      style: "normal"
    },
    stats: {
      fontId: "token-stats",
      size: 70,
      minSize: 18,
      weight: "800",
      style: "normal"
    },
    range: {
      fontId: "token-stats",
      size: 64,
      minSize: 18,
      weight: "800",
      style: "normal"
    },
    ability: {
      fontId: "default",
      size: 52,
      minSize: 22,
      weight: "700",
      style: "normal"
    }
  },

  templates: [
    {
      id: "classic",
      label: "Default",
      image: "assets/templates/classic-token.png",
      bleedImage: "assets/templates/classic-token-bleed.png",
      shape: "circle",

      editor: {
        name: true,
        ability: false,
        range: true,
        bolts: true,
        artwork: true,
        stats: true,
        improvedAbilities: true,
        special: true,
        teamAbility: true
      }
    },
	{
      id: "classic_back",
      label: "Default - Back",
      image: "assets/templates/classic-token-back.png",
      bleedImage: "assets/templates/classic-token-back-bleed.png",
      shape: "circle",

      editor: {
        name: true,
        ability: true,
        range: false,
        bolts: false,
        artwork: false,
        stats: false,
        improvedAbilities: false,
        special: true,
        teamAbility: true
      }
    },
    {
      id: "art-only",
      label: "Art Only",
      image: "assets/templates/art-only-token.png",
      bleedImage: "assets/templates/art-only-token-bleed.png",
      shape: "circle",

      editor: {
        name: true,
        ability: true,
        range: false,
        bolts: false,
        artwork: true,
        stats: false,
        improvedAbilities: false,
        special: true,
        teamAbility: false
      }
    }
  ]
};
