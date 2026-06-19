(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function setupMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.mobile-nav');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    if (slides.length <= 1) return;
    var index = 0;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-slide') || 0));
      });
    });

    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function setupFilter() {
    var input = document.querySelector('.page-filter');
    var list = document.querySelector('[data-filter-list]');
    if (!input || !list) return;
    var cards = Array.prototype.slice.call(list.children);
    var state = document.getElementById('searchState');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    if (initial) input.value = initial;

    function apply() {
      var q = input.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
        var matched = !q || haystack.indexOf(q) !== -1;
        card.classList.toggle('is-hidden-by-filter', !matched);
        if (matched) visible += 1;
      });
      if (state) {
        state.textContent = q ? '匹配 ' + visible + ' 条' : '输入后自动筛选';
      }
    }

    input.addEventListener('input', apply);
    apply();
  }

  function setupPlayer() {
    var video = document.querySelector('.video-player');
    var button = document.querySelector('.play-overlay');
    if (!video) return;
    var src = video.getAttribute('data-m3u8');
    var started = false;

    function load() {
      if (!src || started) return;
      started = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }
    }

    function play() {
      load();
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
      if (button) button.classList.add('is-hidden');
    }

    if (button) {
      button.addEventListener('click', play);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });
    video.addEventListener('play', function () {
      if (button) button.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
      if (button && video.currentTime === 0) button.classList.remove('is-hidden');
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilter();
    setupPlayer();
  });
})();
