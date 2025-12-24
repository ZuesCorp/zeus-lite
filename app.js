const DAILY_LIMIT = 3;
const STORAGE_KEY = "zeus_lite_usage_v3";
const isAdmin = window.location.search.includes("admin");

const ANALYSIS_STEPS = [
  "Analyzing most searched products",
  "Analyzing top clicked items",
  "Evaluating best ad angles",
  "Estimating profit per sale",
  "Analyzing buyer likelihood"
];

const ZEUS_LITE_PRODUCTS = [
  {
    product: "Smart Pet Feeder with Camera",
    profit: "$20–$40",
    trending: "Remote pet monitoring demand continues to rise.",
    angle: "Peace of mind for busy pet owners.",
    likelihood: "75–85%"
  },
  {
    product: "Compact Home Air Quality Monitor",
    profit: "$18–$30",
    trending: "Health-focused consumers care more about indoor air.",
    angle: "Quick way to see if your space is actually healthy.",
    likelihood: "70–82%"
  },
  {
    product: "Automatic Plant Watering System",
    profit: "$22–$35",
    trending: "Urban plant owners want low-effort care solutions.",
    angle: "Set-and-forget backup for people who forget to water.",
    likelihood: "72–84%"
  }
];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadUsage() {
  if (isAdmin) return { date: getToday(), used: 0 };
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { date: getToday(), used: 0 };
  const data = JSON.parse(raw);
  return data.date === getToday() ? data : { date: getToday(), used: 0 };
}

function saveUsage(u) {
  if (!isAdmin) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("generateBtn");
  const output = document.getElementById("output");
  const counter = document.getElementById("counter");
  const modeLabel = document.getElementById("modeLabel");
  const statusNote = document.getElementById("statusNote");

  let usage = loadUsage();
  let index = usage.used;

  function updateUI() {
    if (isAdmin) {
      modeLabel.textContent = "Admin mode";
      counter.textContent = "Unlimited generations";
      statusNote.textContent = "Daily limits disabled.";
      btn.disabled = false;
      return;
    }

    const remaining = DAILY_LIMIT - usage.used;
    counter.textContent = `Generations remaining today: ${remaining} / ${DAILY_LIMIT}`;
    statusNote.textContent = "Each generation highlights one product rising today.";

    btn.disabled = remaining <= 0;
    btn.textContent = remaining <= 0 ? "Daily limit reached" : "Generate product";
  }

  updateUI();

  btn.addEventListener("click", async () => {
    if (!isAdmin && usage.used >= DAILY_LIMIT) return;

    btn.disabled = true;
    let step = 0;
    output.textContent = ANALYSIS_STEPS[step];

    const loop = setInterval(() => {
      step = (step + 1) % ANALYSIS_STEPS.length;
      output.textContent = ANALYSIS_STEPS[step];
    }, 1500);

    await wait(6000 + Math.random() * 2000);
    clearInterval(loop);

    const p = ZEUS_LITE_PRODUCTS[index % ZEUS_LITE_PRODUCTS.length];
    output.textContent =
      `Product: ${p.product}\nProfit per sale: ${p.profit}\nWhy it’s trending: ${p.trending}\nBest marketing angle: ${p.angle}\nLikelihood to purchase: ${p.likelihood}`;

    if (!isAdmin) {
      usage.used++;
      saveUsage(usage);
    }

    index++;
    updateUI();
  });
});
