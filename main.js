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

  // ---------- "Find your test" interactive ----------
  // Small decision tree. Deliberately honest: the result is a starting
  // point, and the caveat says assumptions still need checking.
  var TF_TREE = {
    start: {
      question: "What do you want to find out?",
      options: [
        { label: "Did something change after a program or treatment?", next: "pairedType" },
        { label: "Are separate groups different from each other?", next: "groupCount" },
        { label: "Does my questionnaire measure what it should?", result: "psych" },
        { label: "What predicts an outcome?", next: "predictType" }
      ]
    },
    pairedType: {
      question: "What kind of outcome are you measuring?",
      options: [
        { label: "Rating scales or ranked answers (e.g. Likert)", result: "wilcoxon" },
        { label: "Measured numbers (scores, times, amounts)", result: "pairedT" }
      ]
    },
    groupCount: {
      question: "How many groups are you comparing?",
      options: [
        { label: "Two", next: "groupType2" },
        { label: "Three or more", next: "groupType3" }
      ]
    },
    groupType2: {
      question: "What kind of outcome are you measuring?",
      options: [
        { label: "Rating scales or ranked answers (e.g. Likert)", result: "mannwhitney" },
        { label: "Measured numbers (scores, times, amounts)", result: "ttest" }
      ]
    },
    groupType3: {
      question: "What kind of outcome are you measuring?",
      options: [
        { label: "Rating scales or ranked answers (e.g. Likert)", result: "kruskal" },
        { label: "Measured numbers (scores, times, amounts)", result: "anova" }
      ]
    },
    predictType: {
      question: "What kind of outcome are you predicting?",
      options: [
        { label: "A yes/no outcome (pass/fail, respond/not)", result: "logistic" },
        { label: "A number (score, amount, time)", result: "linear" }
      ]
    }
  };

  var TF_RESULTS = {
    wilcoxon: {
      name: "Wilcoxon signed-rank test",
      why: "Built for before/after data from the same people when the outcome is ordinal or not bell-shaped. Report an effect size alongside the p-value."
    },
    pairedT: {
      name: "Paired t-test",
      why: "Compares the same people before and after on a measured, roughly normal outcome. If normality fails, the Wilcoxon signed-rank is the backup."
    },
    mannwhitney: {
      name: "Mann–Whitney U test",
      why: "Compares two separate groups when the outcome is ordinal or not normally distributed."
    },
    ttest: {
      name: "Independent-samples t-test",
      why: "Compares two separate groups on a measured, roughly normal outcome. Welch's version is the safer default."
    },
    kruskal: {
      name: "Kruskal–Wallis test",
      why: "Compares three or more groups on an ordinal or non-normal outcome, with pairwise follow-ups to see where the differences are."
    },
    anova: {
      name: "One-way ANOVA",
      why: "Compares three or more groups on a measured outcome, with post-hoc tests to see which groups differ."
    },
    psych: {
      name: "Reliability & factor analysis",
      why: "Cronbach's alpha or omega for internal consistency, plus factor analysis or an SEM measurement model to check the scale's structure."
    },
    logistic: {
      name: "Logistic regression",
      why: "Models a yes/no outcome and gives you odds ratios you can actually interpret."
    },
    linear: {
      name: "Linear regression",
      why: "Models a numeric outcome. If the same people appear more than once, a mixed model handles that properly."
    }
  };

  function setupTestFinder() {
    var stage = document.getElementById("tf-stage");
    if (!stage) return;

    var history = [];

    function clearStage() {
      while (stage.firstChild) stage.removeChild(stage.firstChild);
    }

    function el(tag, className, text) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      if (text) node.textContent = text;
      return node;
    }

    function showStep(key) {
      var step = TF_TREE[key];
      if (!step) return;
      clearStage();

      var box = el("div", "tf-fade");
      box.appendChild(el("p", "tf-step-label", "Question " + (history.length + 1)));
      box.appendChild(el("p", "tf-question", step.question));

      step.options.forEach(function (opt) {
        var btn = el("button", "tf-option", opt.label);
        btn.type = "button";
        btn.addEventListener("click", function () {
          history.push(key);
          if (opt.result) showResult(opt.result);
          else showStep(opt.next);
        });
        box.appendChild(btn);
      });

      if (history.length > 0) {
        var back = el("button", "tf-back", "← Back");
        back.type = "button";
        back.addEventListener("click", function () {
          showStep(history.pop());
        });
        box.appendChild(back);
      }

      stage.appendChild(box);
    }

    function showResult(key) {
      var res = TF_RESULTS[key];
      if (!res) return;
      clearStage();

      var box = el("div", "tf-fade");
      box.appendChild(el("p", "tf-result-label", "The test I'd start with"));
      box.appendChild(el("p", "tf-result-name", res.name));
      box.appendChild(el("p", "tf-result-why", res.why));
      box.appendChild(el("p", "tf-caveat",
        "Real data is messier than three questions. Assumptions still need checking, and that's the part I do."));

      var actions = el("div", "tf-actions");
      var cta = el("a", "btn btn-primary", "Book a free 10-min call");
      cta.href = "https://calendly.com/dhruv-dsstatistics/10";
      cta.target = "_blank";
      cta.rel = "noopener noreferrer";
      actions.appendChild(cta);

      var restart = el("button", "tf-restart", "Start over");
      restart.type = "button";
      restart.addEventListener("click", function () {
        history = [];
        showStep("start");
      });
      actions.appendChild(restart);

      box.appendChild(actions);
      stage.appendChild(box);
    }

    showStep("start");
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
  setupTestFinder();
  setupReveal();
})();
