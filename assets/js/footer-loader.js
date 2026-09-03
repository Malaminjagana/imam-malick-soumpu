(function () {
    "use strict";

    var footerUrl = "/components/footer.html";
    var styleUrl = "/assets/css/footer.css";
    var i18nUrl = "/i18n.js";
    var ndsStyles = [
        "https://cdn.iu.edu.sa/NDS-iu/v110/assets/css/nds-main.min.css?ver=1.069",
        "https://cdn.iu.edu.sa/NDS-iu/v110/assets/css/nds-icons.min.css?ver=1.000",
        "https://cdn.iu.edu.sa/NDS-iu/v110/assets/css/hgi-rounded-stroke-min.css?ver=1.003"
    ];

    function loadScript(url, attribute) {
        return new Promise(function (resolve, reject) {
            var existing = document.querySelector("script[" + attribute + "]");
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
        if (document.querySelector('link[data-footer-styles]')) return;
        ndsStyles.forEach(function (url) {
            if (document.querySelector('link[href="' + url + '"]')) return;
            var ndsStylesheet = document.createElement("link");
            ndsStylesheet.rel = "stylesheet";
            ndsStylesheet.href = url;
            ndsStylesheet.dataset.footerNdsStyles = "";
            document.head.appendChild(ndsStylesheet);
        });
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
            return loadScript("/lib/donationAccounts.js", "data-donation-accounts")
                .then(function () { return loadScript("/lib/donationModal.js", "data-donation-modal"); })
                .then(function () { window.initialiseDonationModal(); })
                .then(function () { return loadScript(i18nUrl, "data-footer-i18n"); });
        })
        .then(function () {
            if (window.setLanguage) return window.setLanguage(localStorage.getItem("site-language") === "ar" ? "ar" : "en");
        })
        .catch(function (error) { console.error("Footer loading failed:", error); });
})();