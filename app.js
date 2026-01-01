const generateBtn = document.getElementById("generateBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const ideaTitle = document.getElementById("ideaTitle");
const ideaDescription = document.getElementById("ideaDescription");

const ideas = [
  {
    title: "AI-Powered Niche Product Finder",
    description:
      "A lightweight AI tool that scans trending marketplaces, social media platforms, and keyword data to identify profitable digital product opportunities. It highlights underserved niches, pricing strategies, and monetization angles, making it ideal for solopreneurs who want fast validation without deep market research."
  },
  {
    title: "Subscription-Based Prompt Library",
    description:
      "A recurring-revenue platform offering high-conversion AI prompts tailored for creators, marketers, and small business owners. Each prompt is optimized for real-world outcomes like sales copy, product descriptions, and automation workflows, positioning the product as a practical revenue-driving tool."
  },
  {
    title: "Automated Lead Magnet Generator",
    description:
      "A tool that instantly creates downloadable lead magnets such as checklists, guides, and mini-courses based on a user's niche. Designed for fast deployment, it helps businesses grow email lists and drive upsells with minimal effort or technical knowledge."
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
