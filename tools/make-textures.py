"""Generate the paper stock and film-grain plates used by the composition.

Deterministic (fixed seed) so `npm run textures` reproduces the exact assets.
Run with: python3 tools/make-textures.py
"""
import numpy as np
from PIL import Image, ImageFilter

rng = np.random.default_rng(20261021)

W, H = 1920, 2600
BASE = np.array([223, 221, 215], dtype=np.float64)


def low_freq(shape, cell, sigma, amp):
    h, w = shape
    small = rng.normal(0, 1, (max(2, h // cell), max(2, w // cell)))
    img = Image.fromarray(((small - small.min()) / (np.ptp(small)) * 255).astype(np.uint8))
    img = img.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(sigma))
    a = (np.asarray(img, dtype=np.float64) - 127.5) / 127.5
    return a * amp


# paper base: broad mottling + fibre streaks + fine tooth
canvas = np.zeros((H, W, 3), dtype=np.float64)
canvas += BASE
canvas += low_freq((H, W), 18, 26, 7.0)[:, :, None]          # broad pulp cloud
canvas += low_freq((H, W), 4, 1.2, 2.2)[:, :, None]          # tooth

streak = rng.normal(0, 1, (H, W))
streak = np.asarray(
    Image.fromarray(((streak + 3) / 6 * 255).clip(0, 255).astype(np.uint8)).filter(
        ImageFilter.GaussianBlur(0.6)
    ),
    dtype=np.float64,
)
streak = (streak - 127.5) / 127.5
streak_img = Image.fromarray(((streak + 1) * 127.5).astype(np.uint8)).filter(
    ImageFilter.GaussianBlur(0.4)
)
streak = (np.asarray(streak_img, dtype=np.float64) - 127.5) / 127.5
canvas += (streak * 1.6)[:, :, None]

# faint laid lines, very subtle
for x in range(0, W, 4):
    canvas[:, x, :] += 0.35

# dust specks
for _ in range(900):
    x, y = rng.integers(0, W), rng.integers(0, H)
    r = rng.integers(0, 3)
    shade = rng.uniform(-26, -8)
    canvas[max(0, y - r):y + r + 1, max(0, x - r):x + r + 1, :] += shade

# a few soft stains
for _ in range(14):
    x, y = rng.integers(0, W), rng.integers(0, H)
    rr = rng.integers(90, 260)
    yy, xx = np.ogrid[-rr:rr, -rr:rr]
    m = np.clip(1 - (xx ** 2 + yy ** 2) / rr ** 2, 0, 1) ** 2
    y0, y1 = max(0, y - rr), min(H, y + rr)
    x0, x1 = max(0, x - rr), min(W, x + rr)
    sub = m[(y0 - (y - rr)):(y1 - (y - rr)), (x0 - (x - rr)):(x1 - (x - rr))]
    canvas[y0:y1, x0:x1, :] += (-7 * sub)[:, :, None]

# soft fold shadows (two long creases)
def crease(canvas, cx, width, depth):
    yy, xx = np.mgrid[0:H, 0:W]
    d = (xx - cx) / width
    shade = -depth * np.exp(-(d ** 2))
    canvas[:, :, :] += shade[:, :, None]

crease(canvas, W * 0.5, 260, 3.2)
crease(canvas, W * 0.07, 120, 2.0)

canvas = np.clip(canvas, 0, 255)
paper = Image.fromarray(canvas.astype(np.uint8))
paper.save("public/assets/paper.jpg", quality=93, subsampling=1)
print("paper", paper.size)

# grain plates (grayscale, used with mix-blend-mode: overlay)
for i in range(3):
    h, w = 540, 960
    n = rng.normal(128, 34, (h, w))
    n = np.clip(n, 0, 255).astype(np.uint8)
    Image.fromarray(n, mode="L").resize((w * 2, h * 2), Image.NEAREST).save(
        f"public/assets/grain-{i + 1}.png"
    )
print("grain plates ok")
