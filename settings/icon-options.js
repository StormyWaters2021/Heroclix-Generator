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
      { id: "autonomous", label: "Autonomous", image: "assets/icons/attack/autonomous_white.png" }
    ]
  },
  {
    id: "defense",
    label: "Defense",
    defaultValue: 17,
    defaultIcon: "shield",
    icons: [
      { id: "shield", label: "Defense", image: "assets/icons/defense/shield_white.png" },
      { id: "circle", label: "Vehicle", image: "assets/icons/defense/vehicle_white.png" }
    ]
  },
  {
    id: "damage",
    label: "Damage",
    defaultValue: 2,
    defaultIcon: "burst",
    icons: [
      { id: "burst", label: "Standard", image: "assets/icons/damage/standard_white.png" },
      { id: "atom", label: "Tiny", image: "assets/icons/damage/tiny_white.png" },
      { id: "giant", label: "Giant", image: "assets/icons/damage/giant_white.png" },
      { id: "fist", label: "Colossal", image: "assets/icons/damage/colossal_white.png", scale: 1.35 }
    ]
  }
];

export const SPECIAL_ICON = {
  image: "assets/icons/special/star.png",
  scale: 1
};

export const TEAM_ABILITY_OPTIONS = [
  {
    id: "none",
    label: "None",
    image: null
  },
  {
    id: "avengers",
    label: "Avengers",
    image: "assets/icons/team-abilities/avengers.png"
  },
  {
    id: "avengers-initiative",
    label: "Avengers Initiative",
    image: "assets/icons/team-abilities/avengers_initiative.png"
  },
  {
    id: "batman-ally",
    label: "Batman Ally",
    image: "assets/icons/team-abilities/batman_ally.png"
  },
  {
    id: "batman-enemy",
    label: "Batman Enemy",
    image: "assets/icons/team-abilities/batman_enemy.png"
  },
  {
    id: "brotherhood-of-mutants",
    label: "Brotherhood of Mutants",
    image: "assets/icons/team-abilities/brotherhood_of_mutants.png"
  },
  {
    id: "cosmic-energy",
    label: "Cosmic Energy",
    image: "assets/icons/team-abilities/cosmic_energy.png"
  },
  {
    id: "defenders",
    label: "Defenders",
    image: "assets/icons/team-abilities/defenders.png"
  },
  {
    id: "fantastic-four",
    label: "Fantastic Four",
    image: "assets/icons/team-abilities/fantastic_four.png"
  },
  {
    id: "green-lantern-corps",
    label: "Green Lantern Corps",
    image: "assets/icons/team-abilities/green_lantern_corps.png"
  },
  {
    id: "guardians",
    label: "Guardians",
    image: "assets/icons/team-abilities/guardians.png"
  },
  {
    id: "hydra",
    label: "Hydra",
    image: "assets/icons/team-abilities/hydra.png"
  },
  {
    id: "hypertime",
    label: "Hypertime",
    image: "assets/icons/team-abilities/hypertime.png"
  },
  {
    id: "injustice-league",
    label: "Injustice League",
    image: "assets/icons/team-abilities/injustice_league.png"
  },
  {
    id: "justice-league",
    label: "Justice League",
    image: "assets/icons/team-abilities/justice_league.png"
  },
  {
    id: "justice-society",
    label: "Justice Society",
    image: "assets/icons/team-abilities/justice_society.png"
  },
  {
    id: "kingdom-come",
    label: "Kingdom Come",
    image: "assets/icons/team-abilities/kingdom_come.png"
  },
  {
    id: "legion-of-super-heroes",
    label: "Legion of Super Heroes",
    image: "assets/icons/team-abilities/legion_of_super_heroes.png"
  },
  {
    id: "masters-of-evil",
    label: "Masters of Evil",
    image: "assets/icons/team-abilities/masters_of_evil.png"
  },
  {
    id: "minions-of-doom",
    label: "Minions of Doom",
    image: "assets/icons/team-abilities/minions_of_doom.png"
  },
  {
    id: "mystics",
    label: "Mystics",
    image: "assets/icons/team-abilities/mystics.png"
  },
  {
    id: "outsiders",
    label: "Outsiders",
    image: "assets/icons/team-abilities/outsiders.png"
  },
  {
    id: "police",
    label: "Police",
    image: "assets/icons/team-abilities/police.png"
  },
  {
    id: "shield",
    label: "S.H.I.E.L.D.",
    image: "assets/icons/team-abilities/shield.png"
  },
  {
    id: "sinister-syndicate",
    label: "Sinister Syndicate",
    image: "assets/icons/team-abilities/sinister_syndicate.png"
  },
  {
    id: "skrulls",
    label: "Skrulls",
    image: "assets/icons/team-abilities/skrulls.png"
  },
  {
    id: "spider-man",
    label: "Spider-Man",
    image: "assets/icons/team-abilities/spider-man.png"
  },
  {
    id: "suicide-squad",
    label: "Suicide Squad",
    image: "assets/icons/team-abilities/suicide_squad.png"
  },
  {
    id: "superman-ally",
    label: "Superman Ally",
    image: "assets/icons/team-abilities/superman_ally.png"
  },
  {
    id: "superman-enemy",
    label: "Superman Enemy",
    image: "assets/icons/team-abilities/superman_enemy.png"
  },
  {
    id: "team-player",
    label: "Team Player",
    image: "assets/icons/team-abilities/team_player.png"
  },
  {
    id: "titans",
    label: "Titans",
    image: "assets/icons/team-abilities/titans.png"
  },
  {
    id: "ultimates",
    label: "Ultimates",
    image: "assets/icons/team-abilities/ultimates.png"
  },
  {
    id: "underworld",
    label: "Underworld",
    image: "assets/icons/team-abilities/underworld.png"
  },
  {
    id: "wonder-woman-ally",
    label: "Wonder Woman Ally",
    image: "assets/icons/team-abilities/wonder_woman_ally.png"
  },
  {
    id: "xmen",
    label: "X-Men",
    image: "assets/icons/team-abilities/xmen.png"
  }
];

