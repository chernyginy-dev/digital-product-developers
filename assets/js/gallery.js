/**
 * gallery.js
 * Twin Site Creator — Animated Portfolio Gallery
 * Bidirectional scroll-driven stagger + 3D tilt + video hover-play
 * No dependencies — vanilla JS only
 */

"use strict";

(function initGallery() {
  /* ── DOM ── */
  const galleryEl = document.getElementById("gallery");
  if (!galleryEl) return; // section not on this page

  const cards = Array.from(galleryEl.querySelectorAll(".gallery-card"));
  const hdrEl = document.getElementById("portfolioHeader");
  const introEl = document.getElementById("portfolioIntro");
  const footerEl = document.getElementById("portfolioFooter");

  /* ── Easing strings ── */
  const EI = "cubic-bezier(0.16, 1, 0.3, 1)"; // ease-in (enter)
  const EO = "cubic-bezier(0.4, 0, 0.6, 1)"; // ease-out (exit)

  /* ── Scatter positions — each card hides to a unique off-position ── */
  const scatter = [
    { x: -70, y: -50, r: -7, s: 0.88 },
    { x: 70, y: -70, r: 5, s: 0.88 },
    { x: -90, y: 50, r: -4, s: 0.9 },
    { x: 35, y: 70, r: 6, s: 0.9 },
    { x: 90, y: 35, r: -5, s: 0.9 },
    { x: -50, y: 90, r: 4, s: 0.92 },
    { x: 50, y: 110, r: -3, s: 0.92 },
  ];

  /* ── Set initial hidden state (no flash on load) ── */
  cards.forEach((card, i) => {
    const { x, y, r, s } = scatter[i] || { x: 0, y: 50, r: 0, s: 0.9 };
    card.style.transition = "none";
    card.style.opacity = "0";
    card.style.transform = `translate(${x}px,${y}px) rotate(${r}deg) scale(${s})`;
    card.classList.remove("is-assembled");
  });

  [hdrEl, introEl, footerEl].forEach((el) => {
    if (!el) return;
    el.style.transition = "none";
    el.style.opacity = "0";
  });
  if (hdrEl) hdrEl.style.transform = "translateY(-20px)";
  if (introEl) introEl.style.transform = "translateY(16px)";
  if (footerEl) footerEl.style.transform = "translateY(16px)";

  /* ── State tracking ── */
  const cardState = new Array(cards.length).fill(false);
  let hdrVis = false,
    introVis = false,
    footerVis = false;

  /* ══════════════════════════════════════════
     ANIMATE IN / OUT helpers
  ══════════════════════════════════════════ */
  function revealCard(card, i, staggerIdx) {
    const delay = staggerIdx * 90; // 90ms between each card
    requestAnimationFrame(() => {
      card.style.transition = `opacity 680ms ${delay}ms ${EI}, transform 750ms ${delay}ms ${EI}`;
      card.style.opacity = "1";
      card.style.transform = "translate(0,0) rotate(0deg) scale(1)";

      // After animation settles: unlock hover interactions
      setTimeout(() => {
        card.classList.add("is-assembled");
        card.style.transform = "";
        card.style.transition = `transform 300ms ${EI}, box-shadow 300ms ${EO}`;
      }, delay + 780);
    });
  }

  function hideCard(card, i) {
    const { x, y, r, s } = scatter[i] || { x: 0, y: 50, r: 0, s: 0.9 };
    card.classList.remove("is-assembled");
    requestAnimationFrame(() => {
      card.style.transition = `opacity 450ms ${EO}, transform 500ms ${EO}`;
      card.style.opacity = "0";
      card.style.transform = `translate(${x}px,${y}px) rotate(${r}deg) scale(${s})`;
    });
  }

  function fadeIn(el, ty, delay) {
    if (!el) return;
    const d = delay ? `${delay}ms` : "0ms";
    el.style.transition = `opacity 700ms ${d} ${EI}, transform 700ms ${d} ${EI}`;
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  }

  function fadeOut(el, ty) {
    if (!el) return;
    el.style.transition = `opacity 400ms ${EO}, transform 400ms ${EO}`;
    el.style.opacity = "0";
    el.style.transform = `translateY(${ty}px)`;
  }

  /* ══════════════════════════════════════════
     SCROLL CHECK — rAF throttled
  ══════════════════════════════════════════ */
  let rafPending = false;

  function onScroll() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      checkVisibility();
    });
  }

  function checkVisibility() {
    const vh = window.innerHeight;

    /* Header */
    if (hdrEl) {
      const r = hdrEl.getBoundingClientRect();
      const inV = r.bottom > 80 && r.top < vh * 0.92;
      if (inV && !hdrVis) {
        hdrVis = true;
        requestAnimationFrame(() => fadeIn(hdrEl, -20, 0));
      } else if (!inV && hdrVis) {
        hdrVis = false;
        requestAnimationFrame(() => fadeOut(hdrEl, -20));
      }
    }

    /* Intro */
    if (introEl) {
      const r = introEl.getBoundingClientRect();
      const inV = r.bottom > 80 && r.top < vh * 0.92;
      if (inV && !introVis) {
        introVis = true;
        requestAnimationFrame(() => fadeIn(introEl, 16, 80));
      } else if (!inV && introVis) {
        introVis = false;
        requestAnimationFrame(() => fadeOut(introEl, 16));
      }
    }

    /* Cards — bidirectional stagger */
    let staggerIdx = 0;
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const inV = r.bottom > vh * 0.12 && r.top < vh * 0.92;

      if (inV && !cardState[i]) {
        cardState[i] = true;
        revealCard(card, i, staggerIdx);
        staggerIdx++;
      } else if (!inV && cardState[i]) {
        cardState[i] = false;
        hideCard(card, i);
      }
    });

    /* Footer */
    if (footerEl) {
      const r = footerEl.getBoundingClientRect();
      const inV = r.bottom > 80 && r.top < vh * 0.95;
      if (inV && !footerVis) {
        footerVis = true;
        requestAnimationFrame(() => fadeIn(footerEl, 16, 200));
      } else if (!inV && footerVis) {
        footerVis = false;
        requestAnimationFrame(() => fadeOut(footerEl, 16));
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  // Initial check after a brief delay so CSS transitions register
  setTimeout(checkVisibility, 80);

  /* ══════════════════════════════════════════
     MAGNETIC 3D TILT on hover
  ══════════════════════════════════════════ */
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (!card.classList.contains("is-assembled")) return;
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
      card.style.transition = `transform 120ms linear, box-shadow 200ms ${EO}`;
      card.style.transform = `scale(1.03) translateY(-6px) perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 4}deg)`;
      card.style.boxShadow =
        "0 16px 48px rgba(0,0,0,0.14), 0 40px 80px rgba(0,0,0,0.10)";
    });

    card.addEventListener("mouseleave", () => {
      if (!card.classList.contains("is-assembled")) return;
      card.style.transition = `transform 400ms ${EI}, box-shadow 300ms ${EO}`;
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  });

  /* ══════════════════════════════════════════
     VIDEO HOVER-PLAY
     Lazy-loads src on first hover, plays on
     mouseenter, pauses on mouseleave.
  ══════════════════════════════════════════ */
  cards.forEach((card) => {
    const video = card.querySelector(".card-video");
    if (!video) return;

    let loaded = false;
    let playTimer = null;

    function loadVideo() {
      if (loaded) return;
      loaded = true;
      const src = video.dataset.src;
      if (src) {
        video.src = src;
        video.load();
      }
    }

    card.addEventListener("mouseenter", () => {
      loadVideo();
      playTimer = setTimeout(() => {
        video.currentTime = 0;
        video
          .play()
          .then(() => card.classList.add("is-playing"))
          .catch(() => {});
      }, 80);
    });

    card.addEventListener("mouseleave", () => {
      clearTimeout(playTimer);
      video.pause();
      card.classList.remove("is-playing");
    });
  });
})();
