/* =========================================================
   CONFIGURACIÓN — edita solo esta parte
   Los botones con un valor vacío ("") se ocultan solos.
   ========================================================= */
const CONFIG = {
  email: "migoga2015@gmail.com",
  github: "https://github.com/AlejandroWebb",
  linkedin: "",       // ej: "https://www.linkedin.com/in/tu-perfil"
  whatsapp: "59177426379", // código de país (591) + número
  cv: "",             // ej: "assets/CV-Miguel-Blasquez.pdf"
  photo: "assets/foto.jpg",

  // Otros proyectos (además del Help Desk). Copia un bloque por proyecto.
  projects: [
    // {
    //   title: "Nombre del proyecto",
    //   description: "Qué problema resuelve y qué hiciste tú.",
    //   stack: ["Laravel", "PostgreSQL"],
    //   repo: "https://github.com/usuario/repo",
    //   demo: "",
    // },
  ],
};

/* ========================================================= */

document.documentElement.classList.remove("no-js");

// ---- Enlaces ----
const hrefFor = {
  email: (v) => `mailto:${v}`,
  whatsapp: (v) => `https://wa.me/${v.replace(/\D/g, "")}`,
};

document.querySelectorAll("[data-link]").forEach((el) => {
  const key = el.dataset.link;
  const value = CONFIG[key];
  if (!value) {
    el.classList.add("is-hidden");
    // Si un <li> queda vacío (redes), ocultarlo también
    if (el.parentElement.tagName === "LI") el.parentElement.classList.add("is-hidden");
    return;
  }
  el.href = hrefFor[key] ? hrefFor[key](value) : value;
});

document.querySelectorAll("[data-text]").forEach((el) => {
  el.textContent = CONFIG[el.dataset.text] || "";
});

// ---- Foto ----
if (CONFIG.photo) {
  const avatar = document.getElementById("avatar");
  const img = new Image();
  img.alt = "Foto de Miguel Blasquez";
  img.onload = () => {
    avatar.innerHTML = "";
    avatar.appendChild(img);
    avatar.classList.add("has-photo");
  };
  img.src = CONFIG.photo;
}

// ---- Otros proyectos ----
const grid = document.getElementById("projectsGrid");
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const folderIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';

const cards = CONFIG.projects.map((p) => {
  const links = [
    p.repo && `<a href="${esc(p.repo)}" target="_blank" rel="noopener">Código ↗</a>`,
    p.demo && `<a href="${esc(p.demo)}" target="_blank" rel="noopener">Demo ↗</a>`,
  ].filter(Boolean).join("");
  const stack = (p.stack || []).map((t) => `<li>${esc(t)}</li>`).join("");
  return `
    <article class="project reveal">
      <div class="project__top">${folderIcon}<div class="project__links">${links}</div></div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.description || "")}</p>
      ${stack ? `<ul class="stack-list">${stack}</ul>` : ""}
    </article>`;
});

if (CONFIG.github) {
  cards.push(`
    <a class="project project--cta reveal" href="${esc(CONFIG.github)}" target="_blank" rel="noopener">
      <h3>Más en GitHub</h3>
      <p>Explora el resto de mis repositorios, prácticas y experimentos.</p>
      <span class="arrow">Ver perfil →</span>
    </a>`);
}
grid.innerHTML = cards.join("");
if (!cards.length) grid.remove();

// ---- Navegación ----
const nav = document.getElementById("nav");
const toggle = document.getElementById("navToggle");
const menu = document.getElementById("navMenu");

const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const setMenu = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  menu.classList.toggle("is-open", open);
  nav.classList.toggle("menu-open", open);
};
toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

// Resaltar sección activa
const links = [...menu.querySelectorAll('a[href^="#"]')];
const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => spy.observe(s));

// ---- Animaciones al hacer scroll ----
const revealer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revealer.observe(el));

// ---- Año ----
document.getElementById("year").textContent = new Date().getFullYear();
