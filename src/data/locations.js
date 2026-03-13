/**
 * BGMI Erangel Location Database
 *
 * Each location has:
 *  - id: unique identifier
 *  - name: callout / location name
 *  - x, y: normalized coords (0–1) on the 8192×8192 Erangel map
 *  - image: path to the in-game screenshot in /public
 *  - zone: "hot" | "warm" | "cold" (drop classification)
 *  - difficulty: 1–5 (how hard to recognize)
 *  - hint: a short clue shown in Practice mode
 *
 * To add more locations:
 *  1. Take an in-game screenshot
 *  2. Save it to /public  (e.g. /public/myspot.png)
 *  3. Add an entry below with the correct x/y from the map
 */

const locations = [
  {
    id: 1,
    name: "Pochinki Center",
    x: 0.3799,
    y: 0.6208,
    image: "/sample1.png",
    zone: "hot",
    difficulty: 2,
    hint: "One of the most contested urban areas in competitive play",
  },
  {
    id: 2,
    name: "School Rooftop",
    x: 0.5123,
    y: 0.4332,
    image: "/sample2.png",
    zone: "hot",
    difficulty: 1,
    hint: "Iconic early-game fight spot south of Rozhok",
  },
  {
    id: 3,
    name: "Georgopol Containers",
    x: 0.2345,
    y: 0.2456,
    image: "/sample1.png",
    zone: "hot",
    difficulty: 3,
    hint: "Port city on the west coast known for container loot",
  },
  {
    id: 4,
    name: "Military Base",
    x: 0.6012,
    y: 0.8734,
    image: "/sample2.png",
    zone: "hot",
    difficulty: 2,
    hint: "Southern island — highest tier loot in the game",
  },
  {
    id: 5,
    name: "Rozhok Hill",
    x: 0.4888,
    y: 0.3567,
    image: "/sample1.png",
    zone: "warm",
    difficulty: 3,
    hint: "Elevated town near the center of the map",
  },
  {
    id: 6,
    name: "Yasnaya Polyana",
    x: 0.6834,
    y: 0.3021,
    image: "/sample2.png",
    zone: "warm",
    difficulty: 2,
    hint: "Large eastern city with apartment buildings",
  },
  {
    id: 7,
    name: "Sosnovka Bridge",
    x: 0.5200,
    y: 0.7600,
    image: "/sample1.png",
    zone: "hot",
    difficulty: 1,
    hint: "Connects the mainland to Military Island",
  },
  {
    id: 8,
    name: "Shelter",
    x: 0.4321,
    y: 0.5234,
    image: "/sample2.png",
    zone: "warm",
    difficulty: 4,
    hint: "Underground bunker complex in the center",
  },
  {
    id: 9,
    name: "Ruins",
    x: 0.3456,
    y: 0.3456,
    image: "/sample1.png",
    zone: "cold",
    difficulty: 4,
    hint: "Ancient stone structures northwest of Rozhok",
  },
  {
    id: 10,
    name: "Mylta Power",
    x: 0.7234,
    y: 0.5678,
    image: "/sample2.png",
    zone: "warm",
    difficulty: 3,
    hint: "Power plant on the eastern coast",
  },
  {
    id: 11,
    name: "Primorsk",
    x: 0.2100,
    y: 0.7200,
    image: "/sample1.png",
    zone: "cold",
    difficulty: 3,
    hint: "Quiet coastal town in the southwest",
  },
  {
    id: 12,
    name: "Novorepnoye",
    x: 0.6700,
    y: 0.8500,
    image: "/sample2.png",
    zone: "warm",
    difficulty: 3,
    hint: "Container yard on the southern island",
  },
  {
    id: 13,
    name: "Stalber",
    x: 0.7500,
    y: 0.1800,
    image: "/sample1.png",
    zone: "cold",
    difficulty: 5,
    hint: "Hilltop lookout in the far northeast",
  },
  {
    id: 14,
    name: "Lipovka",
    x: 0.7800,
    y: 0.3800,
    image: "/sample2.png",
    zone: "cold",
    difficulty: 4,
    hint: "Small village east of Yasnaya",
  },
  {
    id: 15,
    name: "Zharki",
    x: 0.1500,
    y: 0.1700,
    image: "/sample1.png",
    zone: "cold",
    difficulty: 5,
    hint: "Remote village in the far northwest corner",
  },
];

/** Shuffle an array (Fisher-Yates) */
export function shuffleLocations(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Filter locations by zone */
export function filterByZone(zone) {
  if (!zone || zone === "all") return locations;
  return locations.filter((loc) => loc.zone === zone);
}

/** Get a subset of N random locations */
export function getRandomLocations(n, zone = "all") {
  const pool = filterByZone(zone);
  return shuffleLocations(pool).slice(0, Math.min(n, pool.length));
}

export default locations;
