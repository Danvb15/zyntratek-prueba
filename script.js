const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const yearNode = document.getElementById("current-year");

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }
    if (nav.classList.contains("is-open") && !nav.contains(target) && !navToggle.contains(target)) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.focus();
    }
  });
}

const revealNodes = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
} else {
  revealNodes.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 50, 260)}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

const trackedLinks = [...document.querySelectorAll('.site-nav a[href^="#"]:not(.btn)')];
const trackedSections = trackedLinks
  .map((link) => {
    const href = link.getAttribute("href");
    if (!href) {
      return null;
    }
    const section = document.querySelector(href);
    if (!section) {
      return null;
    }
    return { link, section };
  })
  .filter(Boolean);

if (trackedSections.length > 0 && "IntersectionObserver" in window) {
  const setActive = (activeLink) => {
    trackedSections.forEach(({ link }) => {
      link.classList.toggle("is-active", link === activeLink);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length === 0) {
        return;
      }

      const activeSection = visible[0].target;
      const match = trackedSections.find(({ section }) => section === activeSection);
      if (match) {
        setActive(match.link);
      }
    },
    {
      rootMargin: "-40% 0px -45% 0px",
      threshold: [0.2, 0.35, 0.5, 0.65],
    }
  );

  trackedSections.forEach(({ section }) => sectionObserver.observe(section));
}
