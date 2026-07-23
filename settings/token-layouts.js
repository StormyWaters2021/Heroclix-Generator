export const TOKEN_LAYOUTS = {
  classic: {
    artwork: {
      centerX: 760,
      centerY: 610,
      clipCenterX: 627,
      clipCenterY: 627,
      clipRadius: 610,
      defaultScale: 1
    },
    name: {
      x: 625,
      y: 175,
      maxWidth: 735,
      align: "center",
      baseline: "middle",
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 10
    },
    range: {
      x: 168,
      y: 375,
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
      speed: { x: 400, y: 530, iconX: 205, iconY: 535, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/speed.png", x: 302, y: 461 } },
      attack: { x: 440, y: 690, iconX: 240, iconY: 685, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/attack.png", x: 342, y: 615 } },
      defense: { x: 480, y: 840, iconX: 290, iconY: 845, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/defense.png", x: 382, y: 768 } },
      damage: { x: 525, y: 995, iconX: 338, iconY: 995, iconWidth: 95, iconHeight: 95, fillMask: { image: "assets/masks/classic/damage.png", x: 423, y: 922 } }
    },
    statText: {
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
  }
};
