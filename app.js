* {
  box-sizing: border-box;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}

:root{
  --bg0:#05060a;
  --bg1:#070913;

  --text: rgba(255,255,255,0.92);
  --muted: rgba(255,255,255,0.68);
  --muted2: rgba(255,255,255,0.56);

  --card: rgba(255,255,255,0.055);
  --cardBorder: rgba(255,255,255,0.11);

  --tile: rgba(255,255,255,0.035);
  --tileBorder: rgba(255,255,255,0.085);

  --shadow: rgba(0,0,0,0.72);
}

body{
  margin:0;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  color: var(--text);
  position: relative;
  overflow:hidden;

  /* Deep matte background + subtle light pools */
  background:
    radial-gradient(900px 520px at 18% 12%, rgba(255,255,255,0.06), transparent 58%),
    radial-gradient(760px 460px at 82% 18%, rgba(255,255,255,0.045), transparent 60%),
    radial-gradient(900px 600px at 50% 110%, rgba(255,255,255,0.04), transparent 65%),
    linear-gradient(180deg, var(--bg1) 0%, var(--bg0) 100%);
}

body::after{
  content:"";
  position:absolute;
  inset:-240px;
  pointer-events:none;
  opacity:0.09;

  /* micro-grain texture */
  background-image:
    repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 3px),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.016) 0 1px, transparent 1px 4px);
  transform: rotate(-2deg);
}

.container{
  width:92%;
  max-width: 820px;
  padding: 58px 60px;
  border-radius: 26px;
  position:relative;
  z-index:1;

  /* Frosted glass + clean border */
  background: var(--card);
  border: 1px solid var(--cardBorder);

  box-shadow:
    0 28px 90px var(--shadow),
    inset 0 1px 0 rgba(255,255,255,0.07);

  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  text-align:center;
}

/* top highlight line for that "premium device" feel */
.container::before{
  content:"";
  position:absolute;
  left:18px;
  right:18px;
  top:12px;
  height:1px;
  border-radius:999px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
  opacity:0.7;
}

h1{
  margin:0 0 14px;
  font-size: 56px;
  font-weight: 680;
  letter-spacing: 0.6px;
}

.subtitle{
  margin: 0 0 34px;
  font-size: 16px;
  color: var(--muted);
  line-height: 1.5;
}

/* “Silver platter” button */
button{
  border-radius: 14px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 650;
  cursor:pointer;

  color: rgba(0,0,0,0.90);
  border: 1px solid rgba(255,255,255,0.35);

  background:
    radial-gradient(160px 60px at 50% 0%, rgba(255,255,255,0.95), rgba(255,255,255,0.70)),
    linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(215,215,215,0.90) 55%, rgba(185,185,185,0.92) 100%);

  box-shadow:
    0 16px 30px rgba(0,0,0,0.45),
    inset 0 1px 0 rgba(255,255,255,0.6);

  transition: transform 140ms ease, opacity 140ms ease, box-shadow 140ms ease;
}

button:hover{
  transform: translateY(-1px);
  opacity: 0.98;
  box-shadow:
    0 18px 34px rgba(0,0,0,0.50),
    inset 0 1px 0 rgba(255,255,255,0.7);
}

button:active{
  transform: translateY(0px);
}

button:disabled{
  opacity:0.62;
  cursor:not-allowed;
  transform:none;
}

.hidden{ display:none; }

#loading{
  margin-top: 26px;
}

#loading p{
  margin-top: 12px;
  color: var(--muted2);
  letter-spacing: 0.25px;
}

/* cleaner spinner */
.spinner{
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.14);
  border-top: 3px solid rgba(255,255,255,0.85);
  animation: spin 0.9s linear infinite;
  margin: 0 auto;
}

@keyframes spin { to { transform: rotate(360deg); } }

#result{
  margin-top: 38px;
  text-align:left;
}

#ideaTitle{
  margin: 0 0 18px;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 0.25px;
}

.idea-block{
  margin-top: 14px;
  padding: 16px 18px;
  border-radius: 16px;

  background: var(--tile);
  border: 1px solid var(--tileBorder);

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.04);

  font-size: 15px;
  line-height: 1.65;
}

.idea-block strong{
  display:block;
  margin-bottom: 6px;
  font-weight: 700;
  color: rgba(255,255,255,0.90);
}

.idea-block span{
  color: rgba(255,255,255,0.77);
}

/* limit message looks premium too */
#limitMessage{
  margin-top: 38px;
  text-align:left;
  padding: 18px 18px;
  border-radius: 18px;

  background: var(--tile);
  border: 1px solid rgba(255,255,255,0.10);
}

#limitMessage h2{
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

#limitMessage p{
  margin: 0;
  color: rgba(255,255,255,0.75);
  line-height: 1.65;
}
