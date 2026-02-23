(() => {
  const splash = document.createElement("div");
  splash.className = "splash";
  splash.setAttribute("aria-hidden", "true");
  splash.innerHTML = [
    '<div class="splash-inner">',
    '  <img class="splash-logo" src="./logo.png" alt="">',
    '  <p class="splash-text">SIM-OS</p>',
    '</div>'
  ].join("\n");

  document.body.prepend(splash);

  const removeSplash = () => {
    if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
  };

  splash.addEventListener("animationend", (event) => {
    if (event.animationName === "splashOut") removeSplash();
  });

  setTimeout(removeSplash, 3500);

  const eggStyle = document.createElement("style");
  eggStyle.textContent = `
    .egg-toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%);
      background: #0f172a;
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.22);
      border-radius: 12px;
      padding: 12px 16px;
      font-family: "JetBrains Mono", "Consolas", "Menlo", monospace;
      font-size: 14px;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
      z-index: 9999;
      opacity: 0;
      animation: eggToastIn 0.28s ease forwards;
    }

    .egg-stars {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9998;
      overflow: hidden;
    }

    .egg-stars span {
      position: absolute;
      top: -20px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      animation: eggFall linear forwards;
    }

    .egg-badge {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 9999;
      background: #ffffff;
      border: 2px solid #1b4fd9;
      border-radius: 14px;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: "JetBrains Mono", "Consolas", "Menlo", monospace;
      font-weight: 700;
      color: #0f172a;
      animation: eggPulse 0.8s ease-in-out infinite;
    }

    .egg-badge img {
      width: 44px;
      height: 44px;
      object-fit: contain;
    }

    @keyframes eggFall {
      to { transform: translateY(110vh) rotate(360deg); opacity: 0.2; }
    }

    @keyframes eggToastIn {
      from { transform: translateX(-50%) translateY(20px); opacity: 0; }
      to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }

    @keyframes eggPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;
  document.head.appendChild(eggStyle);

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "egg-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2600);
  }

  function showStarRain() {
    const layer = document.createElement("div");
    layer.className = "egg-stars";
    for (let i = 0; i < 36; i += 1) {
      const star = document.createElement("span");
      star.style.left = `${Math.random() * 100}%`;
      star.style.background = `hsl(${Math.floor(Math.random() * 360)} 95% 55%)`;
      star.style.animationDuration = `${2 + Math.random() * 1.6}s`;
      star.style.animationDelay = `${Math.random() * 0.5}s`;
      layer.appendChild(star);
    }
    document.body.appendChild(layer);
    setTimeout(() => {
      if (layer.parentNode) layer.parentNode.removeChild(layer);
    }, 3200);
  }

  function showPicoBadge() {
    const old = document.querySelector(".egg-badge");
    if (old && old.parentNode) old.parentNode.removeChild(old);

    const badge = document.createElement("div");
    badge.className = "egg-badge";
    badge.innerHTML = '<img src="./logo.png" alt=""><span>PICO MODE UNLOCKED</span>';
    document.body.appendChild(badge);
    setTimeout(() => {
      if (badge.parentNode) badge.parentNode.removeChild(badge);
    }, 4200);
  }

  function runSimEasterEgg() {
    showStarRain();
    showToast("Пасхалка знайдена: SIM!");
  }

  function runPicoEasterEgg() {
    showPicoBadge();
    showToast("Пасхалка знайдена: PICO!");
  }

  let typed = "";
  const secrets = [
    { code: "sim", run: runSimEasterEgg },
    { code: "pico", run: runPicoEasterEgg }
  ];

  document.addEventListener("keydown", (event) => {
    const tag = (event.target && event.target.tagName) ? event.target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea") return;
    if (!event.key || event.key.length !== 1) return;

    typed = `${typed}${event.key.toLowerCase()}`.slice(-10);
    secrets.forEach((secret) => {
      if (typed.endsWith(secret.code)) {
        typed = "";
        secret.run();
      }
    });
  });

  const interactiveSelector = [
    "a",
    "button",
    "input",
    "textarea",
    "select",
    "label",
    "summary",
    "[role='button']",
    "[contenteditable='true']",
    "iframe",
    "embed",
    "object"
  ].join(",");

  function isInteractiveTarget(target) {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest(interactiveSelector));
  }

  const longPressMs = 700;
  const tapSeriesMs = 1400;
  const moveThreshold = 12;
  let trackingTouch = false;
  let longPressTriggered = false;
  let longPressTimer = null;
  let tapCount = 0;
  let tapTimer = null;
  let startX = 0;
  let startY = 0;

  function clearLongPressTimer() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function resetTapSeries() {
    tapCount = 0;
    if (tapTimer) {
      clearTimeout(tapTimer);
      tapTimer = null;
    }
  }

  document.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1 || isInteractiveTarget(event.target)) {
      trackingTouch = false;
      clearLongPressTimer();
      return;
    }

    const touch = event.touches[0];
    trackingTouch = true;
    longPressTriggered = false;
    startX = touch.clientX;
    startY = touch.clientY;
    clearLongPressTimer();
    longPressTimer = setTimeout(() => {
      if (!trackingTouch) return;
      longPressTriggered = true;
      resetTapSeries();
      runPicoEasterEgg();
    }, longPressMs);
  }, { passive: true });

  document.addEventListener("touchmove", (event) => {
    if (!trackingTouch || event.touches.length !== 1) return;
    const touch = event.touches[0];
    if (Math.abs(touch.clientX - startX) > moveThreshold || Math.abs(touch.clientY - startY) > moveThreshold) {
      clearLongPressTimer();
    }
  }, { passive: true });

  document.addEventListener("touchend", () => {
    if (!trackingTouch) return;
    trackingTouch = false;
    clearLongPressTimer();

    if (longPressTriggered) {
      longPressTriggered = false;
      return;
    }

    tapCount += 1;
    if (tapCount >= 5) {
      resetTapSeries();
      runSimEasterEgg();
      return;
    }

    if (tapTimer) clearTimeout(tapTimer);
    tapTimer = setTimeout(() => {
      tapCount = 0;
      tapTimer = null;
    }, tapSeriesMs);
  }, { passive: true });

  document.addEventListener("touchcancel", () => {
    trackingTouch = false;
    longPressTriggered = false;
    clearLongPressTimer();
  }, { passive: true });
})();
