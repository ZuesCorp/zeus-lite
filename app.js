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
    safeSet(LIMIT_KEY, JSON.stringify({ date: todayKey(), count: count }));
  }

  // =========================
  // AUTH
  // =========================
  window.ZeusAuth = {
    getEmail: function () {
      return (safeGet(EMAIL_KEY) || "").toLowerCase().trim();
    },
    setEmail: function (email) {
      safeSet(EMAIL_KEY, String(email || "").toLowerCase().trim());
    },
    clearEmail: function () {
      safeRemove(EMAIL_KEY);
    },
    requireServerAccess: async function (redirectTo) {
      var email = this.getEmail();
      if (!email.includes("@")) {
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

        if (!data || !data.allowed) {
          this.clearEmail();
          location.replace(redirectTo || "login.html");
        }
      } catch (e) {
        this.clearEmail();
        location.replace(redirectTo || "login.html");
      }
    },
  };

  // =========================
  // REAL PRODUCT DATA (LONGER DESCRIPTIONS)
  // =========================
  var PRODUCTS = [
    {
      title: "Portable Ice Bath Tub (Athletes & Recovery)",
      profit:
        "Manufacturing cost is typically around ~$35 (varies by material thickness, valve quality, and included cover). This can comfortably retail at $99–$149 depending on positioning (recovery, biohacking, or athlete performance). High AOV plus easy upsells like insulated lids, water thermometers, drainage pumps, and replacement liners.",
      why:
        "Cold therapy has become a mainstream “recovery ritual” across TikTok, YouTube, and gym culture. People are chasing faster recovery, less soreness, and the identity/status of disciplined routines. It also ties into broader wellness trends (sleep, stress reduction, mental toughness), so it spreads beyond hardcore athletes into everyday buyers.",
      angle:
        "Run a 7-day challenge style ad: day 1 shock reaction → day 7 “I feel unreal” transformation. Mix emotional hooks (discipline, confidence) with simple benefit claims (recovery routine, soreness relief). Add credibility with visual proof: timer countdown, breath control, and post-workout context.",
      likelihood:
        "High — it’s trend-driven and identity-based, plus the payoff is easy to imagine (less soreness, better recovery). Strong impulse potential when paired with dramatic reaction content, but works best when framed as a simple at-home alternative to expensive cold-plunge setups.",
    },
    {
      title: "Pet Hair Remover Roller (Reusable)",
      profit:
        "Costs roughly ~$3–5 landed depending on packaging and roller build. Common retail price is $19.99 with room for bundles (2-pack, travel size, replacement roller head). Low breakage, low return rate, and extremely cheap shipping make margins very attractive for beginners and scaled stores.",
      why:
        "Pet owners live with constant fur on clothes, beds, and couches — it’s an everyday frustration that never fully goes away. Lint rollers are wasteful and run out, vacuums are annoying, and sticky tape hacks feel cheap. A reusable solution hits both convenience and sustainability, and the visual difference is instantly satisfying.",
      angle:
        "Make the first 2 seconds a “one swipe” visual: half the couch covered in fur → one clean stripe. Then show how it empties (hair compartment reveal) and repeat on different surfaces: sofa, car seats, black hoodie. End with a simple line: “Stop buying lint rollers forever.”",
      likelihood:
        "Very High — universal, obvious problem + immediate visual payoff. This is the type of product where people understand the value in seconds, which makes it ideal for short-form ads and impulse purchases.",
    },
    {
      title: "Car Gap Filler Organizer (Seat Gap)",
      profit:
        "Typically costs ~$6 landed (material quality matters) and commonly sells for $29.99. Easy to create value with a 2-pack, add-on cup holders, or a “car organization kit” bundle. Low complexity, low warranty issues, and strong gifting potential.",
      why:
        "Almost everyone drops phones, keys, coins, or food between the seat and center console. It’s annoying, unsafe (reaching while driving), and feels like a daily mini-failure. A simple snap-in solution that also adds storage is instantly relatable and doesn’t require education.",
      angle:
        "Start with a POV frustration moment: phone slips → driver reaches → “NOOO.” Cut to the product sliding in and catching everything. Show storage use (wallet, receipts) and a quick before/after interior shot. Keep it punchy and comedic, then end on safety + convenience.",
      likelihood:
        "High — it’s a cheap upgrade with an obvious benefit and a common pain point. Works especially well for commuters, parents, rideshare drivers, and anyone who spends time in their car daily.",
    },
    {
      title: "Heated USB Desk Hand Warmer Pad",
      profit:
        "Commonly costs ~$7–12 landed depending on heating element and size. Sells well at $19.99–$29.99 and can be bundled with desk accessories (mousepad combo, wrist rests). Returns are usually low when positioned as a comfort product rather than a medical device.",
      why:
        "Cold hands while working is a real productivity killer — especially in winter, for people in cold offices, or anyone who prefers lower home heating bills. It’s also a comfort/“cozy desk setup” trend product that fits perfectly in the aesthetics of work-from-home content.",
      angle:
        "Use a thermal camera or simple “touch test” demo: cold desk vs warm pad. Show the product in a cozy workspace (coffee, laptop, ambient lighting) and emphasize comfort + focus. Add a hook like “If your fingers go numb at your desk… this fixes it.”",
      likelihood:
        "High (seasonal spike) — strong during colder months, but still sells year-round for office workers and people with naturally cold hands. Great for UGC and “desk setup” influencer placements.",
    },
    {
      title: "Over-the-Sink Dish Drying Rack (Roll-Up)",
      profit:
        "Usually costs ~$8–12 landed depending on stainless quality and silicone ends. Sells for $19.99–$29.99 and can be upsold with kitchen organization items (sink caddies, soap dispensers). Lightweight, low return rate, and easy to ship.",
      why:
        "Small kitchens don’t have enough counter space, and people hate clutter around the sink. A roll-up rack feels like a clever “space hack” that makes the kitchen look cleaner instantly. It also solves multiple micro-problems: drying dishes, rinsing produce, and creating temporary prep space.",
      angle:
        "Do a before/after kitchen transformation: crowded counter → rack rolls out over sink → clean minimalist look. Show multi-use: drying cups, draining pasta, rinsing fruit. End with “tiny kitchen approved” or “instant extra counter space.”",
      likelihood:
        "High — home organization content performs extremely well, and this product is easy to understand. Strong buy intent because it’s practical and fits a wide range of households.",
    },
    {
      title: "Cordless Electric Screwdriver Set",
      profit:
        "Typically costs ~$10–15 landed based on battery capacity and bit set size. Common retail is $24.99–$29.99, with premium sets going higher. Great for bundles (extra bits, mini tool kit) and strong gift product for new homeowners and renters.",
      why:
        "People hate manual screwing — it’s slow, tiring, and frustrating when assembling furniture or doing small repairs. A compact cordless driver feels like a “life upgrade,” especially for people who don’t want bulky power tools but still want convenience and speed.",
      angle:
        "Show speed comparison: manual screwdriver struggling vs electric set finishing in seconds. Use IKEA/furniture assembly as the scenario because it’s relatable. Add a satisfying sound + quick-cut montage of multiple jobs (cabinet handles, toys, light fixtures).",
      likelihood:
        "High — practical, giftable, and easy to justify. Buyers immediately picture using it, and it reduces friction for DIY tasks without needing a ‘tool person’ identity.",
    },
    {
      title: "Reusable Silicone Baking Mat (Non-Stick)",
      profit:
        "Costs around ~$4–7 landed depending on thickness and branding. Sells for $14.99–$24.99 and works well as a 2-pack. Low returns, low defect rate, and repeat customers are common when positioned as a kitchen staple.",
      why:
        "People are tired of wasting parchment paper and scrubbing stuck-on messes from trays. The eco angle helps, but the real driver is convenience: easy release, less oil needed, and quick cleanup. It also fits the home baking/meal prep trend perfectly.",
      angle:
        "Show the ‘peel’ moment: cookies lift off cleanly with zero sticking. Then show cleaning: wipe + rinse in seconds. Add a simple savings hook: “Stop buying parchment every week.” Finish with a satisfying before/after on a dirty tray vs clean tray.",
      likelihood:
        "High — broad audience, clear benefit, and strong repeat use. Great for short-form demos because the payoff is visual and immediate.",
    },
    {
      title: "Smart Posture Corrector Strap",
      profit:
        "Often costs ~$7–12 landed depending on sensor quality and materials. Sells for $19.99–$29.99, with bundles and ‘desk health’ kits boosting AOV. Returns can be controlled by positioning it as a habit reminder rather than a miracle fix.",
      why:
        "Millions of people sit all day and feel neck/shoulder pain from slouching, especially remote workers and students. Posture is also tied to confidence and appearance, so it’s both a comfort and identity product. People want something that nudges them without needing a full lifestyle overhaul.",
      angle:
        "Use a ‘slouch alert’ demo: slouching triggers the reminder → user straightens up. Pair with relatable desk content and simple language: “It trains you to sit better.” Add a 1-week routine hook and show posture difference in side-by-side shots.",
      likelihood:
        "Medium-High — strong for health-conscious buyers and office workers. Best performance comes from clear expectation setting, relatable pain points, and a simple “habit builder” positioning.",
    },
    {
      title: "Bathroom Sink Hair Catcher (Stainless Steel)",
      profit:
        "Costs about ~$3–5 landed depending on steel grade and packaging. Sells for $12.99–$19.99, and bundles easily with drain cleaning tools or shower variants. Extremely low return risk because it’s simple and durable.",
      why:
        "Clogged drains are gross, expensive, and stressful — and hair is the #1 culprit in many homes. People don’t notice the problem until it’s bad, so a preventative solution feels like a ‘smart adulting’ purchase. It’s also instantly relatable to anyone with longer hair or shared bathrooms.",
      angle:
        "Lead with a shock reveal: pull up a nasty hair clog (tasteful but attention-grabbing). Then show the catcher collecting hair cleanly over a week. End with a simple line: “Stop paying for drain clogs” or “Prevent it before it’s gross.”",
      likelihood:
        "Very High — universal problem + very cheap solution. Works great as an impulse buy because the value is obvious and the pain is real.",
    },
    {
      title: "Portable LED Ring Light Tripod (Phone Mount)",
      profit:
        "Usually costs ~$8–13 landed depending on tripod strength and LED quality. Sells for $19.99–$29.99, with upgrades for larger sizes or remote controls. Great bundles: mic add-on, phone lens kit, or “creator starter kit.”",
      why:
        "Creators, small businesses, and everyday people want better lighting instantly — it’s the fastest way to improve video and photos. The ‘creator economy’ isn’t just influencers anymore; it’s Etsy sellers, service providers, and anyone posting content for growth.",
      angle:
        "Do a direct comparison: front camera in bad light vs ring light turned on. Show quick setup and a few use cases: TikTok, Zoom, product photos, makeup. Hook line: “If your videos look dull, it’s your lighting.”",
      likelihood:
        "High — broad use cases, easy demo, and clear improvement. Works especially well when targeted at creators, salons, realtors, and small business owners.",
    },
    {
      title: "Shower Head with Filter (Hard Water Fix)",
      profit:
        "Commonly costs ~$9–14 landed depending on filtration media and build. Sells for $24.99–$29.99 with strong recurring revenue on replacement filters. Customers often buy multiple for different bathrooms, boosting LTV.",
      why:
        "Hard water can make hair feel dry, skin irritated, and showers less enjoyable. People are already spending money on shampoos and skincare, so a shower upgrade that claims to improve results feels logical. It also taps into ‘clean water’ and wellness narratives that perform well online.",
      angle:
        "Use a simple water test demo (sediment/clarity) and a ‘spa shower’ vibe. Show replacing the filter and the ‘before/after’ shower experience. Hook with: “If your hair feels dry after showering… your water might be the issue.”",
      likelihood:
        "High — strong beauty + wellness crossover. Highest conversion when you keep the message simple (comfort/experience) and show the filter/replacement story for trust.",
    },
    {
      title: "Magnetic Spice Rack for Refrigerator",
      profit:
        "Usually costs ~$6–10 landed depending on shelf size and magnet strength. Sells for $14.99–$24.99 and works well as a multi-pack. Very low return rate when magnets are strong and photos match expectations.",
      why:
        "People run out of cabinet space and hate digging through cluttered spice drawers. Kitchen organization is a huge content category, and a fridge-side solution feels like a clever ‘hidden storage’ upgrade. It also creates a satisfying before/after transformation.",
      angle:
        "Show the ‘zero space’ problem: overcrowded cabinet → add magnetic rack → clean, accessible spices. Emphasize strong magnets and no installation. End with a quick aesthetic kitchen shot and “tiny kitchen hack.”",
      likelihood:
        "High — simple, practical, and visually satisfying. Especially strong for renters and small apartments where permanent mounting isn’t ideal.",
    },
    {
      title: "Noise-Reducing Door Draft Stopper",
      profit:
        "Often costs ~$5–8 landed depending on foam density and fabric. Sells for $14.99–$24.99 with bundle opportunities (2-pack for bedroom + front door). Low shipping cost and low returns when sizing is clear.",
      why:
        "Noise and cold drafts ruin sleep and comfort, especially in apartments, older homes, or shared living. People feel the problem daily but don’t realize a cheap solution exists. It also overlaps with ‘energy saving’ and ‘cozy home’ trends.",
      angle:
        "Run a simple sound test: hallway noise loud → install → noticeably quieter. Then show draft test with tissue/paper moving, followed by stillness. Hook: “If light and noise leak under your door…” and finish with a cozy nighttime scene.",
      likelihood:
        "High — practical, easy to understand, and emotionally driven (sleep/comfort). Great for renters and anyone sensitive to noise or cold.",
    },
    {
      title: "Electric Lint Remover for Clothes",
      profit:
        "Typically costs ~$6–10 landed. Sells for $14.99–$24.99, with bundle options for extra blades or a premium version. Low return rates because the transformation is obvious and the device is straightforward.",
      why:
        "Pilling and fuzz make clothes look old and cheap, even if they’re good quality. People don’t want to throw out sweaters and coats just because they look worn. A lint remover creates a satisfying ‘renewed’ look and feels like saving money by extending clothing life.",
      angle:
        "Make it a transformation ad: split screen old sweater vs after. Show the lint tray filling up for the ‘wow’ factor. Hook line: “Don’t replace your wardrobe — refresh it.” Finish with a clean close-up texture shot.",
      likelihood:
        "Very High — extremely visual payoff + clear value. This is a classic impulse buy because the result looks dramatic and immediate.",
    },
    {
      title: "Desk Cable Organizer Box (Heat Resistant)",
      profit:
        "Costs ~$6–9 landed depending on material and size. Sells for $14.99–$24.99 and can be bundled with clips, Velcro ties, or a full desk organization kit. Low return rate when sized well and positioned as ‘clean setup’ accessory.",
      why:
        "Cable clutter makes desks look messy and increases stress, especially for remote workers and gamers. People love a clean aesthetic workspace, and “desk setup” content is huge. This product also has a practical benefit: hides power strips and reduces accidental unplugging.",
      angle:
        "Show the chaos → clean reveal: tangled power strip on the floor → everything tucked into the box. Add a quick “pet-proof / kid-proof” moment and show a wide desk shot that looks premium. Hook: “If your desk looks messy because of cables…”",
      likelihood:
        "High — strong visual transformation and broad WFH appeal. Works best when the final shot looks like a premium minimalist setup.",
    },
    {
      title: "Compact Foot Rest Under Desk",
      profit:
        "Usually costs ~$7–11 landed depending on foam density and cover material. Sells for $19.99–$29.99, with upsells for posture accessories (lumbar pillow, wrist rest). Returns stay low when comfort expectations are set clearly.",
      why:
        "Long sitting hours can cause leg fatigue, lower back discomfort, and poor circulation. A foot rest is a simple comfort upgrade that makes a workday feel noticeably better. It also fits ergonomic home office trends where people are optimizing their setup for health and productivity.",
      angle:
        "Use a ‘workday comfort’ POV: feet dangling → posture slumped → add foot rest → relaxed posture. Show it under a desk with clean aesthetics and a simple promise: “Makes your desk chair instantly more comfortable.”",
      likelihood:
        "Medium-High — strong for office workers and students. Performs best when paired with ergonomic messaging and a clear comfort-focused demo.",
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
    initGenerator: function (opts) {
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

        setTimeout(function () {
          setText(loadingText, "Analyzing buyer psychology…");
        }, 2500);

        try {
          await new Promise(function (r) {
            setTimeout(r, 5000);
          });

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
