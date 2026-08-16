(() => {
    "use strict";

    // Add a new object here to make another page or section searchable.
    const searchIndex = [
        { title: "Imam Malick Islamic Institute", keywords: ["home", "school", "islamic institute", "imam malick", "imam malik"], url: "/index.html" },
        { title: "Why Choose Imam Malick Islamic Institute?", keywords: ["why choose", "about", "education", "islamic values", "tahfiz"], url: "/index.html#whyIU" },
        { title: "About the Institute", keywords: ["about", "imam malick", "school", "mission", "vision"], url: "/index.html#aboutIU" },
        { title: "Graduates and Alumni", keywords: ["graduates", "alumni", "tahfiz", "school rolls"], url: "/index.html#AlumaniMap" },
        { title: "Scholars and Teachers", keywords: ["scholars", "teachers", "biographies", "staff", "faculty"], url: "/index.html#success-stories" },
        { title: "School Departments", keywords: ["departments", "department", "teaching departments", "academic departments", "faculty"], url: "/index.html#academic-programs" },
        { title: "Academic Programs", keywords: ["academic", "programs", "elementary", "preparatory", "high school", "tahfiz", "quran"], url: "/academic-programs.html" },
        { title: "Academic Programs Overview", keywords: ["academic programs", "courses", "curriculum", "education"], url: "/index.html#academic-programs" },
        { title: "School History", keywords: ["history", "school history", "samboudoukati", "kanifing", "banjul", "imam malik"], url: "/school-history/index.html" },
        { title: "School Admissions and Rolls", keywords: ["admission", "admissions", "school rolls", "registration", "enrollment", "students"], url: "/school-rolls.html" },
        { title: "Frequently Asked Questions", keywords: ["faq", "questions", "help", "information"], url: "/faq.html" },
        { title: "Privacy Policy", keywords: ["privacy", "policy", "data", "cookies"], url: "/privacy.html" },
        { title: "Terms and Conditions", keywords: ["terms", "conditions", "rules"], url: "/terms.html" },
        { title: "Security", keywords: ["security", "website security", "safety"], url: "/security.html" },
        { title: "Dr. Ali Jagana", keywords: ["ali", "jagana", "jigna", "dr ali", "biography", "scholar", "hadith", "islamic studies", "researcher", "author"], url: "/biography/dr-ali-jagana.html" },
        { title: "Dr. Fodi Jagana", keywords: ["fodi", "jagana", "dr fodi", "biography", "scholar", "fiqh", "sharia", "author", "lecturer"], url: "/biography/dr-fodi-jagana.html" },
        { title: "Dr. Kisma Sheikh Sahoo", keywords: ["kisma", "sahoo", "sheikh sahoo", "biography", "scholar", "fiqh", "educator", "researcher"], url: "/biography/dr-kisma-sahoo.html" },
        { title: "Dr. Suleiman Kamara", keywords: ["suleiman", "kamara", "dr suleiman", "biography", "scholar", "teacher"], url: "/biography/dr-suleiman-kamara.html" },
        { title: "Baguri Kisma Sangare", keywords: ["baguri", "kisma", "sangare", "biography", "scholar", "teacher"], url: "/biography/baguri_kisma_sangare.html" },
        { title: "Ebrahima Marry Jagana", keywords: ["ebrahima", "ibrahim", "marry", "mari", "jagana", "biography", "scholar", "service"], url: "/biography/Ebrahim-Marry-Jagana.html" },
        { title: "Jaafar Fodi Gumani", keywords: ["jaafar", "fodi", "gumani", "biography", "scholar", "teacher", "daiyah", "sharia"], url: "/biography/jaafar_fodi_gumani.html" },
        { title: "Malamin Zakaria Jagana", keywords: ["malamin", "zakaria", "jagana", "biography", "scholar", "teacher"], url: "/biography/Malamin-zakaria-jagana.html" },
        { title: "Muhammad Issa Haydar", keywords: ["muhammad", "issa", "haydar", "biography", "scholar", "teacher"], url: "/biography/muhammad_issa_haydar.html" },
        { title: "Muhammad Jola Camara", keywords: ["muhammad", "jola", "camara", "biography", "scholar", "teacher"], url: "/biography/muhammad_jola_camara.html" },
        { title: "Muhammad Kaowjed Camara", keywords: ["muhammad", "kaowjed", "camara", "biography", "scholar", "teacher"], url: "/biography/muhammad_kaowjed_camara.html" },
        { title: "Muhammad Muhammad Touray", keywords: ["muhammad", "touray", "biography", "scholar", "teacher", "preacher", "al azhar", "english department"], url: "/biography/muhammad_muhammad_touray.html" },
        { title: "Muhammad Kaba Musa", keywords: ["muhammad", "kaba", "musa", "biography", "scholar", "director", "teacher"], url: "/biography/Muhammad-Kaba-Musa.html" },
        { title: "Musa Muhammad Jibo", keywords: ["musa", "muhammad", "jibo", "biography", "scholar", "teacher"], url: "/biography/musa_muhammad_jibo.html" },
        { title: "Omar Issa Dukureh", keywords: ["omar", "issa", "dukureh", "biography", "scholar", "teacher"], url: "/biography/omar_issa_dukureh.html" },
        { title: "Shondi Muhammad Samba Dramme", keywords: ["shondi", "muhammad", "samba", "dramme", "drammeh", "shiek drameh", "biography", "scholar", "dawah"], url: "/biography/shiek-drameh.html" },
        { title: "University Information", keywords: ["university", "islamic university", "academic information"], url: "/university/index%20copy.html" }
    ];

    const scriptUrl = document.currentScript ? document.currentScript.src : window.location.href;
    const siteRoot = new URL(".", scriptUrl);

    function normalise(value) {
        return value.toLocaleLowerCase().trim().replace(/\s+/g, " ");
    }

    function findMatches(query) {
        const terms = normalise(query).split(" ").filter(Boolean);
        if (!terms.length) {
            return [];
        }

        return searchIndex
            .map((item) => {
                const title = normalise(item.title);
                const keywords = normalise(item.keywords.join(" "));
                const score = terms.reduce((total, term) => {
                    if (title === term) {
                        return total + 100;
                    }
                    if (title.includes(term)) {
                        return total + 30;
                    }
                    if (keywords.split(" ").includes(term)) {
                        return total + 20;
                    }
                    return keywords.includes(term) ? total + 10 : total;
                }, 0);
                return { item, score, matchedTerms: terms.filter((term) => title.includes(term) || keywords.includes(term)).length };
            })
            .filter(({ matchedTerms }) => matchedTerms === terms.length)
            .sort((left, right) => right.score - left.score || left.item.title.localeCompare(right.item.title))
            .map(({ item }) => item);
    }

    function getUrl(path) {
        return new URL(path.replace(/^\/+/, ""), siteRoot).href;
    }

    function getResultsUrl(query) {
        const url = new URL("search-results.html", siteRoot);
        url.searchParams.set("q", query);
        return url.href;
    }

    function createSuggestionsContainer(input) {
        const container = document.createElement("div");
        container.className = "site-search-suggestions";
        container.setAttribute("role", "listbox");
        container.hidden = true;
        input.closest(".nds-form-control")?.append(container);
        return container;
    }

    function showSuggestions(container, query) {
        const matches = findMatches(query).slice(0, 5);
        container.replaceChildren();
        container.hidden = false;

        if (!normalise(query)) {
            container.hidden = true;
            return;
        }

        if (!matches.length) {
            const message = document.createElement("p");
            message.className = "site-search-empty";
            message.textContent = "No results found";
            container.append(message);
            return;
        }

        matches.forEach((item) => {
            const link = document.createElement("a");
            link.href = getUrl(item.url);
            link.className = "site-search-suggestion";
            link.setAttribute("role", "option");
            link.textContent = item.title;
            container.append(link);
        });
    }

    function attachSearch(input, form) {
        const suggestions = createSuggestionsContainer(input);

        input.addEventListener("input", () => showSuggestions(suggestions, input.value));
        input.addEventListener("keydown", (event) => {
            if (event.key !== "Enter") {
                return;
            }

            event.preventDefault();
            const firstMatch = findMatches(input.value)[0];
            if (firstMatch) {
                window.location.assign(getUrl(firstMatch.url));
            } else {
                showSuggestions(suggestions, input.value);
            }
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            window.location.assign(getResultsUrl(input.value));
        });

        form.querySelector(".nds-search-btn")?.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.assign(getResultsUrl(input.value));
        });
    }

    function addSearchToStandalonePage() {
        const launcher = document.createElement("button");
        launcher.type = "button";
        launcher.className = "site-search-launcher";
        launcher.textContent = "Search site";
        launcher.setAttribute("aria-label", "Search the school website");

        const dialog = document.createElement("div");
        dialog.className = "site-search-dialog";
        dialog.hidden = true;
        dialog.innerHTML = `
            <form class="site-search-form" role="search">
                <label for="mainSearch">Search the school website</label>
                <div class="nds-form-control">
                    <input id="mainSearch" class="nds-search-input" type="search" placeholder="Search in School Website..." autocomplete="off">
                </div>
                <button class="nds-search-btn" type="submit">Search</button>
                <button class="site-search-close" type="button" aria-label="Close search">Close</button>
            </form>`;

        launcher.addEventListener("click", () => {
            dialog.hidden = false;
            dialog.querySelector("#mainSearch").focus();
        });
        dialog.querySelector(".site-search-close").addEventListener("click", () => {
            dialog.hidden = true;
            launcher.focus();
        });

        document.body.append(launcher, dialog);
        attachSearch(dialog.querySelector("#mainSearch"), dialog.querySelector("form"));
    }

    function renderResultsPage() {
        const target = document.querySelector("[data-search-results]");
        if (!target) {
            return;
        }

        const query = new URLSearchParams(window.location.search).get("q") || "";
        const input = document.querySelector("#resultsSearch");
        const form = input?.closest("form");
        const matches = findMatches(query);

        document.title = query ? `Search: ${query} | Imam Malick Islamic Institute` : "Search | Imam Malick Islamic Institute";
        target.replaceChildren();

        const heading = document.createElement("h1");
        heading.textContent = query ? `Search results for "${query}"` : "Search the school website";
        target.append(heading);

        if (!query || !matches.length) {
            const message = document.createElement("p");
            message.className = "search-results-empty";
            message.textContent = query ? "No results found" : "Enter a word or name to search the website.";
            target.append(message);
        } else {
            const list = document.createElement("ul");
            list.className = "search-results-list";
            matches.forEach((item) => {
                const result = document.createElement("li");
                const link = document.createElement("a");
                link.href = getUrl(item.url);
                link.textContent = item.title;
                const keywords = document.createElement("p");
                keywords.textContent = item.keywords.join(" | ");
                result.append(link, keywords);
                list.append(result);
            });
            target.append(list);
        }

        if (input && form) {
            input.value = query;
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                window.location.assign(getResultsUrl(input.value));
            });
        }
    }

    function addStyles() {
        const styles = document.createElement("style");
        styles.textContent = `
            .nds-form-control { position: relative; }
            .site-search-suggestions { position: absolute; z-index: 1000; top: calc(100% + 6px); left: 0; right: 0; max-height: 260px; overflow-y: auto; background: #fff; border: 1px solid #d6d6d6; box-shadow: 0 8px 22px rgba(0, 0, 0, .16); }
            .site-search-suggestion, .site-search-empty { display: block; margin: 0; padding: 10px 12px; color: #163b2c; font: 600 14px/1.35 Arial, sans-serif; text-decoration: none; }
            .site-search-suggestion:hover, .site-search-suggestion:focus { background: #edf7f1; }
            .site-search-empty { color: #666; font-weight: 400; }
            .site-search-launcher { position: fixed; z-index: 1000; right: 20px; bottom: 20px; border: 0; border-radius: 4px; padding: 11px 15px; background: #176b4d; color: #fff; font: 700 14px/1 Arial, sans-serif; cursor: pointer; box-shadow: 0 4px 14px rgba(0, 0, 0, .2); }
            .site-search-dialog { position: fixed; z-index: 1001; top: 20px; right: 20px; width: min(440px, calc(100% - 40px)); padding: 18px; background: #fff; border: 1px solid #d6d6d6; box-shadow: 0 10px 30px rgba(0, 0, 0, .25); }
            .site-search-form { display: grid; gap: 10px; }
            .site-search-form label { color: #163b2c; font: 700 16px/1.35 Arial, sans-serif; }
            .site-search-form input { width: 100%; padding: 10px; border: 1px solid #87938e; }
            .site-search-form button { width: fit-content; padding: 9px 13px; border: 0; border-radius: 3px; cursor: pointer; }
            .site-search-form .nds-search-btn { background: #176b4d; color: #fff; }
            .site-search-close { background: #eee; color: #222; }
        `;
        document.head.append(styles);
    }

    addStyles();
    renderResultsPage();

    const mainSearch = document.querySelector("#mainSearch");
    if (mainSearch) {
        attachSearch(mainSearch, mainSearch.closest("form"));
    } else if (!document.querySelector("[data-search-results]")) {
        addSearchToStandalonePage();
    }

    window.schoolSearchIndex = searchIndex;
})();
