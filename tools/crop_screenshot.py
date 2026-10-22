# Crops a Power BI screenshot down to just the report page and saves a web-ready WebP copy.
# Usage: python tools/crop_screenshot.py <screenshot.png> <output.webp> [page background hex, default 071426] [left,top,right,bottom]
# Give the box when the area around the page is the same colour as the page (then the colour search finds too much).

# Import sys to read the command-line arguments
import sys
# Import the image library (pip install pillow)
from PIL import Image

# The screenshot to crop
source = sys.argv[1]
# Where to save the cropped image
target = sys.argv[2]
# The report page's background colour, as hex (the NW Rainfall Watch pages use 071426)
background = sys.argv[3] if len(sys.argv) > 3 else "071426"
# Turn the hex colour into red, green and blue numbers
bg = tuple(int(background[i:i + 2], 16) for i in (0, 2, 4))
# Open the screenshot and make sure it is plain RGB
image = Image.open(source).convert("RGB")
# Read the width and height
width, height = image.size
# Load the pixels for fast access
pixels = image.load()


# Decide whether a pixel is close to the page background colour
def is_page(colour):
    # Within 6 levels on each of red, green and blue counts as the background
    return all(abs(colour[k] - bg[k]) <= 6 for k in range(3))


# Columns where more than a twelfth of the sampled pixels are page background
columns = [x for x in range(width) if sum(is_page(pixels[x, y]) for y in range(0, height, 4)) > height / 12]
# Rows where more than a twelfth of the sampled pixels are page background
rows = [y for y in range(height) if sum(is_page(pixels[x, y]) for x in range(0, width, 4)) > width / 12]
# Stop with a clear message if the page colour was not found
if not columns or not rows:
    # Explain what went wrong
    sys.exit("Could not find the report page: check the background colour argument")
# The page's edges: first and last matching column and row
box = (columns[0], rows[0], columns[-1] + 1, rows[-1] + 1)
# Use the box given on the command line instead, when there is one
if len(sys.argv) > 4:
    # Read the four numbers left, top, right, bottom
    box = tuple(int(v) for v in sys.argv[4].split(","))
# Cut the page out of the screenshot
page = image.crop(box)
# Keep the image no wider than 1600 pixels (it is shown at most about 1100 pixels wide)
if page.width > 1600:
    # Shrink it, keeping the proportions
    page = page.resize((1600, round(page.height * 1600 / page.width)), Image.LANCZOS)
# Save as WebP at high quality (small file, sharp text)
page.save(target, "WEBP", quality=90, method=6)
# Report what was saved
print(f"Saved {target}: {page.width} x {page.height} px (cropped from {box})")
