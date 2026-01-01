(function () {
  function el(id) { return document.getElementById(id); }

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  onReady(function () {
    var generateBtn = el("generateBtn");
    var loading = el("loading");
    var result = el("result");
    var limitMessage = el("limitMessage");

    var ideaTitle = el("ideaTitle");
    var profit = el("what");
    var moving = el("who");
    var adAngle = el("money");
    var likelihood = el("why");

    if (!generateBtn || !loading || !result || !limitMessage || !ideaTitle || !profit || !moving || !adAngle || !likelihood) {
      if (window.console && console.error) console.error("Missing required HTML elements. Check IDs in lite.html.");
      return;
    }

    var loadingText = loading.getElementsByTagName("p")[0];

    var loadingMessages = [
      "Finding best product...",
      "Checking buyer likelihood...",
      "Scanning demand signals...",
      "Estimating value per buyer...",
      "Checking competition density...",
      "Verifying purchase intent...",
      "Finalizing pick..."
    ];

    var LIMIT_PER_DAY = 20;
    var COUNT_KEY = "zeusLiteDailyCount";
    var DATE_KEY = "zeusLiteDailyDate";

    function pad2(n) { n = String(n); return n.length === 1 ? "0" + n : n; }
    function todayKey() {
      var d = new Date();
      return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
    }

    function safeGet(key) {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    }
    function safeSet(key, value) {
      try { localStorage.setItem(key, value); } catch (e) {}
    }

    function getDailyCount() {
      var today = todayKey();
      if (safeGet(DATE_KEY) !== today) {
        safeSet(DATE_KEY, today);
        safeSet(COUNT_KEY, "0");
        return 0;
      }
      var n = parseInt(safeGet(COUNT_KEY) || "0", 10);
      return isNaN(n) ? 0 : n;
    }

    function incrementDailyCount() {
      var c = getDailyCount() + 1;
      safeSet(COUNT_KEY, String(c));
      return c;
    }

    function startLoadingMessages() {
      if (!loadingText) return null;
      var i = 0;
      loadingText.textContent = loadingMessages[i];
      return setInterval(function () {
        i = (i + 1) % loadingMessages.length;
        loadingText.textContent = loadingMessages[i];
      }, 900);
    }

    function show(node) { node.className = node.className.replace(/\bhidden\b/g, "").trim(); }
    function hide(node) { if (node.className.indexOf("hidden") === -1) node.className += " hidden"; }

    function showLimitOnly() {
      hide(loading);
      hide(result);
      show(limitMessage);
      generateBtn.disabled = true;
    }

    var products = [
      {
        product: "CarPlay / Android Auto wireless adapter (USB-C)",
        profitPotential: "Premium perceived value supports higher pricing. Easy upsells (fast-charging cable, magnetic mount) and bundles (2-pack for multiple cars).",
        whyMoving: "Huge audience with older vehicles that have wired CarPlay. Life-upgrade content performs well because the benefit is instantly understandable.",
        bestAdAngle: "Turn wired CarPlay into wireless in 10 seconds with a plug-in demo and a clean before/after experience.",
        likelihood: "86% if you prove compatibility and speed, and remove the 'will this work with my car?' objection."
      },
      {
        product: "Portable mini label printer (Bluetooth)",
        profitPotential: "Low cost, high perceived utility. Bundles (label rolls, cases) and refill sales add repeat revenue.",
        whyMoving: "Organization and small-business packing content drives impulse buys. The result is visual and instantly satisfying.",
        bestAdAngle: "Print clean labels from your phone in seconds. Show messy-before and tidy-after transformations.",
        likelihood: "82% when you show print quality, app simplicity, and real-world use cases."
      },
      {
        product: "Heated electric lunch box (car + wall plug)",
        profitPotential: "Premium convenience product with strong gift appeal. Upsells include containers, utensils, and travel bags.",
        whyMoving: "Workers want hot food without fast food prices. It solves a daily pain with a clear payoff.",
        bestAdAngle: "Hot lunch anywhere in 20 minutes. Show cold food turning hot while commuting.",
        likelihood: "78% if you show heat time, leak-proof design, and power compatibility."
      },
      {
        product: "Under-sink leak alarm (battery)",
        profitPotential: "High perceived value because it prevents expensive damage. Great bundle with batteries or 2-pack offers.",
        whyMoving: "Homeowners fear water damage. Simple demo content performs well because the benefit is instant.",
        bestAdAngle: "Place it under the sink and get alerted the second a leak starts. Quick water-on demo.",
        likelihood: "80% if you prove it is loud, reliable, and easy to install."
      },
      {
        product: "Silicone sink strainer (universal)",
        profitPotential: "Cheap to source, easy to bundle, strong margin at scale. Multi-pack offers increase AOV.",
        whyMoving: "Clogs are common and annoying. The fix is simple and instantly understandable.",
        bestAdAngle: "Stop clogs before they start. Show what it catches in one day and the clean drain after.",
        likelihood: "90% if the demo is clear and the fit looks universal."
      }
    ];

    function pickRandom() {
      return products[Math.floor(Math.random() * products.length)];
    }

    if (getDailyCount() >= LIMIT_PER_DAY) {
      showLimitOnly();
    }

    function handleClick() {
      if (getDailyCount() >= LIMIT_PER_DAY) {
        showLimitOnly();
        return;
      }

      hide(limitMessage);
      hide(result);
      show(loading);
      generateBtn.disabled = true;

      var intervalId = startLoadingMessages();
      var loadTime = 4000 + Math.floor(Math.random() * 2001);

      setTimeout(function () {
        if (intervalId) clearInterval(intervalId);

        var p = pickRandom();
        incrementDailyCount();

        if (getDailyCount() >= LIMIT_PER_DAY) {
          showLimitOnly();
          return;
        }

        ideaTitle.textContent = "Product: " + p.product;
        profit.textContent = p.profitPotential;
        moving.textContent = p.whyMoving;
        adAngle.textContent = p.bestAdAngle;
        likelihood.textContent = p.likelihood;

        hide(loading);
        show(result);
        generateBtn.disabled = false;
      }, loadTime);
    }

    if (generateBtn.addEventListener) generateBtn.addEventListener("click", handleClick);
    else generateBtn.onclick = handleClick;
  });
})();
