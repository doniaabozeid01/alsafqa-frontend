from PIL import Image, ImageDraw
from pathlib import Path

root = Path(r"E:\alsafqa-angular\alsafqa-frontend\src")
src = root / "assets" / "brand" / "logo-icon.png"
logo = Image.open(src).convert("RGBA")


def circular_favicon(size: int, padding_ratio: float = 0.08) -> Image.Image:
    """Square canvas with circular white disc + logo; corners transparent."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    # White circle
    circle = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(circle)
    draw.ellipse((0, 0, size - 1, size - 1), fill=255)

    white = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    white.putalpha(circle)
    canvas = Image.alpha_composite(canvas, white)

    # Fit logo inside the circle
    pad = int(size * padding_ratio)
    target = size - pad * 2
    fitted = logo.copy()
    fitted.thumbnail((target, target), Image.Resampling.LANCZOS)

    # Soft circular clip on logo so edges stay round
    logo_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    x = (size - fitted.width) // 2
    y = (size - fitted.height) // 2
    logo_layer.paste(fitted, (x, y), fitted)

    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((1, 1, size - 2, size - 2), fill=255)
    logo_layer.putalpha(
        Image.composite(logo_layer.split()[-1], Image.new("L", (size, size), 0), mask)
    )

    canvas = Image.alpha_composite(canvas, logo_layer)
    return canvas


# Browser favicons (transparent corners = looks circular in tabs)
circular_favicon(64).save(root / "favicon.png", format="PNG", optimize=True)
circular_favicon(64).save(root / "assets" / "brand" / "favicon-64.png", format="PNG", optimize=True)
circular_favicon(180).save(
    root / "assets" / "brand" / "apple-touch-icon.png", format="PNG", optimize=True
)

# ICO: browsers that don't support transparency well still get a circular look on white
ico = circular_favicon(32)
ico.save(root / "favicon.ico", format="ICO", sizes=[(32, 32)])

print("circular favicons written")
