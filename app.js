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
    console.error("Missing required elements. Check your HTML ids.");
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
    catch (_) { return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null; }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); }
    catch (_) { memoryStore[key] = value; }
  }

  function todayKey() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function getDailyCount() {
    const today = todayKey();
    const savedDate = safeGet(DATE_KEY);

    if (savedDate !== today) {
      safeSet(DATE_KEY, today);
      safeSet(COUNT_KEY, "0");
      return 0;
    }

    const raw = safeGet(COUNT_KEY);
    const num = parseInt(raw || "0", 10);
    return Number.isFinite(num) ? num : 0;
  }

  function incrementDailyCount() {
    const current = getDailyCount();
    safeSet(COUNT_KEY, String(current + 1));
    return current + 1;
  }

  function startLoadingMessages() {
    if (!loadingText) return null;

    let i = 0;
    loadingText.textContent = loadingMessages[i];

    const interval = setInterval(() => {
      i = (i + 1) % loadingMessages.length;
      loadingText.textContent = loadingMessages[i];
    }, 900);

    return interval;
  }

  const products = [
    {
      product: "Hair dryer (travel, folding)",
      description: "Compact dryer with 2 heat settings and fast dry time.",
      whyBuy: "Saves time and avoids weak hotel dryers.",
      likelihood: "High"
    },
    {
      product: "Silicone sink strainer (universal)",
      description: "Flexible strainer that catches food scraps and hair.",
      whyBuy: "Reduces clogs and gross drain smells.",
      likelihood: "High"
    },
    {
      product: "Under-sink leak alarm (battery)",
      description: "Small sensor that alerts you the second it detects water.",
      whyBuy: "Prevents expensive water damage before it spreads.",
      likelihood: "Medium-High"
    },
    {
      product: "Reusable lint roller (washable)",
      description: "Sticky roller that rinses clean and works again.",
      whyBuy: "No refills, great for pet hair and clothes.",
      likelihood: "High"
    },
    {
      product: "Magnetic charging cable (3-in-1)",
      description: "One cable that snaps in and charges common devices.",
      whyBuy: "Less cable mess and fewer broken ports.",
      likelihood: "High"
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

  // If they already hit the limit earlier today, show the limit page instantly
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
    const loadTime = 4000 + Math.floor(Math.random() * 2001);

    setTimeout(() => {
      if (intervalId) clearInterval(intervalId);

      const p = pickRandomProduct();
      incrementDailyCount();

      // If that click just used the last allowed generation, show limit-only message immediately
      if (getDailyCount() >= LIMIT_PER_DAY) {
        showLimitOnly();
        return;
      }

      ideaTitle.textContent = p.product;
      what.textContent = p.description;
      who.textContent = p.whyBuy;
      money.textContent = p.likelihood;

      const remaining = Math.max(0, LIMIT_PER_DAY - getDailyCount());
      why.textContent = String(remaining);

      loading.classList.add("hidden");
      result.classList.remove("hidden");
      generateBtn.disabled = false;
    }, loadTime);
  });
});

