// PartyHub Connect — theme scripts
document.addEventListener('DOMContentLoaded', () => {
  // mobile nav
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger) burger.addEventListener('click', () => nav.classList.toggle('open'));
  document.querySelectorAll('.nav > li > a .caret').forEach(c => {
    c.parentElement.addEventListener('click', e => {
      if (window.innerWidth < 981) { e.preventDefault(); c.closest('li').classList.toggle('sub-open'); }
    });
  });

  // countdown (next big celebration — rolls to next Dec 31)
  const cd = document.querySelector('.countdown');
  if (cd) {
    const now = new Date();
    const target = new Date(now.getFullYear(), 11, 31, 19, 0, 0);
    if (target < now) target.setFullYear(target.getFullYear() + 1);
    const el = k => cd.querySelector('[data-cd="' + k + '"]');
    const tick = () => {
      let d = Math.max(0, target - new Date());
      const days = Math.floor(d / 864e5); d -= days * 864e5;
      const hrs = Math.floor(d / 36e5); d -= hrs * 36e5;
      const min = Math.floor(d / 6e4); d -= min * 6e4;
      const sec = Math.floor(d / 1e3);
      el('d').textContent = String(days).padStart(2, '0');
      el('h').textContent = String(hrs).padStart(2, '0');
      el('m').textContent = String(min).padStart(2, '0');
      el('s').textContent = String(sec).padStart(2, '0');
    };
    tick(); setInterval(tick, 1000);
  }

  // reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.rv').forEach(x => io.observe(x));

  // back to top
  const top = document.getElementById('toTop');
  if (top) {
    addEventListener('scroll', () => top.classList.toggle('show', scrollY > 500));
    top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // gallery tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active')); t.classList.add('active');
    const k = t.dataset.tab;
    document.querySelectorAll('[data-pane]').forEach(p => p.style.display = p.dataset.pane === k ? '' : 'none');
  }));

  // demo form handling (front-end only)
  document.querySelectorAll('form[data-demo]').forEach(f => {
    f.addEventListener('submit', e => {
      e.preventDefault();
      const msg = f.querySelector('.form-msg');
      if (msg) { msg.style.display = 'block'; }
      f.reset();
    });
  });
});

// v3: confetti + animated counters
document.addEventListener('DOMContentLoaded', () => {
  // confetti generation
  const host = document.querySelector('.confetti');
  if (host && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const colors = ['#C132DA','#C9A6FF','#4FA8E8','#0D47D6','#8115A6','#E14FDB'];
    for (let i = 0; i < 26; i++) {
      const c = document.createElement('i');
      c.className = 'cf';
      c.style.left = Math.random() * 100 + '%';
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = 6 + Math.random() * 7 + 's';
      c.style.animationDelay = -Math.random() * 10 + 's';
      c.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      if (i % 3 === 0) c.style.borderRadius = '50%';
      host.appendChild(c);
    }
  }
  // count-up stats
  const cu = document.querySelectorAll('[data-count]');
  if (cu.length) {
    const io2 = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; io2.unobserve(e.target);
      const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
      const t0 = performance.now(), dur = 1600;
      const step = t => {
        const p = Math.min(1, (t - t0) / dur), ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * ease).toLocaleString() + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: .4 });
    cu.forEach(x => io2.observe(x));
  }
  // subtle 3D tilt
  if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.card,.tcard,.bcard').forEach(el => {
      el.addEventListener('mousemove', ev => {
        const r = el.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
        el.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }
});

// 2026 update: smart app-store links (device-aware) + mailto contact form
document.addEventListener('DOMContentLoaded', () => {
  // Smart app links — every CTA points to the right app for the visitor's device.
  const APP_LINKS = {
    consumer: {
      ios: 'https://apps.apple.com/ca/app/partyhub-connect/id6764497833',
      android: 'https://play.google.com/store/apps/details?id=com.partyhub'
    },
    vendor: {
      ios: 'https://apps.apple.com/ca/app/partyhub-connect-vendor/id6764770190',
      android: 'https://play.google.com/store/apps/details?id=com.party_hub_vendor'
    }
  };
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  document.querySelectorAll('a[data-app]').forEach(a => {
    const t = APP_LINKS[a.dataset.app];
    if (t) {
      a.href = isIOS ? t.ios : t.android;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  });

  // Static-site contact form: composes an email to info@partyhubconnect.com
  document.querySelectorAll('form[data-mailto]').forEach(f => {
    f.addEventListener('submit', e => {
      e.preventDefault();
      const v = id => { const el = f.querySelector('#' + id); return el ? el.value.trim() : ''; };
      const subject = 'Website enquiry — ' + (v('c-type') || 'General') + (v('c-name') ? ' — ' + v('c-name') : '');
      const body = 'Name: ' + v('c-name') + '\nEmail: ' + v('c-email') + '\nPhone: ' + v('c-phone') +
        '\nEvent type: ' + v('c-type') + '\n\nMessage:\n' + v('c-msg');
      window.location.href = 'mailto:info@partyhubconnect.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      const msg = f.querySelector('.form-msg');
      if (msg) { msg.style.display = 'block'; }
    });
  });
});
