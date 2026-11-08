(function () {
  "use strict";

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var THEME_KEY = "theme";

  function applyTheme(theme) {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved) {
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      applyTheme("dark");
    }
  }
  initTheme();

  var themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.getElementById("nav-menu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
    navMenu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-menu a[href^='#']"));
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { activeObserver.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(".card, .project, .stat, .section-head");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString("ko-KR");
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var countObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (c) { countObserver.observe(c); });
    } else {
      counters.forEach(function (c) { c.textContent = c.getAttribute("data-count"); });
    }
  }

  /* ---------- Contact form validation ---------- */
  var form = document.querySelector(".contact-form");
  if (form) {
    var status = form.querySelector(".form-status");

    function setError(input, message) {
      var field = input.closest(".field");
      var error = field.querySelector(".error");
      field.classList.toggle("invalid", Boolean(message));
      error.textContent = message || "";
      input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validate(input) {
      var value = input.value.trim();
      if (!value) return "필수 입력 항목입니다.";
      if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "올바른 이메일 주소를 입력해 주세요.";
      if (input.tagName === "TEXTAREA" && value.length < 10) return "메시지는 10자 이상 입력해 주세요.";
      return "";
    }

    var inputs = Array.prototype.slice.call(form.querySelectorAll("input, textarea"));
    inputs.forEach(function (input) {
      input.addEventListener("blur", function () { setError(input, validate(input)); });
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("invalid")) setError(input, validate(input));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstInvalid = null;
      inputs.forEach(function (input) {
        var msg = validate(input);
        setError(input, msg);
        if (msg && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        status.className = "form-status fail";
        status.textContent = "입력 내용을 확인해 주세요.";
        return;
      }
      // 실제 전송은 백엔드 또는 Formspree 등의 서비스에 연결하세요.
      status.className = "form-status success";
      status.textContent = "메시지가 준비되었습니다. 전송 서비스를 연결하면 바로 발송됩니다.";
      form.reset();
    });
  }

  /* ---------- Back to top ---------- */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.scrollY > 400);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
