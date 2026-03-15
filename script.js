/**
 * script.js
 * Nadiia Chernygina — Portfolio Scripts
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

/* Close menu when a nav link is clicked */
navLinks.forEach((link) => {
  link.addEventListener("click", () => toggleMenu(true));
});

/* Close menu on outside click */
document.addEventListener("click", (e) => {
  if (
    navMenu.classList.contains("is-open") &&
    !navMenu.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    toggleMenu(true);
  }
});

/* Close menu on Escape */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
    toggleMenu(true);
    navToggle.focus();
  }
});

/* ── ACTIVE NAV LINK (INTERSECTION) ────────────*/
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
        // Stagger siblings within the same parent
        const siblings = entry.target.parentElement.querySelectorAll(
          ".reveal:not(.is-visible)",
        );
        siblings.forEach((el, idx) => {
          // Only stagger if this element is among those in view
          if (el === entry.target) {
            entry.target.style.transitionDelay = `${i * 0.06}s`;
          }
        });
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  },
);

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el);
});

/* ── STAGGERED REVEAL FOR GRIDS ─────────────── */
/**
 * Cards inside grids get an incremental delay so they
 * cascade nicely instead of all popping in at once.
 */
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

document.querySelectorAll(".skills__grid, .projects__grid").forEach((grid) => {
  staggerObserver.observe(grid);
});

/* ── SMOOTH SCROLL POLYFILL (for older Safari) ── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 72; // header height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});
