/* ============================================================
   Eqnity — portfolio interactions
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     Intro loader — then hand over to the page
     ---------------------------------------------------------- */
  function runIntro() {
    const intro = $("#intro");
    document.body.classList.add("no-scroll");

    const hide = () => {
      intro.classList.add("done");
      document.body.classList.remove("no-scroll");
      // remove from DOM after the wipe transition
      setTimeout(() => intro.remove(), 1000);
    };

    if (reducedMotion) {
      intro.style.display = "none";
      document.body.classList.remove("no-scroll");
      return;
    }

    // letters fill in by ~1.65s, so wipe shortly after
    setTimeout(hide, 1850);
  }

  /* ----------------------------------------------------------
     Typed rotating roles
     ---------------------------------------------------------- */
  function initTyped() {
    const el = $("#typed");
    const phrases = [
      "websites",
      "Discord bots",
      "Minecraft clients",
      "Minecraft mods",
      "whatever seems fun",
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const phrase = phrases[phraseIndex];
      charIndex += deleting ? -1 : 1;
      el.textContent = phrase.slice(0, charIndex);

      let delay = deleting ? 40 : 85;

      if (!deleting && charIndex === phrase.length) {
        delay = 1800; // hold the full word
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 350;
      }

      setTimeout(tick, delay);
    }

    setTimeout(tick, 2100); // wait for the intro
  }

  /* ----------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reducedMotion) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ----------------------------------------------------------
     Card cursor spotlight (pointer tracking per card)
     ---------------------------------------------------------- */
  function initCardGlow() {
    const cards = document.querySelectorAll(".card, .contact-card");
    cards.forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    });
  }

  /* ----------------------------------------------------------
     Page-wide cursor spotlight
     ---------------------------------------------------------- */
  function initSpotlight() {
    const spot = $("#spotlight");
    if (!spot) return;
    if (window.matchMedia("(pointer: coarse)").matches) {
      spot.remove();
      return;
    }
    window.addEventListener("pointermove", (e) => {
      spot.style.setProperty("--mx", `${e.clientX}px`);
      spot.style.setProperty("--my", `${e.clientY}px`);
    });
  }

  /* ----------------------------------------------------------
     Toast
     ---------------------------------------------------------- */
  let toastTimer = null;

  function showToast(message) {
    const toast = $("#toast");
    toast.innerHTML = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  /* ----------------------------------------------------------
     Copy text (clipboard with fallback)
     ---------------------------------------------------------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        ta.remove();
      }
    });
  }

  /* ----------------------------------------------------------
     Discord — copy @eqnity
     ---------------------------------------------------------- */
  function initDiscord() {
    const handle = "eqnity";
    const action = () => {
      copyText(handle)
        .then(() =>
          showToast("Copied <span class=\"toast-accent\">@eqnity</span> — add me on Discord!")
        )
        .catch(() => showToast("My Discord: <span class=\"toast-accent\">@eqnity</span>"));
    };

    $("#discordBtn").addEventListener("click", action);
    $("#footerDiscord").addEventListener("click", action);
  }

  /* ----------------------------------------------------------
     Footer year
     ---------------------------------------------------------- */
  function initYear() {
    $("#year").textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------
     Boot
     ---------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initYear();
    runIntro();
    initTyped();
    initReveal();
    initCardGlow();
    initSpotlight();
    initDiscord();
  });
})();
