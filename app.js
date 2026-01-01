window.addEventListener("DOMContentLoaded", () => {
  const el = (id) => document.getElementById(id);

  const generateBtn = el("generateBtn");
  const loading = el("loading");
  const result = el("result");
  const limitMessage = el("limitMessage");

  const ideaTitle = el("ideaTitle");
  const what = el("what");
  const who = el("who");
  const money = el("money");
  const why = el("why");

  if (!generateBtn || !loading || !result || !limitMessage || !ideaTitle || !what || !who || !money || !why) {
    console.error("Missing required elements.");
    return;
  }

  const loadingText = loading.querySelector("p");

  const loadingMessages = [
    "Finding best product…",
    "Checking buyer likelihood…",
    "Scanning demand signals…",
    "Estimating value per buyer…",
    "Checking competition density…",
    "Verifying purchase intent…",
    "Finalizing pick…"
  ];

  const LIMIT_PER_DAY = 3;
  const COUNT_KEY = "zeusLiteDailyCount";
  const DATE_KEY = "zeusLiteDailyDate";

  let memoryStore = {};

  function safeGet(key) {
    try { return localStorage.getItem(key); }
    catch { return memoryStore[key] ?? null; }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); }
    catch { memoryStore[key] = value; }
  }

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function getDailyCount() {
    const today = todayKey();
    if (safeGet(DATE_KEY) !== today) {
      safeSet(DATE_KEY, today);
      safeSet(COUNT_KEY, "0");
      return 0;
    }
    const n = parseInt(safeGet(COUNT_KEY) || "0", 10);
    return Number.isFinite(n) ? n : 0;
  }

  function incrementDailyCount() {
    const c = getDailyCount() + 1;
    safeSet(COUNT_KEY, String(c));
    return c;
  }

  function startLoadingMessages() {
    if (!loadingText) return null;
    let i = 0;
    loadingText.textContent = loadingMessages[i];
    return setInterval(() => {
      i = (i + 1) % loadingMessages.length;
      loadingText.textContent = loadingMessages[i];
    }, 900);
  }

  const products = [
    {
      product: "Hair dryer (travel, folding)",
      description: "Compact, high-output travel dryer designed to dry hair fast without taking up suitcase space or relying on weak hotel units.",
      whyBuy: "It replaces an unreliable travel experience with a predictable outcome, fast drying anywhere.",
      likelihood: 88
    },
    {
      product: "Silicone sink strainer (universal)",
      description: "Flexible, heat-resistant strainer that captures food scraps and hair before they create clogs.",
      whyBuy: "It prevents a recurring problem with a simple, low-cost upgrade people buy immediately after one bad clog.",
      likelihood: 91
    },
    {
      product: "Under-sink leak alarm (battery)",
      description: "Small water-detection device that alerts you the moment moisture shows up under sinks.",
      whyBuy: "It buys reaction time and helps avoid damage that typically costs hundreds or thousands to fix.",
      likelihood: 79
    },
    {
      product: "Reusable lint roller (washable)",
      description: "Washable adhesive roller that removes hair and lint without disposable refills.",
      whyBuy: "It replaces repeated purchases with one durable tool that stays useful every day.",
      likelihood: 86
    },
    {
      product: "Magnetic charging cable (3-in-1)",
      description: "One magnetic cable that charges multiple device types and reduces port wear.",
      whyBuy: "Less cable clutter, fewer broken chargers, and easier charging, especially in cars and bedside setups.",
      likelihood: 84
    }
  ];

  function pickRandomProduct() {
    return products[Math.floor(Math.random() * products.length)];
  }

  function showLimitOnly() {
    loading.classList.add("hidden");
    result.classList.add("hidden");
    limitMessage.classList.remove("hidden");
    generateBtn.disabled = true;
  }

  // If already at limit, show it immediately
  if (getDailyCount() >= LIMIT_PER_DAY) {
    showLimitOnly();
  }

  generateBtn.addEventListener("click", () => {
    if (getDailyCount() >= LIMIT_PER_DAY) {
      showLimitOnly();
      return;
    }

    limitMessage.classList.add("hidden");
    result.classList.add("hidden");
    loading.classList.remove("hidden");
    generateBtn.disabled = true;

    const intervalId = startLoadingMessages();
    const loadTime = 4000 + Math.floor(Math.random() * 2001); // 4–6 seconds

    setTimeout(() => {
      if (intervalId) clearInterval(intervalId);

      const p = pickRandomProduct();
      incrementDailyCount();

      // When limit reached, show limit message only
      if (getDailyCount() >= LIMIT_PER_DAY) {
        showLimitOnly();
        return;
      }

      ideaTitle.textContent = p.product;
      what.textContent = p.description;
      who.textContent = p.whyBuy;
      money.textContent = `${p.likelihood}% likelihood of purchase`;
      why.textContent = String(Math.max(0, LIMIT_PER_DAY - getDailyCount()));

      loading.classList.add("hidden");
      result.classList.remove("hidden");
      generateBtn.disabled = false;
    }, loadTime);
  });
});
