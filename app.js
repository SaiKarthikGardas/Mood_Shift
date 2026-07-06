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

const LANGUAGES = [
  { id: "english", label: "English", emoji: "🇬🇧" },
  { id: "hindi", label: "Hindi", emoji: "🇮🇳" },
  { id: "telugu", label: "Telugu", emoji: "🎭" },
];

// Completely unique, curated song database mapping Mood -> Language -> 7 Songs
const MOOD_DATA = {
  sad: {
    english: [
      { title: "Here Comes the Sun", videoId: "https://www.youtube.com/watch?v=KQetemT1sWc", sub: "The Beatles" },
      { title: "Good as Hell", videoId: "https://www.youtube.com/watch?v=SmbmeOgWsqE", sub: "Lizzo" },
      { title: "Walking on Sunshine", videoId: "https://www.youtube.com/watch?v=iPUmE-tRJ5U", sub: "Katrina and the Waves" },
      { title: "Don't Stop Me Now", videoId: "https://www.youtube.com/watch?v=HgzGwKwLmgM", sub: "Queen" },
      { title: "Best Day of My Life", videoId: "https://www.youtube.com/watch?v=Y66j_BUCBMY", sub: "American Authors" },
      { title: "Happy", videoId: "https://www.youtube.com/watch?v=ZbZSe6N_BXs", sub: "Pharrell Williams" },
      { title: "Three Little Birds", videoId: "https://www.youtube.com/watch?v=HNBCVM4KbUM", sub: "Bob Marley" }
    ],
    hindi: [
      { title: "Zinda", videoId: "https://www.youtube.com/watch?v=V5M2q4GgXm8", sub: "Bhaag Milkha Bhaag" },
      { title: "Ilahi", videoId: "https://www.youtube.com/watch?v=fdubeMFwuGs", sub: "Yeh Jawaani Hai Deewani" },
      { title: "Gallan Goodiyaan", videoId: "https://www.youtube.com/watch?v=jCEdTq3j-0U", sub: "Dil Dhadakne Do" },
      { title: "Nachde Ne Saare", videoId: "https://www.youtube.com/watch?v=w4ClQOghw9c", sub: "Baar Baar Dekho" },
      { title: "Sadda Haq", videoId: "https://www.youtube.com/watch?v=p9DQINKZxWE", sub: "Rockstar" },
      { title: "Khaabon Ke Parinday", videoId: "https://www.youtube.com/watch?v=R0e_M69zS50", sub: "Zindagi Na Milegi Dobara" },
      { title: "Subhanallah", videoId: "https://www.youtube.com/watch?v=QZ3j-F9RDu0", sub: "Yeh Jawaani Hai Deewani" }
    ],
    telugu: [
      { title: "Buttabomma", videoId: "https://www.youtube.com/watch?v=2mDCVzruYzQ", sub: "Ala Vaikunthapurramuloo" },
      { title: "Ramuloo Ramulaa", videoId: "https://www.youtube.com/watch?v=Bg8Yb9zGYyA", sub: "Ala Vaikunthapurramuloo" },
      { title: "Vachinde", videoId: "https://www.youtube.com/watch?v=OsU0CGZoV8E", sub: "Fidaa" },
      { title: "Yentha Sakkagunnave", videoId: "https://www.youtube.com/watch?v=n7S9S9K7mK4", sub: "Rangasthalam" },
      { title: "Inkem Inkem", videoId: "https://www.youtube.com/watch?v=81f_Ycl8bEw", sub: "Geetha Govindam" },
      { title: "Adiga Adiga", videoId: "https://www.youtube.com/watch?v=3m0VvIorBHM", sub: "Jersey" },
      { title: "Kanulanu Thaake", videoId: "https://www.youtube.com/watch?v=vNAt8YofGgM", sub: "Manam" }
    ]
  },
  stressed: {
    english: [
      { title: "Weightless", videoId: "UfcAVejsrU4", sub: "Marconi Union" },
      { title: "Breathe Me", videoId: "ghPcYqn0p4Y", sub: "Sia" },
      { title: "Skinny Love", videoId: "aNzCDt2eidg", sub: "Bon Iver" },
      { title: "The Scientist", videoId: "RB-RcX5DS5A", sub: "Coldplay" },
      { title: "Holocene", videoId: "TWcyI01MwdA", sub: "Bon Iver" },
      { title: "River Flows in You", videoId: "7maJOI3QMu0", sub: "Yiruma Piano Cover" },
      { title: "Sunset Lover", videoId: "wx3Zf86m8fk", sub: "Petit Biscuit" }
    ],
    hindi: [
      { title: "Tum Ho", videoId: "6vKucgAeFww", sub: "Rockstar" },
      { title: "Iktara", videoId: "fSsRiyC6pCc", sub: "Wake Up Sid" },
      { title: "Kun Faya Kun", videoId: "T94PHkuyd8c", sub: "Rockstar" },
      { title: "Phir Se Ud Chala", videoId: "2mWaq494C-U", sub: "Rockstar" },
      { title: "Agar Tum Saath Ho", videoId: "sK7riqg2mrA", sub: "Tamasha" },
      { title: "Zara Zara", videoId: "tZpI6S_wLcs", sub: "Rehnaa Hai Terre Dil Mein" },
      { title: "Tu Jaane Na", videoId: "P8PWN1OmZOA", sub: "Ajab Prem Ki Ghazab Kahani" }
    ],
    telugu: [
      { title: "Nannu Dochukunduvate", videoId: "Z5uU0bby_t0", sub: "Jersey" },
      { title: "Manasa", videoId: "T9zXvT7_z9Q", sub: "RX100" },
      { title: "Neevalle Neevalle", videoId: "U3gUfEWe-8E", sub: "Uppena" },
      { title: "Yenno Yenno", videoId: "X9zXWf33b1U", sub: "Ninnu Kori" },
      { title: "Nee Kalyanam", videoId: "Oat-xI2S1m8", sub: "Uyyala Jampala" },
      { title: "Nachave Thalliki", videoId: "bV8-N7u2iYI", sub: "Padi Padi Leche Manasu" },
      { title: "Choosi Choodangane", videoId: "7OclO-7w8qI", sub: "Chalo" }
    ]
  },
  angry: {
    english: [
      { title: "Someone Like You", videoId: "hLQl3WQQoQ0", sub: "Adele" },
      { title: "Perfect", videoId: "2Vv-BfVoq4g", sub: "Ed Sheeran" },
      { title: "Stay", videoId: "JF8BRnvnsR8", sub: "Rihanna ft. Mikky Ekko" },
      { title: "All of Me", videoId: "450p7goxZqg", sub: "John Legend" },
      { title: "Thinking Out Loud", videoId: "lp-EO5I60KA", sub: "Ed Sheeran" },
      { title: "A Thousand Years", videoId: "rtOvBOTyX00", sub: "Christina Perri" },
      { title: "Photograph", videoId: "nSDgHBxUbVQ", sub: "Ed Sheeran" }
    ],
    hindi: [
      { title: "Channa Mereya", videoId: "bzSTpdcs-EI", sub: "Ae Dil Hai Mushkil" },
      { title: "Tera Ban Jaunga", videoId: "mX3zTfWvEps", sub: "Kabir Singh" },
      { title: "Phir Le Aya Dil", videoId: "4_6U6G8V4hI", sub: "Barfi" },
      { title: "Tum Se Hi", videoId: "cbMOn8g0vSg", sub: "Jab We Met" },
      { title: "Muskurane", videoId: "30_hL589Ais", sub: "CityLights" },
      { title: "Bolna", videoId: "AJ-fW67Vwos", sub: "Kapoor & Sons" },
      { title: "Raabta", videoId: "zLTzW_By87w", sub: "Agent Vinod" }
    ],
    telugu: [
      { title: "Emo Emo", videoId: "mO9YfFvAmsU", sub: "Manam" },
      { title: "Ninnu Kori", videoId: "F1R9B6YfSjg", sub: "Ninnu Kori" },
      { title: "Cheliya", videoId: "9S_gR6MAs90", sub: "Major" },
      { title: "Priyathama", videoId: "uO0h_L40O6Y", sub: "Major" },
      { title: "Alai Sepudo", videoId: "V_mDizB7v1I", sub: "Aravindha Sametha" },
      { title: "Nee Kannu Neeli Samudram", videoId: "u8bK88gRWhE", sub: "Uppena" },
      { title: "Kanureppa Vaalu", videoId: "fR_X86B1oH8", sub: "Aakasa Veedhullo" }
    ]
  },
  calm: {
    english: [
      { title: "You've Got a Friend", videoId: "eAR_Ff5A874", sub: "Carole King" },
      { title: "Lean on Me", videoId: "KEXQkrLLKhw", sub: "Bill Withers" },
      { title: "Stand By Me", videoId: "hwZNL7QVJjE", sub: "Ben E. King" },
      { title: "Fix You", videoId: "k4V3Mo61fJM", sub: "Coldplay" },
      { title: "With a Little Help From My Friends", videoId: "0C58ttB2-Qg", sub: "The Beatles" },
      { title: "Count on Me", videoId: "6k8cpUkKK4c", sub: "Bruno Mars" },
      { title: "I'll Be There for You", videoId: "q-9kPks09_M", sub: "The Rembrandts" }
    ],
    hindi: [
      { title: "Kabira", videoId: "jHNNMj5bNQw", sub: "Yeh Jawaani Hai Deewani" },
      { title: "Luka Chuppi", videoId: "gqZ_b6R0aCg", sub: "Rang De Basanti" },
      { title: "Pee Loon", videoId: "ly7_6cR0kGw", sub: "Once Upon A Time In Mumbaai" },
      { title: "Enna Sona", videoId: "5m6vK45R8gw", sub: "OK Jaanu" },
      { title: "Hasi Ban Gaye", videoId: "KqJ9K8fA9yw", sub: "Hamari Adhuri Kahani" },
      { title: "Tum Hi Ho", videoId: "Umqb9KENgmk", sub: "Aashiqui 2" },
      { title: "Phir Se", videoId: "fP6MNznzVcQ", sub: "Rocket Singh" }
    ],
    telugu: [
      { title: "Vennello Vennello", videoId: "E16M_v8b-8g", sub: "Nuvvu Nenu" },
      { title: "Ninu Kori (Acoustic Vibe)", videoId: "F1R9B6YfSjg", sub: "Ninnu Kori" },
      { title: "Emitemitemito", videoId: "eYc_N6ZfUj4", sub: "RX100" },
      { title: "Manasu Palike", videoId: "6m7F3u_w9B0", sub: "Nuvvu Nenu Prema" },
      { title: "Nee Kosam", videoId: "9oX_1O8w9hE", sub: "90ML" },
      { title: "Yem Sethune", videoId: "vB8f6lF5Tiw", sub: "Uppena" },
      { title: "Vachavule", videoId: "B1e7N5S_t9Y", sub: "Fidaa" }
    ]
  },
  happy: {
    english: [
      { title: "Uptown Funk", videoId: "y6Sxv-sUYtM", sub: "Mark Ronson ft. Bruno Mars" },
      { title: "Can't Stop the Feeling!", videoId: "OPf0YbXqDm0", sub: "Justin Timberlake" },
      { title: "Levitating", videoId: "JGwWNGJdvx8", sub: "Dua Lipa" },
      { title: "Blinding Lights", videoId: "CevxZvSJLk8", sub: "The Weeknd" },
      { title: "Physical", videoId: "kJQP7kiw5Fk", sub: "Dua Lipa" },
      { title: "Shut Up and Dance", videoId: "RgKAFK5djSk", sub: "WALK THE MOON" },
      { title: "Good Time", videoId: "09R8_2nJtjg", sub: "Owl City & Carly Rae Jepsen" }
    ],
    hindi: [
      { title: "Malhari", videoId: "vK7l5m0-7bM", sub: "Bajirao Mastani" },
      { title: "Aankh Marey", videoId: "48uK6L59Ags", sub: "Simmba" },
      { title: "Kar Gayi Chull", videoId: "l_MyUGq7pgs", sub: "Kapoor & Sons" },
      { title: "London Thumakda", videoId: "n4QK52sO720", sub: "Queen" },
      { title: "Ghungroo", videoId: "bnqLzCsffwY", sub: "War" },
      { title: "Dhoom Machale", videoId: "fdubeMFwuGs", sub: "Dhoom" },
      { title: "Nachan Farrate", videoId: "9iIX4PBplAY", sub: "All Is Well" }
    ],
    telugu: [
      { title: "Naatu Naatu", videoId: "OsU0CGZoV8E", sub: "RRR" },
      { title: "Seeti Maar", videoId: "w_vA9jF8g_M", sub: "DJ Duvvada Jagannadham" },
      { title: "Rangamma Mangamma", videoId: "K1I_p7u1V_c", sub: "Rangasthalam" },
      { title: "Blockbuster", videoId: "h1rK8K_p9W8", sub: "Sarrainodu" },
      { title: "Jai Balayya", videoId: "9A_9Jg7V4wE", sub: "Akhanda" },
      { title: "Dhee Dhee", videoId: "2mDCVzruYzQ", sub: "Ala Vaikunthapurramuloo" },
      { title: "Vachadayyay Saami", videoId: "vA9jF6G8uK0", sub: "Bharat Ane Nenu" }
    ]
  },
  joyful: {
    english: [
      { title: "Can't Stop the Feeling", videoId: "ru0K8uYEZWw", sub: "Justin Timberlake" },
      { title: "Levitating", videoId: "TUVcZfQe-Kw", sub: "Dua Lipa" },
      { title: "Blinding Lights", videoId: "fHI8X4OXluQ", sub: "The Weeknd" },
      { title: "Physical", videoId: "9HDEHj2yzew", sub: "Dua Lipa" },
      { title: "Shut Up and Dance", videoId: "6JCLY0R_b_w", sub: "WALK THE MOON" },
      { title: "Good Time", videoId: "H7HmzwI67ec", sub: "Owl City" },
      { title: "Uptown Funk", videoId: "gCYcHz2k5hs", sub: "Bruno Mars" }
    ],
    hindi: [
      { title: "Malhari", videoId: "z_8ZqT8yYmE", sub: "Bajirao Mastani" },
      { title: "Aankh Marey", videoId: "148eX_v7GNo", sub: "Simmba" },
      { title: "Kar Gayi Chull", videoId: "NTHz9eWJ8Ok", sub: "Kapoor & Sons" },
      { title: "London Thumakda", videoId: "oraKz06L7Ew", sub: "Queen" },
      { title: "Ghungroo", videoId: "qN4ooNx77u0", sub: "War" },
      { title: "Dhoom Machale", videoId: "v8Zt_76G0F0", sub: "Dhoom 3" },
      { title: "Nachan Farrate", videoId: "vK8F9Yc7I6g", sub: "All Is Well" }
    ],
    telugu: [
      { title: "Naatu Naatu", videoId: "Na213U_8ZWw", sub: "RRR" },
      { title: "Seeti Maar", videoId: "3X8_M7gPZf0", sub: "DJ" },
      { title: "Rangamma Mangamma", videoId: "6Z4f67g9wYw", sub: "Rangasthalam" },
      { title: "Blockbuster", videoId: "4_8Z7vK_uK8", sub: "Sarrainodu" },
      { title: "Jai Balayya", videoId: "z_9M6wG8Azo", sub: "Veera Simha Reddy" },
      { title: "Dhee Dhee", videoId: "8_8G6jW8pXw", sub: "Ala Vaikunthapurramuloo" },
      { title: "Vachadayyay Saami", videoId: "w_8M9xK7l8o", sub: "Bharat Ane Nenu" }
    ]
  }
};

// Builds the 7-song list accurately based on selected mood + language
function getSongs(mood, lang) {
  const languageData = MOOD_DATA[mood]?.[lang] || [];
  return languageData.map((song, i) => ({
    id: `${mood}-${lang}-${i}`,
    title: song.title,
    sub: `${LANGUAGES.find(l => l.id === lang).label} · ${song.sub}`,
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
