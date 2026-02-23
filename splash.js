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
})();
