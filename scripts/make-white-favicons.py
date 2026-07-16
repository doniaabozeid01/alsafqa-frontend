from PIL import Image
from pathlib import Path

root = Path(r"E:\alsafqa-angular\alsafqa-frontend\src")
src = root / "assets" / "brand" / "logo-icon.png"
logo = Image.open(src).convert("RGBA")


def with_white_bg(size: int, padding_ratio: float = 0.06) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    pad = int(size * padding_ratio)
    target = size - pad * 2
    fitted = logo.copy()
    fitted.thumbnail((target, target), Image.Resampling.LANCZOS)
    x = (size - fitted.width) // 2
    y = (size - fitted.height) // 2
    canvas.paste(fitted, (x, y), fitted)
    return canvas.convert("RGB")


with_white_bg(64).save(root / "favicon.png", format="PNG", optimize=True)
with_white_bg(64).save(root / "assets" / "brand" / "favicon-64.png", format="PNG", optimize=True)
with_white_bg(180).save(root / "assets" / "brand" / "apple-touch-icon.png", format="PNG", optimize=True)
with_white_bg(256, 0.04).save(
    root / "assets" / "brand" / "logo-icon-white-bg.png", format="PNG", optimize=True
)

img32 = with_white_bg(32)
img32.save(root / "favicon.ico", format="ICO", sizes=[(32, 32)])

print("generated favicons with white background")
