const generateBtn = document.getElementById("generateBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");

const ideaTitle = document.getElementById("ideaTitle");
const what = document.getElementById("what");
const who = document.getElementById("who");
const money = document.getElementById("money");
const why = document.getElementById("why");

// the <p> inside #loading
const loadingText = loading ? loading.querySelector("p") : null;

const loadingMessages = [
  "Finding best product…",
  "Checking buyer likelihood…",
  "Scanning high-demand niches…",
  "Estimating time-to-first-sale…",
  "Filtering low-margin ideas…",
  "Checking price sensitivity…",
  "Verifying pain-point strength…",
  "Scoring monetization clarity…",
  "Finalizing idea…"
];

const ideas = [
  {
    title: "Service Price Sheet Builder",
    what: "Instant pricing sheet for one local service niche.",
    who: "Contractors quoting jobs daily.",
    money: "$49–$149 per build or $29/mo updates.",
    why: "Clear pricing closes faster and cuts negotiation."
  },
  {
    title: "Niche Checklist Pack",
    what: "Downloadable checklists for one business type.",
    who: "Operators who want fewer mistakes.",
    money: "$19–$49 per pack + add-on consult.",
    why: "People pay to avoid fines, rework, and headaches."
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
    what: "One-page offer template for a niche service.",
    who: "People who sell but lack clarity.",
    money: "$19–$39 download + $199 setup add-on.",
    why: "Clear offers get easier yeses."
  },
  {
    title: "Local Lead Hand-Off List",
    what: "A small directory that routes leads to specialists.",
    who: "Service pros who want booked calls.",
    money: "$50–$250/mo per slot or pay-per-lead.",
    why: "They pay for work, not theory."
  }
];

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
  result.classList.add("hidden");
  loading.classList.remove("hidden");

  const intervalId = startLoadingMessages();

  // random 4–6 seconds
  const loadTime = 4000 + Math.floor(Math.random() * 2001);

  setTimeout(() => {
    if (intervalId) clearInterval(intervalId);

    const idea = ideas[Math.floor(Math.random() * ideas.length)];

    ideaTitle.textContent = idea.title;
    what.textContent = idea.what;
    who.textContent = idea.who;
    money.textContent = idea.money;
    why.textContent = idea.why;

    loading.classList.add("hidden");
    result.classList.remove("hidden");
  }, loadTime);
});
