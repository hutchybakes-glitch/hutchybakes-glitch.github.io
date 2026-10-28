# Makes the small images the site needs from the full page screenshots:
# - images/projects/thumbs/<name>.webp: an 800 px wide copy of each report's first page, used on the topic tiles
# - images/og-card.png: the 1200 x 630 picture shown when the site link is shared (LinkedIn, Teams, Slack, email)
# Run from the repo root after adding or replacing screenshots: python tools/make_thumbs.py

# Path handling.
from pathlib import Path
# Running data/projects.js to read the report list needs Node.
import json, subprocess
# Pillow, for resizing and drawing images.
from PIL import Image, ImageDraw, ImageFont

# The repo root (this file lives in tools/).
ROOT = Path(__file__).resolve().parent.parent
# Ask Node for each live report's first screenshot, in the order the portal shows them.
srcs = json.loads(subprocess.check_output(
    # Load projects.js the way the browser does and print the first page of each live report.
    ["node", "-e", "global.window={};require('./data/projects.js');console.log(JSON.stringify(window.PORTFOLIO.topics.filter(t=>t.report).map(t=>t.report.pages[0].src)))"],
    # Run it from the repo root so the relative path works.
    cwd=ROOT, text=True))

# The thumbnails folder.
thumbs = ROOT / "images" / "projects" / "thumbs"
# Create it if this is the first run.
thumbs.mkdir(parents=True, exist_ok=True)
# Make an 800 px wide copy of each first page.
for src in srcs:
    # Open the full screenshot.
    im = Image.open(ROOT / src).convert("RGB")
    # Resize to 800 px wide, keeping the shape.
    small = im.resize((800, round(im.height * 800 / im.width)), Image.LANCZOS)
    # Save as WebP at good quality.
    small.save(thumbs / Path(src).name, "WEBP", quality=85)
    # Report the file written.
    print("thumb", Path(src).name, small.size)

# The share card: dark background, name and role on the left of a 2 x 2 grid of report pages.
W, H = 1200, 630
# The site's near-black background colour.
card = Image.new("RGB", (W, H), (15, 15, 17))
# A drawing surface for the text and the accent bar.
draw = ImageDraw.Draw(card)
# Fonts: Segoe UI on Windows, falling back to Pillow's default if it's missing.
def font(size, bold=False):
    # Try the bold or regular Segoe UI file.
    try:
        # Windows font file names.
        return ImageFont.truetype("segoeuib.ttf" if bold else "segoeui.ttf", size)
    # Any other system.
    except OSError:
        # Pillow's built-in font, scaled.
        return ImageFont.load_default(size)
# The Power BI yellow accent bar down the left edge.
draw.rectangle([0, 0, 12, H], fill=(242, 200, 17))
# Name, role and a one-line description.
draw.text((60, 70), "Sam Hutchinson", font=font(64, True), fill=(245, 245, 245))
# The role, in the brand yellow.
draw.text((60, 150), "Senior Analyst · Power BI", font=font(34), fill=(242, 200, 17))
# What the portfolio holds, over three short lines.
for i, line in enumerate(["Live Power BI reports", "on UK public data: rainfall,", "fuel prices, energy, population"]):
    # One line of the description.
    draw.text((60, 240 + i * 44), line, font=font(30), fill=(200, 200, 205))
# The site address at the bottom.
draw.text((60, 540), "swhutchinson.github.io", font=font(28, True), fill=(245, 245, 245))
# The 2 x 2 grid of report pages on the right.
x0, y0, gw, gap = 560, 60, 300, 20
# Place each of the first four reports' first pages.
for i, src in enumerate(srcs[:4]):
    # Open and shrink the page to the grid cell size.
    tile = Image.open(ROOT / src).convert("RGB").resize((gw, round(gw * 9 / 16)), Image.LANCZOS)
    # Two per row.
    x, y = x0 + (i % 2) * (gw + gap), y0 + (i // 2) * (tile.height + gap) + 90
    # Paste it onto the card.
    card.paste(tile, (x, y))
# Save as PNG (LinkedIn doesn't show WebP previews).
card.save(ROOT / "images" / "og-card.png", optimize=True)
# Report it.
print("og-card.png", card.size)
