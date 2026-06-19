const ready = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
    return;
  }

  callback();
};

const normalize = (value) => String(value || '').trim().toLowerCase();

function initMobileNav() {
  const button = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-mobile-nav]');

  if (!button || !nav) {
    return;
  }

  button.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });
}

function initHeroCarousel() {
  const root = document.querySelector('[data-hero]');

  if (!root) {
    return;
  }

  const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(root.querySelectorAll('[data-hero-dot]'));
  const previous = root.querySelector('[data-hero-prev]');
  const next = root.querySelector('[data-hero-next]');
  let activeIndex = 0;
  let timer = null;

  const show = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  };

  const restart = () => {
    if (timer) {
      window.clearInterval(timer);
    }

    timer = window.setInterval(() => show(activeIndex + 1), 5200);
  };

  previous?.addEventListener('click', () => {
    show(activeIndex - 1);
    restart();
  });

  next?.addEventListener('click', () => {
    show(activeIndex + 1);
    restart();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => {
      show(dotIndex);
      restart();
    });
  });

  show(0);
  restart();
}

function initHeroSearch() {
  const form = document.querySelector('[data-hero-search]');

  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('input');
    const query = input ? input.value.trim() : '';
    const target = query ? `./search.html?q=${encodeURIComponent(query)}` : './search.html';
    window.location.href = target;
  });
}

function initFilters() {
  const panel = document.querySelector('[data-filter-panel]');
  const cards = Array.from(document.querySelectorAll('[data-card]'));

  if (!panel || cards.length === 0) {
    return;
  }

  const input = panel.querySelector('[data-search-input]');
  const filters = Array.from(panel.querySelectorAll('[data-filter]'));
  const empty = document.querySelector('[data-empty-state]');
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q');

  if (input && initialQuery) {
    input.value = initialQuery;
  }

  const apply = () => {
    const query = normalize(input?.value);
    let visibleCount = 0;

    cards.forEach((card) => {
      const haystack = normalize(`${card.dataset.title} ${card.dataset.keywords}`);
      const queryMatch = !query || haystack.includes(query);
      const filterMatch = filters.every((filter) => {
        const value = normalize(filter.value);
        const key = filter.dataset.filter;
        return !value || normalize(card.dataset[key]) === value;
      });
      const visible = queryMatch && filterMatch;

      card.classList.toggle('is-hidden', !visible);

      if (visible) {
        visibleCount += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', visibleCount === 0);
    }
  };

  input?.addEventListener('input', apply);
  filters.forEach((filter) => filter.addEventListener('change', apply));
  apply();
}

ready(() => {
  initMobileNav();
  initHeroCarousel();
  initHeroSearch();
  initFilters();
});
