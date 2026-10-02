const galleryCopy = {
  en: {
    all: 'All',
    vrchat: 'VRChat',
    fursuit: 'Fursuit',
    art: 'Art & Stickers',
    events: 'Events',
    emptyTitle: 'Nothing here yet',
    emptyText: 'Photos for this category will show up here later.'
  },
  de: {
    all: 'Alle',
    vrchat: 'VRChat',
    fursuit: 'Fursuit',
    art: 'Art & Sticker',
    events: 'Events',
    emptyTitle: 'Hier ist noch nichts',
    emptyText: 'Bilder für diese Kategorie kommen später hier rein.'
  },
  ru: {
    all: 'Все',
    vrchat: 'VRChat',
    fursuit: 'Фурсьют',
    art: 'Арт и стикеры',
    events: 'Ивенты',
    emptyTitle: 'Пока здесь пусто',
    emptyText: 'Позже здесь появятся фотографии этой категории.'
  }
};

const galleryFilters = [...document.querySelectorAll('.gallery-filter')];
const galleryItems = [...document.querySelectorAll('.gallery-item')];
const galleryEmpty = document.querySelector('.gallery-empty');
const galleryEmptyTitle = galleryEmpty?.querySelector('strong');
const galleryEmptyText = galleryEmpty?.querySelector('span');
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

  if (galleryEmptyTitle) galleryEmptyTitle.textContent = copy.emptyTitle;
  if (galleryEmptyText) galleryEmptyText.textContent = copy.emptyText;
}

function updateGalleryCounts() {
  galleryFilters.forEach((button) => {
    const category = button.dataset.filter;
    const count = category === 'all'
      ? galleryItems.length
      : galleryItems.filter((item) => item.dataset.category === category).length;
    const badge = button.querySelector('.gallery-count');
    if (badge) badge.textContent = count;
  });
}

function filterGallery(category) {
  activeGalleryCategory = category;
  let visible = 0;

  galleryItems.forEach((item) => {
    const show = category === 'all' || item.dataset.category === category;
    item.classList.toggle('gallery-hidden', !show);
    if (show) visible += 1;
  });

  galleryFilters.forEach((button) => {
    const active = button.dataset.filter === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  galleryEmpty?.classList.toggle('show', visible === 0);
}

galleryFilters.forEach((button) => {
  button.addEventListener('click', () => filterGallery(button.dataset.filter || 'all'));
});

const languageObserver = new MutationObserver(() => {
  updateGalleryLabels();
  filterGallery(activeGalleryCategory);
});
languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

updateGalleryLabels();
updateGalleryCounts();
filterGallery('all');
