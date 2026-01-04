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
    try { return localStorage.getItem(k); } catch { return null; }
  }
  function safeSet(k, v) {
    try { localStorage.setItem(k, v); } catch {}
  }
  function safeRemove(k) {
    try { localStorage.removeItem(k); } catch {}
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
          body: JSON.stringify({ email })
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
    }
  };

  // =========================
  // REAL PRODUCT DATA
  // =========================
  var PRODUCTS = [
  {
    title: "Magnetic Screen Door (Pet + Kids Friendly)",
    profit: "Costs ~$8–12 landed, sells for $29.99–49.99. Low return rate.",
    why: "People want fresh air without bugs; renters love no-drill installs.",
    angle: "Before/after bug swarm + effortless hands-free walk-through demo.",
    likelihood: "High – instant visible benefit."
  },
  {
    title: "Under-Cabinet Motion Sensor Light Bars",
    profit: "Costs ~$9–15, sells for $29.99–59.99. Bundle 2–4 packs.",
    why: "Night kitchen trips + closets + stairs = constant pain point.",
    angle: "POV night clip → lights auto-on → ‘why didn’t I buy sooner?’",
    likelihood: "High – solves daily annoyance."
  },
  {
    title: "Self-Adhesive Sliding Cabinet Locks (Babyproof)",
    profit: "Costs ~$2–4, sells for $14.99–24.99. Great multi-pack margins.",
    why: "New parents panic-buy safety fixes fast.",
    angle: "Chaos toddler clip → quick install → calm parent payoff.",
    likelihood: "Very High – emotional safety trigger."
  },
  {
    title: "Silicone Stove Gap Covers (Crumb Blockers)",
    profit: "Costs ~$2–4, sells for $14.99–19.99. Cheap ship + low returns.",
    why: "Everyone hates gunk falling between stove and counter.",
    angle: "Gross cleaning clip → cover install → spotless wipe reveal.",
    likelihood: "Very High – satisfying transformation."
  },
  {
    title: "Leak-Proof Travel Toiletry Bottles (TSA Set)",
    profit: "Costs ~$3–6, sells for $19.99–29.99. Strong giftability.",
    why: "Travelers hate shampoo explosions in luggage.",
    angle: "Stress test squeeze + upside-down leak test.",
    likelihood: "High – prevents expensive mess."
  },
  {
    title: "Reusable Lint + Pet Hair Laundry Catcher",
    profit: "Costs ~$2–4, sells for $14.99–24.99. Impulse buy.",
    why: "Pet owners constantly fight hair on clothes.",
    angle: "Washer reveal: ‘look what it caught’ close-up.",
    likelihood: "Very High – visual proof sells."
  },
  {
    title: "Electric Handheld Milk Frother (Coffee At Home)",
    profit: "Costs ~$2–5, sells for $14.99–24.99. Add-ons: syrups/cups.",
    why: "People want café drinks without paying $7 daily.",
    angle: "Home latte art glow-up in 10 seconds.",
    likelihood: "High – daily use + small price."
  },
  {
    title: "Car Seat Back Organizer (Kids + Travel)",
    profit: "Costs ~$6–10, sells for $24.99–39.99. Great bundles for 2 cars.",
    why: "Parents want less chaos and more storage in the car.",
    angle: "Messy car → organized transformation timelapse.",
    likelihood: "High – parent pain point."
  },
  {
    title: "Foldable Laptop Stand (Ergonomic + Cooling)",
    profit: "Costs ~$8–15, sells for $29.99–59.99. WFH evergreen.",
    why: "Neck/back pain from laptop hunching is huge.",
    angle: "Posture comparison + ‘pain relief’ narrative.",
    likelihood: "High – work/health crossover."
  },
  {
    title: "Mini Heat Sealer for Snack Bags",
    profit: "Costs ~$3–7, sells for $14.99–24.99. Viral demo potential.",
    why: "People hate stale chips and messy clips.",
    angle: "Crunch test: sealed vs unsealed after 3 days.",
    likelihood: "High – satisfying utility."
  },
  {
    title: "Shower Squeegee + Holder (Mold Prevention)",
    profit: "Costs ~$3–6, sells for $14.99–24.99. Low return risk.",
    why: "Hard water spots + mold cleanup is annoying.",
    angle: "One swipe reveal on glass door.",
    likelihood: "High – obvious visual payoff."
  },
  {
    title: "Portable Blender Bottle (Smoothies On-The-Go)",
    profit: "Costs ~$12–20, sells for $39.99–69.99. Strong AOV.",
    why: "Fitness/health crowd wants quick smoothies anywhere.",
    angle: "‘Gym bag smoothie’ demo + ice-crush test.",
    likelihood: "High – lifestyle-driven."
  },
  {
    title: "Adjustable Dumbbell Connector Bar (Home Gym Hack)",
    profit: "Costs ~$6–10, sells for $24.99–39.99. Niche but high intent.",
    why: "People want barbell-style lifts with dumbbells.",
    angle: "Home gym transformation + heavier lifts in seconds.",
    likelihood: "Medium-High – gym crowd converts."
  },
  {
    title: "Magnetic Phone Mount (Car Vent or Dash)",
    profit: "Costs ~$2–5, sells for $14.99–24.99. High volume item.",
    why: "Drivers want easy GPS view, hate flimsy mounts.",
    angle: "Shake test + one-hand snap-on demo.",
    likelihood: "High – universal use case."
  },
  {
    title: "Anti-Snore Nose Clips / Breathing Strips",
    profit: "Costs ~$2–6, sells for $14.99–29.99. Subscription angles.",
    why: "Snoring ruins sleep + relationships.",
    angle: "Couple POV: ‘we finally slept’ narrative.",
    likelihood: "Medium-High – depends on trust."
  },
  {
    title: "Reusable Sticky Gel Cleaner (Car + Keyboard Dust)",
    profit: "Costs ~$1–3, sells for $9.99–16.99. Easy upsell.",
    why: "Dust in vents/keys is gross and hard to clean.",
    angle: "Satisfying press-and-lift grime reveal.",
    likelihood: "High – cheap impulse buy."
  },
  {
    title: "LED Closet Rod Light (Motion + Rechargeable)",
    profit: "Costs ~$8–14, sells for $29.99–49.99.",
    why: "Closets are dark; people want ‘luxury’ feel cheap.",
    angle: "Dark closet → luxury lighting transformation.",
    likelihood: "High – aesthetic utility."
  },
  {
    title: "Silicone Makeup Brush Cleaning Bowl",
    profit: "Costs ~$1–3, sells for $9.99–19.99. Beauty evergreen.",
    why: "Dirty brushes cause breakouts; cleaning feels tedious.",
    angle: "Gross foam reveal + ‘acne fix’ framing.",
    likelihood: "High – beauty pain point."
  },
  {
    title: "Rechargeable Pocket Hand Warmer",
    profit: "Costs ~$8–15, sells for $24.99–49.99. Seasonal spikes.",
    why: "Cold hands commuting/outdoors = constant complaint.",
    angle: "Temperature test + cozy POV outdoors.",
    likelihood: "High in season – Medium off-season."
  },
  {
    title: "Cable Management Box + Clips Set",
    profit: "Costs ~$6–10, sells for $19.99–39.99. Bundle-friendly.",
    why: "People hate messy cords (WFH + living rooms).",
    angle: "Desk glow-up before/after.",
    likelihood: "High – aesthetic + organization."
  },
  {
    title: "Collapsible Water Bowl (Dog Walk Essential)",
    profit: "Costs ~$1–3, sells for $9.99–16.99. Great add-on item.",
    why: "Pet owners need water on hikes/walks.",
    angle: "Cute dog drinking + ‘never forget water’ hook.",
    likelihood: "High – pet market buys fast."
  },
  {
    title: "Furniture Moving Sliders (Hardwood Saver)",
    profit: "Costs ~$2–5, sells for $14.99–24.99. Low returns.",
    why: "Moving furniture scratches floors and hurts backs.",
    angle: "One-person move demo + scratch prevention proof.",
    likelihood: "High – practical + visual."
  },
  {
    title: "Kitchen Sink Caddy Organizer (Sponge + Brush)",
    profit: "Costs ~$4–8, sells for $19.99–29.99.",
    why: "People want cleaner counters and less slime.",
    angle: "Gross sponge puddle → clean sink setup reveal.",
    likelihood: "High – home organization trend."
  },
  {
    title: "Door Draft Stopper (Energy Saver)",
    profit: "Costs ~$3–7, sells for $14.99–29.99. Seasonal boost.",
    why: "Cold drafts = higher bills + discomfort.",
    angle: "Candle smoke test showing draft → stopper fix.",
    likelihood: "High in season."
  },
  {
    title: "Reusable Silicone Food Storage Bags (Zip + Freezer)",
    profit: "Costs ~$6–12, sells for $24.99–39.99. Eco angle.",
    why: "People want to reduce waste but still want convenience.",
    angle: "Leak test + meal prep aesthetic.",
    likelihood: "High – kitchen evergreen."
  }
];

  function pickRandomProduct() {
    return PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  }

  // =========================
  // UI HELPERS
  // =========================
  function show(el) { el && el.classList.remove("hidden"); }
  function hide(el) { el && el.classList.add("hidden"); }
  function setText(el, txt) { if (el) el.textContent = txt || ""; }

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
          await new Promise(r => setTimeout(r, 5000));

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
    }
  };
})();
