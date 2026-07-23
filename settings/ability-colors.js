const COLORS = {
  none: "#ffffff",
  red: "#ef2b2d",
  orange: "#f28b2b",
  yellow: "#f2dc32",
  "light-green": "#8ac640",
  green: "#21a94b",
  "light-blue": "#35b9de",
  blue: "#1772b8",
  purple: "#7c2d92",
  pink: "#e7a9cf",
  brown: "#8a5738",
  black: "#000000",
  gray: "#81878b"
};

function ability(id, label) {
  return { id, label, color: COLORS[id] };
}

export const ABILITY_OPTIONS = {
  speed: [
    ability("none", "No ability"),
    ability("red", "Flurry"),
    ability("orange", "Leap/Climb"),
    ability("yellow", "Phasing/Teleport"),
    ability("light-green", "Earthbound/Neutralized"),
    ability("green", "Charge"),
    ability("light-blue", "Mind Control"),
    ability("blue", "Plasticity"),
    ability("purple", "Force Blast"),
    ability("pink", "Sidestep"),
    ability("brown", "Hypersonic Speed"),
    ability("black", "Stealth"),
    ability("gray", "Running Shot")
  ],

  attack: [
    ability("none", "No ability"),
    ability("red", "Blades/Claws/Fangs"),
    ability("orange", "Energy Explosion"),
    ability("yellow", "Pulse Wave"),
    ability("light-green", "Quake"),
    ability("green", "Super Strength"),
    ability("light-blue", "Incapacitate"),
    ability("blue", "Penetrating/Psychic Blast"),
    ability("purple", "Smoke Cloud"),
    ability("pink", "Precision Strike"),
    ability("brown", "Poison"),
    ability("black", "Steal Energy"),
    ability("gray", "Telekinesis")
  ],

  defense: [
    ability("none", "No ability"),
    ability("red", "Super Senses"),
    ability("orange", "Toughness"),
    ability("yellow", "Defend"),
    ability("light-green", "Combat Reflexes"),
    ability("green", "Energy Shield/Deflection"),
    ability("light-blue", "Barrier"),
    ability("blue", "Mastermind"),
    ability("purple", "Willpower"),
    ability("pink", "Invincible"),
    ability("brown", "Impervious"),
    ability("black", "Regeneration"),
    ability("gray", "Invulnerability")
  ],

  damage: [
    ability("none", "No ability"),
    ability("red", "Ranged Combat Expert"),
    ability("orange", "Battle Fury"),
    ability("yellow", "Support"),
    ability("light-green", "Exploit Weakness"),
    ability("green", "Enhancement"),
    ability("light-blue", "Probability Control"),
    ability("blue", "Shape Change"),
    ability("purple", "Close Combat Expert"),
    ability("pink", "Empower"),
    ability("brown", "Perplex"),
    ability("black", "Outwit"),
    ability("gray", "Leadership")
  ]
};

export function getAbilityOptions(statId) {
  return ABILITY_OPTIONS[statId] || ABILITY_OPTIONS.speed;
}

export function getAbilityOption(statId, abilityId) {
  return getAbilityOptions(statId).find((entry) => entry.id === abilityId)
    || getAbilityOptions(statId)[0];
}

export function getAbilityColor(statId, abilityId) {
  return getAbilityOption(statId, abilityId).color;
}
