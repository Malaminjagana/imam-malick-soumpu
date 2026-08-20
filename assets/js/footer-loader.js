(function () {
    "use strict";

    var footerUrl = "/components/footer.html";
    var styleUrl = "/assets/css/footer.css";
    var designSystemUrl = "/assets/css/imam-malick-design-system.css?v=1.0";
    var i18nUrl = "/i18n.js";

    function loadScript(url, attribute) {
        return new Promise(function (resolve, reject) {
            var existing = document.querySelector("script[" + attribute + "], script[data-site-i18n]");
            if (existing) {
                if (window.setLanguage) resolve();
                else existing.addEventListener("load", resolve, { once: true });
                return;
            }
            var script = document.createElement("script");
            script.src = url;
            script.setAttribute(attribute, "");
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function loadStyles() {
        if (!document.querySelector('link[href^="/assets/css/imam-malick-design-system.css"]')) {
            var designSystem = document.createElement("link");
            designSystem.rel = "stylesheet";
            designSystem.href = designSystemUrl;
            designSystem.dataset.imdsStyles = "";
            document.head.appendChild(designSystem);
        }
        if (document.querySelector('link[data-footer-styles]')) return;
        var stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = styleUrl;
        stylesheet.dataset.footerStyles = "";
        document.head.appendChild(stylesheet);
    }

    function initialiseDonationModal() {
        var backdrop = document.querySelector("#donateModalBackdrop");
        var closeButton = document.querySelector("#donateModalClose");
        if (!backdrop || !closeButton) return;
        closeButton.addEventListener("click", function () { backdrop.classList.remove("is-open"); });
        backdrop.addEventListener("click", function (event) { if (event.target === backdrop) backdrop.classList.remove("is-open"); });
    }

    loadStyles();
    fetch(footerUrl)
        .then(function (response) {
            if (!response.ok) throw new Error("Unable to load footer component.");
            return response.text();
        })
        .then(function (html) {
            if (document.querySelector("footer.nds-footer")) return;
            document.body.insertAdjacentHTML("beforeend", html);
            document.querySelectorAll(".copyright-year").forEach(function (element) { element.textContent = new Date().getFullYear(); });
            initialiseDonationModal();
            return loadScript(i18nUrl, "data-footer-i18n");
        })
        .then(function () {
            if (window.setLanguage) return window.setLanguage(localStorage.getItem("site-language") === "ar" ? "ar" : "en");
        })
        .catch(function (error) { console.error("Footer loading failed:", error); });
})();