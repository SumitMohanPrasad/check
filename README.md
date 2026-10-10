# Learn Bharat School website

Static site (plain HTML, CSS and JavaScript). Works on GitHub Pages with the existing `CNAME`.

## Pages
`index.html`, `about.html`, `admissions.html`, `gallery.html`, `contact.html`, `fun-zone.html`, `404.html`

## Things you will edit most
| What | Where |
|---|---|
| WhatsApp number, email, admission year | `assets/js/config.js` |
| Phone, address, email shown on pages | search the `.html` files for `9835362030` |
| Colours and fonts | top of `assets/css/style.css` (`:root` variables) |
| Add a gallery photo | see below |

### Admission year
In `assets/js/config.js` set `session: "2026-27"` and every "Admissions open" heading becomes "Admissions open for 2026-27!".

### Add a gallery photo
1. Put a resized copy in `images/web/` (about 1600 px wide) and a small one in `images/thumbs/` (about 720 px wide), same file name.
2. In `gallery.html`, copy one `<a class="g-item glightbox" ...>` block inside the right section and change the file name, `alt` text and caption.

Libraries are loaded from CDNs (GSAP, Swiper, GLightbox, Lucide icons, Google Fonts: Fraunces and Plus Jakarta Sans), so the site needs internet to show animations, icons and fonts.
