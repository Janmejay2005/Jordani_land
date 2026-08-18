const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const xpEl = document.getElementById("xp");
const coinsEl = document.getElementById("coins");
const topBtn = document.getElementById("top-btn");

let xp = 0;
let coins = 0;
let started = false;

function updateHud() {
  xpEl.textContent = String(xp).padStart(3, "0");
  coinsEl.textContent = coins;
}

function startRun() {
  if (started) return;
  started = true;
  startScreen.classList.add("started");
  document.body.classList.add("game-started");
  document.getElementById("home").scrollIntoView({ behavior: "smooth" });
  addXP(25);
}

function addXP(amount) {
  xp = Math.min(999, xp + amount);
  updateHud();
}

startBtn.addEventListener("click", startRun);

document.addEventListener("keydown", (e) => {
  if ((e.code === "Enter" || e.code === "Space") && !started) {
    e.preventDefault();
    startRun();
  }
});

const sections = [...document.querySelectorAll("main > section")];
const seen = new Set();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !seen.has(entry.target.id)) {
      seen.add(entry.target.id);
      addXP(entry.target.id === "home" ? 15 : 20);
    }
  });
}, { threshold: 0.35 });

sections.forEach(section => observer.observe(section));

window.addEventListener("scroll", () => {
  topBtn.classList.toggle("show", window.scrollY > 700);
});

topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* Floating coins become collectible when clicked. */
document.querySelectorAll(".floating-coin").forEach((coin) => {
  coin.addEventListener("click", () => {
    if (coin.dataset.collected) return;
    coin.dataset.collected = "true";
    coins += 1;
    addXP(10);
    coin.animate(
      [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(1.8) translateY(-40px)", opacity: 0 }
      ],
      { duration: 450, easing: "ease-out", fill: "forwards" }
    );
    setTimeout(() => coin.remove(), 460);
  });
});

/* Project filters */
const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project-card");

filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(f => f.classList.remove("active"));
    filter.classList.add("active");
    const target = filter.dataset.filter;

    projects.forEach(card => {
      const category = card.dataset.category || "";
      const show = target === "all" || category.includes(target);
      card.classList.toggle("hidden", !show);
    });
    addXP(5);
  });
});

/* Lightweight AI demo. This is deliberately local and transparent. */
const aiForm = document.getElementById("ai-form");
const aiInput = document.getElementById("ai-input");
const aiOutput = document.getElementById("ai-output");

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `ai-message ${type}`;
  div.textContent = text;
  aiOutput.appendChild(div);
  aiOutput.scrollTop = aiOutput.scrollHeight;
}

function getAIResponse(question) {
  const q = question.toLowerCase();

  if (q.includes("who") || q.includes("janmejay") || q.includes("about")) {
    return "Janmejay is a BCA student specializing in AI & Data Analytics. He builds AI/ML, full-stack and AI-application projects and is Vice President of Odyssey.";
  }
  if (q.includes("skill") || q.includes("stack") || q.includes("technology")) {
    return "His core stack includes Python, Java, C++, JavaScript, MERN, TensorFlow and Scikit-learn, with hands-on exploration of LLMs, RAG, parsing, embeddings, LangChain and Whisper.";
  }
  if (q.includes("rag") || q.includes("retrieval") || q.includes("embedding") || q.includes("chunk")) {
    return "His AI work explores the RAG pipeline: document parsing → chunking → embeddings → retrieval → LLM generation. He is interested in making private knowledge useful to AI systems.";
  }
  if (q.includes("project") || q.includes("build") || q.includes("best")) {
    return "Some standout builds are the Gemini Voice Assistant, Cleanytics, Humanize JSON, urVault, LNCT Time Table and the Appa Mess Management PWA.";
  }
  if (q.includes("odyssey") || q.includes("vice president") || q.includes("leadership")) {
    return "Janmejay is Vice President of Odyssey, formerly E-Cell LNCT, a student body focused on empowering innovators and entrepreneurs.";
  }
  if (q.includes("json") || q.includes("humanize") || q.includes("parsing")) {
    return "Humanize — JSON, Plainly is a client-side JavaScript app that parses JSON, validates it, humanizes keys, generates summaries and displays structure statistics.";
  }
  if (q.includes("voice") || q.includes("whisper") || q.includes("gemini")) {
    return "The Voice Assistant combines speech recognition, Gemini, function calling and live APIs for weather, news, Wikipedia and YouTube.";
  }
  if (q.includes("contact") || q.includes("email") || q.includes("linkedin")) {
    return "You can reach Janmejay at janmejaykumarsinghsharp@gmail.com or connect through LinkedIn and GitHub using the buttons below.";
  }

  return "Try asking about Janmejay's projects, skills, RAG work, Humanize JSON, Voice Assistant, Cleanytics or Odyssey leadership.";
}

aiForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const question = aiInput.value.trim();
  if (!question) return;

  addMessage(question, "user");
  aiInput.value = "";

  setTimeout(() => {
    addMessage(getAIResponse(question), "bot");
    addXP(8);
  }, 350);
});

document.querySelectorAll(".quick-prompts button").forEach(button => {
  button.addEventListener("click", () => {
    aiInput.value = button.dataset.prompt;
    aiInput.focus();
  });
});

updateHud();
