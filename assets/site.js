// Every drawing on the site, in ink and watercolour. Each one draws only if its <svg> is on the page.
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var INK = "#241f1a", PENCIL = "#5a5047", A = "#4f6f95", B = "#c08736", RED = "#a8432e";
  var FLANK = "#cf8a45", TE = "#7f9f4a", LEAF = "#5f7f3a";
  var SERIF = "Newsreader, Georgia, serif", DISPLAY = "Cutive, Georgia, serif";

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

  // ---------------------------------------------------------------- the front: an explorer and two near-identical peaks
  // A mountain is a fixed list of ridge points, so the second peak can be the same mountain drawn again.
  var RIDGE = [[-1, 0], [-.86, -.12], [-.78, -.1], [-.64, -.3], [-.55, -.27], [-.42, -.5], [-.33, -.47], [-.2, -.72], [-.12, -.7], [0, -1],
    [.1, -.8], [.17, -.83], [.28, -.6], [.38, -.62], [.5, -.4], [.62, -.36], [.74, -.18], [.86, -.14], [1, 0]];
  function mountain(g, cx, baseY, w, h, tint, opts) {
    opts = opts || {};
    var d = RIDGE.map(function (p, i) { return (i ? "L" : "M") + f(cx + p[0] * w) + "," + f(baseY + p[1] * h); }).join(" ") + "Z";
    wash(g, d, tint, .55);
    // shadow flank, hatched
    var shade = "M" + f(cx) + "," + f(baseY - h) + " L" + f(cx + w * .1) + "," + f(baseY - h * .8) + " L" + f(cx + w * .17) + "," + f(baseY - h * .83) +
      " L" + f(cx + w) + "," + f(baseY) + " L" + f(cx + w * .05) + "," + f(baseY) + " L" + f(cx - w * .04) + "," + f(baseY - h * .55) + "Z";
    el("path", { d: shade, fill: "url(#hatch)" }, clipTo(g, d));
    // snow
    var snow = "M" + f(cx - w * .2) + "," + f(baseY - h * .72) + " L" + f(cx - w * .12) + "," + f(baseY - h * .7) + " L" + f(cx) + "," + f(baseY - h) +
      " L" + f(cx + w * .1) + "," + f(baseY - h * .8) + " L" + f(cx + w * .17) + "," + f(baseY - h * .83) + " L" + f(cx + w * .24) + "," + f(baseY - h * .7) +
      " L" + f(cx + w * .15) + "," + f(baseY - h * .66) + " L" + f(cx + w * .09) + "," + f(baseY - h * .72) + " L" + f(cx + w * .02) + "," + f(baseY - h * .64) +
      " L" + f(cx - w * .06) + "," + f(baseY - h * .7) + " L" + f(cx - w * .13) + "," + f(baseY - h * .62) + "Z";
    el("path", { d: snow, fill: "#fbf8f0", stroke: INK, "stroke-width": 1 }, g);
    path(g, d, { w: 1.6 });
    // ridgelines
    path(g, "M" + f(cx) + "," + f(baseY - h) + " C" + f(cx - w * .04) + "," + f(baseY - h * .6) + " " + f(cx + w * .02) + "," + f(baseY - h * .3) + " " + f(cx - w * .06) + "," + f(baseY) +
      " M" + f(cx - w * .42) + "," + f(baseY - h * .5) + " q" + f(w * .06) + "," + f(h * .2) + " " + f(w * .02) + "," + f(h * .5), { w: 1, op: .8 });
    if (opts.flag) {
      var fx = cx, fy = baseY - h;
      path(g, "M" + fx + "," + fy + " l0,-34", { w: 1.4 });
      el("path", { d: "M" + fx + "," + (fy - 34) + " l22,6 l-22,7Z", fill: "#c0392b", stroke: INK, "stroke-width": 1 }, g);
    }
  }
  function explorer(g, x, y, s) {
    var e = el("g", { transform: "translate(" + x + "," + y + ") scale(" + s + ")" }, g);
    // scarf, trailing in the wind
    el("path", { d: "M-2,-118 C-20,-116 -34,-108 -50,-112 C-40,-104 -26,-104 -12,-110 C-24,-100 -38,-96 -46,-98 C-30,-90 -14,-100 -2,-110Z", fill: "#b23a2a", opacity: .9, filter: "url(#wash)" }, e);
    path(e, "M-2,-118 C-20,-116 -34,-108 -50,-112 C-40,-104 -26,-104 -12,-110 M-12,-110 C-24,-100 -38,-96 -46,-98", { w: 1.2 });
    // legs and boots
    var legs = "M-15,-62 L-19,-6 L-8,-6 L-4,-58 L2,-58 L8,-6 L19,-6 L13,-62Z";
    wash(e, legs, "#8a7a55", .9);
    path(e, legs + " M-1,-58 L-1,-40", { w: 1.4 });
    el("path", { d: "M-22,-6 C-22,-12 -8,-12 -6,-6 L-4,1 L-24,1Z M6,-6 C8,-12 20,-12 21,-6 L25,1 L5,1Z", fill: "#3a2c20", stroke: INK, "stroke-width": 1.2 }, e);
    // coat
    var coat = "M-18,-112 C-22,-96 -22,-74 -18,-58 L16,-58 C20,-74 20,-96 14,-112 C6,-118 -10,-118 -18,-112Z";
    wash(e, coat, "#6f7f5a", .9);
    path(e, coat, { w: 1.4 });
    path(e, "M-19,-70 L17,-70", { w: 2.2, stroke: "#3a2c20" });
    // pack, with a bedroll on top
    var pack = "M-30,-114 L-4,-118 L-2,-72 L-28,-70Z";
    wash(e, pack, "#8a5a36", .95);
    path(e, pack + " M-29,-100 L-3,-103 M-16,-116 L-15,-101", { w: 1.3 });
    el("rect", { x: -34, y: -126, width: 34, height: 11, rx: 5.5, fill: "#b8693f", stroke: INK, "stroke-width": 1.2, transform: "rotate(-5 -17 -120)" }, e);
    path(e, "M-24,-126 l1,11 M-12,-127 l1,11", { w: 1, op: .8 });
    // the arm, raising a brass telescope towards the peaks
    var arm = "M8,-108 C18,-112 26,-118 32,-124 L36,-118 C30,-112 20,-104 12,-98Z";
    wash(e, arm, "#6f7f5a", .9);
    path(e, arm, { w: 1.3 });
    el("path", { d: "M30,-128 L74,-146 L77,-139 L33,-120Z", fill: "#c99a45", stroke: INK, "stroke-width": 1.3 }, e);
    path(e, "M44,-133 L47,-126 M60,-139 L62,-132", { w: 1.2 });
    el("ellipse", { cx: 76, cy: -142.5, rx: 2.4, ry: 4.4, transform: "rotate(-22 76 -142.5)", fill: "#e9d6a0", stroke: INK, "stroke-width": 1 }, e);
    // head, from behind, under a pith helmet
    el("ellipse", { cx: 4, cy: -126, rx: 10, ry: 11, fill: "#3b2d24", stroke: INK, "stroke-width": 1.2 }, e);
    el("path", { d: "M12,-128 C15,-128 15,-122 12,-121Z", fill: "#e8c39e", stroke: INK, "stroke-width": 1 }, e);
    el("path", { d: "M-10,-134 C-8,-152 16,-152 18,-134Z", fill: "#e6dcc0", stroke: INK, "stroke-width": 1.3 }, e);
    el("ellipse", { cx: 4, cy: -134, rx: 19, ry: 4, fill: "#e6dcc0", stroke: INK, "stroke-width": 1.3 }, e);
    path(e, "M-9,-138 C-2,-140 10,-140 17,-138", { w: 2, stroke: "#8a5a36" });
    return e;
  }
  (function () {
    var svg = $("hero"); if (!svg) return;
    var R = rng(7);
    var narrow = window.matchMedia("(max-width: 700px)");
    var frameScene = function () { svg.setAttribute("preserveAspectRatio", narrow.matches ? "xMinYMax slice" : "xMidYMax slice"); };
    frameScene(); if (narrow.addEventListener) narrow.addEventListener("change", frameScene);

    var sky = el("g", {}, svg);
    [[260, 120, 380, 110], [1150, 120, 360, 110]].forEach(function (s) {
      el("ellipse", { cx: s[0], cy: s[1], rx: s[2], ry: s[3], fill: "#a9c8da", opacity: .13, filter: "url(#wash)" }, sky);
    });
    el("ellipse", { cx: 1080, cy: 560, rx: 520, ry: 120, fill: "#f2c98a", opacity: .18, filter: "url(#wash)" }, sky);

    var ink = inkLayer(svg);
    cloud(ink, 1290, 110, 96, 40, R);
    cloud(ink, 640, 92, 60, 24, R);
    // a far, pale range; then the two peaks, the second the same mountain again
    var far = function (x) { return 520 - 40 * Math.sin(x / 120 + 1) - 22 * Math.sin(x / 47); };
    var fd = line(far, 560, 1450, 10);
    wash(ink, fd + " L1450,640 L560,640Z", "#9fb1c4", .35);
    path(ink, fd, { w: 1, op: .6 });
    mountain(ink, 930, 600, 190, 330, "#8fa1b6", { flag: true });
    mountain(ink, 1215, 606, 185, 322, "#8fa1b6");
    // valley meadows
    var mid = function (x) { return 590 + 18 * Math.sin(x / 160 + 2) + 6 * Math.sin(x / 41); };
    var md = line(mid, 480, 1450, 8);
    el("path", { d: md + " L1450,800 L480,800Z", fill: "#f3ecdb" }, ink);
    wash(ink, md + " L1450,800 L480,800Z", "#a9bd7c", .5);
    path(ink, md, { w: 1.6 });
    // a river that runs as two strands, twisting round each other down the valley
    var riv = function (t) { return [1075 - 330 * t + 60 * Math.sin(t * 3.2), 600 + 200 * t]; };
    var s1 = "", s2 = "", rungs = "";
    for (var t = 0; t <= 1.0001; t += 0.008) {
      var b = riv(t), w = 3 + 15 * t, ph = t * 30;
      var p1 = [b[0] + Math.sin(ph) * w, b[1]], p2 = [b[0] - Math.sin(ph) * w, b[1]];
      s1 += (s1 ? " L" : "M") + f(p1[0]) + "," + f(p1[1]);
      s2 += (s2 ? " L" : "M") + f(p2[0]) + "," + f(p2[1]);
      if (Math.round(t * 1000) % 24 === 0 && Math.abs(Math.sin(ph)) > 0.3) rungs += " M" + f(p1[0]) + "," + f(p1[1]) + " L" + f(p2[0]) + "," + f(p2[1]);
    }
    path(ink, rungs, { w: 1, stroke: "#c0392b", op: .55 });
    path(ink, s1, { w: 2, stroke: "#3f6f9a" });
    path(ink, s2, { w: 2, stroke: "#2c4f72" });
    grass(ink, mid, 480, 1440, R, 46);
    var meadow = "";
    for (var m = 0; m < 60; m++) {
      var mx = 620 + R() * 820, my = mid(mx) + 24 + R() * 180, ml = 12 + R() * 30;
      meadow += " M" + f(mx) + "," + f(my) + " q" + f(ml / 2) + ",-2 " + f(ml) + ",0";
    }
    path(ink, meadow, { w: .9, op: .5 });
    [[640, 1], [700, .8], [1370, 1.1], [1415, .85], [1320, .7], [760, .65]].forEach(function (t) {
      var tx = t[0], ty = mid(tx) + 2, s = t[1], crown = scallop(tx, ty - 34 * s, 20 * s, 24 * s, 9, R);
      path(ink, "M" + tx + "," + ty + " L" + tx + "," + (ty - 18 * s), { w: 2 });
      el("path", { d: crown, fill: "#f3ecdb" }, ink);
      shadedBlob(ink, crown, "#7f9f4a", .7, tx + 10 * s, ty - 20 * s, 22 * s);
    });

    // the near outcrop the explorer stands on
    var rock = function (x) { return 612 - 14 * Math.sin(x / 90) + (x > 470 ? (x - 470) * 0.9 : 0) + 4 * Math.sin(x / 23); };
    var rd = line(rock, -10, 700, 6);
    el("path", { d: rd + " L700,820 L-10,820Z", fill: "#f3ecdb" }, ink);
    wash(ink, rd + " L700,820 L-10,820Z", "#b9ab8e", .7);
    var crag = clipTo(ink, rd + " L700,820 L-10,820Z");
    el("path", { d: "M440,560 L720,560 L720,820 L560,820Z", fill: "url(#hatch)" }, crag);
    path(ink, rd, { w: 2 });
    var cracks = "";
    for (var i = 0; i < 26; i++) {
      var cx = R() * 600, cy = rock(cx) + 26 + R() * 140, cl = 12 + R() * 34;
      cracks += " M" + f(cx) + "," + f(cy) + " l" + f(cl * .6) + "," + f(-cl * .1) + " l" + f(cl * .4) + "," + f(cl * .2);
    }
    path(ink, cracks, { w: .9, op: .6 });
    grass(ink, rock, 0, 460, R, 40);

    // the wagon, loaded for a long trip; something striped is asleep in it
    var wx = 150, wy = rock(150) + 2, wagon = el("g", {}, ink);
    el("path", { d: "M" + (wx - 40) + "," + (wy - 62) + " l-6,-30 M" + (wx - 40) + "," + (wy - 92) + " l14,4", fill: "none", stroke: INK, "stroke-width": 1.4 }, wagon);
    el("rect", { x: wx - 34, y: wy - 92, width: 10, height: 14, fill: "#f2cf73", stroke: INK, "stroke-width": 1.1 }, wagon);
    [[wx - 26, -64, 50, "#efe3c4"], [wx - 8, -70, 44, "#e6d3a8"]].forEach(function (r) {
      el("rect", { x: r[0], y: wy + r[1], width: r[3] ? r[2] : 40, height: 12, rx: 6, fill: r[3], stroke: INK, "stroke-width": 1.1, transform: "rotate(-14 " + r[0] + " " + (wy + r[1]) + ")" }, wagon);
    });
    var body = "M" + (wx - 62) + "," + (wy - 46) + " L" + (wx + 62) + "," + (wy - 46) + " L" + (wx + 56) + "," + (wy - 16) + " L" + (wx - 56) + "," + (wy - 16) + "Z";
    wash(wagon, body, "#c0392b", .9);
    path(wagon, body + " M" + (wx - 60) + "," + (wy - 38) + " L" + (wx + 60) + "," + (wy - 38), { w: 1.8 });
    [wx - 34, wx + 34].forEach(function (c) {
      el("circle", { cx: c, cy: wy - 12, r: 13, fill: "#3a332c", stroke: INK, "stroke-width": 1.8 }, wagon);
      el("circle", { cx: c, cy: wy - 12, r: 4.5, fill: "#d8d0c0", stroke: INK, "stroke-width": 1.1 }, wagon);
    });
    path(wagon, "M" + (wx + 58) + "," + (wy - 22) + " L" + (wx + 96) + "," + (wy - 4), { w: 2.4 });
    var tail = el("path", { d: "M" + (wx - 58) + "," + (wy - 44) + " C" + (wx - 74) + "," + (wy - 40) + " " + (wx - 78) + "," + (wy - 20) + " " + (wx - 70) + "," + (wy - 8) + " C" + (wx - 64) + "," + wy + " " + (wx - 74) + "," + (wy + 8) + " " + (wx - 82) + "," + (wy + 4),
      fill: "none", stroke: "#e08a35", "stroke-width": 9, "stroke-linecap": "round" }, wagon);
    stripes(wagon, tail, 8);

    explorer(ink, 336, rock(336) + 2, 1.22);

    // a fingerpost at the edge: both arms point at a peak, and the two peaks look alike
    var px = 470, py = rock(470) + 4, post = el("g", {}, ink);
    wash(post, rectD(px - 4, py - 120, 8, 120), "#8a5a36", .9);
    path(post, "M" + (px - 4) + "," + py + " L" + (px - 4) + "," + (py - 120) + " L" + (px + 4) + "," + (py - 122) + " L" + (px + 4) + "," + py, { w: 1.4 });
    [[py - 110, -14, "PMS2"], [py - 82, -4, "PMS2CL"]].forEach(function (a) {
      var arm = el("g", { transform: "rotate(" + a[1] + " " + px + " " + a[0] + ")" }, post);
      var d = "M" + (px - 6) + "," + (a[0] - 9) + " L" + (px + 84) + "," + (a[0] - 9) + " L" + (px + 96) + "," + a[0] + " L" + (px + 84) + "," + (a[0] + 9) + " L" + (px - 6) + "," + (a[0] + 9) + "Z";
      el("path", { d: d, fill: "#efe2c2", stroke: INK, "stroke-width": 1.3 }, arm);
      el("text", { x: px + 42, y: a[0] + 4.5, "text-anchor": "middle", "font-family": SERIF, "font-style": "italic", "font-size": 13, fill: INK }, arm, a[2]);
    });
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
  (function () {
    var svg = $("pl2"); if (!svg) return;
    var g = inkLayer(svg), R = rng(62);
    plateNo(svg, "PL. II");
    var leaves = [["macaque", 56], ["orangutan", 94], ["gorilla", 132], ["chimpanzee", 170], ["human", 208]];
    var LX = 300, hc = [262, 189], ghc = [196, 160.5], oghc = [132, 127], root = [60, 91.5];
    function elbow(px, py, cx, cy, marks, thick) {
      path(g, "M" + px + "," + py + " L" + px + "," + cy + " L" + cx + "," + cy, { w: thick ? 3.4 : 1.5, stroke: thick ? "#c0392b" : INK });
      for (var i = 0; i < marks; i++) {
        var mx = px + (cx - px) * (i + 1) / (marks + 1) + (R() - .5) * 3;
        el("rect", { x: f(mx - 3), y: f(cy - 9), width: 6, height: 6, fill: "#d9782a", stroke: INK, "stroke-width": .8 }, g);
      }
    }
    elbow(root[0], root[1], LX, leaves[0][1], 2);
    elbow(root[0], root[1], oghc[0], oghc[1], 2);
    elbow(oghc[0], oghc[1], LX, leaves[1][1], 3);
    elbow(oghc[0], oghc[1], ghc[0], ghc[1], 8, true);
    elbow(ghc[0], ghc[1], LX, leaves[2][1], 3);
    elbow(ghc[0], ghc[1], hc[0], hc[1], 2);
    elbow(hc[0], hc[1], LX, leaves[3][1], 2);
    elbow(hc[0], hc[1], LX, leaves[4][1], 2);
    path(g, "M" + (root[0] - 16) + "," + root[1] + " L" + root[0] + "," + root[1], { w: 1.5 });
    leaves.forEach(function (l) { note(svg, LX + 8, l[1] + 4, l[0], { size: 13, fill: INK }); });
    note(svg, 190, 184, "a burst of duplication", { size: 12, fill: "#9a4a12", anchor: "end" });
    note(svg, 40, 236, "in the ancestor of African great apes and humans, ~8–12 Mya", { size: 11.5 });
    el("rect", { x: 300, y: 18, width: 6, height: 6, fill: "#d9782a", stroke: INK, "stroke-width": .8 }, g);
    note(svg, 312, 25, "duplications", { size: 11 });
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
    note(svg, 30, 56, "both copies keep working", { size: 12.5, fill: "#9a4a12" });
    geneModel(g, 30, 84, 150, "#b5543b");
    geneModel(g, 220, 84, 150, "#b5543b");
    note(svg, 105, 114, "HBA2", { size: 13, fill: INK, anchor: "middle" });
    note(svg, 295, 114, "HBA1", { size: 13, fill: INK, anchor: "middle" });
    path(g, "M30,140 L370,140", { w: .8, dash: "2 4", op: .6 });
    note(svg, 30, 166, "one copy decays into a pseudogene", { size: 12.5, fill: "#9a4a12" });
    geneModel(g, 30, 194, 150, A);
    geneModel(g, 220, 194, 150, A, { faded: true, broken: [1, 4], missing: 3 });
    note(svg, 105, 224, "PMS2", { size: 13, fill: INK, anchor: "middle" });
    note(svg, 295, 224, "PMS2CL", { size: 13, fill: INK, anchor: "middle" });
    note(svg, 295, 240, "disabled, but still almost identical", { size: 11, anchor: "middle" });
  })();
  (function () {
    var svg = $("pl4"); if (!svg) return;
    var g = inkLayer(svg);
    plateNo(svg, "PL. IV");
    var seq = "ATCTGAGCTTCAAGGTCCATCTGGACTTAG", diff = 26, x0 = 112, dx = 9.3;
    function strand(y, label, swap) {
      note(svg, 100, y + 4, label, { size: 12.5, fill: INK, anchor: "end" });
      for (var i = 0; i < seq.length; i++) {
        var ch = seq[i], hot = i === diff;
        if (hot && swap) ch = "A";
        el("text", { x: f(x0 + i * dx), y: y + 4, "text-anchor": "middle", "font-family": DISPLAY, "font-size": 12, fill: hot ? RED : INK }, svg, ch);
      }
    }
    strand(62, "gene", false);
    strand(96, "pseudogene", true);
    note(svg, x0 + diff * dx, 124, "the only difference", { size: 11, fill: RED, anchor: "middle" });
    // a short read, copied from the identical stretch
    var r0 = 6, r1 = 15, rx = x0 + r0 * dx - 8, rw = (r1 - r0) * dx + 6, ry = 168;
    el("rect", { x: f(rx), y: ry - 14, width: f(rw), height: 22, fill: "#fffdf6", stroke: INK, "stroke-width": 1.2 }, g);
    el("rect", { x: f(rx + rw / 2 - 18), y: ry - 22, width: 36, height: 10, fill: "rgba(236,224,186,.9)", transform: "rotate(-4 " + f(rx + rw / 2) + " " + (ry - 17) + ")" }, g);
    for (var i = r0; i < r1; i++) el("text", { x: f(x0 + i * dx), y: ry + 2, "text-anchor": "middle", "font-family": DISPLAY, "font-size": 12, fill: INK }, svg, seq[i]);
    path(g, "M" + f(rx) + ",70 l0,-4 l" + f(rw) + ",0 l0,4", { w: 1, op: .7 });
    path(g, "M" + f(rx) + ",104 l0,4 l" + f(rw) + ",0 l0,-4", { w: 1, op: .7 });
    path(g, "M" + f(rx + rw * .3) + "," + (ry - 22) + " C" + f(rx + rw * .3) + ",130 " + f(rx + rw * .25) + ",120 " + f(rx + rw * .3) + ",110", { w: 1, dash: "3 3" });
    path(g, "M" + f(rx + rw * .7) + "," + (ry - 22) + " C" + f(rx + rw * .7) + ",130 " + f(rx + rw * .75) + ",120 " + f(rx + rw * .7) + ",110", { w: 1, dash: "3 3" });
    note(svg, rx + rw + 12, ry + 2, "a short read fits both", { size: 12 });
    note(svg, 30, 222, "so a test can miss a variant in the gene, or blame the gene", { size: 11.5 });
    note(svg, 30, 238, "for a harmless difference that belongs to the pseudogene", { size: 11.5 });
  })();

  // ---------------------------------------------------------------- print: haplotype-resolved PMS2 case
  (function () {
    var svg = $("w1"); if (!svg) return;
    var g = inkLayer(svg);
    note(svg, 14, 24, "RECONSTRUCTED COPIES, ONE SAMPLE", { display: true, size: 9.5, fill: "#9a4a12", ls: "0.12em" });
    [["PMS2", "hap 1", "tract"], ["PMS2", "hap 2", "intact"], ["PMS2CL", "hap 1", "deleted"], ["PMS2CL", "hap 2", "deleted"]].forEach(function (r, i) {
      var y = 62 + i * 40;
      note(svg, 100, y + 5, r[0], { anchor: "end", size: 13.5, fill: INK });
      note(svg, 100, y + 19, r[1], { anchor: "end", size: 11 });
      if (r[2] === "deleted") { ghost(g, 110, y - 6, 176, 16); note(svg, 198, y + 6, "deleted", { anchor: "middle", size: 12 }); return; }
      box(g, 110, y - 6, 176, 16, A, .62);
      if (r[2] === "tract") {
        box(g, 196, y - 6, 54, 16, B, .9);
        path(g, "M196,46 l0,4 l54,0 l0,-4", { w: 1 });
        note(svg, 223, 42, "converted from PMS2CL", { anchor: "middle", size: 11 });
      }
    });
    el("rect", { x: 14, y: 220, width: 10, height: 7, fill: A, opacity: .7 }, svg); note(svg, 28, 227, "PMS2 sequence", { size: 10.5 });
    el("rect", { x: 118, y: 220, width: 10, height: 7, fill: B, opacity: .9 }, svg); note(svg, 132, 227, "PMS2CL sequence", { size: 10.5 });
  })();

  // ---------------------------------------------------------------- alpha-globin genotype glyphs
  function agColumn(svg, g, cx, top, w, genes, count, gt, status, extra) {
    genes.forEach(function (chr, ci) {
      var y = top + ci * 22;
      path(g, "M" + (cx - w / 2) + "," + (y + 6) + " L" + (cx + w / 2) + "," + (y + 6), { w: 1.4 });
      chr.forEach(function (present, gi) {
        var gx = cx - w * 0.36 + gi * w * 0.4;
        if (present) box(g, gx, y, w * 0.3, 13, "#b5543b", .75); else ghost(g, gx, y, w * 0.3, 13);
      });
    });
    note(svg, cx, top + 78, String(count), { display: true, size: 28, fill: INK, anchor: "middle" });
    note(svg, cx, top + 100, gt, { roman: true, size: 14, fill: INK, anchor: "middle" });
    note(svg, cx, top + 118, status, { size: w > 80 ? 13 : 10.5, anchor: "middle" });
    if (extra) note(svg, cx, top + 134, extra, { size: w > 80 ? 12 : 10.5, anchor: "middle", fill: "#9a4a12" });
  }
  (function () {
    var svg = $("w2"); if (!svg) return;
    var g = inkLayer(svg);
    note(svg, 14, 24, "ALPHA-GLOBIN GENOTYPES", { display: true, size: 9.5, fill: "#9a4a12", ls: "0.12em" });
    path(g, "M156,46 l0,-5 l136,0 l0,5", { w: 1 });
    note(svg, 225, 36, "same count, different risk", { anchor: "middle", size: 11.5, fill: INK });
    agColumn(svg, g, 40, 56, 60, [[1, 1], [1, 1]], 4, "αα/αα", "unaffected");
    agColumn(svg, g, 114, 56, 60, [[1, 0], [1, 1]], 3, "−α/αα", "silent carrier");
    agColumn(svg, g, 190, 56, 60, [[0, 0], [1, 1]], 2, "−−/αα", "trait", "cis");
    agColumn(svg, g, 260, 56, 60, [[1, 0], [1, 0]], 2, "−α/−α", "trait", "trans");
    note(svg, 150, 226, "each row is one copy of chromosome 16; hollow = deleted", { anchor: "middle", size: 10.5 });
  })();
  (function () {
    var svg = $("agfig"); if (!svg) return;
    var g = inkLayer(svg);
    path(g, "M300,40 l0,-6 l300,0 l0,6", { w: 1 });
    note(svg, 450, 26, "same count, different risk", { anchor: "middle", size: 14, fill: INK });
    [[[[1, 1], [1, 1]], 4, "αα/αα", "unaffected"], [[[1, 0], [1, 1]], 3, "−α/αα", "silent carrier"],
      [[[0, 0], [1, 1]], 2, "−−/αα", "trait", "both on one chromosome (cis)"], [[[1, 0], [1, 0]], 2, "−α/−α", "trait", "one on each (trans)"],
      [[[0, 0], [1, 0]], 1, "−−/−α", "HbH disease"], [[[0, 0], [0, 0]], 0, "−−/−−", "Hb Bart's hydrops fetalis"]].forEach(function (c, i) {
      agColumn(svg, g, 75 + i * 150, 54, 92, c[0], c[1], c[2], c[3], c[4]);
    });
  })();

  // ---------------------------------------------------------------- print: TELR
  (function () {
    var svg = $("w3"); if (!svg) return;
    var g = inkLayer(svg);
    note(svg, 14, 24, "ONE INSERTION, FOUR GENOME COPIES", { display: true, size: 9.5, fill: "#9a4a12", ls: "0.12em" });
    drawFly(g, 250, 62, 0.5);
    [[34, 182, 72], [52, 204, 82], [40, 196, 92]].forEach(function (r) {
      path(g, "M" + r[0] + "," + r[2] + " L" + r[1] + "," + r[2], { w: 1.6 });
      path(g, "M104," + r[2] + " L132," + r[2], { w: 3, stroke: TE });
    });
    note(svg, 34, 60, "long reads span it", { size: 11.5 });
    arrow(g, 118, 100, 118, 124, { w: 1.3 });
    note(svg, 128, 116, "local assembly", { size: 11.5 });
    for (var i = 0; i < 4; i++) {
      var y = 140 + i * 16;
      if (i === 1) {
        path(g, "M14," + y + " L104," + y + " M132," + y + " L286," + y, { w: 1.5 });
        path(g, "M104," + y + " C106," + (y - 9) + " 130," + (y - 9) + " 132," + y, { w: 3, stroke: TE });
      } else path(g, "M14," + y + " L286," + y, { w: 1.5 });
    }
    note(svg, 150, 220, "insertion on 1 of 4 copies · allele frequency ≈ 0.25", { anchor: "middle", size: 11 });
  })();
  (function () {
    var svg = $("fly"); if (!svg) return;
    drawFly(inkLayer(svg), 100, 90, 1.25);
  })();

  // ---------------------------------------------------------------- Figure 2: the PMS2 case, redrawn
  (function () {
    var svg = $("fig2"); if (!svg) return;
    var g = inkLayer(svg), R = rng(72);
    var X0 = 150, X1 = 970, K0 = 5970, K1 = 5986;
    var kx = function (kb) { return X0 + (kb - K0) / (K1 - K0) * (X1 - X0); };
    // ruler
    arrow(g, kx(5978) - 30, 22, X0, 22, { w: 1 }); arrow(g, kx(5978) + 30, 22, X1, 22, { w: 1 });
    note(svg, kx(5978), 26, "16 kb", { anchor: "middle", size: 12, fill: INK, roman: true });
    path(g, "M" + X0 + ",44 L" + X1 + ",44", { w: 1 });
    for (var k = K0; k <= K1; k++) {
      path(g, "M" + f(kx(k)) + ",44 l0," + (k % 2 ? 4 : 8), { w: .9 });
      if (k % 2 === 0) note(svg, kx(k), 64, k.toLocaleString("en-US") + " kb", { anchor: "middle", size: 10.5, roman: true });
    }
    // genes (both on the minus strand)
    var gy = 94;
    path(g, "M" + X0 + "," + gy + " L" + X1 + "," + gy, { w: 1.1 });
    var chev = "";
    for (var cx = X0 + 20; cx < X1; cx += 34) chev += " M" + (cx + 3) + "," + (gy - 3) + " l-4,3 l4,3";
    path(g, chev, { w: .8, op: .7 });
    [[5970.5, 5970.8, 6], [5970.9, 5972.6, 6], [5972.7, 5972.8, 8], [5977.3, 5977.5, 9], [5978.4, 5978.5, 8], [5981.6, 5981.7, 8], [5976.1, 5976.2, 5]].forEach(function (e) {
      box(g, kx(e[0]), gy - e[2], kx(e[1]) - kx(e[0]), e[2] * 2, A, .8, 1);
    });
    note(svg, kx(5971), gy + 22, "RSPH10B", { size: 11.5, anchor: "middle" });
    note(svg, kx(5978.4), gy + 22, "PMS2", { size: 11.5, anchor: "middle" });
    // two read pileups, one per reconstructed haplotype
    function pileup(top, rows, convFrom) {
      for (var r = 0; r < rows; r++) {
        var x = X0 - R() * 40;
        while (x < X1) {
          var len = 34 + R() * 26, a = Math.max(X0, x), b = Math.min(X1, x + len);
          if (b - a > 6) path(g, "M" + f(a) + "," + f(top + 22 + r * 5.2) + " L" + f(b) + "," + f(top + 22 + r * 5.2), { w: 2.6, stroke: "#b8b0a2" });
          x += len + 3 + R() * 8;
        }
      }
      var ticks = "";
      for (var t = 0; t < 26; t++) ticks += " M" + f(kx(K0 + R() * 16)) + "," + top + " l0,14";
      path(g, ticks, { w: 2.2, stroke: "#d9782a" });
      if (convFrom) {
        var dense = "";
        for (var u = 0; u < 46; u++) dense += " M" + f(kx(convFrom + 0.2 + R() * (K1 - convFrom - 0.3))) + "," + top + " l0,14";
        path(g, dense, { w: 2.2, stroke: "#8a5a36" });
      }
    }
    pileup(126, 12, 5978.6);
    var cxa = kx(5978.6);
    wash(g, rectD(cxa, 120, X1 - cxa, 92), A, .35);
    el("rect", { x: f(cxa), y: 120, width: f(X1 - cxa), height: 92, fill: "none", stroke: "#2c4f72", "stroke-width": 1.4 }, g);
    el("rect", { x: f(cxa + 16), y: 180, width: 230, height: 22, fill: "#fffdf6", stroke: INK, "stroke-width": 1 }, g);
    note(svg, cxa + 26, 196, "PMS2CL → PMS2 gene conversion", { size: 13, fill: INK });
    pileup(232, 10, 0);
    [[126, "PMS2 haplotype 1"], [232, "PMS2 haplotype 2"]].forEach(function (h) {
      note(svg, 16, h[0] + 40, h[1], { size: 13.5, fill: INK });
    });
    // what that means for each gene copy
    function model(x, y, w, conv) {
      path(g, "M" + x + "," + y + " L" + (x + w) + "," + y, { w: 1.2 });
      [[0, .1, 9], [.3, .02, 7], [.55, .02, 7], [.78, .02, 6], [.9, .06, 9]].forEach(function (e) { box(g, x + e[0] * w, y - e[2], e[1] * w, e[2] * 2, A, .85, 1); });
      if (conv) { wash(g, rectD(x + .28 * w, y - 16, .7 * w, 32), A, .3); el("rect", { x: f(x + .28 * w), y: y - 16, width: f(.7 * w), height: 32, fill: "none", stroke: "#2c4f72", "stroke-width": 1.2 }, g); }
    }
    function deleted(x, y, w) {
      path(g, "M" + x + "," + y + " L" + (x + w) + "," + y, { w: 1.2 });
      [[.1, .04], [.5, .015], [.75, .015], [.97, .02]].forEach(function (e) { box(g, x + e[0] * w, y - 8, e[1] * w, 16, B, .7, 1); });
      path(g, "M" + (x + w * .42 - 9) + "," + (y - 12) + " l18,24 M" + (x + w * .42 + 9) + "," + (y - 12) + " l-18,24", { w: 3.2, stroke: "#c0392b" });
    }
    note(svg, kx(5976), 354, "PMS2CL → PMS2 conversion", { size: 12.5, anchor: "middle", fill: INK });
    [[392, true, "non-functional", RED], [470, false, "functional", LEAF]].forEach(function (row, i) {
      note(svg, 16, row[0] + 5, "haplotype " + (i + 1), { size: 13.5, fill: INK });
      model(150, row[0], 320, row[1]);
      note(svg, 310, row[0] + 34, row[2] + " PMS2", { size: 12.5, anchor: "middle", fill: row[3] });
      deleted(620, row[0], 300);
      note(svg, 770, row[0] + 34, "PMS2CL deleted", { size: 12.5, anchor: "middle", fill: INK });
    });
  })();

  // ---------------------------------------------------------------- Figure 4: the TELR pipeline, redrawn
  (function () {
    var svg = $("fig4"); if (!svg) return;
    var g = inkLayer(svg);
    function panel(x, y, w, h, n, title) {
      el("rect", { x: x, y: y, width: w, height: h, fill: "none", stroke: INK, "stroke-width": 1.1, "stroke-dasharray": "5 4" }, g);
      note(svg, x + 14, y + 26, n, { display: true, size: 13, fill: "#9a4a12" });
      note(svg, x + 34, y + 26, title, { display: true, size: 14, fill: INK });
    }
    function bar(x0, x1, y, color, w) { path(g, "M" + x0 + "," + y + " L" + x1 + "," + y, { w: w || 3.6, stroke: color }); }
    function read(x0, mid, x1, y, leftColor, rightColor) { bar(x0, mid, y, leftColor, 3); bar(mid, x1, y, rightColor, 3); }
    function tool(x, y, s) { note(svg, x, y, s, { size: 11.5 }); }
    // 1
    panel(10, 10, 530, 268, "1", "Find candidate insertions");
    bar(160, 440, 64, FLANK, 6);
    note(svg, 448, 68, "reference", { size: 11.5 });
    el("path", { d: "M296,50 l-6,-10 l12,0Z", fill: TE, stroke: INK, "stroke-width": 1 }, g);
    note(svg, 306, 46, "SV insertion", { size: 11.5 });
    [[230, 296, 330], [240, 296, 340], [250, 296, 352], [262, 296, 344]].forEach(function (r, i) { read(r[0], r[1], r[2], 82 + i * 9, FLANK, TE + "99"); });
    [[220, 296, 360], [236, 296, 352], [244, 296, 370]].forEach(function (r, i) { read(r[0], r[1], r[2], 118 + i * 9, TE + "99", FLANK); });
    tool(28, 104, "align long reads, call SVs");
    tool(28, 120, "(NGMLR, Sniffles)");
    arrow(g, 224, 150, 248, 176, { w: 1.1 });
    bar(256, 336, 180, TE, 3.4);
    note(svg, 346, 184, "insertion sequence", { size: 11.5 });
    note(svg, 296, 210, "matches a TE consensus?", { size: 12, anchor: "middle", fill: INK });
    arrow(g, 260, 218, 220, 244, { w: 1.1 }); arrow(g, 332, 218, 372, 244, { w: 1.1 });
    note(svg, 206, 262, "yes: candidate locus", { size: 11.5, anchor: "middle", fill: INK });
    note(svg, 386, 262, "no: discard", { size: 11.5, anchor: "middle" });
    tool(28, 214, "(RepeatMasker)");
    // 2
    panel(10, 288, 530, 156, "2", "Assemble a local contig");
    for (var i = 0; i < 6; i++) read(200 + i * 10 - (i % 2) * 14, 260, 330 + (i % 3) * 18, 324 + i * 8, FLANK, TE);
    [[260, 330, 380]].forEach(function () {});
    arrow(g, 290, 376, 290, 398, { w: 1.1 });
    bar(200, 260, 412, FLANK, 4); bar(260, 340, 412, TE, 4); bar(340, 400, 412, FLANK, 4);
    note(svg, 410, 416, "polished contig", { size: 11.5 });
    tool(28, 350, "assemble and polish");
    tool(28, 366, "(wtdbg2, minimap2)");
    // 3
    panel(10, 454, 530, 156, "3", "Name the family, place it");
    bar(200, 260, 494, FLANK, 4); bar(260, 340, 494, TE, 4); bar(340, 400, 494, FLANK, 4);
    note(svg, 410, 498, "annotated contig", { size: 11.5 });
    el("path", { d: "M252,498 L268,498 L304,566 L296,566Z M332,498 L348,498 L304,566 L296,566Z", fill: "#f2c98a", opacity: .75 }, g);
    bar(170, 440, 570, FLANK, 6);
    note(svg, 448, 574, "reference", { size: 11.5 });
    path(g, "M300,570 l0,18", { w: 1 });
    note(svg, 306, 596, "coordinates, target-site duplication", { size: 11 });
    tool(28, 516, "annotate the TE");
    tool(28, 532, "(minimap2, RepeatMasker)");
    // 4
    panel(550, 10, 440, 600, "4", "Estimate allele frequency");
    bar(620, 940, 64, FLANK, 6);
    el("path", { d: "M780,50 l-6,-10 l12,0Z", fill: TE, stroke: INK, "stroke-width": 1 }, g);
    for (var r = 0; r < 5; r++) read(700 + r * 8, 780, 820 + r * 6, 82 + r * 8, FLANK, TE + "99");
    for (var q = 0; q < 6; q++) bar(660 + q * 14, 860 + q * 12, 128 + q * 8, FLANK, 3);
    note(svg, 566, 104, "TE-supporting reads", { size: 11.5 });
    note(svg, 566, 182, "reference-supporting reads", { size: 11.5 });
    arrow(g, 780, 186, 780, 210, { w: 1.1 });
    for (var t2 = 0; t2 < 5; t2++) read(690 + t2 * 6, 760, 820 + t2 * 8, 226 + t2 * 8, FLANK, TE);
    for (var t3 = 0; t3 < 5; t3++) { bar(680 + t3 * 10, 760, 274 + t3 * 8, FLANK, 3); path(g, "M760," + (274 + t3 * 8) + " L840," + (274 + t3 * 8), { w: 1, dash: "3 3" }); bar(840, 900 - t3 * 6, 274 + t3 * 8, FLANK, 3); }
    bar(660, 760, 330, FLANK, 4); bar(760, 840, 330, TE, 4); bar(840, 940, 330, FLANK, 4);
    note(svg, 566, 254, "reads aligned to", { size: 11.5 }); note(svg, 566, 270, "the TE contig", { size: 11.5 });
    arrow(g, 800, 346, 800, 370, { w: 1.1 });
    // depth trace with four windows
    var dy = 470, depth = function (x) { return x < 748 ? dy - 70 : x < 852 ? dy - 34 : dy - 70; };
    [[700, "5′ flank"], [772, "5′ TE"], [828, "3′ TE"], [900, "3′ flank"]].forEach(function (w) {
      el("rect", { x: w[0] - 8, y: dy - 92, width: 16, height: 92, fill: "#d8d0c0", opacity: .7 }, g);
      note(svg, w[0], dy - 98, w[1], { size: 10.5, anchor: "middle" });
    });
    var dd = "";
    for (var x = 660; x <= 940; x += 4) { var yy = depth(x); if (Math.abs(x - 750) < 6 || Math.abs(x - 850) < 6) yy = (dy - 52); dd += (dd ? " L" : "M") + x + "," + f(yy + Math.sin(x / 9) * 2); }
    path(g, dd, { w: 1.6 });
    path(g, "M650," + (dy - 100) + " L650," + dy + " L950," + dy, { w: 1.2 });
    note(svg, 640, dy - 40, "depth", { size: 11, anchor: "end" });
    bar(660, 760, dy + 16, FLANK, 4); bar(760, 840, dy + 16, TE, 4); bar(840, 940, dy + 16, FLANK, 4);
    note(svg, 745, 548, "AF = ½ ( 5′ TE ÷ 5′ flank + 3′ TE ÷ 3′ flank )", { size: 14, anchor: "middle", fill: INK, roman: true });
    tool(566, 392, "depth-based estimate");
    tool(566, 408, "(SAMtools)");
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
