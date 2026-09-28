"use strict";
const QUESTIONS = [
  {
    id: "location",
    label: "Place",
    kicker: "First, name the place",
    q: "Which stretch of water are you looking at?",
    hint: "Name the waterway and add a nearby bridge, road, park or landmark so the spot is useful later.",
    type: "text",
    placeholder: "e.g. Budhabalanga near the old bridge",
  },
  {
    id: "clarity",
    label: "Clarity",
    kicker: "Observation one · water",
    q: "How clear is the water?",
    hint: "Look straight down near the bank. Pick the closest match.",
    options: [
      ["clear", "Crystal clear", "The bottom is easy to see"],
      ["cloudy", "Slightly cloudy", "A little hazy"],
      ["murky", "Murky brown", "Like milky tea"],
      ["green", "Greenish tint", "Pea-soup shade"],
    ],
  },
  {
    id: "smell",
    label: "Smell",
    kicker: "Observation two · air",
    q: "What does the air just above the water smell like?",
    hint: "Waft the air toward you. Do not lean in or touch the water.",
    options: [
      ["none", "No noticeable smell", "Neutral or fresh"],
      ["earthy", "Earthy", "Like soil after rain"],
      ["rotten", "Rotten egg / sewage", "Sulfur-like"],
      ["chemical", "Sharp or chemical", "Petrol, solvent or detergent"],
    ],
  },
  {
    id: "surface",
    label: "Surface",
    kicker: "Observation three · surface",
    q: "What stands out on the surface?",
    hint: "Scan the edges and where drains meet the water.",
    options: [
      ["clean", "Nothing unusual", "Open, clean surface"],
      ["foam", "White foam patches", "Persistent bubbly clusters"],
      ["oily", "Rainbow film", "An oily-looking sheen"],
      ["litter", "Floating litter", "Plastic or wrappers"],
      ["algae", "Green algae mat", "Slimy green cover"],
    ],
  },
  {
    id: "wildlife",
    label: "Wildlife",
    kicker: "Observation four · life",
    q: "What life can you notice nearby?",
    hint: "Watch quietly for a moment. One clear sighting is enough.",
    options: [
      ["fish", "Fish", "Swimming or surfacing"],
      ["birds", "Water birds", "Wading or diving"],
      ["frogs", "Frogs", "Seen or heard"],
      ["insects", "Dragonflies / insects", "Skimming the water"],
      ["none", "None spotted", "No activity noticed"],
    ],
  },
  {
    id: "rain",
    label: "Rain",
    kicker: "Observation five · weather",
    q: "Has there been rain in the last two days?",
    hint: "Rain can explain a temporary change in clarity.",
    options: [
      ["heavy", "Heavy rain", "A proper downpour"],
      ["light", "Light rain", "Drizzle or a short shower"],
      ["none", "No rain", "Dry conditions"],
    ],
  },
  {
    id: "outlet",
    label: "Outlet",
    kicker: "Observation six · banks",
    q: "Can you see a pipe or drain entering nearby?",
    hint: "A quick look along both banks is enough.",
    options: [
      ["yes", "Yes", "A visible discharge point"],
      ["no", "No", "Nothing obvious"],
      ["unsure", "Not sure", "Could not inspect safely"],
    ],
  },
];
const LABELS = {
  clear: "Crystal clear",
  cloudy: "Slightly cloudy",
  murky: "Murky brown",
  green: "Greenish tint",
  none: "None",
  earthy: "Earthy",
  rotten: "Rotten egg / sewage",
  chemical: "Sharp or chemical",
  clean: "Nothing unusual",
  foam: "White foam patches",
  oily: "Rainbow film",
  litter: "Floating litter",
  algae: "Green algae mat",
  fish: "Fish",
  birds: "Water birds",
  frogs: "Frogs",
  insects: "Dragonflies / insects",
  heavy: "Heavy rain",
  light: "Light rain",
  yes: "Yes",
  no: "No",
  unsure: "Not sure",
};
const DED = {
  clarity: { clear: 0, cloudy: 8, murky: 18, green: 15 },
  smell: { none: 0, earthy: 5, rotten: 20, chemical: 25 },
  surface: { clean: 0, foam: 18, oily: 22, litter: 12, algae: 15 },
  wildlife: { fish: -5, birds: -3, frogs: -3, insects: -2, none: 0 },
  outlet: { yes: 10, no: 0, unsure: 3 },
};
const WHY = {
  cloudy: "Suspended particles reduce light below the surface.",
  murky: "Dense sediment blocks light and can smother aquatic habitat.",
  green: "A green tint often signals excess algae or nutrients.",
  earthy: "An earthy smell is usually natural, so the deduction is small.",
  rotten: "A sulfur smell points to decay consuming oxygen.",
  chemical: "A sharp odor can indicate detergents, fuel or another discharge.",
  foam: "Persistent foam can be linked to detergent or organic discharge.",
  oily: "A rainbow film can indicate fuel or lubricant contamination.",
  litter: "Floating waste fragments and threatens wildlife.",
  algae: "Dense algae can precede an oxygen crash.",
  yes: "A visible outlet raises the risk of a direct pollution source.",
  unsure: "An uninspected outlet leaves a small uncertainty.",
  fish: "Fish present are a positive ecological signal.",
  birds: "Feeding water birds suggest an active food web.",
  frogs: "Frogs are sensitive to environmental change.",
  insects: "Dragonflies and aquatic insects support the stream food web.",
};
const STORIES = {
  healthy: {
    title: "This stretch is showing the right signs.",
    eco: "Clear water, a clean surface and no strong odor are consistent with a functioning stream. Wildlife sightings strengthen that reading.",
    people:
      "Healthy urban streams cool neighborhoods, hold stormwater and make safer places for people to spend time.",
    action:
      "Return to the same spot once a month. A simple sequence of observations is more useful than a single perfect score.",
  },
  organic: {
    title: "Decay may be taking oxygen out of the water.",
    eco: "A rotten-egg smell is associated with oxygen-poor decomposition. Low dissolved oxygen stresses fish and aquatic insects.",
    people:
      "Stagnant, nutrient-rich pockets can also support mosquito breeding and should not be used for washing or play.",
    action:
      "Recheck after several dry days. If the smell persists, note the location and report it to your local authority.",
  },
  chemical: {
    title: "The water is showing a possible chemical signal.",
    eco: "Sharp odors, foam or oily films can be linked to detergent, fuel or other discharge. These pollutants can move through the food web.",
    people:
      "Avoid touching or using this water until it has been checked by the proper local authority.",
    action:
      "From a safe bank, note the nearest drain or outlet and the time you observed it. Do not collect a sample yourself.",
  },
  nutrients: {
    title: "The stream may be receiving too many nutrients.",
    eco: "Green water or algae mats can mean excess nutrient input. As algae die, decomposition can pull oxygen from the water.",
    people:
      "Dense blooms can irritate skin and may be unsafe for children and pets.",
    action:
      "Compare the same spot after rain and after three dry days. A persistent mat deserves a local water-quality report.",
  },
  litter: {
    title: "The visible problem is also an ecological one.",
    eco: "Floating plastic can entangle wildlife and break down into smaller fragments that remain in the ecosystem.",
    people:
      "Blocked drains and littered edges increase local flooding and make public water spaces less usable.",
    action:
      "Photograph the stretch from a safe place and organize or request a bank-side cleanup—without entering the water.",
  },
  sediment: {
    title: "Recent rain explains part of the murkiness.",
    eco: "Runoff carries soil into streams. A healthy stretch should begin clearing after a few dry days, though heavy sediment can still cover habitat.",
    people:
      "The silt itself may be natural; anything washed in with it—street oil or waste—is the larger concern.",
    action:
      "Check again after three or four dry days. If it is still very murky, look for erosion or a continuing discharge upstream.",
  },
};
const NOTES = [
  "Start with what your senses tell you. There are no trick questions.",
  "Clarity is easiest to judge near the edge, not from the middle of a bridge.",
  "A gentle waft is enough. Never put your face close to suspicious water.",
  "Edges and inlets hold clues the middle of a stream may hide.",
  "Stillness helps. Wildlife often appears after you stop moving.",
  "Rain changes context, not just the water level.",
  "Stay on firm ground. An unsafe angle is not worth a closer answer.",
];
const $ = (s) => document.querySelector(s),
  esc = (s) =>
    String(s || "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
const PLACE_SPAM =
  /\b(asdf\w*|qwerty\w*|zxcv\w*|abc+|xyz+|test|testing|random|somewhere|anywhere|anything|none|nothing|unknown|idk|n\/?a|place)\b/i;
const KEYBOARD_RUN =
  /(qwer|wert|erty|tyui|yuio|uiop|asdf|sdfg|dfgh|fghj|ghjk|hjkl|zxcv|xcvb|cvbn|vbnm)/i;
