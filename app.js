const DAILY_LIMIT = 3;

const LOADING_STEPS = [
  "Analyzing most searched products…",
  "Analyzing top clicked items…",
  "Evaluating best ad angles…",
  "Estimating profit per sale…",
  "Calculating buyer likelihood…"
];

const PRODUCTS = [
  {
    product: "Compact Home Air Quality Monitor",
    profit: "$18–$30",
    trending: "Health-focused consumers care more about indoor air.",
    angle: "Quick way to see if your space is actually healthy.",
    likelihood: "70–82%",
  },
  {
    product: "Automatic Plant Watering System",
    profit: "$22–$35",
    trending: "Urban plant owners want low-effort maintenance.",
    angle: "Set-and-forget solution for busy households.",
    likelihood: "72–84%",
  },
  {
    product: "Smart Pet Feeder with Camera",
    profit: "$20–$40",
    trending: "Pet monitoring demand continues to rise.",
    angle: "Peace of mind for pet owners while away.",
    likelihood: "75–85%",
  }
];

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

function loadUsage() {
  const raw = localStorage.getItem("zeus_lite_usage");
  const today = todayKey();

  if (!raw) return { date: today, used: 0 };

  const data = JSON.parse(raw);
  return data.date === today ? data : { date: today, used: 0 };
}

function saveUsage(u) {
  localStorage.setItem("zeus_lite_usage", JSON.stringify(u));
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("generateBtn");
  const output = document.getElementById("output");
  const counter = document.getElementById("counter");

  let usage = loadUsage();
  let index = usage.used;

  updateUI();

  btn.addEventListener("click", () => {
    if (usage.used >= DAILY_LIMIT) return;

    btn.disabled = true;
    output.textContent = LOADING_STEPS[0];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < LOADING_STEPS.length) {
        output.textContent = LOADING_STEPS[step];
      }
    }, 1200);

    const delay = 6000 + Math.random() * 2000;

    setTimeout(() => {
      clearInterval(interval);

      const p = PRODUCTS[index] || PRODUCTS[PRODUCTS.length - 1];

      output.textContent =
        `Product: ${p.product}\n` +
        `Profit per sale: ${p.profit}\n` +
        `Why it’s trending: ${p.trending}\n` +
        `Best marketing angle: ${p.angle}\n` +
        `Likelihood to purchase: ${p.likelihood}`;

      usage.used++;
      usage.date = todayKey();
      saveUsage(usage);
      index++;

      updateUI();
    }, delay);
  });

  function updateUI() {
    const remaining = DAILY_LIMIT - usage.used;
    counter.textContent = `Generations remaining today: ${remaining} / ${DAILY_LIMIT}`;

    if (remaining <= 0) {
      btn.disabled = true;
      btn.textContent = "Daily limit reached";
    } else {
      btn.textContent = "Generate product";
      btn.disabled = false;
    }
  }
});
