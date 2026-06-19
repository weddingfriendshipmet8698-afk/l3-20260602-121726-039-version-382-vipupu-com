(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      var opened = mobileNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  if (slides.length > 1) {
    var current = 0;
    var showSlide = function (index) {
      current = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });
    setInterval(function () {
      showSlide((current + 1) % slides.length);
    }, 5200);
  }

  var searchForm = document.querySelector('[data-search-form]');
  if (searchForm) {
    var keywordInput = searchForm.querySelector('[data-search-keyword]');
    var regionSelect = searchForm.querySelector('[data-search-region]');
    var yearSelect = searchForm.querySelector('[data-search-year]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
    var runSearch = function () {
      var keyword = (keywordInput.value || '').trim().toLowerCase();
      var region = regionSelect.value || '';
      var year = yearSelect.value || '';
      cards.forEach(function (card) {
        var text = [card.dataset.title, card.dataset.genre, card.dataset.tags, card.dataset.region, card.dataset.year].join(' ').toLowerCase();
        var okKeyword = !keyword || text.indexOf(keyword) >= 0;
        var okRegion = !region || card.dataset.region.indexOf(region) >= 0;
        var okYear = !year || card.dataset.year === year;
        card.classList.toggle('hidden-card', !(okKeyword && okRegion && okYear));
      });
    };
    keywordInput.addEventListener('input', runSearch);
    regionSelect.addEventListener('change', runSearch);
    yearSelect.addEventListener('change', runSearch);
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      runSearch();
    });
  }
})();
