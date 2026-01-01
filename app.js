const generateBtn = document.getElementById("generateBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");

const ideaTitle = document.getElementById("ideaTitle"); // we'll use this for Product:
const what = document.getElementById("what");           // Description:
const who = document.getElementById("who");            // Why you should buy it:
const money = document.getElementById("money");        // Buyer likelihood:
const why = document.getElementById("why");            // We'll use this for "Daily limit" message OR extra note

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

// ---- Daily Limit (3/day) using localStorage ----
const LIMIT_PER_DAY = 3;
const STORAGE_KEY = "zeusLiteDailyCount";
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
    localStor
