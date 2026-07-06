# Mood Shift 🎶🔥

### 🚀 [**Try it live → mood-shift-six.vercel.app**](https://mood-shift-six.vercel.app)

Not just a music player — Mood Shift doesn't match your mood, it tries to change it.

Most "mood-based" music apps do the obvious thing: sad mood in, sad songs out. Mood Shift works the other way round. Tell it how you're actually feeling, pick a language, and it curates 7 tracks specifically chosen to move you toward a *better* mood — calming picks if you're stressed, upbeat ones if you're low, and so on — instead of just reflecting how you already feel back at you.

## How it works

1. **Pick your mood** — sad, stressed, angry, calm, happy, or joyful
2. **Pick a language** — English, Hindi, or Telugu
3. **Get 7 curated tracks**, playable right inside the app via an embedded YouTube player — no tab-switching

Each mood maps to a different *listening intent* rather than a mirror of the mood itself (e.g. picking "stressed" pulls calming, soothing tracks — not more stressed-out music). That mapping lives in `MOOD_SEARCH_INTENT` in `app.js`.

## Tech stack

- **React 18** (via CDN, no build tooling) + **Babel Standalone** for in-browser JSX
- **Vanilla CSS** — custom design system with CSS variables, no framework
- **YouTube IFrame embeds** for inline playback
- Deployed on **Vercel**

## Design

Built around a warm burgundy/gold "vinyl lounge" aesthetic — Playfair Display for headings, Manrope for body text, a spinning vinyl record that only spins while a track is playing, and floating musical notes drifting across the page. Fully responsive down to small phone screens.

## Project structure

```
├── index.html      # Page shell, loads React/Babel from CDN
├── app.js          # All app logic and components (single-file React app)
├── styles.css       # Design system + all styling
```

## Running it locally

No build step — just serve the folder:

```bash
git clone https://github.com/SaiKarthikGardas/Mood_Shift.git
cd Mood_Shift
npx serve .
```

Then open the local URL it gives you.

## Known limitation

Song data is currently a hand-picked static list rather than a live API call — a production version would swap this for a backend route hitting the YouTube Data API per mood/language, cached server-side. Also, a few embedded videos may occasionally redirect to YouTube instead of playing inline, since some official label channels restrict embedded playback on certain uploads — this is a YouTube-side restriction, not an app bug.

## What I'd build next

- Real backend (Node/Express) calling the YouTube Data API live instead of a static song list
- More languages + moods
- A "mood history" so recommendations adapt over multiple sessions

---

## About me 🔥

Hey, I'm **Gardas Sai Karthik** — I build things end to end, from the idea down to the pixel-level detail, and this project is a good example of that range. Mood Shift isn't just a UI exercise: the core idea (curate music to *shift* someone's mood rather than just match it) is a genuine product decision, then backed by a fully custom design system, hand-tuned animations (the vinyl spin, the tonearm drop, the staggered hero fade-ins), and a responsive layout that holds up from a MacBook down to a small phone screen — all shipped and live, not just a local prototype.

If you're a recruiter or a fellow builder skimming this: I care about the details most people skip — motion timing, empty states, comment clarity for whoever reads the code next — and I'd love to talk about how I'd bring that to your team.

📫 Reach me: [GitHub — SaiKarthikGardas](https://github.com/SaiKarthikGardas) · [saikarthikgardas@gmail.com](mailto:saikarthikgardas@gmail.com)
