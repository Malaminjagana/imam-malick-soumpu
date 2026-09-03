(function () {
    "use strict";

    var fallbackCopy = {
        chooseMethod: "Choose a donation method",
        subtitle: "Your generosity helps support the Imam Malick Islamic Institute and its students. Select the option that works best for you. 100% Sadaqah Jariyah.",
        waveTitle: "Wave Mobile Money", waveDesc: "For Gambian donors. Send your donation directly to Wave using the number below.",
        bankTitle: "Endowment Fund Bank Account", bankDesc: "For large donations & companies. Direct bank transfer to our endowment fund.",
        paypalTitle: "PayPal / Card", paypalDesc: "Secure payment via PayPal - Works internationally",
        openWave: "Open Wave PayLink →", donatePayPal: "Donate with PayPal / Card →", copyPayPalLink: "Copy PayPal Link", copyEmail: "Copy Email", paypalLinkCopied: "PayPal link copied!", emailCopied: "Email copied!", scanToDonate: "Scan to donate via PayPal", copy: "Copy",
        accountNumber: "Account Number", bankName: "Ajib Bank Limited", accountName: "Al-Imam Malick Islamic Institute - Endowment Fund",
        copyBank: "Copy Bank Details →", copyAccount: "Copy account number", accountCopied: "Account number copied!", bankCopied: "Bank details copied!", waveCopied: "Wave number copied!",
        waveFor: "For Gambian Donors", paypalInternational: "International",
        waveReceipt: "Send your donation directly to Wave using the number. Please screenshot receipt to WhatsApp Admin.",
        principal: "Principal", secondDeputyPrincipal: "Second Deputy Principal", directorFinancialAffairs: "Director of Financial Affairs",
        endowmentTitle: "About the Endowment Project:",
        endowmentText: "Five months ago, Principal Ibrahim Marry Jagana launched the Usman ibn Affan Charitable Endowment to secure the Institute's future. Relying on school fees alone is no longer sustainable. The goal is to acquire prime property in Serekunda and develop commercial assets whose income will sustain all departments (Arabic & English), e-learning programs, and student supplies. Target: 30,000,000 GMD (~$405,405). Every contribution is Sadaqah Jariyah.",
        endowmentTarget: "Target: 30,000,000 GMD (~$405,405)", sadaqahJariyah: "Sadaqah Jariyah"
    };
    var donationCopy = fallbackCopy;

    function getLanguage() {
        return document.documentElement.lang === "ar" ? "ar" : "en";
    }

    function translate(key) {
        return donationCopy[key] || fallbackCopy[key] || key;
    }

    function track(eventName, properties) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(Object.assign({ event: eventName, lang: getLanguage() }, properties || {}));
    }

    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        var textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
        return Promise.resolve();
    }

    function showToast(message) {
        var toast = document.getElementById("donationToast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "donationToast";
            toast.className = "donation-toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add("is-visible");
        window.clearTimeout(showToast.timeout);
        showToast.timeout = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 2500);
    }

    function renderOptions(container, accounts) {
        var bank = accounts.bank;
        var waveCards = accounts.wave.map(function (sheikh) {
            var numbers = sheikh.numbers.map(function (number) {
                return '<div class="donation-number-row"><code>' + number + '</code><button type="button" class="donation-copy-icon" data-wave-number="' + number + '" data-sheikh-name="' + sheikh.label + '" aria-label="' + translate("copy") + ' ' + number + '" title="' + translate("copy") + '">' + translate("copy") + '</button></div>';
            }).join("");
            return '<article class="donation-wave-card"><h4>' + sheikh.label + '</h4><p class="donation-role">' + translate(sheikh.roleKey) + '</p><div class="donation-number-list">' + numbers + '</div><a class="donation-option-link" href="tel:' + sheikh.numbers[0] + '">' + translate("openWave") + '</a><p class="donation-card-note">' + translate("waveReceipt") + '</p></article>';
        }).join("");
        var paypalQrCode = accounts.paypal.qrCodeAvailable && accounts.paypal.qrCodePath
            ? '<div class="donation-paypal-qr"><img src="' + accounts.paypal.qrCodePath + '" alt="' + translate("scanToDonate") + '" width="112" height="112"><span>' + translate("scanToDonate") + '</span></div>'
            : "";
        var paypalCard = accounts.paypal.enabled
            ? '<section class="donation-option-card donation-paypal-card"><div><div class="donate-option-title">' + translate("paypalTitle") + ' <span>' + translate("paypalInternational") + '</span></div><p class="donate-option-text">' + translate("paypalDesc") + '</p><p class="donation-paypal-email">' + accounts.paypal.email + '</p><div class="donation-paypal-actions"><a class="donation-option-link" href="' + accounts.paypal.paymentLink + '" target="_blank" rel="noopener noreferrer" data-paypal-link>' + translate("donatePayPal") + '</a><button type="button" class="donation-secondary-button" data-paypal-copy-link>' + translate("copyPayPalLink") + '</button><button type="button" class="donation-secondary-button" data-paypal-copy-email>' + translate("copyEmail") + '</button></div></div>' + paypalQrCode + '</section>'
            : '<section class="donation-option-card donation-paypal-card"><div><div class="donate-option-title">' + translate("paypalTitle") + ' <span>' + translate("paypalInternational") + '</span></div><p class="donate-option-text">' + translate("paypalDesc") + '</p></div></section>';

        container.innerHTML =
            '<section class="donation-bank-card" aria-labelledby="donationBankTitle">' +
                '<div><span class="donation-kicker">' + translate("bankTitle") + '</span><h4 id="donationBankTitle">' + translate("bankName") + '</h4><p class="donation-account-name">' + translate("accountName") + '</p><p class="donation-card-note">' + translate("bankDesc") + '</p></div>' +
                '<div class="donation-bank-number"><span>' + translate("accountNumber") + '</span><code>' + bank.accountNumber + '</code><button type="button" class="donation-copy-button" data-bank-number="' + bank.accountNumber + '">' + translate("copyAccount") + '</button></div>' +
                '<button type="button" class="donation-secondary-button" data-bank-details>' + translate("copyBank") + '</button>' +
            '</section>' +
            '<section class="donation-wave-section" aria-labelledby="donationWaveTitle">' +
                '<h4 id="donationWaveTitle">' + translate("waveTitle") + ' <span>' + translate("waveFor") + '</span></h4><p class="donation-wave-description">' + translate("waveDesc") + '</p><div class="donation-wave-grid">' + waveCards + '</div>' +
            '</section>' +
            '<div class="donation-options-bottom">' +
                paypalCard +
            '</div>';

        container.querySelectorAll("[data-wave-number]").forEach(function (button) {
            button.addEventListener("click", function () {
                copyText(button.dataset.waveNumber).then(function () {
                    showToast(translate("waveCopied"));
                    track("donation_wave_copy", { sheikh_name: button.dataset.sheikhName, wave_number: button.dataset.waveNumber });
                });
            });
        });
        container.querySelector("[data-bank-number]").addEventListener("click", function () {
            copyText(bank.accountNumber).then(function () {
                showToast(translate("accountCopied"));
                track("donation_bank_copy", { account: bank.accountNumber });
            });
        });
        container.querySelector("[data-bank-details]").addEventListener("click", function () {
            copyText(bank.bankName + "\nAccount: Al-Imam Malick Islamic Institute\nNumber: " + bank.accountNumber).then(function () {
                showToast(translate("bankCopied"));
                track("donation_bank_copy", { account: bank.accountNumber });
            });
        });
        var paypalLink = container.querySelector("[data-paypal-link]");
        if (paypalLink) paypalLink.addEventListener("click", function () { track("donation_paypal_ncp_click", { link: "X5656V3Z8UZHG" }); });
        var copyPaypalLinkButton = container.querySelector("[data-paypal-copy-link]");
        if (copyPaypalLinkButton) copyPaypalLinkButton.addEventListener("click", function () {
            copyText(accounts.paypal.paymentLink).then(function () { showToast(translate("paypalLinkCopied")); });
        });
        var copyPaypalEmailButton = container.querySelector("[data-paypal-copy-email]");
        if (copyPaypalEmailButton) copyPaypalEmailButton.addEventListener("click", function () {
            copyText(accounts.paypal.email).then(function () { showToast(translate("emailCopied")); });
        });
    }

    window.initialiseDonationModal = function () {
        var backdrop = document.getElementById("donateModalBackdrop");
        var modal = backdrop && backdrop.querySelector(".donate-modal");
        var closeButton = document.getElementById("donateModalClose");
        var options = document.getElementById("donateModalOptions");
        if (!backdrop || !modal || !closeButton || !options || !window.donationAccounts || backdrop.dataset.initialised) return;

        function applyDonationCopy(copy) {
            donationCopy = Object.assign({}, fallbackCopy, copy || {});
            document.getElementById("donateModalTitle").textContent = translate("chooseMethod");
            modal.querySelector(".donate-modal-subtitle").textContent = translate("subtitle");
            var endowmentInfo = document.getElementById("donationEndowmentInfo");
            endowmentInfo.querySelector("h4").textContent = translate("endowmentTitle");
            endowmentInfo.querySelector("p").textContent = translate("endowmentText");
            endowmentInfo.querySelector("strong").textContent = translate("endowmentTarget");
            endowmentInfo.querySelector("span").textContent = translate("sadaqahJariyah");
            renderOptions(options, window.donationAccounts);
        }

        backdrop.dataset.initialised = "true";
        applyDonationCopy();
        document.addEventListener("site-language-change", function (event) {
            applyDonationCopy(event.detail && event.detail.dictionary && event.detail.dictionary.donation);
        });
        fetch("/languages/" + getLanguage() + ".json").then(function (response) { return response.json(); }).then(function (dictionary) {
            if (getLanguage() === (dictionary.site && dictionary.site.name === "معهد الإمام مالك الإسلامي" ? "ar" : "en")) applyDonationCopy(dictionary.donation);
        }).catch(function () {});
        var lastFocusedElement;
        var focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
        function closeModal() {
            backdrop.classList.remove("is-open");
            backdrop.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
            if (lastFocusedElement) lastFocusedElement.focus();
        }
        function openModal(event) {
            if (event) event.preventDefault();
            lastFocusedElement = document.activeElement;
            backdrop.classList.add("is-open");
            backdrop.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            closeButton.focus();
            track("donation_modal_open", { page: window.location.pathname });
            track("donation_method_view", { method: "bank" });
            track("donation_method_view", { method: "wave" });
        }
        document.querySelectorAll(".donate-btn").forEach(function (button) { button.addEventListener("click", openModal); });
        closeButton.addEventListener("click", closeModal);
        backdrop.addEventListener("click", function (event) { if (event.target === backdrop) closeModal(); });
        document.addEventListener("keydown", function (event) {
            if (!backdrop.classList.contains("is-open")) return;
            if (event.key === "Escape") { closeModal(); return; }
            if (event.key !== "Tab") return;
            var focusable = modal.querySelectorAll(focusableSelector);
            if (!focusable.length) return;
            var first = focusable[0];
            var last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        });
    };
})();