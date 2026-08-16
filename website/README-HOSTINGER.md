# TrioNest Spaces — Website (Hostinger-ready)

Yeh folder **complete website** hai — pure **HTML + CSS + JavaScript + PHP (form ke liye)**.
Koi build step nahi, koi framework nahi. Ye folder ka content seedha Hostinger par upload
karo aur website turant chal jayegi.

---

## 🚀 Hostinger par upload kaise karein (step-by-step)

1. **Download karo** — is `website/` folder ko ZIP karo (ya poora repo download karo).
2. Hostinger **hPanel** kholo → **File Manager** → `public_html` folder kholo.
3. `website/` folder ke **andar ka sab kuch** (index.html, css/, js/, images/, mail/) ko
   `public_html` ke andar upload karo.
   > ⚠️ `public_html` ke andar directly upload karo — `website` naam ka koi extra folder
   > nahi banne do, warna site `yoursite.com/website/` par khulegi.
4. Upload ho jaye to apni domain kholo — **site live hai!** 🎉

## 📧 Contact form ko kaam karwana (important)

Contact form `mail/send.php` se chalta hai jo Hostinger ke PHP par turant kaam karta hai.

1. `mail/send.php` kholo (File Manager me right-click → Edit).
2. Upar line number ~25 par ye milegi:
   ```php
   $to = 'spaces@trionest.in';
   ```
   Isse **apna email** bana do (apni domain ka email best hai, jaise `info@aapkidomain.com`).
   Save karo.
3. Bas! Ab form submit karne par enquiry seedha aapke email par aayegi.

> 💡 **Email spam me jaye to:** Hostinger → Domains → DNS me ye SPF record add karo:
> `v=spf1 include:spf.hostinger.com ~all`

> 🔁 **Agar mail() block ho** (kabhi kabhi hota hai): form ka JavaScript automatically
> visitor ke email app me pre-filled email khol deta hai — koi enquiry kabhi lost nahi hoti.

## ✏️ Common changes

| Kya badalna hai | Kahan badle |
|---|---|
| Phone number | Saari pages me `+91 87965 75719` (har file me find & replace) |
| Email (form jaane wala) | `mail/send.php` me `$to` |
| Email (footer/direct) | Har page me `spaces@trionest.in` |
| WhatsApp number | Har page me `918796575719` (wa.me link) |
| Address / hours | Footer me har page par |
| Google Map | `contact.html` me iframe ka `src` |

## 🌐 Domain se sitemap (SEO)

`robots.txt` aur `sitemap.xml` me `https://trionest.in` likha hai. Apna domain hai to
change karo (ya chhod do — Google dhoondh lega). Google Search Console me sitemap submit
kar sakte ho.

## 🗂 Folder structure

```
website/
├── index.html        → Home page
├── about.html        → About Us
├── services.html     → Services (4 verticals)
├── projects.html     → Projects (filterable)
├── industries.html   → Industries (7 sectors + FAQ)
├── contact.html      → Contact + working form
├── 404.html          → Error page
├── css/style.css     → Full design system (logo colours + glass theme)
├── js/main.js        → All site functions
├── mail/send.php     → Contact form mailer (PHP)
├── images/           → Logo, photos, client logos, favicon
├── robots.txt
└── sitemap.xml
```

## ✅ Test checklist (upload ke baad)

- [ ] `yoursite.com` khulti hai
- [ ] Mobile par menu khul raha hai
- [ ] Contact form submit karke test karo (email aata hai)
- [ ] WhatsApp button number sahi hai
- [ ] Saari pages ke links kaam kar rahe hain

---
© TrioNest Spaces — One Partner. Three Disciplines.
