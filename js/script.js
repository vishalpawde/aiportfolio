(function () {
  "use strict";

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");

  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      burger.classList.toggle("is-open", isOpen);
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- live editor-style timecode (HH:MM:SS:FF @ 24fps) ---------- */
  var timecodeEl = document.getElementById("timecode");
  var FPS = 24;
  var startedAt = performance.now();

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tickTimecode() {
    if (timecodeEl) {
      var elapsedMs = performance.now() - startedAt;
      var totalFrames = Math.floor((elapsedMs / 1000) * FPS);
      var frames = totalFrames % FPS;
      var totalSeconds = Math.floor(totalFrames / FPS);
      var seconds = totalSeconds % 60;
      var totalMinutes = Math.floor(totalSeconds / 60);
      var minutes = totalMinutes % 60;
      var hours = Math.floor(totalMinutes / 60);

      timecodeEl.textContent =
        pad(hours) + ":" + pad(minutes) + ":" + pad(seconds) + ":" + pad(frames);
    }
    requestAnimationFrame(tickTimecode);
  }
  requestAnimationFrame(tickTimecode);

  /* ---------- nav background intensifies on scroll ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 24) {
      nav.style.boxShadow = "0 10px 30px -20px rgba(0,0,0,.8)";
    } else {
      nav.style.boxShadow = "none";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    ".section__head, .card--video, .service, .about__visual, .about__copy, .contact__panel, .hero__copy, .hero__visual"
  );
  revealTargets.forEach(function (el) {
    el.setAttribute("data-reveal", "");
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- pause off-screen videos to save resources ---------- */
  var lazyVideos = document.querySelectorAll("video");
  if ("IntersectionObserver" in window && lazyVideos.length) {
    var videoObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var vid = entry.target;
          if (entry.isIntersecting) {
            vid.play().catch(function () {});
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    lazyVideos.forEach(function (vid) {
      videoObserver.observe(vid);
    });
  }

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
