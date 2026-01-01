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
    money: "Charge $49–$149 per build or $29/mo updates.",
    why: "Clear pricing closes faster and cuts negotiation."
  },
  {
    title: "Niche Checklist Pack",
    what: "Downloadable checklists for one specific business type.",
    who: "Operators who want fewer mistakes.",
    money: "$19–$49 per pack + upsell a $99 consult.",
    why: "People pay to avoid fines, rework, and headaches."
  },
  {
    title: "Local Lead Hand-Off List",
    what: "A small directory that routes leads to specialists.",
    who: "Service pros who want booked calls.",
    money: "$50–$250/mo per slot or pay-per-lead.",
    why: "They pay for work, not theory."
  },
  {
    title: "Quote Follow-Up Template Kit",
    what: "Short scripts + texts that recover lost quotes.",
    who: "Any service business with unclosed estimates.",
    money: "$29 one-time or $9/mo updates.",
    why: "One recovered job covers the cost."
  },
  {
    title: "Mini Offer Builder",
    what: "One-page “offer” template for a niche service.",
    who: "People who can sell but struggle with clarity.",
    money: "$19–$39 download + upsell $199 setup.",
    why: "Clear offer = easier yes."
  }
];

function pickRandomIdea() {
  return ideas[Math.floor(Math.random() * ideas.length)];
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

generateBtn.addEventListener("click", () => {
  if (hasGenerated) return;
  hasGenerated = true;

  result.classList.add("hidden");
  loading.classList.remove("hidden");

  const intervalId = startLoadingMessages();

  // Random loading duration: 4–6 seconds
  const loadTime = 4000 + Math.floor(Math.random() * 2001);

  setTimeout(() => {
    if (intervalId) clearInterval(intervalId);

    const idea = pickRandomIdea();

    ideaTitle.textContent = idea.title;
    what.textContent = idea.what;
    who.textContent = idea.who;
    money.textContent = idea.money;
    why.textContent = idea.why;

    loading.classList.add("hidden");
    result.classList.remove("hidden");
  }, loadTime);
});
