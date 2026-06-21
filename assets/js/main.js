const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link, .nav-cta");
const form = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    image.style.display = "none";
    image.closest(".image-frame, .service-thumb, .blog-thumb, .project-image")?.classList.add("image-missing");
  });
});

const closeMenu = () => {
  if (!menuToggle || !navMenu) return;
  document.body.classList.remove("menu-open");
  navMenu.classList.remove("show");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
};

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("show");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const currentPath = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-link, .nav-cta").forEach((link) => {
  const linkPath = link.getAttribute("href");
  const isCurrent = linkPath === currentPath;
  link.classList.toggle("active", isCurrent);
  if (isCurrent) {
    link.setAttribute("aria-current", "page");
  } else {
    link.removeAttribute("aria-current");
  }
});

const counters = document.querySelectorAll(".count-number");

const runCounter = (counter) => {
  if (counter.dataset.counted === "true") return;
  counter.dataset.counted = "true";

  const target = Number(counter.dataset.target);
  const suffix = counter.dataset.suffix || "";
  const duration = 1600;
  const getTime = () =>
    window.performance && typeof window.performance.now === "function" ? window.performance.now() : Date.now();
  const animate = window.requestAnimationFrame || ((callback) => setTimeout(() => callback(getTime()), 16));
  const startTime = getTime();

  const update = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(easedProgress * target);

    counter.textContent = `${value}${suffix}`;

    if (progress < 1) {
      animate(update);
    } else {
      counter.textContent = `${target}${suffix}`;
    }
  };

  animate(update);
};

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach(runCounter);
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

if (form && formNote) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.textContent = "Thank you. Your message is ready to be sent.";
    form.reset();
  });
}

const portfolioTagSets = {
  "Website Design Project": ["UI/UX", "Web Design", "Branding"],
  "Branding Project": ["UI/UX", "Web Design", "Branding"],
  "Digital Marketing Campaign": ["Marketing", "Social Media", "Strategy"],
  "Mobile App UI": ["UI/UX", "Mobile App", "App Design"],
  "SEO Growth Project": ["SEO", "Analytics", "Growth"],
  "Social Media Campaign": ["Social Media", "Content", "Campaign"],
};

const getPortfolioTags = (card) => {
  const title = card.querySelector("h3")?.textContent.trim();
  const category = card.querySelector(".portfolio-card-category")?.textContent.trim().toLowerCase() || "";

  if (title && portfolioTagSets[title]) return portfolioTagSets[title];
  if (category.includes("marketing")) return portfolioTagSets["Digital Marketing Campaign"];
  if (category.includes("app")) return portfolioTagSets["Mobile App UI"];
  if (category.includes("seo")) return portfolioTagSets["SEO Growth Project"];
  if (category.includes("social")) return portfolioTagSets["Social Media Campaign"];
  return portfolioTagSets["Website Design Project"];
};

document
  .querySelectorAll(
    ".portfolio-card, .portfolio-item, .project-card, .portfolio-project, .portfolio-featured-card, .portfolio-modern-card"
  )
  .forEach((card) => {
    const content =
      card.querySelector(".portfolio-card-content") ||
      card.querySelector(".portfolio-modern-content") ||
      card.querySelector(".portfolio-featured-content") ||
      card.querySelector(".portfolio-info") ||
      card;

    content
      .querySelectorAll(".project-arrow, .portfolio-arrow, .card-arrow, .arrow-circle")
      .forEach((arrow) => {
        arrow.hidden = true;
      });

    content.querySelectorAll("a").forEach((link) => {
      const text = link.textContent.trim();
      if (!link.classList.contains("portfolio-view-btn") && (text === "→" || text === "↗")) {
        link.hidden = true;
      }
    });

    if (!content.querySelector(".portfolio-tags")) {
      const tags = document.createElement("div");
      tags.className = "portfolio-tags";
      getPortfolioTags(card).forEach((tagText) => {
        const tag = document.createElement("span");
        tag.textContent = tagText;
        tags.appendChild(tag);
      });

      const description = content.querySelector("p");
      if (description) {
        description.insertAdjacentElement("afterend", tags);
      } else {
        content.appendChild(tags);
      }
    }

    if (!content.querySelector(".portfolio-view-btn")) {
      const button = document.createElement("a");
      button.href = "portfolio.html";
      button.className = "portfolio-view-btn";
      button.innerHTML = "View Project <span>→</span>";
      content.appendChild(button);
    }
  });

window.addEventListener("load", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
