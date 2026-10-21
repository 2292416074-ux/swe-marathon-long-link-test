"""Extend the sleeve side of each hand cut-out off-canvas.

The generated hands end inside their own frame, which leaves a hard rectangular
cut where the sleeve stops — visible as a floating black block. Stretching the
outer sleeve strip outward makes the arm run off frame like the reference.

Run with: python3 tools/extend-sleeves.py
"""
from PIL import Image, ImageFilter

EXT = 900
STRIP = 90


def extend(path: str, side: str) -> None:
    im = Image.open(path).convert('RGBA')
    w, h = im.size
    if side == 'left':
        strip = im.crop((0, 0, STRIP, h))
        stretch = strip.resize((EXT, h), Image.BILINEAR).filter(ImageFilter.GaussianBlur(6))
        out = Image.new('RGBA', (w + EXT, h), (0, 0, 0, 0))
        out.paste(stretch, (0, 0))
        out.alpha_composite(im, (EXT, 0))
    else:
        strip = im.crop((w - STRIP, 0, w, h))
        stretch = strip.resize((EXT, h), Image.BILINEAR).filter(ImageFilter.GaussianBlur(6))
        out = Image.new('RGBA', (w + EXT, h), (0, 0, 0, 0))
        out.alpha_composite(im, (0, 0))
        out.paste(stretch, (w, 0))
    out.save(path)
    print(path, im.size, '->', out.size)


extend('public/assets/hand-left.png', 'left')
extend('public/assets/hand-right.png', 'right')
