const generateBtn = document.getElementById("generateBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");

const ideaTitle = document.getElementById("ideaTitle");
const what = document.getElementById("what");
const who = document.getElementById("who");
const money = document.getElementById("money");
const why = document.getElementById("why");

let hasGenerated = false;

const ideas = [
  {
    title: "Local Service Lead Router",
    what: "A simple system that forwards niche local leads (water heater installs, drain issues, etc.) to the right contractor.",
    who: "Anyone who can run ads or partner with local businesses.",
    money: "Charge per lead or a monthly flat fee per contractor.",
    why: "Contractors pay for booked work, not branding or theory."
  },
  {
    title: "Template Kit for One Job Role",
    what: "A paid pack of templates and checklists for one specific job role (realtors, truck drivers, salon owners, etc.).",
    who: "Busy professionals who want shortcuts that save time.",
    money: "One-time purchase or yearly updates.",
    why: "Simple tools beat advice and people pay to stop wasting time."
  },
  {
    title: "Niche Compliance Checklist Pack",
    what: "A downloadable checklist bundle for a niche that must stay compliant (food trucks, short-term rentals, contractors).",
    who: "Small operators who want peace of mind and fewer mistakes.",
    money: "Sell the pack + offer add-on consulting calls.",
    why: "Avoiding fines and headaches has obvious value."
  },
  {
    title: "Pricing Sheet Builder for Service Businesses",
    what: "A quick process that produces clean, professional pricing sheets for service businesses in under 10 minutes.",
    who: "Local service businesses that quote work daily.",
    money: "Charge per build or monthly for revisions.",
    why: "Clear pricing increases close rate and reduces back-and-forth."
  },
  {
    title: "One-Person Digital Product Validator",
    what: "A simple step-by-step framework that helps someone validate an idea in 48 hours without getting lost.",
    who: "People who start projects but never launch.",
    money: "Sell as a guide + upsell a deeper version.",
    why: "Speed and clarity are worth paying for."
  }
];

generateBtn.addEventListener("click", () => {
  if (hasGenerated) return;

  hasGenerated = true;

  result.classList.add("hidden");
  loading.classList.remove("hidden");

  setTimeout(() => {
    const idea = ideas[Math.floor(Math.random() * ideas.length)];

    ideaTitle.textContent = idea.title;
    what.textContent = idea.what;
    who.textContent = idea.who;
    money.textContent = idea.money;
    why.textContent = idea.why;

    loading.classList.add("hidden");
    result.classList.remove("hidden");
  }, 1600);
});
