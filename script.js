const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Tiny animated night sky
const starField = document.querySelector('.star-field');
if (starField && !reducedMotion) {
  for (let i = 0; i < 70; i += 1) {
    const star = document.createElement('span');
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--dur', `${1.8 + Math.random() * 3.8}s`);
    star.style.animationDelay = `${Math.random() * 4}s`;
    const size = Math.random() > 0.85 ? 3 : 2;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    starField.appendChild(star);
  }
}

// Reveal sections as you scroll
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay || 0);
      window.setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('visible'));
}

// Subtle 3D movement on the hero image
const moonCard = document.getElementById('moon-card');
if (moonCard && !reducedMotion) {
  moonCard.addEventListener('mousemove', (event) => {
    const rect = moonCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    moonCard.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${y * -5}deg)`;
  });
  moonCard.addEventListener('mouseleave', () => {
    moonCard.style.transform = '';
  });
}

// Copy VRChat / Discord usernames
const toast = document.getElementById('toast');
let toastTimer;
function showToast(text) {
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1700);
}

document.querySelectorAll('.copy-card').forEach((button) => {
  button.addEventListener('click', async () => {
    const text = button.dataset.copy || '';
    try {
      await navigator.clipboard.writeText(text);
      const state = button.querySelector('.copy-state');
      if (state) {
        const old = state.textContent;
        state.textContent = 'COPIED ✓';
        window.setTimeout(() => { state.textContent = old; }, 1400);
      }
      showToast(`${text} copied!`);
    } catch {
      showToast(`Username: ${text}`);
    }
  });
});

// Gallery lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const closeButton = document.querySelector('.lightbox-close');

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = button.dataset.lightbox;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

closeButton?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

// Soft mouse-follow glow for desktop
if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener('pointermove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  });

  const moveGlow = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(moveGlow);
  };
  moveGlow();
}

// Tiny furry-style click particles on interactive elements
if (!reducedMotion) {
  const particleTargets = document.querySelectorAll('.pill-nav a, .social-bubbles a, .bubble-button, .furry-link, .photo-card');
  const particleChars = ['♡', '✦', '⋆', '🐾'];

  particleTargets.forEach((target) => {
    target.addEventListener('click', (event) => {
      const rect = target.getBoundingClientRect();
      const originX = event.clientX || rect.left + rect.width / 2;
      const originY = event.clientY || rect.top + rect.height / 2;

      for (let i = 0; i < 5; i += 1) {
        const particle = document.createElement('span');
        particle.className = 'click-particle';
        particle.textContent = particleChars[Math.floor(Math.random() * particleChars.length)];
        particle.style.left = `${originX}px`;
        particle.style.top = `${originY}px`;
        particle.style.setProperty('--x', `${(Math.random() - 0.5) * 80}px`);
        particle.style.setProperty('--y', `${-30 - Math.random() * 55}px`);
        particle.style.animationDelay = `${i * 25}ms`;
        document.body.appendChild(particle);
        window.setTimeout(() => particle.remove(), 900);
      }
    });
  });
}

// Give small cards a little personality when the pointer moves over them
if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.fact, .furry-link').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) translateY(-2px) rotateX(${y * -2.5}deg) rotateY(${x * 3.5}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

// Footer year
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
