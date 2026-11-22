# PARALLAX

PARALLAX is a responsive city scenario simulator for exploring population growth, road capacity, congestion, and derived infrastructure demand.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown by Vite. The prefilled login is a presentation-mode demo account.

## Quality checks

```bash
npm run lint
npm test
npm run coverage
npm run build
```

## Features

- Reusable React components, props, state, hooks, and Context API
- React Router protected routes
- Email/password registration and login
- Google login when Firebase is configured
- Local presentation authentication when Firebase is not configured
- External Open-Meteo API
- Saved scenario create, list, load, update, and delete operations
- Deterministic simulation formulas in `src/utils/simulation.js`
- Loading, error, and empty states
- Responsive Tailwind UI and complementary blue/orange palette
- Vitest and Testing Library tests
- GitHub Actions build/test workflow
- Netlify SPA configuration

## Firebase configuration

Copy `.env.example` to `.env`, create a Firebase project, enable Email/Password and Google providers, and enter the Firebase web-app values.

When these variables exist, authentication uses Firebase. When they do not, the app automatically uses an offline presentation fallback.

No Firebase secret or private credential is stored in source code. Firebase web configuration values are public client identifiers, while only the required environment variables should be supplied for deployment.

## Architecture

- `src/utils/simulation.js`: deterministic city calculations
- `src/context`: authentication state and protected-session data
- `src/pages`: login, registration, and dashboard screens
- `src/components`: reusable UI and route protection
- `src/services`: external APIs and scenario storage
- `docs/RUBRIC_EVIDENCE.md`: requirement evidence
- `docs/WIREFRAMES.md`: interface planning notes
- `public/wireframe.svg`: visual wireframe asset

## Presentation flow

1. Sign in with the prefilled presentation account or configure Firebase.
2. Increase population growth and observe demand metrics.
3. Change zones and explain the external weather context.
4. Add road capacity and show congestion improve.
5. Name and save a scenario.
6. Load and update the scenario, then delete it.
