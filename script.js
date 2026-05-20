/* ============================================
   医韵同心 - 页面交互
   ============================================ */
(function () {
  'use strict';

  // 当前日期
  function renderDate() {
    const el = document.getElementById('currentDate');
    if (!el) return;
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    el.textContent = `${y}年${m}月${d}日 · 星期${weekdays[now.getDay()]}`;
  }

  // 数字计数动画
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const duration = 2200;

      const start = (now) => {
        const t0 = now;
        function tick(t) {
          const p = Math.min((t - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          counter.textContent = Math.floor(eased * target).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
          else counter.textContent = target.toLocaleString();
        }
        requestAnimationFrame(tick);
      };

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(start);
            io.unobserve(counter);
          }
        });
      }, { threshold: 0.3 });
      io.observe(counter);
    });
  }

  // 滚动渐显
  function setupFadeUp() {
    const targets = document.querySelectorAll(
      '.column, .unity-item, .med-card, .tip-card, .news-card, .news-featured'
    );
    targets.forEach((el) => el.classList.add('fade-up'));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    targets.forEach((el) => io.observe(el));
  }

  // 平滑滚动
  function setupSmoothScroll() {
    document.querySelectorAll('.nav-quick a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 70;
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - offset,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // 卡片点击反馈
  function setupCardClick() {
    document.querySelectorAll('.news-card, .news-featured, .med-card, .tip-card').forEach((item) => {
      item.addEventListener('click', () => {
        item.style.transform = 'scale(0.985)';
        setTimeout(() => { item.style.transform = ''; }, 160);
      });
    });
  }

  // 视差效果 (hero 元素)
  function setupParallax() {
    const badge = document.querySelector('.badge-glow');
    const handshake = document.querySelector('.handshake-deco');
    const skyline = document.querySelector('.skyline');

    if (!badge || !handshake || !skyline) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.pageYOffset;
          if (y < window.innerHeight) {
            badge.style.transform = `translateY(${y * 0.3}px)`;
            handshake.style.transform = `translateY(${y * 0.2}px)`;
            skyline.style.transform = `translateY(${y * 0.15}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function init() {
    renderDate();
    animateCounters();
    setupFadeUp();
    setupSmoothScroll();
    setupCardClick();
    setupParallax();
    console.log('%c医韵同心 · 凝心聚力守护健康',
      'color:#c01818;background:#ffd87a;padding:6px 14px;border-radius:6px;font-size:14px;font-family:serif;letter-spacing:4px;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
