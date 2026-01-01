const generateBtn = document.getElementById("generateBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");

const ideaTitle = document.getElementById("ideaTitle");
const what = document.getElementById("what");
const who = document.getElementById("who");
const money = document.getElementById("money");
const why = document.getElementById("why");

// this is the <p> inside #loading (your HTML already has it)
const loadingText = loading ? loading.querySelector("p") : null;

let hasGenerated = false;

const loadingMessages = [
  "Finding best product…",
  "Checking buyer likelihood…",
  "Scanning high-demand niches…",
  "Estimating time-to-first-sale…",
  "Filtering low-margin ideas…",
  "Checking price sensitivity…",
  "Verifying pain-point strength…",
  "Scoring monetization clarity…",
  "Reducing fluff… keeping profit…"
];

// Keep the idea output short + clean
const ideas = [
  {
    title: "Service Price Sheet Builder",
    what: "Instant pricing sheet for a local service niche.",
    who: "Contractors quoting jobs daily.",
    money: "Ch
