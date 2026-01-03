(function () {
  var EMAIL_KEY = "__zl_email_v1";
  var LIMIT_KEY = "__zl_daily_v1";

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

  function byId(id) {
    return document.getElementById(id);
  }

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

        var data = await res.json();

        if (!data.allowed) {
          window.ZeusAuth.clearEmail();
          location.replace(redirectTo || "login.html");
        }
      } catch (e) {
        window.ZeusAuth.clearEmail();
        location.replace(redirectTo || "login.html");
      }
    }
  };

  function getDailyState() {
    var raw = safeGet(LIMIT_KEY);
    var t = todayKey();
    if (!raw) return { day: t, count: 0 };

    try {
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.day !== t) return { day: t, count: 0 };
      return { day: t, count: Number(parsed.count || 0) };
    } catch (e) {
      return { day: t, count: 0 };
    }
  }

  function setDailyState(state) {
    safeSet(LIMIT_KEY, JSON.stringify(state));
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateIdea() {
    var titles = [
      "One-tap Warranty Tracker",
      "Smart Pantry Refill Reminders",
      "Tiny Habit Builder for Busy People",
      "Local Deal Finder for Parents",
      "Freelancer Scope-Creep Guard",
      "AI-Powered Listing Photo Fixer",
      "Subscription Audit + Cancel Helper",
      "Gym Routine Generator for Beginners",
      "Study Sprint Timer with Rewards",
      "Simple Client Portal for Solo Pros"
    ];

    var profit = [
      "High-margin digital subscription with low support load.",
      "B2B pricing power: charge per seat or per workspace.",
      "Upsell paths: templates, add-ons, and done-for-you setup."
    ];

    var moving = [
      "People are overwhelmed by options and want “just tell me what to do.”",
      "Costs are up, so tools that save money feel urgent.",
      "Solo operators need lightweight tools, not full platforms."
    ];

    var angle = [
      "Before/after: show time saved in a 10-second demo.",
      "Target a niche pain: “Stop losing money to ___.”",
      "Social proof style: “I built this to fix my own problem.”"
    ];

    var likelihood = [
      "Strong if you nail a specific niche landing page and a fast demo.",
      "Medium-high with a clear ROI and a 7-day free trial (optional).",
      "High when bundled with templates and a simple onboarding checklist."
    ];

    return {
      title: pick(titles),
      what: pick(profit),
      who: pick(moving),
      money: pick(angle),
      why: pick(likelihood)
    };
  }

  window.ZeusLite = {
    initGenerator: function (opts) {
      opts = opts || {};
      var dailyLimit = Number(opts.dailyLimit || 10);

      var generateBtn = byId("generateBtn");
      var loading = byId("loading");
      var loadingText = byId("loadingText");
      var result = byId("result");
      var limitMessage = byId("limitMessage");

      var ideaTitle = byId("ideaTitle");
      var what = byId("what");
      var who = byId("who");
      var money = byId("money");
      var why = byId("why");
      var countText = byId("countText");

      if (!generateBtn) return;

      function show(el) { if (el) el.classList.remove("hidden"); }
      function hide(el) { if (el) el.classList.add("hidden"); }

      function renderCount(state) {
        if (!countText) return;
        countText.textContent = "Today: " + state.count + " / " + dailyLimit + " ideas generated.";
      }

      function setBusy(isBusy, msg) {
        if (isBusy) {
          hide(result);
          hide(limitMessage);
          show(loading);
          if (loadingText) loadingText.textContent = msg || "Thinking…";
          generateBtn.disabled = true;
        } else {
          hide(loading);
          generateBtn.disabled = false;
        }
      }

      function checkLimit() {
        var state = getDailyState();
        if (state.count >= dailyLimit) {
          hide(loading);
          hide(result);
          show(limitMessage);
          renderCount(state);
          return false;
        }
        renderCount(state);
        return true;
      }

      checkLimit();

      generateBtn.addEventListener("click", function () {
        if (!checkLimit()) return;

        var state = getDailyState();
        setBusy(true, "Generating a strong idea…");

        setTimeout(function () {
          var idea = generateIdea();

          ideaTitle.textContent = idea.title;
          what.textContent = idea.what;
          who.textContent = idea.who;
          money.textContent = idea.money;
          why.textContent = idea.why;

          state.count += 1;
          setDailyState(state);

          setBusy(false);
          hide(limitMessage);
          show(result);
          renderCount(state);
        }, 650);
      });
    }
  };
})();
