#!/usr/bin/env python3
"""Generate brand raster assets + clearly-marked photo placeholders.

These placeholders exist so the layout is never broken and never shows
unrelated stock photography. Replace the files in src/assets/img/ with real
TrioNest project photography (same filenames, same aspect ratio) at launch.
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
BRAND = os.path.join(ROOT, 'src/assets/brand')
IMG = os.path.join(ROOT, 'src/assets/img')
CLIENTS = os.path.join(ROOT, 'src/assets/clients')
for d in (BRAND, IMG, CLIENTS):
    os.makedirs(d, exist_ok=True)

INK = (8, 9, 11)
INK2 = (17, 20, 23)
INK3 = (27, 31, 36)
ACCENT = (217, 138, 61)
PAPER = (244, 245, 246)
MUTE = (135, 143, 152)

FONTDIRS = ['/usr/share/fonts', '/usr/local/share/fonts']


def find_font(*names):
    for base in FONTDIRS:
        for root, _dirs, files in os.walk(base):
            for f in files:
                for n in names:
                    if n.lower() in f.lower():
                        return os.path.join(root, f)
    return None


BOLD = find_font('DejaVuSans-Bold.ttf', 'LiberationSans-Bold.ttf')
REG = find_font('DejaVuSans.ttf', 'LiberationSans-Regular.ttf')


def font(size, bold=False):
    p = BOLD if bold else REG
    try:
        return ImageFont.truetype(p, size)
    except Exception:
        return ImageFont.load_default()


def tri(d, cx, cy, r, width=6, fill=False):
    pts = [(cx, cy - r), (cx + r * 0.92, cy + r * 0.72), (cx - r * 0.92, cy + r * 0.72)]
    if fill:
        d.polygon(pts, fill=ACCENT)
    else:
        d.line(pts + [pts[0]], fill=ACCENT, width=width, joint='curve')


# ---------------------------------------------------------------- OG image
def og():
    W, H = 1200, 630
    im = Image.new('RGB', (W, H), INK)
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 6], fill=ACCENT)
    for i in range(0, W, 40):
        d.line([(i, 0), (i, H)], fill=(12, 14, 16), width=1)
    tri(d, 108, 118, 34, 6)
    tri(d, 108, 126, 16, fill=True)
    d.text((160, 92), 'TrioNest Spaces', font=font(40, True), fill=PAPER)
    d.text((80, 250), 'One Partner.', font=font(82, True), fill=PAPER)
    d.text((80, 344), 'Three Disciplines.', font=font(82, True), fill=ACCENT)
    d.text((80, 468), 'Corporate Interiors  ·  Electrical Contracting  ·  HVAC Engineering',
           font=font(27), fill=(185, 191, 198))
    d.text((80, 540), '100+ projects delivered  ·  PAN-India  ·  trionest.in',
           font=font(23), fill=MUTE)
    im.save(os.path.join(BRAND, 'og-default.png'), optimize=True)


def touch_icon():
    S = 180
    im = Image.new('RGB', (S, S), (12, 14, 16))
    d = ImageDraw.Draw(im)
    tri(d, S // 2, S // 2 - 6, 54, 10)
    tri(d, S // 2, S // 2 + 6, 26, fill=True)
    im.save(os.path.join(BRAND, 'apple-touch-icon.png'), optimize=True)


# ------------------------------------------------- photo placeholder frames
def placeholder(name, label, w=1600, h=1000):
    im = Image.new('RGB', (w, h), INK2)
    d = ImageDraw.Draw(im)
    # diagonal hatch, engineering-drawing feel
    step = 46
    for i in range(-h, w + h, step):
        d.line([(i, 0), (i + h, h)], fill=(21, 24, 28), width=1)
    d.rectangle([0, 0, w - 1, h - 1], outline=(38, 43, 49), width=2)
    m = int(w * 0.055)
    d.rectangle([m, m, w - m, h - m], outline=(48, 54, 61), width=1)
    tri(d, w // 2, int(h * 0.40), int(h * 0.10), max(4, int(h / 190)))
    tri(d, w // 2, int(h * 0.425), int(h * 0.046), fill=True)

    f1 = font(max(20, int(h * 0.048)), True)
    f2 = font(max(14, int(h * 0.028)))
    t1 = label
    t2 = 'Replace with real TrioNest project photography'
    for txt, f, y, col in ((t1, f1, 0.60, PAPER), (t2, f2, 0.685, MUTE)):
        bb = d.textbbox((0, 0), txt, font=f)
        d.text(((w - (bb[2] - bb[0])) / 2, h * y), txt, font=f, fill=col)
    d.text((m + 6, h - m - int(h * 0.045)), 'TRIONEST SPACES', font=font(max(11, int(h * 0.022)), True), fill=(60, 67, 75))
    im.save(os.path.join(IMG, name + '.jpg'), quality=82, optimize=True, progressive=True)


# ------------------------------------------------------ client logo frames
def client_logo(slug, name):
    w, h = 320, 120
    im = Image.new('RGB', (w, h), (21, 24, 28))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, w - 1, h - 1], outline=(38, 43, 49), width=1)
    f = font(22, True)
    bb = d.textbbox((0, 0), name, font=f)
    while bb[2] - bb[0] > w - 40 and f.size > 11:
        f = font(f.size - 1, True)
        bb = d.textbbox((0, 0), name, font=f)
    d.text(((w - (bb[2] - bb[0])) / 2, (h - (bb[3] - bb[1])) / 2 - 6), name, font=f, fill=(200, 206, 213))
    im.save(os.path.join(CLIENTS, slug + '.png'), optimize=True)


PLACEHOLDERS = [
    ('hero-office', 'Corporate fit-out — hero image (16:10)'),
    ('project-office', 'Office interiors project'),
    ('project-retail', 'Retail rollout project'),
    ('project-hvac', 'HVAC installation'),
    ('project-electrical', 'Electrical / panel works'),
    ('project-bank', 'Branch interiors project'),
    ('project-industrial', 'Industrial HVAC project'),
    ('project-industrial-2', 'Industrial project'),
    ('project-healthcare', 'Healthcare HVAC project'),
    ('svc-civil-interiors', 'Civil & interiors on site'),
    ('svc-electrical', 'Electrical installation on site'),
    ('svc-hvac', 'HVAC plant and ductwork'),
    ('svc-amc-fms', 'Maintenance and service visit'),
    ('quality', 'QA/QC inspection on site'),
    ('safety', 'Site safety — PPE and toolbox talk'),
    ('team', 'TrioNest project team'),
    ('process', 'Design and coordination review'),
]

CLIENT_LOGOS = [
    ('client_yesbank', 'Yes Bank'), ('client_lntfinance', 'L&T Finance'),
    ('centrum', 'Centrum Wealth'), ('client_centricity', 'Centricity'),
    ('concentrix', 'Concentrix'), ('client_teleperformance', 'Teleperformance'),
    ('epam', 'EPAM'), ('client_avaya', 'Avaya'), ('client_anaptyss', 'Anaptyss'),
    ('klearnow', 'KlearNow'), ('fleetx', 'Fleetx'), ('novo', 'Novo'),
    ('client_cars24', 'CARS24'), ('client_indianoil', 'Indian Oil / PDIL'),
    ('client_panasonic', 'Panasonic'), ('client_marelli', 'Marelli India'),
    ('client_dalmia', 'Dalmia Cement'), ('induslaw', 'IndusLaw'),
    ('trilegal', 'Trilegal'), ('client_cbre', 'CBRE'),
    ('client_cushman', 'Cushman & Wakefield'), ('client_gshospital', 'GS Hospital'),
]

if __name__ == '__main__':
    og()
    touch_icon()
    placeholder('hero-office', 'Corporate fit-out — hero image', 2000, 1250)
    for slug, label in PLACEHOLDERS[1:]:
        placeholder(slug, label)
    for slug, name in CLIENT_LOGOS:
        if not os.path.exists(os.path.join(CLIENTS, slug + '.png')):
            client_logo(slug, name)
    print('images generated')
