(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Header: solid on scroll ---------- */
  var header = $(".site-header");
  function onScrollHeader() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Mobile nav ---------- */
  var navToggle = $(".nav-toggle");
  var navMenu = $("#nav-menu");
  function closeNav() {
    if (!navMenu) return;
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "메뉴 열기");
  }
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
    navMenu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
  }

  /* ---------- Active nav link ---------- */
  var sections = $$("main section[id]");
  var navLinks = $$(".nav-menu a[href^='#']:not(.btn)");
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { activeObserver.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = $$(".feature, .news-card, .spec-col, .faq-item, .shot, .section-head, .about-text, .about-visual, .video-card");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
    // 빠른 스크롤로 관찰을 놓친 요소도 화면 위쪽을 지나갔다면 표시
    window.addEventListener("scroll", function () {
      var limit = window.scrollY + window.innerHeight;
      revealTargets.forEach(function (el) {
        if (!el.classList.contains("visible") && el.getBoundingClientRect().top + window.scrollY < limit) {
          el.classList.add("visible");
        }
      });
    }, { passive: true });
  }

  /* ---------- Character tabs ---------- */
  var tabs = $$(".char-tab");
  var panels = $$(".char-panel");
  function activateTab(index) {
    tabs.forEach(function (tab, i) {
      var on = i === index;
      tab.classList.toggle("active", on);
      tab.setAttribute("aria-selected", String(on));
      tab.setAttribute("tabindex", on ? "0" : "-1");
    });
    panels.forEach(function (panel, i) {
      var on = i === index;
      panel.classList.toggle("active", on);
      if (on) panel.removeAttribute("hidden"); else panel.setAttribute("hidden", "");
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { activateTab(i); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = tabs.length - 1;
      if (next !== null) { e.preventDefault(); activateTab(next); tabs[next].focus(); }
    });
  });

  /* ---------- Modal helpers ---------- */
  var lastFocus = null;
  function openModal(modal) {
    lastFocus = document.activeElement;
    modal.removeAttribute("hidden");
    document.body.classList.add("modal-open");
    var closeBtn = $(".modal-close", modal);
    if (closeBtn) closeBtn.focus();
  }
  function closeModal(modal) {
    modal.setAttribute("hidden", "");
    document.body.classList.remove("modal-open");
    var iframe = $("iframe", modal);
    if (iframe) iframe.src = iframe.src; // 영상 정지
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$(".modal").forEach(function (modal) {
    $$("[data-close]", modal).forEach(function (el) {
      el.addEventListener("click", function () { closeModal(modal); });
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    $$(".modal:not([hidden])").forEach(closeModal);
  });

  /* ---------- Trailer ---------- */
  var trailerModal = $("#trailer-modal");
  if (trailerModal) {
    $$("[data-trailer]").forEach(function (btn) {
      btn.addEventListener("click", function () { openModal(trailerModal); });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = $("#lightbox");
  var shots = $$("[data-lightbox]");
  if (lightbox && shots.length) {
    var lbImage = $(".lb-image", lightbox);
    var lbCaption = $(".lb-caption", lightbox);
    var current = 0;
    function showShot(index) {
      current = (index + shots.length) % shots.length;
      var shot = shots[current];
      lbImage.className = "lb-image shot-" + (current + 1);
      lbCaption.textContent = shot.textContent.trim();
    }
    shots.forEach(function (shot, i) {
      shot.addEventListener("click", function () { showShot(i); openModal(lightbox); });
    });
    $(".lb-prev", lightbox).addEventListener("click", function () { showShot(current - 1); });
    $(".lb-next", lightbox).addEventListener("click", function () { showShot(current + 1); });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hasAttribute("hidden")) return;
      if (e.key === "ArrowLeft") showShot(current - 1);
      if (e.key === "ArrowRight") showShot(current + 1);
    });
  }

  /* ---------- Newsletter ---------- */
  var form = $(".newsletter");
  if (form) {
    var input = $("input[type=email]", form);
    var status = $(".form-status", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = input.value.trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      input.classList.toggle("invalid", !valid);
      input.setAttribute("aria-invalid", String(!valid));
      if (!valid) {
        status.className = "form-status fail";
        status.textContent = "올바른 이메일 주소를 입력해 주세요.";
        input.focus();
        return;
      }
      // 실제 전송은 Mailchimp, Formspree 등 서비스에 연결하세요.
      status.className = "form-status success";
      status.textContent = "사전 등록이 완료되었습니다! 출시 소식을 가장 먼저 보내 드릴게요.";
      form.reset();
    });
    input.addEventListener("input", function () {
      if (input.classList.contains("invalid")) {
        input.classList.remove("invalid");
        status.textContent = "";
      }
    });
  }

  /* ---------- Back to top ---------- */
  var toTop = $(".to-top");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Footer year ---------- */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
