export const TOKEN_LAYOUTS = {
  classic: {
    shape: "circle",
    artwork: {
      centerX: 760,
      centerY: 610,
      clipCenterX: 627,
      clipCenterY: 627,
      clipInset: 17,
      defaultScale: 1
    },
    name: {
      x: 627,
      y: 175,
      maxWidth: 735,
      fontRole: "name",
      align: "center",
      baseline: "middle",
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 10
    },
    range: {
      x: 168,
      y: 375,
      fontRole: "range",
      align: "center",
      baseline: "middle",
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 8,
      maxWidth: 140
    },
    bolts: {
      startX: 220,
      y: 370,
      width: 32,
      height: 48,
      stepX: 25,
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 5
    },
    stats: {
      speed: { x: 400, y: 530, iconX: 205, iconY: 535, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/speed.png", x: 302, y: 461 }, specialMarker: { x: 402, y: 522, width: 97, height: 97, stroke: "#000000", lineWidth: 7 } },
      attack: { x: 440, y: 690, iconX: 240, iconY: 685, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/attack.png", x: 342, y: 615 }, specialMarker: { x: 440, y: 688, width: 97, height: 97, stroke: "#000000", lineWidth: 7 } },
      defense: { x: 480, y: 840, iconX: 290, iconY: 845, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/defense.png", x: 382, y: 768 }, specialMarker: { x: 480, y: 838, width: 97, height: 97, stroke: "#000000", lineWidth: 7 } },
      damage: { x: 525, y: 995, iconX: 338, iconY: 995, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/damage.png", x: 423, y: 922 }, specialMarker: { x: 525, y: 993, width: 97, height: 97, stroke: "#000000", lineWidth: 7 } }
    },
    statText: {
      fontRole: "stats",
      maxWidth: 92,
      align: "center",
      baseline: "middle",
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 8
    },
	special: {
	  x: 375,
	  y: 375,
	  width: 85,
	  height: 85,
	  rotation: 0
	},

	teamAbility: {
	  x: 450,
	  y: 375,
	  width: 75,
	  height: 75,
	  rotation: 0
	},

    improvedAbilities: {
      movement: {
        slots: [
          { x: 1175, y: 570, width: 80, height: 80, rotation: 0 },
          { x: 1160, y: 490, width: 80, height: 80, rotation: 0 },
          { x: 1140, y: 410, width: 80, height: 80, rotation: 0 },
          { x: 1120, y: 330, width: 80, height: 80, rotation: 0 },
          { x: 1040, y: 300, width: 80, height: 80, rotation: 0 },
          { x: 960, y: 300, width: 80, height: 80, rotation: 0 },
          { x: 880, y: 300, width: 80, height: 80, rotation: 0 }
        ]
      },
      targeting: {
        slots: [
          { x: 1175, y: 685, width: 80, height: 80, rotation: 0 },
          { x: 1160, y: 765, width: 80, height: 80, rotation: 0 },
          { x: 1130, y: 845, width: 80, height: 80, rotation: 0 },
          { x: 1100, y: 925, width: 80, height: 80, rotation: 0 },
          { x: 1050, y: 995, width: 80, height: 80, rotation: 0 },
          { x: 980, y: 1050, width: 80, height: 80, rotation: 0 },
          { x: 895, y: 1060, width: 80, height: 80, rotation: 0 }
        ]
      }
    },
  },
  classic_back: {
    shape: "circle",
    artwork: {
      centerX: -1000,
      centerY: -1000,
      clipCenterX: 627,
      clipCenterY: 627,
      clipInset: 17,
      defaultScale: 1
    },
	
	special: {
	  x: 627,
	  y: 265,
	  width: 85,
	  height: 85,
	  rotation: 0
	},
	
    name: {
      x: 627,
      y: 200,
      maxWidth: 735,
      fontRole: "name",
      align: "center",
      baseline: "middle",
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 10
    },

	teamAbility: {
	  x: 627,
	  y: 100,
	  width: 75,
	  height: 75,
	  rotation: 0
	},

	textAreas: {
      ability: {
        source: "ability",
        x: 627,
        y: 700,
        width: 900,
        height: 750,
        fontRole: "ability",
        align: "center",
        verticalAlign: "top",
        lineHeight: 1.15,
        wrap: true,
        shrinkToFit: true,
        fill: "#ffffff",
        stroke: "#000000",
        strokeWidth: 8
      }
    },
    range: {
      x: -1000,
      y: -1000,
      fontRole: "range",
      align: "center",
      baseline: "middle",
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 8,
      maxWidth: 140
    },
    bolts: {
      startX: -1000,
      y: -1000,
      width: 32,
      height: 48,
      stepX: 25,
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 5
    },
    stats: {
      speed: { x: -1000, y: -1000, iconX: -1000, iconY: -1000, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/speed.png", x: -1000, y: -1000 }, specialMarker: { x: 402, y: 522, width: 97, height: 97, stroke: "#000000", lineWidth: 7 } },
      attack: { x: -1000, y: -1000, iconX: -1000, iconY: -1000, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/attack.png", x: -1000, y: -1000 }, specialMarker: { x: 440, y: 688, width: 97, height: 97, stroke: "#000000", lineWidth: 7 } },
      defense: { x: -1000, y: -1000, iconX: -1000, iconY: -1000, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/defense.png", x: -1000, y: -1000 }, specialMarker: { x: 480, y: 838, width: 97, height: 97, stroke: "#000000", lineWidth: 7 } },
      damage: { x: -1000, y: -1000, iconX: -1000, iconY: -1000, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/damage.png", x: -1000, y: -1000 }, specialMarker: { x: 525, y: 993, width: 97, height: 97, stroke: "#000000", lineWidth: 7 } }
    },
    statText: {
      fontRole: "stats",
      maxWidth: 92,
      align: "center",
      baseline: "middle",
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 8
    },

    improvedAbilities: {
      movement: {
        slots: [
          { x: 1175, y: 570, width: 80, height: 80, rotation: 0 },
          { x: 1160, y: 490, width: 80, height: 80, rotation: 0 },
          { x: 1140, y: 410, width: 80, height: 80, rotation: 0 },
          { x: 1120, y: 330, width: 80, height: 80, rotation: 0 },
          { x: 1040, y: 300, width: 80, height: 80, rotation: 0 },
          { x: 960, y: 300, width: 80, height: 80, rotation: 0 },
          { x: 880, y: 300, width: 80, height: 80, rotation: 0 }
        ]
      },
      targeting: {
        slots: [
          { x: 1175, y: 685, width: 80, height: 80, rotation: 0 },
          { x: 1160, y: 765, width: 80, height: 80, rotation: 0 },
          { x: 1130, y: 845, width: 80, height: 80, rotation: 0 },
          { x: 1100, y: 925, width: 80, height: 80, rotation: 0 },
          { x: 1050, y: 995, width: 80, height: 80, rotation: 0 },
          { x: 980, y: 1050, width: 80, height: 80, rotation: 0 },
          { x: 895, y: 1060, width: 80, height: 80, rotation: 0 }
        ]
      }
    },
  },
  classic_blank: {
    shape: "circle",
    artwork: {
      centerX: 760,
      centerY: 610,
      clipCenterX: 627,
      clipCenterY: 627,
      clipInset: 17,
      defaultScale: 1
    },
    name: {
      x: 627,
      y: 175,
      maxWidth: 735,
      fontRole: "name",
      align: "center",
      baseline: "middle",
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 10
    },
    range: {
      x: 168,
      y: 375,
      fontRole: "range",
      align: "center",
      baseline: "middle",
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 8,
      maxWidth: 140
    },
    bolts: {
      startX: 220,
      y: 370,
      width: 32,
      height: 48,
      stepX: 25,
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 5
    },
    stats: {
      speed: { x: 400, y: 530, iconX: 205, iconY: 535, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/speed.png", x: 302, y: 461 }, specialMarker: { x: 402, y: 522, width: 97, height: 97, stroke: "#000000", lineWidth: 7 } },
      attack: { x: 440, y: 690, iconX: 240, iconY: 685, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/attack.png", x: 342, y: 615 }, specialMarker: { x: 440, y: 688, width: 97, height: 97, stroke: "#000000", lineWidth: 7 } },
      defense: { x: 480, y: 840, iconX: 290, iconY: 845, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/defense.png", x: 382, y: 768 }, specialMarker: { x: 480, y: 838, width: 97, height: 97, stroke: "#000000", lineWidth: 7 } },
      damage: { x: 525, y: 995, iconX: 338, iconY: 995, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/damage.png", x: 423, y: 922 }, specialMarker: { x: 525, y: 993, width: 97, height: 97, stroke: "#000000", lineWidth: 7 } }
    },
    statText: {
      fontRole: "stats",
      maxWidth: 92,
      align: "center",
      baseline: "middle",
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 8
    },
	special: {
	  x: 375,
	  y: 375,
	  width: 85,
	  height: 85,
	  rotation: 0
	},

	teamAbility: {
	  x: 450,
	  y: 375,
	  width: 75,
	  height: 75,
	  rotation: 0
	},

    improvedAbilities: {
      movement: {
        slots: [
          { x: 1175, y: 570, width: 80, height: 80, rotation: 0 },
          { x: 1160, y: 490, width: 80, height: 80, rotation: 0 },
          { x: 1140, y: 410, width: 80, height: 80, rotation: 0 },
          { x: 1120, y: 330, width: 80, height: 80, rotation: 0 },
          { x: 1040, y: 300, width: 80, height: 80, rotation: 0 },
          { x: 960, y: 300, width: 80, height: 80, rotation: 0 },
          { x: 880, y: 300, width: 80, height: 80, rotation: 0 }
        ]
      },
      targeting: {
        slots: [
          { x: 1175, y: 685, width: 80, height: 80, rotation: 0 },
          { x: 1160, y: 765, width: 80, height: 80, rotation: 0 },
          { x: 1130, y: 845, width: 80, height: 80, rotation: 0 },
          { x: 1100, y: 925, width: 80, height: 80, rotation: 0 },
          { x: 1050, y: 995, width: 80, height: 80, rotation: 0 },
          { x: 980, y: 1050, width: 80, height: 80, rotation: 0 },
          { x: 895, y: 1060, width: 80, height: 80, rotation: 0 }
        ]
      }
    },
  },
  "art-only": {
    shape: "circle",
    artwork: {
      centerX: 627,
      centerY: 627,
      clipCenterX: 627,
      clipCenterY: 627,
      clipInset: 17,
      defaultScale: 1
    },
    name: {
      x: 627,
      y: 200,
      maxWidth: 735,
      fontRole: "name",
      align: "center",
      baseline: "middle",
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 10
    },
    textAreas: {
      ability: {
        source: "ability",
        x: 600,
        y: 895,
        width: 700,
        height: 400,
        fontRole: "ability",
        align: "center",
        verticalAlign: "top",
        lineHeight: 1.15,
        wrap: true,
        shrinkToFit: true,
        fill: "#ffffff",
        stroke: "#000000",
        strokeWidth: 8
      }
    },
    range: {
      x: -1000,
      y: -1000,
      fontRole: "range",
      align: "center",
      baseline: "middle",
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 8,
      maxWidth: 140
    },
    bolts: {
      startX: -1000,
      y: -1000,
      width: 32,
      height: 48,
      stepX: 25,
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 5
    },
    stats: {
      speed: { x: -1000, y: -1000, iconX: -1000, iconY: -1000, iconWidth: 0, iconHeight: 0, fillMask: { image: null, x: 302, y: 461 } },
      attack: { x: -1000, y: -1000, iconX: -1000, iconY: -1000, iconWidth: 0, iconHeight: 0, fillMask: { image: null, x: 342, y: 615 } },
      defense: { x: -1000, y: -1000, iconX: -1000, iconY: -1000, iconWidth: 0, iconHeight: 0, fillMask: { image: null, x: 382, y: 768 } },
      damage: { x: -1000, y: -1000, iconX: -1000, iconY: -1000, iconWidth: 0, iconHeight: 0, fillMask: { image: null, x: 423, y: 922 } }
    },
    statText: {
      fontRole: "stats",
      maxWidth: 92,
      align: "center",
      baseline: "middle",
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 8
    },
	special: {
	  x: 627,
	  y: 650,
	  width: 85,
	  height: 85,
	  rotation: 0
	},

	teamAbility: {
	  x: -1000,
	  y: -1000,
	  width: 75,
	  height: 75,
	  rotation: 0
	},

    improvedAbilities: {},
  },
};
