(function () {
  // =========================
  // Storage helpers
  // =========================
  var EMAIL_KEY = "__zl_email_v1";
  var LIMIT_KEY = "__zl_daily_v2"; // { date, count }

  function todayKey() {
    var d = new Date();
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  }

  function safeGet(k) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  }
  function safeSet(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch {}
  }
  function safeRemove(k) {
    try {
      localStorage.removeItem(k);
    } catch {}
  }
  function byId(id) {
    return document.getElementById(id);
  }

  function readDaily() {
    var raw = safeGet(LIMIT_KEY);
    if (!raw) return { date: todayKey(), count: 0 };
    try {
      var obj = JSON.parse(raw);
      if (obj.date !== todayKey()) return { date: todayKey(), count: 0 };
      return { date: obj.date, count: Number(obj.count || 0) };
    } catch {
      return { date: todayKey(), count: 0 };
    }
  }

  function writeDaily(count) {
    safeSet(LIMIT_KEY, JSON.stringify({ date: todayKey(), count }));
  }

  // =========================
  // AUTH
  // =========================
  window.ZeusAuth = {
    getEmail() {
      return (safeGet(EMAIL_KEY) || "").toLowerCase().trim();
    },
    setEmail(email) {
      safeSet(EMAIL_KEY, email.toLowerCase().trim());
    },
    clearEmail() {
      safeRemove(EMAIL_KEY);
    },
    async requireServerAccess(redirectTo) {
      var email = this.getEmail();
      if (!email.includes("@")) {
        location.replace(redirectTo || "login.html");
        return;
      }
      try {
        var res = await fetch("/.netlify/functions/check-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        var data = await res.json();
        if (!data.allowed) {
          this.clearEmail();
          location.replace(redirectTo || "login.html");
        }
      } catch {
        this.clearEmail();
        location.replace(redirectTo || "login.html");
      }
    },
  };

  // =========================
  // REAL PRODUCT DATA
  // =========================
  var PRODUCTS = [
    {
      title: "Portable Ice Bath Tub (Athletes & Recovery)",
      profit:
        "Manufacturing cost ~$35, selling price $99–149. High AOV and repeat accessories.",
      why:
        "Cold therapy is exploding on TikTok and YouTube among gym, runners, and biohackers.",
      angle: "Show extreme reactions + recovery transformation in 7 days.",
      likelihood: "High – emotional pain relief + trend-driven impulse buy.",
    },
    {
      title: "Pet Hair Remover Roller (Reusable)",
      profit:
        "Costs ~$3–5 landed, sells for $19.99. Insane margins and low returns.",
      why: "Pet owners constantly complain about fur on clothes and couches.",
      angle: "Instant visual demo: one swipe → clean couch.",
      likelihood: "Very High – universal problem with immediate payoff.",
    },
    {
      title: "Car Gap Filler Organizer (Seat Gap)",
      profit: "Costs ~$6, sells for $29.99. Bundle-friendly.",
      why: "Everyone drops phones and food between car seats.",
      angle: "POV frustration clip → clean solution snap-in.",
      likelihood: "High – simple fix to an annoying daily problem.",
    },

    // --- Added products ---
    {
      title: "Heated USB Desk Hand Warmer Pad",
      profit: "Costs ~$7–12 landed, sells for $19.99–29.99.",
      why: "Cold hands while working hurt productivity.",
      angle: "Thermal camera heat test + cozy desk POV.",
      likelihood: "High – seasonal but strong.",
    },
    {
      title: "Over-the-Sink Dish Drying Rack (Roll-Up)",
      profit: "Costs ~$8–12 landed, sells for $19.99–29.99.",
      why: "Small kitchens lack counter space.",
      angle: "Messy sink → clean, space-saving setup.",
      likelihood: "High – kitchen organization trend.",
    },
    {
      title: "Cordless Electric Screwdriver Set",
      profit: "Costs ~$10–15 landed, sells for $24.99–29.99.",
      why: "People hate manual screwing for small tasks.",
      angle: "Furniture assembly sped up 5x.",
      likelihood: "High – DIY convenience.",
    },
    {
      title: "Reusable Silicone Baking Mat (Non-Stick)",
      profit: "Costs ~$4–7 landed, sells for $14.99–24.99.",
      why: "People want to stop wasting parchment paper.",
      angle: "No-oil baking + easy peel-off demo.",
      likelihood: "High – eco + kitchen combo.",
    },
    {
      title: "Smart Posture Corrector Strap",
      profit: "Costs ~$7–12 landed, sells for $19.99–29.99.",
      why: "Poor posture causes pain and fatigue.",
      angle: "Slouch alert → posture correction POV.",
      likelihood: "Medium-High – health-conscious buyers.",
    },
    {
      title: "Bathroom Sink Hair Catcher (Stainless Steel)",
      profit: "Costs ~$3–5 landed, sells for $12.99–19.99.",
      why: "Clogged drains are expensive and annoying.",
      angle: "Pulled-out hair clog shock reveal.",
      likelihood: "Very High – universal problem.",
    },
    {
      title: "Portable LED Ring Light Tripod (Phone Mount)",
      profit: "Costs ~$8–13 landed, sells for $19.99–29.99.",
      why: "Creators want better lighting instantly.",
      angle: "No light vs ring light comparison.",
      likelihood: "High – creator economy.",
    },
    {
      title: "Shower Head with Filter (Hard Water Fix)",
      profit: "Costs ~$9–14 landed, sells for $24.99–29.99.",
      why: "Hard water damages skin and hair.",
      angle: "Filtered vs unfiltered water test.",
      likelihood: "High – health + beauty.",
    },
    {
      title: "Magnetic Spice Rack for Refrigerator",
      profit: "Costs ~$6–10 landed, sells for $14.99–24.99.",
      why: "People lack cabinet space.",
      angle: "Empty fridge side → organized spices.",
      likelihood: "High – kitchen organization.",
    },
    {
      title: "Noise-Reducing Door Draft Stopper",
      profit: "Costs ~$5–8 landed, sells for $14.99–24.99.",
      why: "Noise and cold drafts disturb sleep.",
      angle: "Sound test before vs after install.",
      likelihood: "High – apartment renters.",
    },
    {
      title: "Electric Lint Remover for Clothes",
      profit: "Costs ~$6–10 landed, sells for $14.99–24.99.",
      why: "Fuzz makes clothes look old.",
      angle: "Old sweater → brand new look.",
      likelihood: "Very High – visual transformation.",
    },
    {
      title: "Desk Cable Organizer Box (Heat Resistant)",
      profit: "Costs ~$6–9 landed, sells for $14.99–24.99.",
      why: "Messy cords stress people out.",
      angle: "Cable chaos → clean desk reveal.",
      likelihood: "High – WFH setups.",
    },
    {
      title: "Compact Foot Rest Under Desk",
      profit: "Costs ~$7–11 landed, sells for $19.99–29.99.",
      why: "Poor leg support causes fatigue.",
      angle: "Workday comfort POV.",
      likelihood: "Medium-High – office workers.",
    },
  ];

  function pickRandomProduct() {
    return PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  }

  // =========================
  // UI HELPERS
  // =========================
  function show(el) {
    el && el.classList.remove("hidden");
  }
  function hide(el) {
    el && el.classList.add("hidden");
  }
  function setText(el, txt) {
    if (el) el.textContent = txt || "";
  }

  // =========================
  // MAIN GENERATOR
  // =========================
  window.ZeusLite = {
    initGenerator(opts) {
      opts = opts || {};
      var dailyLimit = Number(opts.dailyLimit || 10);

      var btn = byId("genBtn") || byId("generateBtn");
      var loading = byId("loading");
      var loadingText = byId("loadingText");
      var result = byId("result");
      var limitMessage = byId("limitMessage");

      var ideaTitle = byId("ideaTitle");
      var profit = byId("profit");
      var why = byId("why");
      var angle = byId("angle");
      var likelihood = byId("likelihood");

      if (!btn) return;

      async function run() {
        hide(result);
        hide(limitMessage);

        var daily = readDaily();
        if (daily.count >= dailyLimit) {
          show(limitMessage);
          return;
        }

        show(loading);
        setText(loadingText, "Finding winning product…");
        btn.disabled = true;

        setTimeout(() => {
          setText(loadingText, "Analyzing buyer psychology…");
        }, 2500);

        try {
          await new Promise((r) => setTimeout(r, 5000));

          var data = pickRandomProduct();

          setText(ideaTitle, data.title);
          setText(profit, data.profit);
          setText(why, data.why);
          setText(angle, data.angle);
          setText(likelihood, data.likelihood);

          writeDaily(daily.count + 1);
          show(result);
        } catch (e) {
          console.error(e);
        } finally {
          hide(loading);
          btn.disabled = false;
        }
      }

      btn.addEventListener("click", run);
    },
  };
})();
