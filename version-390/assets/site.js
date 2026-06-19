(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function setupNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-nav-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function setupSearchForms() {
    var forms = document.querySelectorAll("[data-search-form]");
    forms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        window.location.href = "./search.html?q=" + encodeURIComponent(input.value.trim());
      });
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
        slide.setAttribute("aria-hidden", slideIndex === index ? "false" : "true");
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
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
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot") || 0));
        start();
      });
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupRows() {
    var rows = document.querySelectorAll("[data-row-scroll]");
    rows.forEach(function (row) {
      var section = row.closest(".section-block");
      if (!section) {
        return;
      }
      var left = section.querySelector("[data-scroll-left]");
      var right = section.querySelector("[data-scroll-right]");
      if (left) {
        left.addEventListener("click", function () {
          row.scrollBy({ left: -420, behavior: "smooth" });
        });
      }
      if (right) {
        right.addEventListener("click", function () {
          row.scrollBy({ left: 420, behavior: "smooth" });
        });
      }
    });
  }

  function normalize(text) {
    return (text || "").toString().toLowerCase().trim();
  }

  function setupCategoryFilters() {
    var forms = document.querySelectorAll("[data-filter-form]");
    forms.forEach(function (form) {
      var input = form.querySelector("[data-filter-input]");
      var section = form.closest("main");
      var list = section ? section.querySelector("[data-filter-list]") : null;
      var empty = section ? section.querySelector("[data-empty-state]") : null;
      if (!input || !list) {
        return;
      }
      var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
      function apply() {
        var q = normalize(input.value);
        var shown = 0;
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute("data-keywords") + " " + card.getAttribute("data-title"));
          var ok = !q || text.indexOf(q) !== -1;
          card.hidden = !ok;
          if (ok) {
            shown += 1;
          }
        });
        if (empty) {
          empty.hidden = shown !== 0;
        }
      }
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        apply();
      });
      input.addEventListener("input", apply);
    });
  }

  function setupSearchPage() {
    var list = document.querySelector("[data-search-list]");
    if (!list) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q") || "";
    var input = document.querySelector("[data-search-input]");
    var form = document.querySelector("[data-search-page-form]");
    var empty = document.querySelector("[data-empty-state]");
    var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
    if (input) {
      input.value = q;
    }
    function apply(value) {
      var term = normalize(value);
      var shown = 0;
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-keywords") + " " + card.getAttribute("data-title"));
        var ok = !term || text.indexOf(term) !== -1;
        card.hidden = !ok;
        if (ok) {
          shown += 1;
        }
      });
      if (empty) {
        empty.hidden = shown !== 0;
      }
    }
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var value = input ? input.value.trim() : "";
        var nextUrl = value ? "./search.html?q=" + encodeURIComponent(value) : "./search.html";
        window.history.replaceState({}, "", nextUrl);
        apply(value);
      });
    }
    if (input) {
      input.addEventListener("input", function () {
        apply(input.value);
      });
    }
    apply(q);
  }

  function setupPlayer() {
    var wrap = document.querySelector("[data-player]");
    if (!wrap) {
      return;
    }
    var video = wrap.querySelector("video");
    var button = wrap.querySelector(".play-layer");
    if (!video) {
      return;
    }
    var streamUrl = video.getAttribute("data-stream");
    var loaded = false;
    var hls = null;

    function attach() {
      if (loaded || !streamUrl) {
        return;
      }
      loaded = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function playToggle() {
      attach();
      if (video.paused) {
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {});
        }
      } else {
        video.pause();
      }
    }

    if (button) {
      button.addEventListener("click", playToggle);
    }
    video.addEventListener("click", playToggle);
    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("is-hidden");
      }
    });
    video.addEventListener("pause", function () {
      if (button) {
        button.classList.remove("is-hidden");
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls && hls.destroy) {
        hls.destroy();
      }
    });
  }

  ready(function () {
    setupNav();
    setupSearchForms();
    setupHero();
    setupRows();
    setupCategoryFilters();
    setupSearchPage();
    setupPlayer();
  });
})();
