/**
 * Clash of BaNG — Global Scripts
 * Navigation, animations, form validation (NO REGEX)
 */

(function () {
  "use strict";

  function setActiveNavLink() {
    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    var navLinks = document.querySelectorAll(".navbar__links a");

    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) {
        return;
      }

      var linkPage = href.split("/").pop();
      var isHome =
        (currentPage === "" || currentPage === "index.html") &&
        (linkPage === "index.html" || linkPage === "");
      var isMatch = linkPage === currentPage || isHome;

      link.classList.toggle("active", isMatch);
    });
  }

  function initMobileMenu() {
    var toggle = document.querySelector(".navbar__toggle");
    var links = document.querySelector(".navbar__links");

    if (!toggle || !links) {
      return;
    }

    toggle.addEventListener("click", function () {
      toggle.classList.toggle("is-active");
      links.classList.toggle("is-open");
      toggle.setAttribute(
        "aria-expanded",
        links.classList.contains("is-open") ? "true" : "false"
      );
    });

    links.querySelectorAll("a").forEach(function (anchor) {
      anchor.addEventListener("click", function () {
        toggle.classList.remove("is-active");
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initGlitchButtons() {
    var buttons = document.querySelectorAll(".btn");

    buttons.forEach(function (btn) {
      btn.addEventListener("mouseenter", function () {
        btn.classList.add("btn--glitch-active");
      });

      btn.addEventListener("mouseleave", function () {
        btn.classList.remove("btn--glitch-active");
      });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var targetId = this.getAttribute("href");
        if (targetId === "#") {
          return;
        }

        var target = document.querySelector(targetId);
        if (!target) {
          return;
        }

        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function initScrollAnimations() {
    var elements = document.querySelectorAll(".animate-on-scroll");
    if (!elements.length) {
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initStatBars() {
    var bars = document.querySelectorAll(".stat-bar__fill[data-value]:not([data-animated])");
    if (!bars.length) {
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var fill = entry.target;
            fill.style.width = fill.getAttribute("data-value") + "%";
            fill.setAttribute("data-animated", "true");
            observer.unobserve(fill);
          }
        });
      },
      { threshold: 0.25 }
    );

    bars.forEach(function (bar) {
      observer.observe(bar);
    });
  }

  function setFieldInvalid(field, isInvalid) {
    if (field) {
      field.classList.toggle("is-invalid", isInvalid);
    }
  }

  function showError(errorEl, message) {
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function isValidEmail(value) {
    var trimmed = value.trim();
    var atIndex = trimmed.indexOf("@");
    var dotIndex = trimmed.indexOf(".");

    if (atIndex <= 0) {
      return false;
    }

    if (dotIndex <= atIndex + 1) {
      return false;
    }

    if (dotIndex === trimmed.length - 1) {
      return false;
    }

    return true;
  }

  /**
   * 5 validation rules (NO REGEX):
   * 1. Commander name required, min 3 chars
   * 2. Email must contain @ and .
   * 3. Allegiance radio selected
   * 4. Commander level 1-50
   * 5. Battle oath min 15 chars
   */
  function initRegistrationForm() {
    var form = document.getElementById("register-form");
    if (!form) {
      return;
    }

    var usernameInput = document.getElementById("username");
    var emailInput = document.getElementById("email");
    var levelInput = document.getElementById("commander-level");
    var oathInput = document.getElementById("battle-oath");
    var usernameError = document.getElementById("username-error");
    var emailError = document.getElementById("email-error");
    var allegianceError = document.getElementById("allegiance-error");
    var levelError = document.getElementById("level-error");
    var oathError = document.getElementById("oath-error");

    function validateUsername() {
      var value = usernameInput.value.trim();
      var message = "";

      if (value.length === 0) {
        message = "Commander name is required.";
      } else if (value.length < 3) {
        message = "Commander name must be at least 3 characters.";
      }

      setFieldInvalid(usernameInput, message !== "");
      showError(usernameError, message);
      return message === "";
    }

    function validateEmail() {
      var value = emailInput.value;
      var message = "";

      if (value.trim().length === 0) {
        message = "Email address is required.";
      } else if (!isValidEmail(value)) {
        message = "Enter a valid email with @ and a domain (e.g. name@domain.com).";
      }

      setFieldInvalid(emailInput, message !== "");
      showError(emailError, message);
      return message === "";
    }

    function validateAllegiance() {
      var selected = form.querySelector('input[name="allegiance"]:checked');
      var message = selected ? "" : "Select your warlord allegiance.";

      showError(allegianceError, message);
      return message === "";
    }

    function validateLevel() {
      var value = levelInput.value;
      var message = "";
      var level = parseInt(value, 10);

      if (value === "" || isNaN(level)) {
        message = "Commander level is required.";
      } else if (level < 1 || level > 50) {
        message = "Commander level must be between 1 and 50.";
      }

      setFieldInvalid(levelInput, message !== "");
      showError(levelError, message);
      return message === "";
    }

    function validateOath() {
      var value = oathInput.value.trim();
      var message = "";

      if (value.length === 0) {
        message = "Battle oath is required.";
      } else if (value.length < 15) {
        message = "Battle oath must be at least 15 characters.";
      }

      setFieldInvalid(oathInput, message !== "");
      showError(oathError, message);
      return message === "";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var rule1 = validateUsername();
      var rule2 = validateEmail();
      var rule3 = validateAllegiance();
      var rule4 = validateLevel();
      var rule5 = validateOath();

      if (!rule1 || !rule2 || !rule3 || !rule4 || !rule5) {
        return;
      }

      var formBody = document.getElementById("form-body");
      var successEl = document.getElementById("form-success");

      if (formBody && successEl) {
        formBody.classList.add("is-hidden");
        successEl.classList.add("is-visible");
      }
    });

    usernameInput.addEventListener("blur", validateUsername);
    emailInput.addEventListener("blur", validateEmail);
    levelInput.addEventListener("blur", validateLevel);
    oathInput.addEventListener("blur", validateOath);

    form.querySelectorAll('input[name="allegiance"]').forEach(function (radio) {
      radio.addEventListener("change", validateAllegiance);
    });
  }

  function init() {
    setActiveNavLink();
    initMobileMenu();
    initGlitchButtons();
    initSmoothScroll();
    initScrollAnimations();
    initStatBars();
    initRegistrationForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
