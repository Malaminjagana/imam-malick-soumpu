# Al-Imam Malick Islamic Institute

Official website for **Al-Imam Malick Islamic Institute**, under **Sumpundoukati Society**, Kanifing, The Gambia.

> **Motto:** Knowledge is Light, Action is Worship - العلم نور والعمل عبادة

## Recognition and Awards

- **Best Performing Islamic Institute in The Gambia** - awarded by the General Secretariat for Islamic and Arabic Education.
- **Official KSA recognition** - the institute's secondary certificate is officially recognized in the Kingdom of Saudi Arabia.
- **World Assembly of Muslim Youth (WAMY)** member.
- **National Qur'an Competition** - first place in the Full Qur'an category twice.

| Recognition | Official artwork |
| --- | --- |
| Best Performing Institute | [awards/best-performing.webp](awards/best-performing.webp) |
| KSA Official Recognition | [awards/ksa-recognition.webp](awards/ksa-recognition.webp) |
| WAMY Member | [awards/wamy-member.webp](awards/wamy-member.webp) |

## Events and News 2026/2027

| Date | Activity | Details |
| --- | --- | --- |
| 21 October 2026 | Academic Seminar | Sheikh Muhammad Isa Haidara: Life Skills; Sheikh Omar Isa Dukure: Qur'an; Sheikh Mahmoud Al-Lay. |
| 18 November 2026 | Banjul Trip | Secondary students only. |
| 23 December 2026 | Tarbiyah Seminar | Responsibility of Mothers, presented by Dr. Fodi Jagana. |
| 20 January 2027 | Sports and Health | Student sports and health activity. |
| 20 February 2027 | First-Term Examinations | Academic examinations begin. |
| 24 March 2027 | Kachikally and Abuko Zoo Trip | Primary 4 through Preparatory 3. |
| 26 March 2027 | Applied Science Seminar | Presented by the Egyptian Sheikh. |
| 21 April 2027 | Snake Village and Kartong Trip | Student educational trip. |
| 22 May 2027 | Cultural Week | Traditional foods including Benachin, Laro, Nilini, Sula, Huto, Tijaqifouti, Tijaqin-Chobi, Sanketi, Baqari, and Tofoli. |
| 5 June 2027 | Fathala Zoo Trip | Senegal. |
| 9 June 2027 | Last Assembly | End-of-term school assembly. |
| 19 June 2027 | Second Term | Second-term academic activity. |
| 7 August 2027 | Graduation | Graduation of the 19th Batch. |

## Programs

| Program | Current provision |
| --- | ---: |
| Tahfiz | 200 students, 7 Tahfiz teachers |
| Arabic | 76 students |
| English | 12 students |

The institute also provides Islamic Studies, Arabic language, primary, preparatory, junior-secondary, and senior-secondary education.

## Scholars and Biographies

Biography pages and their transparent biography poster assets are kept in [biography/](biography/) and [assets/img/](assets/img/). No personal contact details are published in this documentation.
- [Muhammad Kaba Musa](biography/Muhammad-Kaba-Musa.html) - [poster](assets/img/muhamad-kaba-musa-biography.webp)
- [Ebrahima Marry Jagana](biography/Ebrahim-Marry-Jagana.html) - [poster](assets/img/Ebrahima-marry-jagana-biography.webp)
- [Dr. Ali Jagana](biography/dr-ali-jagana.html) - [poster](assets/img/dr_ali_jagana_biography.webp)
- [Dr. Fodi Jagana](biography/dr-fodi-jagana.html) - [poster](assets/img/fodi_jagana_biography.webp)
- [Dr. Kisma Sheikh Sahoo](biography/dr-kisma-sahoo.html) - [poster](assets/img/dr_kisma_sheikh_sahoo_biography.webp)
- [Dr. Suleiman Muhammad Kamara](biography/dr-suleiman-kamara.html) - [poster](assets/img/dr_suleiman_muhammad_camara_bigraphy.webp)
- [Baguri Kisma Sangare](biography/baguri_kisma_sangare.html) - [poster](assets/img/baguri_kisma_sangare_biography.webp)

