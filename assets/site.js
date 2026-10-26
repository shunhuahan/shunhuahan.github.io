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

  // ---------------------------------------------------------------- the front: a vignette engraving of two identical peaks
  // Drawn the way a survey engraver would: the land is cut into ridgelines, nearer lines hide farther ones,
  // tone comes from how closely lines are laid, and a flag on one summit is the only difference.
  function drawEngraving(canvas, opts) {
      opts = opts || {}; if (!canvas || !canvas.getContext) return;
      var VW = 1440, VH = 800, F = 900, H0 = 520, CAMH = 1.2;
      function hash(x, y) { var h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return h - Math.floor(h); }
      function vnoise(x, y) {
        var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
        var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
        var a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
        return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
      }
      function fbm(x, y, o) { var s = 0, a = .5, k = 1; for (var i = 0; i < o; i++) { s += a * vnoise(x * k, y * k); k *= 2.03; a *= .5; } return s; }
      function ridged(x, y, o) { var s = 0, a = .55, k = 1; for (var i = 0; i < o; i++) { var n = 1 - Math.abs(vnoise(x * k, y * k) * 2 - 1); s += a * n * n; k *= 2.1; a *= .5; } return s; }

      var PZ = 30, PH = 12.6, PR = 10.5, PEAKS = [6.4, 16.2];
      function peak(dx, dz) {
        var r = Math.sqrt(dx * dx + dz * dz * 0.7);
        if (r >= PR) return 0;
        var cone = Math.pow(1 - r / PR, 1.45);
        return PH * cone * (0.8 + 0.42 * ridged(dx * 0.32 + 3.1, dz * 0.32 + 7.7, 4));
      }
      function height(X, Z) {
        var h = 0;
        for (var i = 0; i < PEAKS.length; i++) {
          var dx = X - PEAKS[i], dz = Z - PZ;
          if (Math.abs(dx) < PR && Math.abs(dz) < PR * 1.2) h = Math.max(h, peak(dx, dz));
        }
        // a far range behind, low rolling ground in the valley
        h = Math.max(h, 3.2 * fbm(X * 0.05 + 11, Z * 0.05, 3) * Math.min(1, Math.max(0, (Z - 38) / 12)));
        var ramp = Math.min(1, Math.max(0, (Z - 8) / 14)); ramp = ramp * ramp * (3 - 2 * ramp);
        var valley = 0.25 + Math.pow(fbm(X * 0.075 + 5, Z * 0.075, 4), 1.6) * 5.2 * ramp;
        h = Math.max(h, valley);
        // the near ledge the explorer stands on, falling away to the right
        var ledge = 1.42 * Math.exp(-Math.pow((Z - 4.8) / 1.9, 2)) / (1 + Math.exp((X + 0.75) * 1.9));
        h = Math.max(h, ledge);
        return h;
      }
      function snowy(X, Z, h) {
        for (var i = 0; i < PEAKS.length; i++) if (Math.abs(X - PEAKS[i]) < PR && Math.abs(Z - PZ) < PR && h > 8.4 + 1.1 * vnoise(X * 1.3, Z * 1.3)) return true;
        return false;
      }

      (function draw() {
        var W = canvas.clientWidth, H = canvas.clientHeight; if (!W || !H) return;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
        // cover the box from the bottom; on a narrow screen keep the whole valley in view instead
        var s = Math.max(W / VW, Math.min(H / VH, W / 1100));
        var s0 = s; s = s * (opts.zoom || 1); var ox = W / 2 - (opts.focus || 800) * s, oy = H - (opts.bottom || VH) * s;
        var ctx = canvas.getContext("2d");
        ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * ox, dpr * oy);
        ctx.clearRect(0, 0, VW, VH);
        var px = 1 / s;                       // one CSS pixel, in scene units
        var x0 = Math.max(0, Math.floor(-ox / s) - 4), x1 = Math.min(VW, Math.ceil((W - ox) / s) + 4);

        // a low warm light behind the peaks, laid on like a thin wash
        var glow = ctx.createRadialGradient(1060, 470, 20, 1060, 470, 560);
        glow.addColorStop(0, "rgba(222, 170, 104, 0.26)"); glow.addColorStop(1, "rgba(222, 170, 104, 0)");
        ctx.fillStyle = glow; ctx.fillRect(0, 0, VW, VH);

        // sky: ruled lines that thin out upward and toward the text, the way a vignette engraving fades
        ctx.strokeStyle = "rgba(36, 31, 26, 0.32)";
        for (var sy = H0 - 4; sy > 110; sy -= 5.2 * px) {
          var fadeY = (H0 - sy) / (H0 - 110);
          ctx.lineWidth = Math.max(0.35 * px, 0.75 * px * (1 - fadeY));
          ctx.beginPath();
          var on = false;
          for (var sx = Math.max(x0, 600); sx <= x1; sx += 3) {
            var ex = (sx - 1100) / 520, ey = (sy - 480) / 330;
            var keep = ex * ex + ey * ey + 0.35 * vnoise(sx * 0.02, sy * 0.05) < 1;
            var cloud = fbm(sx * 0.004 + 4, sy * 0.016, 3) > 0.6 + fadeY * 0.1;
            if (keep && !cloud) { if (!on) { ctx.moveTo(sx, sy); on = true; } else ctx.lineTo(sx, sy); }
            else on = false;
          }
          ctx.stroke();
        }

        // the land, nearest line first, each hidden wherever a nearer one already rose above it
        var cols = Math.ceil((x1 - x0) / 2) + 1;
        var occ = new Float32Array(cols).fill(1e9);
        var ledgeTop = null;
        var BUCKETS = 7, paths = [];
        for (var b = 0; b < BUCKETS; b++) paths.push(new Path2D());
        var Z = 1.6, row = 0, prevY = new Float32Array(cols).fill(NaN);
        while (Z < 72) {
          var fade = Math.max(0.28, 1 - (Z - 2) / 80);
          var rowBucket = new Int8Array(cols).fill(-1), ys = new Float32Array(cols);
          for (var c = 0; c < cols; c++) {
            var X = (x0 + c * 2 - VW / 2) * Z / F, e = 0.06 * Z;
            var h = height(X, Z), y = H0 - (h - CAMH) * F / Z;
            ys[c] = y;
            var dy = isNaN(prevY[c]) ? 1 : Math.max(0.05, prevY[c] - y);
            prevY[c] = y;
            if (y >= occ[c] - 0.15) continue;
            var edge = occ[c] - y > 10 * px;   // a ridge rising into view always gets its outline
            occ[c] = y;
            // light from the upper left and a little behind the viewer
            var hx = (height(X + e, Z) - height(X - e, Z)) / (2 * e), hz = (height(X, Z + e) - h) / e;
            var nl = Math.sqrt(hx * hx + 1 + hz * hz);
            var lit = Math.max(0, Math.min(1, (hx * 0.9 + 0.62 - hz * 0.35) / nl));
            var snow = snowy(X, Z, h);
            var gap = (snow ? 10 : 2.2 + 6.2 * Math.pow(lit, 1.5)) * px;
            // draw every k-th row, k a power of two: lit ground keeps the lines a shadow would also draw
            var k = Math.pow(2, Math.max(0, Math.min(8, Math.round(Math.log(gap / dy) / Math.LN2))));
            if (!edge && row % k) continue;
            var tone = (snow ? 0.3 : 0.5 + 0.5 * (1 - lit)) * fade * (edge ? 1.2 : 1);
            rowBucket[c] = Math.max(0, Math.min(BUCKETS - 1, Math.round(tone * (BUCKETS - 1))));
          }
          for (var kk = 0; kk < cols; kk++) {
            var bk = rowBucket[kk]; if (bk < 0) continue;
            var p = paths[bk], xx = x0 + kk * 2;
            if (kk > 0 && rowBucket[kk - 1] >= 0 && Math.abs(ys[kk - 1] - ys[kk]) < 8) { p.moveTo(xx - 2, ys[kk - 1]); p.lineTo(xx, ys[kk]); }
            else { p.moveTo(xx - 0.6, ys[kk]); p.lineTo(xx + 0.6, ys[kk]); }
          }
          if (Z > 8 && !ledgeTop) ledgeTop = occ.slice();
          Z += Z / 380; row++;
        }
        for (var q = 0; q < BUCKETS; q++) {
          var t = q / (BUCKETS - 1);
          ctx.strokeStyle = "rgba(36, 31, 26, " + (0.18 + 0.78 * t).toFixed(3) + ")";
          ctx.lineWidth = (0.5 + 0.38 * t) * px;
          ctx.lineCap = "round";
          ctx.stroke(paths[q]);
        }

        // the flag on the first summit: the one place the two peaks differ
        var fx = VW / 2 + PEAKS[0] * F / PZ, fh = peak(0, 0), fy = H0 - (fh - CAMH) * F / PZ;
        ctx.strokeStyle = "#241f1a"; ctx.lineWidth = 1.1 * px;
        ctx.beginPath(); ctx.moveTo(fx, fy + 1); ctx.lineTo(fx, fy - 22); ctx.stroke();
        ctx.fillStyle = "#a8432e";
        ctx.beginPath(); ctx.moveTo(fx, fy - 22); ctx.lineTo(fx + 14, fy - 18.5); ctx.lineTo(fx, fy - 15); ctx.closePath(); ctx.fill();

        // a few birds, far off
        ctx.strokeStyle = "rgba(36, 31, 26, 0.7)"; ctx.lineWidth = 1 * px;
        [[760, 300, 1], [790, 286, .8], [812, 306, .7]].forEach(function (bd) {
          var bx = bd[0], by = bd[1], bs = bd[2] * 6;
          ctx.beginPath(); ctx.moveTo(bx - bs, by - bs * .3); ctx.quadraticCurveTo(bx - bs * .4, by - bs * .6, bx, by); ctx.quadraticCurveTo(bx + bs * .4, by - bs * .6, bx + bs, by - bs * .3); ctx.stroke();
        });

        // the explorer, a small figure on the ledge with a telescope raised toward the peaks
        var ex0 = 430, ec = Math.round((ex0 - x0) / 2);
        if (ledgeTop && ec >= 0 && ec < cols) {
          var gy = Math.min(ledgeTop[Math.max(0, ec - 2)], ledgeTop[ec], ledgeTop[Math.min(cols - 1, ec + 2)]) + 1.5;
          ctx.save(); ctx.translate(ex0, gy); ctx.scale(1.05, 1.05);
          ctx.fillStyle = "#231d18"; ctx.strokeStyle = "#231d18"; ctx.lineCap = "round"; ctx.lineJoin = "round";
          ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(-12, -36); ctx.lineTo(-16, 0.5); ctx.stroke();       // stick
          ctx.beginPath();                                                                                       // legs
          ctx.moveTo(-6, -22); ctx.lineTo(-8.5, -0.5); ctx.lineTo(-4.6, -0.5); ctx.lineTo(-2.4, -18);
          ctx.lineTo(0.6, -18); ctx.lineTo(3.6, -0.5); ctx.lineTo(7.4, -0.5); ctx.lineTo(4.4, -22); ctx.closePath(); ctx.fill();
          ctx.beginPath(); ctx.ellipse(-6.4, 0, 3.6, 1.6, 0, 0, Math.PI * 2); ctx.ellipse(5.6, 0, 3.6, 1.6, 0, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath();                                                                                       // coat
          ctx.moveTo(-7, -45); ctx.quadraticCurveTo(-1, -48, 6, -45); ctx.lineTo(9, -19); ctx.quadraticCurveTo(0, -16, -10.5, -19); ctx.closePath(); ctx.fill();
          ctx.beginPath(); ctx.moveTo(-15, -47); ctx.lineTo(-6, -48); ctx.lineTo(-5, -27); ctx.lineTo(-14.5, -26); ctx.closePath(); ctx.fill();   // pack
          ctx.beginPath(); ctx.ellipse(-10.6, -49.5, 5.6, 2.6, -0.1, 0, Math.PI * 2); ctx.fill();               // bedroll
          ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(4, -43); ctx.quadraticCurveTo(9, -45, 12, -50); ctx.stroke();   // arm
          ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(8, -51); ctx.lineTo(29, -58.5); ctx.stroke();         // telescope
          ctx.lineWidth = 1.7; ctx.beginPath(); ctx.moveTo(29, -58.5); ctx.lineTo(33, -60); ctx.stroke();
          ctx.beginPath(); ctx.arc(1.5, -50.5, 4.2, 0, Math.PI * 2); ctx.fill();                                 // head
          ctx.beginPath(); ctx.ellipse(1.5, -54, 7.6, 1.5, -0.05, 0, Math.PI * 2); ctx.fill();                   // hat brim
          ctx.beginPath(); ctx.moveTo(-2.6, -54); ctx.quadraticCurveTo(1.5, -61.5, 5.6, -54); ctx.closePath(); ctx.fill();
          ctx.beginPath(); ctx.moveTo(-3, -45); ctx.quadraticCurveTo(-10, -46, -15, -42); ctx.quadraticCurveTo(-9, -44, -3, -42.5); ctx.closePath();   // scarf
          ctx.fillStyle = "#a8432e"; ctx.fill();
          ctx.restore();
        }
      })();
  }
  (function () {
    var canvas = $("vign"); if (!canvas) return;
    var paint = function () { drawEngraving(canvas, { focus: 1035, zoom: 1.75, bottom: 545 }); };
    paint();
    var timer;
    window.addEventListener("resize", function () { clearTimeout(timer); timer = setTimeout(paint, 160); });
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
  // a small portrait for each species: macaque, orangutan, gorilla, chimpanzee, human
  function primate(svg, kind, cx, cy) {
    var g = el("g", { transform: "translate(" + cx + "," + cy + ")" }, svg), w = 1.1;
    function e(x, y, rx, ry, fill, sw) { return el("ellipse", { cx: x, cy: y, rx: rx, ry: ry, fill: fill, stroke: INK, "stroke-width": sw == null ? w : sw }, g); }
    function eyes(y, dx) { el("circle", { cx: -dx, cy: y, r: 1.1, fill: INK }, g); el("circle", { cx: dx, cy: y, r: 1.1, fill: INK }, g); }
    if (kind === "macaque") {
      e(-8.5, -1, 2.6, 3, "#b49a7a"); e(8.5, -1, 2.6, 3, "#b49a7a");
      e(0, 0, 8.5, 9.5, "#b49a7a"); e(0, 1.5, 5.6, 6.8, "#e3b4a0", .8); eyes(-0.5, 2.3);
      path(g, "M-1.5,4.6 Q0,5.6 1.5,4.6", { w: .8 });
    } else if (kind === "orangutan") {
      e(0, 1, 11.5, 8.5, "#a8582c"); e(0, 1.5, 6.8, 7.6, "#6b4a35", .8); eyes(0, 2.4);
      path(g, "M-2,5 Q0,6 2,5", { w: .8, stroke: "#e8d6c0" }); path(g, "M-6,-8 q6,-4 12,0", { w: 1.6, stroke: "#a8582c" });
    } else if (kind === "gorilla") {
      el("path", { d: "M-8,4 C-10,-6 -5,-13 0,-13 C5,-13 10,-6 8,4 C6,10 -6,10 -8,4Z", fill: "#2f2a27", stroke: INK, "stroke-width": w }, g);
      e(0, 3.2, 5.6, 4.6, "#544a44", .8); path(g, "M-5,-2.5 L5,-2.5", { w: 1.6, stroke: "#161311" });
      el("circle", { cx: -2.4, cy: -0.6, r: 1, fill: "#e8dccb" }, g); el("circle", { cx: 2.4, cy: -0.6, r: 1, fill: "#e8dccb" }, g);
    } else if (kind === "chimpanzee") {
      e(-9.5, -0.5, 3.6, 4.4, "#d8b48e"); e(9.5, -0.5, 3.6, 4.4, "#d8b48e");
      e(0, -1, 8.4, 9.2, "#4a3a2e"); e(0, 2.4, 6, 5.8, "#d8b48e", .8); eyes(-1.2, 2.3);
      path(g, "M-2.4,5 Q0,6.4 2.4,5", { w: .8 });
    } else {
      e(0, 0.5, 7.4, 9.4, "#e7c2a0"); el("path", { d: "M-7.6,-1 C-8,-9 -3,-10.8 0,-10.8 C3,-10.8 8,-9 7.6,-1 C5,-5.5 -5,-5.5 -7.6,-1Z", fill: "#2c2420", stroke: INK, "stroke-width": .8 }, g);
      eyes(0.6, 2.6); path(g, "M0,1.6 L-0.8,4.2 L0.6,4.4 M-2,6.6 Q0,7.6 2,6.6", { w: .8 });
    }
  }
  (function () {
    var svg = $("pl2"); if (!svg) return;
    var g = inkLayer(svg), R = rng(62);
    plateNo(svg, "PL. II");
    var leaves = [["macaque", 42], ["orangutan", 82], ["gorilla", 122], ["chimpanzee", 162], ["human", 202]];
    var LX = 282, hc = [236, 182], ghc = [176, 152], oghc = [114, 117], root = [48, 79.5];
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
      primate(svg, l[0], LX + 16, l[1]);
      note(svg, LX + 33, l[1] + 4.5, l[0], { size: 13, fill: INK, roman: true });
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
        while (x < r[0] + 116) { var len = 18 + R() * 10; ghost(g, x, 40 + row * 6.5, Math.min(len, r[0] + 120 - x), 3.6); x += len + 3 + R() * 5; }
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
