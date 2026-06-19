(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var toggle = qs('[data-mobile-toggle]');
  var panel = qs('[data-mobile-panel]');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  qsa('[data-header-search]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = qs('input', form);
      var keyword = input ? input.value.trim() : '';
      var target = form.getAttribute('data-search-target') || 'search.html';
      if (keyword) {
        window.location.href = target + '?q=' + encodeURIComponent(keyword);
      } else {
        window.location.href = target;
      }
    });
  });

  var slides = qsa('[data-hero-slide]');
  var dots = qsa('[data-hero-dot]');
  if (slides.length > 1) {
    var active = 0;
    var show = function (index) {
      active = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    setInterval(function () {
      show((active + 1) % slides.length);
    }, 5200);
  }

  var searchInput = qs('[data-card-search]');
  var sortSelect = qs('[data-card-sort]');
  var resultCount = qs('[data-result-count]');
  var empty = qs('[data-empty-result]');
  var cards = qsa('[data-movie-card]');

  function applyFilters() {
    if (!cards.length) {
      return;
    }
    var keyword = (searchInput && searchInput.value || '').trim().toLowerCase();
    var visible = 0;
    cards.forEach(function (card) {
      var haystack = (card.getAttribute('data-search') || '').toLowerCase();
      var matched = !keyword || haystack.indexOf(keyword) !== -1;
      card.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });
    if (resultCount) {
      resultCount.textContent = visible;
    }
    if (empty) {
      empty.style.display = visible === 0 ? 'block' : 'none';
    }
  }

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q');
    if (initial) {
      searchInput.value = initial;
    }
    searchInput.addEventListener('input', applyFilters);
    applyFilters();
  }

  if (sortSelect && cards.length) {
    sortSelect.addEventListener('change', function () {
      var grid = qs('[data-card-grid]');
      if (!grid) {
        return;
      }
      var mode = sortSelect.value;
      var sorted = cards.slice().sort(function (a, b) {
        if (mode === 'year') {
          return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
        }
        if (mode === 'likes') {
          return Number(b.getAttribute('data-likes') || 0) - Number(a.getAttribute('data-likes') || 0);
        }
        return Number(b.getAttribute('data-views') || 0) - Number(a.getAttribute('data-views') || 0);
      });
      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
      applyFilters();
    });
  }
})();
