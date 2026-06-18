/* ===================================================
   POKKALI VILLAGE PROJECT REPORT — APP.JS
   Navigation, progress rail, theme toggle, counters,
   fade-in animations, print, smooth scroll
   =================================================== */

(function () {
  'use strict';

  // --- THEME TOGGLE ---
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  function getStoredTheme() {
    return localStorage.getItem('pv-report-theme') || 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('pv-report-theme', theme);
  }

  applyTheme(getStoredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // --- MOBILE MENU ---
  var mobileToggle = document.getElementById('mobile-toggle');
  var navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // --- NAV SCROLL SHADOW ---
  var nav = document.getElementById('nav');
  function checkNavScroll() {
    if (!nav) return;
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', checkNavScroll, { passive: true });
  checkNavScroll();

  // --- PROGRESS RAIL ---
  var sections = document.querySelectorAll('[data-section-label]');
  var progressRail = document.getElementById('progress-rail');

  function buildProgressRail() {
    if (!progressRail) return;
    progressRail.innerHTML = '';
    sections.forEach(function (section) {
      var label = section.getAttribute('data-section-label');
      var id = section.id;
      var a = document.createElement('a');
      a.className = 'progress-rail-item';
      a.href = '#' + id;
      a.setAttribute('data-section-id', id);
      a.title = label;

      var dot = document.createElement('span');
      dot.className = 'progress-rail-dot';
      a.appendChild(dot);

      var lbl = document.createElement('span');
      lbl.className = 'progress-rail-label';
      lbl.textContent = label;
      a.appendChild(lbl);

      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });

      progressRail.appendChild(a);
    });
  }

  buildProgressRail();

  // --- ACTIVE SECTION TRACKING ---
  function updateActiveSection() {
    var scrollPos = window.scrollY + window.innerHeight / 3;
    var activeId = null;

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        activeId = section.id;
      }
    });

    // Update progress rail
    var railItems = document.querySelectorAll('.progress-rail-item');
    railItems.forEach(function (item) {
      if (item.getAttribute('data-section-id') === activeId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update nav links
    var navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(function (item) {
      if (item.getAttribute('href') === '#' + activeId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();

  // --- COUNTER ANIMATION ---
  function animateCounters() {
    var counters = document.querySelectorAll('.counter-num');
    counters.forEach(function (counter) {
      if (counter.dataset.animated) return;
      var target = parseInt(counter.getAttribute('data-count'), 10);
      if (isNaN(target)) return;

      var duration = 1500;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        counter.textContent = current.toLocaleString('en-IN');
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target.toLocaleString('en-IN');
        }
      }

      counter.dataset.animated = 'true';
      requestAnimationFrame(step);
    });
  }

  // Trigger counters when visible
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  var counterSection = document.querySelector('.counter-row');
  if (counterSection) {
    counterObserver.observe(counterSection);
  }

  // --- FADE-IN ANIMATION ---
  var fadeElements = document.querySelectorAll('.fade-in');
  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeElements.forEach(function (el) {
    fadeObserver.observe(el);
  });

  // --- PRINT BUTTON ---
  var printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      window.print();
    });
  }

  // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- KEYBOARD SHORTCUTS ---
  document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + P = Print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      return; // allow default print
    }
    // 'd' = toggle dark mode
    if (e.key === 'd' && !e.ctrlKey && !e.metaKey && !e.altKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      var current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    }
  });

})();