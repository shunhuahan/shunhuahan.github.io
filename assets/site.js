// Every drawing on the site, in ink and watercolour. Each one draws only if its <svg> is on the page.
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var INK = "#241f1a", PENCIL = "#5a5047", A = "#4f6f95", B = "#c08736", RED = "#a8432e";
  var FLANK = "#cf8a45", TE = "#7f9f4a", LEAF = "#5f7f3a";
  var SERIF = "EB Garamond, Garamond, Georgia, serif", DISPLAY = SERIF;

  function el(tag, attrs, parent, text) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== "") e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function f(n) { return n.toFixed(1); }
  function $(id) { return document.getElementById(id); }
  // a label in the body face (italic unless asked otherwise); labels never take the ink wobble
  function note(g, x, y, s, o) {
    o = o || {};
    if (g.getAttribute && g.getAttribute("filter")) g = g.parentNode;
    return el("text", { x: x, y: y, "font-family": o.display ? DISPLAY : SERIF, "font-style": o.display || o.roman ? "normal" : "italic",
      "font-size": o.size || 13, fill: o.fill || PENCIL, "text-anchor": o.anchor || "start", "letter-spacing": o.ls || "",
      "font-weight": o.weight || "" }, g, s);
  }
  function plateNo(svg, s) { note(svg, 16, 24, s, { display: true, size: 11, fill: "#9a4a12", ls: "0.14em" }); }
  function inkLayer(svg) { return el("g", { filter: "url(#ink)" }, svg); }
  function wash(g, d, color, op) { return el("path", { d: d, fill: color, opacity: op == null ? 0.6 : op, filter: "url(#wash)" }, g); }
  function rectD(x, y, w, h) { return "M" + f(x) + "," + f(y) + " h" + f(w) + " v" + f(h) + " h" + f(-w) + "Z"; }
  function box(g, x, y, w, h, color, op, sw) {
    wash(g, rectD(x, y, w, h), color, op);
    return el("rect", { x: f(x), y: f(y), width: f(w), height: f(h), fill: "none", stroke: INK, "stroke-width": sw || 1.2 }, g);
  }
  function ghost(g, x, y, w, h) {
    return el("rect", { x: f(x), y: f(y), width: f(w), height: f(h), fill: "none", stroke: PENCIL, "stroke-width": 1.1, "stroke-dasharray": "3 2.5" }, g);
  }
  function path(g, d, o) {
    o = o || {};
    return el("path", { d: d, fill: o.fill || "none", stroke: o.stroke || INK, "stroke-width": o.w || 1.3, "stroke-linecap": "round", "stroke-linejoin": "round",
      "stroke-dasharray": o.dash || "", opacity: o.op == null ? "" : o.op }, g);
  }
  function arrow(g, x1, y1, x2, y2, o) {
    o = o || {};
    path(g, "M" + x1 + "," + y1 + " L" + x2 + "," + y2, o);
    var a = Math.atan2(y2 - y1, x2 - x1), s = o.head || 6;
    path(g, "M" + f(x2 - s * Math.cos(a - 0.45)) + "," + f(y2 - s * Math.sin(a - 0.45)) + " L" + x2 + "," + y2 + " L" + f(x2 - s * Math.cos(a + 0.45)) + "," + f(y2 - s * Math.sin(a + 0.45)), o);
  }
  function scallop(cx, cy, rx, ry, n, R) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2 + R() * 0.25, j = 0.86 + R() * 0.26;
      pts.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]);
    }
    var d = "M" + f(pts[0][0]) + "," + f(pts[0][1]);
    for (var k = 1; k <= n; k++) {
      var p = pts[k % n], q = pts[k - 1];
      var r = Math.hypot(p[0] - q[0], p[1] - q[1]) / 2 * (1.04 + R() * 0.3);
      d += " A" + f(r) + "," + f(r) + " 0 0 1 " + f(p[0]) + "," + f(p[1]);
    }
    return d + "Z";
  }
  function line(fn, x0, x1, step) {
    var d = "";
    for (var x = x0; x <= x1; x += step) d += (d ? " L" : "M") + f(x) + "," + f(fn(x));
    return d;
  }
  var clipN = 0;
  function clipTo(g, shapeD) {
    var id = "c" + (++clipN), cp = el("clipPath", { id: id }, g);
    el("path", { d: shapeD }, cp);
    return el("g", { "clip-path": "url(#" + id + ")" }, g);
  }
  function shadedBlob(g, d, washColor, washOp, sx, sy, sr, hatch) {
    if (washColor) wash(g, d, washColor, washOp);
    var id = "c" + (++clipN), cp = el("clipPath", { id: id }, g);
    el("circle", { cx: sx, cy: sy, r: sr }, cp);
    el("path", { d: d, fill: "url(#" + (hatch || "hatch") + ")" }, el("g", { "clip-path": "url(#" + id + ")" }, g));
    el("path", { d: d, fill: "none", stroke: INK, "stroke-width": 1.5, "stroke-linejoin": "round" }, g);
  }
  function cloud(g, cx, cy, rx, ry, R, paper) {
    [[0, 0, 1], [-rx * 0.55, ry * 0.25, 0.62], [rx * 0.55, ry * 0.3, 0.66]].forEach(function (p) {
      var d = scallop(cx + p[0], cy + p[1], rx * p[2], ry * p[2], 11, R);
      el("path", { d: d, fill: paper || "#f8f3e6" }, g);
      shadedBlob(g, d, "#8fb3c9", 0.22, cx + p[0] + rx * p[2] * 0.5, cy + p[1] + ry * p[2] * 1.15, rx * p[2] * 1.05, "hatch-fine");
    });
  }
  function grass(g, fn, x0, x1, R, every) {
    var d = "";
    for (var x = x0; x < x1; x += every * (0.6 + R() * 0.8)) {
      var y = fn(x) + 1, n = 2 + Math.floor(R() * 3);
      for (var i = 0; i < n; i++) {
        var dx = (i - n / 2) * 3 + R() * 2, h = 5 + R() * 8;
        d += " M" + f(x + dx) + "," + f(y) + " q" + f(dx * 0.4) + "," + f(-h * 0.6) + " " + f(dx * 0.9 + (R() - 0.5) * 4) + "," + f(-h);
      }
    }
    path(g, d, { w: 1 });
  }
  function stripes(g, tail, every) {
    var L = tail.getTotalLength(), d = "";
    for (var s = 8; s < L - 4; s += every) {
      var p = tail.getPointAtLength(s), p2 = tail.getPointAtLength(s + 1);
      var nx = -(p2.y - p.y), ny = p2.x - p.x, nl = Math.hypot(nx, ny) || 1;
      nx /= nl; ny /= nl;
      d += " M" + f(p.x + nx * 5) + "," + f(p.y + ny * 5) + " L" + f(p.x - nx * 3.5) + "," + f(p.y - ny * 3.5);
    }
    path(g, d, { w: 2.4 });
    var tip = tail.getPointAtLength(L - 1);
    el("circle", { cx: tip.x, cy: tip.y, r: 5.5, fill: INK }, g);
  }
  function drawFly(g, cx, cy, s) {
    var f0 = el("g", { transform: "translate(" + cx + "," + cy + ") scale(" + s + ")" }, g);
    path(f0, "M-8,-6 C-26,-14 -34,-30 -40,-34 M-10,2 C-30,2 -40,-4 -48,0 M-8,10 C-24,22 -30,34 -36,42 M8,-6 C26,-14 34,-30 40,-34 M10,2 C30,2 40,-4 48,0 M8,10 C24,22 30,34 36,42", { w: 1.4 });
    [[-22, 22], [22, -22]].forEach(function (w) {
      el("ellipse", { cx: w[0], cy: 26, rx: 15, ry: 40, transform: "rotate(" + w[1] + " " + w[0] + " 26)", fill: "#cfe1ea", opacity: .5 }, f0);
    });
    path(f0, "M-10,0 C-30,20 -40,50 -34,62 M-14,10 C-24,30 -26,46 -22,58 M10,0 C30,20 40,50 34,62 M14,10 C24,30 26,46 22,58", { w: .7, op: .7 });
    [[-22, 22], [22, -22]].forEach(function (w) {
      el("ellipse", { cx: w[0], cy: 26, rx: 15, ry: 40, transform: "rotate(" + w[1] + " " + w[0] + " 26)", fill: "none", stroke: INK, "stroke-width": 1.2 }, f0);
    });
    el("ellipse", { cx: 0, cy: 32, rx: 11, ry: 20, fill: "#d9a35a", opacity: .9, filter: "url(#wash)" }, f0);
    path(f0, "M-10,26 Q0,30 10,26 M-10,34 Q0,38 10,34 M-8,42 Q0,46 8,42", { stroke: "#3a2a1a", w: 3 });
    el("ellipse", { cx: 0, cy: 32, rx: 11, ry: 20, fill: "none", stroke: INK, "stroke-width": 1.4 }, f0);
    el("ellipse", { cx: 0, cy: 2, rx: 12, ry: 12, fill: "#c99550", stroke: INK, "stroke-width": 1.4 }, f0);
    el("ellipse", { cx: 0, cy: -16, rx: 10, ry: 7, fill: "#c99550", stroke: INK, "stroke-width": 1.2 }, f0);
    el("circle", { cx: -9, cy: -18, r: 6.5, fill: "#c0392b", stroke: INK, "stroke-width": 1.1 }, f0);
    el("circle", { cx: 9, cy: -18, r: 6.5, fill: "#c0392b", stroke: INK, "stroke-width": 1.1 }, f0);
    path(f0, "M-4,-24 l-6,-10 M4,-24 l6,-10", { w: 1 });
  }

  // ---------------------------------------------------------------- torn edge, generated once
  (function () {
    var R = rng(31), pts = "M0,16 L0,8";
    for (var x = 0; x <= 320; x += 4 + R() * 6) pts += " L" + f(x) + "," + f(3 + R() * 9);
    pts += " L320,8 L320,16Z";
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 16' preserveAspectRatio='none'><path d='" + pts + "'/></svg>";
    document.documentElement.style.setProperty("--tear", "url(\"data:image/svg+xml," + encodeURIComponent(svg) + "\")");
  })();

  // ---------------------------------------------------------------- the front: an explorer's chart of the duplicated genome
  // An old sea chart: paralog pairs are twin islands of the same shape, transposons a scatter of identical islets,
  // a small boat wanders a dotted course among them, and a sea serpent with a double-helix body guards the corner.
  function blobPoints(seed, rx, ry, n) {
    var R = rng(seed), pts = [];
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2, k = 0.78 + R() * 0.3 + 0.12 * Math.sin(a * 3 + seed);
      pts.push([Math.cos(a) * rx * k, Math.sin(a) * ry * k]);
    }
    return pts;
  }
  function smoothClosed(pts, cx, cy, sx, sy) {
    sx = sx || 1; sy = sy || 1;
    var P = pts.map(function (p) { return [cx + p[0] * sx, cy + p[1] * sy]; }), n = P.length, d = "M" + f(P[0][0]) + "," + f(P[0][1]);
    for (var i = 0; i < n; i++) {
      var p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
      d += " C" + f(p1[0] + (p2[0] - p0[0]) / 6) + "," + f(p1[1] + (p2[1] - p0[1]) / 6) + " " + f(p2[0] - (p3[0] - p1[0]) / 6) + "," + f(p2[1] - (p3[1] - p1[1]) / 6) + " " + f(p2[0]) + "," + f(p2[1]);
    }
    return d + "Z";
  }
  (function () {
    var svg = $("map"); if (!svg) return;
    var W = 640, H = 360, R = rng(5);
    var SEA = "#6f8aa0", LAND = "#d9c597";
    var frame = el("clipPath", { id: "chartclip" }, svg);
    el("rect", { x: 17, y: 17, width: W - 34, height: H - 34 }, frame);
    var under = el("g", { "clip-path": "url(#chartclip)" }, svg), g = el("g", { filter: "url(#ink)" }, el("g", { "clip-path": "url(#chartclip)" }, svg));
    // the sea: fine ruled lines, as on an engraved chart
    var sea = "";
    for (var y = 22; y < H - 18; y += 5) sea += " M22," + y + " L" + (W - 22) + "," + y;
    path(under, sea, { w: .5, stroke: SEA, op: .32 });

    function island(seed, cx, cy, rx, ry, label, sub, opts) {
      opts = opts || {};
      var pts = blobPoints(seed, rx, ry, 11), coast = smoothClosed(pts, cx, cy);
      // water lines ringing the coast, fainter as they move out
      [9, 6, 3].forEach(function (d, i) {
        path(under, smoothClosed(pts, cx, cy, 1 + d / rx, 1 + d / ry), { w: .7, stroke: SEA, op: .25 + i * .15 });
      });
      el("path", { d: coast, fill: "#f4eedf" }, under);
      wash(g, coast, opts.tint || LAND, .75);
      // stipple and a few hills
      var R2 = rng(seed + 9), dots = "";
      for (var k = 0; k < rx * ry / 18; k++) {
        var a = R2() * Math.PI * 2, r = Math.sqrt(R2()) * .7;
        dots += " M" + f(cx + Math.cos(a) * rx * r) + "," + f(cy + Math.sin(a) * ry * r) + " l.6,0";
      }
      path(g, dots, { w: 1, stroke: INK, op: .45 });
      if (rx > 22) for (var h = 0; h < 3; h++) {
        var hx = cx - rx * .35 + h * rx * .3, hy = cy - ry * .1 + (h % 2) * 4;
        path(g, "M" + f(hx - 5) + "," + f(hy + 3) + " L" + f(hx) + "," + f(hy - 4) + " L" + f(hx + 5) + "," + f(hy + 3), { w: 1 });
        path(g, "M" + f(hx) + "," + f(hy - 4) + " L" + f(hx + 2.5) + "," + f(hy + 3), { w: .6, op: .6 });
      }
      path(g, coast, { w: 1.3 });
      if (label) {
        note(svg, cx + (opts.lx || 0), cy + ry + 15 + (opts.ly || 0), label, { size: 13, fill: INK, anchor: "middle" });
        if (sub) note(svg, cx + (opts.lx || 0), cy + ry + 27 + (opts.ly || 0), sub, { size: 9.5, anchor: "middle", roman: true });
      }
    }
    // twin islands: the same coastline, set down twice
    island(41, 150, 118, 44, 26, "PMS2", "the gene");
    island(41, 262, 186, 44, 26, "PMS2CL", "the pseudogene", { tint: "#cbbf9c" });
    island(77, 418, 92, 26, 15, "SMN1");
    island(77, 474, 120, 26, 15, "SMN2", null, { lx: 8 });
    island(93, 520, 236, 22, 13, "HBA2", null, { lx: -2 });
    island(93, 574, 252, 22, 13, "HBA1");
    island(58, 82, 248, 30, 18, "CYP21A2");
    island(58, 160, 284, 30, 18, "CYP21A1P", null, { tint: "#cbbf9c" });
    // transposons: one small islet, copied again and again across the chart
    var isle = blobPoints(12, 6, 4, 8), tes = [[246, 52], [268, 64], [292, 50], [318, 62], [342, 48], [366, 60], [548, 152], [572, 140], [596, 158]];
    tes.forEach(function (t) {
      [3].forEach(function (d) { path(under, smoothClosed(isle, t[0], t[1], 1 + d / 6, 1 + d / 4), { w: .6, stroke: SEA, op: .45 }); });
      var c = smoothClosed(isle, t[0], t[1]);
      el("path", { d: c, fill: "#f4eedf" }, under); wash(g, c, "#b9c48f", .8); path(g, c, { w: 1 });
    });
    note(svg, 306, 84, "transposons: one islet, copied many times", { size: 11, anchor: "middle" });

    // the explorer's course: a dotted line wandering from the left edge through the islands and on, off the chart
    var course = "M24,182 C70,170 96,150 122,160 S200,214 214,152 S300,120 330,140 S390,170 420,154 S470,180 500,186 S560,196 590,200 S622,220 640,214";
    path(g, course, { w: 1.2, dash: "2 5", stroke: "#8a3b2a" });
    // the boat, partway along
    var bx = 330, by = 140;
    var boat = el("g", { transform: "translate(" + bx + "," + (by - 2) + ")" }, g);
    el("path", { d: "M-11,0 L11,0 L7,5 L-7,5Z", fill: "#7a4f2e", stroke: INK, "stroke-width": 1 }, boat);
    path(boat, "M0,0 L0,-19", { w: 1.1 });
    el("path", { d: "M1,-18 L11,-3 L1,-3Z", fill: "#fbf7ec", stroke: INK, "stroke-width": .9 }, boat);
    el("path", { d: "M-1,-17 L-9,-4 L-1,-4Z", fill: "#efe6cf", stroke: INK, "stroke-width": .8 }, boat);
    el("path", { d: "M0,-19 l6,1.6 l-6,1.6Z", fill: "#a8432e" }, boat);
    path(boat, "M-14,7 q4,-2 8,0 M8,7 q4,-2 8,0", { w: .7, stroke: SEA });

    // a sea serpent whose body is a double helix
    var sx0 = 352, sy0 = 316;
    path(g, "M" + (sx0 - 30) + "," + (sy0 + 1) + " q6,-3 12,0 M" + (sx0 + 120) + "," + (sy0 + 1) + " q6,-3 12,0", { w: .8, stroke: SEA });
    var s1 = "", s2 = "", rung = "";
    for (var t = 0; t <= 1.0001; t += 0.01) {
      var x = sx0 - 18 + t * 132, hump = Math.max(0, Math.sin(t * Math.PI * 3)), yy = sy0 - hump * 20;
      var tw = Math.sin(t * 34) * 4.2 * (hump > .05 ? 1 : 0);
      if (hump <= .02) { s1 += " M" + f(x) + "," + f(yy); s2 += " M" + f(x) + "," + f(yy); continue; }
      s1 += (s1 ? " L" : "M") + f(x) + "," + f(yy + tw); s2 += (s2 ? " L" : "M") + f(x) + "," + f(yy - tw);
      if (Math.round(t * 100) % 3 === 0 && Math.abs(tw) > 1.5) rung += " M" + f(x) + "," + f(yy + tw) + " L" + f(x) + "," + f(yy - tw);
    }
    path(g, rung, { w: .9, stroke: "#a8432e", op: .8 });
    var rip = "";
    for (var k2 = 0; k2 <= 3; k2++) { var rx2 = sx0 - 18 + k2 / 3 * 132; rip += " M" + f(rx2 - 9) + "," + (sy0 + 3) + " q3,-2.4 6,0 q3,2.4 6,0 q3,-2.4 6,0"; }
    path(g, rip, { w: .8, stroke: SEA });
    path(g, s1, { w: 1.6 }); path(g, s2, { w: 1.6, stroke: "#2c4f72" });
    // its head, rising from the last hump
    var hx = sx0 + 118, hy = sy0 - 6;
    el("path", { d: "M" + (hx - 6) + "," + (hy + 6) + " C" + (hx - 4) + "," + (hy - 10) + " " + (hx + 8) + "," + (hy - 16) + " " + (hx + 16) + "," + (hy - 10) + " C" + (hx + 20) + "," + (hy - 7) + " " + (hx + 16) + "," + (hy - 3) + " " + (hx + 9) + "," + (hy - 4) + " C" + (hx + 4) + "," + (hy - 3) + " " + (hx + 2) + "," + (hy + 2) + " " + (hx + 2) + "," + (hy + 6) + "Z",
      fill: "#8fa3a0", stroke: INK, "stroke-width": 1.1 }, g);
    el("circle", { cx: hx + 10, cy: hy - 10, r: 1.2, fill: INK }, g);
    path(g, "M" + (hx + 17) + "," + (hy - 8) + " l5,1 m-5,-1 l4,-3", { w: .8, stroke: "#a8432e" });
    // and the banner beside it
    var bnx = 240, bny = 300;
    el("path", { d: "M" + (bnx - 4) + "," + (bny + 4) + " l-8,-4 l8,-4 Z M" + (bnx + 82) + "," + (bny + 4) + " l8,-4 l-8,-4 Z", fill: "#e9dcbd", stroke: INK, "stroke-width": .8 }, g);
    el("rect", { x: bnx - 4, y: bny - 10, width: 86, height: 16, fill: "#f6efdc", stroke: INK, "stroke-width": .9 }, g);
    note(svg, bnx + 39, bny + 2, "Here be paralogs", { size: 11, fill: INK, anchor: "middle" });

    // a small compass rose
    var cx = 586, cy = 60, cr = rng(3);
    el("circle", { cx: cx, cy: cy, r: 22, fill: "none", stroke: INK, "stroke-width": .8 }, g);
    [0, 1, 2, 3].forEach(function (k) {
      var a = -Math.PI / 2 + k * Math.PI / 2, L = 26, wdt = 5;
      var tip = [cx + Math.cos(a) * L, cy + Math.sin(a) * L], l = [cx + Math.cos(a - Math.PI / 2) * wdt, cy + Math.sin(a - Math.PI / 2) * wdt], r = [cx + Math.cos(a + Math.PI / 2) * wdt, cy + Math.sin(a + Math.PI / 2) * wdt];
      el("path", { d: "M" + cx + "," + cy + " L" + f(l[0]) + "," + f(l[1]) + " L" + f(tip[0]) + "," + f(tip[1]) + "Z", fill: k === 0 ? "#a8432e" : INK, stroke: INK, "stroke-width": .7 }, g);
      el("path", { d: "M" + cx + "," + cy + " L" + f(r[0]) + "," + f(r[1]) + " L" + f(tip[0]) + "," + f(tip[1]) + "Z", fill: "#fbf7ec", stroke: INK, "stroke-width": .7 }, g);
    });
    note(svg, cx, cy - 31, "N", { size: 10, fill: INK, anchor: "middle", roman: true });

    // the cartouche
    el("rect", { x: 30, y: 28, width: 168, height: 46, fill: "#f6efdc", stroke: INK, "stroke-width": .9 }, svg);
    el("rect", { x: 33, y: 31, width: 162, height: 40, fill: "none", stroke: INK, "stroke-width": .5 }, svg);
    note(svg, 114, 48, "A CHART OF THE", { size: 9, fill: INK, anchor: "middle", roman: true, ls: ".18em" });
    note(svg, 114, 63, "Duplicated Genome", { size: 14, fill: INK, anchor: "middle" });

    // the border: a double rule with alternating degree marks, as on old charts
    el("rect", { x: 10, y: 10, width: W - 20, height: H - 20, fill: "none", stroke: INK, "stroke-width": 1.4 }, svg);
    el("rect", { x: 16, y: 16, width: W - 32, height: H - 32, fill: "none", stroke: INK, "stroke-width": .7 }, svg);
    var ticks = "";
    for (var x2 = 16, i2 = 0; x2 < W - 16; x2 += 24, i2++) if (i2 % 2 === 0) ticks += " M" + x2 + ",13 L" + Math.min(W - 16, x2 + 24) + ",13 M" + x2 + "," + (H - 13) + " L" + Math.min(W - 16, x2 + 24) + "," + (H - 13);
    for (var y2 = 16, j2 = 0; y2 < H - 16; y2 += 24, j2++) if (j2 % 2 === 0) ticks += " M13," + y2 + " L13," + Math.min(H - 16, y2 + 24) + " M" + (W - 13) + "," + y2 + " L" + (W - 13) + "," + Math.min(H - 16, y2 + 24);
    path(svg, ticks, { w: 3.2 });
  })();

  // ---------------------------------------------------------------- masthead mark: a compass rose
  (function () {
    var svg = $("mark"); if (!svg) return;
    var g = inkLayer(svg), cx = 100, cy = 110;
    el("circle", { cx: cx, cy: cy, r: 78, fill: "none", stroke: INK, "stroke-width": 1.2 }, g);
    el("circle", { cx: cx, cy: cy, r: 70, fill: "none", stroke: INK, "stroke-width": .8 }, g);
    var ticks = "";
    for (var i = 0; i < 64; i++) {
      var a = i / 64 * Math.PI * 2, r1 = i % 8 ? 70 : 62;
      ticks += " M" + f(cx + Math.cos(a) * r1) + "," + f(cy + Math.sin(a) * r1) + " L" + f(cx + Math.cos(a) * 78) + "," + f(cy + Math.sin(a) * 78);
    }
    path(g, ticks, { w: .7 });
    function point(a, len, wid, fill) {
      var tip = [cx + Math.cos(a) * len, cy + Math.sin(a) * len];
      var l = [cx + Math.cos(a - Math.PI / 2) * wid, cy + Math.sin(a - Math.PI / 2) * wid];
      var r = [cx + Math.cos(a + Math.PI / 2) * wid, cy + Math.sin(a + Math.PI / 2) * wid];
      el("path", { d: "M" + f(cx) + "," + f(cy) + " L" + f(l[0]) + "," + f(l[1]) + " L" + f(tip[0]) + "," + f(tip[1]) + "Z", fill: fill, stroke: INK, "stroke-width": 1 }, g);
      el("path", { d: "M" + f(cx) + "," + f(cy) + " L" + f(r[0]) + "," + f(r[1]) + " L" + f(tip[0]) + "," + f(tip[1]) + "Z", fill: "#fbf6e8", stroke: INK, "stroke-width": 1 }, g);
    }
    for (var k = 0; k < 4; k++) point(Math.PI / 4 + k * Math.PI / 2, 40, 7, "#8fa1b6");
    for (var j = 0; j < 4; j++) point(-Math.PI / 2 + j * Math.PI / 2, 60, 10, j === 0 ? "#c0392b" : "#5a5047");
    el("circle", { cx: cx, cy: cy, r: 4, fill: "#fbf6e8", stroke: INK, "stroke-width": 1 }, g);
    note(svg, cx, 22, "N", { display: true, size: 15, fill: INK, anchor: "middle" });
  })();

  // ---------------------------------------------------------------- the four plates: where duplicated genes come from
  function chromosome(g, x0, x1, y, h, R, segs) {
    var mid = (x0 + x1) / 2 - 30, r = h / 2;
    var d = "M" + (x0 + r) + "," + (y - r) + " L" + (mid - 6) + "," + (y - r) + " Q" + mid + "," + (y - r + 5) + " " + (mid + 6) + "," + (y - r) +
      " L" + (x1 - r) + "," + (y - r) + " A" + r + "," + r + " 0 0 1 " + (x1 - r) + "," + (y + r) + " L" + (mid + 6) + "," + (y + r) +
      " Q" + mid + "," + (y + r - 5) + " " + (mid - 6) + "," + (y + r) + " L" + (x0 + r) + "," + (y + r) + " A" + r + "," + r + " 0 0 1 " + (x0 + r) + "," + (y - r) + "Z";
    el("path", { d: d, fill: "#f6efdc" }, g);
    var inside = clipTo(g, d);
    for (var x = x0 + 14; x < x1 - 10; x += 18 + R() * 22) el("rect", { x: f(x), y: y - r, width: f(5 + R() * 9), height: h, fill: "url(#hatch-fine)" }, inside);
    (segs || []).forEach(function (s) {
      wash(inside, rectD(s[0], y - r, s[1] - s[0], h), s[2] || B, .85);
      el("rect", { x: s[0], y: y - r, width: s[1] - s[0], height: h, fill: "none", stroke: INK, "stroke-width": 1 }, inside);
      (s[3] || []).forEach(function (m) { el("line", { x1: m, y1: y - r, x2: m, y2: y + r, stroke: RED, "stroke-width": 2 }, inside); });
    });
    path(g, d, { w: 1.5 });
  }
  (function () {
    var svg = $("pl1"); if (!svg) return;
    var g = inkLayer(svg), R = rng(61);
    plateNo(svg, "PL. I");
    note(svg, 370, 112, "an ancestral chromosome", { size: 12.5, anchor: "end" });
    chromosome(g, 30, 370, 84, 22, R, [[96, 150]]);
    path(g, "M123,70 C134,38 268,38 286,68", { w: 1.3, dash: "4 3" });
    arrow(g, 284, 62, 287, 70, { w: 1.3 });
    note(svg, 205, 40, "copied", { size: 12.5, anchor: "middle" });
    arrow(g, 200, 112, 200, 152, { w: 1.2 });
    note(svg, 212, 132, "millions of years", { size: 12.5 });
    note(svg, 30, 172, "today", { size: 12.5 });
    chromosome(g, 30, 370, 192, 22, rng(61), [[96, 150], [260, 314, B, [272, 301]]]);
    note(svg, 123, 226, "original", { size: 12.5, anchor: "middle" });
    note(svg, 287, 226, "copy", { size: 12.5, anchor: "middle" });
    note(svg, 287, 242, "with a few changes", { size: 11, anchor: "middle", fill: RED });
  })();
  // a small portrait of each species, drawn so the five read apart at a glance
  function primate(svg, kind, cx, cy) {
    var g = el("g", { transform: "translate(" + cx + "," + cy + ") scale(1.25)" }, svg), w = 1;
    function e(x, y, rx, ry, fill, sw) { return el("ellipse", { cx: x, cy: y, rx: rx, ry: ry, fill: fill, stroke: INK, "stroke-width": sw == null ? w : sw }, g); }
    function p(d, fill, sw) { return el("path", { d: d, fill: fill || "none", stroke: INK, "stroke-width": sw == null ? w : sw, "stroke-linejoin": "round", "stroke-linecap": "round" }, g); }
    function eyes(y, dx, r) { el("circle", { cx: -dx, cy: y, r: r || 1, fill: INK }, g); el("circle", { cx: dx, cy: y, r: r || 1, fill: INK }, g); }
    if (kind === "macaque") {
      // grey-brown fur, small ears, a pink bare face with a short muzzle
      e(-9, -1, 2.4, 2.8, "#e2a99a"); e(9, -1, 2.4, 2.8, "#e2a99a");
      e(0, -0.5, 9, 9.5, "#9b8a74");
      p("M-6,-4 C-6,-9 6,-9 6,-4 C7,2 4,8 0,8 C-4,8 -7,2 -6,-4Z", "#e7a596", .8);
      eyes(-2.5, 2.3, 1); p("M-1.6,1.4 l.6,.6 M1.6,1.4 l-.6,.6 M-2,4.6 Q0,5.6 2,4.6", null, .8);
    } else if (kind === "orangutan") {
      // a flanged male: a wide dark face framed by cheek pads and long orange hair
      p("M-13,4 C-14,-6 -8,-12 0,-12 C8,-12 14,-6 13,4 C12,11 5,13 0,13 C-5,13 -12,11 -13,4Z", "#c2622e");
      e(0, 1, 10.5, 8, "#5d4637", .9);
      e(0, 2.5, 5, 6, "#7a5c47", .7); eyes(-0.5, 2.4, 1); p("M-2.4,5.2 Q0,6.6 2.4,5.2", null, .8);
      p("M-12.5,-3 l-2.6,1.6 M-13.2,1.5 l-2.8,1.2 M-12.8,6 l-2.4,1.8 M12.5,-3 l2.6,1.6 M13.2,1.5 l2.8,1.2 M12.8,6 l2.4,1.8", null, .9);
    } else if (kind === "gorilla") {
      // black, with the tall crest of a silverback and a heavy brow over a wide nose
      p("M-9,6 C-11,-3 -7,-9 -3,-13 C-1,-15 1,-15 3,-13 C7,-9 11,-3 9,6 C7,11 -7,11 -9,6Z", "#2d2826");
      p("M-6.5,-2.2 Q0,-4.4 6.5,-2.2", "none", 2.2);
      e(0, 4, 5.4, 4.2, "#4a403b", .7);
      el("ellipse", { cx: -1.6, cy: 3.6, rx: 1.1, ry: .8, fill: "#151210" }, g); el("ellipse", { cx: 1.6, cy: 3.6, rx: 1.1, ry: .8, fill: "#151210" }, g);
      el("circle", { cx: -2.6, cy: 0, r: .9, fill: "#e8dccb" }, g); el("circle", { cx: 2.6, cy: 0, r: .9, fill: "#e8dccb" }, g);
    } else if (kind === "chimpanzee") {
      // big round ears, dark fur, a pale face with a jutting brow and muzzle
      e(-10, 0, 3.8, 4.6, "#d9b38c"); e(10, 0, 3.8, 4.6, "#d9b38c");
      e(0, -1, 8.6, 9.6, "#3d3029");
      p("M-6,-3 C-6,-7 6,-7 6,-3 C7,3 5,9 0,9 C-5,9 -7,3 -6,-3Z", "#dcb48d", .8);
      p("M-5.5,-3.2 Q0,-5.4 5.5,-3.2", null, 1.3);
      eyes(-1.6, 2.3, 1); p("M-3,5 Q0,7 3,5", null, .8);
    } else {
      // a human: a rounder head, hair, a nose and a small mouth
      e(0, 0.8, 7.6, 9.6, "#ecc6a3");
      p("M-7.8,-1 C-8.4,-9.4 -3,-11.2 0,-11.2 C3.4,-11.2 8.4,-9.2 7.8,-1 C6,-6.4 -1,-7.6 -7.8,-1Z", "#2c2420", .8);
      e(-7.8, 1.6, 1.4, 2.2, "#ecc6a3", .8); e(7.8, 1.6, 1.4, 2.2, "#ecc6a3", .8);
      eyes(0.8, 2.7, 1); p("M0,1.8 L-.9,4.4 L.6,4.6 M-2.2,6.8 Q0,7.8 2.2,6.8", null, .8);
    }
  }
  (function () {
    var svg = $("pl2"); if (!svg) return;
    var g = inkLayer(svg), R = rng(62);
    plateNo(svg, "PL. II");
    var leaves = [["macaque", 42], ["orangutan", 82], ["gorilla", 122], ["chimpanzee", 162], ["human", 202]];
    var LX = 276, hc = [232, 182], ghc = [176, 152], oghc = [114, 117], root = [48, 79.5];
    function elbow(px, py, cx, cy, marks, thick) {
      path(g, "M" + px + "," + py + " L" + px + "," + cy + " L" + cx + "," + cy, { w: thick ? 3.4 : 1.4, stroke: thick ? "#c0392b" : INK });
      for (var i = 0; i < marks; i++) {
        var mx = px + (cx - px) * (i + 1) / (marks + 1) + (R() - .5) * 3;
        el("rect", { x: f(mx - 3), y: f(cy - 9), width: 6, height: 6, fill: "#d9782a", stroke: INK, "stroke-width": .8 }, g);
      }
    }
    elbow(root[0], root[1], LX, leaves[0][1], 2);
    elbow(root[0], root[1], oghc[0], oghc[1], 2);
    elbow(oghc[0], oghc[1], LX, leaves[1][1], 3);
    elbow(oghc[0], oghc[1], ghc[0], ghc[1], 7, true);
    elbow(ghc[0], ghc[1], LX, leaves[2][1], 3);
    elbow(ghc[0], ghc[1], hc[0], hc[1], 2);
    elbow(hc[0], hc[1], LX, leaves[3][1], 2);
    elbow(hc[0], hc[1], LX, leaves[4][1], 2);
    path(g, "M" + (root[0] - 14) + "," + root[1] + " L" + root[0] + "," + root[1], { w: 1.4 });
    leaves.forEach(function (l) {
      primate(svg, l[0], LX + 18, l[1]);
      note(svg, LX + 38, l[1] + 4.5, l[0], { size: 13, fill: INK, roman: true });
    });
    note(svg, 166, 176, "a burst of duplication", { size: 12, fill: "#9a4a12", anchor: "end", roman: true });
    note(svg, 166, 193, "~8–12 million years ago", { size: 11.5, anchor: "end", roman: true });
    el("rect", { x: 278, y: 13, width: 6, height: 6, fill: "#d9782a", stroke: INK, "stroke-width": .8 }, g);
    note(svg, 290, 20, "duplication events", { size: 11, roman: true });
  })();
  function geneModel(g, x, y, w, color, opts) {
    opts = opts || {};
    path(g, "M" + x + "," + y + " L" + (x + w) + "," + y, { w: 1.4 });
    var ex = [[0, .12], [.2, .08], [.36, .1], [.54, .07], [.7, .1], [.86, .14]];
    ex.forEach(function (e, i) {
      var bx = x + e[0] * w, bw = e[1] * w;
      if (opts.missing === i) { ghost(g, bx, y - 9, bw, 18); return; }
      if (opts.faded) { wash(g, rectD(bx, y - 9, bw, 18), color, .3); el("rect", { x: f(bx), y: y - 9, width: f(bw), height: 18, fill: "none", stroke: PENCIL, "stroke-width": 1.1 }, g); }
      else box(g, bx, y - 9, bw, 18, color, .8);
      if (opts.broken && opts.broken.indexOf(i) >= 0) path(g, "M" + f(bx + 2) + "," + (y - 7) + " L" + f(bx + bw - 2) + "," + (y + 7) + " M" + f(bx + bw - 2) + "," + (y - 7) + " L" + f(bx + 2) + "," + (y + 7), { stroke: RED, w: 2 });
    });
  }
  (function () {
    var svg = $("pl3"); if (!svg) return;
    var g = inkLayer(svg);
    plateNo(svg, "PL. III");
    note(svg, 30, 50, "both copies keep working", { size: 12.5, fill: "#9a4a12" });
    geneModel(g, 30, 76, 150, "#b5543b");
    geneModel(g, 220, 76, 150, "#b5543b");
    note(svg, 105, 104, "HBA2", { size: 13, fill: INK, anchor: "middle" });
    note(svg, 295, 104, "HBA1", { size: 13, fill: INK, anchor: "middle" });
    // the two genes make the same protein
    path(g, "M30,112 l0,5 l340,0 l0,-5", { w: 1, stroke: "#b5543b" });
    note(svg, 200, 132, "together they make α-globin, half of adult haemoglobin", { size: 12, anchor: "middle", fill: "#8e3a28", roman: true });
    path(g, "M30,146 L370,146", { w: .8, dash: "2 4", op: .6 });
    note(svg, 30, 168, "one copy decays into a pseudogene", { size: 12.5, fill: "#9a4a12" });
    geneModel(g, 30, 192, 150, A);
    geneModel(g, 220, 192, 150, A, { faded: true, broken: [1, 4], missing: 3 });
    note(svg, 105, 220, "PMS2", { size: 13, fill: INK, anchor: "middle" });
    note(svg, 295, 220, "PMS2CL", { size: 13, fill: INK, anchor: "middle" });
    note(svg, 105, 236, "DNA mismatch repair;", { size: 11.5, anchor: "middle", fill: "#2c4f72", roman: true });
    note(svg, 105, 250, "losing it causes Lynch syndrome", { size: 11.5, anchor: "middle", fill: "#2c4f72", roman: true });
    note(svg, 295, 236, "disabled, but", { size: 11.5, anchor: "middle", roman: true });
    note(svg, 295, 250, "still almost identical", { size: 11.5, anchor: "middle", roman: true });
  })();
  (function () {
    var svg = $("pl4"); if (!svg) return;
    var g = inkLayer(svg);
    plateNo(svg, "PL. IV");
    var gene = "GATTCAAGGTCCAT", pseudo = "GATTCAAGGTCTAT", x0 = 156, dx = 16, r0 = 2, r1 = 10;
    // the stretch the two copies share, shaded across both rows
    wash(g, rectD(x0 + r0 * dx - 9, 38, (r1 - r0) * dx + 2, 58), "#e6c98f", .5);
    function strand(y, label, sub, seq) {
      note(svg, 140, y + 1, label, { size: 14, fill: INK, anchor: "end" });
      note(svg, 140, y + 16, sub, { size: 11.5, anchor: "end", roman: true });
      for (var i = 0; i < seq.length; i++) {
        var hot = seq[i] !== (seq === gene ? pseudo : gene)[i];
        el("text", { x: x0 + i * dx, y: y + 5, "text-anchor": "middle", "font-family": SERIF, "font-size": 16, fill: hot ? RED : INK, "font-weight": hot ? 500 : 400 }, svg, seq[i]);
      }
    }
    strand(52, "PMS2", "the gene", gene);
    strand(86, "PMS2CL", "the pseudogene", pseudo);
    note(svg, x0 + 11 * dx, 116, "the one difference", { size: 11.5, fill: RED, anchor: "middle", roman: true });
    // a short read copied from the shared stretch
    var rx = x0 + r0 * dx - 9, rw = (r1 - r0) * dx + 2;
    el("rect", { x: f(rx), y: 134, width: f(rw), height: 26, fill: "#fffdf6", stroke: INK, "stroke-width": 1.2 }, g);
    for (var i = r0; i < r1; i++) el("text", { x: x0 + i * dx, y: 152, "text-anchor": "middle", "font-family": SERIF, "font-size": 16, fill: INK }, svg, gene[i]);
    note(svg, 140, 147, "a short read", { size: 14, fill: INK, anchor: "end" });
    note(svg, 140, 162, "from the sample", { size: 11.5, anchor: "end", roman: true });
    note(svg, rx + rw + 12, 145, "matches", { size: 12.5, fill: INK, roman: true });
    note(svg, rx + rw + 12, 160, "both copies", { size: 12.5, fill: INK, roman: true });
    path(g, "M" + f(rx + rw / 2) + ",132 L" + f(rx + rw / 2) + ",100", { w: 1, dash: "3 3" });
    note(svg, 200, 202, "So the test cannot tell which gene the read came from:", { size: 13, fill: INK, anchor: "middle", roman: true });
    note(svg, 200, 222, "a real variant can be missed, or a pseudogene", { size: 13, fill: INK, anchor: "middle", roman: true });
    note(svg, 200, 240, "difference mistaken for one.", { size: 13, fill: INK, anchor: "middle", roman: true });
  })();

  // ---------------------------------------------------------------- plates V and VI: transposable elements
  (function () {
    var svg = $("pl5"); if (!svg) return;
    var g = inkLayer(svg), R = rng(91), TEc = "#c0392b";
    plateNo(svg, "PL. V");
    // an ear of maize with spotted kernels, as in McClintock's work
    var mx = 46, my = 136;
    el("path", { d: "M" + (mx - 4) + "," + (my + 70) + " C" + (mx - 30) + "," + (my + 40) + " " + (mx - 24) + "," + (my - 10) + " " + (mx - 14) + "," + (my - 30), fill: "#b9c48f", opacity: .8, stroke: INK, "stroke-width": 1 }, g);
    el("ellipse", { cx: mx, cy: my, rx: 17, ry: 62, fill: "#efd48a", stroke: INK, "stroke-width": 1.3 }, g);
    for (var ky = my - 54; ky < my + 56; ky += 8) for (var kx = -12; kx <= 12; kx += 8) {
      var w = Math.sqrt(Math.max(0, 1 - Math.pow((ky - my) / 62, 2))) * 17;
      if (Math.abs(kx) > w - 4) continue;
      var spot = R() < .32;
      el("ellipse", { cx: mx + kx, cy: ky, rx: 3.4, ry: 3.2, fill: spot ? "#6b3a5a" : "#f3dc9a", stroke: INK, "stroke-width": .5, opacity: .95 }, g);
    }
    el("path", { d: "M" + (mx + 4) + "," + (my + 70) + " C" + (mx + 26) + "," + (my + 40) + " " + (mx + 24) + "," + (my - 6) + " " + (mx + 14) + "," + (my - 26), fill: "#a7b77a", opacity: .85, stroke: INK, "stroke-width": 1 }, g);
    note(svg, mx, 226, "maize, where", { size: 10.5, anchor: "middle", roman: true });
    note(svg, mx, 238, "they were found", { size: 10.5, anchor: "middle", roman: true });
    function chrom(y) { el("rect", { x: 104, y: y - 8, width: 280, height: 16, rx: 8, fill: "#f6efdc", stroke: INK, "stroke-width": 1.3 }, g); }
    // cut and paste
    note(svg, 104, 34, "cut and paste", { size: 13, fill: INK });
    note(svg, 196, 34, "(DNA transposons)", { size: 11, roman: true });
    chrom(80);
    ghost(g, 140, 72, 28, 16);
    box(g, 300, 72, 28, 16, TEc, .85);
    path(g, "M154,68 C182,46 288,46 312,66", { w: 1.3, dash: "4 4" });
    arrow(g, 306, 58, 312, 67, { w: 1.3 });
    note(svg, 154, 104, "leaves", { size: 11, anchor: "middle", roman: true });
    note(svg, 314, 104, "moves", { size: 11, anchor: "middle", roman: true });
    // copy and paste
    note(svg, 104, 134, "copy and paste", { size: 13, fill: INK });
    note(svg, 206, 134, "(retrotransposons)", { size: 11, roman: true });
    chrom(186);
    box(g, 140, 178, 28, 16, TEc, .85);
    box(g, 300, 178, 28, 16, TEc, .85);
    var rna = "M154,174";
    for (var x = 160; x <= 300; x += 6) rna += " L" + x + "," + f(170 - 12 * Math.sin((x - 154) / 140 * Math.PI) + 2.2 * Math.sin(x / 3));
    path(g, rna, { w: 1.2, stroke: "#9a4a12" });
    arrow(g, 304, 165, 312, 174, { w: 1.2, stroke: "#9a4a12" });
    note(svg, 232, 212, "an RNA copy makes a new insertion", { size: 11, anchor: "middle", roman: true });
    note(svg, 244, 236, "the old copy stays, so numbers grow", { size: 11, anchor: "middle", fill: "#9a4a12", roman: true });
  })();
  (function () {
    var svg = $("pl6"); if (!svg) return;
    var g = inkLayer(svg);
    plateNo(svg, "PL. VI");
    // the human genome as one bar, from Lander et al. 2001
    var x0 = 20, W = 360, y = 92, h = 26;
    var parts = [["LINEs", 20.4, "#a8432e"], ["SINEs (e.g. Alu)", 13.1, "#c9683e"], ["LTR elements", 8.3, "#d99a5a"], ["DNA transposons", 2.9, "#e8c38f"]];
    var x = x0;
    parts.forEach(function (p, i) {
      var w = W * p[1] / 100;
      box(g, x, y, w, h, p[2], .9, 1);
      // labels: two above the bar, two below, each on its own line
      var lx = x + w / 2, above = i < 2, ly = [y - 12, y - 30, y + h + 18, y + h + 34][i];
      path(g, "M" + f(lx) + "," + (above ? y - 2 : y + h + 2) + " L" + f(lx) + "," + (above ? ly + 4 : ly - 11), { w: .8 });
      note(svg, i === 0 ? lx : i === 2 ? lx + 3 : lx - 3, ly, p[0], { size: 11, anchor: i === 0 ? "middle" : i === 2 ? "end" : "start", fill: INK, roman: true });
      x += w;
    });
    var teEnd = x;
    el("rect", { x: f(teEnd), y: y, width: f(x0 + W - teEnd), height: h, fill: "url(#hatch-fine)", stroke: INK, "stroke-width": 1 }, g);
    var cw = W * 1.5 / 100, cx = x0 + W - 50;
    box(g, cx, y, cw, h, A, .95, 1);
    path(g, "M" + f(cx + cw / 2) + "," + (y + h + 2) + " L" + f(cx + cw / 2) + "," + (y + h + 18), { w: .8 });
    note(svg, cx + cw / 2, y + h + 30, "protein-coding, ~1.5%", { size: 11, anchor: "middle", fill: "#2c4f72", roman: true });
    path(g, "M" + x0 + "," + (y + h + 50) + " l0,5 l" + f(teEnd - x0) + ",0 l0,-5", { w: 1, stroke: "#a8432e" });
    note(svg, x0 + (teEnd - x0) / 2, y + h + 70, "transposable elements: about 45%", { size: 13, anchor: "middle", fill: "#8e3a28", roman: true });
    note(svg, x0 + W, y - 30, "the human genome", { size: 11, anchor: "end", roman: true });
    // and one that still jumps
    var gy = 222;
    path(g, "M40," + gy + " L360," + gy, { w: 1.3 });
    [[60, 18], [104, 14], [146, 20], [236, 16], [280, 20], [326, 18]].forEach(function (e) { box(g, e[0], gy - 8, e[1], 16, A, .7, 1); });
    box(g, 186, gy - 8, 30, 16, "#a8432e", .9, 1.1);
    arrow(g, 201, gy - 30, 201, gy - 11, { w: 1.2, stroke: "#8e3a28" });
    note(svg, 222, gy - 20, "a new L1 insertion breaks the gene", { size: 11, fill: "#8e3a28", roman: true });
    note(svg, 40, gy + 22, "factor VIII, hemophilia A (1988)", { size: 11, roman: true });
  })();
  // ---------------------------------------------------------------- print: haplotype-resolved PMS2 case
  (function () {
    var svg = $("w1"); if (!svg) return;
    var g = inkLayer(svg), R = rng(81);
    // the reference: the gene and its pseudogene, in two places on chromosome 7
    note(svg, 80, 15, "PMS2", { size: 13, fill: INK, anchor: "middle" });
    note(svg, 220, 15, "PMS2CL", { size: 13, fill: INK, anchor: "middle" });
    [[20, A], [160, B]].forEach(function (r) {
      path(g, "M" + r[0] + ",28 L" + (r[0] + 120) + ",28", { w: 1.3 });
      [[8, 12], [34, 8], [56, 10], [80, 8], [100, 14]].forEach(function (e) { box(g, r[0] + e[0], 23, e[1], 10, r[1], .8, 1); });
      // reads that align equally well here and in the other copy
      for (var row = 0; row < 4; row++) {
        var x = r[0] - 4 + R() * 8;
        while (x < r[0] + 116) { var len = 18 + R() * 10; box(g, x, 40 + row * 6.5, Math.min(len, r[0] + 120 - x), 4, R() < .5 ? A : B, .85, .7); x += len + 3 + R() * 5; }
      }
    });
    note(svg, 150, 79, "reads align equally well to both: ambiguous", { size: 10.5, anchor: "middle", roman: true });
    arrow(g, 150, 85, 150, 101, { w: 1.2 });
    note(svg, 150, 114, "Multi-region Joint Detection (MRJD)", { size: 12, fill: INK, anchor: "middle", roman: true });
    note(svg, 150, 127, "with TruPath proximity linkage", { size: 10.5, anchor: "middle", roman: true });
    // four reconstructed copies, under the region each belongs to
    var vars = [[44, 118], [66, 98], [186, 246], [214, 262]];
    [["hap 1", 142], ["hap 2", 166]].forEach(function (h, i) {
      note(svg, 17, h[1] + 9.5, h[0], { size: 10, anchor: "end", roman: true });
      box(g, 20, h[1], 120, 13, A, .72);
      box(g, 160, h[1], 120, 13, B, .78);
      if (i === 0) { box(g, 84, h[1], 32, 13, B, .95); path(g, "M100," + (h[1] + 15) + " L100,194", { w: .9, dash: "2 2" }); }
      [vars[0][i], vars[1][i], vars[2][i], vars[3][i]].forEach(function (vx) { path(g, "M" + vx + "," + (h[1] - 2) + " L" + vx + "," + (h[1] + 15), { w: 1.6 }); });
    });
    note(svg, 100, 205, "gene conversion: PMS2CL", { size: 10.5, anchor: "middle", fill: "#7a4a12", roman: true });
    note(svg, 100, 217, "sequence copied into PMS2", { size: 10.5, anchor: "middle", fill: "#7a4a12", roman: true });
    path(g, "M206,197 L206,207", { w: 1.6 });
    note(svg, 212, 206, "= a variant", { size: 10.5, roman: true });
    note(svg, 150, 244, "Every copy rebuilt in full, gene and", { size: 11.5, fill: INK, anchor: "middle", roman: true });
    note(svg, 150, 258, "pseudogene told apart.", { size: 11.5, fill: INK, anchor: "middle", roman: true });
  })();

  // ---------------------------------------------------------------- alpha-globin genotype glyphs
  function agColumn(svg, g, cx, top, w, genes, count, gt, status, extra) {
    var big = w > 80, rowH = big ? 30 : 22, bh = big ? 18 : 13;
    genes.forEach(function (chr, ci) {
      var y = top + ci * rowH;
      path(g, "M" + (cx - w / 2) + "," + (y + bh / 2) + " L" + (cx + w / 2) + "," + (y + bh / 2), { w: 1.4 });
      chr.forEach(function (present, gi) {
        var gx = cx - w * 0.36 + gi * w * 0.4;
        if (present) box(g, gx, y, w * 0.3, bh, "#b5543b", .75); else ghost(g, gx, y, w * 0.3, bh);
      });
    });
    var y0 = top + rowH * 2, accent = /^(cis|trans)/.test(extra || "");
    note(svg, cx, y0 + (big ? 42 : 34), String(count), { size: big ? 36 : 28, fill: INK, anchor: "middle", roman: true });
    note(svg, cx, y0 + (big ? 70 : 56), gt, { roman: true, size: big ? 20 : 14, fill: INK, anchor: "middle" });
    note(svg, cx, y0 + (big ? 96 : 74), status, { size: big ? 16.5 : 10.5, anchor: "middle", roman: true });
    if (extra) note(svg, cx, y0 + (big ? 118 : 90), extra, { size: big ? 15.5 : 10.5, anchor: "middle", fill: accent ? "#9a4a12" : PENCIL, roman: true });
  }
  (function () {
    var svg = $("w2"); if (!svg) return;
    var g = inkLayer(svg);
    path(g, "M156,40 l0,-5 l136,0 l0,5", { w: 1 });
    note(svg, 224, 28, "2 genes each, both carriers", { anchor: "middle", size: 11.5, fill: INK, roman: true });
    agColumn(svg, g, 40, 50, 60, [[1, 1], [1, 1]], 4, "αα/αα", "normal");
    agColumn(svg, g, 114, 50, 60, [[1, 0], [1, 1]], 3, "−α/αα", "silent carrier");
    agColumn(svg, g, 190, 50, 60, [[0, 0], [1, 1]], 2, "−−/αα", "carrier", "cis");
    agColumn(svg, g, 260, 50, 60, [[1, 0], [1, 0]], 2, "−α/−α", "carrier", "trans");
    note(svg, 150, 210, "Only cis can pass on a chromosome with no α genes;", { anchor: "middle", size: 11, fill: INK, roman: true });
    note(svg, 150, 225, "a child with two has Hb Bart's hydrops fetalis.", { anchor: "middle", size: 11, fill: INK, roman: true });
  })();
  (function () {
    var svg = $("agfig"); if (!svg) return;
    var g = inkLayer(svg);
    path(g, "M300,46 l0,-7 l300,0 l0,7", { w: 1.1 });
    note(svg, 450, 28, "two genes each: both carriers, different risk to children", { anchor: "middle", size: 18, fill: INK, roman: true });
    [[[[1, 1], [1, 1]], 4, "αα/αα", "normal"], [[[1, 0], [1, 1]], 3, "−α/αα", "silent carrier"],
      [[[0, 0], [1, 1]], 2, "−−/αα", "carrier (trait)", "cis: can pass on −−"], [[[1, 0], [1, 0]], 2, "−α/−α", "carrier (trait)", "trans: passes on −α"],
      [[[0, 0], [1, 0]], 1, "−−/−α", "HbH disease"], [[[0, 0], [0, 0]], 0, "−−/−−", "Hb Bart's hydrops", "fetalis"]].forEach(function (c, i) {
      agColumn(svg, g, 75 + i * 150, 62, 108, c[0], c[1], c[2], c[3], c[4]);
    });
  })();

  // ---------------------------------------------------------------- print: TELR
  (function () {
    var svg = $("w3"); if (!svg) return;
    var g = inkLayer(svg);
    drawFly(g, 248, 52, 0.55);
    // a chromosome, a transposon on it, and the copy it makes of itself somewhere new
    var y = 150;
    el("rect", { x: 16, y: y - 9, width: 268, height: 18, rx: 9, fill: "#f6efdc", stroke: INK, "stroke-width": 1.4 }, g);
    box(g, 46, y - 9, 34, 18, "#c0392b", .85);
    box(g, 196, y - 9, 34, 18, "#c0392b", .85);
    path(g, "M63," + (y - 12) + " C78,60 190,60 212," + (y - 13), { w: 1.4, dash: "4 4" });
    arrow(g, 206, y - 26, 212, y - 13, { w: 1.4, head: 7 });
    note(svg, 138, 72, "boing!", { size: 15, fill: "#9a4a12", anchor: "middle" });
    note(svg, 63, y + 26, "transposon", { size: 12, fill: INK, anchor: "middle" });
    note(svg, 213, y + 26, "new copy", { size: 12, fill: INK, anchor: "middle" });
    note(svg, 150, 206, "TELR finds new insertions in long reads,", { size: 11.5, fill: INK, anchor: "middle", roman: true });
    note(svg, 150, 222, "rebuilds each one, and counts the copies carrying it.", { size: 11.5, fill: INK, anchor: "middle", roman: true });
  })();
  (function () {
    var svg = $("fly"); if (!svg) return;
    drawFly(inkLayer(svg), 100, 90, 1.25);
  })();

  // Figure 1 on the research page: why short reads lose their place between two near-identical copies
  (function () {
    var svg = $("fig1"); if (!svg) return;
    var g = inkLayer(svg), R = rng(17);
    var X0 = 150, X1 = 960, PSV = [262, 268, 431, 598, 604, 612, 790, 846];
    function gene(y, color, label, sub) {
      path(g, "M" + X0 + "," + y + " L" + X1 + "," + y, { w: 1.6 });
      [[180, 48], [300, 40], [420, 56], [540, 40], [660, 60], [800, 46], [900, 40]].forEach(function (e) { box(g, e[0], y - 11, e[1], 22, color, .72); });
      PSV.forEach(function (x) { path(g, "M" + x + "," + (y - 15) + " L" + x + "," + (y + 15), { w: 2.2, stroke: RED }); });
      note(svg, X0 - 18, y + 2, label, { size: 19, fill: INK, anchor: "end" });
      note(svg, X0 - 18, y + 21, sub, { size: 14, anchor: "end", roman: true });
    }
    gene(70, A, "SMN1", "the gene");
    gene(300, B, "SMN2", "its copy");
    // reads from the sample, between the two copies they could have come from
    var placed = [], lost = [];
    for (var row = 0; row < 7; row++) {
      var x = X0 + 4 - R() * 40 + row * 9, y = 118 + row * 21;
      while (x < X1 - 70) {
        var len = Math.min(66 + R() * 20, X1 - x), hits = PSV.some(function (p) { return p > x + 2 && p < x + len - 2; });
        (hits ? placed : lost).push([x, y, len]);
        x += len + 10 + R() * 26;
      }
    }
    lost.forEach(function (r) {
      var tilt = (R() - .5) * 7, cx = r[0] + r[2] / 2;
      var gr = el("g", { transform: "rotate(" + f(tilt) + " " + f(cx) + " " + r[1] + ")" }, g);
      box(gr, r[0], r[1] - 5, r[2], 10, "#c97a3a", .55, 1);
    });
    placed.forEach(function (r) {
      box(g, r[0], r[1] - 5, r[2], 10, A, .9, 1.1);
      PSV.forEach(function (p) { if (p > r[0] && p < r[0] + r[2]) el("rect", { x: p - 1.6, y: r[1] - 6, width: 3.2, height: 12, fill: RED }, svg); });
    });
    // a few question marks over the reads that fit both
    [lost[2], lost[8], lost[13], lost[19], lost[25]].forEach(function (r) { if (r) note(svg, r[0] + r[2] + 9, r[1] + 7, "?", { size: 26, fill: "#9a4a12", anchor: "middle", roman: true }); });
    // what can be called on SMN1
    var cy = 372, on = [];
    for (var cx = X0; cx <= X1; cx += 2) {
      var n = placed.filter(function (r) { return r[0] <= cx && r[0] + r[2] >= cx; }).length;
      on.push(n >= 2);
    }
    path(g, "M" + X0 + "," + cy + " L" + X1 + "," + cy, { w: 1, dash: "3 4", op: .6 });
    var d = "", start = -1;
    for (var i = 0; i <= on.length; i++) {
      if (on[i] && start < 0) start = i;
      if (!on[i] && start >= 0) { d += " M" + (X0 + start * 2) + "," + cy + " L" + (X0 + (i - 1) * 2) + "," + cy; start = -1; }
    }
    path(g, d, { w: 9, stroke: INK });
    note(svg, X0 - 18, cy + 6, "callable", { size: 17, fill: INK, anchor: "end" });
    // the key
    var ky = 428;
    box(g, X0, ky - 6, 46, 12, A, .9, 1.1); el("rect", { x: X0 + 22, y: ky - 7, width: 3.2, height: 14, fill: RED }, svg);
    note(svg, X0 + 58, ky + 5, "covers a base where the copies differ: placed on its gene", { size: 16, fill: INK, roman: true });
    var gk = el("g", { transform: "rotate(-3 " + (X0 + 23) + " " + (ky + 30) + ")" }, g);
    box(gk, X0, ky + 24, 46, 12, "#c97a3a", .55, 1);
    note(svg, X0 + 58, ky + 35, "covers none: fits both genes equally, so the caller sets it aside", { size: 16, fill: INK, roman: true });
    path(g, "M" + (X0 - 4) + ",458 l0,0", { w: 0 });
  })();

  // ---------------------------------------------------------------- Figure 2: the PMS2 case, redrawn
  (function () {
    var svg = $("fig2"); if (!svg) return;
    var g = inkLayer(svg), R = rng(72);
    var X0 = 210, X1 = 952, K0 = 5970, K1 = 5986;
    var kx = function (kb) { return X0 + (kb - K0) / (K1 - K0) * (X1 - X0); };
    arrow(g, kx(5978) - 34, 22, X0, 22, { w: 1 }); arrow(g, kx(5978) + 34, 22, X1, 22, { w: 1 });
    note(svg, kx(5978), 28, "16 kb", { anchor: "middle", size: 17, fill: INK, roman: true });
    path(g, "M" + X0 + ",48 L" + X1 + ",48", { w: 1 });
    for (var k = K0; k <= K1; k++) {
      path(g, "M" + f(kx(k)) + ",48 l0," + (k % 2 ? 4 : 8), { w: .9 });
      if (k % 4 === 2) note(svg, kx(k), 74, k.toLocaleString("en-US") + " kb", { anchor: "middle", size: 15, roman: true });
    }
    var gy = 106;
    path(g, "M" + X0 + "," + gy + " L" + X1 + "," + gy, { w: 1.1 });
    var chev = "";
    for (var cx = X0 + 20; cx < X1; cx += 34) chev += " M" + (cx + 3) + "," + (gy - 3) + " l-4,3 l4,3";
    path(g, chev, { w: .8, op: .7 });
    [[5970.5, 5970.8, 7], [5970.9, 5972.6, 7], [5972.7, 5972.8, 9], [5977.3, 5977.5, 10], [5978.4, 5978.5, 9], [5981.6, 5981.7, 9], [5976.1, 5976.2, 6]].forEach(function (e) {
      box(g, kx(e[0]), gy - e[2], kx(e[1]) - kx(e[0]), e[2] * 2, A, .8, 1);
    });
    note(svg, kx(5971.4), gy + 30, "RSPH10B", { size: 16, anchor: "middle" });
    note(svg, kx(5978.4), gy + 30, "PMS2", { size: 16, anchor: "middle" });
    function pileup(top, rows, convFrom) {
      for (var r = 0; r < rows; r++) {
        var x = X0 - R() * 40;
        while (x < X1) {
          var len = 34 + R() * 26, a = Math.max(X0, x), b = Math.min(X1, x + len);
          if (b - a > 6) path(g, "M" + f(a) + "," + f(top + 24 + r * 5.6) + " L" + f(b) + "," + f(top + 24 + r * 5.6), { w: 2.8, stroke: "#b8b0a2" });
          x += len + 3 + R() * 8;
        }
      }
      var ticks = "";
      for (var t = 0; t < 26; t++) ticks += " M" + f(kx(K0 + R() * 16)) + "," + top + " l0,16";
      path(g, ticks, { w: 2.4, stroke: "#d9782a" });
      if (convFrom) {
        var dense = "";
        for (var u = 0; u < 46; u++) dense += " M" + f(kx(convFrom + 0.2 + R() * (K1 - convFrom - 0.3))) + "," + top + " l0,16";
        path(g, dense, { w: 2.4, stroke: "#8a5a36" });
      }
    }
    pileup(150, 11, 5978.6);
    var cxa = kx(5978.6);
    wash(g, rectD(cxa, 144, X1 - cxa, 96), A, .32);
    el("rect", { x: f(cxa), y: 144, width: f(X1 - cxa), height: 96, fill: "none", stroke: "#2c4f72", "stroke-width": 1.4 }, g);
    el("rect", { x: f(cxa + 14), y: 206, width: 300, height: 28, fill: "#fffdf6", stroke: INK, "stroke-width": 1 }, g);
    note(svg, cxa + 26, 226, "PMS2CL → PMS2 gene conversion", { size: 17, fill: INK });
    pileup(262, 10, 0);
    note(svg, 14, 196, "PMS2 haplotype 1", { size: 18, fill: INK });
    note(svg, 14, 304, "PMS2 haplotype 2", { size: 18, fill: INK });
    function model(x, y, w, conv) {
      path(g, "M" + x + "," + y + " L" + (x + w) + "," + y, { w: 1.2 });
      [[0, .1, 10], [.3, .02, 8], [.55, .02, 8], [.78, .02, 7], [.9, .06, 10]].forEach(function (e) { box(g, x + e[0] * w, y - e[2], e[1] * w, e[2] * 2, A, .85, 1); });
      if (conv) { wash(g, rectD(x + .28 * w, y - 18, .7 * w, 36), A, .3); el("rect", { x: f(x + .28 * w), y: y - 18, width: f(.7 * w), height: 36, fill: "none", stroke: "#2c4f72", "stroke-width": 1.2 }, g); }
    }
    function deleted(x, y, w) {
      path(g, "M" + x + "," + y + " L" + (x + w) + "," + y, { w: 1.2 });
      [[.1, .04], [.5, .015], [.75, .015], [.97, .02]].forEach(function (e) { box(g, x + e[0] * w, y - 9, e[1] * w, 18, B, .7, 1); });
      path(g, "M" + (x + w * .42 - 10) + "," + (y - 13) + " l20,26 M" + (x + w * .42 + 10) + "," + (y - 13) + " l-20,26", { w: 3.4, stroke: "#c0392b" });
    }
    note(svg, 380, 388, "PMS2CL → PMS2 conversion", { size: 17, anchor: "middle", fill: INK });
    [[430, true, "non-functional PMS2", RED], [520, false, "functional PMS2", LEAF]].forEach(function (row, i) {
      note(svg, 14, row[0] + 6, "haplotype " + (i + 1), { size: 18, fill: INK });
      model(210, row[0], 340, row[1]);
      note(svg, 380, row[0] + 40, row[2], { size: 17, anchor: "middle", fill: row[3] });
      deleted(640, row[0], 320);
      note(svg, 800, row[0] + 40, "PMS2CL deleted", { size: 17, anchor: "middle", fill: INK });
    });
  })();

  // ---------------------------------------------------------------- Figure 4: the TELR pipeline, redrawn
  (function () {
    var svg = $("fig4"); if (!svg) return;
    var g = inkLayer(svg);
    function panel(x, y, w, h, n, title) {
      el("rect", { x: x, y: y, width: w, height: h, fill: "none", stroke: INK, "stroke-width": 1, "stroke-dasharray": "5 4", opacity: .7 }, g);
      note(svg, x + 18, y + 32, n + "  " + title, { size: 20, fill: INK, roman: true });
    }
    function bar(x0, x1, y, color, w) { path(g, "M" + x0 + "," + y + " L" + x1 + "," + y, { w: w || 4, stroke: color }); }
    function read(x0, mid, x1, y, l, r) { bar(x0, mid, y, l, 3.4); bar(mid, x1, y, r, 3.4); }
    function lab(x, y, s, o) { o = o || {}; note(svg, x, y, s, { size: o.size || 15, anchor: o.anchor || "start", fill: o.fill || PENCIL, roman: !o.italic }); }
    var TEL = TE + "99";
    // 1: find candidate insertions
    panel(10, 10, 530, 300, "1", "Find candidate insertions");
    bar(150, 440, 76, FLANK, 7); lab(448, 81, "reference");
    el("path", { d: "M296,60 l-7,-12 l14,0Z", fill: TE, stroke: INK, "stroke-width": 1 }, g); lab(310, 56, "SV insertion");
    [[226, 340], [238, 352], [250, 364]].forEach(function (r, i) { read(r[0], 296, r[1], 96 + i * 11, FLANK, TEL); });
    [[214, 366], [232, 372]].forEach(function (r, i) { read(r[0], 296, r[1], 129 + i * 11, TEL, FLANK); });
    lab(28, 104, "align long reads,"); lab(28, 122, "call SVs"); lab(28, 140, "(NGMLR, Sniffles)", { size: 13 });
    arrow(g, 296, 160, 296, 182, { w: 1.2 });
    bar(250, 342, 196, TE, 4); lab(352, 201, "inserted sequence");
    lab(296, 232, "matches a TE consensus?", { anchor: "middle", fill: INK });
    arrow(g, 256, 242, 214, 268, { w: 1.1 }); arrow(g, 336, 242, 378, 268, { w: 1.1 });
    lab(196, 292, "yes: candidate", { anchor: "middle", fill: INK }); lab(392, 292, "no: discard", { anchor: "middle" });
    lab(28, 236, "(RepeatMasker)", { size: 13 });
    // 2: assemble a local contig
    panel(10, 320, 530, 190, "2", "Assemble a local contig");
    for (var i = 0; i < 5; i++) read(206 + i * 9 - (i % 2) * 14, 262, 334 + (i % 3) * 16, 364 + i * 9, FLANK, TE);
    arrow(g, 290, 414, 290, 436, { w: 1.1 });
    bar(200, 262, 456, FLANK, 5); bar(262, 340, 456, TE, 5); bar(340, 402, 456, FLANK, 5);
    lab(412, 461, "polished contig");
    lab(28, 380, "assemble, polish"); lab(28, 398, "(wtdbg2, minimap2)", { size: 13 });
    // 3: name the family and place it
    panel(10, 520, 530, 230, "3", "Name the family, place it");
    bar(200, 262, 574, FLANK, 5); bar(262, 340, 574, TE, 5); bar(340, 402, 574, FLANK, 5);
    lab(412, 579, "annotated contig");
    el("path", { d: "M254,578 L270,578 L304,664 L296,664Z M332,578 L348,578 L304,664 L296,664Z", fill: "#f2c98a", opacity: .75 }, g);
    bar(150, 440, 668, FLANK, 7); lab(448, 673, "reference");
    path(g, "M300,668 l0,22", { w: 1 });
    lab(306, 712, "TE family, coordinates and");
    lab(306, 730, "target-site duplication");
    lab(28, 600, "annotate the TE"); lab(28, 618, "(minimap2,", { size: 13 }); lab(28, 634, "RepeatMasker)", { size: 13 });
    // 4: estimate allele frequency
    panel(550, 10, 440, 740, "4", "Estimate allele frequency");
    bar(610, 960, 82, FLANK, 7);
    el("path", { d: "M780,66 l-7,-12 l14,0Z", fill: TE, stroke: INK, "stroke-width": 1 }, g);
    for (var r = 0; r < 4; r++) read(700 + r * 9, 780, 826 + r * 7, 104 + r * 10, FLANK, TEL);
    lab(570, 112, "reads with");
    lab(570, 130, "the insertion");
    for (var q = 0; q < 4; q++) bar(660 + q * 16, 880 + q * 14, 168 + q * 10, FLANK, 3.4);
    lab(570, 176, "reads without");
    arrow(g, 780, 222, 780, 248, { w: 1.1 });
    lab(570, 278, "realign to");
    lab(570, 296, "the TE contig");
    for (var t2 = 0; t2 < 4; t2++) read(690 + t2 * 7, 760, 828 + t2 * 8, 266 + t2 * 10, FLANK, TE);
    for (var t3 = 0; t3 < 4; t3++) { bar(684 + t3 * 10, 760, 314 + t3 * 10, FLANK, 3.4); path(g, "M760," + (314 + t3 * 10) + " L840," + (314 + t3 * 10), { w: 1, dash: "3 3" }); bar(840, 904 - t3 * 6, 314 + t3 * 10, FLANK, 3.4); }
    bar(660, 760, 370, FLANK, 5); bar(760, 840, 370, TE, 5); bar(840, 940, 370, FLANK, 5);
    arrow(g, 800, 388, 800, 414, { w: 1.1 });
    var dy = 560, depth = function (x) { return x < 748 ? dy - 80 : x < 852 ? dy - 40 : dy - 80; };
    [[700, "5′ flank"], [776, "5′ TE"], [826, "3′ TE"], [900, "3′ flank"]].forEach(function (w, i) {
      el("rect", { x: w[0] - 9, y: dy - 104, width: 18, height: 104, fill: "#d8d0c0", opacity: .7 }, g);
      lab(w[0], dy - 112 - (i % 2) * 18, w[1], { size: 14, anchor: "middle" });
    });
    var dd = "";
    for (var x = 660; x <= 940; x += 4) { var yy = depth(x); if (Math.abs(x - 750) < 6 || Math.abs(x - 850) < 6) yy = dy - 60; dd += (dd ? " L" : "M") + x + "," + f(yy + Math.sin(x / 9) * 2); }
    path(g, dd, { w: 1.7 });
    path(g, "M650," + (dy - 118) + " L650," + dy + " L955," + dy, { w: 1.2 });
    lab(640, dy - 46, "depth", { anchor: "end", size: 14 });
    bar(660, 760, dy + 18, FLANK, 5); bar(760, 840, dy + 18, TE, 5); bar(840, 940, dy + 18, FLANK, 5);
    lab(770, 640, "AF = ½ ( 5′ TE ÷ 5′ flank", { size: 19, anchor: "middle", fill: INK });
    lab(770, 668, "+ 3′ TE ÷ 3′ flank )", { size: 19, anchor: "middle", fill: INK });
    lab(770, 712, "depth-based estimate (SAMtools)", { size: 14, anchor: "middle" });
  })();

  // ---------------------------------------------------------------- night: snowy hill, sled tracks
  (function () {
    var svg = $("snow"); if (!svg) return;
    var R = rng(41);
    var hill = function (x) { return 222 - 48 * Math.cos((x - 360) / 330) + 6 * Math.sin(x / 40); };
    var sky = el("g", {}, svg);
    for (var i = 0; i < 70; i++) {
      var x = R() * 1440, y = R() * 220;
      if (y < hill(x) - 20) el("circle", { cx: f(x), cy: f(y), r: f(0.6 + R() * 1.3), fill: "#f6efd8", "class": R() > 0.6 ? "twinkle" : "", style: "animation-delay:" + f(R() * 3) + "s" }, sky);
    }
    var g = inkLayer(svg);
    var d = line(hill, -10, 1450, 8);
    el("path", { d: d + " L1450,300 L-10,300Z", fill: "#f4f1ea" }, g);
    var cp = el("clipPath", { id: "snowclip" }, svg);
    el("path", { d: line(function (x) { return hill(x) + 30; }, -10, 1450, 8) + " L1450,300 L-10,300Z" }, cp);
    el("path", { d: d + " L1450,300 L-10,300Z", fill: "url(#hatch-snow)", "clip-path": "url(#snowclip)" }, g);
    path(g, d, { w: 2, stroke: "#0f1420" });
    [[980, 1], [1030, .8], [1300, 1.1], [1360, .7], [140, .9]].forEach(function (p) {
      var px = p[0], py = hill(px) + 4, s = p[1];
      el("path", { d: "M" + px + "," + (py - 70 * s) + " L" + (px + 22 * s) + "," + (py - 28 * s) + " L" + (px + 10 * s) + "," + (py - 30 * s) + " L" + (px + 28 * s) + "," + py + " L" + (px - 28 * s) + "," + py + " L" + (px - 10 * s) + "," + (py - 30 * s) + " L" + (px - 22 * s) + "," + (py - 28 * s) + "Z", fill: "#2e4a3e", stroke: "#0f1420", "stroke-width": 1.5 }, g);
    });
    var tr1 = "", tr2 = "";
    for (var tx = 470; tx <= 1460; tx += 10) {
      var ty = hill(tx) + 12 + (tx - 470) * 0.05 + Math.sin(tx / 70) * 8;
      tr1 += (tr1 ? " L" : "M") + tx + "," + f(ty); tr2 += (tr2 ? " L" : "M") + tx + "," + f(ty + 7);
    }
    path(g, tr1 + " " + tr2, { w: 1.4, stroke: "#7d93b8" });
    var sx = 460, sy = hill(sx) + 6, sled = el("g", { transform: "rotate(10 " + sx + " " + sy + ")" }, g);
    el("rect", { x: sx - 40, y: sy - 14, width: 70, height: 9, fill: "#b23a2a", stroke: "#0f1420", "stroke-width": 1.5 }, sled);
    path(sled, "M" + (sx - 42) + "," + (sy + 2) + " L" + (sx + 34) + "," + (sy + 2) + " q12,0 10,-14", { w: 2.4, stroke: "#0f1420" });
    path(sled, "M" + (sx - 30) + "," + (sy - 5) + " l0,7 M" + (sx + 18) + "," + (sy - 5) + " l0,7", { w: 2, stroke: "#0f1420" });
  })();
})();
