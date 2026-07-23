export const STAT_DEFINITIONS = [
  {
    id: "speed",
    label: "Speed",
    defaultValue: 8,
    defaultIcon: "run",
    icons: [
      { id: "run", label: "Run", image: "assets/icons/speed/run_white.png" },
      { id: "flight", label: "Flight", image: "assets/icons/speed/flight_white.png" },
      { id: "swim", label: "Swim", image: "assets/icons/speed/swim_white.png" }
    ]
  },
  {
    id: "attack",
    label: "Attack",
    defaultValue: 10,
    defaultIcon: "fist",
    icons: [
      { id: "fist", label: "Attack", image: "assets/icons/attack/fist_white.png" },
      { id: "autonomous", label: "Attack (Right)", image: "assets/icons/attack/fist_right_white.png" }
    ]
  },
  {
    id: "defense",
    label: "Defense",
    defaultValue: 17,
    defaultIcon: "shield",
    icons: [
      { id: "shield", label: "Shield", image: "assets/icons/defense/shield_white.png" },
      { id: "circle", label: "Circle", image: "assets/icons/defense/circle_white.png" }
    ]
  },
  {
    id: "damage",
    label: "Damage",
    defaultValue: 2,
    defaultIcon: "burst",
    icons: [
      { id: "burst", label: "Burst", image: "assets/icons/damage/burst_white.png" },
      { id: "atom", label: "Atom", image: "assets/icons/damage/atom_white.png" },
      { id: "giant", label: "Giant", image: "assets/icons/damage/giant_white.png" },
      { id: "fist", label: "Fist", image: "assets/icons/damage/fist_white.png", scale: 1.35 }
    ]
  }
];
