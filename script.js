const yearSpan = document.getElementById("year");
const typing = document.getElementById("typing");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const roles = [
  "MERN Stack Developer",
  "Responsive UI Builder",
  "Computer Engineering Student",
  "Problem Solver"
];

let roleIndex = 0;
let letterIndex = 0;
let isDeleting = false;

function typeEffect() {
  if (!typing) return;

  const currentRole = roles[roleIndex];
  typing.textContent = isDeleting
    ? currentRole.substring(0, letterIndex--)
    : currentRole.substring(0, letterIndex++);

  if (!isDeleting && letterIndex === currentRole.length + 1) {
    isDeleting = true;
    setTimeout(typeEffect, 1400);
    return;
  }

  if (isDeleting && letterIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeEffect, 320);
    return;
  }

  setTimeout(typeEffect, isDeleting ? 42 : 82);
}

typeEffect();

function updateNavbarState() {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 20);
}

function setActiveNavLink() {
  let activeId = "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    if (window.scrollY >= sectionTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -60px 0px"
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

window.addEventListener("scroll", () => {
  updateNavbarState();
  setActiveNavLink();
});

updateNavbarState();
setActiveNavLink();

// ---------- MOBILE NAV DRAWER (added) ----------
// Same behavior as the sister portfolio site: hamburger toggle, slide-in
// drawer, click-outside-to-close overlay, Escape to close, focus trap
// while open, focus restored to the toggle button on close, body scroll
// locked while the drawer is open. This does not touch typeEffect(),
// the reveal animation, or the scroll-based active-link logic above -
// all of that stays exactly as it was.

const navToggleBtn = document.getElementById("nav-toggle");
const navCloseBtn = document.getElementById("nav-close");
const navDrawer = document.getElementById("nav-links");
const navBackdrop = document.getElementById("nav-backdrop");

let isNavOpen = false;
let lastFocusedEl = null; // remembers what to restore focus to on close

function getDrawerFocusables() {
  return navDrawer ? Array.from(navDrawer.querySelectorAll("button, a")) : [];
}

function openMobileNav() {
  if (!navToggleBtn || !navCloseBtn || !navDrawer || !navBackdrop || isNavOpen) return;
  isNavOpen = true;

  lastFocusedEl = document.activeElement;

  navToggleBtn.setAttribute("aria-expanded", "true");
  navToggleBtn.setAttribute("aria-label", "Close menu");

  navDrawer.classList.add("open");
  navBackdrop.classList.add("open");

  document.body.style.overflow = "hidden";
  document.body.classList.add("nav-open");

  const focusables = getDrawerFocusables();
  if (focusables.length) {
    requestAnimationFrame(() => navCloseBtn.focus());
  }

  document.addEventListener("keydown", handleNavKeydown);
}

function closeMobileNav() {
  if (!navToggleBtn || !navCloseBtn || !navDrawer || !navBackdrop || !isNavOpen) return;
  isNavOpen = false;

  navToggleBtn.setAttribute("aria-expanded", "false");
  navToggleBtn.setAttribute("aria-label", "Open menu");

  navDrawer.classList.remove("open");
  navBackdrop.classList.remove("open");

  document.body.style.overflow = "auto";
  document.body.classList.remove("nav-open");

  document.removeEventListener("keydown", handleNavKeydown);

  (lastFocusedEl || navToggleBtn).focus();
  lastFocusedEl = null;
}

function handleNavKeydown(e) {
  if (e.key === "Escape") {
    closeMobileNav();
    return;
  }

  if (e.key === "Tab") {
    const focusables = getDrawerFocusables();
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

if (navToggleBtn) {
  navToggleBtn.addEventListener("click", () => {
    if (isNavOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });
}

if (navCloseBtn) {
  navCloseBtn.addEventListener("click", closeMobileNav);
}

if (navBackdrop) {
  navBackdrop.addEventListener("click", closeMobileNav);
}

// Every link inside the drawer closes it on click (works for the section
// links and the duplicated Resume link).
if (navDrawer) {
  navDrawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });
}
