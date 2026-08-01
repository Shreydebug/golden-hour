# Golden Hour

Find the perfect golden hour for wherever you are. Exact sunrise, sunset and
blue hour timings — plus weather, countdowns, an interactive map and nearby
photography spots.

A premium web experience built with Next.js 15, React 19, TypeScript,
Tailwind CSS v4, Framer Motion, shadcn/ui and Lucide icons.

## Features

- **Exact golden hour timings** — sunrise, sunset, solar noon, blue hour and
  twilight windows, computed with SunCalc for your exact coordinates
- **Live countdown** to the best photography window
- **Weather** — temperature, cloud cover, visibility, humidity, wind and more
  from Open-Meteo (no API key required)
- **Golden hour score** — astronomical quality adjusted for cloud cover
- **7-day forecast** of golden hour quality for each day
- **Interactive map** with Mapbox GL — your location plus nearby spots
- **Nearby photography spots** with ratings, crowd levels and directions
- **Dark mode** with a sky-phase-aware animated aurora background
- **Mobile-first** responsive design

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Mapbox (optional)

The interactive map needs a Mapbox access token:

1. Create one at <https://account.mapbox.com/access-tokens/>
2. Copy `.env.example` to `.env.local` and fill it in:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
```

Without a token the app works fully — the map section shows a graceful
fallback.

## Tech

- **SunCalc** — sun and moon times
- **Open-Meteo** — live weather (free, no key)
- **BigDataCloud** — reverse geocoding (free, no key)
- **Mapbox GL JS** — interactive map
- **Browser Geolocation API** — permission-aware location

## Project structure

```
src/
  app/          Next.js App Router (layout, page)
  components/   Reusable UI — hero, cards, map, spots, footer
  hooks/        use-location, use-golden-hour, use-weather, use-places…
  services/     Business logic — suncalc, weather, geocoding, places
  lib/          Design tokens, shared helpers
  store/        Zustand state (settings, favorites, location)
  styles/       Global styles and design system
  types/        Shared TypeScript types
  utils/        Formatters and scoring
public/         Static assets
```

## Deploy to Vercel

```bash
npm run build
```

Push to GitHub and import the repo at <https://vercel.com/new> — the build is
zero-config. Set `NEXT_PUBLIC_MAPBOX_TOKEN` in the project's environment
variables to enable the map.
