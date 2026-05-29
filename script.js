const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(".project-card");
const countTargets = document.querySelectorAll("[data-count]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.classList.toggle("is-open");
  navMenu?.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle?.classList.remove("is-open");
    navMenu?.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));

    projectCards.forEach((card) => {
      const categories = card.dataset.category?.split(" ") ?? [];
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document
  .querySelectorAll(".project-card, .skill-group, .timeline-item, .cert-panel, .contact-link")
  .forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const target = entry.target;
      const finalValue = Number(target.dataset.count);
      const suffix = target.dataset.suffix ?? "";
      let currentValue = 0;
      const increment = Math.max(1, Math.ceil(finalValue / 26));

      const tick = () => {
        currentValue = Math.min(finalValue, currentValue + increment);
        target.textContent = currentValue === finalValue ? `${finalValue}${suffix}` : String(currentValue);

        if (currentValue < finalValue) {
          window.requestAnimationFrame(tick);
        }
      };

      tick();
      countObserver.unobserve(target);
    });
  },
  { threshold: 0.8 }
);

countTargets.forEach((target) => countObserver.observe(target));

const sections = [...document.querySelectorAll("main section[id]")];
const activeLinkById = new Map([...navLinks].map((link) => [link.getAttribute("href")?.slice(1), link]));

const activeNavObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const activeLink = activeLinkById.get(entry.target.id);
      navLinks.forEach((link) => link.classList.toggle("is-active", link === activeLink));
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0.01
  }
);

sections.forEach((section) => activeNavObserver.observe(section));
