# 🚀 Hostinger Deployment Guide — TrioNest Spaces

## Quick Start (5 Minutes)

### Step 1: Build the Site

```bash
# Install dependencies
npm install

# Build the optimized site
npm run build

# Run QA checks
npm run check
```

### Step 2: Upload to Hostinger

You have **two options**:

#### Option A: Using File Manager (Easiest)

1. Log in to [Hostinger hPanel](https://hpanel.hostinger.com)
2. Go to **Files → File Manager**
3. Navigate to `public_html/`
4. **Delete all existing files** in `public_html/` (backup first if needed)
5. Upload **all contents** of the `dist/` folder into `public_html/`
6. Ensure the structure is:
   ```
   public_html/
   ├── index.html          ← Homepage
   ├── send-mail.php       ← Database-free contact form mailer
   ├── about/
   │   └── index.html
   ├── services/
   │   ├── index.html
   │   ├── civil-interiors/
   │   │   └── index.html
   │   └── ...
   ├── assets/
   │   ├── css/
   │   ├── js/
   │   ├── img/
   │   ├── brand/
   │   └── clients/
   ├── .htaccess           ← Important! Don't skip hidden files
   ├── sitemap.xml
   ├── robots.txt
   └── 404.html
   ```

#### Option B: Using FTP/SFTP

1. Get FTP credentials from hPanel → **Files → FTP Accounts**
2. Use FileZilla, WinSCP, or Cyberduck
3. Connect to your Hostinger server
4. Navigate to `public_html/`
5. Upload all files from `dist/`
6. **Important**: Make sure to upload hidden files (`.htaccess`, `.nojekyll`)

### Step 3: Configure Domain & SSL

1. **Point your domain** to Hostinger (if not already done):
   - In hPanel → **Domains → DNS / Nameservers**
   - Use Hostinger's nameservers or point A record to your IP

2. **Enable SSL** (free with Hostinger):
   - hPanel → **Security → SSL**
   - Install SSL for `trionest.in` and `www.trionest.in`
   - Enable **Force HTTPS**

3. After enabling SSL, edit `.htaccess` and **uncomment** the HTTPS redirect lines:
   ```apache
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

### Step 4: Post-Deployment Checklist

- [ ] Visit `https://trionest.in` — homepage loads correctly
- [ ] Visit `https://www.trionest.in` — redirects to non-www (or vice versa)
- [ ] Visit `https://trionest.in/about/` — pretty URL works
- [ ] Visit `https://trionest.in/nonexistent/` — shows 404 page
- [ ] Check browser console — no JavaScript errors
- [ ] Run [Google PageSpeed Insights](https://pagespeed.web.dev/) — score should be 90+
- [ ] Check [SSL Labs](https://www.ssllabs.com/ssltest/) — should get A+

---

## Performance Optimizations (Already Applied)

The build automatically includes:

| Optimization | Benefit |
|---|---|
| **HTML minification** | ~15-20% smaller HTML files |
| **CSS optimizations** | `content-visibility: auto` for below-fold sections |
| **JavaScript optimizations** | `requestAnimationFrame` for filters, passive events |
| **Gzip compression** | `.htaccess` enables DEFLATE for all text assets |
| **Browser caching** | 1 year for CSS/JS/images, 1 hour for HTML |
| **Font loading** | Preloaded + async with `media="print"` trick |
| **DNS prefetch** | For Google Fonts, Maps, WhatsApp |
| **Image lazy loading** | All below-fold images use `loading="lazy"` |
| **Security headers** | X-Content-Type-Options, Referrer-Policy, X-Frame-Options |
| **Hotlink protection** | Prevents other sites from using your images |
| **Print styles** | Optimized for printing pages |

---

## Image Optimization (Recommended)

Before deploying, optimize your images for faster loading:

```bash
# Install sharp for automatic optimization
npm install sharp

# Run optimization
node tools/optimize-images.mjs
```

**Manual alternatives:**
- [TinyPNG.com](https://tinypng.com) — drag and drop
- [Squoosh.app](https://squoosh.app) — by Google, visual comparison
- **Target**: JPG quality 80-85, PNG quality 80, WebP where possible

**Image size guidelines:**
- Hero images: max 200KB (JPG, 2000px wide)
- Project images: max 150KB (JPG, 800px wide)
- Client logos: max 30KB (PNG, 160px wide)
- Favicons: SVG or ICO, < 10KB

---

## Contact Form

`dist/send-mail.php` is included automatically. It validates the form, blocks the
honeypot spam field and sends submissions directly to `spaces@trionest.in`. There is
no database, API key or third-party form service.

After uploading:

1. Submit the form once from `https://trionest.in/contact/`.
2. Check the Inbox and Spam folders for `spaces@trionest.in`.
3. If no message arrives, confirm PHP mail is enabled in hPanel or contact Hostinger
   support. The site uses the domain-aligned sender `spaces@trionest.in` and sets the
   visitor's address only as `Reply-To` for better deliverability.
4. Do not deploy this site only to GitHub Pages if the form must work: GitHub Pages
   cannot execute PHP. Use Hostinger (or another PHP-capable shared host).

---

## Updating the Site

After making changes:

```bash
# 1. Make your changes to src/ files

# 2. Build
npm run build

# 3. Verify
npm run check

# 4. Upload only changed files to Hostinger via FTP
#    OR delete public_html contents and re-upload dist/
```

---

## Troubleshooting

### CSS/JS not loading
- Check `.htaccess` was uploaded (it's a hidden file)
- Check file paths start with `/assets/`
- Clear browser cache (Ctrl+Shift+Delete)

### 404 on inner pages
- Ensure `.htaccess` is in `public_html/` root
- Check `mod_rewrite` is enabled (it is by default on Hostinger)
- Verify the folder structure matches the URL

### SSL/HTTPS issues
- Wait 5-10 minutes after enabling SSL in hPanel
- Clear browser cache
- Check that `.htaccess` HTTPS redirect is uncommented

### Images not showing
- Verify images are in `public_html/assets/img/` and `public_html/assets/clients/`
- Check file permissions (should be 644 for files, 755 for directories)
- In hPanel → File Manager → right-click file → Change Permissions

### Slow loading
- Run PageSpeed Insights to identify bottlenecks
- Compress images further
- Enable Hostinger's built-in caching (hPanel → Advanced → LiteSpeed Cache)

---

## Hostinger-Specific Tips

### Enable LiteSpeed Cache
1. hPanel → **Advanced → LiteSpeed Cache**
2. Enable browser caching and gzip compression (already in `.htaccess`, but this adds server-level caching)

### Use Hostinger's CDN (if available on your plan)
1. hPanel → **Performance → CDN**
2. Enable and configure

### Database (not needed for this site)
This is a **static site** — no database required. The build process generates all HTML files. You don't need MySQL for this website.

### Cron Jobs (not needed)
No scheduled tasks are required.

### PHP Version
Use PHP 8.0 or newer in hPanel. PHP is used only by `send-mail.php` for contact-form
email delivery; there is no PHP framework, database or Composer dependency.

---

## File Structure Reference

```
dist/                          ← Upload this folder's contents
├── index.html                 ← Homepage
├── send-mail.php              ← Contact-form email delivery
├── 404.html                   ← Custom 404 page
├── robots.txt                 ← Search engine instructions
├── sitemap.xml                ← Site map for SEO
├── .htaccess                  ← Server configuration
├── .nojekyll                  ← GitHub Pages marker
├── about/
│   └── index.html
├── services/
│   ├── index.html
│   ├── civil-interiors/
│   ├── electrical/
│   ├── hvac/
│   └── amc-fms/
├── industries/
│   ├── index.html
│   ├── corporate-offices/
│   ├── retail-showrooms/
│   └── ... (7 sectors)
├── projects/
│   ├── index.html
│   └── ... (8 project pages)
├── blog/
│   ├── index.html
│   └── ... (blog post pages)
├── contact/
├── process/
├── quality-safety/
├── certifications/
├── team/
├── clients/
├── company-profile/
├── careers/
├── privacy-policy/
├── terms/
└── assets/
    ├── css/style.css
    ├── js/main.js
    ├── brand/
    │   ├── logo.svg
    │   ├── favicon.svg
    │   └── og-default.png
    ├── img/
    │   ├── hero-office.jpg
    │   ├── project-*.jpg
    │   └── svc-*.jpg
    └── clients/
        └── client_*.png
```

---

## Support

- **Hostinger support**: hPanel → Help icon (bottom-right) → Live Chat
- **TrioNest site issues**: Check `npm run check` output for errors
- **Performance issues**: Run [PageSpeed Insights](https://pagespeed.web.dev/)
