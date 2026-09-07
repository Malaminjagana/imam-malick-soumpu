(function () {
    "use strict";

    window.donationAccounts = {
        wave: [
            {
                id: "wave_sheikh_ibrahim",
                label: "Sheikh Ibrahim Marry Jagana",
                roleKey: "principal",
                numbers: ["+220872796018", "+2209917318"],
                note: "Main School Donations"
            },
            {
                id: "wave_sheikh_malamin",
                label: "Sheikh Malamin Zakaria Jagana",
                roleKey: "secondDeputyPrincipal",
                numbers: ["+220833210002", "+220877094539"],
                note: "Student Support"
            },
            {
                id: "wave_sheikh_touray",
                label: "Sheikh Muhammad Touray",
                roleKey: "directorFinancialAffairs",
                numbers: ["+220833072235", "+220877149335"],
                note: "Finance & Zakat"
            }
        ],
        bank: {
            bankName: "Ajib Bank Limited",
            accountName: "Al-Imam Malick Islamic Institute - Endowment Fund",
            accountNumber: "101212011873114",
            type: "Endowment Fund"
        },
        paypal: {
            email: "imammalicksoumpu@gmail.com",
            paymentLink: "https://www.paypal.com/ncp/payment/X5656V3Z8UZHG",
            donateLink: "https://www.paypal.com/ncp/payment/X5656V3Z8UZHG",
            enabled: true,
            qrCodeAvailable: true,
            qrCodePath: "/assets/img/paypal-ncp-donation-qr.png"
        }
    };
})();