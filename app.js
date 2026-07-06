const { useState, useRef } = React;

// Mood + language config data
const MOOD_META = {
  sad:      { emoji: "😔", label: "Sad",      line: "Let me fix the mood for you… trust me, enjoy 🎶" },
  stressed: { emoji: "😮‍💨", label: "Stressed", line: "Let's ease that off you… breathe, and enjoy 🎧" },
  angry:    { emoji: "😤", label: "Angry",    line: "Let's cool things down a little… here you go 🎵" },
  calm:     { emoji: "🌙", label: "Calm",     line: "Nice and steady… here's something for you ✨" },
  happy:    { emoji: "🙂", label: "Happy",    line: "Glad to hear that… have fun with these! 🎉" },
  joyful:   { emoji: "🤩", label: "Joyful",   line: "Love that energy… let's keep it going! 🔥" },
};

// Maps each mood to the kind of music we want to shift you toward
const MOOD_SEARCH_INTENT = {
  sad: "feel good uplifting songs",
  stressed: "calm relaxing soothing songs",
  angry: "chill calm down music",
  calm: "peaceful acoustic music",
  happy: "feel good happy hits",
  joyful: "party dance upbeat songs",
};

const LANGUAGES = [
  { id: "english", label: "English", emoji: "🇬🇧" },
  { id: "hindi", label: "Hindi", emoji: "🇮🇳" },
  { id: "telugu", label: "Telugu", emoji: "🎭" },
];

// Song data: real YouTube video IDs per language, 7 per language
const LANGUAGE_VIDEO_IDS = {
  english: ["y6Sxv-sUYtM", "OPf0YbXqDm0", "JGwWNGJdvx8", "CevxZvSJLk8", "kJQP7kiw5Fk", "RgKAFK5djSk", "09R8_2nJtjg"],
  hindi:   ["BddP6PYo2gs", "fP6MNznzVcQ", "l_MyUGq7pgs", "n4QK52sO720", "bnqLzCsffwY", "fdubeMFwuGs", "9iIX4PBplAY"],
  telugu:  ["2mDCVzruYzQ", "OCg6BWlAXSw", "Bg8Yb9zGYyA", "OsU0CGZoV8E", "J5b6NRiMO6Q", "aotMkXvjXtc", "fxajBSuxwRY"],
};

// Builds the 7-song list for a given mood + language
function getSongs(mood, lang) {
  const intent = MOOD_SEARCH_INTENT[mood];
  const ids = LANGUAGE_VIDEO_IDS[lang];
  return ids.map((videoId, i) => ({
    id: `${mood}-${lang}-${i}`,
    title: `${intent[0].toUpperCase() + intent.slice(1)} · Track ${i + 1}`,
    sub: `${LANGUAGES.find(l => l.id === lang).label} · curated pick`,
    videoId,
  }));
}

// Decorative floating notes drifting in the side margins
function FloatingNotes() {
  const notes = [
    { s: "🎵", top: "4%",  left: "6%",  size: 36, dur: 9,  delay: 0 },
    { s: "♪",  top: "14%", left: "3%",  size: 28, dur: 7,  delay: 1.2 },
    { s: "🎶", top: "26%", left: "9%",  size: 34, dur: 10, delay: 0.4 },
    { s: "✨", top: "38%", left: "5%",  size: 26, dur: 8,  delay: 2 },
    { s: "🎧", top: "50%", left: "11%", size: 38, dur: 11, delay: 0.8 },
    { s: "♫",  top: "62%", left: "4%",  size: 30, dur: 7.5,delay: 1.6 },
    { s: "🎼", top: "74%", left: "8%",  size: 32, dur: 9,  delay: 0.5 },
    { s: "🎶", top: "86%", left: "5%",  size: 28, dur: 8.5,delay: 1.9 },
    { s: "♪",  top: "96%", left: "10%", size: 34, dur: 10, delay: 0.2 },

    { s: "🎶", top: "6%",  left: "92%", size: 34, dur: 8.5,delay: 0.6 },
    { s: "♪",  top: "16%", left: "95%", size: 28, dur: 9.5,delay: 0 },
    { s: "🎵", top: "28%", left: "90%", size: 36, dur: 7,  delay: 1.8 },
    { s: "🎼", top: "40%", left: "94%", size: 30, dur: 10.5,delay: 1 },
    { s: "✨", top: "52%", left: "89%", size: 26, dur: 8,  delay: 2.4 },
    { s: "🎧", top: "64%", left: "93%", size: 38, dur: 9,  delay: 0.3 },
    { s: "♫",  top: "76%", left: "91%", size: 30, dur: 7.8,delay: 1.4 },
    { s: "🎶", top: "88%", left: "95%", size: 32, dur: 9.2,delay: 0.9 },
    { s: "🎵", top: "97%", left: "88%", size: 28, dur: 8,  delay: 2.1 },
  ];
  return (
    <div className="floating-notes" aria-hidden="true">
      {notes.map((n, i) => (
        <span
          key={i}
          className="floating-note"
          style={{
            top: n.top,
            left: n.left,
            fontSize: `${n.size}px`,
            animationDuration: `${n.dur}s`,
            animationDelay: `${n.delay}s`,
          }}
        >
          {n.s}
        </span>
      ))}
    </div>
  );
}

