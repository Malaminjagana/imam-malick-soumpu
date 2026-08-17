(() => {
    "use strict";

    const scriptUrl = document.currentScript ? document.currentScript.src : window.location.href;
    const siteRoot = new URL(".", scriptUrl);
    const dictionaries = {};
    let activeLanguage = localStorage.getItem("site-language") === "ar" ? "ar" : "en";

    function loadI18n() {
        if (window.setLanguage) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const existing = document.querySelector('script[data-site-i18n]');
            if (existing) {
                existing.addEventListener("load", resolve, { once: true });
                existing.addEventListener("error", reject, { once: true });
                return;
            }
            const script = document.createElement("script");
            script.src = new URL("i18n.js", scriptUrl).href;
            script.dataset.siteI18n = "true";
            script.onload = resolve;
            script.onerror = () => reject(new Error("Unable to load i18n.js."));
            document.head.append(script);
        });
    }

    const pages = [
        ["index", "/index.html", "Imam Malick Islamic Institute", ["home", "school", "imam malick", "الإمام مالك", "المعهد"]],
        ["academic_programs", "/academic-programs.html", "Academic Programs", ["academic", "programs", "tahfiz", "quran", "البرامج الأكاديمية", "تحفيظ", "القرآن"]],
        ["school_history_index", "/school-history/index.html", "School History", ["history", "samboudoukati", "تاريخ المدرسة", "سمبودوكاتي"]],
        ["school_rolls", "/school-rolls.html", "School Admissions and Rolls", ["admission", "enrollment", "registration", "القبول", "التسجيل"]],
        ["faq", "/faq.html", "Frequently Asked Questions", ["faq", "questions", "الأسئلة الشائعة"]],
        ["privacy", "/privacy.html", "Privacy Policy", ["privacy", "cookies", "الخصوصية"]],
        ["terms", "/terms.html", "Terms and Conditions", ["terms", "conditions", "الشروط والأحكام"]],
        ["security", "/security.html", "Information Security Policy", ["security", "الأمن", "أمن المعلومات"]],
        ["university_index_copy", "/university/index%20copy.html", "University Information", ["university", "الجامعة"]],
        ["biography_dr_ali_jagana", "/biography/dr-ali-jagana.html", "Dr. Ali Jagana", ["ali", "jagana", "علي", "جغنا"]],
        ["biography_dr_fodi_jagana", "/biography/dr-fodi-jagana.html", "Dr. Fodi Jagana", ["fodi", "jagana", "فودي", "جغنا"]],
        ["biography_dr_kisma_sahoo", "/biography/dr-kisma-sahoo.html", "Dr. Kisma Sheikh Sahoo", ["kisma", "sahoo", "كسما", "ساغو"]],
        ["biography_dr_suleiman_kamara", "/biography/dr-suleiman-kamara.html", "Dr. Suleiman Muhammad Kamara", ["suleiman", "kamara", "سليمان", "كمارا"]],
        ["biography_baguri_kisma_sangare", "/biography/baguri_kisma_sangare.html", "Baguri Kisma Sangare", ["baguri", "sangare", "باغوري", "سنقاري"]],
        ["biography_ebrahim_marry_jagana", "/biography/Ebrahim-Marry-Jagana.html", "Ebrahima Marry Jagana", ["ebrahima", "marry", "jagana", "إبراهيم", "مري", "جغنا"]],
        ["biography_jaafar_fodi_gumani", "/biography/jaafar_fodi_gumani.html", "Jaafar Fodi Gumani", ["jaafar", "gumani", "جعفره", "غوماني"]],
        ["biography_malamin_zakaria_jagana", "/biography/Malamin-zakaria-jagana.html", "Malamin Zakaria Jagana", ["malamin", "zakaria", "jagana", "ملامين", "زكريا", "جغنا"]],
        ["biography_muhammad_issa_haydar", "/biography/muhammad_issa_haydar.html", "Muhammad Issa Haydar", ["issa", "haydar", "محمد عيسى", "حيدري"]],
        ["biography_muhammad_jola_camara", "/biography/muhammad_jola_camara.html", "Muhammad Jola Kamara", ["jola", "camara", "كمارا", "جولا"]],
        ["biography_muhammad_kaowjed_camara", "/biography/muhammad_kaowjed_camara.html", "Muhammad Kaowjed Kamara", ["kaowjed", "camara", "كاوجد", "كمارا"]],
        ["biography_muhammad_muhammad_touray", "/biography/muhammad_muhammad_touray.html", "Muhammad Muhammad Touray", ["touray", "محمد", "توراي"]],
        ["biography_muhammad_kaba_musa", "/biography/Muhammad-Kaba-Musa.html", "Muhammad Kaba Musa", ["kaba", "musa", "محمد كاباموسى"]],
        ["biography_musa_muhammad_jibo", "/biography/musa_muhammad_jibo.html", "Musa Muhammad Jibo", ["jibo", "موسى", "جيبو"]],
        ["biography_omar_issa_dukureh", "/biography/omar_issa_dukureh.html", "Omar Issa Dukureh", ["omar", "dukureh", "عمر", "دكوري"]],
        ["biography_shiek_drameh", "/biography/shiek-drameh.html", "Sheikh Shondi Muhammad Samba Drammeh", ["shondi", "samba", "drammeh", "شوندي", "صمب", "درامي"]]
    ].map(([key, url, fallbackTitle, aliases]) => ({ key, url, fallbackTitle, aliases }));

    function getValue(source, key) {
        return key.split(".").reduce((value, part) => value && value[part], source);
    }

    function flatten(value) {
        return typeof value === "string" ? [value] : Object.values(value || {}).flatMap(flatten);
    }

    function normalise(value) {
        return String(value || "").toLocaleLowerCase().normalize("NFD")
            .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
            .replace(/[إأآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
            .replace(/ؤ/g, "و").replace(/ئ/g, "ي")
            .replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
    }

    function translate(key, fallback) {
        return getValue(dictionaries[activeLanguage], key) || fallback;
    }

    function titleFor(page) {
        return getValue(dictionaries[activeLanguage], `pages.${page.key}.pageTitle`) ||
            getValue(dictionaries[activeLanguage], `pages.${page.key}.text003`) || page.fallbackTitle;
    }

    function indexedText(page) {
        return [page.fallbackTitle, ...page.aliases,
            ...flatten(getValue(dictionaries.en, `pages.${page.key}`)),
            ...flatten(getValue(dictionaries.ar, `pages.${page.key}`))].join(" ");
    }

    function findMatches(query) {
        const terms = normalise(query).split(" ").filter(Boolean);
        if (!terms.length) return [];
        return pages.map((page) => {
            const source = normalise(indexedText(page));
            const title = normalise(titleFor(page));
            const matches = terms.filter((term) => source.includes(term));
            return { page, matches: matches.length, score: matches.reduce((score, term) => score + (title.includes(term) ? 30 : 10), 0) };
        }).filter((result) => result.matches === terms.length)
            .sort((left, right) => right.score - left.score || titleFor(left.page).localeCompare(titleFor(right.page)))
            .map((result) => result.page);
    }

    function getUrl(path) {
        return new URL(path.replace(/^\/+/, ""), siteRoot).href;
    }

    function getResultsUrl(query) {
        const url = new URL("search-results.html", siteRoot);
        url.searchParams.set("q", query);
        return url.href;
    }

    function showSuggestions(container, query) {
        const matches = findMatches(query).slice(0, 5);
        container.replaceChildren();
        container.hidden = normalise(query).length === 0;
        if (container.hidden) return;
        if (!matches.length) {
            const message = document.createElement("p");
            message.className = "site-search-empty";
            message.textContent = translate("common.noResults", "No results found");
            container.append(message);
            return;
        }
        matches.forEach((page) => {
            const link = document.createElement("a");
            link.className = "site-search-suggestion";
            link.href = getUrl(page.url);
            link.setAttribute("role", "option");
            link.textContent = titleFor(page);
            container.append(link);
        });
    }

    function attachSearch(input) {
        const form = input?.closest("form");
        if (!input || !form || input.dataset.searchReady) return;
        input.dataset.searchReady = "true";
        const container = document.createElement("div");
        container.className = "site-search-suggestions";
        container.setAttribute("role", "listbox");
        container.hidden = true;
        input.closest(".nds-form-control")?.append(container);
        input.addEventListener("input", () => showSuggestions(container, input.value));
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            window.location.assign(getResultsUrl(input.value));
        });
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                window.location.assign(getResultsUrl(input.value));
            }
        });
    }

    function renderResults() {
        const target = document.querySelector("[data-search-results]");
        if (!target) return;
        const query = new URLSearchParams(window.location.search).get("q") || "";
        const matches = findMatches(query);
        target.replaceChildren();
        const heading = document.createElement("h1");
        heading.textContent = query ? `${translate("common.searchResultsFor", "Search results for")} "${query}"` : translate("common.searchWebsite", "Search the school website");
        target.append(heading);
        if (!query || !matches.length) {
            const message = document.createElement("p");
            message.className = "search-results-empty";
            message.textContent = query ? translate("common.noResults", "No results found") : translate("common.searchPrompt", "Enter a word or name to search the website.");
            target.append(message);
        } else {
            const list = document.createElement("ul");
            list.className = "search-results-list";
            matches.forEach((page) => {
                const item = document.createElement("li");
                const link = document.createElement("a");
                link.href = getUrl(page.url);
                link.textContent = titleFor(page);
                item.append(link);
                list.append(item);
            });
            target.append(list);
        }
        const input = document.querySelector("#resultsSearch");
        if (input) input.value = query;
    }

    async function initialise() {
        try {
            await loadI18n();
            await Promise.all(["en", "ar"].map(async (language) => {
                const response = await fetch(new URL(`languages/${language}.json`, siteRoot));
                if (!response.ok) throw new Error(`Unable to load ${language} search dictionary.`);
                dictionaries[language] = await response.json();
            }));
            const style = document.createElement("style");
            style.textContent = ".nds-form-control{position:relative}.site-search-suggestions{position:absolute;z-index:1000;top:calc(100% + 6px);inset-inline:0;max-height:260px;overflow-y:auto;background:#fff;border:1px solid #d6d6d6;box-shadow:0 8px 22px rgba(0,0,0,.16)}.site-search-suggestion,.site-search-empty{display:block;margin:0;padding:10px 12px;color:#163b2c;font:600 14px/1.35 Arial,sans-serif;text-decoration:none}.site-search-suggestion:hover,.site-search-suggestion:focus{background:#edf7f1}.site-search-empty{color:#666;font-weight:400}";
            document.head.append(style);
            attachSearch(document.querySelector("#mainSearch, #resultsSearch"));
            renderResults();
            window.schoolSearchIndex = pages;
        } catch (error) {
            console.error("Search initialisation failed:", error);
        }
    }

    document.addEventListener("site-language-change", (event) => {
        activeLanguage = event.detail.language;
        renderResults();
    });
    initialise();
})();