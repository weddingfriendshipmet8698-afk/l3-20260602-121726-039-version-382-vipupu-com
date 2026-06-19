(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function initMenu() {
        var toggle = document.querySelector(".menu-toggle");
        var panel = document.querySelector(".mobile-panel");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            var expanded = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!expanded));
            panel.hidden = expanded;
            toggle.textContent = expanded ? "☰" : "×";
        });
    }

    function initHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var prev = document.querySelector("[data-hero-prev]");
        var next = document.querySelector("[data-hero-next]");
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function restart() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                restart();
            });
        }

        restart();
    }

    function initLocalFilters() {
        var input = document.querySelector("[data-filter-input]");
        var scope = document.querySelector("[data-filter-scope]");
        if (!input || !scope) {
            return;
        }
        var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
        input.addEventListener("input", function () {
            var query = normalize(input.value);
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-tags"),
                    card.getAttribute("data-genre")
                ].join(" "));
                card.classList.toggle("is-hidden-card", query && haystack.indexOf(query) === -1);
            });
        });
    }

    function movieCard(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");
        return [
            "<a class="movie-card" href="" + escapeHtml(movie.url) + "">",
            "<span class="poster-frame">",
            "<img src="" + escapeHtml(movie.cover) + "" alt="" + escapeHtml(movie.title) + "" loading="lazy">",
            "<span class="poster-gradient"></span>",
            "<span class="poster-badge poster-badge-top">" + escapeHtml(movie.region) + "</span>",
            "<span class="poster-badge poster-badge-bottom">" + escapeHtml(movie.genre) + "</span>",
            "</span>",
            "<span class="movie-card-body">",
            "<strong>" + escapeHtml(movie.title) + "</strong>",
            "<em>" + escapeHtml(movie.oneLine) + "</em>",
            "<span class="tag-row">" + tags + "</span>",
            "<span class="movie-meta-line"><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.year) + "</span></span>",
            "</span>",
            "</a>"
        ].join("");
    }

    function initSearchPage() {
        var input = document.getElementById("searchInput");
        var button = document.getElementById("searchButton");
        var grid = document.getElementById("searchResults");
        var status = document.getElementById("searchStatus");
        if (!input || !grid || typeof MovieSearchIndex === "undefined") {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q") || "";
        input.value = initial;

        function run() {
            var query = normalize(input.value);
            var items = MovieSearchIndex;
            var filtered = query ? items.filter(function (movie) {
                var haystack = normalize([
                    movie.title,
                    movie.region,
                    movie.year,
                    movie.genre,
                    movie.tags.join(" "),
                    movie.oneLine
                ].join(" "));
                return haystack.indexOf(query) !== -1;
            }) : items.slice(0, 60);
            if (status) {
                status.textContent = query ? "搜索结果" : "热门影片";
            }
            grid.innerHTML = filtered.slice(0, 120).map(movieCard).join("");
        }

        input.addEventListener("input", run);
        if (button) {
            button.addEventListener("click", run);
        }
        run();
    }

    ready(function () {
        initMenu();
        initHero();
        initLocalFilters();
        initSearchPage();
    });
})();
