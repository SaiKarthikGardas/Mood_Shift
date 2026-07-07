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

// Song data: curated per mood + language, 7 real distinct songs each.
// "happy" is kept exactly as the original untouched 21 IDs (now just reshaped
// into the same per-mood-per-language structure so getSongs() works uniformly).
const MOOD_DATA = {
  sad: {
    english: [
      { title: "Here Comes the Sun", videoId: "KQetemT1sWc", sub: "The Beatles" },
      { title: "Good as Hell", videoId: "SmbmeOgWsqE", sub: "Lizzo" },
      { title: "Walking on Sunshine", videoId: "iPUmE-tne5U", sub: "Katrina and the Waves" },
      { title: "Don't Stop Me Now", videoId: "HgzGwKwLmgM", sub: "Queen" },
      { title: "Best Day of My Life", videoId: "Y66j_BUCBMY", sub: "American Authors" },
      { title: "Happy", videoId: "ZbZSe6N_BXs", sub: "Pharrell Williams" },
      { title: "Three Little Birds", videoId: "HNBCVM4KbUM", sub: "Bob Marley" },
    ],
    hindi: [
      { title: "Zinda", videoId: "fP6MNznzVcQ", sub: "Bhaag Milkha Bhaag" },
      { title: "Ilahi", videoId: "fdubeMFwuGs", sub: "Yeh Jawaani Hai Deewani" },
      { title: "Gallan Goodiyaan", videoId: "jCEdTq3j-0U", sub: "Dil Dhadakne Do" },
      { title: "Nachde Ne Saare", videoId: "HgIW7P4dsXU", sub: "Baar Baar Dekho" },
      { title: "Sadda Haq", videoId: "p9DQINKZxWE", sub: "Rockstar" },
      { title: "Khaabon Ke Parinday", videoId: "R0XjwtP_iTY", sub: "Zindagi Na Milegi Dobara" },
      { title: "Subhanallah", videoId: "QYO6AlxiRE4", sub: "Yeh Jawaani Hai Deewani" },
    ],
    telugu: [
      { title: "Buttabomma", videoId: "2mDCVzruYzQ", sub: "Ala Vaikunthapurramuloo" },
      { title: "Ramuloo Ramulaa", videoId: "Bg8Yb9zGYyA", sub: "Ala Vaikunthapurramuloo" },
      { title: "Vachinde", videoId: "YFfEFbC9_XQ", sub: "Fidaa" },
      { title: "Yentha Sakkagunnave", videoId: "eABViudPBFE", sub: "Rangasthalam" },
      { title: "Inkem Inkem", videoId: "VkmXX_jKmZw", sub: "Geetha Govindam" },
      { title: "Adiga Adiga", videoId: "X-ItjQ3gIBI", sub: "Ninnu Kori" },
      { title: "Kanulanu Thaake", videoId: "30Bjg_7KuoE", sub: "Manam" },
    ],
  },

  stressed: {
    english: [
      { title: "Weightless", videoId: "UfcAVejslrU", sub: "Marconi Union" },
      { title: "Breathe Me", videoId: "ghPcYqn0p4Y", sub: "Sia" },
      { title: "Skinny Love", videoId: "Daz-_OLM-is", sub: "Bon Iver" },
      { title: "The Scientist", videoId: "RB-RcX5DS5A", sub: "Coldplay" },
      { title: "Holocene", videoId: "TWcyIpul8OE", sub: "Bon Iver" },
      { title: "River Flows in You", videoId: "7maJOI3QMu0", sub: "Yiruma" },
      { title: "Sunset Lover", videoId: "5hALH-s6ZkA", sub: "Petit Biscuit" },
    ],
    hindi: [
      { title: "Tum Ho", videoId: "VqFn3FvVjk4", sub: "Rockstar" },
      { title: "Iktara", videoId: "fSS_R91Nimw", sub: "Wake Up Sid" },
      { title: "Kun Faya Kun", videoId: "T94PHkuydcw", sub: "Rockstar" },
      { title: "Phir Se Ud Chala", videoId: "2mWaqsC3U7k", sub: "Rockstar" },
      { title: "Agar Tum Saath Ho", videoId: "xRb8hxwN5zc", sub: "Tamasha" },
      { title: "Zara Zara", videoId: "JgKw2UF821A", sub: "Rehnaa Hai Terre Dil Mein" },
      { title: "Tu Jaane Na", videoId: "P8PWN1OmZOA", sub: "Ajab Prem Ki Ghazab Kahani" },
    ],
    telugu: [
      { title: "Prapanchame Alaa", videoId: "l8_Ft77k8TE", sub: "Jersey" },
      { title: "Manasuni Patti", videoId: "6fYhlkyOhQA", sub: "RX100" },
      { title: "Sandram Lona Neerantha", videoId: "f9zE9O8eO4s", sub: "Uppena" },
      { title: "Unnatundi Gundey", videoId: "-twi5MBq1TQ", sub: "Ninnu Kori" },
      { title: "Uyyalaina Jampalaina", videoId: "Y41rYetwFeU", sub: "Uyyala Jampala" },
      { title: "Kallolam", videoId: "uOtgJmJIsio", sub: "Padi Padi Leche Manasu" },
      { title: "Choosi Chudangane", videoId: "3smrEURoJcM", sub: "Chalo" },
    ],
  },

  angry: {
    english: [
      { title: "Someone Like You", videoId: "hLQl3WQQoQ0", sub: "Adele" },
      { title: "Perfect", videoId: "2Vv-BfVoq4g", sub: "Ed Sheeran" },
      { title: "Stay", videoId: "JF8BRvqGCNs", sub: "Rihanna ft. Mikky Ekko" },
      { title: "All of Me", videoId: "450p7goxZqg", sub: "John Legend" },
      { title: "Thinking Out Loud", videoId: "lp-EO5I60KA", sub: "Ed Sheeran" },
      { title: "A Thousand Years", videoId: "rtOvBOTyX00", sub: "Christina Perri" },
      { title: "Photograph", videoId: "nSDgHBxUbVQ", sub: "Ed Sheeran" },
    ],
    hindi: [
      { title: "Channa Mereya", videoId: "bzSTpdcs-EI", sub: "Ae Dil Hai Mushkil" },
      { title: "Tera Ban Jaunga", videoId: "mQiiw7uRngk", sub: "Kabir Singh" },
      { title: "Phir Le Aya Dil", videoId: "Gqy01K0wQ_k", sub: "Barfi" },
      { title: "Tum Se Hi", videoId: "mt9xg0mmt28", sub: "Jab We Met" },
      { title: "Muskurane", videoId: "uuIl0_92Hj0", sub: "CityLights" },
      { title: "Bolna", videoId: "TjLOYEx4oT0", sub: "Kapoor & Sons" },
      { title: "Raabta", videoId: "zlt38OOqwDc", sub: "Agent Vinod" },
    ],
    telugu: [
      { title: "Chinni Chinni Aasalu", videoId: "sStyIIjGhzI", sub: "Manam" },
      { title: "Ninnu Kori", videoId: "gPDkCAMW4mY", sub: "Ninnu Kori" },
      { title: "Hrudayama", videoId: "W1sTXEDRCx4", sub: "Major" },
      { title: "Oh Isha", videoId: "HQHlvmpMDDs", sub: "Major" },
      { title: "Peniviti", videoId: "4oMO8IYwOos", sub: "Aravindha Sametha" },
      { title: "Nee Kannu Neeli Samudram", videoId: "zZl7vDDN8Ek", sub: "Uppena" },
      { title: "Ayyayayyo", videoId: "tZobZ2-XqFk", sub: "Aakasa Veedhullo" },
    ],
  },

  calm: {
    english: [
      { title: "You've Got a Friend", videoId: "eAR_Ff5A8Rk", sub: "Carole King" },
      { title: "Lean on Me", videoId: "gOZgo8gMIoM", sub: "Bill Withers" },
      { title: "Stand By Me", videoId: "hwZNL7QVJjE", sub: "Ben E. King" },
      { title: "Fix You", videoId: "k4V3Mo61fJM", sub: "Coldplay" },
      { title: "With a Little Help From My Friends", videoId: "0C58ttB2-Qg", sub: "The Beatles" },
      { title: "Count on Me", videoId: "6k8cpUkKK4c", sub: "Bruno Mars" },
      { title: "I'll Be There for You", videoId: "q-9kPks0IfE", sub: "The Rembrandts" },
    ],
    hindi: [
      { title: "Kabira", videoId: "jHNNMj5bNQw", sub: "Yeh Jawaani Hai Deewani" },
      { title: "Luka Chuppi", videoId: "FFpgYjL2aJo", sub: "Rang De Basanti" },
      { title: "Pee Loon", videoId: "D8XFTglfSMg", sub: "Once Upon A Time In Mumbaai" },
      { title: "Enna Sona", videoId: "mrdRHsIkK_c", sub: "OK Jaanu" },
      { title: "Hasi", videoId: "oyaudgo5_8Y", sub: "Hamari Adhuri Kahani" },
      { title: "Tum Hi Ho", videoId: "Umqb9KENgmk", sub: "Aashiqui 2" },
      { title: "Tujhe Kitna Chahne Lage", videoId: "AgX2II9si7w", sub: "Kabir Singh" },
    ],
    telugu: [
      { title: "Priyatama", videoId: "NKJxeRMogwA", sub: "Nuvvu Nenu" },
      { title: "Emitemitemito", videoId: "pfQlEHQKnqM", sub: "Arjun Reddy" },
      { title: "Preminche Premava", videoId: "qS9OmYoX2cQ", sub: "Nuvvu Nenu Prema" },
      { title: "Vellipothundhe", videoId: "Rj1bFgPSIfs", sub: "90ML" },
      { title: "Ranguladdhukunna", videoId: "9WHcoDTgt_A", sub: "Uppena" },
      { title: "Edo Jarugutondi", videoId: "x6N4ACkT1sQ", sub: "Fidaa" },
      { title: "Pillaa Raa", videoId: "5MtKkdEiJzk", sub: "RX100" },
    ],
  },

  // Untouched — original 21 IDs, just reshaped into the same structure.
  happy: {
    english: [
      { title: "Happy pick 1", videoId: "y6Sxv-sUYtM", sub: "English · curated pick" },
      { title: "Happy pick 2", videoId: "OPf0YbXqDm0", sub: "English · curated pick" },
      { title: "Happy pick 3", videoId: "JGwWNGJdvx8", sub: "English · curated pick" },
      { title: "Happy pick 4", videoId: "CevxZvSJLk8", sub: "English · curated pick" },
      { title: "Happy pick 5", videoId: "kJQP7kiw5Fk", sub: "English · curated pick" },
      { title: "Happy pick 6", videoId: "RgKAFK5djSk", sub: "English · curated pick" },
      { title: "Happy pick 7", videoId: "09R8_2nJtjg", sub: "English · curated pick" },
    ],
    hindi: [
      { title: "Happy pick 1", videoId: "BddP6PYo2gs", sub: "Hindi · curated pick" },
      { title: "Happy pick 2", videoId: "fP6MNznzVcQ", sub: "Hindi · curated pick" },
      { title: "Happy pick 3", videoId: "l_MyUGq7pgs", sub: "Hindi · curated pick" },
      { title: "Happy pick 4", videoId: "n4QK52sO720", sub: "Hindi · curated pick" },
      { title: "Happy pick 5", videoId: "bnqLzCsffwY", sub: "Hindi · curated pick" },
      { title: "Happy pick 6", videoId: "fdubeMFwuGs", sub: "Hindi · curated pick" },
      { title: "Happy pick 7", videoId: "9iIX4PBplAY", sub: "Hindi · curated pick" },
    ],
    telugu: [
      { title: "Happy pick 1", videoId: "2mDCVzruYzQ", sub: "Telugu · curated pick" },
      { title: "Happy pick 2", videoId: "OCg6BWlAXSw", sub: "Telugu · curated pick" },
      { title: "Happy pick 3", videoId: "Bg8Yb9zGYyA", sub: "Telugu · curated pick" },
      { title: "Happy pick 4", videoId: "OsU0CGZoV8E", sub: "Telugu · curated pick" },
      { title: "Happy pick 5", videoId: "J5b6NRiMO6Q", sub: "Telugu · curated pick" },
      { title: "Happy pick 6", videoId: "aotMkXvjXtc", sub: "Telugu · curated pick" },
      { title: "Happy pick 7", videoId: "fxajBSuxwRY", sub: "Telugu · curated pick" },
    ],
  },

  joyful: {
    english: [
      { title: "Uptown Funk", videoId: "OPf0YbXqDm0", sub: "Mark Ronson ft. Bruno Mars" },
      { title: "Can't Stop the Feeling!", videoId: "ru0K8uYEZWw", sub: "Justin Timberlake" },
      { title: "Levitating", videoId: "TUVcZfQe-Kw", sub: "Dua Lipa" },
      { title: "Blinding Lights", videoId: "4NRXx6U8ABQ", sub: "The Weeknd" },
      { title: "Physical", videoId: "9HDEHj2yzew", sub: "Dua Lipa" },
      { title: "Shut Up and Dance", videoId: "6JCLY0Rlx6Q", sub: "WALK THE MOON" },
      { title: "Good Time", videoId: "H7HmzwI67ec", sub: "Owl City & Carly Rae Jepsen" },
    ],
    hindi: [
      { title: "Malhari", videoId: "l_MyUGq7pgs", sub: "Bajirao Mastani" },
      { title: "Aankh Marey", videoId: "_KhQT-LGb-4", sub: "Simmba" },
      { title: "Kar Gayi Chull", videoId: "NTHz9ephYTw", sub: "Kapoor & Sons" },
      { title: "London Thumakda", videoId: "udra3Mfw2oo", sub: "Queen" },
      { title: "Ghungroo", videoId: "qFkNATtc3mc", sub: "War" },
      { title: "Dhoom Machale", videoId: "2uUmHTgT65I", sub: "Dhoom" },
      { title: "Nachan Farrate", videoId: "4dF1uxUTYZI", sub: "All Is Well" },
    ],
    telugu: [
      { title: "Naatu Naatu", videoId: "OsU0CGZoV8E", sub: "RRR" },
      { title: "Seeti Maar", videoId: "F5X694sak5U", sub: "DJ Duvvada Jagannadham" },
      { title: "Rangamma Mangamma", videoId: "GWWHI7SE0KQ", sub: "Rangasthalam" },
      { title: "Blockbuster", videoId: "FmjJ-e5uGuY", sub: "Sarrainodu" },
      { title: "Jai Balayya", videoId: "HgWgOii3SmQ", sub: "Akhanda" },
      { title: "Samajavaragamana", videoId: "OCg6BWlAXSw", sub: "Ala Vaikunthapurramuloo" },
      { title: "Vachaadayyo Saami", videoId: "PXrTQYMNc_I", sub: "Bharat Ane Nenu" },
    ],
  },
};

// Builds the 7-song list for a given mood + language
function getSongs(mood, lang) {
  const list = MOOD_DATA[mood][lang];
  return list.map((song, i) => ({
    id: `${mood}-${lang}-${i}`,
    title: song.title,
    sub: song.sub,
    videoId: song.videoId,
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
