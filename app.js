(function () {
  // =========================
  // Storage helpers
  // =========================
  var EMAIL_KEY = "__zl_email_v1";
  var LIMIT_KEY = "__zl_daily_v1"; // stores { date: "YYYY-MM-DD", count: number }

  function todayKey() {
    var d = new Date();
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    var dd = String(d.getDate()).padStart(2, "0");
    return yyyy + "-" + mm + "-" + dd;
  }

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
  }
  function safeRemove(key) {
    try { localStorage.removeItem(key); } catch (e) {}
  }

  function byId(id) { return document.getElementById(id); }

  function readDaily() {
    var raw = safeGet(LIMIT_KEY);
    if (!raw) return { date: todayKey(), count: 0 };
    try {
      var obj = JSON.parse(raw);
      if (!obj || obj.date !== todayKey()) return { date: todayKey(), count: 0 };
      return { date: obj.date, count: Number(obj.count || 0) };
    } catch (e) {
      return { date: todayKey(), count: 0 };
    }
  }

  function writeDaily(count) {
    safeSet(LIMIT_KEY, JSON.stringify({ date: todayKey(), count: count }));
  }

  // =========================
  // Auth (optional gating)
  // =========================
  window.ZeusAuth = {
    getEmail: function () {
      return (safeGet(EMAIL_KEY) || "").trim().toLowerCase();
    },
    setEmail: function (email) {
      safeSet(EMAIL_KEY, String(email || "").trim().toLowerCase());
    },
    clearEmail: function () {
      safeRemove(EMAIL_KEY);
    },

    // Redirects to login if:
    // - no email saved
    // - or server says not allowed
    requireServerAccess: async function (redirectTo) {
      var email = window.ZeusAuth.getEmail();
      if (!email || !email.includes("@")) {
        location.replace(redirectTo || "login.html");
        return;
      }

      try {
        var res = await fetch("/.netlify/functions/check-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        });

        var data = {};
        try { data = await res.json(); } catch (e) {}

        if (!data.allowed) {
          window.ZeusAuth.clearEmail();
          location.replace(redirectTo || "login.html");
        }
      } catch (e) {
        // If Netlify functions aren’t reachable, treat as no access
        window.ZeusAuth.clearEmail();
        location.replace(redirectTo || "login.html");
      }
    },
  };

  // =========================
  // Generator UI wiring
  // =========================
  function show(el) { if (el) el.classList.remove("hidden"); }
  function hide(el) { if (el) el.classList.add("hidden"); }

  function setText(el, txt) { if (el) el.textContent = txt || ""; }

  async function defaultGeneratorFallback() {
    // Fallback so the UI doesn't break if you haven't wired the real generator yet.
    // Replace by defining: window.ZeusLiteGenerate = async () => ({ title, profit, why, angle, likelihood })
    return {
      title: "Example Product Idea",
      profit: "High margin accessory; simple sourcing; bundles well.",
      why: "It’s trending due to seasonal demand + social proof content.",
      angle: "Before/after demo + problem/solution hook in first 2 seconds.",
      likelihood: "Medium-High (impulse buy under ~$30 performs best).",
    };
  }

  window.ZeusLite = {
    initGenerator: function (opts) {
      opts = opts || {};
      var dailyLimit = Number(opts.dailyLimit || 10);

      // Match IDs in lite.html
      var btn = byId("generateBtn") || byId("genBtn");
      var loading = byId("loading");
      var loadingText = byId("loadingText");
      var result = byId("result");
      var limitMessage = byId("limitMessage");

      var ideaTitle = byId("ideaTitle");
      // Support BOTH naming styles (your lite.html version vs older versions)
      var profit = byId("profit") || byId("what");
      var why = byId("why") || byId("who");
      var angle = byId("angle") || byId("money");
      var likelihood = byId("likelihood") || byId("why2");
      var countText = byId("countText");

      if (!btn) {
        console.warn("[ZeusLite] No generate button found (expected #generateBtn or #genBtn).");
        return;
      }

      function renderCount() {
        var daily = readDaily();
        if (countText) {
          countText.textContent = daily.count + " / " + dailyLimit;
        }
      }

      async function run() {
        hide(result);
        hide(limitMessage);

        var daily = readDaily();
        if (daily.count >= dailyLimit) {
          renderCount();
          show(limitMessage);
          return;
        }

        show(loading);
        setText(loadingText, "Finding best product…");
        btn.disabled = true;

        try {
          var genFn = window.ZeusLiteGenerate || defaultGeneratorFallback;
          var data = await genFn();

          // If your generator signals limit in some other way, we support this too:
          if (data && data.limitReached) {
            show(limitMessage);
            return;
          }

          setText(ideaTitle, data && data.title ? data.title : "Product Idea");
          setText(profit, data && (data.profit || data.what) ? (data.profit || data.what) : "");
          setText(why, data && (data.why || data.who) ? (data.why || data.who) : "");
          setText(angle, data && (data.angle || data.money) ? (data.angle || data.money) : "");
          setText(likelihood, data && (data.likelihood || data.purchaseLikelihood) ? (data.likelihood || data.purchaseLikelihood) : "");

          // Increment daily usage only after a successful generation
          daily = readDaily();
          writeDaily(daily.count + 1);
          renderCount();

          show(result);
        } catch (e) {
          console.error("[ZeusLite] generate error:", e);
          if (limitMessage) {
            var h2 = limitMessage.querySelector("h2");
            var p = limitMessage.querySelector("p");
            if (h2) h2.textContent = "Error";
            if (p) p.textContent = "Something went wrong. Try again.";
            show(limitMessage);
          }
        } finally {
          hide(loading);
          btn.disabled = false;
        }
      }

      btn.addEventListener("click", run);
      renderCount();
    },
  };
})();
