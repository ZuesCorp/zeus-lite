const generateBtn = document.getElementById("generateBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");

const ideaTitle = document.getElementById("ideaTitle");
const what = document.getElementById("what");
const who = document.getElementById("who");
const money = document.getElementById("money");
const why = document.getElementById("why");

const loadingText = loading ? loading.querySelector("p") : null;

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

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getDailyCount() {
  const today = todayKey();
  const savedDate = localStorage.getItem(DATE_KEY);

  if (savedDate !== today) {
    localStorage.setItem(DATE_KEY, today);
    localStorage.setItem(COUNT_KEY, "0");
    return 0;
  }

  return parseInt(localStorage.getItem(COUNT_KEY) || "0", 10);
}

function incrementDailyCount() {
  const current = getDailyCount();
  localStorage.setItem(COUNT_KEY, String(current + 1));
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
  },
  {
    product: "Cord organizer clips (adhesive set)",
    description: "Clips that keep cables from sliding behind desks/nightstands.",
    whyBuy: "Fixes a daily annoyance for cheap.",
    likelihood: "Medium-High"
  },
  {
    product: "Shower squeegee (stainless)",
    description: "Quick wipe tool that prevents water spots and buildup.",
    whyBuy: "Keeps shower glass clean with 10 seconds a day.",
    likelihood: "Medium"
  },
  {
    product: "Mini bag heat sealer (handheld)",
    description: "Handheld sealer that reseals snack and cereal bags.",
    whyBuy: "Keeps food fresh and reduces waste.",
    likelihood: "Medium"
  }
];

function pickRandomProduct() {
  return products[Math.floor(Math.random() * products.length)];
}

function showLimitMessage() {
  result.classList.remove("hidden");
  loading.classList.add("hidden");

  ideaTitle.textContent = "Product: Daily limit reached";
  what.textContent = "Description: You’ve generated 3 products today.";
  who.textContent = "Why you should buy it: Come back tomorrow for 3 more.";
  money.textContent = "Buyer likelihood to purchase: N/A";
  why.textContent = "";
}

generateBtn.addEventListener("click", () => {
  if (getDailyCount() >= LIMIT_PER_DAY) {
    showLimitMessage();
    return;
  }

  result.classList.add("hidden");
  loading.classList.remove("hidden");

  const intervalId = startLoadingMessages();
  const loadTime = 4000 + Math.floor(Math.random() * 2001);

  setTimeout(() => {
    if (intervalId) clearInterval(intervalId);

    const p = pickRandomProduct();
    incrementDailyCount();

    ideaTitle.textContent = `Product: ${p.product}`;
    what.textContent = `Description: ${p.description}`;
    who.textContent = `Why you should buy it: ${p.whyBuy}`;
    money.textContent = `Buyer likelihood to purchase: ${p.likelihood}`;

    const remaining = Math.max(0, LIMIT_PER_DAY - getDailyCount());
    why.textContent = remaining > 0 ? `Daily uses left: ${remaining}` : "Daily uses left: 0";

    loading.classList.add("hidden");
    result.classList.remove("hidden");
  }, loadTime);
});
