# 🗺️ Armenia Interactive Map

An interactive, data-driven map of Armenia's 11 regions (marzes), built with [Leaflet.js](https://leafletjs.com/) and OpenStreetMap. Visualize regional statistics across 15 layers and toggle real-time weather across major cities.

---

## Features

- **15 data layers** — switch between population, schools, TUMO centers, streets, sea level, villages, rivers, area size, banks, tourism, hospitals, universities, air quality, historical monuments, and wineries
- **Choropleth coloring** — each region is color-coded by the selected metric for quick visual comparison
- **Real-time weather** — click any region or toggle the weather button to see live temperature, conditions, wind speed, humidity, and feels-like temperature (powered by [Open-Meteo](https://open-meteo.com/))
- **Region search** — type a region name (e.g. `Yerevan`, `Aragatsotn`) to zoom in and highlight it
- **Interactive popups** — hover to highlight a region; click for weather details
- **Info panel** — shows the current data value for the highlighted region
- **Scale control** — metric scale bar for spatial reference

---

## Project Structure

```
Map/
├── index.html          # App entry point
├── script.js           # Map logic, data loading, weather, search
├── style.css           # Layout and UI styles
└── data/
    ├── armenia-simple.geojson      # Regional boundary polygons
    ├── air_quality.json
    ├── banks.json
    ├── historical_monuments.json
    ├── hospitals.json
    ├── population.json
    ├── rivers.json
    ├── schools.json
    ├── sea_level.json
    ├── sizes.json
    ├── streets.json
    ├── tourism.json
    ├── tumo.json
    ├── universities.json
    ├── villages.json
    └── wineries.json
```

---

## Getting Started

Because the app fetches local JSON files, it must be served over HTTP (browsers block `file://` fetches).

**Option 1 — Python (no install needed):**
```bash
cd Map
python3 -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000).

**Option 2 — Node.js (`npx`):**
```bash
cd Map
npx serve .
```

**Option 3 — VS Code Live Server:**
Open the `Map/` folder in VS Code and click **Go Live** in the status bar.

---

## Data Format

Each data file is a simple JSON object mapping region names to numeric values:

```json
{
  "Erevan": 1070000,
  "Aragatsotn": 129000,
  "Ararat": 260000,
  ...
}
```

The TUMO layer uses binary values (`1` = has a TUMO center, `0` = does not).

> **Note:** Yerevan is stored as `"Erevan"` and Vayots Dzor as `"VayotsDzor"` in the data files to match the GeoJSON property names. This mapping is handled automatically in `script.js`.

---

## Dependencies

All loaded from CDN — no build step or `npm install` required.

| Library | Version | Purpose |
|---|---|---|
| [Leaflet.js](https://leafletjs.com/) | 1.9.4 | Map rendering and controls |
| [OpenStreetMap](https://www.openstreetmap.org/) | — | Tile layer |
| [Open-Meteo API](https://open-meteo.com/) | — | Free real-time weather data |

---

## Adding or Updating Data

1. Open the relevant file in `data/` (e.g. `hospitals.json`).
2. Update the numeric value for the region you want to change.
3. Reload the page — no rebuild needed.

To add a new data layer:
1. Create `data/your_layer.json` following the same key-value format.
2. Add a color function `getYourLayerColor(v)` in `script.js`.
3. Add a button in `index.html` with `data-type="your_layer"`.
4. Add a branch for `your_layer` inside the `style()` function in `script.js`.

---

## Attribution

- Map tiles © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- Weather data by [Open-Meteo](https://open-meteo.com/) (free, no API key required)
- Built at [TUMO Center for Creative Technologies](https://tumo.org/)
