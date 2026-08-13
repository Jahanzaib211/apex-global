#!/usr/bin/env python3
"""Regenerate apps/web/src/lib/repo-graph.json from graphify-out/graph.json.

Filters out generated/prisma/wasm files, computes a fixed force-directed
layout, and bakes each node's final (x, y) so the site component never needs to
run an O(N^2) simulation per frame.
"""
import json
import math
import random
import sys
from collections import Counter
from pathlib import Path

ROOT = Path("/home/jahanzaib/Desktop/APEX GLOBAL")
OUT = ROOT / "apps/web/src/lib/repo-graph.json"

random.seed(7)
g = json.loads((ROOT / "graphify-out/graph.json").read_text())
nodes = g["nodes"]
links = g["links"]
byid = {n["id"]: n for n in nodes}

EXCLUDE = ("packages/db/generated/", "node_modules/", "graphify-out", "packages/db/prisma/engine")


def keep(n):
    f = n["source_file"]
    if f.startswith(EXCLUDE):
        return False
    if f.endswith(".map") or ".wasm" in f or f.endswith(".d.ts"):
        return False
    if n["file_type"] != "code":
        return False
    return True


keepids = {n["id"] for n in nodes if keep(n)}
fl = [e for e in links if e["source"] in keepids and e["target"] in keepids]
used = {nid for e in fl for nid in (e["source"], e["target"])}
deg: Counter = Counter()
for e in fl:
    deg[e["source"]] += 1
    deg[e["target"]] += 1
coms = Counter(byid[n]["community"] for n in used)
top = [c for c, _ in coms.most_common(12)]

sel = []
for nid in sorted(deg, key=lambda x: -deg[x]):
    if len(sel) >= 900:
        break
    if byid[nid]["community"] in top or deg[nid] >= 4:
        sel.append(nid)
selset = set(sel)
fl = [e for e in fl if e["source"] in selset and e["target"] in selset]

adj = {nid: set() for nid in sel}
for e in fl:
    adj[e["source"]].add(e["target"])
    adj[e["target"]].add(e["source"])

# --- fixed force layout (repulsion + spring + gravity, damped ---
# Repulsion is O(N^2), so we order nodes by degree and only push against a
# moving window of the highest-degree nodes + a few random samples each step.
pos = {nid: [random.uniform(-450, 450), random.uniform(-320, 320)] for nid in sel}
vel = {nid: [0.0, 0.0] for nid in sel}
order = sorted(sel, key=lambda n: -deg[n])
n_all = len(order)

for it in range(260):
    moved = 0.0
    for nid in sel:
        x, y = pos[nid]
        fx = -x * 0.008
        fy = -y * 0.008
        for oid in adj[nid]:
            ox, oy = pos[oid]
            dx, dy = ox - x, oy - y
            d = math.hypot(dx, dy) + 1e-6
            f = (d - 8.0) * 0.045
            fx += (dx / d) * f
            fy += (dy / d) * f
        # repulsion: top 60 nodes (hubs) + jittered sample, then full local pass skipped
        for oid in order[:60]:
            if oid == nid:
                continue
            ox, oy = pos[oid]
            dx, dy = x - ox, y - oy
            d2 = dx * dx + dy * dy + 1e-6
            f = 26000.0 / (d2 + 60)
            d = math.sqrt(d2)
            fx += (dx / d) * f
            fy += (dy / d) * f
        # random sample for spread
        idx = order.index(nid)
        for _ in range(14):
            oid = order[(idx * 37 + _ * 101 + it) % n_all]
            if oid == nid:
                continue
            ox, oy = pos[oid]
            dx, dy = x - ox, y - oy
            d2 = dx * dx + dy * dy + 1e-6
            f = 26000.0 / (d2 + 60)
            d = math.sqrt(d2)
            fx += (dx / d) * f
            fy += (dy / d) * f
        vel[nid][0] = vel[nid][0] * 0.5 + fx * 0.06
        vel[nid][1] = vel[nid][1] * 0.5 + fy * 0.06
    for nid in order:
        x, y = pos[nid]
        vx, vy = vel[nid]
        x += vx
        y += vy
        vx *= 0.82
        vy *= 0.82
        pos[nid] = [x, y]
        vel[nid] = [vx, vy]
        moved += abs(vx) + abs(vy)
    if moved < 0.5:
        print(f"converged at iteration {it}")
        break

# normalize to roughly -520..520 / -340..340
xs = [p[0] for p in pos.values()]
ys = [p[1] for p in pos.values()]
mx, my = min(xs), min(ys)
Mx, My = max(xs), max(ys)
sx = 1040 / max(1e-6, Mx - mx)
sy = 680 / max(1e-6, My - my)
s = min(sx, sy)
for nid in pos:
    pos[nid][0] = (pos[nid][0] - (mx + Mx) / 2) * s
    pos[nid][1] = (pos[nid][1] - (my + My) / 2) * s

nodes_out = []
for nid in sel:
    nodes_out.append(
        {
            "id": nid,
            "label": byid[nid]["label"][:40],
            "file": byid[nid]["source_file"],
            "c": byid[nid]["community"],
            "d": deg[nid],
            "x": round(pos[nid][0], 1),
            "y": round(pos[nid][1], 1),
        }
    )

links_out = [[e["source"], e["target"]] for e in fl]

data = {
    "meta": {
        "label": "APEX Global — the code that builds the site",
        "builtAt": "2026-08-07",
    },
    "nodes": nodes_out,
    "links": links_out,
    "sources": {},
}
OUT.write_text(json.dumps(data))
print(f"wrote {OUT} : {len(nodes_out)} nodes, {len(links)} links (no source snapshots)")