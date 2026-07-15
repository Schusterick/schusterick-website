/* ============================================================
   Will Schusterick — schusterick.com
   Nav, scroll reveal, form UX. Vanilla, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Sticky nav state */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile menu */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  function closeMenu() {
    menu.hidden = true;
    nav.classList.remove("is-menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  function openMenu() {
    menu.hidden = false;
    nav.classList.add("is-menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () { if (menu.hidden) openMenu(); else closeMenu(); });
    menu.addEventListener("click", function (e) { if (e.target.tagName === "A") closeMenu(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { closeMenu(); toggle.focus(); }
    });
  }

  /* Scroll reveal */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });

    /* Stagger grouped children */
    document.querySelectorAll(".chips, .glance__stats, .accolades, .course-grid, .disc-grid, .socials, .flight").forEach(function (group) {
      Array.prototype.slice.call(group.children).forEach(function (child, i) {
        if (child.classList.contains("reveal")) child.style.transitionDelay = (i * 55) + "ms";
      });
    });
  }

  /* Subtle hero parallax */
  var heroMedia = document.querySelector("[data-parallax] img");
  if (heroMedia && !reduceMotion) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight) heroMedia.style.transform = "translateY(" + (y * 0.18) + "px)";
        ticking = false;
      });
    }, { passive: true });
  }

  /* Contact form */
  var form = document.getElementById("contactForm");
  var statusEl = document.getElementById("formStatus");
  var submitBtn = document.getElementById("submitBtn");

  function setError(input, message) {
    var slot = form.querySelector('[data-error-for="' + input.id + '"]');
    if (slot) slot.textContent = message || "";
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }
  function validate() {
    var ok = true;
    var name = form.name, email = form.email, message = form.message;
    if (!name.value.trim()) { setError(name, "Please add your name."); ok = false; } else setError(name, "");
    if (!email.value.trim()) { setError(email, "Please add your email."); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setError(email, "That email doesn't look right."); ok = false; }
    else setError(email, "");
    if (!message.value.trim()) { setError(message, "Add a short message."); ok = false; } else setError(message, "");
    return ok;
  }

  if (form) {
    ["name", "email", "message"].forEach(function (id) {
      var el = form[id];
      if (el) el.addEventListener("blur", function () { if (el.getAttribute("aria-invalid") === "true") validate(); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      statusEl.textContent = ""; statusEl.className = "form__status";
      if (!validate()) { var firstBad = form.querySelector('[aria-invalid="true"]'); if (firstBad) firstBad.focus(); return; }

      var action = form.getAttribute("action") || "";
      if (action.indexOf("YOUR_FORM_ID") !== -1) {
        statusEl.textContent = "Form not connected yet — add your Formspree ID to go live.";
        statusEl.className = "form__status is-err";
        return;
      }

      submitBtn.classList.add("is-loading");
      submitBtn.querySelector(".btn__label").textContent = "Sending…";
      fetch(action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            statusEl.textContent = "Thanks — your message is on its way. I'll be in touch.";
            statusEl.className = "form__status is-ok";
          } else {
            statusEl.textContent = "Something went wrong. Please try again in a moment.";
            statusEl.className = "form__status is-err";
          }
        })
        .catch(function () {
          statusEl.textContent = "Network hiccup. Please try again.";
          statusEl.className = "form__status is-err";
        })
        .finally(function () {
          submitBtn.classList.remove("is-loading");
          submitBtn.querySelector(".btn__label").textContent = "Send message";
        });
    });
  }
})();
