/* ============================================
   YEMAIL / ROSAS — App Logic
   Domain-based partner ordering + UI interactions
   ============================================ */

(function () {
  'use strict';

  // ===== Partner data =====
  var partners = [
    {
      key: 'yemail',
      name: 'JAIME YEMAIL',
      company: 'B1 Development Inc.',
      monogram: 'JY',
      license: 'California General Building Contractor · Class B',
      cslb: '#1148065',
      cslbUrl: 'https://www.cslb.ca.gov/1148065',
      role: 'DESIGN & DEVELOPMENT',
      foot: 'PLANNING · DESIGN · PERMITS · COORDINATION',
      bio: 'Planning and design leadership from early property evaluation through permit-ready project coordination.',
      skills: [
        'Property and development feasibility',
        'Residential design and space planning',
        'ADUs, additions and remodeling concepts',
        'Zoning and building-code research',
        'Permit processing and agency coordination',
        'Energy compliance and consultant coordination'
      ]
    },
    {
      key: 'rosas',
      name: 'EDUARDO ROSAS',
      company: 'Rosas Construction',
      monogram: 'ER',
      license: 'California General Building Contractor · Class B',
      cslb: '#1072275',
      cslbUrl: 'https://www.cslb.ca.gov/1072275',
      role: 'CONSTRUCTION & EXECUTION',
      foot: 'ESTIMATING · BUILDING · FIELD OPERATIONS',
      bio: 'Construction leadership focused on bringing approved plans into the field with clear coordination and execution.',
      skills: [
        'Residential construction and renovations',
        'ADUs, additions and new construction',
        'Construction estimating and budgeting',
        'Trade and subcontractor coordination',
        'Construction scheduling and field operations',
        'Jobsite execution and project delivery'
      ]
    }
  ];

  // ===== Domain detection =====
  var domain = window.location.hostname.toLowerCase().replace(/^www\./, '');
  var domainFirst = domain === 'rosasyemail.com' ? 'rosas' : 'yemail';
  var params = new URLSearchParams(window.location.search);
  var requested = params.get('view');
  var mode = (requested === 'rosas' || requested === 'yemail') ? requested : 'auto';

  // ===== Render partner cards =====
  function renderPartners() {
    var first = mode === 'auto' ? domainFirst : mode;
    var order = first === 'rosas' ? [partners[1], partners[0]] : [partners[0], partners[1]];

    var container = document.getElementById('partners');
    container.innerHTML = '';

    order.forEach(function (p, i) {
      var num = String(i + 1).padStart(2, '0');
      var card = document.createElement('div');
      card.className = 'partner-card';

      var skills = p.skills.map(function (s) { return '<li>' + s + '</li>'; }).join('');

      card.innerHTML =
        '<div class="partner-header">' +
          '<div class="partner-num">' + num + ' / ' + p.role + '</div>' +
          '<div class="partner-photo">' + p.monogram + '</div>' +
          '<h3 class="partner-name">' + p.name + '</h3>' +
          '<p class="partner-company">' + p.company + '</p>' +
          '<div class="partner-license">' +
            '<span>' + p.license + '</span>' +
            '<span>CSLB ' + p.cslb + '</span>' +
            '<a href="' + p.cslbUrl + '" target="_blank" rel="noopener">Verify ↗</a>' +
          '</div>' +
        '</div>' +
        '<div class="partner-body">' +
          '<p>' + p.bio + '</p>' +
          '<ul>' + skills + '</ul>' +
        '</div>' +
        '<div class="partner-foot">' + p.foot + '</div>';

      container.appendChild(card);
    });
  }

  // ===== Render brand =====
  function renderBrand() {
    var first = mode === 'auto' ? domainFirst : mode;
    var brand = first === 'rosas' ? 'ROSAS / YEMAIL' : 'YEMAIL / ROSAS';
    var mono = first === 'rosas' ? 'R/Y' : 'Y/R';

    document.querySelectorAll('[data-brand]').forEach(function (n) { n.textContent = brand; });
    document.querySelectorAll('[data-monogram]').forEach(function (n) { n.textContent = mono; });
    document.querySelector('.brand').setAttribute('aria-label', brand + ' home');

    // Update title
    document.title = brand + ' | Design · Develop · Build';
  }

  // ===== Hide preview bar on production domains =====
  var isProductionDomain = domain === 'yemailrosas.com' || domain === 'rosasyemail.com';
  var previewBar = document.querySelector('.preview-bar');
  if (previewBar) {
    // Show preview toggle only on staging/localhost, hide on real domains
    if (isProductionDomain) {
      previewBar.style.display = 'none';
    }
  }

  // ===== Mode toggle =====
  function renderMode() {
    var first = mode === 'auto' ? domainFirst : mode;
    var brand = first === 'rosas' ? 'ROSAS / YEMAIL' : 'YEMAIL / ROSAS';

    var buttons = document.querySelectorAll('[data-mode]');
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
    });

    var note = document.getElementById('mode-note');
    if (mode === 'auto') {
      note.textContent = 'Automatic: ' + (domain === 'rosasyemail.com' ? 'rosasyemail.com' : 'default / yemailrosas.com');
    } else {
      note.textContent = 'Manual: ' + brand;
    }
  }

  function renderAll() {
    renderBrand();
    renderPartners();
    renderMode();
  }

  // Mode toggle buttons
  document.querySelectorAll('[data-mode]').forEach(function (b) {
    b.addEventListener('click', function () {
      mode = b.dataset.mode;
      var u = new URL(location.href);
      if (mode === 'auto') u.searchParams.delete('view');
      else u.searchParams.set('view', mode);
      history.replaceState(null, '', u);
      renderAll();
    });
  });

  window.addEventListener('popstate', function () {
    var v = new URLSearchParams(location.search).get('view');
    mode = v === 'rosas' || v === 'yemail' ? v : 'auto';
    renderAll();
  });

  // ===== Project filters =====
  document.querySelectorAll('[data-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var selected = btn.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });
      document.querySelectorAll('.project-card').forEach(function (card) {
        card.hidden = selected !== 'all' && card.dataset.category !== selected;
      });
    });
  });

  // ===== Mobile menu — close on outside click =====
  var menuBtn = document.getElementById('menu');
  var navLinks = document.getElementById('nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      menuBtn.textContent = open ? '✕' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = '☰';
      });
    });
    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !menuBtn.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = '☰';
      }
    });
  }

  // ===== Hero scroll click =====
  var heroScroll = document.getElementById('hero-scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', function () {
      var stats = document.querySelector('.stats');
      if (stats) stats.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ===== Back to top =====
  var backTop = document.getElementById('back-top');
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== Active nav highlighting =====
  var navLinkEls = document.querySelectorAll('[data-nav-link]');
  var sections = [];
  navLinkEls.forEach(function (link) {
    var target = document.querySelector(link.getAttribute('href'));
    if (target) sections.push({ link: link, el: target });
  });

  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinkEls.forEach(function (l) { l.classList.remove('active'); });
        var match = sections.find(function (s) { return s.el === entry.target; });
        if (match) match.link.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px' });

  sections.forEach(function (s) { navObserver.observe(s.el); });

  // ===== Header scroll behavior =====
  var header = document.getElementById('header');
  var progress = document.getElementById('progress');
  var lastScroll = 0;

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar
    if (progress) {
      var pct = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = pct + '%';
    }

    // Header hide/show
    if (header) {
      if (y > 100 && y > lastScroll) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
    }

    // Back to top visibility
    if (backTop) {
      if (y > 600) {
        backTop.classList.add('visible');
      } else {
        backTop.classList.remove('visible');
      }
    }

    lastScroll = y;
  }, { passive: true });

  // ===== Contact form =====
  var form = document.getElementById('inquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      function val(id) { return document.getElementById(id).value.trim(); }

      var subject = 'YEMAIL / ROSAS Project Inquiry — ' + (val('type') || 'General');
      var body = [
        'Entry domain: ' + location.hostname,
        'Presentation: ' + document.body.dataset.first,
        'Professional role: ' + val('role'),
        'Name: ' + val('name'),
        'Email: ' + val('email'),
        'Phone: ' + val('phone'),
        'Project type: ' + val('type'),
        'Property: ' + val('address'),
        '',
        'Project details:',
        val('details')
      ].join('\n');

      var status = document.getElementById('status');
      if (status) status.textContent = 'Opening your email app...';

      window.location.href = 'mailto:jamieyemail@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  // ===== Year =====
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Scroll reveal =====
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.section, .stats, .cta-banner').forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });

  // ===== Theme toggle =====
  var themeToggle = document.getElementById('theme-toggle');
  var root = document.documentElement;
  var currentTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', currentTheme);
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', 'Switch to ' + (currentTheme === 'dark' ? 'light' : 'dark') + ' mode');
    themeToggle.addEventListener('click', function () {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      themeToggle.setAttribute('aria-label', 'Switch to ' + (currentTheme === 'dark' ? 'light' : 'dark') + ' mode');
    });
  }

  // ===== Init =====
  renderAll();
})();
