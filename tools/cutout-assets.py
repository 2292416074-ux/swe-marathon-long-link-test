"""Turn the white-background generated cut-outs into RGBA PNGs.

Flood-fills white from the image border, so highlights *inside* an object
(a gear tooth, a knuckle) are preserved instead of being keyed out.

Run with: python3 tools/cutout-assets.py
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SENTINEL = (255, 0, 255)
TOLERANCE = 26


def cutout(path: str) -> None:
    im = Image.open(path).convert('RGB')
    w, h = im.size
    work = im.copy()
    # seed from a dense border ring so concave shapes release cleanly
    seeds = []
    for x in range(0, w, 24):
        seeds += [(x, 0), (x, h - 1)]
    for y in range(0, h, 24):
        seeds += [(0, y), (w - 1, y)]
    for seed in seeds:
        px = work.getpixel(seed)
        if min(px) > 235:
            ImageDraw.floodfill(work, seed, SENTINEL, thresh=TOLERANCE)

    arr = np.asarray(work).astype(int)
    keyed = (arr[:, :, 0] == 255) & (arr[:, :, 1] == 0) & (arr[:, :, 2] == 255)
    alpha = np.where(keyed, 0, 255).astype(np.uint8)

    rgb = np.asarray(im).copy()
    # un-premultiply the white fringe: pull edge pixels toward the object colour
    edge = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(1.1))
    edge_arr = np.asarray(edge)
    fringe = (edge_arr > 0) & (edge_arr < 255)
    rgb[fringe] = (rgb[fringe].astype(float) * 0.55).clip(0, 255).astype(np.uint8)

    out = Image.fromarray(np.dstack([rgb, edge_arr]), 'RGBA')
    out.save(path)
    print('cut out', path, out.size, 'transparent px:', int((edge_arr == 0).sum()))


for f in ('public/assets/hand-left.png', 'public/assets/hand-right.png'):
    cutout(f)
