<body>
  <div class="container">
    <h1>Zeus Lite</h1>
    <p class="subtitle">For solo eCommerce sellers who need products people actually buy.</p>

    <button id="generateBtn" type="button">Generate Product</button>

    <div id="loading" class="hidden">
      <div class="spinner"></div>
      <p id="loadingText">Thinking…</p>
    </div>

    <div id="result" class="hidden">
      <h2 id="ideaTitle"></h2>

      <div class="idea-block">
        <strong>Profit potential:</strong>
        <div id="what"></div>
      </div>

      <div class="idea-block">
        <strong>Why it’s moving:</strong>
        <div id="who"></div>
      </div>

      <div class="idea-block">
        <strong>Best ad angle:</strong>
        <div id="money"></div>
      </div>

      <div class="idea-block">
        <strong>Purchase likelihood:</strong>
        <div id="why"></div>
      </div>

      <div class="idea-block">
        <strong>Daily usage:</strong>
        <div id="countText"></div>
      </div>
    </div>

    <div id="limitMessage" class="hidden">
      <h2>Daily limit reached</h2>
      <p>You’ve hit your max generation limit for today.<br />Try again tomorrow for more generations.</p>
    </div>
  </div>

  <script src="app.js"></script>
  <script>
    // Optional: gate the generator behind active subscription access
    // window.ZeusAuth.requireServerAccess("login.html");

    window.ZeusLite.initGenerator({ dailyLimit: 10 });
  </script>
</body>
