"""
Offline preview renderer for the Alpine Astonia procedural model.

This is a development tool, not part of the site build. It rasterises the same
box data the WebGL scene uses (exported to JSON with esbuild + node) using a
painter's-algorithm flat shader, so massing and camera framing can be checked
without a browser.

    node -e "...dump json..."           # see scripts/README note
    python3 scripts/preview_model.py
"""

import json
import math
import sys
from PIL import Image, ImageDraw

W, H = 1280, 720

MATERIALS = {
    "lawn": (79, 122, 74),
    "court": (47, 106, 109),
    "pergola": (156, 122, 82),
    "podium": (222, 218, 210),
    "slabs": (236, 234, 228),
    "glass": (28, 52, 70),
    "fins": (169, 179, 189),
    "balconies": (230, 227, 220),
    "rails": (150, 195, 214),
    "litWindows": (255, 217, 164),
    "cores": (200, 194, 182),
    "parapets": (185, 194, 201),
    "shopGlass": (40, 62, 78),
    "shopSigns": (120, 170, 210),
    "deck": (207, 215, 219),
    "cars": (215, 217, 219),
    "streetLights": (255, 230, 189),
}

ORDER = [
    "podium", "deck", "lawn", "court", "pergola", "cores", "slabs", "glass",
    "fins", "balconies", "rails", "litWindows", "parapets", "shopGlass",
    "shopSigns", "cars", "streetLights",
]

SUN = (0.55, 0.7, 0.45)


def norm(v):
    length = math.sqrt(sum(c * c for c in v)) or 1.0
    return tuple(c / length for c in v)


def sub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def cross(a, b):
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )


def dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def look_at(eye, target, up=(0, 1, 0)):
    f = norm(sub(target, eye))
    s = norm(cross(f, up))
    u = cross(s, f)
    return s, u, f


def project(point, eye, basis, fov, aspect):
    s, u, f = basis
    d = sub(point, eye)
    x, y, z = dot(d, s), dot(d, u), dot(d, f)
    if z <= 0.15:
        return None
    scale = 1.0 / math.tan(math.radians(fov) / 2)
    return ((x / z) * scale / aspect * (W / 2) + W / 2, -(y / z) * scale * (H / 2) + H / 2), z


FACES = [
    ((0, 1, 2, 3), (0, 0, 1)),
    ((5, 4, 7, 6), (0, 0, -1)),
    ((4, 0, 3, 7), (-1, 0, 0)),
    ((1, 5, 6, 2), (1, 0, 0)),
    ((3, 2, 6, 7), (0, 1, 0)),
    ((4, 5, 1, 0), (0, -1, 0)),
]


def box_corners(p, s):
    hx, hy, hz = s[0] / 2, s[1] / 2, s[2] / 2
    return [
        (p[0] - hx, p[1] - hy, p[2] + hz),
        (p[0] + hx, p[1] - hy, p[2] + hz),
        (p[0] + hx, p[1] + hy, p[2] + hz),
        (p[0] - hx, p[1] + hy, p[2] + hz),
        (p[0] - hx, p[1] - hy, p[2] - hz),
        (p[0] + hx, p[1] - hy, p[2] - hz),
        (p[0] + hx, p[1] + hy, p[2] - hz),
        (p[0] - hx, p[1] + hy, p[2] - hz),
    ]


def shade(colour, normal, emissive=False):
    if emissive:
        return colour
    lambert = max(0.0, dot(normal, SUN))
    k = 0.42 + 0.72 * lambert
    return tuple(min(255, int(c * k)) for c in colour)


def render(payload, eye, target, fov, path, sky=((28, 44, 74), (222, 176, 132))):
    data = payload["data"]
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)

    for y in range(H):
        t = y / H
        col = tuple(int(sky[0][i] + (sky[1][i] - sky[0][i]) * min(1, t * 1.35)) for i in range(3))
        draw.line([(0, y), (W, y)], fill=col)

    basis = look_at(eye, target)
    aspect = W / H
    polys = []

    ground = [(-400, 0, -400), (400, 0, -400), (400, 0, 400), (-400, 0, 400)]
    pts = [project(p, eye, basis, fov, aspect) for p in ground]
    if all(pts):
        polys.append((1e9, [p[0] for p in pts], (128, 131, 137)))

    for key in ORDER:
        for box in data.get(key, []):
            corners = box_corners(box["p"], box["s"])
            for idx, normal in FACES:
                world = [corners[i] for i in idx]
                centroid = tuple(sum(c[i] for c in world) / 4 for i in range(3))
                if dot(normal, norm(sub(eye, centroid))) <= 0:
                    continue
                projected = [project(c, eye, basis, fov, aspect) for c in world]
                if any(p is None for p in projected):
                    continue
                depth = sum(p[1] for p in projected) / 4
                polys.append(
                    (depth, [p[0] for p in projected], shade(MATERIALS[key], normal, key in ("litWindows", "shopSigns", "streetLights")))
                )

    for tree in data.get("trees", []):
        p, s = tree["p"], tree["s"]
        canopy = box_corners([p[0], p[1] + 3.4 * s, p[2]], [2.5 * s, 3.3 * s, 2.5 * s])
        for idx, normal in FACES:
            world = [canopy[i] for i in idx]
            centroid = tuple(sum(c[i] for c in world) / 4 for i in range(3))
            if dot(normal, norm(sub(eye, centroid))) <= 0:
                continue
            projected = [project(c, eye, basis, fov, aspect) for c in world]
            if any(p is None for p in projected):
                continue
            depth = sum(p[1] for p in projected) / 4
            polys.append((depth, [p[0] for p in projected], shade((62, 107, 70), normal)))

    polys.sort(key=lambda item: -item[0])
    for _, poly, colour in polys:
        draw.polygon(poly, fill=colour)

    img.save(path)
    print("wrote", path)


if __name__ == "__main__":
    payload = json.load(open("/tmp/astonia.json"))
    shots = {
        "act1": ((104, 44, 128), (0, 24, 0), 30),
        "act2": ((-46, 10, 62), (-16, 40, -4), 40),
        "act3": ((34, 12, 78), (-2, 10, 18), 34),
        "act4": ((2, 92, 58), (0, 12, 0), 36),
        "zresidences": ((-58, 38, 70), (-16.5, 34, 0), 38),
        "zplans": ((56, 30, 62), (16.5, 26, 0), 38),
        "zamenities": ((10, 74, 62), (0, 12, 0), 36),
    }
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for name, (eye, target, fov) in shots.items():
        if only and only != name:
            continue
        render(payload, eye, target, fov, f"/tmp/preview-{name}.png")
