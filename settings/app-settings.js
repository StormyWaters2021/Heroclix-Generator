export const APP_SETTINGS = {
  projectVersion: 3,
  versionmsg: {
    visible: true,
    text: "HeroClix Bystander Generator v0.3.0"
  },
  storageKey: "custom-token-maker-project-v1",
  themeStorageKey: "custom-token-maker-theme",
  canvasSize: 1254,
  tokenDiameterInches: 1.5,
  defaultTemplateId: "classic",

  // Font families are defined once here so a future editor dropdown can select
  // a font by ID without changing any rendering code.
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

  // Text roles control size and styling independently of the chosen family.
  // token.fontSelections can later override the fontId for any role.
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
        special: true,
        teamAbility: false
      }
    }
  ]
};
