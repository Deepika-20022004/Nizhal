// Nizhal Charitable Trust — shared site behaviour
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  var scrim = document.querySelector(".nav-scrim");

  function closeNav() {
    nav.classList.remove("open");
    scrim.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  function openNav() {
    nav.classList.add("open");
    scrim.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  }

  if (toggle && nav && scrim) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("open");
      isOpen ? closeNav() : openNav();
    });
    scrim.addEventListener("click", closeNav);
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  // Scroll Spy to highlight the active link in navigation
  if ("IntersectionObserver" in window) {
    var sections = document.querySelectorAll("main > section[id]");
    var navLinks = document.querySelectorAll(".main-nav a[href^='#']");

    var observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px",
      threshold: 0
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = "#" + entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            if (link.getAttribute("href") === id) {
              link.classList.add("active");
              link.setAttribute("aria-current", "page");
            } else {
              link.classList.remove("active");
              link.removeAttribute("aria-current");
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // Copy-to-clipboard for bank details
  document.querySelectorAll("[data-copy-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.getAttribute("data-copied") === "true") return;

      var target = document.querySelector(btn.getAttribute("data-copy-target"));
      if (!target) return;
      
      var text = "";
      var rows = target.querySelectorAll(".bank-row");
      if (rows.length > 0) {
        var lines = [];
        rows.forEach(function (row) {
          var dt = row.querySelector("dt");
          var dd = row.querySelector("dd");
          if (dt && dd) {
            var key = dt.textContent.trim();
            var val = dd.innerHTML
              .replace(/<br\s*\/?>/gi, ", ")
              .replace(/&ndash;/g, "–")
              .replace(/&mdash;/g, "—")
              .replace(/&amp;/g, "&")
              .replace(/&nbsp;/g, " ")
              .replace(/\s+/g, " ")
              .replace(/<\/?[^>]+(>|$)/g, "")
              .trim();
            lines.push(key + ": " + val);
          }
        });
        text = lines.join("\n");
      } else {
        text = target.textContent.trim();
      }

      navigator.clipboard.writeText(text).then(function () {
        var originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.setAttribute("data-copied", "true");
        setTimeout(function () {
          btn.textContent = originalText;
          btn.removeAttribute("data-copied");
        }, 1000);
      });
    });
  });

  // Subtle reveal-on-scroll, skipped entirely if reduced motion is requested
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    var revealEls = document.querySelectorAll("[data-reveal]");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "none";
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      io.observe(el);
    });
  }
})();
