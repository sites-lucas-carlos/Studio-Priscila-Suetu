// Studio Priscila Suetu: progressive enhancements. Every link and section works without this file.

const WHATSAPP_NUMBER = "5561999919205";
const DEFAULT_MESSAGE = "Olá! Vim pelo site e gostaria de agendar um horário.";

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// WhatsApp links open with a ready message, so the reception knows which service the visitor wants.
document.querySelectorAll("[data-wa]").forEach((link) => {
  const text = link.dataset.wa || DEFAULT_MESSAGE;
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
});

// Mobile menu
const menuButton = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");

function setMenu(open) {
  root.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  menuButton.querySelector(".menu-label").textContent = open ? "Fechar" : "Menu";
  menu.inert = !open;
  if (open) menu.querySelector("a").focus({ preventScroll: true });
}

menuButton.addEventListener("click", () => setMenu(!root.classList.contains("menu-open")));
menu.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && root.classList.contains("menu-open")) {
    setMenu(false);
    menuButton.focus();
  }
});
window.matchMedia("(min-width: 960px)").addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});

// Header gains depth once the page leaves the very top.
const header = document.querySelector(".site-header");
const heroActions = document.querySelector(".hero-actions");

new IntersectionObserver(([entry]) => {
  header.classList.toggle("is-scrolled", !entry.isIntersecting);
}).observe(document.querySelector(".top-sentinel"));

// Phone booking bar: shown once the hero buttons scroll away, hidden near the booking panel and footer.
const stickyBar = document.querySelector(".sticky-cta");
const stickyLinks = stickyBar.querySelectorAll("a");
const blockers = new Map();

const stickyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => blockers.set(entry.target, entry.isIntersecting));
  const heroPassed = heroActions.getBoundingClientRect().bottom < 0;
  const blocked = [...blockers.values()].some(Boolean);
  const visible = heroPassed && !blocked;
  stickyBar.classList.toggle("is-visible", visible);
  stickyBar.setAttribute("aria-hidden", String(!visible));
  stickyLinks.forEach((link) => (visible ? link.removeAttribute("tabindex") : link.setAttribute("tabindex", "-1")));
});
[heroActions, document.querySelector(".cta-panel"), document.querySelector(".site-footer")].forEach((el) => stickyObserver.observe(el));

// Scroll reveal
const revealTargets = document.querySelectorAll("[data-reveal]");
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  revealTargets.forEach((el) => revealObserver.observe(el));
}

// Team filter
const filterButtons = document.querySelectorAll("[data-filter]");
const members = document.querySelectorAll(".member");
const teamStatus = document.querySelector("[data-team-status]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.dataset.filter;
    filterButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));

    let shown = 0;
    members.forEach((member) => {
      const match = group === "todas" || member.dataset.group === group;
      member.hidden = !match;
      member.classList.remove("is-entering");
      if (match && !reduceMotion) {
        member.style.setProperty("--i", shown);
        void member.offsetWidth; // restart the entrance animation
        member.classList.add("is-entering");
      }
      if (match) shown += 1;
    });

    const label = button.firstChild.textContent.trim().toLowerCase();
    teamStatus.textContent = group === "todas"
      ? `Mostrando toda a equipe, ${shown} pessoas.`
      : `Mostrando ${shown} ${shown === 1 ? "pessoa" : "pessoas"} de ${label}.`;
  });
});

// Open-now status, computed in Brasília time: Tuesday to Saturday, 7h30 to 18h30.
const OPEN_DAYS = [2, 3, 4, 5, 6];
const OPENS = 7 * 60 + 30;
const CLOSES = 18 * 60 + 30;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const clock = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Sao_Paulo",
  weekday: "short",
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h23",
});

function studioStatus(now = new Date()) {
  const parts = Object.fromEntries(clock.formatToParts(now).map((p) => [p.type, p.value]));
  const day = WEEKDAYS.indexOf(parts.weekday);
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  const openToday = OPEN_DAYS.includes(day);

  if (openToday && minutes >= OPENS && minutes < CLOSES) return { open: true, text: "Aberto agora, até 18h30" };
  if (openToday && minutes < OPENS) return { open: false, text: "Fechado agora, abre hoje às 7h30" };
  const openTomorrow = OPEN_DAYS.includes((day + 1) % 7);
  return { open: false, text: openTomorrow ? "Fechado agora, abre amanhã às 7h30" : "Fechado agora, abre terça às 7h30" };
}

function renderStatus() {
  const { open, text } = studioStatus();
  document.querySelectorAll("[data-status]").forEach((el) => {
    el.textContent = text;
    el.dataset.open = String(open);
  });
}
renderStatus();
setInterval(renderStatus, 60_000);

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});
