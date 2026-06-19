(function () {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav-links");

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll(".hero-dots button"));
    let heroIndex = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        heroIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, current) {
            slide.classList.toggle("active", current === heroIndex);
        });
        dots.forEach(function (dot, current) {
            dot.classList.toggle("active", current === heroIndex);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(heroIndex + 1);
        }, 5200);
    }

    const filterForms = Array.from(document.querySelectorAll("[data-filter-form]"));

    filterForms.forEach(function (form) {
        const input = form.querySelector("[data-filter-input]");
        const select = form.querySelector("[data-filter-select]");
        const clear = form.querySelector("[data-filter-clear]");
        const scope = document.querySelector(form.getAttribute("data-filter-form"));
        const empty = document.querySelector(form.getAttribute("data-empty-target"));

        if (!scope || !input) {
            return;
        }

        const cards = Array.from(scope.querySelectorAll("[data-search]"));

        function applyFilter() {
            const keyword = input.value.trim().toLowerCase();
            const selected = select ? select.value : "";
            let visible = 0;

            cards.forEach(function (card) {
                const haystack = (card.getAttribute("data-search") || "").toLowerCase();
                const year = card.getAttribute("data-year") || "";
                const type = card.getAttribute("data-type") || "";
                const region = card.getAttribute("data-region") || "";
                const matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                const matchesSelect = !selected || year === selected || type === selected || region === selected || haystack.indexOf(selected.toLowerCase()) !== -1;
                const show = matchesKeyword && matchesSelect;

                card.style.display = show ? "" : "none";
                if (show) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("show", visible === 0);
            }
        }

        input.addEventListener("input", applyFilter);
        if (select) {
            select.addEventListener("change", applyFilter);
        }
        if (clear) {
            clear.addEventListener("click", function () {
                input.value = "";
                if (select) {
                    select.value = "";
                }
                applyFilter();
            });
        }
    });
}());
