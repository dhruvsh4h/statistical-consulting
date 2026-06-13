/* Renders the PROJECTS array (projects-data.js) into #projects-grid,
   plus small site behaviours (mobile nav, footer year). */

(function () {
  "use strict";

  // ---------- Projects ----------
  var STATUS_LABELS = {
    "planned": "Planned",
    "in-progress": "In progress",
    "completed": "Completed"
  };

  var STATUS_ORDER = { "in-progress": 0, "completed": 1, "planned": 2 };

  function renderProjects() {
    var grid = document.getElementById("projects-grid");
    var empty = document.getElementById("projects-empty");
    if (!grid) return;

    var projects = (typeof PROJECTS !== "undefined" && Array.isArray(PROJECTS))
      ? PROJECTS.slice()
      : [];

    if (projects.length === 0) {
      if (empty) empty.hidden = false;
      return;
    }

    projects.sort(function (a, b) {
      var dateA = a.date || "";
      var dateB = b.date || "";
      if (dateA !== dateB) return dateA < dateB ? 1 : -1; // newest first
      var ordA = STATUS_ORDER[a.status] !== undefined ? STATUS_ORDER[a.status] : 3;
      var ordB = STATUS_ORDER[b.status] !== undefined ? STATUS_ORDER[b.status] : 3;
      return ordA - ordB;
    });

    projects.forEach(function (p) {
      if (!p || !p.title) return;

      var card = document.createElement("article");
      card.className = "card project-card";

      var status = document.createElement("span");
      var statusKey = STATUS_LABELS[p.status] ? p.status : "planned";
      status.className = "project-status status-" + statusKey;
      status.textContent = STATUS_LABELS[statusKey];
      card.appendChild(status);

      var title = document.createElement("h3");
      title.textContent = p.title;
      card.appendChild(title);

      if (p.summary) {
        var summary = document.createElement("p");
        summary.className = "project-summary";
        summary.textContent = p.summary;
        card.appendChild(summary);
      }

      if (Array.isArray(p.tags) && p.tags.length > 0) {
        var tags = document.createElement("ul");
        tags.className = "tags";
        p.tags.forEach(function (t) {
          var li = document.createElement("li");
          li.textContent = t;
          tags.appendChild(li);
        });
        card.appendChild(tags);
      }

      // Only render links with an explicit http(s) scheme. This blocks
      // javascript:, data:, and other unsafe URLs that could slip in via an
      // auto-generated/AI-written project entry (defence-in-depth XSS guard).
      if (p.link && /^https?:\/\//i.test(p.link)) {
        var link = document.createElement("a");
        link.className = "project-link";
        link.href = p.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "View project →";
        card.appendChild(link);
      }

      grid.appendChild(card);
    });
  }

  // ---------- Mobile nav ----------
  function setupNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---------- Footer year ----------
  function setYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  // ---------- Hero "question -> method" rotator ----------
  function setupHeroDemo() {
    var host = document.querySelector(".hero-demo");
    var stage = document.querySelector(".hero-demo-stage");
    var dotsWrap = document.querySelector(".demo-dots");
    if (!host || !stage || !dotsWrap) return;

    var slides = Array.prototype.slice.call(stage.querySelectorAll(".demo-slide"));
    if (slides.length === 0) return;

    var idx = 0;
    var timer = null;
    var DELAY = 7200;

    var dots = slides.map(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Example " + (i + 1));
      b.addEventListener("click", function () { show(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });

    function show(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("is-active", i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
    }
    function next() { show(idx + 1); }
    function start() { if (!timer) timer = window.setInterval(next, DELAY); }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    show(0);
    start();

    host.addEventListener("mouseenter", stop);
    host.addEventListener("mouseleave", start);
    host.addEventListener("focusin", stop);
    host.addEventListener("focusout", start);
  }

  // ---------- Scroll reveal ----------
  function setupReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    var reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });

    els.forEach(function (el) { io.observe(el); });
  }

  renderProjects();
  setupNav();
  setYear();
  setupHeroDemo();
  setupReveal();
})();
