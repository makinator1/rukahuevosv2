// Menú de navegación desplegable en pantallas angostas
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  function setOpen(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }

  toggle.addEventListener("click", function () {
    setOpen(!menu.classList.contains("is-open"));
  });

  // Cerrar al elegir un enlace, con Escape o al volver a pantalla ancha
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
  window.matchMedia("(min-width: 861px)").addEventListener("change", function (e) {
    if (e.matches) setOpen(false);
  });
})();

// Slideshow de fotos y videos: flechas, puntos y avance automático
(function () {
  var show = document.querySelector(".slideshow");
  if (!show) return;
  var track = show.querySelector(".slides");
  var slides = Array.prototype.slice.call(track.children);
  var dots = show.querySelector(".slide-dots");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timer;

  function current() {
    var left = track.scrollLeft;
    var best = 0;
    slides.forEach(function (s, i) {
      if (Math.abs(s.offsetLeft - track.offsetLeft - left) <
          Math.abs(slides[best].offsetLeft - track.offsetLeft - left)) best = i;
    });
    return best;
  }
  function perView() {
    return Math.max(1, Math.round(track.clientWidth / slides[0].offsetWidth));
  }
  function last() {
    return slides.length - perView();
  }
  function goTo(i) {
    i = Math.max(0, Math.min(i, last()));
    track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft });
  }
  // Flechas y avance automático dan la vuelta al llegar a un extremo
  function step(d) {
    var c = current();
    if (d > 0 && c >= last()) goTo(0);
    else if (d < 0 && c <= 0) goTo(last());
    else goTo(c + d);
  }

  slides.forEach(function (s, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Ir a la foto " + (i + 1));
    b.addEventListener("click", function () { goTo(i); restart(); });
    dots.appendChild(b);
  });
  function updateDots() {
    var c = current();
    Array.prototype.forEach.call(dots.children, function (d, i) {
      d.setAttribute("aria-current", String(i === c));
    });
    // Reproducir solo los videos visibles
    slides.forEach(function (s, i) {
      var v = s.querySelector("video");
      if (!v) return;
      if (i >= c && i < c + perView()) v.play().catch(function () {});
      else v.pause();
    });
  }
  track.addEventListener("scroll", function () {
    window.requestAnimationFrame(updateDots);
  });

  show.querySelector(".slide-prev").addEventListener("click", function () {
    step(-1); restart();
  });
  show.querySelector(".slide-next").addEventListener("click", function () {
    step(1); restart();
  });
  track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  });

  function stop() { clearInterval(timer); }
  function restart() {
    stop();
    if (!reduceMotion) timer = setInterval(function () { step(1); }, 4500);
  }
  show.addEventListener("mouseenter", stop);
  show.addEventListener("mouseleave", restart);
  show.addEventListener("focusin", stop);
  track.addEventListener("touchstart", stop, { passive: true });

  updateDots();
  restart();
})();
