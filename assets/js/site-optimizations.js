(function () {
    "use strict";

    function optimiseImages() {
        document.querySelectorAll("img").forEach(function (image) {
            image.decoding = "async";

            var isPriorityImage = image.loading === "eager" || image.fetchPriority === "high";
            if (!isPriorityImage && !image.loading) image.loading = "lazy";

            if (!image.alt) {
                image.alt = image.dataset.alt || "Al-Imam Malick Islamic Institute";
            }
        });
    }

    function initialiseCookieConsent() {
        var popup = document.getElementById("ndsCookiesPopup");
        var acceptButton = document.getElementById("ndsCookiesAcceptBtn");
        var declineButton = document.getElementById("ndsCookiesDeclineBtn");
        var closeButton = document.getElementById("ndsCookiesCloseBtn");
        if (!popup || !acceptButton || !declineButton || !closeButton) return;

        if (!localStorage.getItem("imamMalikCookiesChoice")) {
            window.setTimeout(function () { popup.hidden = false; }, 2000);
        }

        function choose(choice) {
            localStorage.setItem("imamMalikCookiesChoice", choice);
            popup.hidden = true;
        }

        acceptButton.addEventListener("click", function () { choose("accepted"); });
        declineButton.addEventListener("click", function () { choose("declined"); });
        closeButton.addEventListener("click", function () { popup.hidden = true; });
    }

    document.addEventListener("DOMContentLoaded", function () {
        optimiseImages();
        initialiseCookieConsent();
    });
})();