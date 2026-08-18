(function () {
    "use strict";

    var supportedLanguages = ["en", "ar"];
    var script = document.currentScript;
    var siteRoot = new URL(".", script.src);
    var translations = {};

    function getValue(source, key) {
        return key.split(".").reduce(function (value, part) {
            return value && Object.prototype.hasOwnProperty.call(value, part) ? value[part] : undefined;
        }, source);
    }

    function getSavedLanguage() {
        var savedLanguage = localStorage.getItem("site-language");
        return supportedLanguages.indexOf(savedLanguage) !== -1 ? savedLanguage : "en";
    }

    function updateLanguageButtons(language) {
        document.querySelectorAll("[data-language-button]").forEach(function (button) {
            button.setAttribute("aria-pressed", String(button.dataset.languageButton === language));
        });
    }

    function renderEventsAndNews(dictionary) {
        var eventsAndNews = dictionary.eventsAndNews;
        if (!eventsAndNews) {
            return;
        }

        document.querySelectorAll("[data-events-heading]").forEach(function (heading) {
            var year = heading.dataset.eventsHeading;
            var headingText = eventsAndNews["heading" + year];
            if (typeof headingText === "string") {
                heading.textContent = headingText;
            }
        });

        document.querySelectorAll("[data-events-year]").forEach(function (list) {
            var events = eventsAndNews[list.dataset.eventsYear];
            if (!Array.isArray(events)) {
                return;
            }

            list.replaceChildren();
            events.forEach(function (event) {
                var item = document.createElement("li");
                var label = [event.date, event.type].filter(Boolean).join(" - ");
                var strong = document.createElement("strong");
                strong.textContent = label + (label && event.title ? ": " : "");
                item.appendChild(strong);
                item.appendChild(document.createTextNode(event.title || ""));

                if (Array.isArray(event.speakers)) {
                    event.speakers.forEach(function (speaker) {
                        item.appendChild(document.createElement("br"));
                        item.appendChild(document.createTextNode(speaker.name + ": " + speaker.topic));
                    });
                }

                [event.speaker, event.details, event.note, Array.isArray(event.foods) ? event.foods.join("، ") : ""].filter(Boolean).forEach(function (detail) {
                    item.appendChild(document.createElement("br"));
                    item.appendChild(document.createTextNode(detail));
                });
                list.appendChild(item);
            });
        });
    }

    function applyTranslations(language) {
        var dictionary = translations[language];
        if (!dictionary) {
            return;
        }

        document.documentElement.lang = language;
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

        document.querySelectorAll("[data-translate]").forEach(function (element) {
            var translatedText = getValue(dictionary, element.dataset.translate);
            if (typeof translatedText === "string") {
                element.textContent = translatedText;
            }
        });

        document.querySelectorAll("[data-translate-placeholder]").forEach(function (element) {
            var placeholder = getValue(dictionary, element.dataset.translatePlaceholder);
            if (typeof placeholder === "string") {
                element.placeholder = placeholder;
            }
        });

        document.querySelectorAll("[data-translate-aria-label]").forEach(function (element) {
            var ariaLabel = getValue(dictionary, element.dataset.translateAriaLabel);
            if (typeof ariaLabel === "string") {
                element.setAttribute("aria-label", ariaLabel);
            }
        });

        document.querySelectorAll("[data-translate-attr]").forEach(function (element) {
            element.dataset.translateAttr.split(";").forEach(function (entry) {
                var separator = entry.indexOf(":");
                if (separator === -1) {
                    return;
                }
                var attribute = entry.slice(0, separator);
                var attributeKey = entry.slice(separator + 1);
                var translatedValue = getValue(dictionary, attributeKey);
                if (typeof translatedValue === "string") {
                    element.setAttribute(attribute, translatedValue);
                }
            });
        });

        var titleKey = document.documentElement.dataset.translateTitle;
        var title = titleKey && getValue(dictionary, titleKey);
        if (typeof title === "string") {
            document.title = title;
        }

        renderEventsAndNews(dictionary);
        updateLanguageButtons(language);
        document.dispatchEvent(new CustomEvent("site-language-change", { detail: { language: language, dictionary: dictionary } }));
    }

    function createLanguageSwitcher() {
        if (document.querySelector("[data-language-switcher]")) {
            return;
        }

        var switcher = document.createElement("div");
        switcher.className = "site-language-switcher";
        switcher.dataset.languageSwitcher = "";
        switcher.setAttribute("role", "group");
        switcher.setAttribute("aria-label", "Language selection");
        switcher.innerHTML = [
            '<button type="button" data-language-button="en" onclick="setLanguage(\'en\')">English</button>',
            '<button type="button" data-language-button="ar" onclick="setLanguage(\'ar\')">العربية</button>'
        ].join("");

        var target = document.querySelector(".nds-nav-container, .nav-container, .site-header");
        if (target) {
            target.appendChild(switcher);
        } else {
            document.body.prepend(switcher);
            switcher.classList.add("site-language-switcher-floating");
        }
    }

    function addStyles() {
        var styles = document.createElement("style");
        styles.textContent = [
            '.site-language-switcher { display: inline-flex; align-items: center; gap: 2px; margin-inline-start: 12px; padding: 3px; border: 1px solid #c9d6ce; border-radius: 4px; background: #fff; }',
            '.site-language-switcher button { appearance: none; border: 0; border-radius: 2px; padding: 7px 9px; background: transparent; color: #183128; font: 700 13px/1.2 Arial, sans-serif; cursor: pointer; }',
            '.site-language-switcher button[aria-pressed="true"] { background: #176b4d; color: #fff; }',
            '.site-language-switcher-floating { position: fixed; z-index: 10000; top: 16px; inset-inline-end: 16px; box-shadow: 0 4px 14px rgba(0, 0, 0, .16); }',
            'html[dir="rtl"] body { text-align: right; }'
        ].join("\n");
        document.head.appendChild(styles);
    }

    window.setLanguage = function (language) {
        if (supportedLanguages.indexOf(language) === -1) {
            return Promise.reject(new Error("Unsupported language: " + language));
        }

        return fetch(new URL("languages/" + language + ".json", siteRoot))
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Unable to load " + language + " translations.");
                }
                return response.json();
            })
            .then(function (dictionary) {
                translations[language] = dictionary;
                localStorage.setItem("site-language", language);
                applyTranslations(language);
            })
            .catch(function (error) {
                console.error("Translation loading failed:", error);
            });
    };

    addStyles();
    createLanguageSwitcher();
    window.setLanguage(getSavedLanguage());
})();