// Spinning vinyl + tonearm shown in the hero
function Vinyl({ playing }) {
  return (
    <div className="vinyl-wrap">
      <div className={`vinyl ${playing ? "playing" : ""}`}>
        <div className="vinyl-label">MS</div>
        <div className="vinyl-hole"></div>
      </div>
      <div className={`tonearm ${playing ? "dropped" : ""}`}>
        <svg viewBox="0 0 60 60">
          <circle cx="48" cy="10" r="6" fill="#C9A667" />
          <line x1="48" y1="10" x2="14" y2="48" stroke="#C9A667" strokeWidth="3" strokeLinecap="round" />
          <circle cx="14" cy="48" r="3" fill="#E4C589" />
        </svg>
      </div>
    </div>
  );
}

// The 3-dot progress indicator under the hero
function StepThread({ step }) {
  const steps = [0, 1, 2, 3];
  return (
    <div className="step-thread">
      {steps.map((s) => (
        <div key={s} className={`step-dot ${s === step ? "active" : s < step ? "done" : ""}`}></div>
      ))}
    </div>
  );
}

// Reusable chat bubble for Karthik's lines
function KarthikLine({ children }) {
  return (
    <div className="karthik-line">
      <div className="karthik-avatar">K</div>
      <div className="karthik-bubble">
        <span className="karthik-name">Karthik · your music expert</span>
        {children}
      </div>
    </div>
  );
}

// Top-level app: drives the mood -> language -> song flow
function App() {
  const [mood, setMood] = useState(null);
  const [lang, setLang] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);
  const playerRef = useRef(null);

  const step = !mood ? 0 : !lang ? 1 : 2;

  const songs = mood && lang ? getSongs(mood, lang) : [];

  function handleRestart() {
    setMood(null);
    setLang(null);
    setNowPlaying(null);
  }

  function handlePlay(song) {
    setNowPlaying(song);
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  return (
    <div className="app-bg">
      <FloatingNotes />
      <div className="container">

        <section className="hero">
          <span className="hero-eyebrow">Gardas Sai Karthik</span>
          <h1 className="hero-title">Mood Shift</h1>
          <p className="hero-tagline">Not just music. A mood, gently rewritten.</p>
          <p className="hero-desc">
            Most players match your mood — sad music for a sad day, hype for a happy one.
            Mood Shift works the other way round: it listens for one honest answer,
            then curates seven tracks built to move you somewhere better. One question.
            One language. Seven songs, chosen with intent.
          </p>
          <Vinyl playing={!!nowPlaying} />
        </section>

        <StepThread step={step} />

        <div className="card">

          {/* Step 1: pick a mood */}
          {!mood && (
            <>
              <KarthikLine>
                Hey, hope you're doing well today 🎧 What's the mood right now?
              </KarthikLine>
              <div className="option-grid mood-grid">
                {Object.entries(MOOD_META).map(([id, m]) => (
                  <button key={id} className="option-btn" onClick={() => setMood(id)}>
                    <span className="emoji">{m.emoji}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: pick a language */}
          {mood && !lang && (
            <>
              <KarthikLine>{MOOD_META[mood].line}</KarthikLine>
              <div className="option-grid">
                {LANGUAGES.map((l) => (
                  <button key={l.id} className="option-btn" onClick={() => setLang(l.id)}>
                    <span className="emoji">{l.emoji}</span>
                    {l.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 3: show the 7 song picks + inline player */}
          {mood && lang && (
            <>
              <KarthikLine>
                Here are 7 picks in {LANGUAGES.find(l => l.id === lang).label} for you 🎶
              </KarthikLine>

              <div className="song-list">
                {songs.map((song, i) => (
                  <div
                    key={song.id}
                    className={`song-row ${nowPlaying?.id === song.id ? "now-playing" : ""}`}
                    onClick={() => handlePlay(song)}
                  >
                    <span className="song-index">{String(i + 1).padStart(2, "0")}</span>
                    <div className="song-info">
                      <div className="song-title">{song.title}</div>
                      <div className="song-sub">{song.sub}</div>
                    </div>
                    <div className="play-icon">▶</div>
                  </div>
                ))}
              </div>

              {nowPlaying && (
                <div className="player-embed" ref={playerRef}>
                  <iframe
                    src={`https://www.youtube.com/embed/${nowPlaying.videoId}?autoplay=1`}
                    title={nowPlaying.title}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <span className="restart-link" onClick={handleRestart}>
                ↺ start over with a new mood
              </span>
            </>
          )}

        </div>

        <p className="footer-note">♪ Mood Shift · a Gardas Sai Karthik project ♪</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);