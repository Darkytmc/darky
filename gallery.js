const galleryCopy = {
  en: {
    all: 'All',
    vrchat: 'VRChat',
    fursuit: 'Fursuit',
    art: 'Art & Stickers',
    events: 'Events'
  },
  de: {
    all: 'Alle',
    vrchat: 'VRChat',
    fursuit: 'Fursuit',
    art: 'Art & Sticker',
    events: 'Events'
  },
  ru: {
    all: 'Все',
    vrchat: 'VRChat',
    fursuit: 'Фурсьют',
    art: 'Арт и стикеры',
    events: 'Ивенты'
  }
};

const galleryGrid = document.querySelector('.gallery-grid');

const extraGalleryImages = [
  { src: 'darkymoon2.png', label: 'Moon II', alt: 'Darky in VRChat under a blue moon' },
  { src: 'darkymoon3.png', label: 'Moon III', alt: 'Darky in VRChat under a blue moon' }
];

extraGalleryImages.forEach((image) => {
  if (!galleryGrid || galleryGrid.querySelector(`[data-lightbox="${image.src}"]`)) return;

  const button = document.createElement('button');
  button.className = 'photo-card gallery-item gallery-added';
  button.dataset.category = 'vrchat';
  button.dataset.lightbox = image.src;
  button.innerHTML = `<img src="${image.src}" alt="${image.alt}" /><span>${image.label}</span>`;
  galleryGrid.appendChild(button);
});

const galleryFilters = [...document.querySelectorAll('.gallery-filter')];
const galleryItems = [...document.querySelectorAll('.gallery-item')];
let activeGalleryCategory = 'all';

function galleryLanguage() {
  const lang = (document.documentElement.lang || 'en').toLowerCase().split('-')[0];
  return galleryCopy[lang] ? lang : 'en';
}

function updateGalleryLabels() {
  const copy = galleryCopy[galleryLanguage()];
  galleryFilters.forEach((button) => {
    const category = button.dataset.filter;
    const label = button.querySelector('.gallery-filter-label');
    if (label && copy[category]) label.textContent = copy[category];
  });
}

function categoryCount(category) {
  return category === 'all'
    ? galleryItems.length
    : galleryItems.filter((item) => item.dataset.category === category).length;
}

function updateGalleryCounts() {
  galleryFilters.forEach((button) => {
    const category = button.dataset.filter;
    const count = categoryCount(category);
    const badge = button.querySelector('.gallery-count');
    if (badge) badge.textContent = count;

    button.hidden = category !== 'all' && count === 0;
  });

  if (activeGalleryCategory !== 'all' && categoryCount(activeGalleryCategory) === 0) {
    activeGalleryCategory = 'all';
  }
}

function filterGallery(category) {
  if (category !== 'all' && categoryCount(category) === 0) category = 'all';
  activeGalleryCategory = category;

  galleryItems.forEach((item) => {
    const show = category === 'all' || item.dataset.category === category;
    item.classList.toggle('gallery-hidden', !show);
  });

  galleryFilters.forEach((button) => {
    const active = button.dataset.filter === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

galleryFilters.forEach((button) => {
  button.addEventListener('click', () => filterGallery(button.dataset.filter || 'all'));
});

const galleryLightbox = document.getElementById('lightbox');
const galleryLightboxImage = document.getElementById('lightbox-image');

document.querySelectorAll('.gallery-added').forEach((button) => {
  button.addEventListener('click', () => {
    if (!galleryLightbox || !galleryLightboxImage) return;
    galleryLightboxImage.src = button.dataset.lightbox || '';
    galleryLightbox.classList.add('open');
    galleryLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

const languageObserver = new MutationObserver(() => {
  updateGalleryLabels();
  filterGallery(activeGalleryCategory);
});
languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

updateGalleryLabels();
updateGalleryCounts();
filterGallery('all');
