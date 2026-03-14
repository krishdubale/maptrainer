# 🗺️ Map Trainer — BGMI Erangel

A browser-based location-guessing trainer for **Battlegrounds Mobile India (BGMI) Erangel**.  
Study the map, identify where in-game screenshots were taken, click your guess, and rack up points.  
Think of it as **GeoGuessr for BGMI**.

---

## Features

### Gameplay
- **Click-to-guess** — pan and zoom the full Erangel map, then drop a pin on your answer
- **Distance scoring** — score 0–1000 per round based on how close your guess is (exponential decay)
- **Round results** — after each guess the map zooms to show your pin vs. the real location, with distance and score
- **Final scoreboard** — tier rating (S / A / B / C / D), per-round breakdown, best & worst round highlights
- **"New Personal Best" badge** — displayed on game-over when you beat your stored record

### Game Modes

| Mode | Rounds | Timer | Goal |
|---|---|---|---|
| 🎯 Classic | 5 | 30 s/round | Balanced competitive warm-up |
| ⚡ Blitz | 10 | 10 s/round | Speed-runs and reaction training |
| 📖 Practice | 15 | None | Learn every callout at your own pace |

### Scoring Tiers

| Tier | Label | Avg score required |
|---|---|---|
| **S** | Conqueror | ≥ 900 |
| **A** | Ace | ≥ 700 |
| **B** | Crown | ≥ 500 |
| **C** | Platinum | ≥ 300 |
| **D** | Bronze | < 300 |

### Persistence
- Per-mode personal best scores stored in `localStorage`
- Lifetime games-played counter (global + per mode)
- Sound preference persisted across sessions

### UX
- Sound effects (synthesised via Web Audio API — no external audio files required)
- Settings panel to toggle sound on/off
- Keyboard shortcuts: **Enter / Space** → confirm guess or advance; **Escape** → quit to home
- Smooth CSS animations (fade-in, slide-in, score pop)
- Responsive design

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install

```bash
git clone https://github.com/krishdubale/maptrainer.git
cd maptrainer
npm install
```

### Development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

---

## How to Play

1. Pick a **game mode** from the home screen.
2. A screenshot from somewhere on Erangel appears on the left.
3. **Pan and zoom** the map on the right to find the location.
4. **Click** the map to drop your guess pin — you can reposition it before confirming.
5. Press **Confirm Guess** (or **Enter**) to submit.
6. The map zooms to show your pin and the correct answer, with your score and distance.
7. Press **Next** (or **Enter**) to continue to the next round.
8. After all rounds, see your final tier and detailed breakdown.

---

## Scoring Formula

Score per round = `max(0, round(1000 × e^(−distance × 6)))`

Where `distance` is the normalised Euclidean distance on the 8192 × 8192 pixel map.

| Accuracy | Approx. score |
|---|---|
| Within ~50 m | 950 – 1000 |
| Within ~200 m | 700 – 950 |
| Within ~500 m | 300 – 700 |
| Within ~800 m | 50 – 300 |
| > 1 km off | 0 |

The Erangel map represents an 8 km × 8 km area, so `normalised_distance × 8000 = metres`.

---

## Adding Locations

Edit **`src/data/locations.js`** and add an entry:

```js
{
  id: 16,
  name: "My Spot",
  x: 0.52,     // normalised X (0 = left edge, 1 = right edge)
  y: 0.44,     // normalised Y (0 = top edge, 1 = bottom edge)
  image: "/my-screenshot.png",   // place in /public
  zone: "warm",                  // "hot" | "warm" | "cold"
  difficulty: 3,                 // 1 (easy) – 5 (hard)
  hint: "A short clue for practice mode",
},
```

Then drop the screenshot file into `/public/` and restart the dev server.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 + Vite 7 |
| Map rendering | Leaflet + react-leaflet (CRS.Simple image overlay) |
| Styling | Plain CSS with CSS custom properties (no framework) |
| Sound | Web Audio API (synthesised, no external assets) |
| State management | Custom `useGameState` hook |
| Persistence | `localStorage` |

---

## Project Structure

```
src/
├── App.jsx                  # Root — wires game state, sound, settings
├── main.jsx
├── index.css                # Global design tokens and utility classes
│
├── components/
│   ├── Header.jsx           # Top HUD (logo, round counter, score, quit)
│   ├── HomeScreen.jsx       # Mode selection + per-mode stats + settings
│   ├── GameScreen.jsx       # Screenshot panel + Leaflet map
│   ├── MapView.jsx          # Leaflet map with guess/actual markers
│   ├── Timer.jsx            # Canvas ring timer
│   ├── RoundResult.jsx      # Bottom-bar result overlay (score, distance)
│   ├── GameOver.jsx         # Final scoreboard + tier + round history
│   └── SettingsPanel.jsx    # Sound toggle, keyboard shortcut reference
│
├── hooks/
│   ├── useGameState.js      # All game logic, phases, timer, scoring
│   └── useSound.js          # Web Audio API sound effects
│
└── data/
    └── locations.js         # Erangel location database + helpers
```

---

## Roadmap

- [ ] More location entries (community contributions welcome)
- [ ] Heatmap overlay showing where you tend to guess wrong
- [ ] Daily challenge mode (same seed for all players that day)
- [ ] Multiplayer head-to-head (same round, compare scores live)
- [ ] Additional BGMI maps (Miramar, Sanhok, Vikendi)
- [ ] Mobile-friendly touch controls

---

## Contributing

Pull requests are welcome! If you add new locations, please verify the `x/y` coordinates against the in-game minimap and include a clear screenshot.

---

## License

MIT
