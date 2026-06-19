(function () {
  var body = document.body;
  var toggle = document.querySelector('[data-menu-toggle]');
  if (toggle) {
    toggle.addEventListener('click', function () {
      body.classList.toggle('menu-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterSelect = document.querySelector('[data-filter-select]');
  var filterReset = document.querySelector('[data-filter-reset]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-area] .movie-card'));

  function filterCards() {
    var text = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var category = filterSelect ? filterSelect.value : '';
    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-region') || '',
        card.getAttribute('data-year') || '',
        card.getAttribute('data-genre') || ''
      ].join(' ').toLowerCase();
      var matchText = !text || haystack.indexOf(text) > -1;
      var matchCategory = !category || card.getAttribute('data-category') === category;
      card.classList.toggle('is-hidden', !(matchText && matchCategory));
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', filterCards);
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', filterCards);
  }

  if (filterReset) {
    filterReset.addEventListener('click', function () {
      if (filterInput) {
        filterInput.value = '';
      }
      if (filterSelect) {
        filterSelect.value = '';
      }
      filterCards();
    });
  }

  var player = document.getElementById('player');
  var trigger = document.querySelector('[data-player-trigger]');
  if (player && trigger) {
    var loaded = false;
    function loadPlayer() {
      if (loaded) {
        return Promise.resolve();
      }
      var source = player.getAttribute('data-video');
      if (!source) {
        return Promise.resolve();
      }
      if (player.canPlayType('application/vnd.apple.mpegurl')) {
        player.src = source;
        loaded = true;
        return Promise.resolve();
      }
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(player);
        loaded = true;
        return new Promise(function (resolve) {
          hls.on(window.Hls.Events.MANIFEST_PARSED, resolve);
          window.setTimeout(resolve, 1200);
        });
      }
      player.src = source;
      loaded = true;
      return Promise.resolve();
    }

    function play() {
      loadPlayer().then(function () {
        trigger.hidden = true;
        var promise = player.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            trigger.hidden = false;
          });
        }
      });
    }

    trigger.addEventListener('click', play);
    player.addEventListener('play', function () {
      trigger.hidden = true;
    });
  }
})();