export const IMPROVED_ABILITY_GROUPS = {
  movement: {
    label: "Movement",
    main: {
      id: "movement-main",
      label: "Improved Movement",
      image: "assets/icons/improved-abilities/movement.png"
    },
    options: [
      { id: "elevated", label: "Elevated", image: "assets/icons/improved-abilities/elevated.png" },
      { id: "blocking", label: "Blocking", image: "assets/icons/improved-abilities/blocking.png" },
      { id: "outdoor-blocking", label: "Outdoor Blocking", image: "assets/icons/improved-abilities/outdoorblocking.png" },
      { id: "destroy-blocking", label: "Destroy Blocking", image: "assets/icons/improved-abilities/destroyblocking.png" },
      { id: "characters", label: "Characters", image: "assets/icons/improved-abilities/characters.png" },
      { id: "move-through", label: "Move Through", image: "assets/icons/improved-abilities/throughadjacent.png" }
    ]
  },
  targeting: {
    label: "Targeting",
    main: {
      id: "targeting-main",
      label: "Improved Targeting",
      image: "assets/icons/improved-abilities/targeting.png"
    },
    options: [
      { id: "elevated", label: "Elevated", image: "assets/icons/improved-abilities/elevated.png" },
      { id: "hindering", label: "Hindering", image: "assets/icons/improved-abilities/hindering.png" },
      { id: "blocking", label: "Blocking", image: "assets/icons/improved-abilities/blocking.png" },
      { id: "destroy-blocking", label: "Destroy Blocking", image: "assets/icons/improved-abilities/destroyblocking.png" },
      { id: "characters", label: "Characters", image: "assets/icons/improved-abilities/characters.png" },
      { id: "adjacent", label: "Adjacent", image: "assets/icons/improved-abilities/throughadjacent.png" }
    ]
  }
};
