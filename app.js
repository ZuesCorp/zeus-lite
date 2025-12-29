const DAILY_LIMIT = 3;

const modeLabel = document.getElementById("modeLabel");
const counter = document.getElementById("counter");
const statusNote = document.getElementById("statusNote");
const generateBtn = document.getElementById("generateBtn");
const output = document.getElementById("output");

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function loadState() {
  const raw = localStorage.getItem("zeus_lite_state");
  if (!raw) return { date: todayISO(), used: 0 };
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.date !== todayISO()) return { date: todayISO(), used: 0 };
    return { date: parsed.date, used: Number(parsed.used || 0) };
  } catch {
    return { date: todayISO(), used: 0 };
  }
}

function saveState(state) {
  localStorage.setItem("zeus_lite_state", JSON.stringify(state));
}

function remaining(state) {
  return Math.max(0, DAILY_LIMIT - state.used);
}

function setUI(state) {
  modeLabel.textContent = "Zeus Lite";
  counter.textContent = `Generations remaining today: ${remaining(state)} / ${DAILY_LIMIT}`;

  const left = remaining(state);
  generateBtn.disabled = left === 0;
  if (left === 0) {
    statusNote.textContent = "You're out of generations for today. Come back tomorrow.";
  } else {
    statusNote.textContent = "You can generate up to 3 product ideas per day.";
  }
}

function pickProductIdea() {
  const ideas = [
    {
      name: "Magnetic cable organizer strip",
      why: "Low AOV impulse buy, solves desk clutter, lots of creatives possible.",
      angle: "Before/after desk setup; bundle with 2–3 strips; UGC focus.",
    },
    {
      name: "Pet hair remover squeegee",
      why: "Clear pain point, quick demo, strong repeat buyers and gifting.",
      angle: "Satisfying demo videos; comparison vs lint roller.",
    },
    {
      name: "Reusable silicone food covers set",
      why: "Eco angle + practical; easy bundle pricing; broad audience.",
      angle: "Meal prep + fridge organization content; 'ditch plastic wrap'.",
    },
  ];

  return ideas[Math.floor(Math.random() * ideas.length)];
}

function renderIdea(idea) {
  output.textContent =
    `Product: ${idea.name}\n\n` +
    `Why it works: ${idea.why}\n\n` +
    `Test angle: ${idea.angle}\n`;
}

function onGenerate() {
  const state = loadState();
  if (remaining(state) <= 0) {
    setUI(state);
    return;
  }

  const idea = pickProductIdea();
  renderIdea(idea);

  state.used += 1;
  saveState(state);
  setUI(state);
}

generateBtn.addEventListener("click", onGenerate);

setUI(loadState());
