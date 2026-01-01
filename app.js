const generateBtn = document.getElementById("generateBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const ideaTitle = document.getElementById("ideaTitle");
const ideaDescription = document.getElementById("ideaDescription");

const ideas = [
  {
    title: "AI-Powered Niche Product Finder",
    description:
      "A lightweight AI tool that scans marketplaces, social platforms, and keyword data to uncover profitable digital product ideas for solopreneurs."
  },
  {
    title: "Subscription Prompt Vault",
    description:
      "A monthly subscription offering battle-tested AI prompts for creators, marketers, and founders to generate sales copy and workflows instantly."
  },
  {
    title: "Automated Lead Magnet Builder",
    description:
      "A tool that auto-creates downloadable lead magnets like guides and checklists based on a user's niche to grow email lists fast."
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
  }, 5000);
});