- [Jaafar Fodi Gumani](biography/jaafar_fodi_gumani.html) - [poster](assets/img/jaafar_fodi_gumani_biography.webp)
- [Malamin Zakaria Jagana](biography/Malamin-zakaria-jagana.html) - [poster](assets/img/Malamin-zakaria-jagana-biography.webp)
- [Muhammad Issa Haydar](biography/muhammad_issa_haydar.html) - [poster](assets/img/muhammad_issa_haydara_biography.webp)
- [Muhammad Jola Kamara](biography/muhammad_jola_camara.html) - [poster](assets/img/muhammad_jola_camara_biography.webp)
- [Muhammad Kaowjed Kamara](biography/muhammad_kaowjed_camara.html) - [poster](assets/img/muhammad_kaowjed_camara_biography.webp)
- [Muhammad Muhammad Touray](biography/muhammad_muhammad_touray.html) - [poster](assets/img/muhammad_muhammad_touray_biography.webp)

- [Musa Muhammad Jibo](biography/musa_muhammad_jibo.html) - [poster](assets/img/musa_muhammad_jibo_biography.webp)
- [Omar Issa Dukureh](biography/omar_issa_dukureh.html) - [poster](assets/img/omar_issa_dukureh_biography.webp)
- [Sheikh Shondi Muhammad Samba Drammeh](biography/shiek-drameh.html) - [poster](assets/img/Shondi-Muhammad%20Samba-Drammeh-biography.webp)

## Branding

| Element | Value |
| --- | --- |
| Navy | `#0a2a5a` |
| Gold | `#c7a24e` |
| Green | `#0a5a3a` |
| Primary logo | [assets/img/imam-malick-logo-transparent.png](assets/img/imam-malick-logo-transparent.png) |

The header uses the transparent institute logo with no white background, border, or image-frame shadow, following the clean presentation of the Islamic University of Madinah logo.

## Translation Requirements

English and Arabic content is maintained in [languages/en.json](languages/en.json) and [languages/ar.json](languages/ar.json). Page markup must use translation keys and the site translation helper rather than hard-coded English copy.

Required translation groups include:

- `faq.*`, `security.*`, `privacy.*`, and `terms.*`
- `eventsAndNews`
- `awards`
- Footer keys `pages.index.text189` through `pages.index.text212`

The implementation in [i18n.js](i18n.js) resolves dictionary values through `t()` and applies them to `data-translate` and `data-translate-attr` elements.

## Site Structure

```text
.
├── index.html
├── academic-programs.html
├── school-rolls.html
├── faq.html
├── privacy.html
├── security.html
├── terms.html
├── awards/                 # Deployed as /awards/*.webp
├── assets/
│   ├── img/
│   ├── css/
│   └── js/
├── biography/
├── components/
│   └── footer.html
├── languages/              # English and Arabic locale dictionaries
├── i18n.js
└── search.js
```

On deployment, the repository root is the public web root. Therefore `awards/best-performing.webp` is served as `/awards/best-performing.webp`; GitHub preview links in this README intentionally remain relative to the repository root.

## Shared Footer

The official footer is defined in [components/footer.html](components/footer.html) and injected by [assets/js/footer-loader.js](assets/js/footer-loader.js) on every non-homepage HTML page. It provides:

- Institutional, registration, technical-support, and contact columns.
- IT Department: <https://malamin-profile.vercel.app/>.
- Security Policy, telephone links, and [Google Map](https://maps.app.goo.gl/57gzYFUxtX2he31D9).
- Social links and planned mobile-app links.
- Donation modal options for Wave, PayPal, Stripe, and Remitly.

## Donations

Supported or planned donation options:

- Wave PayLink
- PayPal.me
- LaunchGood
- Stripe card payment
- Remitly

Configure active payment URLs before enabling any donation option for public use.

## Developer 

**Malamin** - <https://malamin-profile.vercel.app/>

