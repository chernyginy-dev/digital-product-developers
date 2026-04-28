/**
 * script.js
 * Twin Site Creator — Nadiia & Vira Chernyginy
 * Plain vanilla JS — no dependencies
 */

"use strict";

/* ── DOM REFS ───────────────────────────────── */
const header = document.getElementById("site-header");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav__link");
const yearEl = document.getElementById("year");

/* ── FOOTER YEAR ────────────────────────────── */
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ── STICKY HEADER ──────────────────────────── */
function handleScroll() {
  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
  updateActiveLink();
}

window.addEventListener("scroll", handleScroll, { passive: true });

/* ── MOBILE NAV TOGGLE ──────────────────────── */
function toggleMenu(forceClose = false) {
  const isOpen = navMenu.classList.contains("is-open");

  if (forceClose || isOpen) {
    navMenu.classList.remove("is-open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  } else {
    navMenu.classList.add("is-open");
    navToggle.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
}

navToggle.addEventListener("click", () => toggleMenu());

navLinks.forEach((link) => {
  link.addEventListener("click", () => toggleMenu(true));
});

document.addEventListener("click", (e) => {
  if (
    navMenu.classList.contains("is-open") &&
    !navMenu.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    toggleMenu(true);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
    toggleMenu(true);
    navToggle.focus();
  }
});

/* ── ACTIVE NAV LINK ────────────────────────── */
const sections = document.querySelectorAll("section[id]");

function updateActiveLink() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

/* ── SCROLL REVEAL ──────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement.querySelectorAll(
          ".reveal:not(.is-visible)",
        );
        siblings.forEach((el) => {
          if (el === entry.target) {
            entry.target.style.transitionDelay = `${i * 0.06}s`;
          }
        });
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el);
});

/* ── STAGGERED REVEAL FOR GRIDS ─────────────── */
const staggerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const grid = entry.target;
        const cards = grid.querySelectorAll(".reveal");
        cards.forEach((card, i) => {
          card.style.transitionDelay = `${i * 0.1}s`;
        });
        staggerObserver.unobserve(grid);
      }
    });
  },
  { threshold: 0.05 },
);

document.querySelectorAll(".projects__grid").forEach((grid) => {
  staggerObserver.observe(grid);
});

/* ── SMOOTH SCROLL (older Safari polyfill) ──── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ── VIDEO AUTOPLAY FALLBACK (Chrome policy guard) ── */
const heroVideo = document.querySelector(".hero__video");
if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.setAttribute("playsinline", "");
  heroVideo.play().catch(() => {
    // Autoplay blocked — poster image already showing, nothing to do
  });
}

/* ─── Back To Top ─── */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        btn.classList.toggle("visible", window.scrollY > 500);
        ticking = false;
      });
      ticking = true;
    },
    { passive: true },
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.querySelectorAll(".faq__question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;

    item.classList.toggle("active");

    const answer = item.querySelector(".faq__answer");

    if (item.classList.contains("active")) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = null;
    }
  });
});

/* ─── Init All ─── */
document.addEventListener("DOMContentLoaded", () => {
  initBackToTop();
});

const cookie = document.getElementById("cookie");
const accept = document.getElementById("cookieAccept");
const decline = document.getElementById("cookieDecline");

const consent = localStorage.getItem("cookieConsent");

// показ банера
if (!consent) {
  setTimeout(() => {
    cookie.classList.add("active");
  }, 800);
}

// якщо вже accept — одразу запускаємо GA
if (consent === "accepted") {
  loadAnalytics();
}

// accept
accept.addEventListener("click", () => {
  localStorage.setItem("cookieConsent", "accepted");
  cookie.classList.remove("active");
  loadAnalytics();
});

// decline
decline.addEventListener("click", () => {
  localStorage.setItem("cookieConsent", "declined");
  cookie.classList.remove("active");
});

function loadAnalytics() {
  if (window.gaLoaded) return;
  window.gaLoaded = true;

  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-CQWCQ5EF1Y";
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-CQWCQ5EF1Y");
}

const skillsSection = document.querySelector(".skills");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        skillsSection.classList.add("is-visible");
      } else {
        skillsSection.classList.remove("is-visible"); // 🔥 ключ до повтору
      }
    });
  },
  {
    threshold: 0.25,
  },
);

observer.observe(skillsSection);
