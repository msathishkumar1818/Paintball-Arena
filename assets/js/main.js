/**
 * PAINTBALL ARENA - MASTER JAVASCRIPT (main.js)
 * Strict modular architecture:
 * - Branded Loader
 * - Fixed Header & Scroll handling
 * - Click-only Desktop Dropdown
 * - Mobile Menu & Accordion
 * - Dark Mode with localStorage
 * - RTL/LTR with localStorage
 * - Scroll-to-top Button
 * - Active navigation handling
 */

(function () {
  'use strict';

  // --- 1. BRANDED LOADER ---
  function initLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    const hideLoader = () => {
      loader.classList.add('loaded');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    };

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 250);
    } else {
      window.addEventListener('load', () => setTimeout(hideLoader, 250));
      // Safety fallback timeout
      setTimeout(hideLoader, 1500);
    }
  }

  // --- 2. DARK MODE SYSTEM (#000000) ---
  function initDarkMode() {
    const root = document.documentElement;
    const darkToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const savedTheme = localStorage.getItem('paintball_theme') || 'dark'; // Default tactical dark

    function setTheme(theme) {
      if (theme === 'dark') {
        root.classList.add('dark');
        localStorage.setItem('paintball_theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('paintball_theme', 'light');
      }
      updateThemeButtons(theme);
    }

    function updateThemeButtons(theme) {
      darkToggleBtns.forEach((btn) => {
        const textSpan = btn.querySelector('.theme-text');
        if (textSpan) {
          textSpan.textContent = theme === 'dark' ? 'Light' : 'Dark';
        }
        btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`);
      });
    }

    setTheme(savedTheme);

    darkToggleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isDark = root.classList.contains('dark');
        setTheme(isDark ? 'light' : 'dark');
      });
    });
  }

  // --- 3. RTL / LTR SYSTEM ---
  function initRTL() {
    const root = document.documentElement;
    const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
    const savedDir = localStorage.getItem('paintball_dir') || 'ltr';

    function setDirection(dir) {
      root.setAttribute('dir', dir);
      localStorage.setItem('paintball_dir', dir);
      rtlToggleBtns.forEach((btn) => {
        const textSpan = btn.querySelector('.rtl-text');
        if (textSpan) {
          textSpan.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        }
        btn.setAttribute('aria-label', `Switch to ${dir === 'rtl' ? 'LTR' : 'RTL'}`);
      });
    }

    setDirection(savedDir);

    rtlToggleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentDir = root.getAttribute('dir') || 'ltr';
        setDirection(currentDir === 'rtl' ? 'ltr' : 'rtl');
      });
    });
  }

  // --- 4. DESKTOP HOME DROPDOWN (CLICK ONLY - NEVER HOVER) ---
  function initDropdown() {
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (!dropdownTrigger || !dropdownMenu) return;

    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownMenu.classList.contains('open');
      dropdownMenu.classList.toggle('open', !isOpen);
      dropdownTrigger.setAttribute('aria-expanded', !isOpen);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!dropdownTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close dropdown on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownMenu.classList.remove('open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 5. MOBILE MENU & ACCORDION ---
  function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-toggle-btn');
    const closeBtn = document.querySelector('.mobile-close-btn');
    const drawer = document.querySelector('.mobile-menu-drawer');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const accordionTrigger = document.querySelector('.mobile-accordion-trigger');
    const accordionContent = document.querySelector('.mobile-accordion-content');
    const allNavLinks = document.querySelectorAll('.mobile-nav-link:not(.mobile-accordion-trigger), .mobile-sub-link');

    if (!drawer || !overlay) return;

    function openMenu() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
      // Ensure accordion is closed by default whenever menu opens
      if (accordionContent) accordionContent.classList.remove('open');
      if (accordionTrigger) {
        accordionTrigger.classList.remove('active');
        accordionTrigger.setAttribute('aria-expanded', 'false');
      }
    }

    function closeMenu() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      // Always collapse accordion on close
      if (accordionContent) accordionContent.classList.remove('open');
      if (accordionTrigger) {
        accordionTrigger.classList.remove('active');
        accordionTrigger.setAttribute('aria-expanded', 'false');
      }
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    // Mobile Home Accordion (CLICK ONLY - strictly closed by default, opens only on click)
    if (accordionTrigger && accordionContent) {
      accordionContent.classList.remove('open');
      accordionTrigger.classList.remove('active');
      accordionTrigger.setAttribute('aria-expanded', 'false');

      accordionTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = accordionContent.classList.contains('open');
        accordionContent.classList.toggle('open', !isOpen);
        accordionTrigger.classList.toggle('active', !isOpen);
        accordionTrigger.setAttribute('aria-expanded', !isOpen);
      });
    }

    // Auto-close menu on navigating any link
    allNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Auto-close mobile menu if user resizes window to desktop view
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1280) {
        closeMenu();
      }
    }, { passive: true });
  }

  // --- 6. SCROLL TO TOP ---
  function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 7. ACTIVE NAVIGATION MARKER ---
  function initActiveNav() {
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (!currentPath || currentPath === '/' || currentPath.endsWith('\\')) {
      currentPath = 'index.html';
    }

    const navLinks = document.querySelectorAll('.nav-link, .dropdown-link, .mobile-nav-link, .mobile-sub-link');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const targetPage = href.split('/').pop().split('#')[0].split('?')[0];

      if (targetPage === currentPath || (currentPath === 'index.html' && targetPage === 'index.html')) {
        link.classList.add('active');
        // If it's a dropdown child, also set parent trigger active
        const parentDropdown = link.closest('.nav-item');
        if (parentDropdown) {
          const parentTrigger = parentDropdown.querySelector('.dropdown-trigger');
          if (parentTrigger) parentTrigger.classList.add('active');
        }
      }
    });
  }

  // --- 8. BOOKING CALCULATOR & FORM DISPATCH ---
  function initBookingCalculator() {
    const slotBtns = document.querySelectorAll('.slot-btn');
    const packageLabels = document.querySelectorAll('.package-radio-label');
    const addonCheckboxes = document.querySelectorAll('.addon-input');
    const squadSelect = document.getElementById('book-squad-size');
    const totalDisplay = document.getElementById('summary-total-amount');
    const summaryPkgName = document.getElementById('summary-pkg-name');
    const summarySlotTime = document.getElementById('summary-slot-time');
    const summarySquadCount = document.getElementById('summary-squad-count');
    const summaryAddonsTotal = document.getElementById('summary-addons-total');

    if (!totalDisplay) return; // Only runs on booking page

    let currentPricePerPlayer = 59;
    let currentPlayers = 10;
    let currentAddonsTotal = 0;

    function recalculate() {
      if (squadSelect) {
        currentPlayers = parseInt(squadSelect.value, 10) || 10;
        if (summarySquadCount) summarySquadCount.textContent = `${currentPlayers} Operators`;
      }

      let addonsSum = 0;
      addonCheckboxes.forEach((cb) => {
        if (cb.checked) {
          addonsSum += parseInt(cb.dataset.price, 10) || 0;
        }
      });
      currentAddonsTotal = addonsSum;
      if (summaryAddonsTotal) summaryAddonsTotal.textContent = `$${addonsSum}`;

      const total = (currentPricePerPlayer * currentPlayers) + addonsSum;
      totalDisplay.textContent = `$${total}`;
    }

    // Time slot selection
    slotBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        slotBtns.forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        const timeVal = btn.dataset.time;
        if (summarySlotTime) summarySlotTime.textContent = timeVal;
      });
    });

    // Package radio selection
    packageLabels.forEach((label) => {
      label.addEventListener('click', () => {
        packageLabels.forEach((l) => l.classList.remove('selected'));
        label.classList.add('selected');
        currentPricePerPlayer = parseInt(label.dataset.price, 10) || 59;
        if (summaryPkgName) summaryPkgName.textContent = label.dataset.name;
        recalculate();
      });
    });

    if (squadSelect) {
      squadSelect.addEventListener('change', recalculate);
    }

    addonCheckboxes.forEach((cb) => {
      cb.addEventListener('change', recalculate);
    });

    recalculate();
  }

  // --- 9. FAQ ACCORDION ---
  function initFAQAccordion() {
    const faqBtns = document.querySelectorAll('.faq-question-btn');
    faqBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close siblings
        document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));

        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  }

  // --- 10. MODULAR ARMORY BENCH (RENTAL ADD-ONS) ---
  function initArmoryModStation() {
    const modCards = document.querySelectorAll('.mod-item-card');
    const tabBtns = document.querySelectorAll('.mod-tab-btn');
    const countEl = document.getElementById('selected-mods-count');
    const totalEl = document.getElementById('selected-mods-total');

    if (!modCards.length) return;

    function updateTally() {
      let count = 0;
      let total = 0;
      modCards.forEach((card) => {
        if (card.classList.contains('selected')) {
          count++;
          total += parseInt(card.dataset.cost, 10) || 0;
        }
      });
      if (countEl) countEl.textContent = count;
      if (totalEl) totalEl.textContent = `+$${total}`;
    }

    // Global toggle handler
    window.toggleRentalAddon = function (card) {
      card.classList.toggle('selected');
      const actionSpan = card.querySelector('.mod-select-action');
      if (actionSpan) {
        actionSpan.textContent = card.classList.contains('selected') ? 'Equipped ✓' : 'Select Add-On';
      }
      updateTally();
    };

    // Filter tabs
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.modFilter;
        modCards.forEach((card) => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Package Tier Filter Pills
    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        filterPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  }

  // --- DASHBOARD CONTROLS (PROFILE DROPDOWN & MOBILE DRAWER) ---
  function initDashboardControls() {
    const profileBtn = document.getElementById('dash-profile-btn');
    const profileDropdown = document.getElementById('dash-profile-dropdown');
    const profileWrap = document.getElementById('dash-profile-wrap');
    const sidebarToggle = document.getElementById('dash-sidebar-toggle');
    const sidebar = document.getElementById('dash-app-sidebar');
    const sidebarClose = document.getElementById('dash-sidebar-close');
    const sidebarBackdrop = document.getElementById('dash-sidebar-backdrop');
    const logoutBtn = document.getElementById('dash-logout-btn');
    const sidebarLogoutBtn = document.getElementById('dash-sidebar-logout-btn');

    // Toggle profile dropdown
    if (profileBtn && profileDropdown) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = profileDropdown.classList.contains('show');
        if (isOpen) {
          profileDropdown.classList.remove('show');
          profileBtn.setAttribute('aria-expanded', 'false');
        } else {
          profileDropdown.classList.add('show');
          profileBtn.setAttribute('aria-expanded', 'true');
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (profileWrap && !profileWrap.contains(e.target)) {
          profileDropdown.classList.remove('show');
          profileBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && profileDropdown.classList.contains('show')) {
          profileDropdown.classList.remove('show');
          profileBtn.setAttribute('aria-expanded', 'false');
          profileBtn.focus();
        }
      });

      // Auto-close profile dropdown on window resize (mobile <-> desktop switch)
      window.addEventListener('resize', () => {
        if (profileDropdown.classList.contains('show')) {
          profileDropdown.classList.remove('show');
          profileBtn.setAttribute('aria-expanded', 'false');
        }
      }, { passive: true });
    }

    // Toggle mobile sidebar drawer
    function openSidebar() {
      if (sidebar) sidebar.classList.add('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        openSidebar();
      });
    }

    if (sidebarClose) {
      sidebarClose.addEventListener('click', closeSidebar);
    }

    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', closeSidebar);
    }

    // Close mobile drawer when clicking a link
    if (sidebar) {
      const sidebarLinks = sidebar.querySelectorAll('.dash-sidebar-link');
      sidebarLinks.forEach((link) => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 991) {
            closeSidebar();
          }
        });
      });
    }

    // Handle logout action
    function handleLogout(e) {
      e.preventDefault();
      const confirmLogout = confirm('Confirm Sign Out: Terminate Tactical Operator Session for Commander Viper-9?');
      if (confirmLogout) {
        window.location.href = 'login.html';
      }
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
    if (sidebarLogoutBtn) {
      sidebarLogoutBtn.addEventListener('click', handleLogout);
    }
  }

  // --- DASHBOARD SCROLLSPY & INTERNAL SECTION NAVIGATION ---
  function initDashboardScrollSpy() {
    const sidebar = document.getElementById('dash-app-sidebar');
    if (!sidebar) return;

    const sidebarLinks = sidebar.querySelectorAll('.dash-sidebar-link');
    const sections = [
      { id: 'operator-profile', link: sidebar.querySelector('a[href="#operator-profile"]') },
      { id: 'milestones-schedule', link: sidebar.querySelector('a[href="#milestones-schedule"]') },
      { id: 'fleet-manifest', link: sidebar.querySelector('a[href="#fleet-manifest"]') },
      { id: 'armory-store', link: sidebar.querySelector('a[href="#armory-store"]') },
      { id: 'telemetry-records', link: sidebar.querySelector('a[href="#telemetry-records"]') }
    ];

    function setActive(activeLink) {
      if (!activeLink) return;
      sidebarLinks.forEach((link) => link.classList.remove('active'));
      activeLink.classList.add('active');
    }

    // Smooth click handler with offset scroll for sidebar links
    const topbar = document.querySelector('.dash-app-topbar');
    sidebarLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetEl = document.querySelector(href);
          if (targetEl) {
            setActive(link);

            const topbarH = topbar ? topbar.getBoundingClientRect().height : 72;
            const elementPosition = targetEl.getBoundingClientRect().top;
            // For #overview: we want to land at very top (below topbar)
            const extra = href === '#overview' ? 0 : 16;
            const offsetPosition = elementPosition + window.pageYOffset - topbarH - extra;
            window.scrollTo({
              top: Math.max(0, offsetPosition),
              behavior: 'smooth'
            });

            if (history.pushState) {
              history.pushState(null, '', href);
            }
          }
        }
      });
    });

    // Also handle dropdown links inside dashboard
    const profileDropdown = document.getElementById('dash-profile-dropdown');
    if (profileDropdown) {
      const dropdownLinks = profileDropdown.querySelectorAll('.dropdown-link');
      dropdownLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetEl = document.querySelector(href);
            if (targetEl) {
              const matchedSidebarLink = sidebar.querySelector(`a[href="${href}"]`);
              if (matchedSidebarLink) setActive(matchedSidebarLink);
              profileDropdown.classList.remove('show');
              const profileBtn = document.getElementById('dash-profile-btn');
              if (profileBtn) profileBtn.setAttribute('aria-expanded', 'false');

              const topbarH2 = topbar ? topbar.getBoundingClientRect().height : 72;
              const elementPosition2 = targetEl.getBoundingClientRect().top;
              const extra2 = href === '#overview' ? 0 : 16;
              const offsetPosition2 = elementPosition2 + window.pageYOffset - topbarH2 - extra2;
              window.scrollTo({
                top: Math.max(0, offsetPosition2),
                behavior: 'smooth'
              });
              if (history.pushState) {
                history.pushState(null, '', href);
              }
            }
          }
        });
      });
    }

    // Scroll spy via window scroll
    let isTicking = false;
    window.addEventListener('scroll', () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY + 140;
          for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            const el = document.getElementById(section.id);
            if (el) {
              const top = el.offsetTop;
              if (scrollPos >= top) {
                if (section.link) setActive(section.link);
                break;
              }
            }
          }
          isTicking = false;
        });
        isTicking = true;
      }
    }, { passive: true });
  }

  // --- 13. TACTICAL CUSTOM SELECTS (100% Full Width & Green Accent) ---
  function initCustomSelects() {
    const selects = document.querySelectorAll('select.rfq-input');
    if (!selects.length) return;

    selects.forEach((select) => {
      if (select.dataset.customized === 'true') return;
      select.dataset.customized = 'true';

      // Hide original select from view
      select.style.display = 'none';

      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'custom-select-wrapper';

      // Create trigger button
      const trigger = document.createElement('div');
      trigger.className = 'custom-select-trigger';
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'combobox');
      trigger.setAttribute('aria-expanded', 'false');

      const textSpan = document.createElement('span');
      textSpan.className = 'custom-select-text';
      const selectedOption = select.options[select.selectedIndex] || select.options[0];
      textSpan.textContent = selectedOption ? selectedOption.textContent : '';

      const arrow = document.createElement('div');
      arrow.innerHTML = `<svg class="custom-select-arrow" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

      trigger.appendChild(textSpan);
      trigger.appendChild(arrow.firstElementChild);

      // Create options menu (100% full width, dark theme, green active highlight)
      const menu = document.createElement('div');
      menu.className = 'custom-select-menu';
      menu.setAttribute('role', 'listbox');

      Array.from(select.options).forEach((opt, idx) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'custom-select-option' + (idx === select.selectedIndex ? ' selected' : '');
        optionEl.dataset.value = opt.value;
        optionEl.textContent = opt.textContent;

        optionEl.addEventListener('click', (e) => {
          e.stopPropagation();
          select.value = opt.value;
          textSpan.textContent = opt.textContent;

          menu.querySelectorAll('.custom-select-option').forEach((o) => o.classList.remove('selected'));
          optionEl.classList.add('selected');

          wrapper.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');

          select.dispatchEvent(new Event('change', { bubbles: true }));
        });

        menu.appendChild(optionEl);
      });

      // Toggle dropdown on click
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = wrapper.classList.contains('open');
        document.querySelectorAll('.custom-select-wrapper.open').forEach((w) => {
          if (w !== wrapper) {
            w.classList.remove('open');
            const trig = w.querySelector('.custom-select-trigger');
            if (trig) trig.setAttribute('aria-expanded', 'false');
          }
        });
        wrapper.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen);
      });

      // Keyboard navigation
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger.click();
        } else if (e.key === 'Escape') {
          wrapper.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Insert wrapper into DOM
      select.parentNode.insertBefore(wrapper, select);
      wrapper.appendChild(trigger);
      wrapper.appendChild(menu);
      wrapper.appendChild(select);
    });

    // Close all custom selects on click outside
    document.addEventListener('click', (e) => {
      document.querySelectorAll('.custom-select-wrapper.open').forEach((w) => {
        if (!w.contains(e.target)) {
          w.classList.remove('open');
          const trig = w.querySelector('.custom-select-trigger');
          if (trig) trig.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initDarkMode();
    initRTL();
    initDropdown();
    initMobileMenu();
    initScrollToTop();
    initActiveNav();
    initBookingCalculator();
    initFAQAccordion();
    initArmoryModStation();
    initCustomSelects();
    initDashboardControls();
    initDashboardScrollSpy();
  });
})();
