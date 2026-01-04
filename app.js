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
