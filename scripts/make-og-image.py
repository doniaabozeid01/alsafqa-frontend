from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

out = Path(r"E:\alsafqa-angular\alsafqa-frontend\src\assets\brand\og-image.png")
logo_path = Path(r"E:\alsafqa-angular\alsafqa-frontend\src\assets\brand\logo-icon-white-bg.png")
if not logo_path.exists():
    logo_path = Path(r"E:\alsafqa-angular\alsafqa-frontend\src\assets\brand\logo-icon.png")

W, H = 1200, 630
img = Image.new("RGBA", (W, H), (16, 28, 51, 255))
draw = ImageDraw.Draw(img)

# soft gold glow circles
for r, alpha in [(260, 48), (200, 32), (140, 20)]:
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.ellipse(
        [W // 2 - r, H // 2 - r - 50, W // 2 + r, H // 2 + r - 50],
        fill=(201, 164, 92, alpha),
    )
    img = Image.alpha_composite(img, overlay)

draw = ImageDraw.Draw(img)
draw.rectangle([0, H - 90, W, H], fill=(250, 246, 238, 255))
draw.rectangle([0, H - 94, W, H - 90], fill=(201, 164, 92, 255))

logo = Image.open(logo_path).convert("RGBA")
logo.thumbnail((280, 280), Image.Resampling.LANCZOS)
lx = (W - logo.width) // 2
ly = (H - 90 - logo.height) // 2 - 30
img.paste(logo, (lx, ly), logo)

draw = ImageDraw.Draw(img)
candidates = [
    r"C:\Windows\Fonts\arial.ttf",
    r"C:\Windows\Fonts\segoeui.ttf",
    r"C:\Windows\Fonts\calibri.ttf",
]
font_path = next((p for p in candidates if Path(p).exists()), None)
font_title = ImageFont.truetype(font_path, 54) if font_path else ImageFont.load_default()
font_sub = ImageFont.truetype(font_path, 28) if font_path else ImageFont.load_default()

title = "AL-SAFQA"
sub = "Import & Export  |  Shipping  |  Customs"
tw = draw.textlength(title, font=font_title)
draw.text(((W - tw) / 2, ly + logo.height + 16), title, fill=(201, 164, 92, 255), font=font_title)
sw = draw.textlength(sub, font=font_sub)
draw.text(((W - sw) / 2, H - 58), sub, fill=(27, 42, 74, 255), font=font_sub)

img.convert("RGB").save(out, "PNG", optimize=True)
print("wrote", out, out.stat().st_size)
