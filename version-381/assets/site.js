(function () {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let slideIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, current) {
      slide.classList.toggle('is-active', current === slideIndex);
    });
    dots.forEach(function (dot, current) {
      dot.classList.toggle('is-active', current === slideIndex);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    setInterval(function () {
      showSlide(slideIndex + 1);
    }, 5200);
  }

  const panel = document.querySelector('[data-filter-panel]');
  if (panel) {
    const searchInput = panel.querySelector('[data-search-input]');
    const yearFilter = panel.querySelector('[data-year-filter]');
    const typeFilter = panel.querySelector('[data-type-filter]');
    const cards = Array.from(document.querySelectorAll('[data-card]'));
    const empty = document.querySelector('[data-empty-state]');

    function applyFilters() {
      const keyword = (searchInput && searchInput.value || '').trim().toLowerCase();
      const year = yearFilter && yearFilter.value || '';
      const type = typeFilter && typeFilter.value || '';
      let visible = 0;

      cards.forEach(function (card) {
        const haystack = [card.dataset.title, card.dataset.tags, card.dataset.year, card.dataset.type].join(' ').toLowerCase();
        const matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        const matchesYear = !year || card.dataset.year === year;
        const matchesType = !type || card.dataset.type === type;
        const shouldShow = matchesKeyword && matchesYear && matchesType;
        card.style.display = shouldShow ? '' : 'none';
        if (shouldShow) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [searchInput, yearFilter, typeFilter].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });
  }
})();
