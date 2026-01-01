const generateBtn = document.getElementById("generateBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const ideaTitle = document.getElementById("ideaTitle");
const ideaDescription = document.getElementById("ideaDescription");

const ideas = [
  {
    title: "Niche Product Finder",
    description:
      "A lightweight tool that analyzes online trends, marketplaces, and keyword demand to uncover profitable digital product opportunities. Built for solo founders who want fast validation without deep research."
  },
  {
    title: "Subscription Content Vault",
    description:
      "A recurring-revenue platform that delivers ready-to-use business resources for creators and entrepreneurs. Designed to save time while providing consistent value month after month."
  },
  {
    title: "Lead Magnet Builder",
    description:
      "A simple system that generates downloadable guides, checklists, or mini-courses tailored to a specific niche. Helps businesses grow email lists and convert visitors into customers."
  },
  {
    title: "Micro SaaS Idea Generator",
    description:
      "A focused idea engine that produces small, high-margin software concepts designed to solve one clear problem for one specific audience."
  },
  {
    title: "Digital Product Launch Kit",
    description:
      "An all-in-one setup that helps creators launch digital products quickly with pricing ideas, positioning angles, and go-to-market guidance."
  }
];

generateBtn.addEventListener("click", () => {
  result.classList.add("hidden");
  loading.classList.remove("hidden");

  setTimeout(() => {
    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];

    ideaTitle.textContent = randomIdea.title;
    ideaDescription.textContent = randomIdea.description;

    loading.classList.add("hidden");
    result.classList.remove("hidden");
  }, 1800);
});
