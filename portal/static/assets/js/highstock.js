/*
 Highcharts JS v5.0.4 (2016-11-22)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(N, a) {
    "object" === typeof module && module.exports ? module.exports = N.document ? a(N) : a : N.Highcharts = a(N)
})("undefined" !== typeof window ? window : this, function(N) {
    N = function() {
        var a = window,
            D = a.document,
            B = a.navigator && a.navigator.userAgent || "",
            F = D && D.createElementNS && !!D.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
            G = /(edge|msie|trident)/i.test(B) && !window.opera,
            r = !F,
            h = /Firefox/.test(B),
            m = h && 4 > parseInt(B.split("Firefox/")[1], 10);
        return a.Highcharts ? a.Highcharts.error(16, !0) : {
            product: "Highcharts",
            version: "5.0.4",
            deg2rad: 2 * Math.PI / 360,
            doc: D,
            hasBidiBug: m,
            hasTouch: D && void 0 !== D.documentElement.ontouchstart,
            isMS: G,
            isWebKit: /AppleWebKit/.test(B),
            isFirefox: h,
            isTouchDevice: /(Mobile|Android|Windows Phone)/.test(B),
            SVG_NS: "http://www.w3.org/2000/svg",
            chartCount: 0,
            seriesTypes: {},
            symbolSizes: {},
            svg: F,
            vml: r,
            win: a,
            charts: [],
            marginNames: ["plotTop", "marginRight", "marginBottom", "plotLeft"],
            noop: function() {}
        }
    }();
    (function(a) {
        var D = [],
            B = a.charts,
            F = a.doc,
            G = a.win;
        a.error = function(a, h) {
            a = "Highcharts error #" +
                a + ": www.highcharts.com/errors/" + a;
            if (h) throw Error(a);
            G.console && console.log(a)
        };
        a.Fx = function(a, h, m) {
            this.options = h;
            this.elem = a;
            this.prop = m
        };
        a.Fx.prototype = {
            dSetter: function() {
                var a = this.paths[0],
                    h = this.paths[1],
                    m = [],
                    t = this.now,
                    q = a.length,
                    l;
                if (1 === t) m = this.toD;
                else if (q === h.length && 1 > t)
                    for (; q--;) l = parseFloat(a[q]), m[q] = isNaN(l) ? a[q] : t * parseFloat(h[q] - l) + l;
                else m = h;
                this.elem.animProp = "d";
                this.elem.attr("d", m);
                this.elem.animProp = null
            },
            update: function() {
                var a = this.elem,
                    h = this.prop,
                    m = this.now,
                    t = this.options.step;
                if (this[h + "Setter"]) this[h + "Setter"]();
                else a.attr ? a.element && (a.animProp = h, a.attr(h, m), a.animProp = null) : a.style[h] = m + this.unit;
                t && t.call(a, m, this)
            },
            run: function(a, h, m) {
                var r = this,
                    q = function(a) {
                        return q.stopped ? !1 : r.step(a)
                    },
                    l;
                this.startTime = +new Date;
                this.start = a;
                this.end = h;
                this.unit = m;
                this.now = this.start;
                this.pos = 0;
                q.elem = this.elem;
                q.prop = this.prop;
                q() && 1 === D.push(q) && (q.timerId = setInterval(function() {
                    for (l = 0; l < D.length; l++) D[l]() || D.splice(l--, 1);
                    D.length || clearInterval(q.timerId)
                }, 13))
            },
            step: function(a) {
                var h = +new Date,
                    m, r = this.options;
                m = this.elem;
                var q = r.complete,
                    l = r.duration,
                    f = r.curAnim,
                    b;
                if (m.attr && !m.element) m = !1;
                else if (a || h >= l + this.startTime) {
                    this.now = this.end;
                    this.pos = 1;
                    this.update();
                    a = f[this.prop] = !0;
                    for (b in f) !0 !== f[b] && (a = !1);
                    a && q && q.call(m);
                    m = !1
                } else this.pos = r.easing((h - this.startTime) / l), this.now = this.start + (this.end - this.start) * this.pos, this.update(), m = !0;
                return m
            },
            initPath: function(r, h, m) {
                function t(a) {
                    var d, b;
                    for (c = a.length; c--;) d = "M" === a[c] || "L" === a[c], b = /[a-zA-Z]/.test(a[c + 3]), d && !b &&
                        a.splice(c + 1, 0, a[c + 1], a[c + 2], a[c + 1], a[c + 2])
                }

                function q(a, d) {
                    for (; a.length < g;) {
                        a[0] = d[g - a.length];
                        var b = a.slice(0, p);
                        [].splice.apply(a, [0, 0].concat(b));
                        n && (b = a.slice(a.length - p), [].splice.apply(a, [a.length, 0].concat(b)), c--)
                    }
                    a[0] = "M"
                }

                function l(a, d) {
                    for (var b = (g - a.length) / p; 0 < b && b--;) e = a.slice().splice(a.length / u - p, p * u), e[0] = d[g - p - b * p], z && (e[p - 6] = e[p - 2], e[p - 5] = e[p - 1]), [].splice.apply(a, [a.length / u, 0].concat(e)), n && b--
                }
                h = h || "";
                var f, b = r.startX,
                    k = r.endX,
                    z = -1 < h.indexOf("C"),
                    p = z ? 7 : 3,
                    g, e, c;
                h = h.split(" ");
                m = m.slice();
                var n = r.isArea,
                    u = n ? 2 : 1,
                    d;
                z && (t(h), t(m));
                if (b && k) {
                    for (c = 0; c < b.length; c++)
                        if (b[c] === k[0]) {
                            f = c;
                            break
                        } else if (b[0] === k[k.length - b.length + c]) {
                        f = c;
                        d = !0;
                        break
                    }
                    void 0 === f && (h = [])
                }
                h.length && a.isNumber(f) && (g = m.length + f * u * p, d ? (q(h, m), l(m, h)) : (q(m, h), l(h, m)));
                return [h, m]
            }
        };
        a.extend = function(a, h) {
            var m;
            a || (a = {});
            for (m in h) a[m] = h[m];
            return a
        };
        a.merge = function() {
            var r, h = arguments,
                m, t = {},
                q = function(l, f) {
                    var b, k;
                    "object" !== typeof l && (l = {});
                    for (k in f) f.hasOwnProperty(k) && (b = f[k], a.isObject(b, !0) && "renderTo" !==
                        k && "number" !== typeof b.nodeType ? l[k] = q(l[k] || {}, b) : l[k] = f[k]);
                    return l
                };
            !0 === h[0] && (t = h[1], h = Array.prototype.slice.call(h, 2));
            m = h.length;
            for (r = 0; r < m; r++) t = q(t, h[r]);
            return t
        };
        a.pInt = function(a, h) {
            return parseInt(a, h || 10)
        };
        a.isString = function(a) {
            return "string" === typeof a
        };
        a.isArray = function(a) {
            a = Object.prototype.toString.call(a);
            return "[object Array]" === a || "[object Array Iterator]" === a
        };
        a.isObject = function(r, h) {
            return r && "object" === typeof r && (!h || !a.isArray(r))
        };
        a.isNumber = function(a) {
            return "number" ===
                typeof a && !isNaN(a)
        };
        a.erase = function(a, h) {
            for (var m = a.length; m--;)
                if (a[m] === h) {
                    a.splice(m, 1);
                    break
                }
        };
        a.defined = function(a) {
            return void 0 !== a && null !== a
        };
        a.attr = function(r, h, m) {
            var t, q;
            if (a.isString(h)) a.defined(m) ? r.setAttribute(h, m) : r && r.getAttribute && (q = r.getAttribute(h));
            else if (a.defined(h) && a.isObject(h))
                for (t in h) r.setAttribute(t, h[t]);
            return q
        };
        a.splat = function(r) {
            return a.isArray(r) ? r : [r]
        };
        a.syncTimeout = function(a, h, m) {
            if (h) return setTimeout(a, h, m);
            a.call(0, m)
        };
        a.pick = function() {
            var a = arguments,
                h, m, t = a.length;
            for (h = 0; h < t; h++)
                if (m = a[h], void 0 !== m && null !== m) return m
        };
        a.css = function(r, h) {
            a.isMS && !a.svg && h && void 0 !== h.opacity && (h.filter = "alpha(opacity\x3d" + 100 * h.opacity + ")");
            a.extend(r.style, h)
        };
        a.createElement = function(r, h, m, t, q) {
            r = F.createElement(r);
            var l = a.css;
            h && a.extend(r, h);
            q && l(r, {
                padding: 0,
                border: "none",
                margin: 0
            });
            m && l(r, m);
            t && t.appendChild(r);
            return r
        };
        a.extendClass = function(r, h) {
            var m = function() {};
            m.prototype = new r;
            a.extend(m.prototype, h);
            return m
        };
        a.pad = function(a, h, m) {
            return Array((h ||
                2) + 1 - String(a).length).join(m || 0) + a
        };
        a.relativeLength = function(a, h) {
            return /%$/.test(a) ? h * parseFloat(a) / 100 : parseFloat(a)
        };
        a.wrap = function(a, h, m) {
            var t = a[h];
            a[h] = function() {
                var a = Array.prototype.slice.call(arguments),
                    l = arguments,
                    f = this;
                f.proceed = function() {
                    t.apply(f, arguments.length ? arguments : l)
                };
                a.unshift(t);
                a = m.apply(this, a);
                f.proceed = null;
                return a
            }
        };
        a.getTZOffset = function(r) {
            var h = a.Date;
            return 6E4 * (h.hcGetTimezoneOffset && h.hcGetTimezoneOffset(r) || h.hcTimezoneOffset || 0)
        };
        a.dateFormat = function(r,
            h, m) {
            if (!a.defined(h) || isNaN(h)) return a.defaultOptions.lang.invalidDate || "";
            r = a.pick(r, "%Y-%m-%d %H:%M:%S");
            var t = a.Date,
                q = new t(h - a.getTZOffset(h)),
                l, f = q[t.hcGetHours](),
                b = q[t.hcGetDay](),
                k = q[t.hcGetDate](),
                z = q[t.hcGetMonth](),
                p = q[t.hcGetFullYear](),
                g = a.defaultOptions.lang,
                e = g.weekdays,
                c = g.shortWeekdays,
                n = a.pad,
                t = a.extend({
                    a: c ? c[b] : e[b].substr(0, 3),
                    A: e[b],
                    d: n(k),
                    e: n(k, 2, " "),
                    w: b,
                    b: g.shortMonths[z],
                    B: g.months[z],
                    m: n(z + 1),
                    y: p.toString().substr(2, 2),
                    Y: p,
                    H: n(f),
                    k: f,
                    I: n(f % 12 || 12),
                    l: f % 12 || 12,
                    M: n(q[t.hcGetMinutes]()),
                    p: 12 > f ? "AM" : "PM",
                    P: 12 > f ? "am" : "pm",
                    S: n(q.getSeconds()),
                    L: n(Math.round(h % 1E3), 3)
                }, a.dateFormats);
            for (l in t)
                for (; - 1 !== r.indexOf("%" + l);) r = r.replace("%" + l, "function" === typeof t[l] ? t[l](h) : t[l]);
            return m ? r.substr(0, 1).toUpperCase() + r.substr(1) : r
        };
        a.formatSingle = function(r, h) {
            var m = /\.([0-9])/,
                t = a.defaultOptions.lang;
            /f$/.test(r) ? (m = (m = r.match(m)) ? m[1] : -1, null !== h && (h = a.numberFormat(h, m, t.decimalPoint, -1 < r.indexOf(",") ? t.thousandsSep : ""))) : h = a.dateFormat(r, h);
            return h
        };
        a.format = function(r, h) {
            for (var m =
                    "{", t = !1, q, l, f, b, k = [], z; r;) {
                m = r.indexOf(m);
                if (-1 === m) break;
                q = r.slice(0, m);
                if (t) {
                    q = q.split(":");
                    l = q.shift().split(".");
                    b = l.length;
                    z = h;
                    for (f = 0; f < b; f++) z = z[l[f]];
                    q.length && (z = a.formatSingle(q.join(":"), z));
                    k.push(z)
                } else k.push(q);
                r = r.slice(m + 1);
                m = (t = !t) ? "}" : "{"
            }
            k.push(r);
            return k.join("")
        };
        a.getMagnitude = function(a) {
            return Math.pow(10, Math.floor(Math.log(a) / Math.LN10))
        };
        a.normalizeTickInterval = function(r, h, m, t, q) {
            var l, f = r;
            m = a.pick(m, 1);
            l = r / m;
            h || (h = q ? [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] : [1, 2, 2.5, 5, 10], !1 ===
                t && (1 === m ? h = a.grep(h, function(a) {
                    return 0 === a % 1
                }) : .1 >= m && (h = [1 / m])));
            for (t = 0; t < h.length && !(f = h[t], q && f * m >= r || !q && l <= (h[t] + (h[t + 1] || h[t])) / 2); t++);
            return f * m
        };
        a.stableSort = function(a, h) {
            var m = a.length,
                t, q;
            for (q = 0; q < m; q++) a[q].safeI = q;
            a.sort(function(a, f) {
                t = h(a, f);
                return 0 === t ? a.safeI - f.safeI : t
            });
            for (q = 0; q < m; q++) delete a[q].safeI
        };
        a.arrayMin = function(a) {
            for (var h = a.length, m = a[0]; h--;) a[h] < m && (m = a[h]);
            return m
        };
        a.arrayMax = function(a) {
            for (var h = a.length, m = a[0]; h--;) a[h] > m && (m = a[h]);
            return m
        };
        a.destroyObjectProperties =
            function(a, h) {
                for (var m in a) a[m] && a[m] !== h && a[m].destroy && a[m].destroy(), delete a[m]
            };
        a.discardElement = function(r) {
            var h = a.garbageBin;
            h || (h = a.createElement("div"));
            r && h.appendChild(r);
            h.innerHTML = ""
        };
        a.correctFloat = function(a, h) {
            return parseFloat(a.toPrecision(h || 14))
        };
        a.setAnimation = function(r, h) {
            h.renderer.globalAnimation = a.pick(r, h.options.chart.animation, !0)
        };
        a.animObject = function(r) {
            return a.isObject(r) ? a.merge(r) : {
                duration: r ? 500 : 0
            }
        };
        a.timeUnits = {
            millisecond: 1,
            second: 1E3,
            minute: 6E4,
            hour: 36E5,
            day: 864E5,
            week: 6048E5,
            month: 24192E5,
            year: 314496E5
        };
        a.numberFormat = function(r, h, m, t) {
            r = +r || 0;
            h = +h;
            var q = a.defaultOptions.lang,
                l = (r.toString().split(".")[1] || "").length,
                f, b, k = Math.abs(r); - 1 === h ? h = Math.min(l, 20) : a.isNumber(h) || (h = 2);
            f = String(a.pInt(k.toFixed(h)));
            b = 3 < f.length ? f.length % 3 : 0;
            m = a.pick(m, q.decimalPoint);
            t = a.pick(t, q.thousandsSep);
            r = (0 > r ? "-" : "") + (b ? f.substr(0, b) + t : "");
            r += f.substr(b).replace(/(\d{3})(?=\d)/g, "$1" + t);
            h && (t = Math.abs(k - f + Math.pow(10, -Math.max(h, l) - 1)), r += m + t.toFixed(h).slice(2));
            return r
        };
        Math.easeInOutSine = function(a) {
            return -.5 * (Math.cos(Math.PI * a) - 1)
        };
        a.getStyle = function(r, h) {
            return "width" === h ? Math.min(r.offsetWidth, r.scrollWidth) - a.getStyle(r, "padding-left") - a.getStyle(r, "padding-right") : "height" === h ? Math.min(r.offsetHeight, r.scrollHeight) - a.getStyle(r, "padding-top") - a.getStyle(r, "padding-bottom") : (r = G.getComputedStyle(r, void 0)) && a.pInt(r.getPropertyValue(h))
        };
        a.inArray = function(a, h) {
            return h.indexOf ? h.indexOf(a) : [].indexOf.call(h, a)
        };
        a.grep = function(a, h) {
            return [].filter.call(a,
                h)
        };
        a.map = function(a, h) {
            for (var m = [], t = 0, q = a.length; t < q; t++) m[t] = h.call(a[t], a[t], t, a);
            return m
        };
        a.offset = function(a) {
            var h = F.documentElement;
            a = a.getBoundingClientRect();
            return {
                top: a.top + (G.pageYOffset || h.scrollTop) - (h.clientTop || 0),
                left: a.left + (G.pageXOffset || h.scrollLeft) - (h.clientLeft || 0)
            }
        };
        a.stop = function(a, h) {
            for (var m = D.length; m--;) D[m].elem !== a || h && h !== D[m].prop || (D[m].stopped = !0)
        };
        a.each = function(a, h, m) {
            return Array.prototype.forEach.call(a, h, m)
        };
        a.addEvent = function(r, h, m) {
            function t(a) {
                a.target =
                    a.srcElement || G;
                m.call(r, a)
            }
            var q = r.hcEvents = r.hcEvents || {};
            r.addEventListener ? r.addEventListener(h, m, !1) : r.attachEvent && (r.hcEventsIE || (r.hcEventsIE = {}), r.hcEventsIE[m.toString()] = t, r.attachEvent("on" + h, t));
            q[h] || (q[h] = []);
            q[h].push(m);
            return function() {
                a.removeEvent(r, h, m)
            }
        };
        a.removeEvent = function(r, h, m) {
            function t(a, b) {
                r.removeEventListener ? r.removeEventListener(a, b, !1) : r.attachEvent && (b = r.hcEventsIE[b.toString()], r.detachEvent("on" + a, b))
            }

            function q() {
                var a, b;
                if (r.nodeName)
                    for (b in h ? (a = {}, a[h] = !0) : a = f, a)
                        if (f[b])
                            for (a = f[b].length; a--;) t(b, f[b][a])
            }
            var l, f = r.hcEvents,
                b;
            f && (h ? (l = f[h] || [], m ? (b = a.inArray(m, l), -1 < b && (l.splice(b, 1), f[h] = l), t(h, m)) : (q(), f[h] = [])) : (q(), r.hcEvents = {}))
        };
        a.fireEvent = function(r, h, m, t) {
            var q;
            q = r.hcEvents;
            var l, f;
            m = m || {};
            if (F.createEvent && (r.dispatchEvent || r.fireEvent)) q = F.createEvent("Events"), q.initEvent(h, !0, !0), a.extend(q, m), r.dispatchEvent ? r.dispatchEvent(q) : r.fireEvent(h, q);
            else if (q)
                for (q = q[h] || [], l = q.length, m.target || a.extend(m, {
                        preventDefault: function() {
                            m.defaultPrevented = !0
                        },
                        target: r,
                        type: h
                    }), h = 0; h < l; h++)(f = q[h]) && !1 === f.call(r, m) && m.preventDefault();
            t && !m.defaultPrevented && t(m)
        };
        a.animate = function(r, h, m) {
            var t, q = "",
                l, f, b;
            a.isObject(m) || (t = arguments, m = {
                duration: t[2],
                easing: t[3],
                complete: t[4]
            });
            a.isNumber(m.duration) || (m.duration = 400);
            m.easing = "function" === typeof m.easing ? m.easing : Math[m.easing] || Math.easeInOutSine;
            m.curAnim = a.merge(h);
            for (b in h) a.stop(r, b), f = new a.Fx(r, m, b), l = null, "d" === b ? (f.paths = f.initPath(r, r.d, h.d), f.toD = h.d, t = 0, l = 1) : r.attr ? t = r.attr(b) : (t = parseFloat(a.getStyle(r,
                b)) || 0, "opacity" !== b && (q = "px")), l || (l = h[b]), l.match && l.match("px") && (l = l.replace(/px/g, "")), f.run(t, l, q)
        };
        a.seriesType = function(r, h, m, t, q) {
            var l = a.getOptions(),
                f = a.seriesTypes;
            l.plotOptions[r] = a.merge(l.plotOptions[h], m);
            f[r] = a.extendClass(f[h] || function() {}, t);
            f[r].prototype.type = r;
            q && (f[r].prototype.pointClass = a.extendClass(a.Point, q));
            return f[r]
        };
        a.uniqueKey = function() {
            var a = Math.random().toString(36).substring(2, 9),
                h = 0;
            return function() {
                return "highcharts-" + a + "-" + h++
            }
        }();
        G.jQuery && (G.jQuery.fn.highcharts =
            function() {
                var r = [].slice.call(arguments);
                if (this[0]) return r[0] ? (new(a[a.isString(r[0]) ? r.shift() : "Chart"])(this[0], r[0], r[1]), this) : B[a.attr(this[0], "data-highcharts-chart")]
            });
        F && !F.defaultView && (a.getStyle = function(r, h) {
            var m = {
                width: "clientWidth",
                height: "clientHeight"
            }[h];
            if (r.style[h]) return a.pInt(r.style[h]);
            "opacity" === h && (h = "filter");
            if (m) return r.style.zoom = 1, Math.max(r[m] - 2 * a.getStyle(r, "padding"), 0);
            r = r.currentStyle[h.replace(/\-(\w)/g, function(a, q) {
                return q.toUpperCase()
            })];
            "filter" ===
            h && (r = r.replace(/alpha\(opacity=([0-9]+)\)/, function(a, q) {
                return q / 100
            }));
            return "" === r ? 1 : a.pInt(r)
        });
        Array.prototype.forEach || (a.each = function(a, h, m) {
            for (var t = 0, q = a.length; t < q; t++)
                if (!1 === h.call(m, a[t], t, a)) return t
        });
        Array.prototype.indexOf || (a.inArray = function(a, h) {
            var m, t = 0;
            if (h)
                for (m = h.length; t < m; t++)
                    if (h[t] === a) return t;
            return -1
        });
        Array.prototype.filter || (a.grep = function(a, h) {
            for (var m = [], t = 0, q = a.length; t < q; t++) h(a[t], t) && m.push(a[t]);
            return m
        })
    })(N);
    (function(a) {
        var D = a.each,
            B = a.isNumber,
            F =
            a.map,
            G = a.merge,
            r = a.pInt;
        a.Color = function(h) {
            if (!(this instanceof a.Color)) return new a.Color(h);
            this.init(h)
        };
        a.Color.prototype = {
            parsers: [{
                regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
                parse: function(a) {
                    return [r(a[1]), r(a[2]), r(a[3]), parseFloat(a[4], 10)]
                }
            }, {
                regex: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
                parse: function(a) {
                    return [r(a[1], 16), r(a[2], 16), r(a[3], 16), 1]
                }
            }, {
                regex: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
                parse: function(a) {
                    return [r(a[1]), r(a[2]), r(a[3]), 1]
                }
            }],
            names: {
                white: "#ffffff",
                black: "#000000"
            },
            init: function(h) {
                var m, t, q, l;
                if ((this.input = h = this.names[h] || h) && h.stops) this.stops = F(h.stops, function(f) {
                    return new a.Color(f[1])
                });
                else
                    for (q = this.parsers.length; q-- && !t;) l = this.parsers[q], (m = l.regex.exec(h)) && (t = l.parse(m));
                this.rgba = t || []
            },
            get: function(a) {
                var m = this.input,
                    h = this.rgba,
                    q;
                this.stops ? (q = G(m), q.stops = [].concat(q.stops), D(this.stops, function(l, f) {
                        q.stops[f] = [q.stops[f][0], l.get(a)]
                    })) : q = h &&
                    B(h[0]) ? "rgb" === a || !a && 1 === h[3] ? "rgb(" + h[0] + "," + h[1] + "," + h[2] + ")" : "a" === a ? h[3] : "rgba(" + h.join(",") + ")" : m;
                return q
            },
            brighten: function(a) {
                var m, h = this.rgba;
                if (this.stops) D(this.stops, function(q) {
                    q.brighten(a)
                });
                else if (B(a) && 0 !== a)
                    for (m = 0; 3 > m; m++) h[m] += r(255 * a), 0 > h[m] && (h[m] = 0), 255 < h[m] && (h[m] = 255);
                return this
            },
            setOpacity: function(a) {
                this.rgba[3] = a;
                return this
            }
        };
        a.color = function(h) {
            return new a.Color(h)
        }
    })(N);
    (function(a) {
        var D, B, F = a.addEvent,
            G = a.animate,
            r = a.attr,
            h = a.charts,
            m = a.color,
            t = a.css,
            q = a.createElement,
            l = a.defined,
            f = a.deg2rad,
            b = a.destroyObjectProperties,
            k = a.doc,
            z = a.each,
            p = a.extend,
            g = a.erase,
            e = a.grep,
            c = a.hasTouch,
            n = a.isArray,
            u = a.isFirefox,
            d = a.isMS,
            C = a.isObject,
            y = a.isString,
            v = a.isWebKit,
            E = a.merge,
            I = a.noop,
            H = a.pick,
            w = a.pInt,
            K = a.removeEvent,
            M = a.stop,
            x = a.svg,
            J = a.SVG_NS,
            O = a.symbolSizes,
            Q = a.win;
        D = a.SVGElement = function() {
            return this
        };
        D.prototype = {
            opacity: 1,
            SVG_NS: J,
            textProps: "direction fontSize fontWeight fontFamily fontStyle color lineHeight width textDecoration textOverflow textOutline".split(" "),
            init: function(a,
                L) {
                this.element = "span" === L ? q(L) : k.createElementNS(this.SVG_NS, L);
                this.renderer = a
            },
            animate: function(a, L, d) {
                (L = H(L, this.renderer.globalAnimation, !0)) ? (d && (L.complete = d), G(this, a, L)) : this.attr(a, null, d);
                return this
            },
            colorGradient: function(A, L, d) {
                var b = this.renderer,
                    x, c, e, J, w, y, C, g, k, p, v, H = [],
                    u;
                A.linearGradient ? c = "linearGradient" : A.radialGradient && (c = "radialGradient");
                if (c) {
                    e = A[c];
                    w = b.gradients;
                    C = A.stops;
                    p = d.radialReference;
                    n(e) && (A[c] = e = {
                        x1: e[0],
                        y1: e[1],
                        x2: e[2],
                        y2: e[3],
                        gradientUnits: "userSpaceOnUse"
                    });
                    "radialGradient" === c && p && !l(e.gradientUnits) && (J = e, e = E(e, b.getRadialAttr(p, J), {
                        gradientUnits: "userSpaceOnUse"
                    }));
                    for (v in e) "id" !== v && H.push(v, e[v]);
                    for (v in C) H.push(C[v]);
                    H = H.join(",");
                    w[H] ? p = w[H].attr("id") : (e.id = p = a.uniqueKey(), w[H] = y = b.createElement(c).attr(e).add(b.defs), y.radAttr = J, y.stops = [], z(C, function(A) {
                        0 === A[1].indexOf("rgba") ? (x = a.color(A[1]), g = x.get("rgb"), k = x.get("a")) : (g = A[1], k = 1);
                        A = b.createElement("stop").attr({
                            offset: A[0],
                            "stop-color": g,
                            "stop-opacity": k
                        }).add(y);
                        y.stops.push(A)
                    }));
                    u = "url(" + b.url + "#" + p + ")";
                    d.setAttribute(L, u);
                    d.gradient = H;
                    A.toString = function() {
                        return u
                    }
                }
            },
            applyTextOutline: function(a) {
                var A = this.element,
                    d, b, x; - 1 !== a.indexOf("contrast") && (a = a.replace(/contrast/g, this.renderer.getContrast(A.style.fill)));
                this.fakeTS = !0;
                this.ySetter = this.xSetter;
                d = [].slice.call(A.getElementsByTagName("tspan"));
                a = a.split(" ");
                b = a[a.length - 1];
                (x = a[0]) && "none" !== x && (x = x.replace(/(^[\d\.]+)(.*?)$/g, function(a, A, d) {
                    return 2 * A + d
                }), z(d, function(a) {
                    "highcharts-text-outline" === a.getAttribute("class") &&
                        g(d, A.removeChild(a))
                }), z(d, function(a, d) {
                    0 === d && (a.setAttribute("x", A.getAttribute("x")), d = A.getAttribute("y"), a.setAttribute("y", d || 0), null === d && A.setAttribute("y", 0));
                    a = a.cloneNode(1);
                    r(a, {
                        "class": "highcharts-text-outline",
                        fill: b,
                        stroke: b,
                        "stroke-width": x,
                        "stroke-linejoin": "round"
                    });
                    A.insertBefore(a, A.firstChild)
                }))
            },
            attr: function(a, d, b) {
                var A, L = this.element,
                    x, c = this,
                    e;
                "string" === typeof a && void 0 !== d && (A = a, a = {}, a[A] = d);
                if ("string" === typeof a) c = (this[a + "Getter"] || this._defaultGetter).call(this,
                    a, L);
                else {
                    for (A in a) d = a[A], e = !1, A !== this.animProp && M(this, A), this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(A) && (x || (this.symbolAttr(a), x = !0), e = !0), !this.rotation || "x" !== A && "y" !== A || (this.doTransform = !0), e || (e = this[A + "Setter"] || this._defaultSetter, e.call(this, d, A, L), this.shadows && /^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(A) && this.updateShadows(A, d, e));
                    this.doTransform && (this.updateTransform(), this.doTransform = !1)
                }
                b && b();
                return c
            },
            updateShadows: function(a,
                d, b) {
                for (var A = this.shadows, L = A.length; L--;) b.call(A[L], "height" === a ? Math.max(d - (A[L].cutHeight || 0), 0) : "d" === a ? this.d : d, a, A[L])
            },
            addClass: function(a, d) {
                var A = this.attr("class") || ""; - 1 === A.indexOf(a) && (d || (a = (A + (A ? " " : "") + a).replace("  ", " ")), this.attr("class", a));
                return this
            },
            hasClass: function(a) {
                return -1 !== r(this.element, "class").indexOf(a)
            },
            removeClass: function(a) {
                r(this.element, "class", (r(this.element, "class") || "").replace(a, ""));
                return this
            },
            symbolAttr: function(a) {
                var A = this;
                z("x y r start end width height innerR anchorX anchorY".split(" "),
                    function(d) {
                        A[d] = H(a[d], A[d])
                    });
                A.attr({
                    d: A.renderer.symbols[A.symbolName](A.x, A.y, A.width, A.height, A)
                })
            },
            clip: function(a) {
                return this.attr("clip-path", a ? "url(" + this.renderer.url + "#" + a.id + ")" : "none")
            },
            crisp: function(a, d) {
                var A, b = {},
                    x;
                d = d || a.strokeWidth || 0;
                x = Math.round(d) % 2 / 2;
                a.x = Math.floor(a.x || this.x || 0) + x;
                a.y = Math.floor(a.y || this.y || 0) + x;
                a.width = Math.floor((a.width || this.width || 0) - 2 * x);
                a.height = Math.floor((a.height || this.height || 0) - 2 * x);
                l(a.strokeWidth) && (a.strokeWidth = d);
                for (A in a) this[A] !== a[A] &&
                    (this[A] = b[A] = a[A]);
                return b
            },
            css: function(a) {
                var A = this.styles,
                    b = {},
                    e = this.element,
                    c, J, y = "";
                c = !A;
                a && a.color && (a.fill = a.color);
                if (A)
                    for (J in a) a[J] !== A[J] && (b[J] = a[J], c = !0);
                if (c) {
                    c = this.textWidth = a && a.width && "text" === e.nodeName.toLowerCase() && w(a.width) || this.textWidth;
                    A && (a = p(A, b));
                    this.styles = a;
                    c && !x && this.renderer.forExport && delete a.width;
                    if (d && !x) t(this.element, a);
                    else {
                        A = function(a, A) {
                            return "-" + A.toLowerCase()
                        };
                        for (J in a) y += J.replace(/([A-Z])/g, A) + ":" + a[J] + ";";
                        r(e, "style", y)
                    }
                    this.added && (c &&
                        this.renderer.buildText(this), a && a.textOutline && this.applyTextOutline(a.textOutline))
                }
                return this
            },
            strokeWidth: function() {
                return this["stroke-width"] || 0
            },
            on: function(a, d) {
                var A = this,
                    b = A.element;
                c && "click" === a ? (b.ontouchstart = function(a) {
                    A.touchEventFired = Date.now();
                    a.preventDefault();
                    d.call(b, a)
                }, b.onclick = function(a) {
                    (-1 === Q.navigator.userAgent.indexOf("Android") || 1100 < Date.now() - (A.touchEventFired || 0)) && d.call(b, a)
                }) : b["on" + a] = d;
                return this
            },
            setRadialReference: function(a) {
                var A = this.renderer.gradients[this.element.gradient];
                this.element.radialReference = a;
                A && A.radAttr && A.animate(this.renderer.getRadialAttr(a, A.radAttr));
                return this
            },
            translate: function(a, d) {
                return this.attr({
                    translateX: a,
                    translateY: d
                })
            },
            invert: function(a) {
                this.inverted = a;
                this.updateTransform();
                return this
            },
            updateTransform: function() {
                var a = this.translateX || 0,
                    d = this.translateY || 0,
                    b = this.scaleX,
                    x = this.scaleY,
                    c = this.inverted,
                    e = this.rotation,
                    J = this.element;
                c && (a += this.attr("width"), d += this.attr("height"));
                a = ["translate(" + a + "," + d + ")"];
                c ? a.push("rotate(90) scale(-1,1)") :
                    e && a.push("rotate(" + e + " " + (J.getAttribute("x") || 0) + " " + (J.getAttribute("y") || 0) + ")");
                (l(b) || l(x)) && a.push("scale(" + H(b, 1) + " " + H(x, 1) + ")");
                a.length && J.setAttribute("transform", a.join(" "))
            },
            toFront: function() {
                var a = this.element;
                a.parentNode.appendChild(a);
                return this
            },
            align: function(a, d, b) {
                var A, x, c, e, L = {};
                x = this.renderer;
                c = x.alignedObjects;
                var J, w;
                if (a) {
                    if (this.alignOptions = a, this.alignByTranslate = d, !b || y(b)) this.alignTo = A = b || "renderer", g(c, this), c.push(this), b = null
                } else a = this.alignOptions, d = this.alignByTranslate,
                    A = this.alignTo;
                b = H(b, x[A], x);
                A = a.align;
                x = a.verticalAlign;
                c = (b.x || 0) + (a.x || 0);
                e = (b.y || 0) + (a.y || 0);
                "right" === A ? J = 1 : "center" === A && (J = 2);
                J && (c += (b.width - (a.width || 0)) / J);
                L[d ? "translateX" : "x"] = Math.round(c);
                "bottom" === x ? w = 1 : "middle" === x && (w = 2);
                w && (e += (b.height - (a.height || 0)) / w);
                L[d ? "translateY" : "y"] = Math.round(e);
                this[this.placed ? "animate" : "attr"](L);
                this.placed = !0;
                this.alignAttr = L;
                return this
            },
            getBBox: function(a, b) {
                var A, x = this.renderer,
                    c, e = this.element,
                    L = this.styles,
                    J, w = this.textStr,
                    y, C = x.cache,
                    g = x.cacheKeys,
                    n;
                b = H(b, this.rotation);
                c = b * f;
                J = L && L.fontSize;
                void 0 !== w && (n = w.toString(), -1 === n.indexOf("\x3c") && (n = n.replace(/[0-9]/g, "0")), n += ["", b || 0, J, e.style.width, e.style["text-overflow"]].join());
                n && !a && (A = C[n]);
                if (!A) {
                    if (e.namespaceURI === this.SVG_NS || x.forExport) {
                        try {
                            (y = this.fakeTS && function(a) {
                                z(e.querySelectorAll(".highcharts-text-outline"), function(A) {
                                    A.style.display = a
                                })
                            }) && y("none"), A = e.getBBox ? p({}, e.getBBox()) : {
                                width: e.offsetWidth,
                                height: e.offsetHeight
                            }, y && y("")
                        } catch (T) {}
                        if (!A || 0 > A.width) A = {
                            width: 0,
                            height: 0
                        }
                    } else A = this.htmlGetBBox();
                    x.isSVG && (a = A.width, x = A.height, d && L && "11px" === L.fontSize && "16.9" === x.toPrecision(3) && (A.height = x = 14), b && (A.width = Math.abs(x * Math.sin(c)) + Math.abs(a * Math.cos(c)), A.height = Math.abs(x * Math.cos(c)) + Math.abs(a * Math.sin(c))));
                    if (n && 0 < A.height) {
                        for (; 250 < g.length;) delete C[g.shift()];
                        C[n] || g.push(n);
                        C[n] = A
                    }
                }
                return A
            },
            show: function(a) {
                return this.attr({
                    visibility: a ? "inherit" : "visible"
                })
            },
            hide: function() {
                return this.attr({
                    visibility: "hidden"
                })
            },
            fadeOut: function(a) {
                var A =
                    this;
                A.animate({
                    opacity: 0
                }, {
                    duration: a || 150,
                    complete: function() {
                        A.attr({
                            y: -9999
                        })
                    }
                })
            },
            add: function(a) {
                var A = this.renderer,
                    d = this.element,
                    b;
                a && (this.parentGroup = a);
                this.parentInverted = a && a.inverted;
                void 0 !== this.textStr && A.buildText(this);
                this.added = !0;
                if (!a || a.handleZ || this.zIndex) b = this.zIndexSetter();
                b || (a ? a.element : A.box).appendChild(d);
                if (this.onAdd) this.onAdd();
                return this
            },
            safeRemoveChild: function(a) {
                var A = a.parentNode;
                A && A.removeChild(a)
            },
            destroy: function() {
                var a = this.element || {},
                    d = this.renderer.isSVG &&
                    "SPAN" === a.nodeName && this.parentGroup,
                    b, x;
                a.onclick = a.onmouseout = a.onmouseover = a.onmousemove = a.point = null;
                M(this);
                this.clipPath && (this.clipPath = this.clipPath.destroy());
                if (this.stops) {
                    for (x = 0; x < this.stops.length; x++) this.stops[x] = this.stops[x].destroy();
                    this.stops = null
                }
                this.safeRemoveChild(a);
                for (this.destroyShadows(); d && d.div && 0 === d.div.childNodes.length;) a = d.parentGroup, this.safeRemoveChild(d.div), delete d.div, d = a;
                this.alignTo && g(this.renderer.alignedObjects, this);
                for (b in this) delete this[b];
                return null
            },
            shadow: function(a, d, b) {
                var A = [],
                    x, c, e = this.element,
                    J, L, w, y;
                if (!a) this.destroyShadows();
                else if (!this.shadows) {
                    L = H(a.width, 3);
                    w = (a.opacity || .15) / L;
                    y = this.parentInverted ? "(-1,-1)" : "(" + H(a.offsetX, 1) + ", " + H(a.offsetY, 1) + ")";
                    for (x = 1; x <= L; x++) c = e.cloneNode(0), J = 2 * L + 1 - 2 * x, r(c, {
                        isShadow: "true",
                        stroke: a.color || "#000000",
                        "stroke-opacity": w * x,
                        "stroke-width": J,
                        transform: "translate" + y,
                        fill: "none"
                    }), b && (r(c, "height", Math.max(r(c, "height") - J, 0)), c.cutHeight = J), d ? d.element.appendChild(c) : e.parentNode.insertBefore(c,
                        e), A.push(c);
                    this.shadows = A
                }
                return this
            },
            destroyShadows: function() {
                z(this.shadows || [], function(a) {
                    this.safeRemoveChild(a)
                }, this);
                this.shadows = void 0
            },
            xGetter: function(a) {
                "circle" === this.element.nodeName && ("x" === a ? a = "cx" : "y" === a && (a = "cy"));
                return this._defaultGetter(a)
            },
            _defaultGetter: function(a) {
                a = H(this[a], this.element ? this.element.getAttribute(a) : null, 0);
                /^[\-0-9\.]+$/.test(a) && (a = parseFloat(a));
                return a
            },
            dSetter: function(a, d, b) {
                a && a.join && (a = a.join(" "));
                /(NaN| {2}|^$)/.test(a) && (a = "M 0 0");
                b.setAttribute(d,
                    a);
                this[d] = a
            },
            dashstyleSetter: function(a) {
                var A, d = this["stroke-width"];
                "inherit" === d && (d = 1);
                if (a = a && a.toLowerCase()) {
                    a = a.replace("shortdashdotdot", "3,1,1,1,1,1,").replace("shortdashdot", "3,1,1,1").replace("shortdot", "1,1,").replace("shortdash", "3,1,").replace("longdash", "8,3,").replace(/dot/g, "1,3,").replace("dash", "4,3,").replace(/,$/, "").split(",");
                    for (A = a.length; A--;) a[A] = w(a[A]) * d;
                    a = a.join(",").replace(/NaN/g, "none");
                    this.element.setAttribute("stroke-dasharray", a)
                }
            },
            alignSetter: function(a) {
                this.element.setAttribute("text-anchor", {
                    left: "start",
                    center: "middle",
                    right: "end"
                }[a])
            },
            opacitySetter: function(a, d, b) {
                this[d] = a;
                b.setAttribute(d, a)
            },
            titleSetter: function(a) {
                var d = this.element.getElementsByTagName("title")[0];
                d || (d = k.createElementNS(this.SVG_NS, "title"), this.element.appendChild(d));
                d.firstChild && d.removeChild(d.firstChild);
                d.appendChild(k.createTextNode(String(H(a), "").replace(/<[^>]*>/g, "")))
            },
            textSetter: function(a) {
                a !== this.textStr && (delete this.bBox, this.textStr = a, this.added && this.renderer.buildText(this))
            },
            fillSetter: function(a,
                d, b) {
                "string" === typeof a ? b.setAttribute(d, a) : a && this.colorGradient(a, d, b)
            },
            visibilitySetter: function(a, d, b) {
                "inherit" === a ? b.removeAttribute(d) : b.setAttribute(d, a)
            },
            zIndexSetter: function(a, d) {
                var b = this.renderer,
                    A = this.parentGroup,
                    x = (A || b).element || b.box,
                    c, e = this.element,
                    J;
                c = this.added;
                var y;
                l(a) && (e.zIndex = a, a = +a, this[d] === a && (c = !1), this[d] = a);
                if (c) {
                    (a = this.zIndex) && A && (A.handleZ = !0);
                    d = x.childNodes;
                    for (y = 0; y < d.length && !J; y++) A = d[y], c = A.zIndex, A !== e && (w(c) > a || !l(a) && l(c) || 0 > a && !l(c) && x !== b.box) && (x.insertBefore(e,
                        A), J = !0);
                    J || x.appendChild(e)
                }
                return J
            },
            _defaultSetter: function(a, d, b) {
                b.setAttribute(d, a)
            }
        };
        D.prototype.yGetter = D.prototype.xGetter;
        D.prototype.translateXSetter = D.prototype.translateYSetter = D.prototype.rotationSetter = D.prototype.verticalAlignSetter = D.prototype.scaleXSetter = D.prototype.scaleYSetter = function(a, d) {
            this[d] = a;
            this.doTransform = !0
        };
        D.prototype["stroke-widthSetter"] = D.prototype.strokeSetter = function(a, d, b) {
            this[d] = a;
            this.stroke && this["stroke-width"] ? (D.prototype.fillSetter.call(this, this.stroke,
                "stroke", b), b.setAttribute("stroke-width", this["stroke-width"]), this.hasStroke = !0) : "stroke-width" === d && 0 === a && this.hasStroke && (b.removeAttribute("stroke"), this.hasStroke = !1)
        };
        B = a.SVGRenderer = function() {
            this.init.apply(this, arguments)
        };
        B.prototype = {
            Element: D,
            SVG_NS: J,
            init: function(a, d, b, x, c, e) {
                var A;
                x = this.createElement("svg").attr({
                    version: "1.1",
                    "class": "highcharts-root"
                }).css(this.getStyle(x));
                A = x.element;
                a.appendChild(A); - 1 === a.innerHTML.indexOf("xmlns") && r(A, "xmlns", this.SVG_NS);
                this.isSVG = !0;
                this.box = A;
                this.boxWrapper = x;
                this.alignedObjects = [];
                this.url = (u || v) && k.getElementsByTagName("base").length ? Q.location.href.replace(/#.*?$/, "").replace(/([\('\)])/g, "\\$1").replace(/ /g, "%20") : "";
                this.createElement("desc").add().element.appendChild(k.createTextNode("Created with Highcharts 5.0.4"));
                this.defs = this.createElement("defs").add();
                this.allowHTML = e;
                this.forExport = c;
                this.gradients = {};
                this.cache = {};
                this.cacheKeys = [];
                this.imgCount = 0;
                this.setSize(d, b, !1);
                var J;
                u && a.getBoundingClientRect && (d = function() {
                    t(a, {
                        left: 0,
                        top: 0
                    });
                    J = a.getBoundingClientRect();
                    t(a, {
                        left: Math.ceil(J.left) - J.left + "px",
                        top: Math.ceil(J.top) - J.top + "px"
                    })
                }, d(), this.unSubPixelFix = F(Q, "resize", d))
            },
            getStyle: function(a) {
                return this.style = p({
                    fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
                    fontSize: "12px"
                }, a)
            },
            setStyle: function(a) {
                this.boxWrapper.css(this.getStyle(a))
            },
            isHidden: function() {
                return !this.boxWrapper.getBBox().width
            },
            destroy: function() {
                var a = this.defs;
                this.box = null;
                this.boxWrapper = this.boxWrapper.destroy();
                b(this.gradients || {});
                this.gradients = null;
                a && (this.defs = a.destroy());
                this.unSubPixelFix && this.unSubPixelFix();
                return this.alignedObjects = null
            },
            createElement: function(a) {
                var d = new this.Element;
                d.init(this, a);
                return d
            },
            draw: I,
            getRadialAttr: function(a, d) {
                return {
                    cx: a[0] - a[2] / 2 + d.cx * a[2],
                    cy: a[1] - a[2] / 2 + d.cy * a[2],
                    r: d.r * a[2]
                }
            },
            buildText: function(a) {
                for (var d = a.element, b = this, A = b.forExport, c = H(a.textStr, "").toString(), y = -1 !== c.indexOf("\x3c"), C = d.childNodes, g, n, p, v, E = r(d, "x"), u = a.styles, f = a.textWidth, K = u &&
                        u.lineHeight, I = u && u.textOutline, l = u && "ellipsis" === u.textOverflow, M = C.length, q = f && !a.added && this.box, Q = function(a) {
                            var x;
                            x = /(px|em)$/.test(a && a.style.fontSize) ? a.style.fontSize : u && u.fontSize || b.style.fontSize || 12;
                            return K ? w(K) : b.fontMetrics(x, a.getAttribute("style") ? a : d).h
                        }; M--;) d.removeChild(C[M]);
                y || I || l || f || -1 !== c.indexOf(" ") ? (g = /<.*class="([^"]+)".*>/, n = /<.*style="([^"]+)".*>/, p = /<.*href="(http[^"]+)".*>/, q && q.appendChild(d), c = y ? c.replace(/<(b|strong)>/g, '\x3cspan style\x3d"font-weight:bold"\x3e').replace(/<(i|em)>/g,
                    '\x3cspan style\x3d"font-style:italic"\x3e').replace(/<a/g, "\x3cspan").replace(/<\/(b|strong|i|em|a)>/g, "\x3c/span\x3e").split(/<br.*?>/g) : [c], c = e(c, function(a) {
                    return "" !== a
                }), z(c, function(c, e) {
                    var y, w = 0;
                    c = c.replace(/^\s+|\s+$/g, "").replace(/<span/g, "|||\x3cspan").replace(/<\/span>/g, "\x3c/span\x3e|||");
                    y = c.split("|||");
                    z(y, function(c) {
                        if ("" !== c || 1 === y.length) {
                            var C = {},
                                L = k.createElementNS(b.SVG_NS, "tspan"),
                                H, K;
                            g.test(c) && (H = c.match(g)[1], r(L, "class", H));
                            n.test(c) && (K = c.match(n)[1].replace(/(;| |^)color([ :])/,
                                "$1fill$2"), r(L, "style", K));
                            p.test(c) && !A && (r(L, "onclick", 'location.href\x3d"' + c.match(p)[1] + '"'), t(L, {
                                cursor: "pointer"
                            }));
                            c = (c.replace(/<(.|\n)*?>/g, "") || " ").replace(/&lt;/g, "\x3c").replace(/&gt;/g, "\x3e");
                            if (" " !== c) {
                                L.appendChild(k.createTextNode(c));
                                w ? C.dx = 0 : e && null !== E && (C.x = E);
                                r(L, C);
                                d.appendChild(L);
                                !w && e && (!x && A && t(L, {
                                    display: "block"
                                }), r(L, "dy", Q(L)));
                                if (f) {
                                    C = c.replace(/([^\^])-/g, "$1- ").split(" ");
                                    H = "nowrap" === u.whiteSpace;
                                    for (var z = 1 < y.length || e || 1 < C.length && !H, I, M, q = [], S = Q(L), m = a.rotation,
                                            h = c, O = h.length;
                                        (z || l) && (C.length || q.length);) a.rotation = 0, I = a.getBBox(!0), M = I.width, !x && b.forExport && (M = b.measureSpanWidth(L.firstChild.data, a.styles)), I = M > f, void 0 === v && (v = I), l && v ? (O /= 2, "" === h || !I && .5 > O ? C = [] : (h = c.substring(0, h.length + (I ? -1 : 1) * Math.ceil(O)), C = [h + (3 < f ? "\u2026" : "")], L.removeChild(L.firstChild))) : I && 1 !== C.length ? (L.removeChild(L.firstChild), q.unshift(C.pop())) : (C = q, q = [], C.length && !H && (L = k.createElementNS(J, "tspan"), r(L, {
                                            dy: S,
                                            x: E
                                        }), K && r(L, "style", K), d.appendChild(L)), M > f && (f = M)), C.length &&
                                        L.appendChild(k.createTextNode(C.join(" ").replace(/- /g, "-")));
                                    a.rotation = m
                                }
                                w++
                            }
                        }
                    })
                }), v && a.attr("title", a.textStr), q && q.removeChild(d), I && a.applyTextOutline && a.applyTextOutline(I)) : d.appendChild(k.createTextNode(c.replace(/&lt;/g, "\x3c").replace(/&gt;/g, "\x3e")))
            },
            getContrast: function(a) {
                a = m(a).rgba;
                return 510 < a[0] + a[1] + a[2] ? "#000000" : "#FFFFFF"
            },
            button: function(a, b, x, c, e, J, y, C, w) {
                var A = this.label(a, b, x, w, null, null, null, null, "button"),
                    L = 0;
                A.attr(E({
                    padding: 8,
                    r: 2
                }, e));
                var g, n, k, v;
                e = E({
                    fill: "#f7f7f7",
                    stroke: "#cccccc",
                    "stroke-width": 1,
                    style: {
                        color: "#333333",
                        cursor: "pointer",
                        fontWeight: "normal"
                    }
                }, e);
                g = e.style;
                delete e.style;
                J = E(e, {
                    fill: "#e6e6e6"
                }, J);
                n = J.style;
                delete J.style;
                y = E(e, {
                    fill: "#e6ebf5",
                    style: {
                        color: "#000000",
                        fontWeight: "bold"
                    }
                }, y);
                k = y.style;
                delete y.style;
                C = E(e, {
                    style: {
                        color: "#cccccc"
                    }
                }, C);
                v = C.style;
                delete C.style;
                F(A.element, d ? "mouseover" : "mouseenter", function() {
                    3 !== L && A.setState(1)
                });
                F(A.element, d ? "mouseout" : "mouseleave", function() {
                    3 !== L && A.setState(L)
                });
                A.setState = function(a) {
                    1 !== a &&
                        (A.state = L = a);
                    A.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-" + ["normal", "hover", "pressed", "disabled"][a || 0]);
                    A.attr([e, J, y, C][a || 0]).css([g, n, k, v][a || 0])
                };
                A.attr(e).css(p({
                    cursor: "default"
                }, g));
                return A.on("click", function(a) {
                    3 !== L && c.call(A, a)
                })
            },
            crispLine: function(a, d) {
                a[1] === a[4] && (a[1] = a[4] = Math.round(a[1]) - d % 2 / 2);
                a[2] === a[5] && (a[2] = a[5] = Math.round(a[2]) + d % 2 / 2);
                return a
            },
            path: function(a) {
                var d = {
                    fill: "none"
                };
                n(a) ? d.d = a : C(a) && p(d, a);
                return this.createElement("path").attr(d)
            },
            circle: function(a, d, b) {
                a = C(a) ? a : {
                    x: a,
                    y: d,
                    r: b
                };
                d = this.createElement("circle");
                d.xSetter = d.ySetter = function(a, d, b) {
                    b.setAttribute("c" + d, a)
                };
                return d.attr(a)
            },
            arc: function(a, d, b, x, c, e) {
                C(a) && (d = a.y, b = a.r, x = a.innerR, c = a.start, e = a.end, a = a.x);
                a = this.symbol("arc", a || 0, d || 0, b || 0, b || 0, {
                    innerR: x || 0,
                    start: c || 0,
                    end: e || 0
                });
                a.r = b;
                return a
            },
            rect: function(a, d, b, x, c, e) {
                c = C(a) ? a.r : c;
                var A = this.createElement("rect");
                a = C(a) ? a : void 0 === a ? {} : {
                    x: a,
                    y: d,
                    width: Math.max(b, 0),
                    height: Math.max(x, 0)
                };
                void 0 !== e && (a.strokeWidth =
                    e, a = A.crisp(a));
                a.fill = "none";
                c && (a.r = c);
                A.rSetter = function(a, d, b) {
                    r(b, {
                        rx: a,
                        ry: a
                    })
                };
                return A.attr(a)
            },
            setSize: function(a, d, b) {
                var x = this.alignedObjects,
                    c = x.length;
                this.width = a;
                this.height = d;
                for (this.boxWrapper.animate({
                        width: a,
                        height: d
                    }, {
                        step: function() {
                            this.attr({
                                viewBox: "0 0 " + this.attr("width") + " " + this.attr("height")
                            })
                        },
                        duration: H(b, !0) ? void 0 : 0
                    }); c--;) x[c].align()
            },
            g: function(a) {
                var d = this.createElement("g");
                return a ? d.attr({
                    "class": "highcharts-" + a
                }) : d
            },
            image: function(a, d, b, x, c) {
                var e = {
                    preserveAspectRatio: "none"
                };
                1 < arguments.length && p(e, {
                    x: d,
                    y: b,
                    width: x,
                    height: c
                });
                e = this.createElement("image").attr(e);
                e.element.setAttributeNS ? e.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", a) : e.element.setAttribute("hc-svg-href", a);
                return e
            },
            symbol: function(a, d, b, x, c, e) {
                var J = this,
                    A, y = this.symbols[a],
                    C = l(d) && y && y(Math.round(d), Math.round(b), x, c, e),
                    w = /^url\((.*?)\)$/,
                    g, n;
                y ? (A = this.path(C), A.attr("fill", "none"), p(A, {
                    symbolName: a,
                    x: d,
                    y: b,
                    width: x,
                    height: c
                }), e && p(A, e)) : w.test(a) && (g = a.match(w)[1], A = this.image(g),
                    A.imgwidth = H(O[g] && O[g].width, e && e.width), A.imgheight = H(O[g] && O[g].height, e && e.height), n = function() {
                        A.attr({
                            width: A.width,
                            height: A.height
                        })
                    }, z(["width", "height"], function(a) {
                        A[a + "Setter"] = function(a, d) {
                            var b = {},
                                x = this["img" + d],
                                c = "width" === d ? "translateX" : "translateY";
                            this[d] = a;
                            l(x) && (this.element && this.element.setAttribute(d, x), this.alignByTranslate || (b[c] = ((this[d] || 0) - x) / 2, this.attr(b)))
                        }
                    }), l(d) && A.attr({
                        x: d,
                        y: b
                    }), A.isImg = !0, l(A.imgwidth) && l(A.imgheight) ? n() : (A.attr({
                        width: 0,
                        height: 0
                    }), q("img", {
                        onload: function() {
                            var a =
                                h[J.chartIndex];
                            0 === this.width && (t(this, {
                                position: "absolute",
                                top: "-999em"
                            }), k.body.appendChild(this));
                            O[g] = {
                                width: this.width,
                                height: this.height
                            };
                            A.imgwidth = this.width;
                            A.imgheight = this.height;
                            A.element && n();
                            this.parentNode && this.parentNode.removeChild(this);
                            J.imgCount--;
                            if (!J.imgCount && a && a.onload) a.onload()
                        },
                        src: g
                    }), this.imgCount++));
                return A
            },
            symbols: {
                circle: function(a, d, b, x) {
                    var c = .166 * b;
                    return ["M", a + b / 2, d, "C", a + b + c, d, a + b + c, d + x, a + b / 2, d + x, "C", a - c, d + x, a - c, d, a + b / 2, d, "Z"]
                },
                square: function(a, d, b, x) {
                    return ["M",
                        a, d, "L", a + b, d, a + b, d + x, a, d + x, "Z"
                    ]
                },
                triangle: function(a, d, b, x) {
                    return ["M", a + b / 2, d, "L", a + b, d + x, a, d + x, "Z"]
                },
                "triangle-down": function(a, d, b, x) {
                    return ["M", a, d, "L", a + b, d, a + b / 2, d + x, "Z"]
                },
                diamond: function(a, d, b, x) {
                    return ["M", a + b / 2, d, "L", a + b, d + x / 2, a + b / 2, d + x, a, d + x / 2, "Z"]
                },
                arc: function(a, d, b, x, c) {
                    var e = c.start;
                    b = c.r || b || x;
                    var J = c.end - .001;
                    x = c.innerR;
                    var A = c.open,
                        y = Math.cos(e),
                        C = Math.sin(e),
                        w = Math.cos(J),
                        J = Math.sin(J);
                    c = c.end - e < Math.PI ? 0 : 1;
                    return ["M", a + b * y, d + b * C, "A", b, b, 0, c, 1, a + b * w, d + b * J, A ? "M" : "L", a + x * w, d + x * J,
                        "A", x, x, 0, c, 0, a + x * y, d + x * C, A ? "" : "Z"
                    ]
                },
                callout: function(a, d, b, x, c) {
                    var e = Math.min(c && c.r || 0, b, x),
                        J = e + 6,
                        y = c && c.anchorX;
                    c = c && c.anchorY;
                    var C;
                    C = ["M", a + e, d, "L", a + b - e, d, "C", a + b, d, a + b, d, a + b, d + e, "L", a + b, d + x - e, "C", a + b, d + x, a + b, d + x, a + b - e, d + x, "L", a + e, d + x, "C", a, d + x, a, d + x, a, d + x - e, "L", a, d + e, "C", a, d, a, d, a + e, d];
                    y && y > b ? c > d + J && c < d + x - J ? C.splice(13, 3, "L", a + b, c - 6, a + b + 6, c, a + b, c + 6, a + b, d + x - e) : C.splice(13, 3, "L", a + b, x / 2, y, c, a + b, x / 2, a + b, d + x - e) : y && 0 > y ? c > d + J && c < d + x - J ? C.splice(33, 3, "L", a, c + 6, a - 6, c, a, c - 6, a, d + e) : C.splice(33, 3, "L",
                        a, x / 2, y, c, a, x / 2, a, d + e) : c && c > x && y > a + J && y < a + b - J ? C.splice(23, 3, "L", y + 6, d + x, y, d + x + 6, y - 6, d + x, a + e, d + x) : c && 0 > c && y > a + J && y < a + b - J && C.splice(3, 3, "L", y - 6, d, y, d - 6, y + 6, d, b - e, d);
                    return C
                }
            },
            clipRect: function(d, b, x, c) {
                var e = a.uniqueKey(),
                    J = this.createElement("clipPath").attr({
                        id: e
                    }).add(this.defs);
                d = this.rect(d, b, x, c, 0).add(J);
                d.id = e;
                d.clipPath = J;
                d.count = 0;
                return d
            },
            text: function(a, d, b, c) {
                var e = !x && this.forExport,
                    J = {};
                if (c && (this.allowHTML || !this.forExport)) return this.html(a, d, b);
                J.x = Math.round(d || 0);
                b && (J.y = Math.round(b));
                if (a || 0 === a) J.text = a;
                a = this.createElement("text").attr(J);
                e && a.css({
                    position: "absolute"
                });
                c || (a.xSetter = function(a, d, b) {
                    var x = b.getElementsByTagName("tspan"),
                        c, e = b.getAttribute(d),
                        J;
                    for (J = 0; J < x.length; J++) c = x[J], c.getAttribute(d) === e && c.setAttribute(d, a);
                    b.setAttribute(d, a)
                });
                return a
            },
            fontMetrics: function(a, d) {
                a = a || d && d.style && d.style.fontSize || this.style && this.style.fontSize;
                a = /px/.test(a) ? w(a) : /em/.test(a) ? parseFloat(a) * (d ? this.fontMetrics(null, d.parentNode).f : 16) : 12;
                d = 24 > a ? a + 3 : Math.round(1.2 *
                    a);
                return {
                    h: d,
                    b: Math.round(.8 * d),
                    f: a
                }
            },
            rotCorr: function(a, d, b) {
                var x = a;
                d && b && (x = Math.max(x * Math.cos(d * f), 4));
                return {
                    x: -a / 3 * Math.sin(d * f),
                    y: x
                }
            },
            label: function(a, d, b, x, c, e, J, y, C) {
                var w = this,
                    g = w.g("button" !== C && "label"),
                    n = g.text = w.text("", 0, 0, J).attr({
                        zIndex: 1
                    }),
                    A, k, v = 0,
                    H = 3,
                    u = 0,
                    f, I, L, M, q, Q = {},
                    h, m, O = /^url\((.*?)\)$/.test(x),
                    t = O,
                    S, r, P, R;
                C && g.addClass("highcharts-" + C);
                t = O;
                S = function() {
                    return (h || 0) % 2 / 2
                };
                r = function() {
                    var a = n.element.style,
                        d = {};
                    k = (void 0 === f || void 0 === I || q) && l(n.textStr) && n.getBBox();
                    g.width =
                        (f || k.width || 0) + 2 * H + u;
                    g.height = (I || k.height || 0) + 2 * H;
                    m = H + w.fontMetrics(a && a.fontSize, n).b;
                    t && (A || (g.box = A = w.symbols[x] || O ? w.symbol(x) : w.rect(), A.addClass(("button" === C ? "" : "highcharts-label-box") + (C ? " highcharts-" + C + "-box" : "")), A.add(g), a = S(), d.x = a, d.y = (y ? -m : 0) + a), d.width = Math.round(g.width), d.height = Math.round(g.height), A.attr(p(d, Q)), Q = {})
                };
                P = function() {
                    var a = u + H,
                        d;
                    d = y ? 0 : m;
                    l(f) && k && ("center" === q || "right" === q) && (a += {
                        center: .5,
                        right: 1
                    }[q] * (f - k.width));
                    if (a !== n.x || d !== n.y) n.attr("x", a), void 0 !== d && n.attr("y",
                        d);
                    n.x = a;
                    n.y = d
                };
                R = function(a, d) {
                    A ? A.attr(a, d) : Q[a] = d
                };
                g.onAdd = function() {
                    n.add(g);
                    g.attr({
                        text: a || 0 === a ? a : "",
                        x: d,
                        y: b
                    });
                    A && l(c) && g.attr({
                        anchorX: c,
                        anchorY: e
                    })
                };
                g.widthSetter = function(a) {
                    f = a
                };
                g.heightSetter = function(a) {
                    I = a
                };
                g["text-alignSetter"] = function(a) {
                    q = a
                };
                g.paddingSetter = function(a) {
                    l(a) && a !== H && (H = g.padding = a, P())
                };
                g.paddingLeftSetter = function(a) {
                    l(a) && a !== u && (u = a, P())
                };
                g.alignSetter = function(a) {
                    a = {
                        left: 0,
                        center: .5,
                        right: 1
                    }[a];
                    a !== v && (v = a, k && g.attr({
                        x: L
                    }))
                };
                g.textSetter = function(a) {
                    void 0 !==
                        a && n.textSetter(a);
                    r();
                    P()
                };
                g["stroke-widthSetter"] = function(a, d) {
                    a && (t = !0);
                    h = this["stroke-width"] = a;
                    R(d, a)
                };
                g.strokeSetter = g.fillSetter = g.rSetter = function(a, d) {
                    "fill" === d && a && (t = !0);
                    R(d, a)
                };
                g.anchorXSetter = function(a, d) {
                    c = a;
                    R(d, Math.round(a) - S() - L)
                };
                g.anchorYSetter = function(a, d) {
                    e = a;
                    R(d, a - M)
                };
                g.xSetter = function(a) {
                    g.x = a;
                    v && (a -= v * ((f || k.width) + 2 * H));
                    L = Math.round(a);
                    g.attr("translateX", L)
                };
                g.ySetter = function(a) {
                    M = g.y = Math.round(a);
                    g.attr("translateY", M)
                };
                var V = g.css;
                return p(g, {
                    css: function(a) {
                        if (a) {
                            var d = {};
                            a = E(a);
                            z(g.textProps, function(b) {
                                void 0 !== a[b] && (d[b] = a[b], delete a[b])
                            });
                            n.css(d)
                        }
                        return V.call(g, a)
                    },
                    getBBox: function() {
                        return {
                            width: k.width + 2 * H,
                            height: k.height + 2 * H,
                            x: k.x - H,
                            y: k.y - H
                        }
                    },
                    shadow: function(a) {
                        a && (r(), A && A.shadow(a));
                        return g
                    },
                    destroy: function() {
                        K(g.element, "mouseenter");
                        K(g.element, "mouseleave");
                        n && (n = n.destroy());
                        A && (A = A.destroy());
                        D.prototype.destroy.call(g);
                        g = w = r = P = R = null
                    }
                })
            }
        };
        a.Renderer = B
    })(N);
    (function(a) {
        var D = a.attr,
            B = a.createElement,
            F = a.css,
            G = a.defined,
            r = a.each,
            h = a.extend,
            m =
            a.isFirefox,
            t = a.isMS,
            q = a.isWebKit,
            l = a.pInt,
            f = a.SVGRenderer,
            b = a.win,
            k = a.wrap;
        h(a.SVGElement.prototype, {
            htmlCss: function(a) {
                var b = this.element;
                if (b = a && "SPAN" === b.tagName && a.width) delete a.width, this.textWidth = b, this.updateTransform();
                a && "ellipsis" === a.textOverflow && (a.whiteSpace = "nowrap", a.overflow = "hidden");
                this.styles = h(this.styles, a);
                F(this.element, a);
                return this
            },
            htmlGetBBox: function() {
                var a = this.element;
                "text" === a.nodeName && (a.style.position = "absolute");
                return {
                    x: a.offsetLeft,
                    y: a.offsetTop,
                    width: a.offsetWidth,
                    height: a.offsetHeight
                }
            },
            htmlUpdateTransform: function() {
                if (this.added) {
                    var a = this.renderer,
                        b = this.element,
                        g = this.translateX || 0,
                        e = this.translateY || 0,
                        c = this.x || 0,
                        n = this.y || 0,
                        k = this.textAlign || "left",
                        d = {
                            left: 0,
                            center: .5,
                            right: 1
                        }[k],
                        C = this.styles;
                    F(b, {
                        marginLeft: g,
                        marginTop: e
                    });
                    this.shadows && r(this.shadows, function(a) {
                        F(a, {
                            marginLeft: g + 1,
                            marginTop: e + 1
                        })
                    });
                    this.inverted && r(b.childNodes, function(d) {
                        a.invertChild(d, b)
                    });
                    if ("SPAN" === b.tagName) {
                        var y = this.rotation,
                            v = l(this.textWidth),
                            f = C && C.whiteSpace,
                            I = [y,
                                k, b.innerHTML, this.textWidth, this.textAlign
                            ].join();
                        I !== this.cTT && (C = a.fontMetrics(b.style.fontSize).b, G(y) && this.setSpanRotation(y, d, C), F(b, {
                            width: "",
                            whiteSpace: f || "nowrap"
                        }), b.offsetWidth > v && /[ \-]/.test(b.textContent || b.innerText) && F(b, {
                            width: v + "px",
                            display: "block",
                            whiteSpace: f || "normal"
                        }), this.getSpanCorrection(b.offsetWidth, C, d, y, k));
                        F(b, {
                            left: c + (this.xCorr || 0) + "px",
                            top: n + (this.yCorr || 0) + "px"
                        });
                        q && (C = b.offsetHeight);
                        this.cTT = I
                    }
                } else this.alignOnAdd = !0
            },
            setSpanRotation: function(a, k, g) {
                var e = {},
                    c = t ? "-ms-transform" : q ? "-webkit-transform" : m ? "MozTransform" : b.opera ? "-o-transform" : "";
                e[c] = e.transform = "rotate(" + a + "deg)";
                e[c + (m ? "Origin" : "-origin")] = e.transformOrigin = 100 * k + "% " + g + "px";
                F(this.element, e)
            },
            getSpanCorrection: function(a, b, g) {
                this.xCorr = -a * g;
                this.yCorr = -b
            }
        });
        h(f.prototype, {
            html: function(a, b, g) {
                var e = this.createElement("span"),
                    c = e.element,
                    n = e.renderer,
                    u = n.isSVG,
                    d = function(a, d) {
                        r(["opacity", "visibility"], function(b) {
                            k(a, b + "Setter", function(a, b, c, e) {
                                a.call(this, b, c, e);
                                d[c] = b
                            })
                        })
                    };
                e.textSetter =
                    function(a) {
                        a !== c.innerHTML && delete this.bBox;
                        c.innerHTML = this.textStr = a;
                        e.htmlUpdateTransform()
                    };
                u && d(e, e.element.style);
                e.xSetter = e.ySetter = e.alignSetter = e.rotationSetter = function(a, d) {
                    "align" === d && (d = "textAlign");
                    e[d] = a;
                    e.htmlUpdateTransform()
                };
                e.attr({
                    text: a,
                    x: Math.round(b),
                    y: Math.round(g)
                }).css({
                    fontFamily: this.style.fontFamily,
                    fontSize: this.style.fontSize,
                    position: "absolute"
                });
                c.style.whiteSpace = "nowrap";
                e.css = e.htmlCss;
                u && (e.add = function(a) {
                    var b, g = n.box.parentNode,
                        C = [];
                    if (this.parentGroup =
                        a) {
                        if (b = a.div, !b) {
                            for (; a;) C.push(a), a = a.parentGroup;
                            r(C.reverse(), function(a) {
                                var c, e = D(a.element, "class");
                                e && (e = {
                                    className: e
                                });
                                b = a.div = a.div || B("div", e, {
                                    position: "absolute",
                                    left: (a.translateX || 0) + "px",
                                    top: (a.translateY || 0) + "px",
                                    display: a.display,
                                    opacity: a.opacity,
                                    pointerEvents: a.styles && a.styles.pointerEvents
                                }, b || g);
                                c = b.style;
                                h(a, {
                                    translateXSetter: function(d, b) {
                                        c.left = d + "px";
                                        a[b] = d;
                                        a.doTransform = !0
                                    },
                                    translateYSetter: function(d, b) {
                                        c.top = d + "px";
                                        a[b] = d;
                                        a.doTransform = !0
                                    }
                                });
                                d(a, c)
                            })
                        }
                    } else b = g;
                    b.appendChild(c);
                    e.added = !0;
                    e.alignOnAdd && e.htmlUpdateTransform();
                    return e
                });
                return e
            }
        })
    })(N);
    (function(a) {
        var D, B, F = a.createElement,
            G = a.css,
            r = a.defined,
            h = a.deg2rad,
            m = a.discardElement,
            t = a.doc,
            q = a.each,
            l = a.erase,
            f = a.extend;
        D = a.extendClass;
        var b = a.isArray,
            k = a.isNumber,
            z = a.isObject,
            p = a.merge;
        B = a.noop;
        var g = a.pick,
            e = a.pInt,
            c = a.SVGElement,
            n = a.SVGRenderer,
            u = a.win;
        a.svg || (B = {
            docMode8: t && 8 === t.documentMode,
            init: function(a, b) {
                var d = ["\x3c", b, ' filled\x3d"f" stroked\x3d"f"'],
                    c = ["position: ", "absolute", ";"],
                    e = "div" === b;
                ("shape" ===
                    b || e) && c.push("left:0;top:0;width:1px;height:1px;");
                c.push("visibility: ", e ? "hidden" : "visible");
                d.push(' style\x3d"', c.join(""), '"/\x3e');
                b && (d = e || "span" === b || "img" === b ? d.join("") : a.prepVML(d), this.element = F(d));
                this.renderer = a
            },
            add: function(a) {
                var d = this.renderer,
                    b = this.element,
                    c = d.box,
                    e = a && a.inverted,
                    c = a ? a.element || a : c;
                a && (this.parentGroup = a);
                e && d.invertChild(b, c);
                c.appendChild(b);
                this.added = !0;
                this.alignOnAdd && !this.deferUpdateTransform && this.updateTransform();
                if (this.onAdd) this.onAdd();
                this.className &&
                    this.attr("class", this.className);
                return this
            },
            updateTransform: c.prototype.htmlUpdateTransform,
            setSpanRotation: function() {
                var a = this.rotation,
                    b = Math.cos(a * h),
                    c = Math.sin(a * h);
                G(this.element, {
                    filter: a ? ["progid:DXImageTransform.Microsoft.Matrix(M11\x3d", b, ", M12\x3d", -c, ", M21\x3d", c, ", M22\x3d", b, ", sizingMethod\x3d'auto expand')"].join("") : "none"
                })
            },
            getSpanCorrection: function(a, b, c, e, n) {
                var d = e ? Math.cos(e * h) : 1,
                    y = e ? Math.sin(e * h) : 0,
                    w = g(this.elemHeight, this.element.offsetHeight),
                    C;
                this.xCorr = 0 > d && -a;
                this.yCorr = 0 > y && -w;
                C = 0 > d * y;
                this.xCorr += y * b * (C ? 1 - c : c);
                this.yCorr -= d * b * (e ? C ? c : 1 - c : 1);
                n && "left" !== n && (this.xCorr -= a * c * (0 > d ? -1 : 1), e && (this.yCorr -= w * c * (0 > y ? -1 : 1)), G(this.element, {
                    textAlign: n
                }))
            },
            pathToVML: function(a) {
                for (var d = a.length, b = []; d--;) k(a[d]) ? b[d] = Math.round(10 * a[d]) - 5 : "Z" === a[d] ? b[d] = "x" : (b[d] = a[d], !a.isArc || "wa" !== a[d] && "at" !== a[d] || (b[d + 5] === b[d + 7] && (b[d + 7] += a[d + 7] > a[d + 5] ? 1 : -1), b[d + 6] === b[d + 8] && (b[d + 8] += a[d + 8] > a[d + 6] ? 1 : -1)));
                return b.join(" ") || "x"
            },
            clip: function(a) {
                var d = this,
                    b;
                a ? (b = a.members,
                    l(b, d), b.push(d), d.destroyClip = function() {
                        l(b, d)
                    }, a = a.getCSS(d)) : (d.destroyClip && d.destroyClip(), a = {
                    clip: d.docMode8 ? "inherit" : "rect(auto)"
                });
                return d.css(a)
            },
            css: c.prototype.htmlCss,
            safeRemoveChild: function(a) {
                a.parentNode && m(a)
            },
            destroy: function() {
                this.destroyClip && this.destroyClip();
                return c.prototype.destroy.apply(this)
            },
            on: function(a, b) {
                this.element["on" + a] = function() {
                    var a = u.event;
                    a.target = a.srcElement;
                    b(a)
                };
                return this
            },
            cutOffPath: function(a, b) {
                var d;
                a = a.split(/[ ,]/);
                d = a.length;
                if (9 === d || 11 ===
                    d) a[d - 4] = a[d - 2] = e(a[d - 2]) - 10 * b;
                return a.join(" ")
            },
            shadow: function(a, b, c) {
                var d = [],
                    n, y = this.element,
                    k = this.renderer,
                    w, C = y.style,
                    u, x = y.path,
                    J, f, p, A;
                x && "string" !== typeof x.value && (x = "x");
                f = x;
                if (a) {
                    p = g(a.width, 3);
                    A = (a.opacity || .15) / p;
                    for (n = 1; 3 >= n; n++) J = 2 * p + 1 - 2 * n, c && (f = this.cutOffPath(x.value, J + .5)), u = ['\x3cshape isShadow\x3d"true" strokeweight\x3d"', J, '" filled\x3d"false" path\x3d"', f, '" coordsize\x3d"10 10" style\x3d"', y.style.cssText, '" /\x3e'], w = F(k.prepVML(u), null, {
                        left: e(C.left) + g(a.offsetX, 1),
                        top: e(C.top) + g(a.offsetY, 1)
                    }), c && (w.cutOff = J + 1), u = ['\x3cstroke color\x3d"', a.color || "#000000", '" opacity\x3d"', A * n, '"/\x3e'], F(k.prepVML(u), null, null, w), b ? b.element.appendChild(w) : y.parentNode.insertBefore(w, y), d.push(w);
                    this.shadows = d
                }
                return this
            },
            updateShadows: B,
            setAttr: function(a, b) {
                this.docMode8 ? this.element[a] = b : this.element.setAttribute(a, b)
            },
            classSetter: function(a) {
                (this.added ? this.element : this).className = a
            },
            dashstyleSetter: function(a, b, c) {
                (c.getElementsByTagName("stroke")[0] || F(this.renderer.prepVML(["\x3cstroke/\x3e"]),
                    null, null, c))[b] = a || "solid";
                this[b] = a
            },
            dSetter: function(a, b, c) {
                var d = this.shadows;
                a = a || [];
                this.d = a.join && a.join(" ");
                c.path = a = this.pathToVML(a);
                if (d)
                    for (c = d.length; c--;) d[c].path = d[c].cutOff ? this.cutOffPath(a, d[c].cutOff) : a;
                this.setAttr(b, a)
            },
            fillSetter: function(a, b, c) {
                var d = c.nodeName;
                "SPAN" === d ? c.style.color = a : "IMG" !== d && (c.filled = "none" !== a, this.setAttr("fillcolor", this.renderer.color(a, c, b, this)))
            },
            "fill-opacitySetter": function(a, b, c) {
                F(this.renderer.prepVML(["\x3c", b.split("-")[0], ' opacity\x3d"',
                    a, '"/\x3e'
                ]), null, null, c)
            },
            opacitySetter: B,
            rotationSetter: function(a, b, c) {
                c = c.style;
                this[b] = c[b] = a;
                c.left = -Math.round(Math.sin(a * h) + 1) + "px";
                c.top = Math.round(Math.cos(a * h)) + "px"
            },
            strokeSetter: function(a, b, c) {
                this.setAttr("strokecolor", this.renderer.color(a, c, b, this))
            },
            "stroke-widthSetter": function(a, b, c) {
                c.stroked = !!a;
                this[b] = a;
                k(a) && (a += "px");
                this.setAttr("strokeweight", a)
            },
            titleSetter: function(a, b) {
                this.setAttr(b, a)
            },
            visibilitySetter: function(a, b, c) {
                "inherit" === a && (a = "visible");
                this.shadows && q(this.shadows,
                    function(d) {
                        d.style[b] = a
                    });
                "DIV" === c.nodeName && (a = "hidden" === a ? "-999em" : 0, this.docMode8 || (c.style[b] = a ? "visible" : "hidden"), b = "top");
                c.style[b] = a
            },
            xSetter: function(a, b, c) {
                this[b] = a;
                "x" === b ? b = "left" : "y" === b && (b = "top");
                this.updateClipping ? (this[b] = a, this.updateClipping()) : c.style[b] = a
            },
            zIndexSetter: function(a, b, c) {
                c.style[b] = a
            }
        }, B["stroke-opacitySetter"] = B["fill-opacitySetter"], a.VMLElement = B = D(c, B), B.prototype.ySetter = B.prototype.widthSetter = B.prototype.heightSetter = B.prototype.xSetter, B = {
            Element: B,
            isIE8: -1 < u.navigator.userAgent.indexOf("MSIE 8.0"),
            init: function(a, b, c) {
                var d, e;
                this.alignedObjects = [];
                d = this.createElement("div").css({
                    position: "relative"
                });
                e = d.element;
                a.appendChild(d.element);
                this.isVML = !0;
                this.box = e;
                this.boxWrapper = d;
                this.gradients = {};
                this.cache = {};
                this.cacheKeys = [];
                this.imgCount = 0;
                this.setSize(b, c, !1);
                if (!t.namespaces.hcv) {
                    t.namespaces.add("hcv", "urn:schemas-microsoft-com:vml");
                    try {
                        t.createStyleSheet().cssText = "hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "
                    } catch (I) {
                        t.styleSheets[0].cssText +=
                            "hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "
                    }
                }
            },
            isHidden: function() {
                return !this.box.offsetWidth
            },
            clipRect: function(a, b, c, e) {
                var d = this.createElement(),
                    g = z(a);
                return f(d, {
                    members: [],
                    count: 0,
                    left: (g ? a.x : a) + 1,
                    top: (g ? a.y : b) + 1,
                    width: (g ? a.width : c) - 1,
                    height: (g ? a.height : e) - 1,
                    getCSS: function(a) {
                        var b = a.element,
                            d = b.nodeName,
                            c = a.inverted,
                            x = this.top - ("shape" === d ? b.offsetTop : 0),
                            e = this.left,
                            b = e + this.width,
                            g = x + this.height,
                            x = {
                                clip: "rect(" + Math.round(c ?
                                    e : x) + "px," + Math.round(c ? g : b) + "px," + Math.round(c ? b : g) + "px," + Math.round(c ? x : e) + "px)"
                            };
                        !c && a.docMode8 && "DIV" === d && f(x, {
                            width: b + "px",
                            height: g + "px"
                        });
                        return x
                    },
                    updateClipping: function() {
                        q(d.members, function(a) {
                            a.element && a.css(d.getCSS(a))
                        })
                    }
                })
            },
            color: function(b, c, e, g) {
                var d = this,
                    n, k = /^rgba/,
                    w, y, u = "none";
                b && b.linearGradient ? y = "gradient" : b && b.radialGradient && (y = "pattern");
                if (y) {
                    var x, J, f = b.linearGradient || b.radialGradient,
                        p, A, C, v, z, l = "";
                    b = b.stops;
                    var h, m = [],
                        t = function() {
                            w = ['\x3cfill colors\x3d"' + m.join(",") +
                                '" opacity\x3d"', C, '" o:opacity2\x3d"', A, '" type\x3d"', y, '" ', l, 'focus\x3d"100%" method\x3d"any" /\x3e'
                            ];
                            F(d.prepVML(w), null, null, c)
                        };
                    p = b[0];
                    h = b[b.length - 1];
                    0 < p[0] && b.unshift([0, p[1]]);
                    1 > h[0] && b.push([1, h[1]]);
                    q(b, function(b, d) {
                        k.test(b[1]) ? (n = a.color(b[1]), x = n.get("rgb"), J = n.get("a")) : (x = b[1], J = 1);
                        m.push(100 * b[0] + "% " + x);
                        d ? (C = J, v = x) : (A = J, z = x)
                    });
                    if ("fill" === e)
                        if ("gradient" === y) e = f.x1 || f[0] || 0, b = f.y1 || f[1] || 0, p = f.x2 || f[2] || 0, f = f.y2 || f[3] || 0, l = 'angle\x3d"' + (90 - 180 * Math.atan((f - b) / (p - e)) / Math.PI) + '"',
                            t();
                        else {
                            var u = f.r,
                                r = 2 * u,
                                B = 2 * u,
                                D = f.cx,
                                G = f.cy,
                                U = c.radialReference,
                                T, u = function() {
                                    U && (T = g.getBBox(), D += (U[0] - T.x) / T.width - .5, G += (U[1] - T.y) / T.height - .5, r *= U[2] / T.width, B *= U[2] / T.height);
                                    l = 'src\x3d"' + a.getOptions().global.VMLRadialGradientURL + '" size\x3d"' + r + "," + B + '" origin\x3d"0.5,0.5" position\x3d"' + D + "," + G + '" color2\x3d"' + z + '" ';
                                    t()
                                };
                            g.added ? u() : g.onAdd = u;
                            u = v
                        }
                    else u = x
                } else k.test(b) && "IMG" !== c.tagName ? (n = a.color(b), g[e + "-opacitySetter"](n.get("a"), e, c), u = n.get("rgb")) : (u = c.getElementsByTagName(e),
                    u.length && (u[0].opacity = 1, u[0].type = "solid"), u = b);
                return u
            },
            prepVML: function(a) {
                var b = this.isIE8;
                a = a.join("");
                b ? (a = a.replace("/\x3e", ' xmlns\x3d"urn:schemas-microsoft-com:vml" /\x3e'), a = -1 === a.indexOf('style\x3d"') ? a.replace("/\x3e", ' style\x3d"display:inline-block;behavior:url(#default#VML);" /\x3e') : a.replace('style\x3d"', 'style\x3d"display:inline-block;behavior:url(#default#VML);')) : a = a.replace("\x3c", "\x3chcv:");
                return a
            },
            text: n.prototype.html,
            path: function(a) {
                var d = {
                    coordsize: "10 10"
                };
                b(a) ? d.d =
                    a : z(a) && f(d, a);
                return this.createElement("shape").attr(d)
            },
            circle: function(a, b, c) {
                var d = this.symbol("circle");
                z(a) && (c = a.r, b = a.y, a = a.x);
                d.isCircle = !0;
                d.r = c;
                return d.attr({
                    x: a,
                    y: b
                })
            },
            g: function(a) {
                var b;
                a && (b = {
                    className: "highcharts-" + a,
                    "class": "highcharts-" + a
                });
                return this.createElement("div").attr(b)
            },
            image: function(a, b, c, e, g) {
                var d = this.createElement("img").attr({
                    src: a
                });
                1 < arguments.length && d.attr({
                    x: b,
                    y: c,
                    width: e,
                    height: g
                });
                return d
            },
            createElement: function(a) {
                return "rect" === a ? this.symbol(a) : n.prototype.createElement.call(this,
                    a)
            },
            invertChild: function(a, b) {
                var d = this;
                b = b.style;
                var c = "IMG" === a.tagName && a.style;
                G(a, {
                    flip: "x",
                    left: e(b.width) - (c ? e(c.top) : 1),
                    top: e(b.height) - (c ? e(c.left) : 1),
                    rotation: -90
                });
                q(a.childNodes, function(b) {
                    d.invertChild(b, a)
                })
            },
            symbols: {
                arc: function(a, b, c, e, g) {
                    var d = g.start,
                        n = g.end,
                        w = g.r || c || e;
                    c = g.innerR;
                    e = Math.cos(d);
                    var k = Math.sin(d),
                        u = Math.cos(n),
                        x = Math.sin(n);
                    if (0 === n - d) return ["x"];
                    d = ["wa", a - w, b - w, a + w, b + w, a + w * e, b + w * k, a + w * u, b + w * x];
                    g.open && !c && d.push("e", "M", a, b);
                    d.push("at", a - c, b - c, a + c, b + c, a + c * u,
                        b + c * x, a + c * e, b + c * k, "x", "e");
                    d.isArc = !0;
                    return d
                },
                circle: function(a, b, c, e, g) {
                    g && r(g.r) && (c = e = 2 * g.r);
                    g && g.isCircle && (a -= c / 2, b -= e / 2);
                    return ["wa", a, b, a + c, b + e, a + c, b + e / 2, a + c, b + e / 2, "e"]
                },
                rect: function(a, b, c, e, g) {
                    return n.prototype.symbols[r(g) && g.r ? "callout" : "square"].call(0, a, b, c, e, g)
                }
            }
        }, a.VMLRenderer = D = function() {
            this.init.apply(this, arguments)
        }, D.prototype = p(n.prototype, B), a.Renderer = D);
        n.prototype.measureSpanWidth = function(a, b) {
            var c = t.createElement("span");
            a = t.createTextNode(a);
            c.appendChild(a);
            G(c,
                b);
            this.box.appendChild(c);
            b = c.offsetWidth;
            m(c);
            return b
        }
    })(N);
    (function(a) {
        function D() {
            var t = a.defaultOptions.global,
                q, l = t.useUTC,
                f = l ? "getUTC" : "get",
                b = l ? "setUTC" : "set";
            a.Date = q = t.Date || m.Date;
            q.hcTimezoneOffset = l && t.timezoneOffset;
            q.hcGetTimezoneOffset = l && t.getTimezoneOffset;
            q.hcMakeTime = function(a, b, f, g, e, c) {
                var n;
                l ? (n = q.UTC.apply(0, arguments), n += G(n)) : n = (new q(a, b, h(f, 1), h(g, 0), h(e, 0), h(c, 0))).getTime();
                return n
            };
            F("Minutes Hours Day Date Month FullYear".split(" "), function(a) {
                q["hcGet" + a] = f +
                    a
            });
            F("Milliseconds Seconds Minutes Hours Date Month FullYear".split(" "), function(a) {
                q["hcSet" + a] = b + a
            })
        }
        var B = a.color,
            F = a.each,
            G = a.getTZOffset,
            r = a.merge,
            h = a.pick,
            m = a.win;
        a.defaultOptions = {
            colors: "#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1".split(" "),
            symbols: ["circle", "diamond", "square", "triangle", "triangle-down"],
            lang: {
                loading: "Loading...",
                months: "January February March April May June July August September October November December".split(" "),
                shortMonths: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
                weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
                decimalPoint: ".",
                numericSymbols: "kMGTPE".split(""),
                resetZoom: "Reset zoom",
                resetZoomTitle: "Reset zoom level 1:1",
                thousandsSep: " "
            },
            global: {
                useUTC: !0,
                VMLRadialGradientURL: "http://code.highcharts.com/5.0.4/gfx/vml-radial-gradient.png"
            },
            chart: {
                borderRadius: 0,
                defaultSeriesType: "line",
                ignoreHiddenSeries: !0,
                spacing: [10, 10, 15, 10],
                resetZoomButton: {
                    theme: {
                        zIndex: 20
                    },
                    position: {
                        align: "right",
                        x: -10,
                        y: 10
                    }
                },
                width: null,
                height: null,
                borderColor: "#335cad",
                backgroundColor: "transparent",
                plotBorderColor: "#cccccc"
            },
            title: {
                text: "Chart title",
                align: "center",
                margin: 15,
                style: {
                    color: "#ffffff",
                    fontSize: "18px"
                },
                widthAdjust: -44
            },
            subtitle: {
                text: "",
                align: "center",
                style: {
                    color: "#666666"
                },
                widthAdjust: -44
            },
            plotOptions: {},
            labels: {
                style: {
                    position: "absolute",
                    color: "#ffffff"
                }
            },
            legend: {
                enabled: !0,
                align: "center",
                layout: "horizontal",
                labelFormatter: function() {
                    return this.name
                },
                borderColor: "#999999",
                borderRadius: 0,
                navigation: {
                    activeColor: "#003399",
                    inactiveColor: "#cccccc"
                },
                itemStyle: {
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "bold"
                },
                itemHoverStyle: {
                    color: "#000000"
                },
                itemHiddenStyle: {
                    color: "#cccccc"
                },
                shadow: !1,
                itemCheckboxStyle: {
                    position: "absolute",
                    width: "13px",
                    height: "13px"
                },
                squareSymbol: !0,
                symbolPadding: 5,
                verticalAlign: "bottom",
                x: 0,
                y: 0,
                title: {
                    style: {
                        fontWeight: "bold"
                    }
                }
            },
            loading: {
                labelStyle: {
                    fontWeight: "bold",
                    position: "relative",
                    top: "45%"
                },
                style: {
                    position: "absolute",
                    backgroundColor: "#ffffff",
                    opacity: .5,
                    textAlign: "center"
                }
            },
            tooltip: {
                enabled: !0,
                animation: a.svg,
                borderRadius: 3,
                dateTimeLabelFormats: {
                    millisecond: "%A, %b %e, %H:%M:%S.%L",
                    second: "%A, %b %e, %H:%M:%S",
                    minute: "%A, %b %e, %H:%M",
                    hour: "%A, %b %e, %H:%M",
                    day: "%A, %b %e, %Y",
                    week: "Week from %A, %b %e, %Y",
                    month: "%B %Y",
                    year: "%Y"
                },
                footerFormat: "",
                padding: 8,
                snap: a.isTouchDevice ? 25 : 10,
                backgroundColor: B("#f7f7f7").setOpacity(.85).get(),
                borderWidth: 1,
                headerFormat: '\x3cspan style\x3d"font-size: 10px"\x3e{point.key}\x3c/span\x3e\x3cbr/\x3e',
                pointFormat: '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e',
                shadow: !0,
                style: {
                    color: "#333333",
                    cursor: "default",
                    fontSize: "12px",
                    pointerEvents: "none",
                    whiteSpace: "nowrap"
                }
            },
            credits: {
                enabled: !0,
                href: "http://www.highcharts.com",
                position: {
                    align: "right",
                    x: -10,
                    verticalAlign: "bottom",
                    y: -5
                },
                style: {
                    cursor: "pointer",
                    color: "#999999",
                    fontSize: "9px"
                },
                text: "Highcharts.com"
            }
        };
        a.setOptions = function(h) {
            a.defaultOptions = r(!0, a.defaultOptions, h);
            D();
            return a.defaultOptions
        };
        a.getOptions = function() {
            return a.defaultOptions
        };
        a.defaultPlotOptions = a.defaultOptions.plotOptions;
        D()
    })(N);
    (function(a) {
        var D =
            a.arrayMax,
            B = a.arrayMin,
            F = a.defined,
            G = a.destroyObjectProperties,
            r = a.each,
            h = a.erase,
            m = a.merge,
            t = a.pick;
        a.PlotLineOrBand = function(a, l) {
            this.axis = a;
            l && (this.options = l, this.id = l.id)
        };
        a.PlotLineOrBand.prototype = {
            render: function() {
                var a = this,
                    l = a.axis,
                    f = l.horiz,
                    b = a.options,
                    k = b.label,
                    z = a.label,
                    p = b.to,
                    g = b.from,
                    e = b.value,
                    c = F(g) && F(p),
                    n = F(e),
                    u = a.svgElem,
                    d = !u,
                    C = [],
                    y, v = b.color,
                    E = t(b.zIndex, 0),
                    I = b.events,
                    C = {
                        "class": "highcharts-plot-" + (c ? "band " : "line ") + (b.className || "")
                    },
                    H = {},
                    w = l.chart.renderer,
                    K = c ? "bands" : "lines",
                    M = l.log2lin;
                l.isLog && (g = M(g), p = M(p), e = M(e));
                n ? (C = {
                    stroke: v,
                    "stroke-width": b.width
                }, b.dashStyle && (C.dashstyle = b.dashStyle)) : c && (v && (C.fill = v), b.borderWidth && (C.stroke = b.borderColor, C["stroke-width"] = b.borderWidth));
                H.zIndex = E;
                K += "-" + E;
                (v = l[K]) || (l[K] = v = w.g("plot-" + K).attr(H).add());
                d && (a.svgElem = u = w.path().attr(C).add(v));
                if (n) C = l.getPlotLinePath(e, u.strokeWidth());
                else if (c) C = l.getPlotBandPath(g, p, b);
                else return;
                if (d && C && C.length) {
                    if (u.attr({
                            d: C
                        }), I)
                        for (y in b = function(b) {
                                u.on(b, function(c) {
                                    I[b].apply(a, [c])
                                })
                            }, I) b(y)
                } else u && (C ? (u.show(), u.animate({
                    d: C
                })) : (u.hide(), z && (a.label = z = z.destroy())));
                k && F(k.text) && C && C.length && 0 < l.width && 0 < l.height && !C.flat ? (k = m({
                    align: f && c && "center",
                    x: f ? !c && 4 : 10,
                    verticalAlign: !f && c && "middle",
                    y: f ? c ? 16 : 10 : c ? 6 : -4,
                    rotation: f && !c && 90
                }, k), this.renderLabel(k, C, c, E)) : z && z.hide();
                return a
            },
            renderLabel: function(a, l, f, b) {
                var k = this.label,
                    z = this.axis.chart.renderer;
                k || (k = {
                    align: a.textAlign || a.align,
                    rotation: a.rotation,
                    "class": "highcharts-plot-" + (f ? "band" : "line") + "-label " + (a.className ||
                        "")
                }, k.zIndex = b, this.label = k = z.text(a.text, 0, 0, a.useHTML).attr(k).add(), k.css(a.style));
                b = [l[1], l[4], f ? l[6] : l[1]];
                l = [l[2], l[5], f ? l[7] : l[2]];
                f = B(b);
                z = B(l);
                k.align(a, !1, {
                    x: f,
                    y: z,
                    width: D(b) - f,
                    height: D(l) - z
                });
                k.show()
            },
            destroy: function() {
                h(this.axis.plotLinesAndBands, this);
                delete this.axis;
                G(this)
            }
        };
        a.AxisPlotLineOrBandExtension = {
            getPlotBandPath: function(a, l) {
                l = this.getPlotLinePath(l, null, null, !0);
                (a = this.getPlotLinePath(a, null, null, !0)) && l ? (a.flat = a.toString() === l.toString(), a.push(l[4], l[5], l[1], l[2],
                    "z")) : a = null;
                return a
            },
            addPlotBand: function(a) {
                return this.addPlotBandOrLine(a, "plotBands")
            },
            addPlotLine: function(a) {
                return this.addPlotBandOrLine(a, "plotLines")
            },
            addPlotBandOrLine: function(h, l) {
                var f = (new a.PlotLineOrBand(this, h)).render(),
                    b = this.userOptions;
                f && (l && (b[l] = b[l] || [], b[l].push(h)), this.plotLinesAndBands.push(f));
                return f
            },
            removePlotBandOrLine: function(a) {
                for (var l = this.plotLinesAndBands, f = this.options, b = this.userOptions, k = l.length; k--;) l[k].id === a && l[k].destroy();
                r([f.plotLines || [],
                    b.plotLines || [], f.plotBands || [], b.plotBands || []
                ], function(b) {
                    for (k = b.length; k--;) b[k].id === a && h(b, b[k])
                })
            }
        }
    })(N);
    (function(a) {
        var D = a.correctFloat,
            B = a.defined,
            F = a.destroyObjectProperties,
            G = a.isNumber,
            r = a.merge,
            h = a.pick,
            m = a.deg2rad;
        a.Tick = function(a, h, l, f) {
            this.axis = a;
            this.pos = h;
            this.type = l || "";
            this.isNew = !0;
            l || f || this.addLabel()
        };
        a.Tick.prototype = {
            addLabel: function() {
                var a = this.axis,
                    m = a.options,
                    l = a.chart,
                    f = a.categories,
                    b = a.names,
                    k = this.pos,
                    z = m.labels,
                    p = a.tickPositions,
                    g = k === p[0],
                    e = k === p[p.length -
                        1],
                    b = f ? h(f[k], b[k], k) : k,
                    f = this.label,
                    p = p.info,
                    c;
                a.isDatetimeAxis && p && (c = m.dateTimeLabelFormats[p.higherRanks[k] || p.unitName]);
                this.isFirst = g;
                this.isLast = e;
                m = a.labelFormatter.call({
                    axis: a,
                    chart: l,
                    isFirst: g,
                    isLast: e,
                    dateTimeLabelFormat: c,
                    value: a.isLog ? D(a.lin2log(b)) : b
                });
                B(f) ? f && f.attr({
                    text: m
                }) : (this.labelLength = (this.label = f = B(m) && z.enabled ? l.renderer.text(m, 0, 0, z.useHTML).css(r(z.style)).add(a.labelGroup) : null) && f.getBBox().width, this.rotation = 0)
            },
            getLabelSize: function() {
                return this.label ? this.label.getBBox()[this.axis.horiz ?
                    "height" : "width"] : 0
            },
            handleOverflow: function(a) {
                var q = this.axis,
                    l = a.x,
                    f = q.chart.chartWidth,
                    b = q.chart.spacing,
                    k = h(q.labelLeft, Math.min(q.pos, b[3])),
                    b = h(q.labelRight, Math.max(q.pos + q.len, f - b[1])),
                    z = this.label,
                    p = this.rotation,
                    g = {
                        left: 0,
                        center: .5,
                        right: 1
                    }[q.labelAlign],
                    e = z.getBBox().width,
                    c = q.getSlotWidth(),
                    n = c,
                    u = 1,
                    d, C = {};
                if (p) 0 > p && l - g * e < k ? d = Math.round(l / Math.cos(p * m) - k) : 0 < p && l + g * e > b && (d = Math.round((f - l) / Math.cos(p * m)));
                else if (f = l + (1 - g) * e, l - g * e < k ? n = a.x + n * (1 - g) - k : f > b && (n = b - a.x + n * g, u = -1), n = Math.min(c,
                        n), n < c && "center" === q.labelAlign && (a.x += u * (c - n - g * (c - Math.min(e, n)))), e > n || q.autoRotation && (z.styles || {}).width) d = n;
                d && (C.width = d, (q.options.labels.style || {}).textOverflow || (C.textOverflow = "ellipsis"), z.css(C))
            },
            getPosition: function(a, h, l, f) {
                var b = this.axis,
                    k = b.chart,
                    z = f && k.oldChartHeight || k.chartHeight;
                return {
                    x: a ? b.translate(h + l, null, null, f) + b.transB : b.left + b.offset + (b.opposite ? (f && k.oldChartWidth || k.chartWidth) - b.right - b.left : 0),
                    y: a ? z - b.bottom + b.offset - (b.opposite ? b.height : 0) : z - b.translate(h + l, null,
                        null, f) - b.transB
                }
            },
            getLabelPosition: function(a, h, l, f, b, k, z, p) {
                var g = this.axis,
                    e = g.transA,
                    c = g.reversed,
                    n = g.staggerLines,
                    u = g.tickRotCorr || {
                        x: 0,
                        y: 0
                    },
                    d = b.y;
                B(d) || (d = 0 === g.side ? l.rotation ? -8 : -l.getBBox().height : 2 === g.side ? u.y + 8 : Math.cos(l.rotation * m) * (u.y - l.getBBox(!1, 0).height / 2));
                a = a + b.x + u.x - (k && f ? k * e * (c ? -1 : 1) : 0);
                h = h + d - (k && !f ? k * e * (c ? 1 : -1) : 0);
                n && (l = z / (p || 1) % n, g.opposite && (l = n - l - 1), h += g.labelOffset / n * l);
                return {
                    x: a,
                    y: Math.round(h)
                }
            },
            getMarkPath: function(a, h, l, f, b, k) {
                return k.crispLine(["M", a, h, "L", a + (b ?
                    0 : -l), h + (b ? l : 0)], f)
            },
            render: function(a, m, l) {
                var f = this.axis,
                    b = f.options,
                    k = f.chart.renderer,
                    z = f.horiz,
                    p = this.type,
                    g = this.label,
                    e = this.pos,
                    c = b.labels,
                    n = this.gridLine,
                    u = p ? p + "Tick" : "tick",
                    d = f.tickSize(u),
                    C = this.mark,
                    y = !C,
                    v = c.step,
                    E = {},
                    I = !0,
                    H = f.tickmarkOffset,
                    w = this.getPosition(z, e, H, m),
                    K = w.x,
                    w = w.y,
                    M = z && K === f.pos + f.len || !z && w === f.pos ? -1 : 1,
                    x = p ? p + "Grid" : "grid",
                    J = b[x + "LineWidth"],
                    O = b[x + "LineColor"],
                    Q = b[x + "LineDashStyle"],
                    x = h(b[u + "Width"], !p && f.isXAxis ? 1 : 0),
                    u = b[u + "Color"];
                l = h(l, 1);
                this.isActive = !0;
                n || (E.stroke =
                    O, E["stroke-width"] = J, Q && (E.dashstyle = Q), p || (E.zIndex = 1), m && (E.opacity = 0), this.gridLine = n = k.path().attr(E).addClass("highcharts-" + (p ? p + "-" : "") + "grid-line").add(f.gridGroup));
                if (!m && n && (e = f.getPlotLinePath(e + H, n.strokeWidth() * M, m, !0))) n[this.isNew ? "attr" : "animate"]({
                    d: e,
                    opacity: l
                });
                d && (f.opposite && (d[0] = -d[0]), y && (this.mark = C = k.path().addClass("highcharts-" + (p ? p + "-" : "") + "tick").add(f.axisGroup), C.attr({
                    stroke: u,
                    "stroke-width": x
                })), C[y ? "attr" : "animate"]({
                    d: this.getMarkPath(K, w, d[0], C.strokeWidth() *
                        M, z, k),
                    opacity: l
                }));
                g && G(K) && (g.xy = w = this.getLabelPosition(K, w, g, z, c, H, a, v), this.isFirst && !this.isLast && !h(b.showFirstLabel, 1) || this.isLast && !this.isFirst && !h(b.showLastLabel, 1) ? I = !1 : !z || f.isRadial || c.step || c.rotation || m || 0 === l || this.handleOverflow(w), v && a % v && (I = !1), I && G(w.y) ? (w.opacity = l, g[this.isNew ? "attr" : "animate"](w)) : g.attr("y", -9999), this.isNew = !1)
            },
            destroy: function() {
                F(this, this.axis)
            }
        }
    })(N);
    (function(a) {
        var D = a.addEvent,
            B = a.animObject,
            F = a.arrayMax,
            G = a.arrayMin,
            r = a.AxisPlotLineOrBandExtension,
            h = a.color,
            m = a.correctFloat,
            t = a.defaultOptions,
            q = a.defined,
            l = a.deg2rad,
            f = a.destroyObjectProperties,
            b = a.each,
            k = a.error,
            z = a.extend,
            p = a.fireEvent,
            g = a.format,
            e = a.getMagnitude,
            c = a.grep,
            n = a.inArray,
            u = a.isArray,
            d = a.isNumber,
            C = a.isString,
            y = a.merge,
            v = a.normalizeTickInterval,
            E = a.pick,
            I = a.PlotLineOrBand,
            H = a.removeEvent,
            w = a.splat,
            K = a.syncTimeout,
            M = a.Tick;
        a.Axis = function() {
            this.init.apply(this, arguments)
        };
        a.Axis.prototype = {
            defaultOptions: {
                dateTimeLabelFormats: {
                    millisecond: "%H:%M:%S.%L",
                    second: "%H:%M:%S",
                    minute: "%H:%M",
                    hour: "%H:%M",
                    day: "%e. %b",
                    week: "%e. %b",
                    month: "%b '%y",
                    year: "%Y"
                },
                endOnTick: !1,
                labels: {
                    enabled: !0,
                    style: {
                        color: "#ffffff",
                        cursor: "default",
                        fontSize: "11px"
                    },
                    x: 0
                },
                minPadding: .01,
                maxPadding: .01,
                minorTickLength: 2,
                minorTickPosition: "outside",
                startOfWeek: 1,
                startOnTick: !1,
                tickLength: 10,
                tickmarkPlacement: "between",
                tickPixelInterval: 100,
                tickPosition: "outside",
                title: {
                    align: "middle",
                    style: {
                        color: "#ffffff"
                    }
                },
                type: "linear",
                minorGridLineColor: "#f2f2f2",
                minorGridLineWidth: 1,
                minorTickColor: "#999999",
                lineColor: "#ccd6eb",
                lineWidth: 1,
                gridLineColor: "#e6e6e6",
                tickColor: "#ccd6eb"
            },
            defaultYAxisOptions: {
                endOnTick: !0,
                tickPixelInterval: 72,
                showLastLabel: !0,
                labels: {
                    x: -8
                },
                maxPadding: .05,
                minPadding: .05,
                startOnTick: !0,
                title: {
                    rotation: 270,
                    text: "Values"
                },
                stackLabels: {
                    enabled: !1,
                    formatter: function() {
                        return a.numberFormat(this.total, -1)
                    },
                    style: {
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: "#000000",
                        textOutline: "1px contrast"
                    }
                },
                gridLineWidth: 1,
                lineWidth: 0
            },
            defaultLeftAxisOptions: {
                labels: {
                    x: -15
                },
                title: {
                    rotation: 270
                }
            },
            defaultRightAxisOptions: {
                labels: {
                    x: 15
                },
                title: {
                    rotation: 90
                }
            },
            defaultBottomAxisOptions: {
                labels: {
                    autoRotation: [-45],
                    x: 0
                },
                title: {
                    rotation: 0
                }
            },
            defaultTopAxisOptions: {
                labels: {
                    autoRotation: [-45],
                    x: 0
                },
                title: {
                    rotation: 0
                }
            },
            init: function(a, b) {
                var c = b.isX;
                this.chart = a;
                this.horiz = a.inverted ? !c : c;
                this.isXAxis = c;
                this.coll = this.coll || (c ? "xAxis" : "yAxis");
                this.opposite = b.opposite;
                this.side = b.side || (this.horiz ? this.opposite ? 0 : 2 : this.opposite ? 1 : 3);
                this.setOptions(b);
                var d = this.options,
                    e = d.type;
                this.labelFormatter = d.labels.formatter || this.defaultLabelFormatter;
                this.userOptions = b;
                this.minPixelPadding = 0;
                this.reversed = d.reversed;
                this.visible = !1 !== d.visible;
                this.zoomEnabled = !1 !== d.zoomEnabled;
                this.hasNames = "category" === e || !0 === d.categories;
                this.categories = d.categories || this.hasNames;
                this.names = this.names || [];
                this.isLog = "logarithmic" === e;
                this.isDatetimeAxis = "datetime" === e;
                this.isLinked = q(d.linkedTo);
                this.ticks = {};
                this.labelEdge = [];
                this.minorTicks = {};
                this.plotLinesAndBands = [];
                this.alternateBands = {};
                this.len = 0;
                this.minRange = this.userMinRange = d.minRange || d.maxZoom;
                this.range = d.range;
                this.offset = d.offset || 0;
                this.stacks = {};
                this.oldStacks = {};
                this.stacksTouched = 0;
                this.min = this.max = null;
                this.crosshair = E(d.crosshair, w(a.options.tooltip.crosshairs)[c ? 0 : 1], !1);
                var x;
                b = this.options.events; - 1 === n(this, a.axes) && (c ? a.axes.splice(a.xAxis.length, 0, this) : a.axes.push(this), a[this.coll].push(this));
                this.series = this.series || [];
                a.inverted && c && void 0 === this.reversed && (this.reversed = !0);
                this.removePlotLine = this.removePlotBand = this.removePlotBandOrLine;
                for (x in b) D(this, x, b[x]);
                this.isLog && (this.val2lin = this.log2lin, this.lin2val = this.lin2log)
            },
            setOptions: function(a) {
                this.options = y(this.defaultOptions, "yAxis" === this.coll && this.defaultYAxisOptions, [this.defaultTopAxisOptions, this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side], y(t[this.coll], a))
            },
            defaultLabelFormatter: function() {
                var b = this.axis,
                    c = this.value,
                    d = b.categories,
                    e = this.dateTimeLabelFormat,
                    n = t.lang,
                    w = n.numericSymbols,
                    n = n.numericSymbolMagnitude || 1E3,
                    k = w && w.length,
                    u, f = b.options.labels.format,
                    b = b.isLog ? c : b.tickInterval;
                if (f) u = g(f, this);
                else if (d) u = c;
                else if (e) u = a.dateFormat(e, c);
                else if (k && 1E3 <= b)
                    for (; k-- && void 0 === u;) d = Math.pow(n, k + 1), b >= d && 0 === 10 * c % d && null !== w[k] && 0 !== c && (u = a.numberFormat(c / d, -1) + w[k]);
                void 0 === u && (u = 1E4 <= Math.abs(c) ? a.numberFormat(c, -1) : a.numberFormat(c, -1, void 0, ""));
                return u
            },
            getSeriesExtremes: function() {
                var a = this,
                    e = a.chart;
                a.hasVisibleSeries = !1;
                a.dataMin = a.dataMax = a.threshold = null;
                a.softThreshold = !a.isXAxis;
                a.buildStacks && a.buildStacks();
                b(a.series, function(b) {
                    if (b.visible ||
                        !e.options.chart.ignoreHiddenSeries) {
                        var x = b.options,
                            g = x.threshold,
                            J;
                        a.hasVisibleSeries = !0;
                        a.isLog && 0 >= g && (g = null);
                        if (a.isXAxis) x = b.xData, x.length && (b = G(x), d(b) || b instanceof Date || (x = c(x, function(a) {
                            return d(a)
                        }), b = G(x)), a.dataMin = Math.min(E(a.dataMin, x[0]), b), a.dataMax = Math.max(E(a.dataMax, x[0]), F(x)));
                        else if (b.getExtremes(), J = b.dataMax, b = b.dataMin, q(b) && q(J) && (a.dataMin = Math.min(E(a.dataMin, b), b), a.dataMax = Math.max(E(a.dataMax, J), J)), q(g) && (a.threshold = g), !x.softThreshold || a.isLog) a.softThreshold = !1
                    }
                })
            },
            translate: function(a, b, c, e, g, n) {
                var x = this.linkedParent || this,
                    J = 1,
                    w = 0,
                    k = e ? x.oldTransA : x.transA;
                e = e ? x.oldMin : x.min;
                var u = x.minPixelPadding;
                g = (x.isOrdinal || x.isBroken || x.isLog && g) && x.lin2val;
                k || (k = x.transA);
                c && (J *= -1, w = x.len);
                x.reversed && (J *= -1, w -= J * (x.sector || x.len));
                b ? (a = (a * J + w - u) / k + e, g && (a = x.lin2val(a))) : (g && (a = x.val2lin(a)), a = J * (a - e) * k + w + J * u + (d(n) ? k * n : 0));
                return a
            },
            toPixels: function(a, b) {
                return this.translate(a, !1, !this.horiz, null, !0) + (b ? 0 : this.pos)
            },
            toValue: function(a, b) {
                return this.translate(a -
                    (b ? 0 : this.pos), !0, !this.horiz, null, !0)
            },
            getPlotLinePath: function(a, b, c, e, g) {
                var x = this.chart,
                    J = this.left,
                    n = this.top,
                    w, k, u = c && x.oldChartHeight || x.chartHeight,
                    A = c && x.oldChartWidth || x.chartWidth,
                    f;
                w = this.transB;
                var p = function(a, b, c) {
                    if (a < b || a > c) e ? a = Math.min(Math.max(b, a), c) : f = !0;
                    return a
                };
                g = E(g, this.translate(a, null, null, c));
                a = c = Math.round(g + w);
                w = k = Math.round(u - g - w);
                d(g) ? this.horiz ? (w = n, k = u - this.bottom, a = c = p(a, J, J + this.width)) : (a = J, c = A - this.right, w = k = p(w, n, n + this.height)) : f = !0;
                return f && !e ? null : x.renderer.crispLine(["M",
                    a, w, "L", c, k
                ], b || 1)
            },
            getLinearTickPositions: function(a, b, c) {
                var e, x = m(Math.floor(b / a) * a),
                    g = m(Math.ceil(c / a) * a),
                    J = [];
                if (b === c && d(b)) return [b];
                for (b = x; b <= g;) {
                    J.push(b);
                    b = m(b + a);
                    if (b === e) break;
                    e = b
                }
                return J
            },
            getMinorTickPositions: function() {
                var a = this.options,
                    b = this.tickPositions,
                    c = this.minorTickInterval,
                    d = [],
                    e, g = this.pointRangePadding || 0;
                e = this.min - g;
                var g = this.max + g,
                    n = g - e;
                if (n && n / c < this.len / 3)
                    if (this.isLog)
                        for (g = b.length, e = 1; e < g; e++) d = d.concat(this.getLogTickPositions(c, b[e - 1], b[e], !0));
                    else if (this.isDatetimeAxis &&
                    "auto" === a.minorTickInterval) d = d.concat(this.getTimeTicks(this.normalizeTimeTickInterval(c), e, g, a.startOfWeek));
                else
                    for (b = e + (b[0] - e) % c; b <= g && b !== d[0]; b += c) d.push(b);
                0 !== d.length && this.trimTicks(d, a.startOnTick, a.endOnTick);
                return d
            },
            adjustForMinRange: function() {
                var a = this.options,
                    c = this.min,
                    d = this.max,
                    e, g = this.dataMax - this.dataMin >= this.minRange,
                    n, w, k, u, f, p;
                this.isXAxis && void 0 === this.minRange && !this.isLog && (q(a.min) || q(a.max) ? this.minRange = null : (b(this.series, function(a) {
                    u = a.xData;
                    for (w = f = a.xIncrement ?
                        1 : u.length - 1; 0 < w; w--)
                        if (k = u[w] - u[w - 1], void 0 === n || k < n) n = k
                }), this.minRange = Math.min(5 * n, this.dataMax - this.dataMin)));
                d - c < this.minRange && (p = this.minRange, e = (p - d + c) / 2, e = [c - e, E(a.min, c - e)], g && (e[2] = this.isLog ? this.log2lin(this.dataMin) : this.dataMin), c = F(e), d = [c + p, E(a.max, c + p)], g && (d[2] = this.isLog ? this.log2lin(this.dataMax) : this.dataMax), d = G(d), d - c < p && (e[0] = d - p, e[1] = E(a.min, d - p), c = F(e)));
                this.min = c;
                this.max = d
            },
            getClosest: function() {
                var a;
                this.categories ? a = 1 : b(this.series, function(b) {
                    var c = b.closestPointRange,
                        d = b.visible || !b.chart.options.chart.ignoreHiddenSeries;
                    !b.noSharedTooltip && q(c) && d && (a = q(a) ? Math.min(a, c) : c)
                });
                return a
            },
            nameToX: function(a) {
                var b = u(this.categories),
                    c = b ? this.categories : this.names,
                    d = a.options.x,
                    e;
                a.series.requireSorting = !1;
                q(d) || (d = !1 === this.options.uniqueNames ? a.series.autoIncrement() : n(a.name, c)); - 1 === d ? b || (e = c.length) : e = d;
                this.names[e] = a.name;
                return e
            },
            updateNames: function() {
                var a = this;
                0 < this.names.length && (this.names.length = 0, this.minRange = void 0, b(this.series || [], function(c) {
                    c.xIncrement =
                        null;
                    if (!c.points || c.isDirtyData) c.processData(), c.generatePoints();
                    b(c.points, function(b, d) {
                        var e;
                        b.options && void 0 === b.options.x && (e = a.nameToX(b), e !== b.x && (b.x = e, c.xData[d] = e))
                    })
                }))
            },
            setAxisTranslation: function(a) {
                var c = this,
                    d = c.max - c.min,
                    e = c.axisPointRange || 0,
                    x, g = 0,
                    n = 0,
                    w = c.linkedParent,
                    k = !!c.categories,
                    u = c.transA,
                    f = c.isXAxis;
                if (f || k || e) w ? (g = w.minPointOffset, n = w.pointRangePadding) : (x = c.getClosest(), b(c.series, function(a) {
                    var b = k ? 1 : f ? E(a.options.pointRange, x, 0) : c.axisPointRange || 0;
                    a = a.options.pointPlacement;
                    e = Math.max(e, b);
                    c.single || (g = Math.max(g, C(a) ? 0 : b / 2), n = Math.max(n, "on" === a ? 0 : b))
                })), w = c.ordinalSlope && x ? c.ordinalSlope / x : 1, c.minPointOffset = g *= w, c.pointRangePadding = n *= w, c.pointRange = Math.min(e, d), f && (c.closestPointRange = x);
                a && (c.oldTransA = u);
                c.translationSlope = c.transA = u = c.len / (d + n || 1);
                c.transB = c.horiz ? c.left : c.bottom;
                c.minPixelPadding = u * g
            },
            minFromRange: function() {
                return this.max - this.range
            },
            setTickInterval: function(a) {
                var c = this,
                    x = c.chart,
                    g = c.options,
                    n = c.isLog,
                    w = c.log2lin,
                    u = c.isDatetimeAxis,
                    f = c.isXAxis,
                    H = c.isLinked,
                    y = g.maxPadding,
                    C = g.minPadding,
                    K = g.tickInterval,
                    z = g.tickPixelInterval,
                    l = c.categories,
                    h = c.threshold,
                    I = c.softThreshold,
                    M, t, r, B;
                u || l || H || this.getTickAmount();
                r = E(c.userMin, g.min);
                B = E(c.userMax, g.max);
                H ? (c.linkedParent = x[c.coll][g.linkedTo], x = c.linkedParent.getExtremes(), c.min = E(x.min, x.dataMin), c.max = E(x.max, x.dataMax), g.type !== c.linkedParent.options.type && k(11, 1)) : (!I && q(h) && (c.dataMin >= h ? (M = h, C = 0) : c.dataMax <= h && (t = h, y = 0)), c.min = E(r, M, c.dataMin), c.max = E(B, t, c.dataMax));
                n && (!a && 0 >= Math.min(c.min,
                    E(c.dataMin, c.min)) && k(10, 1), c.min = m(w(c.min), 15), c.max = m(w(c.max), 15));
                c.range && q(c.max) && (c.userMin = c.min = r = Math.max(c.min, c.minFromRange()), c.userMax = B = c.max, c.range = null);
                p(c, "foundExtremes");
                c.beforePadding && c.beforePadding();
                c.adjustForMinRange();
                !(l || c.axisPointRange || c.usePercentage || H) && q(c.min) && q(c.max) && (w = c.max - c.min) && (!q(r) && C && (c.min -= w * C), !q(B) && y && (c.max += w * y));
                d(g.floor) ? c.min = Math.max(c.min, g.floor) : d(g.softMin) && (c.min = Math.min(c.min, g.softMin));
                d(g.ceiling) ? c.max = Math.min(c.max,
                    g.ceiling) : d(g.softMax) && (c.max = Math.max(c.max, g.softMax));
                I && q(c.dataMin) && (h = h || 0, !q(r) && c.min < h && c.dataMin >= h ? c.min = h : !q(B) && c.max > h && c.dataMax <= h && (c.max = h));
                c.tickInterval = c.min === c.max || void 0 === c.min || void 0 === c.max ? 1 : H && !K && z === c.linkedParent.options.tickPixelInterval ? K = c.linkedParent.tickInterval : E(K, this.tickAmount ? (c.max - c.min) / Math.max(this.tickAmount - 1, 1) : void 0, l ? 1 : (c.max - c.min) * z / Math.max(c.len, z));
                f && !a && b(c.series, function(a) {
                    a.processData(c.min !== c.oldMin || c.max !== c.oldMax)
                });
                c.setAxisTranslation(!0);
                c.beforeSetTickPositions && c.beforeSetTickPositions();
                c.postProcessTickInterval && (c.tickInterval = c.postProcessTickInterval(c.tickInterval));
                c.pointRange && !K && (c.tickInterval = Math.max(c.pointRange, c.tickInterval));
                a = E(g.minTickInterval, c.isDatetimeAxis && c.closestPointRange);
                !K && c.tickInterval < a && (c.tickInterval = a);
                u || n || K || (c.tickInterval = v(c.tickInterval, null, e(c.tickInterval), E(g.allowDecimals, !(.5 < c.tickInterval && 5 > c.tickInterval && 1E3 < c.max && 9999 > c.max)), !!this.tickAmount));
                this.tickAmount || (c.tickInterval =
                    c.unsquish());
                this.setTickPositions()
            },
            setTickPositions: function() {
                var a = this.options,
                    b, c = a.tickPositions,
                    d = a.tickPositioner,
                    e = a.startOnTick,
                    g = a.endOnTick,
                    n;
                this.tickmarkOffset = this.categories && "between" === a.tickmarkPlacement && 1 === this.tickInterval ? .5 : 0;
                this.minorTickInterval = "auto" === a.minorTickInterval && this.tickInterval ? this.tickInterval / 5 : a.minorTickInterval;
                this.tickPositions = b = c && c.slice();
                !b && (b = this.isDatetimeAxis ? this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval, a.units),
                    this.min, this.max, a.startOfWeek, this.ordinalPositions, this.closestPointRange, !0) : this.isLog ? this.getLogTickPositions(this.tickInterval, this.min, this.max) : this.getLinearTickPositions(this.tickInterval, this.min, this.max), b.length > this.len && (b = [b[0], b.pop()]), this.tickPositions = b, d && (d = d.apply(this, [this.min, this.max]))) && (this.tickPositions = b = d);
                this.isLinked || (this.trimTicks(b, e, g), this.min === this.max && q(this.min) && !this.tickAmount && (n = !0, this.min -= .5, this.max += .5), this.single = n, c || d || this.adjustTickAmount())
            },
            trimTicks: function(a, b, c) {
                var d = a[0],
                    e = a[a.length - 1],
                    g = this.minPointOffset || 0;
                if (b) this.min = d;
                else
                    for (; this.min - g > a[0];) a.shift();
                if (c) this.max = e;
                else
                    for (; this.max + g < a[a.length - 1];) a.pop();
                0 === a.length && q(d) && a.push((e + d) / 2)
            },
            alignToOthers: function() {
                var a = {},
                    c, d = this.options;
                !1 !== this.chart.options.chart.alignTicks && !1 !== d.alignTicks && b(this.chart[this.coll], function(b) {
                    var d = b.options,
                        d = [b.horiz ? d.left : d.top, d.width, d.height, d.pane].join();
                    b.series.length && (a[d] ? c = !0 : a[d] = 1)
                });
                return c
            },
            getTickAmount: function() {
                var a =
                    this.options,
                    b = a.tickAmount,
                    c = a.tickPixelInterval;
                !q(a.tickInterval) && this.len < c && !this.isRadial && !this.isLog && a.startOnTick && a.endOnTick && (b = 2);
                !b && this.alignToOthers() && (b = Math.ceil(this.len / c) + 1);
                4 > b && (this.finalTickAmt = b, b = 5);
                this.tickAmount = b
            },
            adjustTickAmount: function() {
                var a = this.tickInterval,
                    b = this.tickPositions,
                    c = this.tickAmount,
                    d = this.finalTickAmt,
                    e = b && b.length;
                if (e < c) {
                    for (; b.length < c;) b.push(m(b[b.length - 1] + a));
                    this.transA *= (e - 1) / (c - 1);
                    this.max = b[b.length - 1]
                } else e > c && (this.tickInterval *=
                    2, this.setTickPositions());
                if (q(d)) {
                    for (a = c = b.length; a--;)(3 === d && 1 === a % 2 || 2 >= d && 0 < a && a < c - 1) && b.splice(a, 1);
                    this.finalTickAmt = void 0
                }
            },
            setScale: function() {
                var a, c;
                this.oldMin = this.min;
                this.oldMax = this.max;
                this.oldAxisLength = this.len;
                this.setAxisSize();
                c = this.len !== this.oldAxisLength;
                b(this.series, function(b) {
                    if (b.isDirtyData || b.isDirty || b.xAxis.isDirty) a = !0
                });
                c || a || this.isLinked || this.forceRedraw || this.userMin !== this.oldUserMin || this.userMax !== this.oldUserMax || this.alignToOthers() ? (this.resetStacks &&
                    this.resetStacks(), this.forceRedraw = !1, this.getSeriesExtremes(), this.setTickInterval(), this.oldUserMin = this.userMin, this.oldUserMax = this.userMax, this.isDirty || (this.isDirty = c || this.min !== this.oldMin || this.max !== this.oldMax)) : this.cleanStacks && this.cleanStacks()
            },
            setExtremes: function(a, c, d, e, g) {
                var x = this,
                    n = x.chart;
                d = E(d, !0);
                b(x.series, function(a) {
                    delete a.kdTree
                });
                g = z(g, {
                    min: a,
                    max: c
                });
                p(x, "setExtremes", g, function() {
                    x.userMin = a;
                    x.userMax = c;
                    x.eventArgs = g;
                    d && n.redraw(e)
                })
            },
            zoom: function(a, b) {
                var c = this.dataMin,
                    d = this.dataMax,
                    e = this.options,
                    g = Math.min(c, E(e.min, c)),
                    e = Math.max(d, E(e.max, d));
                if (a !== this.min || b !== this.max) this.allowZoomOutside || (q(c) && a <= g && (a = g), q(d) && b >= e && (b = e)), this.displayBtn = void 0 !== a || void 0 !== b, this.setExtremes(a, b, !1, void 0, {
                    trigger: "zoom"
                });
                return !0
            },
            setAxisSize: function() {
                var a = this.chart,
                    b = this.options,
                    c = b.offsetLeft || 0,
                    d = this.horiz,
                    e = E(b.width, a.plotWidth - c + (b.offsetRight || 0)),
                    g = E(b.height, a.plotHeight),
                    n = E(b.top, a.plotTop),
                    b = E(b.left, a.plotLeft + c),
                    c = /%$/;
                c.test(g) && (g = Math.round(parseFloat(g) /
                    100 * a.plotHeight));
                c.test(n) && (n = Math.round(parseFloat(n) / 100 * a.plotHeight + a.plotTop));
                this.left = b;
                this.top = n;
                this.width = e;
                this.height = g;
                this.bottom = a.chartHeight - g - n;
                this.right = a.chartWidth - e - b;
                this.len = Math.max(d ? e : g, 0);
                this.pos = d ? b : n
            },
            getExtremes: function() {
                var a = this.isLog,
                    b = this.lin2log;
                return {
                    min: a ? m(b(this.min)) : this.min,
                    max: a ? m(b(this.max)) : this.max,
                    dataMin: this.dataMin,
                    dataMax: this.dataMax,
                    userMin: this.userMin,
                    userMax: this.userMax
                }
            },
            getThreshold: function(a) {
                var b = this.isLog,
                    c = this.lin2log,
                    d = b ? c(this.min) : this.min,
                    b = b ? c(this.max) : this.max;
                null === a ? a = d : d > a ? a = d : b < a && (a = b);
                return this.translate(a, 0, 1, 0, 1)
            },
            autoLabelAlign: function(a) {
                a = (E(a, 0) - 90 * this.side + 720) % 360;
                return 15 < a && 165 > a ? "right" : 195 < a && 345 > a ? "left" : "center"
            },
            tickSize: function(a) {
                var b = this.options,
                    c = b[a + "Length"],
                    d = E(b[a + "Width"], "tick" === a && this.isXAxis ? 1 : 0);
                if (d && c) return "inside" === b[a + "Position"] && (c = -c), [c, d]
            },
            labelMetrics: function() {
                return this.chart.renderer.fontMetrics(this.options.labels.style && this.options.labels.style.fontSize,
                    this.ticks[0] && this.ticks[0].label)
            },
            unsquish: function() {
                var a = this.options.labels,
                    c = this.horiz,
                    d = this.tickInterval,
                    e = d,
                    g = this.len / (((this.categories ? 1 : 0) + this.max - this.min) / d),
                    n, w = a.rotation,
                    k = this.labelMetrics(),
                    u, f = Number.MAX_VALUE,
                    p, H = function(a) {
                        a /= g || 1;
                        a = 1 < a ? Math.ceil(a) : 1;
                        return a * d
                    };
                c ? (p = !a.staggerLines && !a.step && (q(w) ? [w] : g < E(a.autoRotationLimit, 80) && a.autoRotation)) && b(p, function(a) {
                        var b;
                        if (a === w || a && -90 <= a && 90 >= a) u = H(Math.abs(k.h / Math.sin(l * a))), b = u + Math.abs(a / 360), b < f && (f = b, n = a, e = u)
                    }) :
                    a.step || (e = H(k.h));
                this.autoRotation = p;
                this.labelRotation = E(n, w);
                return e
            },
            getSlotWidth: function() {
                var a = this.chart,
                    b = this.horiz,
                    c = this.options.labels,
                    d = Math.max(this.tickPositions.length - (this.categories ? 0 : 1), 1),
                    e = a.margin[3];
                return b && 2 > (c.step || 0) && !c.rotation && (this.staggerLines || 1) * a.plotWidth / d || !b && (e && e - a.spacing[3] || .33 * a.chartWidth)
            },
            renderUnsquish: function() {
                var a = this.chart,
                    c = a.renderer,
                    d = this.tickPositions,
                    e = this.ticks,
                    g = this.options.labels,
                    n = this.horiz,
                    w = this.getSlotWidth(),
                    k = Math.max(1,
                        Math.round(w - 2 * (g.padding || 5))),
                    u = {},
                    f = this.labelMetrics(),
                    p = g.style && g.style.textOverflow,
                    H, K = 0,
                    v, z;
                C(g.rotation) || (u.rotation = g.rotation || 0);
                b(d, function(a) {
                    (a = e[a]) && a.labelLength > K && (K = a.labelLength)
                });
                this.maxLabelLength = K;
                if (this.autoRotation) K > k && K > f.h ? u.rotation = this.labelRotation : this.labelRotation = 0;
                else if (w && (H = {
                        width: k + "px"
                    }, !p))
                    for (H.textOverflow = "clip", v = d.length; !n && v--;)
                        if (z = d[v], k = e[z].label) k.styles && "ellipsis" === k.styles.textOverflow ? k.css({
                                textOverflow: "clip"
                            }) : e[z].labelLength >
                            w && k.css({
                                width: w + "px"
                            }), k.getBBox().height > this.len / d.length - (f.h - f.f) && (k.specCss = {
                                textOverflow: "ellipsis"
                            });
                u.rotation && (H = {
                    width: (K > .5 * a.chartHeight ? .33 * a.chartHeight : a.chartHeight) + "px"
                }, p || (H.textOverflow = "ellipsis"));
                if (this.labelAlign = g.align || this.autoLabelAlign(this.labelRotation)) u.align = this.labelAlign;
                b(d, function(a) {
                    var b = (a = e[a]) && a.label;
                    b && (b.attr(u), H && b.css(y(H, b.specCss)), delete b.specCss, a.rotation = u.rotation)
                });
                this.tickRotCorr = c.rotCorr(f.b, this.labelRotation || 0, 0 !== this.side)
            },
            hasData: function() {
                return this.hasVisibleSeries || q(this.min) && q(this.max) && !!this.tickPositions
            },
            getOffset: function() {
                var a = this,
                    c = a.chart,
                    d = c.renderer,
                    e = a.options,
                    g = a.tickPositions,
                    n = a.ticks,
                    w = a.horiz,
                    k = a.side,
                    u = c.inverted ? [1, 0, 3, 2][k] : k,
                    f, p, H = 0,
                    y, K = 0,
                    v = e.title,
                    C = e.labels,
                    z = 0,
                    l = a.opposite,
                    h = c.axisOffset,
                    c = c.clipOffset,
                    I = [-1, 1, 1, -1][k],
                    m, t = e.className,
                    r = a.axisParent,
                    B = this.tickSize("tick");
                f = a.hasData();
                a.showAxis = p = f || E(e.showEmpty, !0);
                a.staggerLines = a.horiz && C.staggerLines;
                a.axisGroup || (a.gridGroup =
                    d.g("grid").attr({
                        zIndex: e.gridZIndex || 1
                    }).addClass("highcharts-" + this.coll.toLowerCase() + "-grid " + (t || "")).add(r), a.axisGroup = d.g("axis").attr({
                        zIndex: e.zIndex || 2
                    }).addClass("highcharts-" + this.coll.toLowerCase() + " " + (t || "")).add(r), a.labelGroup = d.g("axis-labels").attr({
                        zIndex: C.zIndex || 7
                    }).addClass("highcharts-" + a.coll.toLowerCase() + "-labels " + (t || "")).add(r));
                if (f || a.isLinked) b(g, function(b) {
                        n[b] ? n[b].addLabel() : n[b] = new M(a, b)
                    }), a.renderUnsquish(), !1 === C.reserveSpace || 0 !== k && 2 !== k && {
                        1: "left",
                        3: "right"
                    }[k] !==
                    a.labelAlign && "center" !== a.labelAlign || b(g, function(a) {
                        z = Math.max(n[a].getLabelSize(), z)
                    }), a.staggerLines && (z *= a.staggerLines, a.labelOffset = z * (a.opposite ? -1 : 1));
                else
                    for (m in n) n[m].destroy(), delete n[m];
                v && v.text && !1 !== v.enabled && (a.axisTitle || ((m = v.textAlign) || (m = (w ? {
                        low: "left",
                        middle: "center",
                        high: "right"
                    } : {
                        low: l ? "right" : "left",
                        middle: "center",
                        high: l ? "left" : "right"
                    })[v.align]), a.axisTitle = d.text(v.text, 0, 0, v.useHTML).attr({
                        zIndex: 7,
                        rotation: v.rotation || 0,
                        align: m
                    }).addClass("highcharts-axis-title").css(v.style).add(a.axisGroup),
                    a.axisTitle.isNew = !0), p && (H = a.axisTitle.getBBox()[w ? "height" : "width"], y = v.offset, K = q(y) ? 0 : E(v.margin, w ? 5 : 10)), a.axisTitle[p ? "show" : "hide"](!0));
                a.renderLine();
                a.offset = I * E(e.offset, h[k]);
                a.tickRotCorr = a.tickRotCorr || {
                    x: 0,
                    y: 0
                };
                d = 0 === k ? -a.labelMetrics().h : 2 === k ? a.tickRotCorr.y : 0;
                K = Math.abs(z) + K;
                z && (K = K - d + I * (w ? E(C.y, a.tickRotCorr.y + 8 * I) : C.x));
                a.axisTitleMargin = E(y, K);
                h[k] = Math.max(h[k], a.axisTitleMargin + H + I * a.offset, K, f && g.length && B ? B[0] : 0);
                e = e.offset ? 0 : 2 * Math.floor(a.axisLine.strokeWidth() / 2);
                c[u] =
                    Math.max(c[u], e)
            },
            getLinePath: function(a) {
                var b = this.chart,
                    c = this.opposite,
                    d = this.offset,
                    e = this.horiz,
                    g = this.left + (c ? this.width : 0) + d,
                    d = b.chartHeight - this.bottom - (c ? this.height : 0) + d;
                c && (a *= -1);
                return b.renderer.crispLine(["M", e ? this.left : g, e ? d : this.top, "L", e ? b.chartWidth - this.right : g, e ? d : b.chartHeight - this.bottom], a)
            },
            renderLine: function() {
                this.axisLine || (this.axisLine = this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup), this.axisLine.attr({
                    stroke: this.options.lineColor,
                    "stroke-width": this.options.lineWidth,
                    zIndex: 7
                }))
            },
            getTitlePosition: function() {
                var a = this.horiz,
                    b = this.left,
                    c = this.top,
                    d = this.len,
                    e = this.options.title,
                    g = a ? b : c,
                    n = this.opposite,
                    w = this.offset,
                    k = e.x || 0,
                    u = e.y || 0,
                    f = this.chart.renderer.fontMetrics(e.style && e.style.fontSize, this.axisTitle).f,
                    d = {
                        low: g + (a ? 0 : d),
                        middle: g + d / 2,
                        high: g + (a ? d : 0)
                    }[e.align],
                    b = (a ? c + this.height : b) + (a ? 1 : -1) * (n ? -1 : 1) * this.axisTitleMargin + (2 === this.side ? f : 0);
                return {
                    x: a ? d + k : b + (n ? this.width : 0) + w + k,
                    y: a ? b + u - (n ? this.height : 0) + w : d + u
                }
            },
            render: function() {
                var a =
                    this,
                    c = a.chart,
                    e = c.renderer,
                    g = a.options,
                    n = a.isLog,
                    w = a.lin2log,
                    k = a.isLinked,
                    u = a.tickPositions,
                    f = a.axisTitle,
                    p = a.ticks,
                    H = a.minorTicks,
                    y = a.alternateBands,
                    v = g.stackLabels,
                    C = g.alternateGridColor,
                    z = a.tickmarkOffset,
                    E = a.axisLine,
                    l = c.hasRendered && d(a.oldMin),
                    h = a.showAxis,
                    m = B(e.globalAnimation),
                    q, t;
                a.labelEdge.length = 0;
                a.overlap = !1;
                b([p, H, y], function(a) {
                    for (var b in a) a[b].isActive = !1
                });
                if (a.hasData() || k) a.minorTickInterval && !a.categories && b(a.getMinorTickPositions(), function(b) {
                        H[b] || (H[b] = new M(a, b, "minor"));
                        l && H[b].isNew && H[b].render(null, !0);
                        H[b].render(null, !1, 1)
                    }), u.length && (b(u, function(b, c) {
                        if (!k || b >= a.min && b <= a.max) p[b] || (p[b] = new M(a, b)), l && p[b].isNew && p[b].render(c, !0, .1), p[b].render(c)
                    }), z && (0 === a.min || a.single) && (p[-1] || (p[-1] = new M(a, -1, null, !0)), p[-1].render(-1))), C && b(u, function(b, d) {
                        t = void 0 !== u[d + 1] ? u[d + 1] + z : a.max - z;
                        0 === d % 2 && b < a.max && t <= a.max + (c.polar ? -z : z) && (y[b] || (y[b] = new I(a)), q = b + z, y[b].options = {
                            from: n ? w(q) : q,
                            to: n ? w(t) : t,
                            color: C
                        }, y[b].render(), y[b].isActive = !0)
                    }), a._addedPlotLB ||
                    (b((g.plotLines || []).concat(g.plotBands || []), function(b) {
                        a.addPlotBandOrLine(b)
                    }), a._addedPlotLB = !0);
                b([p, H, y], function(a) {
                    var b, d, e = [],
                        g = m.duration;
                    for (b in a) a[b].isActive || (a[b].render(b, !1, 0), a[b].isActive = !1, e.push(b));
                    K(function() {
                        for (d = e.length; d--;) a[e[d]] && !a[e[d]].isActive && (a[e[d]].destroy(), delete a[e[d]])
                    }, a !== y && c.hasRendered && g ? g : 0)
                });
                E && (E[E.isPlaced ? "animate" : "attr"]({
                    d: this.getLinePath(E.strokeWidth())
                }), E.isPlaced = !0, E[h ? "show" : "hide"](!0));
                f && h && (f[f.isNew ? "attr" : "animate"](a.getTitlePosition()),
                    f.isNew = !1);
                v && v.enabled && a.renderStackTotals();
                a.isDirty = !1
            },
            redraw: function() {
                this.visible && (this.render(), b(this.plotLinesAndBands, function(a) {
                    a.render()
                }));
                b(this.series, function(a) {
                    a.isDirty = !0
                })
            },
            keepProps: "extKey hcEvents names series userMax userMin".split(" "),
            destroy: function(a) {
                var c = this,
                    d = c.stacks,
                    e, g = c.plotLinesAndBands,
                    w;
                a || H(c);
                for (e in d) f(d[e]), d[e] = null;
                b([c.ticks, c.minorTicks, c.alternateBands], function(a) {
                    f(a)
                });
                if (g)
                    for (a = g.length; a--;) g[a].destroy();
                b("stackTotalGroup axisLine axisTitle axisGroup gridGroup labelGroup cross".split(" "),
                    function(a) {
                        c[a] && (c[a] = c[a].destroy())
                    });
                for (w in c) c.hasOwnProperty(w) && -1 === n(w, c.keepProps) && delete c[w]
            },
            drawCrosshair: function(a, b) {
                var c, d = this.crosshair,
                    e = E(d.snap, !0),
                    g, n = this.cross;
                a || (a = this.cross && this.cross.e);
                this.crosshair && !1 !== (q(b) || !e) ? (e ? q(b) && (g = this.isXAxis ? b.plotX : this.len - b.plotY) : g = a && (this.horiz ? a.chartX - this.pos : this.len - a.chartY + this.pos), q(g) && (c = this.getPlotLinePath(b && (this.isXAxis ? b.x : E(b.stackY, b.y)), null, null, null, g) || null), q(c) ? (b = this.categories && !this.isRadial,
                    n || (this.cross = n = this.chart.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-" + (b ? "category " : "thin ") + d.className).attr({
                        zIndex: E(d.zIndex, 2)
                    }).add(), n.attr({
                        stroke: d.color || (b ? h("#ccd6eb").setOpacity(.25).get() : "#cccccc"),
                        "stroke-width": E(d.width, 1)
                    }), d.dashStyle && n.attr({
                        dashstyle: d.dashStyle
                    })), n.show().attr({
                        d: c
                    }), b && !d.width && n.attr({
                        "stroke-width": this.transA
                    }), this.cross.e = a) : this.hideCrosshair()) : this.hideCrosshair()
            },
            hideCrosshair: function() {
                this.cross && this.cross.hide()
            }
        };
        z(a.Axis.prototype, r)
    })(N);
    (function(a) {
        var D = a.Axis,
            B = a.Date,
            F = a.dateFormat,
            G = a.defaultOptions,
            r = a.defined,
            h = a.each,
            m = a.extend,
            t = a.getMagnitude,
            q = a.getTZOffset,
            l = a.normalizeTickInterval,
            f = a.pick,
            b = a.timeUnits;
        D.prototype.getTimeTicks = function(a, z, p, g) {
            var e = [],
                c = {},
                n = G.global.useUTC,
                k, d = new B(z - q(z)),
                C = B.hcMakeTime,
                y = a.unitRange,
                v = a.count,
                E;
            if (r(z)) {
                d[B.hcSetMilliseconds](y >= b.second ? 0 : v * Math.floor(d.getMilliseconds() / v));
                if (y >= b.second) d[B.hcSetSeconds](y >= b.minute ? 0 : v * Math.floor(d.getSeconds() /
                    v));
                if (y >= b.minute) d[B.hcSetMinutes](y >= b.hour ? 0 : v * Math.floor(d[B.hcGetMinutes]() / v));
                if (y >= b.hour) d[B.hcSetHours](y >= b.day ? 0 : v * Math.floor(d[B.hcGetHours]() / v));
                if (y >= b.day) d[B.hcSetDate](y >= b.month ? 1 : v * Math.floor(d[B.hcGetDate]() / v));
                y >= b.month && (d[B.hcSetMonth](y >= b.year ? 0 : v * Math.floor(d[B.hcGetMonth]() / v)), k = d[B.hcGetFullYear]());
                if (y >= b.year) d[B.hcSetFullYear](k - k % v);
                if (y === b.week) d[B.hcSetDate](d[B.hcGetDate]() - d[B.hcGetDay]() + f(g, 1));
                k = d[B.hcGetFullYear]();
                g = d[B.hcGetMonth]();
                var l = d[B.hcGetDate](),
                    H = d[B.hcGetHours]();
                if (B.hcTimezoneOffset || B.hcGetTimezoneOffset) E = (!n || !!B.hcGetTimezoneOffset) && (p - z > 4 * b.month || q(z) !== q(p)), d = d.getTime(), d = new B(d + q(d));
                n = d.getTime();
                for (z = 1; n < p;) e.push(n), n = y === b.year ? C(k + z * v, 0) : y === b.month ? C(k, g + z * v) : !E || y !== b.day && y !== b.week ? E && y === b.hour ? C(k, g, l, H + z * v) : n + y * v : C(k, g, l + z * v * (y === b.day ? 1 : 7)), z++;
                e.push(n);
                y <= b.hour && h(e, function(a) {
                    "000000000" === F("%H%M%S%L", a) && (c[a] = "day")
                })
            }
            e.info = m(a, {
                higherRanks: c,
                totalRange: y * v
            });
            return e
        };
        D.prototype.normalizeTimeTickInterval =
            function(a, f) {
                var k = f || [
                    ["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]],
                    ["second", [1, 2, 5, 10, 15, 30]],
                    ["minute", [1, 2, 5, 10, 15, 30]],
                    ["hour", [1, 2, 3, 4, 6, 8, 12]],
                    ["day", [1, 2]],
                    ["week", [1, 2]],
                    ["month", [1, 2, 3, 4, 6]],
                    ["year", null]
                ];
                f = k[k.length - 1];
                var g = b[f[0]],
                    e = f[1],
                    c;
                for (c = 0; c < k.length && !(f = k[c], g = b[f[0]], e = f[1], k[c + 1] && a <= (g * e[e.length - 1] + b[k[c + 1][0]]) / 2); c++);
                g === b.year && a < 5 * g && (e = [1, 2, 5]);
                a = l(a / g, e, "year" === f[0] ? Math.max(t(a / g), 1) : 1);
                return {
                    unitRange: g,
                    count: a,
                    unitName: f[0]
                }
            }
    })(N);
    (function(a) {
        var D = a.Axis,
            B = a.getMagnitude,
            F = a.map,
            G = a.normalizeTickInterval,
            r = a.pick;
        D.prototype.getLogTickPositions = function(a, m, t, q) {
            var l = this.options,
                f = this.len,
                b = this.lin2log,
                k = this.log2lin,
                z = [];
            q || (this._minorAutoInterval = null);
            if (.5 <= a) a = Math.round(a), z = this.getLinearTickPositions(a, m, t);
            else if (.08 <= a)
                for (var f = Math.floor(m), p, g, e, c, n, l = .3 < a ? [1, 2, 4] : .15 < a ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; f < t + 1 && !n; f++)
                    for (g = l.length, p = 0; p < g && !n; p++) e = k(b(f) * l[p]), e > m && (!q || c <= t) && void 0 !== c && z.push(c), c > t && (n = !0), c = e;
            else m = b(m), t =
                b(t), a = l[q ? "minorTickInterval" : "tickInterval"], a = r("auto" === a ? null : a, this._minorAutoInterval, l.tickPixelInterval / (q ? 5 : 1) * (t - m) / ((q ? f / this.tickPositions.length : f) || 1)), a = G(a, null, B(a)), z = F(this.getLinearTickPositions(a, m, t), k), q || (this._minorAutoInterval = a / 5);
            q || (this.tickInterval = a);
            return z
        };
        D.prototype.log2lin = function(a) {
            return Math.log(a) / Math.LN10
        };
        D.prototype.lin2log = function(a) {
            return Math.pow(10, a)
        }
    })(N);
    (function(a) {
        var D = a.dateFormat,
            B = a.each,
            F = a.extend,
            G = a.format,
            r = a.isNumber,
            h = a.map,
            m =
            a.merge,
            t = a.pick,
            q = a.splat,
            l = a.syncTimeout,
            f = a.timeUnits;
        a.Tooltip = function() {
            this.init.apply(this, arguments)
        };
        a.Tooltip.prototype = {
            init: function(a, k) {
                this.chart = a;
                this.options = k;
                this.crosshairs = [];
                this.now = {
                    x: 0,
                    y: 0
                };
                this.isHidden = !0;
                this.split = k.split && !a.inverted;
                this.shared = k.shared || this.split
            },
            cleanSplit: function(a) {
                B(this.chart.series, function(b) {
                    var k = b && b.tt;
                    k && (!k.isActive || a ? b.tt = k.destroy() : k.isActive = !1)
                })
            },
            getLabel: function() {
                var a = this.chart.renderer,
                    k = this.options;
                this.label || (this.split ?
                    this.label = a.g("tooltip") : (this.label = a.label("", 0, 0, k.shape || "callout", null, null, k.useHTML, null, "tooltip").attr({
                        padding: k.padding,
                        r: k.borderRadius
                    }), this.label.attr({
                        fill: k.backgroundColor,
                        "stroke-width": k.borderWidth
                    }).css(k.style).shadow(k.shadow)), this.label.attr({
                        zIndex: 8
                    }).add());
                return this.label
            },
            update: function(a) {
                this.destroy();
                this.init(this.chart, m(!0, this.options, a))
            },
            destroy: function() {
                this.label && (this.label = this.label.destroy());
                this.split && this.tt && (this.cleanSplit(this.chart, !0),
                    this.tt = this.tt.destroy());
                clearTimeout(this.hideTimer);
                clearTimeout(this.tooltipTimeout)
            },
            move: function(a, k, f, p) {
                var b = this,
                    e = b.now,
                    c = !1 !== b.options.animation && !b.isHidden && (1 < Math.abs(a - e.x) || 1 < Math.abs(k - e.y)),
                    n = b.followPointer || 1 < b.len;
                F(e, {
                    x: c ? (2 * e.x + a) / 3 : a,
                    y: c ? (e.y + k) / 2 : k,
                    anchorX: n ? void 0 : c ? (2 * e.anchorX + f) / 3 : f,
                    anchorY: n ? void 0 : c ? (e.anchorY + p) / 2 : p
                });
                b.getLabel().attr(e);
                c && (clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function() {
                    b && b.move(a, k, f, p)
                }, 32))
            },
            hide: function(a) {
                var b =
                    this;
                clearTimeout(this.hideTimer);
                a = t(a, this.options.hideDelay, 500);
                this.isHidden || (this.hideTimer = l(function() {
                    b.getLabel()[a ? "fadeOut" : "hide"]();
                    b.isHidden = !0
                }, a))
            },
            getAnchor: function(a, k) {
                var b, f = this.chart,
                    g = f.inverted,
                    e = f.plotTop,
                    c = f.plotLeft,
                    n = 0,
                    u = 0,
                    d, C;
                a = q(a);
                b = a[0].tooltipPos;
                this.followPointer && k && (void 0 === k.chartX && (k = f.pointer.normalize(k)), b = [k.chartX - f.plotLeft, k.chartY - e]);
                b || (B(a, function(a) {
                    d = a.series.yAxis;
                    C = a.series.xAxis;
                    n += a.plotX + (!g && C ? C.left - c : 0);
                    u += (a.plotLow ? (a.plotLow + a.plotHigh) /
                        2 : a.plotY) + (!g && d ? d.top - e : 0)
                }), n /= a.length, u /= a.length, b = [g ? f.plotWidth - u : n, this.shared && !g && 1 < a.length && k ? k.chartY - e : g ? f.plotHeight - n : u]);
                return h(b, Math.round)
            },
            getPosition: function(a, k, f) {
                var b = this.chart,
                    g = this.distance,
                    e = {},
                    c = f.h || 0,
                    n, u = ["y", b.chartHeight, k, f.plotY + b.plotTop, b.plotTop, b.plotTop + b.plotHeight],
                    d = ["x", b.chartWidth, a, f.plotX + b.plotLeft, b.plotLeft, b.plotLeft + b.plotWidth],
                    C = !this.followPointer && t(f.ttBelow, !b.inverted === !!f.negative),
                    y = function(a, b, d, n, k, f) {
                        var w = d < n - g,
                            u = n + g + d < b,
                            H =
                            n - g - d;
                        n += g;
                        if (C && u) e[a] = n;
                        else if (!C && w) e[a] = H;
                        else if (w) e[a] = Math.min(f - d, 0 > H - c ? H : H - c);
                        else if (u) e[a] = Math.max(k, n + c + d > b ? n : n + c);
                        else return !1
                    },
                    v = function(a, b, c, d) {
                        var n;
                        d < g || d > b - g ? n = !1 : e[a] = d < c / 2 ? 1 : d > b - c / 2 ? b - c - 2 : d - c / 2;
                        return n
                    },
                    E = function(a) {
                        var b = u;
                        u = d;
                        d = b;
                        n = a
                    },
                    l = function() {
                        !1 !== y.apply(0, u) ? !1 !== v.apply(0, d) || n || (E(!0), l()) : n ? e.x = e.y = 0 : (E(!0), l())
                    };
                (b.inverted || 1 < this.len) && E();
                l();
                return e
            },
            defaultFormatter: function(a) {
                var b = this.points || q(this),
                    f;
                f = [a.tooltipFooterHeaderFormatter(b[0])];
                f = f.concat(a.bodyFormatter(b));
                f.push(a.tooltipFooterHeaderFormatter(b[0], !0));
                return f
            },
            refresh: function(a, k) {
                var b = this.chart,
                    f, g = this.options,
                    e, c, n = {},
                    u = [];
                f = g.formatter || this.defaultFormatter;
                var n = b.hoverPoints,
                    d = this.shared;
                clearTimeout(this.hideTimer);
                this.followPointer = q(a)[0].series.tooltipOptions.followPointer;
                c = this.getAnchor(a, k);
                k = c[0];
                e = c[1];
                !d || a.series && a.series.noSharedTooltip ? n = a.getLabelConfig() : (b.hoverPoints = a, n && B(n, function(a) {
                        a.setState()
                    }), B(a, function(a) {
                        a.setState("hover");
                        u.push(a.getLabelConfig())
                    }),
                    n = {
                        x: a[0].category,
                        y: a[0].y
                    }, n.points = u, this.len = u.length, a = a[0]);
                n = f.call(n, this);
                d = a.series;
                this.distance = t(d.tooltipOptions.distance, 16);
                !1 === n ? this.hide() : (f = this.getLabel(), this.isHidden && f.attr({
                    opacity: 1
                }).show(), this.split ? this.renderSplit(n, b.hoverPoints) : (f.attr({
                    text: n && n.join ? n.join("") : n
                }), f.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-" + t(a.colorIndex, d.colorIndex)), f.attr({
                    stroke: g.borderColor || a.color || d.color || "#ffffff"
                }), this.updatePosition({
                    plotX: k,
                    plotY: e,
                    negative: a.negative,
                    ttBelow: a.ttBelow,
                    h: c[2] || 0
                })), this.isHidden = !1)
            },
            renderSplit: function(b, k) {
                var f = this,
                    p = [],
                    g = this.chart,
                    e = g.renderer,
                    c = !0,
                    n = this.options,
                    u, d = this.getLabel();
                B(b.slice(0, b.length - 1), function(a, b) {
                    b = k[b - 1] || {
                        isHeader: !0,
                        plotX: k[0].plotX
                    };
                    var v = b.series || f,
                        y = v.tt,
                        C = b.series || {},
                        H = "highcharts-color-" + t(b.colorIndex, C.colorIndex, "none");
                    y || (v.tt = y = e.label(null, null, null, "callout").addClass("highcharts-tooltip-box " + H).attr({
                        padding: n.padding,
                        r: n.borderRadius,
                        fill: n.backgroundColor,
                        stroke: b.color || C.color || "#333333",
                        "stroke-width": n.borderWidth
                    }).add(d));
                    y.isActive = !0;
                    y.attr({
                        text: a
                    });
                    y.css(n.style);
                    a = y.getBBox();
                    C = a.width + y.strokeWidth();
                    b.isHeader ? (u = a.height, C = Math.max(0, Math.min(b.plotX + g.plotLeft - C / 2, g.chartWidth - C))) : C = b.plotX + g.plotLeft - t(n.distance, 16) - C;
                    0 > C && (c = !1);
                    a = (b.series && b.series.yAxis && b.series.yAxis.pos) + (b.plotY || 0);
                    a -= g.plotTop;
                    p.push({
                        target: b.isHeader ? g.plotHeight + u : a,
                        rank: b.isHeader ? 1 : 0,
                        size: v.tt.getBBox().height + 1,
                        point: b,
                        x: C,
                        tt: y
                    })
                });
                this.cleanSplit();
                a.distribute(p, g.plotHeight + u);
                B(p, function(a) {
                    var b = a.point;
                    a.tt.attr({
                        visibility: void 0 === a.pos ? "hidden" : "inherit",
                        x: c || b.isHeader ? a.x : b.plotX + g.plotLeft + t(n.distance, 16),
                        y: a.pos + g.plotTop,
                        anchorX: b.plotX + g.plotLeft,
                        anchorY: b.isHeader ? a.pos + g.plotTop - 15 : b.plotY + g.plotTop
                    })
                })
            },
            updatePosition: function(a) {
                var b = this.chart,
                    f = this.getLabel(),
                    f = (this.options.positioner || this.getPosition).call(this, f.width, f.height, a);
                this.move(Math.round(f.x), Math.round(f.y || 0), a.plotX + b.plotLeft, a.plotY + b.plotTop)
            },
            getXDateFormat: function(a, k, l) {
                var b;
                k = k.dateTimeLabelFormats;
                var g = l && l.closestPointRange,
                    e, c = {
                        millisecond: 15,
                        second: 12,
                        minute: 9,
                        hour: 6,
                        day: 3
                    },
                    n, u = "millisecond";
                if (g) {
                    n = D("%m-%d %H:%M:%S.%L", a.x);
                    for (e in f) {
                        if (g === f.week && +D("%w", a.x) === l.options.startOfWeek && "00:00:00.000" === n.substr(6)) {
                            e = "week";
                            break
                        }
                        if (f[e] > g) {
                            e = u;
                            break
                        }
                        if (c[e] && n.substr(c[e]) !== "01-01 00:00:00.000".substr(c[e])) break;
                        "week" !== e && (u = e)
                    }
                    e && (b = k[e])
                } else b = k.day;
                return b || k.year
            },
            tooltipFooterHeaderFormatter: function(a, f) {
                var b =
                    f ? "footer" : "header";
                f = a.series;
                var k = f.tooltipOptions,
                    g = k.xDateFormat,
                    e = f.xAxis,
                    c = e && "datetime" === e.options.type && r(a.key),
                    b = k[b + "Format"];
                c && !g && (g = this.getXDateFormat(a, k, e));
                c && g && (b = b.replace("{point.key}", "{point.key:" + g + "}"));
                return G(b, {
                    point: a,
                    series: f
                })
            },
            bodyFormatter: function(a) {
                return h(a, function(a) {
                    var b = a.series.tooltipOptions;
                    return (b.pointFormatter || a.point.tooltipFormatter).call(a.point, b.pointFormat)
                })
            }
        }
    })(N);
    (function(a) {
        var D = a.addEvent,
            B = a.attr,
            F = a.charts,
            G = a.color,
            r = a.css,
            h =
            a.defined,
            m = a.doc,
            t = a.each,
            q = a.extend,
            l = a.fireEvent,
            f = a.offset,
            b = a.pick,
            k = a.removeEvent,
            z = a.splat,
            p = a.Tooltip,
            g = a.win;
        a.Pointer = function(a, b) {
            this.init(a, b)
        };
        a.Pointer.prototype = {
            init: function(a, c) {
                this.options = c;
                this.chart = a;
                this.runChartClick = c.chart.events && !!c.chart.events.click;
                this.pinchDown = [];
                this.lastValidTouch = {};
                p && c.tooltip.enabled && (a.tooltip = new p(a, c.tooltip), this.followTouchMove = b(c.tooltip.followTouchMove, !0));
                this.setDOMEvents()
            },
            zoomOption: function(a) {
                var c = this.chart,
                    e = c.options.chart,
                    g = e.zoomType || "",
                    c = c.inverted;
                /touch/.test(a.type) && (g = b(e.pinchType, g));
                this.zoomX = a = /x/.test(g);
                this.zoomY = g = /y/.test(g);
                this.zoomHor = a && !c || g && c;
                this.zoomVert = g && !c || a && c;
                this.hasZoom = a || g
            },
            normalize: function(a, b) {
                var c, e;
                a = a || g.event;
                a.target || (a.target = a.srcElement);
                e = a.touches ? a.touches.length ? a.touches.item(0) : a.changedTouches[0] : a;
                b || (this.chartPosition = b = f(this.chart.container));
                void 0 === e.pageX ? (c = Math.max(a.x, a.clientX - b.left), b = a.y) : (c = e.pageX - b.left, b = e.pageY - b.top);
                return q(a, {
                    chartX: Math.round(c),
                    chartY: Math.round(b)
                })
            },
            getCoordinates: function(a) {
                var b = {
                    xAxis: [],
                    yAxis: []
                };
                t(this.chart.axes, function(c) {
                    b[c.isXAxis ? "xAxis" : "yAxis"].push({
                        axis: c,
                        value: c.toValue(a[c.horiz ? "chartX" : "chartY"])
                    })
                });
                return b
            },
            runPointActions: function(e) {
                var c = this.chart,
                    g = c.series,
                    f = c.tooltip,
                    d = f ? f.shared : !1,
                    k = !0,
                    p = c.hoverPoint,
                    v = c.hoverSeries,
                    E, l, H, w = [],
                    K;
                if (!d && !v)
                    for (E = 0; E < g.length; E++)
                        if (g[E].directTouch || !g[E].options.stickyTracking) g = [];
                v && (d ? v.noSharedTooltip : v.directTouch) && p ? w = [p] : (d || !v || v.options.stickyTracking ||
                    (g = [v]), t(g, function(a) {
                        l = a.noSharedTooltip && d;
                        H = !d && a.directTouch;
                        a.visible && !l && !H && b(a.options.enableMouseTracking, !0) && (K = a.searchPoint(e, !l && 1 === a.kdDimensions)) && K.series && w.push(K)
                    }), w.sort(function(a, b) {
                        var c = a.distX - b.distX,
                            e = a.dist - b.dist,
                            g = b.series.group.zIndex - a.series.group.zIndex;
                        return 0 !== c && d ? c : 0 !== e ? e : 0 !== g ? g : a.series.index > b.series.index ? -1 : 1
                    }));
                if (d)
                    for (E = w.length; E--;)(w[E].x !== w[0].x || w[E].series.noSharedTooltip) && w.splice(E, 1);
                if (w[0] && (w[0] !== this.prevKDPoint || f && f.isHidden)) {
                    if (d &&
                        !w[0].series.noSharedTooltip) {
                        for (E = 0; E < w.length; E++) w[E].onMouseOver(e, w[E] !== (v && v.directTouch && p || w[0]));
                        w.length && f && f.refresh(w.sort(function(a, b) {
                            return a.series.index - b.series.index
                        }), e)
                    } else if (f && f.refresh(w[0], e), !v || !v.directTouch) w[0].onMouseOver(e);
                    this.prevKDPoint = w[0];
                    k = !1
                }
                k && (g = v && v.tooltipOptions.followPointer, f && g && !f.isHidden && (g = f.getAnchor([{}], e), f.updatePosition({
                    plotX: g[0],
                    plotY: g[1]
                })));
                this.unDocMouseMove || (this.unDocMouseMove = D(m, "mousemove", function(b) {
                    if (F[a.hoverChartIndex]) F[a.hoverChartIndex].pointer.onDocumentMouseMove(b)
                }));
                t(d ? w : [b(p, w[0])], function(a) {
                    t(c.axes, function(b) {
                        (!a || a.series && a.series[b.coll] === b) && b.drawCrosshair(e, a)
                    })
                })
            },
            reset: function(a, b) {
                var c = this.chart,
                    e = c.hoverSeries,
                    d = c.hoverPoint,
                    g = c.hoverPoints,
                    f = c.tooltip,
                    k = f && f.shared ? g : d;
                a && k && t(z(k), function(b) {
                    b.series.isCartesian && void 0 === b.plotX && (a = !1)
                });
                if (a) f && k && (f.refresh(k), d && (d.setState(d.state, !0), t(c.axes, function(a) {
                    a.crosshair && a.drawCrosshair(null, d)
                })));
                else {
                    if (d) d.onMouseOut();
                    g && t(g, function(a) {
                        a.setState()
                    });
                    if (e) e.onMouseOut();
                    f && f.hide(b);
                    this.unDocMouseMove && (this.unDocMouseMove = this.unDocMouseMove());
                    t(c.axes, function(a) {
                        a.hideCrosshair()
                    });
                    this.hoverX = this.prevKDPoint = c.hoverPoints = c.hoverPoint = null
                }
            },
            scaleGroups: function(a, b) {
                var c = this.chart,
                    e;
                t(c.series, function(d) {
                    e = a || d.getPlotBox();
                    d.xAxis && d.xAxis.zoomEnabled && d.group && (d.group.attr(e), d.markerGroup && (d.markerGroup.attr(e), d.markerGroup.clip(b ? c.clipRect : null)), d.dataLabelsGroup && d.dataLabelsGroup.attr(e))
                });
                c.clipRect.attr(b || c.clipBox)
            },
            dragStart: function(a) {
                var b = this.chart;
                b.mouseIsDown = a.type;
                b.cancelClick = !1;
                b.mouseDownX = this.mouseDownX = a.chartX;
                b.mouseDownY = this.mouseDownY = a.chartY
            },
            drag: function(a) {
                var b = this.chart,
                    e = b.options.chart,
                    g = a.chartX,
                    d = a.chartY,
                    f = this.zoomHor,
                    k = this.zoomVert,
                    p = b.plotLeft,
                    l = b.plotTop,
                    m = b.plotWidth,
                    H = b.plotHeight,
                    w, K = this.selectionMarker,
                    h = this.mouseDownX,
                    x = this.mouseDownY,
                    z = e.panKey && a[e.panKey + "Key"];
                K && K.touch || (g < p ? g = p : g > p + m && (g = p + m), d < l ? d = l : d > l + H && (d = l + H), this.hasDragged = Math.sqrt(Math.pow(h - g, 2) + Math.pow(x - d, 2)), 10 < this.hasDragged &&
                    (w = b.isInsidePlot(h - p, x - l), b.hasCartesianSeries && (this.zoomX || this.zoomY) && w && !z && !K && (this.selectionMarker = K = b.renderer.rect(p, l, f ? 1 : m, k ? 1 : H, 0).attr({
                        fill: e.selectionMarkerFill || G("#335cad").setOpacity(.25).get(),
                        "class": "highcharts-selection-marker",
                        zIndex: 7
                    }).add()), K && f && (g -= h, K.attr({
                        width: Math.abs(g),
                        x: (0 < g ? 0 : g) + h
                    })), K && k && (g = d - x, K.attr({
                        height: Math.abs(g),
                        y: (0 < g ? 0 : g) + x
                    })), w && !K && e.panning && b.pan(a, e.panning)))
            },
            drop: function(a) {
                var b = this,
                    e = this.chart,
                    g = this.hasPinched;
                if (this.selectionMarker) {
                    var d = {
                            originalEvent: a,
                            xAxis: [],
                            yAxis: []
                        },
                        f = this.selectionMarker,
                        k = f.attr ? f.attr("x") : f.x,
                        p = f.attr ? f.attr("y") : f.y,
                        E = f.attr ? f.attr("width") : f.width,
                        m = f.attr ? f.attr("height") : f.height,
                        H;
                    if (this.hasDragged || g) t(e.axes, function(c) {
                        if (c.zoomEnabled && h(c.min) && (g || b[{
                                xAxis: "zoomX",
                                yAxis: "zoomY"
                            }[c.coll]])) {
                            var e = c.horiz,
                                f = "touchend" === a.type ? c.minPixelPadding : 0,
                                n = c.toValue((e ? k : p) + f),
                                e = c.toValue((e ? k + E : p + m) - f);
                            d[c.coll].push({
                                axis: c,
                                min: Math.min(n, e),
                                max: Math.max(n, e)
                            });
                            H = !0
                        }
                    }), H && l(e, "selection", d, function(a) {
                        e.zoom(q(a,
                            g ? {
                                animation: !1
                            } : null))
                    });
                    this.selectionMarker = this.selectionMarker.destroy();
                    g && this.scaleGroups()
                }
                e && (r(e.container, {
                    cursor: e._cursor
                }), e.cancelClick = 10 < this.hasDragged, e.mouseIsDown = this.hasDragged = this.hasPinched = !1, this.pinchDown = [])
            },
            onContainerMouseDown: function(a) {
                a = this.normalize(a);
                this.zoomOption(a);
                a.preventDefault && a.preventDefault();
                this.dragStart(a)
            },
            onDocumentMouseUp: function(b) {
                F[a.hoverChartIndex] && F[a.hoverChartIndex].pointer.drop(b)
            },
            onDocumentMouseMove: function(a) {
                var b = this.chart,
                    e = this.chartPosition;
                a = this.normalize(a, e);
                !e || this.inClass(a.target, "highcharts-tracker") || b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop) || this.reset()
            },
            onContainerMouseLeave: function(b) {
                var c = F[a.hoverChartIndex];
                c && (b.relatedTarget || b.toElement) && (c.pointer.reset(), c.pointer.chartPosition = null)
            },
            onContainerMouseMove: function(b) {
                var c = this.chart;
                h(a.hoverChartIndex) && F[a.hoverChartIndex] && F[a.hoverChartIndex].mouseIsDown || (a.hoverChartIndex = c.index);
                b = this.normalize(b);
                b.returnValue = !1;
                "mousedown" === c.mouseIsDown && this.drag(b);
                !this.inClass(b.target, "highcharts-tracker") && !c.isInsidePlot(b.chartX - c.plotLeft, b.chartY - c.plotTop) || c.openMenu || this.runPointActions(b)
            },
            inClass: function(a, b) {
                for (var c; a;) {
                    if (c = B(a, "class")) {
                        if (-1 !== c.indexOf(b)) return !0;
                        if (-1 !== c.indexOf("highcharts-container")) return !1
                    }
                    a = a.parentNode
                }
            },
            onTrackerMouseOut: function(a) {
                var b = this.chart.hoverSeries;
                a = a.relatedTarget || a.toElement;
                if (!(!b || !a || b.options.stickyTracking || this.inClass(a, "highcharts-tooltip") ||
                        this.inClass(a, "highcharts-series-" + b.index) && this.inClass(a, "highcharts-tracker"))) b.onMouseOut()
            },
            onContainerClick: function(a) {
                var b = this.chart,
                    e = b.hoverPoint,
                    g = b.plotLeft,
                    d = b.plotTop;
                a = this.normalize(a);
                b.cancelClick || (e && this.inClass(a.target, "highcharts-tracker") ? (l(e.series, "click", q(a, {
                    point: e
                })), b.hoverPoint && e.firePointEvent("click", a)) : (q(a, this.getCoordinates(a)), b.isInsidePlot(a.chartX - g, a.chartY - d) && l(b, "click", a)))
            },
            setDOMEvents: function() {
                var b = this,
                    c = b.chart.container;
                c.onmousedown =
                    function(a) {
                        b.onContainerMouseDown(a)
                    };
                c.onmousemove = function(a) {
                    b.onContainerMouseMove(a)
                };
                c.onclick = function(a) {
                    b.onContainerClick(a)
                };
                D(c, "mouseleave", b.onContainerMouseLeave);
                1 === a.chartCount && D(m, "mouseup", b.onDocumentMouseUp);
                a.hasTouch && (c.ontouchstart = function(a) {
                    b.onContainerTouchStart(a)
                }, c.ontouchmove = function(a) {
                    b.onContainerTouchMove(a)
                }, 1 === a.chartCount && D(m, "touchend", b.onDocumentTouchEnd))
            },
            destroy: function() {
                var b;
                k(this.chart.container, "mouseleave", this.onContainerMouseLeave);
                a.chartCount ||
                    (k(m, "mouseup", this.onDocumentMouseUp), k(m, "touchend", this.onDocumentTouchEnd));
                clearInterval(this.tooltipTimeout);
                for (b in this) this[b] = null
            }
        }
    })(N);
    (function(a) {
        var D = a.charts,
            B = a.each,
            F = a.extend,
            G = a.map,
            r = a.noop,
            h = a.pick;
        F(a.Pointer.prototype, {
            pinchTranslate: function(a, h, q, l, f, b) {
                this.zoomHor && this.pinchTranslateDirection(!0, a, h, q, l, f, b);
                this.zoomVert && this.pinchTranslateDirection(!1, a, h, q, l, f, b)
            },
            pinchTranslateDirection: function(a, h, q, l, f, b, k, z) {
                var p = this.chart,
                    g = a ? "x" : "y",
                    e = a ? "X" : "Y",
                    c = "chart" +
                    e,
                    n = a ? "width" : "height",
                    u = p["plot" + (a ? "Left" : "Top")],
                    d, C, y = z || 1,
                    v = p.inverted,
                    E = p.bounds[a ? "h" : "v"],
                    m = 1 === h.length,
                    H = h[0][c],
                    w = q[0][c],
                    K = !m && h[1][c],
                    M = !m && q[1][c],
                    x;
                q = function() {
                    !m && 20 < Math.abs(H - K) && (y = z || Math.abs(w - M) / Math.abs(H - K));
                    C = (u - w) / y + H;
                    d = p["plot" + (a ? "Width" : "Height")] / y
                };
                q();
                h = C;
                h < E.min ? (h = E.min, x = !0) : h + d > E.max && (h = E.max - d, x = !0);
                x ? (w -= .8 * (w - k[g][0]), m || (M -= .8 * (M - k[g][1])), q()) : k[g] = [w, M];
                v || (b[g] = C - u, b[n] = d);
                b = v ? 1 / y : y;
                f[n] = d;
                f[g] = h;
                l[v ? a ? "scaleY" : "scaleX" : "scale" + e] = y;
                l["translate" + e] = b *
                    u + (w - b * H)
            },
            pinch: function(a) {
                var m = this,
                    q = m.chart,
                    l = m.pinchDown,
                    f = a.touches,
                    b = f.length,
                    k = m.lastValidTouch,
                    z = m.hasZoom,
                    p = m.selectionMarker,
                    g = {},
                    e = 1 === b && (m.inClass(a.target, "highcharts-tracker") && q.runTrackerClick || m.runChartClick),
                    c = {};
                1 < b && (m.initiated = !0);
                z && m.initiated && !e && a.preventDefault();
                G(f, function(a) {
                    return m.normalize(a)
                });
                "touchstart" === a.type ? (B(f, function(a, b) {
                    l[b] = {
                        chartX: a.chartX,
                        chartY: a.chartY
                    }
                }), k.x = [l[0].chartX, l[1] && l[1].chartX], k.y = [l[0].chartY, l[1] && l[1].chartY], B(q.axes, function(a) {
                    if (a.zoomEnabled) {
                        var b =
                            q.bounds[a.horiz ? "h" : "v"],
                            c = a.minPixelPadding,
                            e = a.toPixels(h(a.options.min, a.dataMin)),
                            g = a.toPixels(h(a.options.max, a.dataMax)),
                            f = Math.max(e, g);
                        b.min = Math.min(a.pos, Math.min(e, g) - c);
                        b.max = Math.max(a.pos + a.len, f + c)
                    }
                }), m.res = !0) : m.followTouchMove && 1 === b ? this.runPointActions(m.normalize(a)) : l.length && (p || (m.selectionMarker = p = F({
                    destroy: r,
                    touch: !0
                }, q.plotBox)), m.pinchTranslate(l, f, g, p, c, k), m.hasPinched = z, m.scaleGroups(g, c), m.res && (m.res = !1, this.reset(!1, 0)))
            },
            touch: function(m, r) {
                var q = this.chart,
                    l, f;
                if (q.index !== a.hoverChartIndex) this.onContainerMouseLeave({
                    relatedTarget: !0
                });
                a.hoverChartIndex = q.index;
                1 === m.touches.length ? (m = this.normalize(m), (f = q.isInsidePlot(m.chartX - q.plotLeft, m.chartY - q.plotTop)) && !q.openMenu ? (r && this.runPointActions(m), "touchmove" === m.type && (r = this.pinchDown, l = r[0] ? 4 <= Math.sqrt(Math.pow(r[0].chartX - m.chartX, 2) + Math.pow(r[0].chartY - m.chartY, 2)) : !1), h(l, !0) && this.pinch(m)) : r && this.reset()) : 2 === m.touches.length && this.pinch(m)
            },
            onContainerTouchStart: function(a) {
                this.zoomOption(a);
                this.touch(a, !0)
            },
            onContainerTouchMove: function(a) {
                this.touch(a)
            },
            onDocumentTouchEnd: function(h) {
                D[a.hoverChartIndex] && D[a.hoverChartIndex].pointer.drop(h)
            }
        })
    })(N);
    (function(a) {
        var D = a.addEvent,
            B = a.charts,
            F = a.css,
            G = a.doc,
            r = a.extend,
            h = a.noop,
            m = a.Pointer,
            t = a.removeEvent,
            q = a.win,
            l = a.wrap;
        if (q.PointerEvent || q.MSPointerEvent) {
            var f = {},
                b = !!q.PointerEvent,
                k = function() {
                    var a, b = [];
                    b.item = function(a) {
                        return this[a]
                    };
                    for (a in f) f.hasOwnProperty(a) && b.push({
                        pageX: f[a].pageX,
                        pageY: f[a].pageY,
                        target: f[a].target
                    });
                    return b
                },
                z = function(b, g, e, c) {
                    "touch" !== b.pointerType && b.pointerType !== b.MSPOINTER_TYPE_TOUCH || !B[a.hoverChartIndex] || (c(b), c = B[a.hoverChartIndex].pointer, c[g]({
                        type: e,
                        target: b.currentTarget,
                        preventDefault: h,
                        touches: k()
                    }))
                };
            r(m.prototype, {
                onContainerPointerDown: function(a) {
                    z(a, "onContainerTouchStart", "touchstart", function(a) {
                        f[a.pointerId] = {
                            pageX: a.pageX,
                            pageY: a.pageY,
                            target: a.currentTarget
                        }
                    })
                },
                onContainerPointerMove: function(a) {
                    z(a, "onContainerTouchMove", "touchmove", function(a) {
                        f[a.pointerId] = {
                            pageX: a.pageX,
                            pageY: a.pageY
                        };
                        f[a.pointerId].target || (f[a.pointerId].target = a.currentTarget)
                    })
                },
                onDocumentPointerUp: function(a) {
                    z(a, "onDocumentTouchEnd", "touchend", function(a) {
                        delete f[a.pointerId]
                    })
                },
                batchMSEvents: function(a) {
                    a(this.chart.container, b ? "pointerdown" : "MSPointerDown", this.onContainerPointerDown);
                    a(this.chart.container, b ? "pointermove" : "MSPointerMove", this.onContainerPointerMove);
                    a(G, b ? "pointerup" : "MSPointerUp", this.onDocumentPointerUp)
                }
            });
            l(m.prototype, "init", function(a, b, e) {
                a.call(this, b, e);
                this.hasZoom &&
                    F(b.container, {
                        "-ms-touch-action": "none",
                        "touch-action": "none"
                    })
            });
            l(m.prototype, "setDOMEvents", function(a) {
                a.apply(this);
                (this.hasZoom || this.followTouchMove) && this.batchMSEvents(D)
            });
            l(m.prototype, "destroy", function(a) {
                this.batchMSEvents(t);
                a.call(this)
            })
        }
    })(N);
    (function(a) {
        var D, B = a.addEvent,
            F = a.css,
            G = a.discardElement,
            r = a.defined,
            h = a.each,
            m = a.extend,
            t = a.isFirefox,
            q = a.marginNames,
            l = a.merge,
            f = a.pick,
            b = a.setAnimation,
            k = a.stableSort,
            z = a.win,
            p = a.wrap;
        D = a.Legend = function(a, b) {
            this.init(a, b)
        };
        D.prototype = {
            init: function(a, b) {
                this.chart = a;
                this.setOptions(b);
                b.enabled && (this.render(), B(this.chart, "endResize", function() {
                    this.legend.positionCheckboxes()
                }))
            },
            setOptions: function(a) {
                var b = f(a.padding, 8);
                this.options = a;
                this.itemStyle = a.itemStyle;
                this.itemHiddenStyle = l(this.itemStyle, a.itemHiddenStyle);
                this.itemMarginTop = a.itemMarginTop || 0;
                this.initialItemX = this.padding = b;
                this.initialItemY = b - 5;
                this.itemHeight = this.maxItemWidth = 0;
                this.symbolWidth = f(a.symbolWidth, 16);
                this.pages = []
            },
            update: function(a, b) {
                var c =
                    this.chart;
                this.setOptions(l(!0, this.options, a));
                this.destroy();
                c.isDirtyLegend = c.isDirtyBox = !0;
                f(b, !0) && c.redraw()
            },
            colorizeItem: function(a, b) {
                a.legendGroup[b ? "removeClass" : "addClass"]("highcharts-legend-item-hidden");
                var c = this.options,
                    e = a.legendItem,
                    g = a.legendLine,
                    d = a.legendSymbol,
                    f = this.itemHiddenStyle.color,
                    c = b ? c.itemStyle.color : f,
                    k = b ? a.color || f : f,
                    p = a.options && a.options.marker,
                    l = {
                        fill: k
                    },
                    h;
                e && e.css({
                    fill: c,
                    color: c
                });
                g && g.attr({
                    stroke: k
                });
                if (d) {
                    if (p && d.isMarker && (l = a.pointAttribs(), !b))
                        for (h in l) l[h] =
                            f;
                    d.attr(l)
                }
            },
            positionItem: function(a) {
                var b = this.options,
                    c = b.symbolPadding,
                    b = !b.rtl,
                    g = a._legendItemPos,
                    f = g[0],
                    g = g[1],
                    d = a.checkbox;
                (a = a.legendGroup) && a.element && a.translate(b ? f : this.legendWidth - f - 2 * c - 4, g);
                d && (d.x = f, d.y = g)
            },
            destroyItem: function(a) {
                var b = a.checkbox;
                h(["legendItem", "legendLine", "legendSymbol", "legendGroup"], function(b) {
                    a[b] && (a[b] = a[b].destroy())
                });
                b && G(a.checkbox)
            },
            destroy: function() {
                var a = this.group,
                    b = this.box;
                b && (this.box = b.destroy());
                h(this.getAllItems(), function(a) {
                    h(["legendItem",
                        "legendGroup"
                    ], function(b) {
                        a[b] && (a[b] = a[b].destroy())
                    })
                });
                a && (this.group = a.destroy());
                this.display = null
            },
            positionCheckboxes: function(a) {
                var b = this.group && this.group.alignAttr,
                    c, g = this.clipHeight || this.legendHeight,
                    f = this.titleHeight;
                b && (c = b.translateY, h(this.allItems, function(d) {
                    var e = d.checkbox,
                        k;
                    e && (k = c + f + e.y + (a || 0) + 3, F(e, {
                        left: b.translateX + d.checkboxOffset + e.x - 20 + "px",
                        top: k + "px",
                        display: k > c - 6 && k < c + g - 6 ? "" : "none"
                    }))
                }))
            },
            renderTitle: function() {
                var a = this.padding,
                    b = this.options.title,
                    c = 0;
                b.text &&
                    (this.title || (this.title = this.chart.renderer.label(b.text, a - 3, a - 4, null, null, null, null, null, "legend-title").attr({
                        zIndex: 1
                    }).css(b.style).add(this.group)), a = this.title.getBBox(), c = a.height, this.offsetWidth = a.width, this.contentGroup.attr({
                        translateY: c
                    }));
                this.titleHeight = c
            },
            setText: function(b) {
                var e = this.options;
                b.legendItem.attr({
                    text: e.labelFormat ? a.format(e.labelFormat, b) : e.labelFormatter.call(b)
                })
            },
            renderItem: function(a) {
                var b = this.chart,
                    c = b.renderer,
                    g = this.options,
                    k = "horizontal" === g.layout,
                    d = this.symbolWidth,
                    p = g.symbolPadding,
                    y = this.itemStyle,
                    v = this.itemHiddenStyle,
                    h = this.padding,
                    m = k ? f(g.itemDistance, 20) : 0,
                    H = !g.rtl,
                    w = g.width,
                    K = g.itemMarginBottom || 0,
                    z = this.itemMarginTop,
                    x = this.initialItemX,
                    q = a.legendItem,
                    r = !a.series,
                    t = !r && a.series.drawLegendSymbol ? a.series : a,
                    A = t.options,
                    A = this.createCheckboxForItem && A && A.showCheckbox,
                    L = g.useHTML;
                q || (a.legendGroup = c.g("legend-item").addClass("highcharts-" + t.type + "-series highcharts-color-" + a.colorIndex + (a.options.className ? " " + a.options.className : "") + (r ? " highcharts-series-" +
                    a.index : "")).attr({
                    zIndex: 1
                }).add(this.scrollGroup), a.legendItem = q = c.text("", H ? d + p : -p, this.baseline || 0, L).css(l(a.visible ? y : v)).attr({
                    align: H ? "left" : "right",
                    zIndex: 2
                }).add(a.legendGroup), this.baseline || (y = y.fontSize, this.fontMetrics = c.fontMetrics(y, q), this.baseline = this.fontMetrics.f + 3 + z, q.attr("y", this.baseline)), t.drawLegendSymbol(this, a), this.setItemEvents && this.setItemEvents(a, q, L), A && this.createCheckboxForItem(a));
                this.colorizeItem(a, a.visible);
                this.setText(a);
                c = q.getBBox();
                d = a.checkboxOffset =
                    g.itemWidth || a.legendItemWidth || d + p + c.width + m + (A ? 20 : 0);
                this.itemHeight = p = Math.round(a.legendItemHeight || c.height);
                k && this.itemX - x + d > (w || b.chartWidth - 2 * h - x - g.x) && (this.itemX = x, this.itemY += z + this.lastLineHeight + K, this.lastLineHeight = 0);
                this.maxItemWidth = Math.max(this.maxItemWidth, d);
                this.lastItemY = z + this.itemY + K;
                this.lastLineHeight = Math.max(p, this.lastLineHeight);
                a._legendItemPos = [this.itemX, this.itemY];
                k ? this.itemX += d : (this.itemY += z + p + K, this.lastLineHeight = p);
                this.offsetWidth = w || Math.max((k ? this.itemX -
                    x - m : d) + h, this.offsetWidth)
            },
            getAllItems: function() {
                var a = [];
                h(this.chart.series, function(b) {
                    var c = b && b.options;
                    b && f(c.showInLegend, r(c.linkedTo) ? !1 : void 0, !0) && (a = a.concat(b.legendItems || ("point" === c.legendType ? b.data : b)))
                });
                return a
            },
            adjustMargins: function(a, b) {
                var c = this.chart,
                    e = this.options,
                    g = e.align.charAt(0) + e.verticalAlign.charAt(0) + e.layout.charAt(0);
                e.floating || h([/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/], function(d, k) {
                    d.test(g) && !r(a[k]) && (c[q[k]] = Math.max(c[q[k]], c.legend[(k +
                        1) % 2 ? "legendHeight" : "legendWidth"] + [1, -1, -1, 1][k] * e[k % 2 ? "x" : "y"] + f(e.margin, 12) + b[k]))
                })
            },
            render: function() {
                var a = this,
                    b = a.chart,
                    c = b.renderer,
                    f = a.group,
                    p, d, l, y, v = a.box,
                    E = a.options,
                    z = a.padding;
                a.itemX = a.initialItemX;
                a.itemY = a.initialItemY;
                a.offsetWidth = 0;
                a.lastItemY = 0;
                f || (a.group = f = c.g("legend").attr({
                    zIndex: 7
                }).add(), a.contentGroup = c.g().attr({
                    zIndex: 1
                }).add(f), a.scrollGroup = c.g().add(a.contentGroup));
                a.renderTitle();
                p = a.getAllItems();
                k(p, function(a, b) {
                    return (a.options && a.options.legendIndex || 0) -
                        (b.options && b.options.legendIndex || 0)
                });
                E.reversed && p.reverse();
                a.allItems = p;
                a.display = d = !!p.length;
                a.lastLineHeight = 0;
                h(p, function(b) {
                    a.renderItem(b)
                });
                l = (E.width || a.offsetWidth) + z;
                y = a.lastItemY + a.lastLineHeight + a.titleHeight;
                y = a.handleOverflow(y);
                y += z;
                v || (a.box = v = c.rect().addClass("highcharts-legend-box").attr({
                    r: E.borderRadius
                }).add(f), v.isNew = !0);
                v.attr({
                    stroke: E.borderColor,
                    "stroke-width": E.borderWidth || 0,
                    fill: E.backgroundColor || "none"
                }).shadow(E.shadow);
                0 < l && 0 < y && (v[v.isNew ? "attr" : "animate"](v.crisp({
                    x: 0,
                    y: 0,
                    width: l,
                    height: y
                }, v.strokeWidth())), v.isNew = !1);
                v[d ? "show" : "hide"]();
                a.legendWidth = l;
                a.legendHeight = y;
                h(p, function(b) {
                    a.positionItem(b)
                });
                d && f.align(m({
                    width: l,
                    height: y
                }, E), !0, "spacingBox");
                b.isResizing || this.positionCheckboxes()
            },
            handleOverflow: function(a) {
                var b = this,
                    c = this.chart,
                    g = c.renderer,
                    k = this.options,
                    d = k.y,
                    c = c.spacingBox.height + ("top" === k.verticalAlign ? -d : d) - this.padding,
                    d = k.maxHeight,
                    p, l = this.clipRect,
                    v = k.navigation,
                    m = f(v.animation, !0),
                    z = v.arrowSize || 12,
                    H = this.nav,
                    w = this.pages,
                    K = this.padding,
                    q, x = this.allItems,
                    J = function(a) {
                        a ? l.attr({
                            height: a
                        }) : l && (b.clipRect = l.destroy(), b.contentGroup.clip());
                        b.contentGroup.div && (b.contentGroup.div.style.clip = a ? "rect(" + K + "px,9999px," + (K + a) + "px,0)" : "auto")
                    };
                "horizontal" !== k.layout || "middle" === k.verticalAlign || k.floating || (c /= 2);
                d && (c = Math.min(c, d));
                w.length = 0;
                a > c && !1 !== v.enabled ? (this.clipHeight = p = Math.max(c - 20 - this.titleHeight - K, 0), this.currentPage = f(this.currentPage, 1), this.fullHeight = a, h(x, function(a, b) {
                        var c = a._legendItemPos[1];
                        a = Math.round(a.legendItem.getBBox().height);
                        var d = w.length;
                        if (!d || c - w[d - 1] > p && (q || c) !== w[d - 1]) w.push(q || c), d++;
                        b === x.length - 1 && c + a - w[d - 1] > p && w.push(c);
                        c !== q && (q = c)
                    }), l || (l = b.clipRect = g.clipRect(0, K, 9999, 0), b.contentGroup.clip(l)), J(p), H || (this.nav = H = g.g().attr({
                        zIndex: 1
                    }).add(this.group), this.up = g.symbol("triangle", 0, 0, z, z).on("click", function() {
                        b.scroll(-1, m)
                    }).add(H), this.pager = g.text("", 15, 10).addClass("highcharts-legend-navigation").css(v.style).add(H), this.down = g.symbol("triangle-down", 0, 0, z, z).on("click", function() {
                        b.scroll(1, m)
                    }).add(H)),
                    b.scroll(0), a = c) : H && (J(), H.hide(), this.scrollGroup.attr({
                    translateY: 1
                }), this.clipHeight = 0);
                return a
            },
            scroll: function(a, e) {
                var c = this.pages,
                    g = c.length;
                a = this.currentPage + a;
                var f = this.clipHeight,
                    d = this.options.navigation,
                    k = this.pager,
                    p = this.padding;
                a > g && (a = g);
                0 < a && (void 0 !== e && b(e, this.chart), this.nav.attr({
                    translateX: p,
                    translateY: f + this.padding + 7 + this.titleHeight,
                    visibility: "visible"
                }), this.up.attr({
                    "class": 1 === a ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"
                }), k.attr({
                    text: a + "/" +
                        g
                }), this.down.attr({
                    x: 18 + this.pager.getBBox().width,
                    "class": a === g ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"
                }), this.up.attr({
                    fill: 1 === a ? d.inactiveColor : d.activeColor
                }).css({
                    cursor: 1 === a ? "default" : "pointer"
                }), this.down.attr({
                    fill: a === g ? d.inactiveColor : d.activeColor
                }).css({
                    cursor: a === g ? "default" : "pointer"
                }), e = -c[a - 1] + this.initialItemY, this.scrollGroup.animate({
                    translateY: e
                }), this.currentPage = a, this.positionCheckboxes(e))
            }
        };
        a.LegendSymbolMixin = {
            drawRectangle: function(a, b) {
                var c =
                    a.options,
                    e = c.symbolHeight || a.fontMetrics.f,
                    c = c.squareSymbol;
                b.legendSymbol = this.chart.renderer.rect(c ? (a.symbolWidth - e) / 2 : 0, a.baseline - e + 1, c ? e : a.symbolWidth, e, f(a.options.symbolRadius, e / 2)).addClass("highcharts-point").attr({
                    zIndex: 3
                }).add(b.legendGroup)
            },
            drawLineMarker: function(a) {
                var b = this.options,
                    c = b.marker,
                    f = a.symbolWidth,
                    g = this.chart.renderer,
                    d = this.legendGroup;
                a = a.baseline - Math.round(.3 * a.fontMetrics.b);
                var k;
                k = {
                    "stroke-width": b.lineWidth || 0
                };
                b.dashStyle && (k.dashstyle = b.dashStyle);
                this.legendLine =
                    g.path(["M", 0, a, "L", f, a]).addClass("highcharts-graph").attr(k).add(d);
                c && !1 !== c.enabled && (b = 0 === this.symbol.indexOf("url") ? 0 : c.radius, this.legendSymbol = c = g.symbol(this.symbol, f / 2 - b, a - b, 2 * b, 2 * b, c).addClass("highcharts-point").add(d), c.isMarker = !0)
            }
        };
        (/Trident\/7\.0/.test(z.navigator.userAgent) || t) && p(D.prototype, "positionItem", function(a, b) {
            var c = this,
                e = function() {
                    b._legendItemPos && a.call(c, b)
                };
            e();
            setTimeout(e)
        })
    })(N);
    (function(a) {
        var D = a.addEvent,
            B = a.animate,
            F = a.animObject,
            G = a.attr,
            r = a.doc,
            h = a.Axis,
            m = a.createElement,
            t = a.defaultOptions,
            q = a.discardElement,
            l = a.charts,
            f = a.css,
            b = a.defined,
            k = a.each,
            z = a.error,
            p = a.extend,
            g = a.fireEvent,
            e = a.getStyle,
            c = a.grep,
            n = a.isNumber,
            u = a.isObject,
            d = a.isString,
            C = a.Legend,
            y = a.marginNames,
            v = a.merge,
            E = a.Pointer,
            I = a.pick,
            H = a.pInt,
            w = a.removeEvent,
            K = a.seriesTypes,
            M = a.splat,
            x = a.svg,
            J = a.syncTimeout,
            O = a.win,
            Q = a.Renderer,
            A = a.Chart = function() {
                this.getArgs.apply(this, arguments)
            };
        a.chart = function(a, b, c) {
            return new A(a, b, c)
        };
        A.prototype = {
            callbacks: [],
            getArgs: function() {
                var a = [].slice.call(arguments);
                if (d(a[0]) || a[0].nodeName) this.renderTo = a.shift();
                this.init(a[0], a[1])
            },
            init: function(b, c) {
                var d, e = b.series;
                b.series = null;
                d = v(t, b);
                d.series = b.series = e;
                this.userOptions = b;
                this.respRules = [];
                b = d.chart;
                e = b.events;
                this.margin = [];
                this.spacing = [];
                this.bounds = {
                    h: {},
                    v: {}
                };
                this.callback = c;
                this.isResizing = 0;
                this.options = d;
                this.axes = [];
                this.series = [];
                this.hasCartesianSeries = b.showAxes;
                var f;
                this.index = l.length;
                l.push(this);
                a.chartCount++;
                if (e)
                    for (f in e) D(this, f, e[f]);
                this.xAxis = [];
                this.yAxis = [];
                this.pointCount =
                    this.colorCounter = this.symbolCounter = 0;
                this.firstRender()
            },
            initSeries: function(a) {
                var b = this.options.chart;
                (b = K[a.type || b.type || b.defaultSeriesType]) || z(17, !0);
                b = new b;
                b.init(this, a);
                return b
            },
            isInsidePlot: function(a, b, c) {
                var d = c ? b : a;
                a = c ? a : b;
                return 0 <= d && d <= this.plotWidth && 0 <= a && a <= this.plotHeight
            },
            redraw: function(b) {
                var c = this.axes,
                    d = this.series,
                    e = this.pointer,
                    f = this.legend,
                    w = this.isDirtyLegend,
                    n, H, x = this.hasCartesianSeries,
                    u = this.isDirtyBox,
                    l = d.length,
                    K = l,
                    v = this.renderer,
                    y = v.isHidden(),
                    h = [];
                a.setAnimation(b,
                    this);
                y && this.cloneRenderTo();
                for (this.layOutTitles(); K--;)
                    if (b = d[K], b.options.stacking && (n = !0, b.isDirty)) {
                        H = !0;
                        break
                    }
                if (H)
                    for (K = l; K--;) b = d[K], b.options.stacking && (b.isDirty = !0);
                k(d, function(a) {
                    a.isDirty && "point" === a.options.legendType && (a.updateTotals && a.updateTotals(), w = !0);
                    a.isDirtyData && g(a, "updatedData")
                });
                w && f.options.enabled && (f.render(), this.isDirtyLegend = !1);
                n && this.getStacks();
                x && k(c, function(a) {
                    a.updateNames();
                    a.setScale()
                });
                this.getMargins();
                x && (k(c, function(a) {
                    a.isDirty && (u = !0)
                }), k(c,
                    function(a) {
                        var b = a.min + "," + a.max;
                        a.extKey !== b && (a.extKey = b, h.push(function() {
                            g(a, "afterSetExtremes", p(a.eventArgs, a.getExtremes()));
                            delete a.eventArgs
                        }));
                        (u || n) && a.redraw()
                    }));
                u && this.drawChartBox();
                k(d, function(a) {
                    (u || a.isDirty) && a.visible && a.redraw()
                });
                e && e.reset(!0);
                v.draw();
                g(this, "redraw");
                y && this.cloneRenderTo(!0);
                k(h, function(a) {
                    a.call()
                })
            },
            get: function(a) {
                var b = this.axes,
                    c = this.series,
                    d, e;
                for (d = 0; d < b.length; d++)
                    if (b[d].options.id === a) return b[d];
                for (d = 0; d < c.length; d++)
                    if (c[d].options.id ===
                        a) return c[d];
                for (d = 0; d < c.length; d++)
                    for (e = c[d].points || [], b = 0; b < e.length; b++)
                        if (e[b].id === a) return e[b];
                return null
            },
            getAxes: function() {
                var a = this,
                    b = this.options,
                    c = b.xAxis = M(b.xAxis || {}),
                    b = b.yAxis = M(b.yAxis || {});
                k(c, function(a, b) {
                    a.index = b;
                    a.isX = !0
                });
                k(b, function(a, b) {
                    a.index = b
                });
                c = c.concat(b);
                k(c, function(b) {
                    new h(a, b)
                })
            },
            getSelectedPoints: function() {
                var a = [];
                k(this.series, function(b) {
                    a = a.concat(c(b.points || [], function(a) {
                        return a.selected
                    }))
                });
                return a
            },
            getSelectedSeries: function() {
                return c(this.series,
                    function(a) {
                        return a.selected
                    })
            },
            setTitle: function(a, b, c) {
                var d = this,
                    e = d.options,
                    f;
                f = e.title = v(e.title, a);
                e = e.subtitle = v(e.subtitle, b);
                k([
                    ["title", a, f],
                    ["subtitle", b, e]
                ], function(a, b) {
                    var c = a[0],
                        e = d[c],
                        f = a[1];
                    a = a[2];
                    e && f && (d[c] = e = e.destroy());
                    a && a.text && !e && (d[c] = d.renderer.text(a.text, 0, 0, a.useHTML).attr({
                        align: a.align,
                        "class": "highcharts-" + c,
                        zIndex: a.zIndex || 4
                    }).add(), d[c].update = function(a) {
                        d.setTitle(!b && a, b && a)
                    }, d[c].css(a.style))
                });
                d.layOutTitles(c)
            },
            layOutTitles: function(a) {
                var b = 0,
                    c, d = this.renderer,
                    e = this.spacingBox;
                k(["title", "subtitle"], function(a) {
                    var c = this[a],
                        f = this.options[a],
                        g;
                    c && (g = f.style.fontSize, g = d.fontMetrics(g, c).b, c.css({
                        width: (f.width || e.width + f.widthAdjust) + "px"
                    }).align(p({
                        y: b + g + ("title" === a ? -3 : 2)
                    }, f), !1, "spacingBox"), f.floating || f.verticalAlign || (b = Math.ceil(b + c.getBBox().height)))
                }, this);
                c = this.titleOffset !== b;
                this.titleOffset = b;
                !this.isDirtyBox && c && (this.isDirtyBox = c, this.hasRendered && I(a, !0) && this.isDirtyBox && this.redraw())
            },
            getChartSize: function() {
                var a = this.options.chart,
                    c = a.width,
                    a = a.height,
                    d = this.renderToClone || this.renderTo;
                b(c) || (this.containerWidth = e(d, "width"));
                b(a) || (this.containerHeight = e(d, "height"));
                this.chartWidth = Math.max(0, c || this.containerWidth || 600);
                this.chartHeight = Math.max(0, I(a, 19 < this.containerHeight ? this.containerHeight : 400))
            },
            cloneRenderTo: function(a) {
                var b = this.renderToClone,
                    c = this.container;
                if (a) {
                    if (b) {
                        for (; b.childNodes.length;) this.renderTo.appendChild(b.firstChild);
                        q(b);
                        delete this.renderToClone
                    }
                } else c && c.parentNode === this.renderTo && this.renderTo.removeChild(c),
                    this.renderToClone = b = this.renderTo.cloneNode(0), f(b, {
                        position: "absolute",
                        top: "-9999px",
                        display: "block"
                    }), b.style.setProperty && b.style.setProperty("display", "block", "important"), r.body.appendChild(b), c && b.appendChild(c)
            },
            setClassName: function(a) {
                this.container.className = "highcharts-container " + (a || "")
            },
            getContainer: function() {
                var b, c = this.options,
                    e = c.chart,
                    f, g;
                b = this.renderTo;
                var k = a.uniqueKey(),
                    w;
                b || (this.renderTo = b = e.renderTo);
                d(b) && (this.renderTo = b = r.getElementById(b));
                b || z(13, !0);
                f = H(G(b, "data-highcharts-chart"));
                n(f) && l[f] && l[f].hasRendered && l[f].destroy();
                G(b, "data-highcharts-chart", this.index);
                b.innerHTML = "";
                e.skipClone || b.offsetWidth || this.cloneRenderTo();
                this.getChartSize();
                f = this.chartWidth;
                g = this.chartHeight;
                w = p({
                    position: "relative",
                    overflow: "hidden",
                    width: f + "px",
                    height: g + "px",
                    textAlign: "left",
                    lineHeight: "normal",
                    zIndex: 0,
                    "-webkit-tap-highlight-color": "rgba(0,0,0,0)"
                }, e.style);
                this.container = b = m("div", {
                    id: k
                }, w, this.renderToClone || b);
                this._cursor = b.style.cursor;
                this.renderer = new(a[e.renderer] || Q)(b,
                    f, g, null, e.forExport, c.exporting && c.exporting.allowHTML);
                this.setClassName(e.className);
                this.renderer.setStyle(e.style);
                this.renderer.chartIndex = this.index
            },
            getMargins: function(a) {
                var c = this.spacing,
                    d = this.margin,
                    e = this.titleOffset;
                this.resetMargins();
                e && !b(d[0]) && (this.plotTop = Math.max(this.plotTop, e + this.options.title.margin + c[0]));
                this.legend.display && this.legend.adjustMargins(d, c);
                this.extraBottomMargin && (this.marginBottom += this.extraBottomMargin);
                this.extraTopMargin && (this.plotTop += this.extraTopMargin);
                a || this.getAxisMargins()
            },
            getAxisMargins: function() {
                var a = this,
                    c = a.axisOffset = [0, 0, 0, 0],
                    d = a.margin;
                a.hasCartesianSeries && k(a.axes, function(a) {
                    a.visible && a.getOffset()
                });
                k(y, function(e, f) {
                    b(d[f]) || (a[e] += c[f])
                });
                a.setChartSize()
            },
            reflow: function(a) {
                var c = this,
                    d = c.options.chart,
                    f = c.renderTo,
                    g = b(d.width),
                    k = d.width || e(f, "width"),
                    d = d.height || e(f, "height"),
                    f = a ? a.target : O;
                if (!g && !c.isPrinting && k && d && (f === O || f === r)) {
                    if (k !== c.containerWidth || d !== c.containerHeight) clearTimeout(c.reflowTimeout), c.reflowTimeout =
                        J(function() {
                            c.container && c.setSize(void 0, void 0, !1)
                        }, a ? 100 : 0);
                    c.containerWidth = k;
                    c.containerHeight = d
                }
            },
            initReflow: function() {
                var a = this,
                    b;
                b = D(O, "resize", function(b) {
                    a.reflow(b)
                });
                D(a, "destroy", b)
            },
            setSize: function(b, c, d) {
                var e = this,
                    w = e.renderer;
                e.isResizing += 1;
                a.setAnimation(d, e);
                e.oldChartHeight = e.chartHeight;
                e.oldChartWidth = e.chartWidth;
                void 0 !== b && (e.options.chart.width = b);
                void 0 !== c && (e.options.chart.height = c);
                e.getChartSize();
                b = w.globalAnimation;
                (b ? B : f)(e.container, {
                    width: e.chartWidth + "px",
                    height: e.chartHeight + "px"
                }, b);
                e.setChartSize(!0);
                w.setSize(e.chartWidth, e.chartHeight, d);
                k(e.axes, function(a) {
                    a.isDirty = !0;
                    a.setScale()
                });
                e.isDirtyLegend = !0;
                e.isDirtyBox = !0;
                e.layOutTitles();
                e.getMargins();
                e.setResponsive && e.setResponsive(!1);
                e.redraw(d);
                e.oldChartHeight = null;
                g(e, "resize");
                J(function() {
                    e && g(e, "endResize", null, function() {
                        --e.isResizing
                    })
                }, F(b).duration)
            },
            setChartSize: function(a) {
                var b = this.inverted,
                    c = this.renderer,
                    d = this.chartWidth,
                    e = this.chartHeight,
                    f = this.options.chart,
                    g = this.spacing,
                    w = this.clipOffset,
                    n, H, p, x;
                this.plotLeft = n = Math.round(this.plotLeft);
                this.plotTop = H = Math.round(this.plotTop);
                this.plotWidth = p = Math.max(0, Math.round(d - n - this.marginRight));
                this.plotHeight = x = Math.max(0, Math.round(e - H - this.marginBottom));
                this.plotSizeX = b ? x : p;
                this.plotSizeY = b ? p : x;
                this.plotBorderWidth = f.plotBorderWidth || 0;
                this.spacingBox = c.spacingBox = {
                    x: g[3],
                    y: g[0],
                    width: d - g[3] - g[1],
                    height: e - g[0] - g[2]
                };
                this.plotBox = c.plotBox = {
                    x: n,
                    y: H,
                    width: p,
                    height: x
                };
                d = 2 * Math.floor(this.plotBorderWidth / 2);
                b = Math.ceil(Math.max(d,
                    w[3]) / 2);
                c = Math.ceil(Math.max(d, w[0]) / 2);
                this.clipBox = {
                    x: b,
                    y: c,
                    width: Math.floor(this.plotSizeX - Math.max(d, w[1]) / 2 - b),
                    height: Math.max(0, Math.floor(this.plotSizeY - Math.max(d, w[2]) / 2 - c))
                };
                a || k(this.axes, function(a) {
                    a.setAxisSize();
                    a.setAxisTranslation()
                })
            },
            resetMargins: function() {
                var a = this,
                    b = a.options.chart;
                k(["margin", "spacing"], function(c) {
                    var d = b[c],
                        e = u(d) ? d : [d, d, d, d];
                    k(["Top", "Right", "Bottom", "Left"], function(d, f) {
                        a[c][f] = I(b[c + d], e[f])
                    })
                });
                k(y, function(b, c) {
                    a[b] = I(a.margin[c], a.spacing[c])
                });
                a.axisOffset = [0, 0, 0, 0];
                a.clipOffset = [0, 0, 0, 0]
            },
            drawChartBox: function() {
                var a = this.options.chart,
                    b = this.renderer,
                    c = this.chartWidth,
                    d = this.chartHeight,
                    e = this.chartBackground,
                    f = this.plotBackground,
                    g = this.plotBorder,
                    k, w = this.plotBGImage,
                    n = a.backgroundColor,
                    H = a.plotBackgroundColor,
                    p = a.plotBackgroundImage,
                    x, u = this.plotLeft,
                    K = this.plotTop,
                    l = this.plotWidth,
                    v = this.plotHeight,
                    y = this.plotBox,
                    h = this.clipRect,
                    m = this.clipBox,
                    z = "animate";
                e || (this.chartBackground = e = b.rect().addClass("highcharts-background").add(), z = "attr");
                k =
                    a.borderWidth || 0;
                x = k + (a.shadow ? 8 : 0);
                n = {
                    fill: n || "none"
                };
                if (k || e["stroke-width"]) n.stroke = a.borderColor, n["stroke-width"] = k;
                e.attr(n).shadow(a.shadow);
                e[z]({
                    x: x / 2,
                    y: x / 2,
                    width: c - x - k % 2,
                    height: d - x - k % 2,
                    r: a.borderRadius
                });
                z = "animate";
                f || (z = "attr", this.plotBackground = f = b.rect().addClass("highcharts-plot-background").add());
                f[z](y);
                f.attr({
                    fill: H || "none"
                }).shadow(a.plotShadow);
                p && (w ? w.animate(y) : this.plotBGImage = b.image(p, u, K, l, v).add());
                h ? h.animate({
                    width: m.width,
                    height: m.height
                }) : this.clipRect = b.clipRect(m);
                z = "animate";
                g || (z = "attr", this.plotBorder = g = b.rect().addClass("highcharts-plot-border").attr({
                    zIndex: 1
                }).add());
                g.attr({
                    stroke: a.plotBorderColor,
                    "stroke-width": a.plotBorderWidth || 0,
                    fill: "none"
                });
                g[z](g.crisp({
                    x: u,
                    y: K,
                    width: l,
                    height: v
                }, -g.strokeWidth()));
                this.isDirtyBox = !1
            },
            propFromSeries: function() {
                var a = this,
                    b = a.options.chart,
                    c, d = a.options.series,
                    e, f;
                k(["inverted", "angular", "polar"], function(g) {
                    c = K[b.type || b.defaultSeriesType];
                    f = b[g] || c && c.prototype[g];
                    for (e = d && d.length; !f && e--;)(c = K[d[e].type]) &&
                        c.prototype[g] && (f = !0);
                    a[g] = f
                })
            },
            linkSeries: function() {
                var a = this,
                    b = a.series;
                k(b, function(a) {
                    a.linkedSeries.length = 0
                });
                k(b, function(b) {
                    var c = b.options.linkedTo;
                    d(c) && (c = ":previous" === c ? a.series[b.index - 1] : a.get(c)) && c.linkedParent !== b && (c.linkedSeries.push(b), b.linkedParent = c, b.visible = I(b.options.visible, c.options.visible, b.visible))
                })
            },
            renderSeries: function() {
                k(this.series, function(a) {
                    a.translate();
                    a.render()
                })
            },
            renderLabels: function() {
                var a = this,
                    b = a.options.labels;
                b.items && k(b.items, function(c) {
                    var d =
                        p(b.style, c.style),
                        e = H(d.left) + a.plotLeft,
                        f = H(d.top) + a.plotTop + 12;
                    delete d.left;
                    delete d.top;
                    a.renderer.text(c.html, e, f).attr({
                        zIndex: 2
                    }).css(d).add()
                })
            },
            render: function() {
                var a = this.axes,
                    b = this.renderer,
                    c = this.options,
                    d, e, f;
                this.setTitle();
                this.legend = new C(this, c.legend);
                this.getStacks && this.getStacks();
                this.getMargins(!0);
                this.setChartSize();
                c = this.plotWidth;
                d = this.plotHeight -= 21;
                k(a, function(a) {
                    a.setScale()
                });
                this.getAxisMargins();
                e = 1.1 < c / this.plotWidth;
                f = 1.05 < d / this.plotHeight;
                if (e || f) k(a, function(a) {
                    (a.horiz &&
                        e || !a.horiz && f) && a.setTickInterval(!0)
                }), this.getMargins();
                this.drawChartBox();
                this.hasCartesianSeries && k(a, function(a) {
                    a.visible && a.render()
                });
                this.seriesGroup || (this.seriesGroup = b.g("series-group").attr({
                    zIndex: 3
                }).add());
                this.renderSeries();
                this.renderLabels();
                this.addCredits();
                this.setResponsive && this.setResponsive();
                this.hasRendered = !0
            },
            addCredits: function(a) {
                var b = this;
                a = v(!0, this.options.credits, a);
                a.enabled && !this.credits && (this.credits = this.renderer.text(a.text + (this.mapCredits || ""), 0, 0).addClass("highcharts-credits").on("click",
                    function() {
                        a.href && (O.location.href = a.href)
                    }).attr({
                    align: a.position.align,
                    zIndex: 8
                }).css(a.style).add().align(a.position), this.credits.update = function(a) {
                    b.credits = b.credits.destroy();
                    b.addCredits(a)
                })
            },
            destroy: function() {
                var b = this,
                    c = b.axes,
                    d = b.series,
                    e = b.container,
                    f, n = e && e.parentNode;
                g(b, "destroy");
                l[b.index] = void 0;
                a.chartCount--;
                b.renderTo.removeAttribute("data-highcharts-chart");
                w(b);
                for (f = c.length; f--;) c[f] = c[f].destroy();
                this.scroller && this.scroller.destroy && this.scroller.destroy();
                for (f =
                    d.length; f--;) d[f] = d[f].destroy();
                k("title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" "), function(a) {
                    var c = b[a];
                    c && c.destroy && (b[a] = c.destroy())
                });
                e && (e.innerHTML = "", w(e), n && q(e));
                for (f in b) delete b[f]
            },
            isReadyToRender: function() {
                var a = this;
                return x || O != O.top || "complete" === r.readyState ? !0 : (r.attachEvent("onreadystatechange", function() {
                    r.detachEvent("onreadystatechange", a.firstRender);
                    "complete" === r.readyState && a.firstRender()
                }), !1)
            },
            firstRender: function() {
                var a = this,
                    b = a.options;
                if (a.isReadyToRender()) {
                    a.getContainer();
                    g(a, "init");
                    a.resetMargins();
                    a.setChartSize();
                    a.propFromSeries();
                    a.getAxes();
                    k(b.series || [], function(b) {
                        a.initSeries(b)
                    });
                    a.linkSeries();
                    g(a, "beforeRender");
                    E && (a.pointer = new E(a, b));
                    a.render();
                    a.renderer.draw();
                    if (!a.renderer.imgCount && a.onload) a.onload();
                    a.cloneRenderTo(!0)
                }
            },
            onload: function() {
                k([this.callback].concat(this.callbacks), function(a) {
                    a && void 0 !== this.index &&
                        a.apply(this, [this])
                }, this);
                g(this, "load");
                !1 !== this.options.chart.reflow && this.initReflow();
                this.onload = null
            }
        }
    })(N);
    (function(a) {
        var D, B = a.each,
            F = a.extend,
            G = a.erase,
            r = a.fireEvent,
            h = a.format,
            m = a.isArray,
            t = a.isNumber,
            q = a.pick,
            l = a.removeEvent;
        D = a.Point = function() {};
        D.prototype = {
            init: function(a, b, k) {
                this.series = a;
                this.color = a.color;
                this.applyOptions(b, k);
                a.options.colorByPoint ? (b = a.options.colors || a.chart.options.colors, this.color = this.color || b[a.colorCounter], b = b.length, k = a.colorCounter, a.colorCounter++,
                    a.colorCounter === b && (a.colorCounter = 0)) : k = a.colorIndex;
                this.colorIndex = q(this.colorIndex, k);
                a.chart.pointCount++;
                return this
            },
            applyOptions: function(a, b) {
                var f = this.series,
                    l = f.options.pointValKey || f.pointValKey;
                a = D.prototype.optionsToObject.call(this, a);
                F(this, a);
                this.options = this.options ? F(this.options, a) : a;
                a.group && delete this.group;
                l && (this.y = this[l]);
                this.isNull = q(this.isValid && !this.isValid(), null === this.x || !t(this.y, !0));
                this.selected && (this.state = "select");
                "name" in this && void 0 === b && f.xAxis &&
                    f.xAxis.hasNames && (this.x = f.xAxis.nameToX(this));
                void 0 === this.x && f && (this.x = void 0 === b ? f.autoIncrement(this) : b);
                return this
            },
            optionsToObject: function(a) {
                var b = {},
                    f = this.series,
                    l = f.options.keys,
                    p = l || f.pointArrayMap || ["y"],
                    g = p.length,
                    e = 0,
                    c = 0;
                if (t(a) || null === a) b[p[0]] = a;
                else if (m(a))
                    for (!l && a.length > g && (f = typeof a[0], "string" === f ? b.name = a[0] : "number" === f && (b.x = a[0]), e++); c < g;) l && void 0 === a[e] || (b[p[c]] = a[e]), e++, c++;
                else "object" === typeof a && (b = a, a.dataLabels && (f._hasPointLabels = !0), a.marker && (f._hasPointMarkers = !0));
                return b
            },
            getClassName: function() {
                return "highcharts-point" + (this.selected ? " highcharts-point-select" : "") + (this.negative ? " highcharts-negative" : "") + (this.isNull ? " highcharts-null-point" : "") + (void 0 !== this.colorIndex ? " highcharts-color-" + this.colorIndex : "") + (this.options.className ? " " + this.options.className : "")
            },
            getZone: function() {
                var a = this.series,
                    b = a.zones,
                    a = a.zoneAxis || "y",
                    k = 0,
                    l;
                for (l = b[k]; this[a] >= l.value;) l = b[++k];
                l && l.color && !this.options.color && (this.color = l.color);
                return l
            },
            destroy: function() {
                var a =
                    this.series.chart,
                    b = a.hoverPoints,
                    k;
                a.pointCount--;
                b && (this.setState(), G(b, this), b.length || (a.hoverPoints = null));
                if (this === a.hoverPoint) this.onMouseOut();
                if (this.graphic || this.dataLabel) l(this), this.destroyElements();
                this.legendItem && a.legend.destroyItem(this);
                for (k in this) this[k] = null
            },
            destroyElements: function() {
                for (var a = ["graphic", "dataLabel", "dataLabelUpper", "connector", "shadowGroup"], b, k = 6; k--;) b = a[k], this[b] && (this[b] = this[b].destroy())
            },
            getLabelConfig: function() {
                return {
                    x: this.category,
                    y: this.y,
                    color: this.color,
                    key: this.name || this.category,
                    series: this.series,
                    point: this,
                    percentage: this.percentage,
                    total: this.total || this.stackTotal
                }
            },
            tooltipFormatter: function(a) {
                var b = this.series,
                    f = b.tooltipOptions,
                    l = q(f.valueDecimals, ""),
                    p = f.valuePrefix || "",
                    g = f.valueSuffix || "";
                B(b.pointArrayMap || ["y"], function(b) {
                    b = "{point." + b;
                    if (p || g) a = a.replace(b + "}", p + b + "}" + g);
                    a = a.replace(b + "}", b + ":,." + l + "f}")
                });
                return h(a, {
                    point: this,
                    series: this.series
                })
            },
            firePointEvent: function(a, b, k) {
                var f = this,
                    p = this.series.options;
                (p.point.events[a] || f.options && f.options.events && f.options.events[a]) && this.importEvents();
                "click" === a && p.allowPointSelect && (k = function(a) {
                    f.select && f.select(null, a.ctrlKey || a.metaKey || a.shiftKey)
                });
                r(this, a, b, k)
            },
            visible: !0
        }
    })(N);
    (function(a) {
        var D = a.addEvent,
            B = a.animObject,
            F = a.arrayMax,
            G = a.arrayMin,
            r = a.correctFloat,
            h = a.Date,
            m = a.defaultOptions,
            t = a.defaultPlotOptions,
            q = a.defined,
            l = a.each,
            f = a.erase,
            b = a.error,
            k = a.extend,
            z = a.fireEvent,
            p = a.grep,
            g = a.isArray,
            e = a.isNumber,
            c = a.isString,
            n = a.merge,
            u = a.pick,
            d = a.removeEvent,
            C = a.splat,
            y = a.stableSort,
            v = a.SVGElement,
            E = a.syncTimeout,
            I = a.win;
        a.Series = a.seriesType("line", null, {
            lineWidth: 2,
            allowPointSelect: !1,
            showCheckbox: !1,
            animation: {
                duration: 1E3
            },
            events: {},
            marker: {
                lineWidth: 0,
                lineColor: "#ffffff",
                radius: 4,
                states: {
                    hover: {
                        animation: {
                            duration: 50
                        },
                        enabled: !0,
                        radiusPlus: 2,
                        lineWidthPlus: 1
                    },
                    select: {
                        fillColor: "#cccccc",
                        lineColor: "#000000",
                        lineWidth: 2
                    }
                }
            },
            point: {
                events: {}
            },
            dataLabels: {
                align: "center",
                formatter: function() {
                    return null === this.y ? "" : a.numberFormat(this.y, -1)
                },
                style: {
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "contrast",
                    textOutline: "1px contrast"
                },
                verticalAlign: "bottom",
                x: 0,
                y: 0,
                padding: 5
            },
            cropThreshold: 300,
            pointRange: 0,
            softThreshold: !0,
            states: {
                hover: {
                    lineWidthPlus: 1,
                    marker: {},
                    halo: {
                        size: 10,
                        opacity: .25
                    }
                },
                select: {
                    marker: {}
                }
            },
            stickyTracking: !0,
            turboThreshold: 1E3
        }, {
            isCartesian: !0,
            pointClass: a.Point,
            sorted: !0,
            requireSorting: !0,
            directTouch: !1,
            axisTypes: ["xAxis", "yAxis"],
            colorCounter: 0,
            parallelArrays: ["x", "y"],
            coll: "series",
            init: function(a, b) {
                var c = this,
                    d, e,
                    f = a.series,
                    g, w = function(a, b) {
                        return u(a.options.index, a._i) - u(b.options.index, b._i)
                    };
                c.chart = a;
                c.options = b = c.setOptions(b);
                c.linkedSeries = [];
                c.bindAxes();
                k(c, {
                    name: b.name,
                    state: "",
                    visible: !1 !== b.visible,
                    selected: !0 === b.selected
                });
                e = b.events;
                for (d in e) D(c, d, e[d]);
                if (e && e.click || b.point && b.point.events && b.point.events.click || b.allowPointSelect) a.runTrackerClick = !0;
                c.getColor();
                c.getSymbol();
                l(c.parallelArrays, function(a) {
                    c[a + "Data"] = []
                });
                c.setData(b.data, !1);
                c.isCartesian && (a.hasCartesianSeries = !0);
                f.length && (g = f[f.length - 1]);
                c._i = u(g && g._i, -1) + 1;
                f.push(c);
                y(f, w);
                this.yAxis && y(this.yAxis.series, w);
                l(f, function(a, b) {
                    a.index = b;
                    a.name = a.name || "Series " + (b + 1)
                })
            },
            bindAxes: function() {
                var a = this,
                    c = a.options,
                    d = a.chart,
                    e;
                l(a.axisTypes || [], function(f) {
                    l(d[f], function(b) {
                        e = b.options;
                        if (c[f] === e.index || void 0 !== c[f] && c[f] === e.id || void 0 === c[f] && 0 === e.index) b.series.push(a), a[f] = b, b.isDirty = !0
                    });
                    a[f] || a.optionalAxis === f || b(18, !0)
                })
            },
            updateParallelArrays: function(a, b) {
                var c = a.series,
                    d = arguments,
                    f = e(b) ? function(d) {
                        var e =
                            "y" === d && c.toYData ? c.toYData(a) : a[d];
                        c[d + "Data"][b] = e
                    } : function(a) {
                        Array.prototype[b].apply(c[a + "Data"], Array.prototype.slice.call(d, 2))
                    };
                l(c.parallelArrays, f)
            },
            autoIncrement: function() {
                var a = this.options,
                    b = this.xIncrement,
                    c, d = a.pointIntervalUnit,
                    b = u(b, a.pointStart, 0);
                this.pointInterval = c = u(this.pointInterval, a.pointInterval, 1);
                d && (a = new h(b), "day" === d ? a = +a[h.hcSetDate](a[h.hcGetDate]() + c) : "month" === d ? a = +a[h.hcSetMonth](a[h.hcGetMonth]() + c) : "year" === d && (a = +a[h.hcSetFullYear](a[h.hcGetFullYear]() +
                    c)), c = a - b);
                this.xIncrement = b + c;
                return b
            },
            setOptions: function(a) {
                var b = this.chart,
                    c = b.options.plotOptions,
                    b = b.userOptions || {},
                    d = b.plotOptions || {},
                    e = c[this.type];
                this.userOptions = a;
                c = n(e, c.series, a);
                this.tooltipOptions = n(m.tooltip, m.plotOptions[this.type].tooltip, b.tooltip, d.series && d.series.tooltip, d[this.type] && d[this.type].tooltip, a.tooltip);
                null === e.marker && delete c.marker;
                this.zoneAxis = c.zoneAxis;
                a = this.zones = (c.zones || []).slice();
                !c.negativeColor && !c.negativeFillColor || c.zones || a.push({
                    value: c[this.zoneAxis +
                        "Threshold"] || c.threshold || 0,
                    className: "highcharts-negative",
                    color: c.negativeColor,
                    fillColor: c.negativeFillColor
                });
                a.length && q(a[a.length - 1].value) && a.push({
                    color: this.color,
                    fillColor: this.fillColor
                });
                return c
            },
            getCyclic: function(a, b, c) {
                var d, e = this.userOptions,
                    f = a + "Index",
                    g = a + "Counter",
                    k = c ? c.length : u(this.chart.options.chart[a + "Count"], this.chart[a + "Count"]);
                b || (d = u(e[f], e["_" + f]), q(d) || (e["_" + f] = d = this.chart[g] % k, this.chart[g] += 1), c && (b = c[d]));
                void 0 !== d && (this[f] = d);
                this[a] = b
            },
            getColor: function() {
                this.options.colorByPoint ?
                    this.options.color = null : this.getCyclic("color", this.options.color || t[this.type].color, this.chart.options.colors)
            },
            getSymbol: function() {
                this.getCyclic("symbol", this.options.marker.symbol, this.chart.options.symbols)
            },
            drawLegendSymbol: a.LegendSymbolMixin.drawLineMarker,
            setData: function(a, d, f, k) {
                var w = this,
                    n = w.points,
                    p = n && n.length || 0,
                    v, H = w.options,
                    y = w.chart,
                    h = null,
                    m = w.xAxis,
                    E = H.turboThreshold,
                    z = this.xData,
                    C = this.yData,
                    K = (v = w.pointArrayMap) && v.length;
                a = a || [];
                v = a.length;
                d = u(d, !0);
                if (!1 !== k && v && p === v && !w.cropped &&
                    !w.hasGroupedData && w.visible) l(a, function(a, b) {
                    n[b].update && a !== H.data[b] && n[b].update(a, !1, null, !1)
                });
                else {
                    w.xIncrement = null;
                    w.colorCounter = 0;
                    l(this.parallelArrays, function(a) {
                        w[a + "Data"].length = 0
                    });
                    if (E && v > E) {
                        for (f = 0; null === h && f < v;) h = a[f], f++;
                        if (e(h))
                            for (f = 0; f < v; f++) z[f] = this.autoIncrement(), C[f] = a[f];
                        else if (g(h))
                            if (K)
                                for (f = 0; f < v; f++) h = a[f], z[f] = h[0], C[f] = h.slice(1, K + 1);
                            else
                                for (f = 0; f < v; f++) h = a[f], z[f] = h[0], C[f] = h[1];
                        else b(12)
                    } else
                        for (f = 0; f < v; f++) void 0 !== a[f] && (h = {
                            series: w
                        }, w.pointClass.prototype.applyOptions.apply(h, [a[f]]), w.updateParallelArrays(h, f));
                    c(C[0]) && b(14, !0);
                    w.data = [];
                    w.options.data = w.userOptions.data = a;
                    for (f = p; f--;) n[f] && n[f].destroy && n[f].destroy();
                    m && (m.minRange = m.userMinRange);
                    w.isDirty = y.isDirtyBox = !0;
                    w.isDirtyData = !!n;
                    f = !1
                }
                "point" === H.legendType && (this.processData(), this.generatePoints());
                d && y.redraw(f)
            },
            processData: function(a) {
                var c = this.xData,
                    d = this.yData,
                    e = c.length,
                    f;
                f = 0;
                var g, k, n = this.xAxis,
                    p, l = this.options;
                p = l.cropThreshold;
                var v = this.getExtremesFromAll || l.getExtremesFromAll,
                    u = this.isCartesian,
                    l = n && n.val2lin,
                    H = n && n.isLog,
                    y, h;
                if (u && !this.isDirty && !n.isDirty && !this.yAxis.isDirty && !a) return !1;
                n && (a = n.getExtremes(), y = a.min, h = a.max);
                if (u && this.sorted && !v && (!p || e > p || this.forceCrop))
                    if (c[e - 1] < y || c[0] > h) c = [], d = [];
                    else if (c[0] < y || c[e - 1] > h) f = this.cropData(this.xData, this.yData, y, h), c = f.xData, d = f.yData, f = f.start, g = !0;
                for (p = c.length || 1; --p;) e = H ? l(c[p]) - l(c[p - 1]) : c[p] - c[p - 1], 0 < e && (void 0 === k || e < k) ? k = e : 0 > e && this.requireSorting && b(15);
                this.cropped = g;
                this.cropStart = f;
                this.processedXData = c;
                this.processedYData =
                    d;
                this.closestPointRange = k
            },
            cropData: function(a, b, c, d) {
                var e = a.length,
                    f = 0,
                    g = e,
                    k = u(this.cropShoulder, 1),
                    w;
                for (w = 0; w < e; w++)
                    if (a[w] >= c) {
                        f = Math.max(0, w - k);
                        break
                    }
                for (c = w; c < e; c++)
                    if (a[c] > d) {
                        g = c + k;
                        break
                    }
                return {
                    xData: a.slice(f, g),
                    yData: b.slice(f, g),
                    start: f,
                    end: g
                }
            },
            generatePoints: function() {
                var a = this.options.data,
                    b = this.data,
                    c, d = this.processedXData,
                    e = this.processedYData,
                    f = this.pointClass,
                    g = d.length,
                    k = this.cropStart || 0,
                    n, p = this.hasGroupedData,
                    l, v = [],
                    u;
                b || p || (b = [], b.length = a.length, b = this.data = b);
                for (u = 0; u <
                    g; u++) n = k + u, p ? (l = (new f).init(this, [d[u]].concat(C(e[u]))), l.dataGroup = this.groupMap[u]) : (l = b[n]) || void 0 === a[n] || (b[n] = l = (new f).init(this, a[n], d[u])), l.index = n, v[u] = l;
                if (b && (g !== (c = b.length) || p))
                    for (u = 0; u < c; u++) u !== k || p || (u += g), b[u] && (b[u].destroyElements(), b[u].plotX = void 0);
                this.data = b;
                this.points = v
            },
            getExtremes: function(a) {
                var b = this.yAxis,
                    c = this.processedXData,
                    d, f = [],
                    k = 0;
                d = this.xAxis.getExtremes();
                var n = d.min,
                    p = d.max,
                    l, u, v, y;
                a = a || this.stackedYData || this.processedYData || [];
                d = a.length;
                for (y = 0; y <
                    d; y++)
                    if (u = c[y], v = a[y], l = (e(v, !0) || g(v)) && (!b.isLog || v.length || 0 < v), u = this.getExtremesFromAll || this.options.getExtremesFromAll || this.cropped || (c[y + 1] || u) >= n && (c[y - 1] || u) <= p, l && u)
                        if (l = v.length)
                            for (; l--;) null !== v[l] && (f[k++] = v[l]);
                        else f[k++] = v;
                this.dataMin = G(f);
                this.dataMax = F(f)
            },
            translate: function() {
                this.processedXData || this.processData();
                this.generatePoints();
                var a = this.options,
                    b = a.stacking,
                    c = this.xAxis,
                    d = c.categories,
                    f = this.yAxis,
                    g = this.points,
                    k = g.length,
                    n = !!this.modifyValue,
                    p = a.pointPlacement,
                    l = "between" === p || e(p),
                    v = a.threshold,
                    y = a.startFromThreshold ? v : 0,
                    h, m, E, z, C = Number.MAX_VALUE;
                "between" === p && (p = .5);
                e(p) && (p *= u(a.pointRange || c.pointRange));
                for (a = 0; a < k; a++) {
                    var I = g[a],
                        t = I.x,
                        B = I.y;
                    m = I.low;
                    var D = b && f.stacks[(this.negStacks && B < (y ? 0 : v) ? "-" : "") + this.stackKey],
                        F;
                    f.isLog && null !== B && 0 >= B && (I.isNull = !0);
                    I.plotX = h = r(Math.min(Math.max(-1E5, c.translate(t, 0, 0, 0, 1, p, "flags" === this.type)), 1E5));
                    b && this.visible && !I.isNull && D && D[t] && (z = this.getStackIndicator(z, t, this.index), F = D[t], B = F.points[z.key],
                        m = B[0], B = B[1], m === y && z.key === D[t].base && (m = u(v, f.min)), f.isLog && 0 >= m && (m = null), I.total = I.stackTotal = F.total, I.percentage = F.total && I.y / F.total * 100, I.stackY = B, F.setOffset(this.pointXOffset || 0, this.barW || 0));
                    I.yBottom = q(m) ? f.translate(m, 0, 1, 0, 1) : null;
                    n && (B = this.modifyValue(B, I));
                    I.plotY = m = "number" === typeof B && Infinity !== B ? Math.min(Math.max(-1E5, f.translate(B, 0, 1, 0, 1)), 1E5) : void 0;
                    I.isInside = void 0 !== m && 0 <= m && m <= f.len && 0 <= h && h <= c.len;
                    I.clientX = l ? r(c.translate(t, 0, 0, 0, 1, p)) : h;
                    I.negative = I.y < (v || 0);
                    I.category =
                        d && void 0 !== d[I.x] ? d[I.x] : I.x;
                    I.isNull || (void 0 !== E && (C = Math.min(C, Math.abs(h - E))), E = h)
                }
                this.closestPointRangePx = C
            },
            getValidPoints: function(a, b) {
                var c = this.chart;
                return p(a || this.points || [], function(a) {
                    return b && !c.isInsidePlot(a.plotX, a.plotY, c.inverted) ? !1 : !a.isNull
                })
            },
            setClip: function(a) {
                var b = this.chart,
                    c = this.options,
                    d = b.renderer,
                    e = b.inverted,
                    f = this.clipBox,
                    g = f || b.clipBox,
                    k = this.sharedClipKey || ["_sharedClip", a && a.duration, a && a.easing, g.height, c.xAxis, c.yAxis].join(),
                    n = b[k],
                    p = b[k + "m"];
                n || (a &&
                    (g.width = 0, b[k + "m"] = p = d.clipRect(-99, e ? -b.plotLeft : -b.plotTop, 99, e ? b.chartWidth : b.chartHeight)), b[k] = n = d.clipRect(g), n.count = {
                        length: 0
                    });
                a && !n.count[this.index] && (n.count[this.index] = !0, n.count.length += 1);
                !1 !== c.clip && (this.group.clip(a || f ? n : b.clipRect), this.markerGroup.clip(p), this.sharedClipKey = k);
                a || (n.count[this.index] && (delete n.count[this.index], --n.count.length), 0 === n.count.length && k && b[k] && (f || (b[k] = b[k].destroy()), b[k + "m"] && (b[k + "m"] = b[k + "m"].destroy())))
            },
            animate: function(a) {
                var b = this.chart,
                    c = B(this.options.animation),
                    d;
                a ? this.setClip(c) : (d = this.sharedClipKey, (a = b[d]) && a.animate({
                    width: b.plotSizeX
                }, c), b[d + "m"] && b[d + "m"].animate({
                    width: b.plotSizeX + 99
                }, c), this.animate = null)
            },
            afterAnimate: function() {
                this.setClip();
                z(this, "afterAnimate")
            },
            drawPoints: function() {
                var a = this.points,
                    b = this.chart,
                    c, d, f, g, k = this.options.marker,
                    n, p, l, v, y = this.markerGroup,
                    h = u(k.enabled, this.xAxis.isRadial ? !0 : null, this.closestPointRangePx > 2 * k.radius);
                if (!1 !== k.enabled || this._hasPointMarkers)
                    for (d = a.length; d--;) f =
                        a[d], c = f.plotY, g = f.graphic, n = f.marker || {}, p = !!f.marker, l = h && void 0 === n.enabled || n.enabled, v = f.isInside, l && e(c) && null !== f.y ? (c = u(n.symbol, this.symbol), f.hasImage = 0 === c.indexOf("url"), l = this.markerAttribs(f, f.selected && "select"), g ? g[v ? "show" : "hide"](!0).animate(l) : v && (0 < l.width || f.hasImage) && (f.graphic = g = b.renderer.symbol(c, l.x, l.y, l.width, l.height, p ? n : k).add(y)), g && g.attr(this.pointAttribs(f, f.selected && "select")), g && g.addClass(f.getClassName(), !0)) : g && (f.graphic = g.destroy())
            },
            markerAttribs: function(a,
                b) {
                var c = this.options.marker,
                    d = a && a.options,
                    e = d && d.marker || {},
                    d = u(e.radius, c.radius);
                b && (c = c.states[b], b = e.states && e.states[b], d = u(b && b.radius, c && c.radius, d + (c && c.radiusPlus || 0)));
                a.hasImage && (d = 0);
                a = {
                    x: Math.floor(a.plotX) - d,
                    y: a.plotY - d
                };
                d && (a.width = a.height = 2 * d);
                return a
            },
            pointAttribs: function(a, b) {
                var c = this.options.marker,
                    d = a && a.options,
                    e = d && d.marker || {},
                    f = this.color,
                    g = d && d.color,
                    k = a && a.color,
                    d = u(e.lineWidth, c.lineWidth),
                    n;
                a && this.zones.length && (a = a.getZone()) && a.color && (n = a.color);
                f = g || n || k ||
                    f;
                n = e.fillColor || c.fillColor || f;
                f = e.lineColor || c.lineColor || f;
                b && (c = c.states[b], b = e.states && e.states[b] || {}, d = u(b.lineWidth, c.lineWidth, d + u(b.lineWidthPlus, c.lineWidthPlus, 0)), n = b.fillColor || c.fillColor || n, f = b.lineColor || c.lineColor || f);
                return {
                    stroke: f,
                    "stroke-width": d,
                    fill: n
                }
            },
            destroy: function() {
                var a = this,
                    b = a.chart,
                    c = /AppleWebKit\/533/.test(I.navigator.userAgent),
                    e, g = a.data || [],
                    k, n, p;
                z(a, "destroy");
                d(a);
                l(a.axisTypes || [], function(b) {
                    (p = a[b]) && p.series && (f(p.series, a), p.isDirty = p.forceRedraw = !0)
                });
                a.legendItem && a.chart.legend.destroyItem(a);
                for (e = g.length; e--;)(k = g[e]) && k.destroy && k.destroy();
                a.points = null;
                clearTimeout(a.animationTimeout);
                for (n in a) a[n] instanceof v && !a[n].survive && (e = c && "group" === n ? "hide" : "destroy", a[n][e]());
                b.hoverSeries === a && (b.hoverSeries = null);
                f(b.series, a);
                for (n in a) delete a[n]
            },
            getGraphPath: function(a, b, c) {
                var d = this,
                    e = d.options,
                    f = e.step,
                    g, k = [],
                    n = [],
                    p;
                a = a || d.points;
                (g = a.reversed) && a.reverse();
                (f = {
                    right: 1,
                    center: 2
                }[f] || f && 3) && g && (f = 4 - f);
                !e.connectNulls || b || c || (a = this.getValidPoints(a));
                l(a, function(g, w) {
                    var l = g.plotX,
                        u = g.plotY,
                        v = a[w - 1];
                    (g.leftCliff || v && v.rightCliff) && !c && (p = !0);
                    g.isNull && !q(b) && 0 < w ? p = !e.connectNulls : g.isNull && !b ? p = !0 : (0 === w || p ? w = ["M", g.plotX, g.plotY] : d.getPointSpline ? w = d.getPointSpline(a, g, w) : f ? (w = 1 === f ? ["L", v.plotX, u] : 2 === f ? ["L", (v.plotX + l) / 2, v.plotY, "L", (v.plotX + l) / 2, u] : ["L", l, v.plotY], w.push("L", l, u)) : w = ["L", l, u], n.push(g.x), f && n.push(g.x), k.push.apply(k, w), p = !1)
                });
                k.xMap = n;
                return d.graphPath = k
            },
            drawGraph: function() {
                var a = this,
                    b = this.options,
                    c = (this.gappedPath ||
                        this.getGraphPath).call(this),
                    d = [
                        ["graph", "highcharts-graph", b.lineColor || this.color, b.dashStyle]
                    ];
                l(this.zones, function(c, e) {
                    d.push(["zone-graph-" + e, "highcharts-graph highcharts-zone-graph-" + e + " " + (c.className || ""), c.color || a.color, c.dashStyle || b.dashStyle])
                });
                l(d, function(d, e) {
                    var f = d[0],
                        g = a[f];
                    g ? (g.endX = c.xMap, g.animate({
                        d: c
                    })) : c.length && (a[f] = a.chart.renderer.path(c).addClass(d[1]).attr({
                            zIndex: 1
                        }).add(a.group), g = {
                            stroke: d[2],
                            "stroke-width": b.lineWidth,
                            fill: a.fillGraph && a.color || "none"
                        }, d[3] ?
                        g.dashstyle = d[3] : "square" !== b.linecap && (g["stroke-linecap"] = g["stroke-linejoin"] = "round"), g = a[f].attr(g).shadow(2 > e && b.shadow));
                    g && (g.startX = c.xMap, g.isArea = c.isArea)
                })
            },
            applyZones: function() {
                var a = this,
                    b = this.chart,
                    c = b.renderer,
                    d = this.zones,
                    e, f, g = this.clips || [],
                    k, n = this.graph,
                    p = this.area,
                    v = Math.max(b.chartWidth, b.chartHeight),
                    y = this[(this.zoneAxis || "y") + "Axis"],
                    h, m, E = b.inverted,
                    z, C, I, q, r = !1;
                d.length && (n || p) && y && void 0 !== y.min && (m = y.reversed, z = y.horiz, n && n.hide(), p && p.hide(), h = y.getExtremes(), l(d,
                    function(d, l) {
                        e = m ? z ? b.plotWidth : 0 : z ? 0 : y.toPixels(h.min);
                        e = Math.min(Math.max(u(f, e), 0), v);
                        f = Math.min(Math.max(Math.round(y.toPixels(u(d.value, h.max), !0)), 0), v);
                        r && (e = f = y.toPixels(h.max));
                        C = Math.abs(e - f);
                        I = Math.min(e, f);
                        q = Math.max(e, f);
                        y.isXAxis ? (k = {
                            x: E ? q : I,
                            y: 0,
                            width: C,
                            height: v
                        }, z || (k.x = b.plotHeight - k.x)) : (k = {
                            x: 0,
                            y: E ? q : I,
                            width: v,
                            height: C
                        }, z && (k.y = b.plotWidth - k.y));
                        E && c.isVML && (k = y.isXAxis ? {
                            x: 0,
                            y: m ? I : q,
                            height: k.width,
                            width: b.chartWidth
                        } : {
                            x: k.y - b.plotLeft - b.spacingBox.x,
                            y: 0,
                            width: k.height,
                            height: b.chartHeight
                        });
                        g[l] ? g[l].animate(k) : (g[l] = c.clipRect(k), n && a["zone-graph-" + l].clip(g[l]), p && a["zone-area-" + l].clip(g[l]));
                        r = d.value > h.max
                    }), this.clips = g)
            },
            invertGroups: function(a) {
                function b() {
                    var b = {
                        width: c.yAxis.len,
                        height: c.xAxis.len
                    };
                    l(["group", "markerGroup"], function(d) {
                        c[d] && c[d].attr(b).invert(a)
                    })
                }
                var c = this,
                    d;
                c.xAxis && (d = D(c.chart, "resize", b), D(c, "destroy", d), b(a), c.invertGroups = b)
            },
            plotGroup: function(a, b, c, d, e) {
                var f = this[a],
                    g = !f;
                g && (this[a] = f = this.chart.renderer.g(b).attr({
                    zIndex: d || .1
                }).add(e), f.addClass("highcharts-series-" +
                    this.index + " highcharts-" + this.type + "-series highcharts-color-" + this.colorIndex + " " + (this.options.className || "")));
                f.attr({
                    visibility: c
                })[g ? "attr" : "animate"](this.getPlotBox());
                return f
            },
            getPlotBox: function() {
                var a = this.chart,
                    b = this.xAxis,
                    c = this.yAxis;
                a.inverted && (b = c, c = this.xAxis);
                return {
                    translateX: b ? b.left : a.plotLeft,
                    translateY: c ? c.top : a.plotTop,
                    scaleX: 1,
                    scaleY: 1
                }
            },
            render: function() {
                var a = this,
                    b = a.chart,
                    c, d = a.options,
                    e = !!a.animate && b.renderer.isSVG && B(d.animation).duration,
                    f = a.visible ? "inherit" :
                    "hidden",
                    g = d.zIndex,
                    k = a.hasRendered,
                    n = b.seriesGroup,
                    p = b.inverted;
                c = a.plotGroup("group", "series", f, g, n);
                a.markerGroup = a.plotGroup("markerGroup", "markers", f, g, n);
                e && a.animate(!0);
                c.inverted = a.isCartesian ? p : !1;
                a.drawGraph && (a.drawGraph(), a.applyZones());
                a.drawDataLabels && a.drawDataLabels();
                a.visible && a.drawPoints();
                a.drawTracker && !1 !== a.options.enableMouseTracking && a.drawTracker();
                a.invertGroups(p);
                !1 === d.clip || a.sharedClipKey || k || c.clip(b.clipRect);
                e && a.animate();
                k || (a.animationTimeout = E(function() {
                        a.afterAnimate()
                    },
                    e));
                a.isDirty = a.isDirtyData = !1;
                a.hasRendered = !0
            },
            redraw: function() {
                var a = this.chart,
                    b = this.isDirty || this.isDirtyData,
                    c = this.group,
                    d = this.xAxis,
                    e = this.yAxis;
                c && (a.inverted && c.attr({
                    width: a.plotWidth,
                    height: a.plotHeight
                }), c.animate({
                    translateX: u(d && d.left, a.plotLeft),
                    translateY: u(e && e.top, a.plotTop)
                }));
                this.translate();
                this.render();
                b && delete this.kdTree
            },
            kdDimensions: 1,
            kdAxisArray: ["clientX", "plotY"],
            searchPoint: function(a, b) {
                var c = this.xAxis,
                    d = this.yAxis,
                    e = this.chart.inverted;
                return this.searchKDTree({
                    clientX: e ?
                        c.len - a.chartY + c.pos : a.chartX - c.pos,
                    plotY: e ? d.len - a.chartX + d.pos : a.chartY - d.pos
                }, b)
            },
            buildKDTree: function() {
                function a(c, d, e) {
                    var f, g;
                    if (g = c && c.length) return f = b.kdAxisArray[d % e], c.sort(function(a, b) {
                        return a[f] - b[f]
                    }), g = Math.floor(g / 2), {
                        point: c[g],
                        left: a(c.slice(0, g), d + 1, e),
                        right: a(c.slice(g + 1), d + 1, e)
                    }
                }
                var b = this,
                    c = b.kdDimensions;
                delete b.kdTree;
                E(function() {
                    b.kdTree = a(b.getValidPoints(null, !b.directTouch), c, c)
                }, b.options.kdNow ? 0 : 1)
            },
            searchKDTree: function(a, b) {
                function c(a, b, k, n) {
                    var p = b.point,
                        l =
                        d.kdAxisArray[k % n],
                        v, u, w = p;
                    u = q(a[e]) && q(p[e]) ? Math.pow(a[e] - p[e], 2) : null;
                    v = q(a[f]) && q(p[f]) ? Math.pow(a[f] - p[f], 2) : null;
                    v = (u || 0) + (v || 0);
                    p.dist = q(v) ? Math.sqrt(v) : Number.MAX_VALUE;
                    p.distX = q(u) ? Math.sqrt(u) : Number.MAX_VALUE;
                    l = a[l] - p[l];
                    v = 0 > l ? "left" : "right";
                    u = 0 > l ? "right" : "left";
                    b[v] && (v = c(a, b[v], k + 1, n), w = v[g] < w[g] ? v : p);
                    b[u] && Math.sqrt(l * l) < w[g] && (a = c(a, b[u], k + 1, n), w = a[g] < w[g] ? a : w);
                    return w
                }
                var d = this,
                    e = this.kdAxisArray[0],
                    f = this.kdAxisArray[1],
                    g = b ? "distX" : "dist";
                this.kdTree || this.buildKDTree();
                if (this.kdTree) return c(a,
                    this.kdTree, this.kdDimensions, this.kdDimensions)
            }
        })
    })(N);
    (function(a) {
        function D(a, f, b, k, h) {
            var p = a.chart.inverted;
            this.axis = a;
            this.isNegative = b;
            this.options = f;
            this.x = k;
            this.total = null;
            this.points = {};
            this.stack = h;
            this.rightCliff = this.leftCliff = 0;
            this.alignOptions = {
                align: f.align || (p ? b ? "left" : "right" : "center"),
                verticalAlign: f.verticalAlign || (p ? "middle" : b ? "bottom" : "top"),
                y: q(f.y, p ? 4 : b ? 14 : -6),
                x: q(f.x, p ? b ? -6 : 6 : 0)
            };
            this.textAlign = f.textAlign || (p ? b ? "right" : "left" : "center")
        }
        var B = a.Axis,
            F = a.Chart,
            G = a.correctFloat,
            r = a.defined,
            h = a.destroyObjectProperties,
            m = a.each,
            t = a.format,
            q = a.pick;
        a = a.Series;
        D.prototype = {
            destroy: function() {
                h(this, this.axis)
            },
            render: function(a) {
                var f = this.options,
                    b = f.format,
                    b = b ? t(b, this) : f.formatter.call(this);
                this.label ? this.label.attr({
                    text: b,
                    visibility: "hidden"
                }) : this.label = this.axis.chart.renderer.text(b, null, null, f.useHTML).css(f.style).attr({
                    align: this.textAlign,
                    rotation: f.rotation,
                    visibility: "hidden"
                }).add(a)
            },
            setOffset: function(a, f) {
                var b = this.axis,
                    k = b.chart,
                    l = k.inverted,
                    p = b.reversed,
                    p = this.isNegative && !p || !this.isNegative && p,
                    g = b.translate(b.usePercentage ? 100 : this.total, 0, 0, 0, 1),
                    b = b.translate(0),
                    b = Math.abs(g - b);
                a = k.xAxis[0].translate(this.x) + a;
                var e = k.plotHeight,
                    l = {
                        x: l ? p ? g : g - b : a,
                        y: l ? e - a - f : p ? e - g - b : e - g,
                        width: l ? b : f,
                        height: l ? f : b
                    };
                if (f = this.label) f.align(this.alignOptions, null, l), l = f.alignAttr, f[!1 === this.options.crop || k.isInsidePlot(l.x, l.y) ? "show" : "hide"](!0)
            }
        };
        F.prototype.getStacks = function() {
            var a = this;
            m(a.yAxis, function(a) {
                a.stacks && a.hasVisibleSeries && (a.oldStacks = a.stacks)
            });
            m(a.series, function(f) {
                !f.options.stacking || !0 !== f.visible && !1 !== a.options.chart.ignoreHiddenSeries || (f.stackKey = f.type + q(f.options.stack, ""))
            })
        };
        B.prototype.buildStacks = function() {
            var a = this.series,
                f, b = q(this.options.reversedStacks, !0),
                k = a.length,
                h;
            if (!this.isXAxis) {
                this.usePercentage = !1;
                for (h = k; h--;) a[b ? h : k - h - 1].setStackedPoints();
                for (h = k; h--;) f = a[b ? h : k - h - 1], f.setStackCliffs && f.setStackCliffs();
                if (this.usePercentage)
                    for (h = 0; h < k; h++) a[h].setPercentStacks()
            }
        };
        B.prototype.renderStackTotals = function() {
            var a =
                this.chart,
                f = a.renderer,
                b = this.stacks,
                k, h, p = this.stackTotalGroup;
            p || (this.stackTotalGroup = p = f.g("stack-labels").attr({
                visibility: "visible",
                zIndex: 6
            }).add());
            p.translate(a.plotLeft, a.plotTop);
            for (k in b)
                for (h in a = b[k], a) a[h].render(p)
        };
        B.prototype.resetStacks = function() {
            var a = this.stacks,
                f, b;
            if (!this.isXAxis)
                for (f in a)
                    for (b in a[f]) a[f][b].touched < this.stacksTouched ? (a[f][b].destroy(), delete a[f][b]) : (a[f][b].total = null, a[f][b].cum = 0)
        };
        B.prototype.cleanStacks = function() {
            var a, f, b;
            if (!this.isXAxis)
                for (f in this.oldStacks &&
                    (a = this.stacks = this.oldStacks), a)
                    for (b in a[f]) a[f][b].cum = a[f][b].total
        };
        a.prototype.setStackedPoints = function() {
            if (this.options.stacking && (!0 === this.visible || !1 === this.chart.options.chart.ignoreHiddenSeries)) {
                var a = this.processedXData,
                    f = this.processedYData,
                    b = [],
                    k = f.length,
                    h = this.options,
                    p = h.threshold,
                    g = h.startFromThreshold ? p : 0,
                    e = h.stack,
                    h = h.stacking,
                    c = this.stackKey,
                    n = "-" + c,
                    u = this.negStacks,
                    d = this.yAxis,
                    m = d.stacks,
                    y = d.oldStacks,
                    v, E, I, H, w, K, t;
                d.stacksTouched += 1;
                for (w = 0; w < k; w++) K = a[w], t = f[w], v = this.getStackIndicator(v,
                    K, this.index), H = v.key, I = (E = u && t < (g ? 0 : p)) ? n : c, m[I] || (m[I] = {}), m[I][K] || (y[I] && y[I][K] ? (m[I][K] = y[I][K], m[I][K].total = null) : m[I][K] = new D(d, d.options.stackLabels, E, K, e)), I = m[I][K], null !== t && (I.points[H] = I.points[this.index] = [q(I.cum, g)], r(I.cum) || (I.base = H), I.touched = d.stacksTouched, 0 < v.index && !1 === this.singleStacks && (I.points[H][0] = I.points[this.index + "," + K + ",0"][0])), "percent" === h ? (E = E ? c : n, u && m[E] && m[E][K] ? (E = m[E][K], I.total = E.total = Math.max(E.total, I.total) + Math.abs(t) || 0) : I.total = G(I.total + (Math.abs(t) ||
                    0))) : I.total = G(I.total + (t || 0)), I.cum = q(I.cum, g) + (t || 0), null !== t && (I.points[H].push(I.cum), b[w] = I.cum);
                "percent" === h && (d.usePercentage = !0);
                this.stackedYData = b;
                d.oldStacks = {}
            }
        };
        a.prototype.setPercentStacks = function() {
            var a = this,
                f = a.stackKey,
                b = a.yAxis.stacks,
                k = a.processedXData,
                h;
            m([f, "-" + f], function(f) {
                for (var g = k.length, e, c; g--;)
                    if (e = k[g], h = a.getStackIndicator(h, e, a.index, f), e = (c = b[f] && b[f][e]) && c.points[h.key]) c = c.total ? 100 / c.total : 0, e[0] = G(e[0] * c), e[1] = G(e[1] * c), a.stackedYData[g] = e[1]
            })
        };
        a.prototype.getStackIndicator =
            function(a, f, b, k) {
                !r(a) || a.x !== f || k && a.key !== k ? a = {
                    x: f,
                    index: 0,
                    key: k
                } : a.index++;
                a.key = [b, f, a.index].join();
                return a
            }
    })(N);
    (function(a) {
        var D = a.addEvent,
            B = a.animate,
            F = a.Axis,
            G = a.createElement,
            r = a.css,
            h = a.defined,
            m = a.each,
            t = a.erase,
            q = a.extend,
            l = a.fireEvent,
            f = a.inArray,
            b = a.isNumber,
            k = a.isObject,
            z = a.merge,
            p = a.pick,
            g = a.Point,
            e = a.Series,
            c = a.seriesTypes,
            n = a.setAnimation,
            u = a.splat;
        q(a.Chart.prototype, {
            addSeries: function(a, b, c) {
                var d, e = this;
                a && (b = p(b, !0), l(e, "addSeries", {
                    options: a
                }, function() {
                    d = e.initSeries(a);
                    e.isDirtyLegend = !0;
                    e.linkSeries();
                    b && e.redraw(c)
                }));
                return d
            },
            addAxis: function(a, b, c, e) {
                var d = b ? "xAxis" : "yAxis",
                    f = this.options;
                a = z(a, {
                    index: this[d].length,
                    isX: b
                });
                new F(this, a);
                f[d] = u(f[d] || {});
                f[d].push(a);
                p(c, !0) && this.redraw(e)
            },
            showLoading: function(a) {
                var b = this,
                    c = b.options,
                    d = b.loadingDiv,
                    e = c.loading,
                    f = function() {
                        d && r(d, {
                            left: b.plotLeft + "px",
                            top: b.plotTop + "px",
                            width: b.plotWidth + "px",
                            height: b.plotHeight + "px"
                        })
                    };
                d || (b.loadingDiv = d = G("div", {
                        className: "highcharts-loading highcharts-loading-hidden"
                    },
                    null, b.container), b.loadingSpan = G("span", {
                    className: "highcharts-loading-inner"
                }, null, d), D(b, "redraw", f));
                d.className = "highcharts-loading";
                b.loadingSpan.innerHTML = a || c.lang.loading;
                r(d, q(e.style, {
                    zIndex: 10
                }));
                r(b.loadingSpan, e.labelStyle);
                b.loadingShown || (r(d, {
                    opacity: 0,
                    display: ""
                }), B(d, {
                    opacity: e.style.opacity || .5
                }, {
                    duration: e.showDuration || 0
                }));
                b.loadingShown = !0;
                f()
            },
            hideLoading: function() {
                var a = this.options,
                    b = this.loadingDiv;
                b && (b.className = "highcharts-loading highcharts-loading-hidden", B(b, {
                    opacity: 0
                }, {
                    duration: a.loading.hideDuration || 100,
                    complete: function() {
                        r(b, {
                            display: "none"
                        })
                    }
                }));
                this.loadingShown = !1
            },
            propsRequireDirtyBox: "backgroundColor borderColor borderWidth margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),
            propsRequireUpdateSeries: "chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions".split(" "),
            update: function(a, c) {
                var d, e = {
                        credits: "addCredits",
                        title: "setTitle",
                        subtitle: "setSubtitle"
                    },
                    g = a.chart,
                    k, n;
                if (g) {
                    z(!0, this.options.chart, g);
                    "className" in g && this.setClassName(g.className);
                    if ("inverted" in g || "polar" in g) this.propFromSeries(), k = !0;
                    for (d in g) g.hasOwnProperty(d) && (-1 !== f("chart." + d, this.propsRequireUpdateSeries) && (n = !0), -1 !== f(d, this.propsRequireDirtyBox) && (this.isDirtyBox = !0));
                    "style" in g && this.renderer.setStyle(g.style)
                }
                for (d in a) {
                    if (this[d] && "function" === typeof this[d].update) this[d].update(a[d], !1);
                    else if ("function" === typeof this[e[d]]) this[e[d]](a[d]);
                    "chart" !== d && -1 !== f(d, this.propsRequireUpdateSeries) && (n = !0)
                }
                a.colors && (this.options.colors = a.colors);
                a.plotOptions && z(!0, this.options.plotOptions, a.plotOptions);
                m(["xAxis", "yAxis", "series"], function(b) {
                    a[b] && m(u(a[b]), function(a) {
                        var c = h(a.id) && this.get(a.id) || this[b][0];
                        c && c.coll === b && c.update(a, !1)
                    }, this)
                }, this);
                k && m(this.axes, function(a) {
                    a.update({}, !1)
                });
                n && m(this.series, function(a) {
                    a.update({}, !1)
                });
                a.loading && z(!0, this.options.loading,
                    a.loading);
                d = g && g.width;
                g = g && g.height;
                b(d) && d !== this.chartWidth || b(g) && g !== this.chartHeight ? this.setSize(d, g) : p(c, !0) && this.redraw()
            },
            setSubtitle: function(a) {
                this.setTitle(void 0, a)
            }
        });
        q(g.prototype, {
            update: function(a, b, c, e) {
                function d() {
                    f.applyOptions(a);
                    null === f.y && n && (f.graphic = n.destroy());
                    k(a, !0) && (n && n.element && a && a.marker && a.marker.symbol && (f.graphic = n.destroy()), a && a.dataLabels && f.dataLabel && (f.dataLabel = f.dataLabel.destroy()));
                    u = f.index;
                    g.updateParallelArrays(f, u);
                    h.data[u] = k(h.data[u], !0) ?
                        f.options : a;
                    g.isDirty = g.isDirtyData = !0;
                    !g.fixedBox && g.hasCartesianSeries && (v.isDirtyBox = !0);
                    "point" === h.legendType && (v.isDirtyLegend = !0);
                    b && v.redraw(c)
                }
                var f = this,
                    g = f.series,
                    n = f.graphic,
                    u, v = g.chart,
                    h = g.options;
                b = p(b, !0);
                !1 === e ? d() : f.firePointEvent("update", {
                    options: a
                }, d)
            },
            remove: function(a, b) {
                this.series.removePoint(f(this, this.series.data), a, b)
            }
        });
        q(e.prototype, {
            addPoint: function(a, b, c, e) {
                var d = this.options,
                    f = this.data,
                    g = this.chart,
                    k = this.xAxis && this.xAxis.names,
                    n = d.data,
                    u, v, h = this.xData,
                    l, m;
                b = p(b, !0);
                u = {
                    series: this
                };
                this.pointClass.prototype.applyOptions.apply(u, [a]);
                m = u.x;
                l = h.length;
                if (this.requireSorting && m < h[l - 1])
                    for (v = !0; l && h[l - 1] > m;) l--;
                this.updateParallelArrays(u, "splice", l, 0, 0);
                this.updateParallelArrays(u, l);
                k && u.name && (k[m] = u.name);
                n.splice(l, 0, a);
                v && (this.data.splice(l, 0, null), this.processData());
                "point" === d.legendType && this.generatePoints();
                c && (f[0] && f[0].remove ? f[0].remove(!1) : (f.shift(), this.updateParallelArrays(u, "shift"), n.shift()));
                this.isDirtyData = this.isDirty = !0;
                b && g.redraw(e)
            },
            removePoint: function(a, b, c) {
                var d = this,
                    e = d.data,
                    f = e[a],
                    g = d.points,
                    k = d.chart,
                    u = function() {
                        g && g.length === e.length && g.splice(a, 1);
                        e.splice(a, 1);
                        d.options.data.splice(a, 1);
                        d.updateParallelArrays(f || {
                            series: d
                        }, "splice", a, 1);
                        f && f.destroy();
                        d.isDirty = !0;
                        d.isDirtyData = !0;
                        b && k.redraw()
                    };
                n(c, k);
                b = p(b, !0);
                f ? f.firePointEvent("remove", null, u) : u()
            },
            remove: function(a, b, c) {
                function d() {
                    e.destroy();
                    f.isDirtyLegend = f.isDirtyBox = !0;
                    f.linkSeries();
                    p(a, !0) && f.redraw(b)
                }
                var e = this,
                    f = e.chart;
                !1 !== c ? l(e, "remove", null, d) :
                    d()
            },
            update: function(a, b) {
                var d = this,
                    e = this.chart,
                    f = this.userOptions,
                    g = this.type,
                    k = a.type || f.type || e.options.chart.type,
                    n = c[g].prototype,
                    u = ["group", "markerGroup", "dataLabelsGroup"],
                    l;
                if (k && k !== g || void 0 !== a.zIndex) u.length = 0;
                m(u, function(a) {
                    u[a] = d[a];
                    delete d[a]
                });
                a = z(f, {
                    animation: !1,
                    index: this.index,
                    pointStart: this.xData[0]
                }, {
                    data: this.options.data
                }, a);
                this.remove(!1, null, !1);
                for (l in n) this[l] = void 0;
                q(this, c[k || g].prototype);
                m(u, function(a) {
                    d[a] = u[a]
                });
                this.init(e, a);
                e.linkSeries();
                p(b, !0) && e.redraw(!1)
            }
        });
        q(F.prototype, {
            update: function(a, b) {
                var c = this.chart;
                a = c.options[this.coll][this.options.index] = z(this.userOptions, a);
                this.destroy(!0);
                this.init(c, q(a, {
                    events: void 0
                }));
                c.isDirtyBox = !0;
                p(b, !0) && c.redraw()
            },
            remove: function(a) {
                for (var b = this.chart, c = this.coll, d = this.series, e = d.length; e--;) d[e] && d[e].remove(!1);
                t(b.axes, this);
                t(b[c], this);
                b.options[c].splice(this.options.index, 1);
                m(b[c], function(a, b) {
                    a.options.index = b
                });
                this.destroy();
                b.isDirtyBox = !0;
                p(a, !0) && b.redraw()
            },
            setTitle: function(a, b) {
                this.update({
                        title: a
                    },
                    b)
            },
            setCategories: function(a, b) {
                this.update({
                    categories: a
                }, b)
            }
        })
    })(N);
    (function(a) {
        var D = a.color,
            B = a.each,
            F = a.map,
            G = a.pick,
            r = a.Series,
            h = a.seriesType;
        h("area", "line", {
            softThreshold: !1,
            threshold: 0
        }, {
            singleStacks: !1,
            getStackPoints: function() {
                var a = [],
                    h = [],
                    q = this.xAxis,
                    l = this.yAxis,
                    f = l.stacks[this.stackKey],
                    b = {},
                    k = this.points,
                    z = this.index,
                    p = l.series,
                    g = p.length,
                    e, c = G(l.options.reversedStacks, !0) ? 1 : -1,
                    n, u;
                if (this.options.stacking) {
                    for (n = 0; n < k.length; n++) b[k[n].x] = k[n];
                    for (u in f) null !== f[u].total && h.push(u);
                    h.sort(function(a, b) {
                        return a - b
                    });
                    e = F(p, function() {
                        return this.visible
                    });
                    B(h, function(d, k) {
                        var p = 0,
                            u, m;
                        if (b[d] && !b[d].isNull) a.push(b[d]), B([-1, 1], function(a) {
                            var p = 1 === a ? "rightNull" : "leftNull",
                                l = 0,
                                v = f[h[k + a]];
                            if (v)
                                for (n = z; 0 <= n && n < g;) u = v.points[n], u || (n === z ? b[d][p] = !0 : e[n] && (m = f[d].points[n]) && (l -= m[1] - m[0])), n += c;
                            b[d][1 === a ? "rightCliff" : "leftCliff"] = l
                        });
                        else {
                            for (n = z; 0 <= n && n < g;) {
                                if (u = f[d].points[n]) {
                                    p = u[1];
                                    break
                                }
                                n += c
                            }
                            p = l.toPixels(p, !0);
                            a.push({
                                isNull: !0,
                                plotX: q.toPixels(d, !0),
                                plotY: p,
                                yBottom: p
                            })
                        }
                    })
                }
                return a
            },
            getGraphPath: function(a) {
                var h = r.prototype.getGraphPath,
                    m = this.options,
                    l = m.stacking,
                    f = this.yAxis,
                    b, k, z = [],
                    p = [],
                    g = this.index,
                    e, c = f.stacks[this.stackKey],
                    n = m.threshold,
                    u = f.getThreshold(m.threshold),
                    d, m = m.connectNulls || "percent" === l,
                    C = function(b, d, k) {
                        var h = a[b];
                        b = l && c[h.x].points[g];
                        var v = h[k + "Null"] || 0;
                        k = h[k + "Cliff"] || 0;
                        var w, m, h = !0;
                        k || v ? (w = (v ? b[0] : b[1]) + k, m = b[0] + k, h = !!v) : !l && a[d] && a[d].isNull && (w = m = n);
                        void 0 !== w && (p.push({
                            plotX: e,
                            plotY: null === w ? u : f.getThreshold(w),
                            isNull: h
                        }), z.push({
                            plotX: e,
                            plotY: null ===
                                m ? u : f.getThreshold(m),
                            doCurve: !1
                        }))
                    };
                a = a || this.points;
                l && (a = this.getStackPoints());
                for (b = 0; b < a.length; b++)
                    if (k = a[b].isNull, e = G(a[b].rectPlotX, a[b].plotX), d = G(a[b].yBottom, u), !k || m) m || C(b, b - 1, "left"), k && !l && m || (p.push(a[b]), z.push({
                        x: b,
                        plotX: e,
                        plotY: d
                    })), m || C(b, b + 1, "right");
                b = h.call(this, p, !0, !0);
                z.reversed = !0;
                k = h.call(this, z, !0, !0);
                k.length && (k[0] = "L");
                k = b.concat(k);
                h = h.call(this, p, !1, m);
                k.xMap = b.xMap;
                this.areaPath = k;
                return h
            },
            drawGraph: function() {
                this.areaPath = [];
                r.prototype.drawGraph.apply(this);
                var a = this,
                    h = this.areaPath,
                    q = this.options,
                    l = [
                        ["area", "highcharts-area", this.color, q.fillColor]
                    ];
                B(this.zones, function(f, b) {
                    l.push(["zone-area-" + b, "highcharts-area highcharts-zone-area-" + b + " " + f.className, f.color || a.color, f.fillColor || q.fillColor])
                });
                B(l, function(f) {
                    var b = f[0],
                        k = a[b];
                    k ? (k.endX = h.xMap, k.animate({
                        d: h
                    })) : (k = a[b] = a.chart.renderer.path(h).addClass(f[1]).attr({
                        fill: G(f[3], D(f[2]).setOpacity(G(q.fillOpacity, .75)).get()),
                        zIndex: 0
                    }).add(a.group), k.isArea = !0);
                    k.startX = h.xMap;
                    k.shiftUnit = q.step ?
                        2 : 1
                })
            },
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle
        })
    })(N);
    (function(a) {
        var D = a.pick;
        a = a.seriesType;
        a("spline", "line", {}, {
            getPointSpline: function(a, F, G) {
                var r = F.plotX,
                    h = F.plotY,
                    m = a[G - 1];
                G = a[G + 1];
                var t, q, l, f;
                if (m && !m.isNull && !1 !== m.doCurve && G && !G.isNull && !1 !== G.doCurve) {
                    a = m.plotY;
                    l = G.plotX;
                    G = G.plotY;
                    var b = 0;
                    t = (1.5 * r + m.plotX) / 2.5;
                    q = (1.5 * h + a) / 2.5;
                    l = (1.5 * r + l) / 2.5;
                    f = (1.5 * h + G) / 2.5;
                    l !== t && (b = (f - q) * (l - r) / (l - t) + h - f);
                    q += b;
                    f += b;
                    q > a && q > h ? (q = Math.max(a, h), f = 2 * h - q) : q < a && q < h && (q = Math.min(a, h), f = 2 * h - q);
                    f > G &&
                        f > h ? (f = Math.max(G, h), q = 2 * h - f) : f < G && f < h && (f = Math.min(G, h), q = 2 * h - f);
                    F.rightContX = l;
                    F.rightContY = f
                }
                F = ["C", D(m.rightContX, m.plotX), D(m.rightContY, m.plotY), D(t, r), D(q, h), r, h];
                m.rightContX = m.rightContY = null;
                return F
            }
        })
    })(N);
    (function(a) {
        var D = a.seriesTypes.area.prototype,
            B = a.seriesType;
        B("areaspline", "spline", a.defaultPlotOptions.area, {
            getStackPoints: D.getStackPoints,
            getGraphPath: D.getGraphPath,
            setStackCliffs: D.setStackCliffs,
            drawGraph: D.drawGraph,
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle
        })
    })(N);
    (function(a) {
        var D = a.animObject,
            B = a.color,
            F = a.each,
            G = a.extend,
            r = a.isNumber,
            h = a.merge,
            m = a.pick,
            t = a.Series,
            q = a.seriesType,
            l = a.svg;
        q("column", "line", {
            borderRadius: 0,
            groupPadding: .2,
            marker: null,
            pointPadding: .1,
            minPointLength: 0,
            cropThreshold: 50,
            pointRange: null,
            states: {
                hover: {
                    halo: !1,
                    brightness: .1,
                    shadow: !1
                },
                select: {
                    color: "#cccccc",
                    borderColor: "#000000",
                    shadow: !1
                }
            },
            dataLabels: {
                align: null,
                verticalAlign: null,
                y: null
            },
            softThreshold: !1,
            startFromThreshold: !0,
            stickyTracking: !1,
            tooltip: {
                distance: 6
            },
            threshold: 0,
            borderColor: "#ffffff"
        }, {
            cropShoulder: 0,
            directTouch: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            negStacks: !0,
            init: function() {
                t.prototype.init.apply(this, arguments);
                var a = this,
                    b = a.chart;
                b.hasRendered && F(b.series, function(b) {
                    b.type === a.type && (b.isDirty = !0)
                })
            },
            getColumnMetrics: function() {
                var a = this,
                    b = a.options,
                    k = a.xAxis,
                    h = a.yAxis,
                    p = k.reversed,
                    g, e = {},
                    c = 0;
                !1 === b.grouping ? c = 1 : F(a.chart.series, function(b) {
                    var d = b.options,
                        f = b.yAxis,
                        k;
                    b.type === a.type && b.visible && h.len === f.len && h.pos === f.pos && (d.stacking ? (g =
                        b.stackKey, void 0 === e[g] && (e[g] = c++), k = e[g]) : !1 !== d.grouping && (k = c++), b.columnIndex = k)
                });
                var n = Math.min(Math.abs(k.transA) * (k.ordinalSlope || b.pointRange || k.closestPointRange || k.tickInterval || 1), k.len),
                    u = n * b.groupPadding,
                    d = (n - 2 * u) / c,
                    b = Math.min(b.maxPointWidth || k.len, m(b.pointWidth, d * (1 - 2 * b.pointPadding)));
                a.columnMetrics = {
                    width: b,
                    offset: (d - b) / 2 + (u + ((a.columnIndex || 0) + (p ? 1 : 0)) * d - n / 2) * (p ? -1 : 1)
                };
                return a.columnMetrics
            },
            crispCol: function(a, b, k, h) {
                var f = this.chart,
                    g = this.borderWidth,
                    e = -(g % 2 ? .5 : 0),
                    g = g % 2 ?
                    .5 : 1;
                f.inverted && f.renderer.isVML && (g += 1);
                k = Math.round(a + k) + e;
                a = Math.round(a) + e;
                h = Math.round(b + h) + g;
                e = .5 >= Math.abs(b) && .5 < h;
                b = Math.round(b) + g;
                h -= b;
                e && h && (--b, h += 1);
                return {
                    x: a,
                    y: b,
                    width: k - a,
                    height: h
                }
            },
            translate: function() {
                var a = this,
                    b = a.chart,
                    k = a.options,
                    h = a.dense = 2 > a.closestPointRange * a.xAxis.transA,
                    h = a.borderWidth = m(k.borderWidth, h ? 0 : 1),
                    p = a.yAxis,
                    g = a.translatedThreshold = p.getThreshold(k.threshold),
                    e = m(k.minPointLength, 5),
                    c = a.getColumnMetrics(),
                    n = c.width,
                    u = a.barW = Math.max(n, 1 + 2 * h),
                    d = a.pointXOffset =
                    c.offset;
                b.inverted && (g -= .5);
                k.pointPadding && (u = Math.ceil(u));
                t.prototype.translate.apply(a);
                F(a.points, function(c) {
                    var f = m(c.yBottom, g),
                        k = 999 + Math.abs(f),
                        k = Math.min(Math.max(-k, c.plotY), p.len + k),
                        h = c.plotX + d,
                        l = u,
                        z = Math.min(k, f),
                        w, q = Math.max(k, f) - z;
                    Math.abs(q) < e && e && (q = e, w = !p.reversed && !c.negative || p.reversed && c.negative, z = Math.abs(z - g) > e ? f - e : g - (w ? e : 0));
                    c.barX = h;
                    c.pointWidth = n;
                    c.tooltipPos = b.inverted ? [p.len + p.pos - b.plotLeft - k, a.xAxis.len - h - l / 2, q] : [h + l / 2, k + p.pos - b.plotTop, q];
                    c.shapeType = "rect";
                    c.shapeArgs =
                        a.crispCol.apply(a, c.isNull ? [c.plotX, p.len / 2, 0, 0] : [h, z, l, q])
                })
            },
            getSymbol: a.noop,
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
            drawGraph: function() {
                this.group[this.dense ? "addClass" : "removeClass"]("highcharts-dense-data")
            },
            pointAttribs: function(a, b) {
                var f = this.options,
                    h = this.pointAttrToOptions || {},
                    p = h.stroke || "borderColor",
                    g = h["stroke-width"] || "borderWidth",
                    e = a && a.color || this.color,
                    c = a[p] || f[p] || this.color || e,
                    h = f.dashStyle,
                    n;
                a && this.zones.length && (e = (e = a.getZone()) && e.color || a.options.color ||
                    this.color);
                b && (b = f.states[b], n = b.brightness, e = b.color || void 0 !== n && B(e).brighten(b.brightness).get() || e, c = b[p] || c, h = b.dashStyle || h);
                a = {
                    fill: e,
                    stroke: c,
                    "stroke-width": a[g] || f[g] || this[g] || 0
                };
                f.borderRadius && (a.r = f.borderRadius);
                h && (a.dashstyle = h);
                return a
            },
            drawPoints: function() {
                var a = this,
                    b = this.chart,
                    k = a.options,
                    l = b.renderer,
                    p = k.animationLimit || 250,
                    g;
                F(a.points, function(e) {
                    var c = e.graphic;
                    if (r(e.plotY) && null !== e.y) {
                        g = e.shapeArgs;
                        if (c) c[b.pointCount < p ? "animate" : "attr"](h(g));
                        else e.graphic = c = l[e.shapeType](g).attr({
                            "class": e.getClassName()
                        }).add(e.group ||
                            a.group);
                        c.attr(a.pointAttribs(e, e.selected && "select")).shadow(k.shadow, null, k.stacking && !k.borderRadius)
                    } else c && (e.graphic = c.destroy())
                })
            },
            animate: function(a) {
                var b = this,
                    f = this.yAxis,
                    h = b.options,
                    p = this.chart.inverted,
                    g = {};
                l && (a ? (g.scaleY = .001, a = Math.min(f.pos + f.len, Math.max(f.pos, f.toPixels(h.threshold))), p ? g.translateX = a - f.len : g.translateY = a, b.group.attr(g)) : (g[p ? "translateX" : "translateY"] = f.pos, b.group.animate(g, G(D(b.options.animation), {
                        step: function(a, c) {
                            b.group.attr({
                                scaleY: Math.max(.001, c.pos)
                            })
                        }
                    })),
                    b.animate = null))
            },
            remove: function() {
                var a = this,
                    b = a.chart;
                b.hasRendered && F(b.series, function(b) {
                    b.type === a.type && (b.isDirty = !0)
                });
                t.prototype.remove.apply(a, arguments)
            }
        })
    })(N);
    (function(a) {
        a = a.seriesType;
        a("bar", "column", null, {
            inverted: !0
        })
    })(N);
    (function(a) {
        var D = a.Series;
        a = a.seriesType;
        a("scatter", "line", {
            lineWidth: 0,
            marker: {
                enabled: !0
            },
            tooltip: {
                headerFormat: '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e \x3cspan style\x3d"font-size: 0.85em"\x3e {series.name}\x3c/span\x3e\x3cbr/\x3e',
                pointFormat: "x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e"
            }
        }, {
            sorted: !1,
            requireSorting: !1,
            noSharedTooltip: !0,
            trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
            takeOrdinalPosition: !1,
            kdDimensions: 2,
            drawGraph: function() {
                this.options.lineWidth && D.prototype.drawGraph.call(this)
            }
        })
    })(N);
    (function(a) {
        var D = a.pick,
            B = a.relativeLength;
        a.CenteredSeriesMixin = {
            getCenter: function() {
                var a = this.options,
                    G = this.chart,
                    r = 2 * (a.slicedOffset || 0),
                    h = G.plotWidth - 2 * r,
                    G = G.plotHeight -
                    2 * r,
                    m = a.center,
                    m = [D(m[0], "50%"), D(m[1], "50%"), a.size || "100%", a.innerSize || 0],
                    t = Math.min(h, G),
                    q, l;
                for (q = 0; 4 > q; ++q) l = m[q], a = 2 > q || 2 === q && /%$/.test(l), m[q] = B(l, [h, G, t, m[2]][q]) + (a ? r : 0);
                m[3] > m[2] && (m[3] = m[2]);
                return m
            }
        }
    })(N);
    (function(a) {
        var D = a.addEvent,
            B = a.defined,
            F = a.each,
            G = a.extend,
            r = a.inArray,
            h = a.noop,
            m = a.pick,
            t = a.Point,
            q = a.Series,
            l = a.seriesType,
            f = a.setAnimation;
        l("pie", "line", {
            center: [null, null],
            clip: !1,
            colorByPoint: !0,
            dataLabels: {
                distance: 30,
                enabled: !0,
                formatter: function() {
                    return null === this.y ?
                        void 0 : this.point.name
                },
                x: 0
            },
            ignoreHiddenPoint: !0,
            legendType: "point",
            marker: null,
            size: null,
            showInLegend: !1,
            slicedOffset: 10,
            stickyTracking: !1,
            tooltip: {
                followPointer: !0
            },
            borderColor: "#ffffff",
            borderWidth: 1,
            states: {
                hover: {
                    brightness: .1,
                    shadow: !1
                }
            }
        }, {
            isCartesian: !1,
            requireSorting: !1,
            directTouch: !0,
            noSharedTooltip: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            axisTypes: [],
            pointAttribs: a.seriesTypes.column.prototype.pointAttribs,
            animate: function(a) {
                var b = this,
                    f = b.points,
                    p = b.startAngleRad;
                a || (F(f, function(a) {
                    var e =
                        a.graphic,
                        c = a.shapeArgs;
                    e && (e.attr({
                        r: a.startR || b.center[3] / 2,
                        start: p,
                        end: p
                    }), e.animate({
                        r: c.r,
                        start: c.start,
                        end: c.end
                    }, b.options.animation))
                }), b.animate = null)
            },
            updateTotals: function() {
                var a, f = 0,
                    h = this.points,
                    p = h.length,
                    g, e = this.options.ignoreHiddenPoint;
                for (a = 0; a < p; a++) g = h[a], 0 > g.y && (g.y = null), f += e && !g.visible ? 0 : g.y;
                this.total = f;
                for (a = 0; a < p; a++) g = h[a], g.percentage = 0 < f && (g.visible || !e) ? g.y / f * 100 : 0, g.total = f
            },
            generatePoints: function() {
                q.prototype.generatePoints.call(this);
                this.updateTotals()
            },
            translate: function(a) {
                this.generatePoints();
                var b = 0,
                    f = this.options,
                    p = f.slicedOffset,
                    g = p + (f.borderWidth || 0),
                    e, c, n, h = f.startAngle || 0,
                    d = this.startAngleRad = Math.PI / 180 * (h - 90),
                    h = (this.endAngleRad = Math.PI / 180 * (m(f.endAngle, h + 360) - 90)) - d,
                    l = this.points,
                    y = f.dataLabels.distance,
                    f = f.ignoreHiddenPoint,
                    v, q = l.length,
                    I;
                a || (this.center = a = this.getCenter());
                this.getX = function(b, c) {
                    n = Math.asin(Math.min((b - a[1]) / (a[2] / 2 + y), 1));
                    return a[0] + (c ? -1 : 1) * Math.cos(n) * (a[2] / 2 + y)
                };
                for (v = 0; v < q; v++) {
                    I = l[v];
                    e = d + b * h;
                    if (!f || I.visible) b += I.percentage / 100;
                    c = d + b * h;
                    I.shapeType =
                        "arc";
                    I.shapeArgs = {
                        x: a[0],
                        y: a[1],
                        r: a[2] / 2,
                        innerR: a[3] / 2,
                        start: Math.round(1E3 * e) / 1E3,
                        end: Math.round(1E3 * c) / 1E3
                    };
                    n = (c + e) / 2;
                    n > 1.5 * Math.PI ? n -= 2 * Math.PI : n < -Math.PI / 2 && (n += 2 * Math.PI);
                    I.slicedTranslation = {
                        translateX: Math.round(Math.cos(n) * p),
                        translateY: Math.round(Math.sin(n) * p)
                    };
                    e = Math.cos(n) * a[2] / 2;
                    c = Math.sin(n) * a[2] / 2;
                    I.tooltipPos = [a[0] + .7 * e, a[1] + .7 * c];
                    I.half = n < -Math.PI / 2 || n > Math.PI / 2 ? 1 : 0;
                    I.angle = n;
                    g = Math.min(g, y / 5);
                    I.labelPos = [a[0] + e + Math.cos(n) * y, a[1] + c + Math.sin(n) * y, a[0] + e + Math.cos(n) * g, a[1] + c + Math.sin(n) *
                        g, a[0] + e, a[1] + c, 0 > y ? "center" : I.half ? "right" : "left", n
                    ]
                }
            },
            drawGraph: null,
            drawPoints: function() {
                var a = this,
                    f = a.chart.renderer,
                    h, p, g, e, c = a.options.shadow;
                c && !a.shadowGroup && (a.shadowGroup = f.g("shadow").add(a.group));
                F(a.points, function(b) {
                    if (null !== b.y) {
                        p = b.graphic;
                        e = b.shapeArgs;
                        h = b.sliced ? b.slicedTranslation : {};
                        var k = b.shadowGroup;
                        c && !k && (k = b.shadowGroup = f.g("shadow").add(a.shadowGroup));
                        k && k.attr(h);
                        g = a.pointAttribs(b, b.selected && "select");
                        p ? p.setRadialReference(a.center).attr(g).animate(G(e, h)) : (b.graphic =
                            p = f[b.shapeType](e).addClass(b.getClassName()).setRadialReference(a.center).attr(h).add(a.group), b.visible || p.attr({
                                visibility: "hidden"
                            }), p.attr(g).attr({
                                "stroke-linejoin": "round"
                            }).shadow(c, k))
                    }
                })
            },
            searchPoint: h,
            sortByAngle: function(a, f) {
                a.sort(function(a, b) {
                    return void 0 !== a.angle && (b.angle - a.angle) * f
                })
            },
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
            getCenter: a.CenteredSeriesMixin.getCenter,
            getSymbol: h
        }, {
            init: function() {
                t.prototype.init.apply(this, arguments);
                var a = this,
                    f;
                a.name = m(a.name, "Slice");
                f = function(b) {
                    a.slice("select" === b.type)
                };
                D(a, "select", f);
                D(a, "unselect", f);
                return a
            },
            setVisible: function(a, f) {
                var b = this,
                    k = b.series,
                    g = k.chart,
                    e = k.options.ignoreHiddenPoint;
                f = m(f, e);
                a !== b.visible && (b.visible = b.options.visible = a = void 0 === a ? !b.visible : a, k.options.data[r(b, k.data)] = b.options, F(["graphic", "dataLabel", "connector", "shadowGroup"], function(c) {
                    if (b[c]) b[c][a ? "show" : "hide"](!0)
                }), b.legendItem && g.legend.colorizeItem(b, a), a || "hover" !== b.state || b.setState(""), e && (k.isDirty = !0), f && g.redraw())
            },
            slice: function(a, k, h) {
                var b = this.series;
                f(h, b.chart);
                m(k, !0);
                this.sliced = this.options.sliced = a = B(a) ? a : !this.sliced;
                b.options.data[r(this, b.data)] = this.options;
                a = a ? this.slicedTranslation : {
                    translateX: 0,
                    translateY: 0
                };
                this.graphic.animate(a);
                this.shadowGroup && this.shadowGroup.animate(a)
            },
            haloPath: function(a) {
                var b = this.shapeArgs;
                return this.sliced || !this.visible ? [] : this.series.chart.renderer.symbols.arc(b.x, b.y, b.r + a, b.r + a, {
                    innerR: this.shapeArgs.r,
                    start: b.start,
                    end: b.end
                })
            }
        })
    })(N);
    (function(a) {
        var D =
            a.addEvent,
            B = a.arrayMax,
            F = a.defined,
            G = a.each,
            r = a.extend,
            h = a.format,
            m = a.map,
            t = a.merge,
            q = a.noop,
            l = a.pick,
            f = a.relativeLength,
            b = a.Series,
            k = a.seriesTypes,
            z = a.stableSort;
        a.distribute = function(a, b) {
            function e(a, b) {
                return a.target - b.target
            }
            var c, f = !0,
                g = a,
                d = [],
                k;
            k = 0;
            for (c = a.length; c--;) k += a[c].size;
            if (k > b) {
                z(a, function(a, b) {
                    return (b.rank || 0) - (a.rank || 0)
                });
                for (k = c = 0; k <= b;) k += a[c].size, c++;
                d = a.splice(c - 1, a.length)
            }
            z(a, e);
            for (a = m(a, function(a) {
                    return {
                        size: a.size,
                        targets: [a.target]
                    }
                }); f;) {
                for (c = a.length; c--;) f =
                    a[c], k = (Math.min.apply(0, f.targets) + Math.max.apply(0, f.targets)) / 2, f.pos = Math.min(Math.max(0, k - f.size / 2), b - f.size);
                c = a.length;
                for (f = !1; c--;) 0 < c && a[c - 1].pos + a[c - 1].size > a[c].pos && (a[c - 1].size += a[c].size, a[c - 1].targets = a[c - 1].targets.concat(a[c].targets), a[c - 1].pos + a[c - 1].size > b && (a[c - 1].pos = b - a[c - 1].size), a.splice(c, 1), f = !0)
            }
            c = 0;
            G(a, function(a) {
                var b = 0;
                G(a.targets, function() {
                    g[c].pos = a.pos + b;
                    b += g[c].size;
                    c++
                })
            });
            g.push.apply(g, d);
            z(g, e)
        };
        b.prototype.drawDataLabels = function() {
            var a = this,
                b = a.options,
                e = b.dataLabels,
                c = a.points,
                f, k, d = a.hasRendered || 0,
                m, y, v = l(e.defer, !0),
                q = a.chart.renderer;
            if (e.enabled || a._hasPointLabels) a.dlProcessOptions && a.dlProcessOptions(e), y = a.plotGroup("dataLabelsGroup", "data-labels", v && !d ? "hidden" : "visible", e.zIndex || 6), v && (y.attr({
                opacity: +d
            }), d || D(a, "afterAnimate", function() {
                a.visible && y.show(!0);
                y[b.animation ? "animate" : "attr"]({
                    opacity: 1
                }, {
                    duration: 200
                })
            })), k = e, G(c, function(c) {
                var d, g = c.dataLabel,
                    n, p, u = c.connector,
                    v = !0,
                    E, z = {};
                f = c.dlOptions || c.options && c.options.dataLabels;
                d = l(f && f.enabled, k.enabled) && null !== c.y;
                if (g && !d) c.dataLabel = g.destroy();
                else if (d) {
                    e = t(k, f);
                    E = e.style;
                    d = e.rotation;
                    n = c.getLabelConfig();
                    m = e.format ? h(e.format, n) : e.formatter.call(n, e);
                    E.color = l(e.color, E.color, a.color, "#000000");
                    if (g) F(m) ? (g.attr({
                        text: m
                    }), v = !1) : (c.dataLabel = g = g.destroy(), u && (c.connector = u.destroy()));
                    else if (F(m)) {
                        g = {
                            fill: e.backgroundColor,
                            stroke: e.borderColor,
                            "stroke-width": e.borderWidth,
                            r: e.borderRadius || 0,
                            rotation: d,
                            padding: e.padding,
                            zIndex: 1
                        };
                        "contrast" === E.color && (z.color = e.inside ||
                            0 > e.distance || b.stacking ? q.getContrast(c.color || a.color) : "#000000");
                        b.cursor && (z.cursor = b.cursor);
                        for (p in g) void 0 === g[p] && delete g[p];
                        g = c.dataLabel = q[d ? "text" : "label"](m, 0, -9999, e.shape, null, null, e.useHTML, null, "data-label").attr(g);
                        g.addClass("highcharts-data-label-color-" + c.colorIndex + " " + (e.className || ""));
                        g.css(r(E, z));
                        g.add(y);
                        g.shadow(e.shadow)
                    }
                    g && a.alignDataLabel(c, g, e, null, v)
                }
            })
        };
        b.prototype.alignDataLabel = function(a, b, e, c, f) {
            var g = this.chart,
                d = g.inverted,
                k = l(a.plotX, -9999),
                n = l(a.plotY, -9999),
                h = b.getBBox(),
                p, m = e.rotation,
                q = e.align,
                w = this.visible && (a.series.forceDL || g.isInsidePlot(k, Math.round(n), d) || c && g.isInsidePlot(k, d ? c.x + 1 : c.y + c.height - 1, d)),
                z = "justify" === l(e.overflow, "justify");
            w && (p = e.style.fontSize, p = g.renderer.fontMetrics(p, b).b, c = r({
                x: d ? g.plotWidth - n : k,
                y: Math.round(d ? g.plotHeight - k : n),
                width: 0,
                height: 0
            }, c), r(e, {
                width: h.width,
                height: h.height
            }), m ? (z = !1, d = g.renderer.rotCorr(p, m), d = {
                x: c.x + e.x + c.width / 2 + d.x,
                y: c.y + e.y + {
                    top: 0,
                    middle: .5,
                    bottom: 1
                }[e.verticalAlign] * c.height
            }, b[f ?
                "attr" : "animate"](d).attr({
                align: q
            }), k = (m + 720) % 360, k = 180 < k && 360 > k, "left" === q ? d.y -= k ? h.height : 0 : "center" === q ? (d.x -= h.width / 2, d.y -= h.height / 2) : "right" === q && (d.x -= h.width, d.y -= k ? 0 : h.height)) : (b.align(e, null, c), d = b.alignAttr), z ? this.justifyDataLabel(b, e, d, h, c, f) : l(e.crop, !0) && (w = g.isInsidePlot(d.x, d.y) && g.isInsidePlot(d.x + h.width, d.y + h.height)), e.shape && !m && b.attr({
                anchorX: a.plotX,
                anchorY: a.plotY
            }));
            w || (b.attr({
                y: -9999
            }), b.placed = !1)
        };
        b.prototype.justifyDataLabel = function(a, b, e, c, f, k) {
            var d = this.chart,
                g = b.align,
                n = b.verticalAlign,
                h, p, l = a.box ? 0 : a.padding || 0;
            h = e.x + l;
            0 > h && ("right" === g ? b.align = "left" : b.x = -h, p = !0);
            h = e.x + c.width - l;
            h > d.plotWidth && ("left" === g ? b.align = "right" : b.x = d.plotWidth - h, p = !0);
            h = e.y + l;
            0 > h && ("bottom" === n ? b.verticalAlign = "top" : b.y = -h, p = !0);
            h = e.y + c.height - l;
            h > d.plotHeight && ("top" === n ? b.verticalAlign = "bottom" : b.y = d.plotHeight - h, p = !0);
            p && (a.placed = !k, a.align(b, null, f))
        };
        k.pie && (k.pie.prototype.drawDataLabels = function() {
            var f = this,
                g = f.data,
                e, c = f.chart,
                k = f.options.dataLabels,
                h = l(k.connectorPadding,
                    10),
                d = l(k.connectorWidth, 1),
                q = c.plotWidth,
                y = c.plotHeight,
                v, E = k.distance,
                z = f.center,
                r = z[2] / 2,
                w = z[1],
                t = 0 < E,
                M, x, J, D, F = [
                    [],
                    []
                ],
                A, L, S, R, P = [0, 0, 0, 0];
            f.visible && (k.enabled || f._hasPointLabels) && (b.prototype.drawDataLabels.apply(f), G(g, function(a) {
                a.dataLabel && a.visible && (F[a.half].push(a), a.dataLabel._pos = null)
            }), G(F, function(b, d) {
                var g, n, l = b.length,
                    p, u, v;
                if (l)
                    for (f.sortByAngle(b, d - .5), 0 < E && (g = Math.max(0, w - r - E), n = Math.min(w + r + E, c.plotHeight), p = m(b, function(a) {
                            if (a.dataLabel) return v = a.dataLabel.getBBox().height ||
                                21, {
                                    target: a.labelPos[1] - g + v / 2,
                                    size: v,
                                    rank: a.y
                                }
                        }), a.distribute(p, n + v - g)), R = 0; R < l; R++) e = b[R], J = e.labelPos, M = e.dataLabel, S = !1 === e.visible ? "hidden" : "inherit", u = J[1], p ? void 0 === p[R].pos ? S = "hidden" : (D = p[R].size, L = g + p[R].pos) : L = u, A = k.justify ? z[0] + (d ? -1 : 1) * (r + E) : f.getX(L < g + 2 || L > n - 2 ? u : L, d), M._attr = {
                        visibility: S,
                        align: J[6]
                    }, M._pos = {
                        x: A + k.x + ({
                            left: h,
                            right: -h
                        }[J[6]] || 0),
                        y: L + k.y - 10
                    }, J.x = A, J.y = L, null === f.options.size && (x = M.width, A - x < h ? P[3] = Math.max(Math.round(x - A + h), P[3]) : A + x > q - h && (P[1] = Math.max(Math.round(A +
                        x - q + h), P[1])), 0 > L - D / 2 ? P[0] = Math.max(Math.round(-L + D / 2), P[0]) : L + D / 2 > y && (P[2] = Math.max(Math.round(L + D / 2 - y), P[2])))
            }), 0 === B(P) || this.verifyDataLabelOverflow(P)) && (this.placeDataLabels(), t && d && G(this.points, function(a) {
                var b;
                v = a.connector;
                if ((M = a.dataLabel) && M._pos && a.visible) {
                    S = M._attr.visibility;
                    if (b = !v) a.connector = v = c.renderer.path().addClass("highcharts-data-label-connector highcharts-color-" + a.colorIndex).add(f.dataLabelsGroup), v.attr({
                        "stroke-width": d,
                        stroke: k.connectorColor || a.color || "#666666"
                    });
                    v[b ? "attr" : "animate"]({
                        d: f.connectorPath(a.labelPos)
                    });
                    v.attr("visibility", S)
                } else v && (a.connector = v.destroy())
            }))
        }, k.pie.prototype.connectorPath = function(a) {
            var b = a.x,
                e = a.y;
            return l(this.options.dataLabels.softConnector, !0) ? ["M", b + ("left" === a[6] ? 5 : -5), e, "C", b, e, 2 * a[2] - a[4], 2 * a[3] - a[5], a[2], a[3], "L", a[4], a[5]] : ["M", b + ("left" === a[6] ? 5 : -5), e, "L", a[2], a[3], "L", a[4], a[5]]
        }, k.pie.prototype.placeDataLabels = function() {
            G(this.points, function(a) {
                var b = a.dataLabel;
                b && a.visible && ((a = b._pos) ? (b.attr(b._attr),
                    b[b.moved ? "animate" : "attr"](a), b.moved = !0) : b && b.attr({
                    y: -9999
                }))
            })
        }, k.pie.prototype.alignDataLabel = q, k.pie.prototype.verifyDataLabelOverflow = function(a) {
            var b = this.center,
                e = this.options,
                c = e.center,
                k = e.minSize || 80,
                h, d;
            null !== c[0] ? h = Math.max(b[2] - Math.max(a[1], a[3]), k) : (h = Math.max(b[2] - a[1] - a[3], k), b[0] += (a[3] - a[1]) / 2);
            null !== c[1] ? h = Math.max(Math.min(h, b[2] - Math.max(a[0], a[2])), k) : (h = Math.max(Math.min(h, b[2] - a[0] - a[2]), k), b[1] += (a[0] - a[2]) / 2);
            h < b[2] ? (b[2] = h, b[3] = Math.min(f(e.innerSize || 0, h), h), this.translate(b),
                this.drawDataLabels && this.drawDataLabels()) : d = !0;
            return d
        });
        k.column && (k.column.prototype.alignDataLabel = function(a, f, e, c, k) {
            var g = this.chart.inverted,
                d = a.series,
                h = a.dlBox || a.shapeArgs,
                n = l(a.below, a.plotY > l(this.translatedThreshold, d.yAxis.len)),
                p = l(e.inside, !!this.options.stacking);
            h && (c = t(h), 0 > c.y && (c.height += c.y, c.y = 0), h = c.y + c.height - d.yAxis.len, 0 < h && (c.height -= h), g && (c = {
                x: d.yAxis.len - c.y - c.height,
                y: d.xAxis.len - c.x - c.width,
                width: c.height,
                height: c.width
            }), p || (g ? (c.x += n ? 0 : c.width, c.width = 0) : (c.y +=
                n ? c.height : 0, c.height = 0)));
            e.align = l(e.align, !g || p ? "center" : n ? "right" : "left");
            e.verticalAlign = l(e.verticalAlign, g || p ? "middle" : n ? "top" : "bottom");
            b.prototype.alignDataLabel.call(this, a, f, e, c, k)
        })
    })(N);
    (function(a) {
        var D = a.Chart,
            B = a.each,
            F = a.pick,
            G = a.addEvent;
        D.prototype.callbacks.push(function(a) {
            function h() {
                var h = [];
                B(a.series, function(a) {
                    var m = a.options.dataLabels,
                        l = a.dataLabelCollections || ["dataLabel"];
                    (m.enabled || a._hasPointLabels) && !m.allowOverlap && a.visible && B(l, function(f) {
                        B(a.points, function(a) {
                            a[f] &&
                                (a[f].labelrank = F(a.labelrank, a.shapeArgs && a.shapeArgs.height), h.push(a[f]))
                        })
                    })
                });
                a.hideOverlappingLabels(h)
            }
            h();
            G(a, "redraw", h)
        });
        D.prototype.hideOverlappingLabels = function(a) {
            var h = a.length,
                m, r, q, l, f, b, k, z, p, g = function(a, b, f, g, d, k, h, l) {
                    return !(d > a + f || d + h < a || k > b + g || k + l < b)
                };
            for (r = 0; r < h; r++)
                if (m = a[r]) m.oldOpacity = m.opacity, m.newOpacity = 1;
            a.sort(function(a, b) {
                return (b.labelrank || 0) - (a.labelrank || 0)
            });
            for (r = 0; r < h; r++)
                for (q = a[r], m = r + 1; m < h; ++m)
                    if (l = a[m], q && l && q.placed && l.placed && 0 !== q.newOpacity && 0 !==
                        l.newOpacity && (f = q.alignAttr, b = l.alignAttr, k = q.parentGroup, z = l.parentGroup, p = 2 * (q.box ? 0 : q.padding), f = g(f.x + k.translateX, f.y + k.translateY, q.width - p, q.height - p, b.x + z.translateX, b.y + z.translateY, l.width - p, l.height - p)))(q.labelrank < l.labelrank ? q : l).newOpacity = 0;
            B(a, function(a) {
                var b, e;
                a && (e = a.newOpacity, a.oldOpacity !== e && a.placed && (e ? a.show(!0) : b = function() {
                    a.hide()
                }, a.alignAttr.opacity = e, a[a.isOld ? "animate" : "attr"](a.alignAttr, null, b)), a.isOld = !0)
            })
        }
    })(N);
    (function(a) {
        var D = a.addEvent,
            B = a.Chart,
            F = a.createElement,
            G = a.css,
            r = a.defaultOptions,
            h = a.defaultPlotOptions,
            m = a.each,
            t = a.extend,
            q = a.fireEvent,
            l = a.hasTouch,
            f = a.inArray,
            b = a.isObject,
            k = a.Legend,
            z = a.merge,
            p = a.pick,
            g = a.Point,
            e = a.Series,
            c = a.seriesTypes,
            n = a.svg;
        a = a.TrackerMixin = {
            drawTrackerPoint: function() {
                var a = this,
                    b = a.chart,
                    c = b.pointer,
                    e = function(a) {
                        for (var c = a.target, d; c && !d;) d = c.point, c = c.parentNode;
                        if (void 0 !== d && d !== b.hoverPoint) d.onMouseOver(a)
                    };
                m(a.points, function(a) {
                    a.graphic && (a.graphic.element.point = a);
                    a.dataLabel && (a.dataLabel.element.point = a)
                });
                a._hasTracking ||
                    (m(a.trackerGroups, function(b) {
                        if (a[b]) {
                            a[b].addClass("highcharts-tracker").on("mouseover", e).on("mouseout", function(a) {
                                c.onTrackerMouseOut(a)
                            });
                            if (l) a[b].on("touchstart", e);
                            a.options.cursor && a[b].css(G).css({
                                cursor: a.options.cursor
                            })
                        }
                    }), a._hasTracking = !0)
            },
            drawTrackerGraph: function() {
                var a = this,
                    b = a.options,
                    c = b.trackByArea,
                    e = [].concat(c ? a.areaPath : a.graphPath),
                    f = e.length,
                    g = a.chart,
                    k = g.pointer,
                    h = g.renderer,
                    p = g.options.tooltip.snap,
                    q = a.tracker,
                    z, x = function() {
                        if (g.hoverSeries !== a) a.onMouseOver()
                    },
                    r =
                    "rgba(192,192,192," + (n ? .0001 : .002) + ")";
                if (f && !c)
                    for (z = f + 1; z--;) "M" === e[z] && e.splice(z + 1, 0, e[z + 1] - p, e[z + 2], "L"), (z && "M" === e[z] || z === f) && e.splice(z, 0, "L", e[z - 2] + p, e[z - 1]);
                q ? q.attr({
                    d: e
                }) : a.graph && (a.tracker = h.path(e).attr({
                    "stroke-linejoin": "round",
                    visibility: a.visible ? "visible" : "hidden",
                    stroke: r,
                    fill: c ? r : "none",
                    "stroke-width": a.graph.strokeWidth() + (c ? 0 : 2 * p),
                    zIndex: 2
                }).add(a.group), m([a.tracker, a.markerGroup], function(a) {
                    a.addClass("highcharts-tracker").on("mouseover", x).on("mouseout", function(a) {
                        k.onTrackerMouseOut(a)
                    });
                    b.cursor && a.css({
                        cursor: b.cursor
                    });
                    if (l) a.on("touchstart", x)
                }))
            }
        };
        c.column && (c.column.prototype.drawTracker = a.drawTrackerPoint);
        c.pie && (c.pie.prototype.drawTracker = a.drawTrackerPoint);
        c.scatter && (c.scatter.prototype.drawTracker = a.drawTrackerPoint);
        t(k.prototype, {
            setItemEvents: function(a, b, c) {
                var d = this,
                    e = d.chart,
                    f = "highcharts-legend-" + (a.series ? "point" : "series") + "-active";
                (c ? b : a.legendGroup).on("mouseover", function() {
                    a.setState("hover");
                    e.seriesGroup.addClass(f);
                    b.css(d.options.itemHoverStyle)
                }).on("mouseout",
                    function() {
                        b.css(a.visible ? d.itemStyle : d.itemHiddenStyle);
                        e.seriesGroup.removeClass(f);
                        a.setState()
                    }).on("click", function(b) {
                    var c = function() {
                        a.setVisible && a.setVisible()
                    };
                    b = {
                        browserEvent: b
                    };
                    a.firePointEvent ? a.firePointEvent("legendItemClick", b, c) : q(a, "legendItemClick", b, c)
                })
            },
            createCheckboxForItem: function(a) {
                a.checkbox = F("input", {
                    type: "checkbox",
                    checked: a.selected,
                    defaultChecked: a.selected
                }, this.options.itemCheckboxStyle, this.chart.container);
                D(a.checkbox, "click", function(b) {
                    q(a.series || a, "checkboxClick", {
                        checked: b.target.checked,
                        item: a
                    }, function() {
                        a.select()
                    })
                })
            }
        });
        r.legend.itemStyle.cursor = "pointer";
        t(B.prototype, {
            showResetZoom: function() {
                var a = this,
                    b = r.lang,
                    c = a.options.chart.resetZoomButton,
                    e = c.theme,
                    f = e.states,
                    g = "chart" === c.relativeTo ? null : "plotBox";
                this.resetZoomButton = a.renderer.button(b.resetZoom, null, null, function() {
                    a.zoomOut()
                }, e, f && f.hover).attr({
                    align: c.position.align,
                    title: b.resetZoomTitle
                }).addClass("highcharts-reset-zoom").add().align(c.position, !1, g)
            },
            zoomOut: function() {
                var a = this;
                q(a, "selection", {
                    resetSelection: !0
                }, function() {
                    a.zoom()
                })
            },
            zoom: function(a) {
                var c, e = this.pointer,
                    f = !1,
                    g;
                !a || a.resetSelection ? m(this.axes, function(a) {
                    c = a.zoom()
                }) : m(a.xAxis.concat(a.yAxis), function(a) {
                    var b = a.axis;
                    e[b.isXAxis ? "zoomX" : "zoomY"] && (c = b.zoom(a.min, a.max), b.displayBtn && (f = !0))
                });
                g = this.resetZoomButton;
                f && !g ? this.showResetZoom() : !f && b(g) && (this.resetZoomButton = g.destroy());
                c && this.redraw(p(this.options.chart.animation, a && a.animation, 100 > this.pointCount))
            },
            pan: function(a, b) {
                var c = this,
                    d = c.hoverPoints,
                    e;
                d && m(d, function(a) {
                    a.setState()
                });
                m("xy" === b ? [1, 0] : [1], function(b) {
                    b = c[b ? "xAxis" : "yAxis"][0];
                    var d = b.horiz,
                        f = a[d ? "chartX" : "chartY"],
                        d = d ? "mouseDownX" : "mouseDownY",
                        g = c[d],
                        k = (b.pointRange || 0) / 2,
                        h = b.getExtremes(),
                        n = b.toValue(g - f, !0) + k,
                        k = b.toValue(g + b.len - f, !0) - k,
                        g = g > f;
                    b.series.length && (g || n > Math.min(h.dataMin, h.min)) && (!g || k < Math.max(h.dataMax, h.max)) && (b.setExtremes(n, k, !1, !1, {
                        trigger: "pan"
                    }), e = !0);
                    c[d] = f
                });
                e && c.redraw(!1);
                G(c.container, {
                    cursor: "move"
                })
            }
        });
        t(g.prototype, {
            select: function(a, b) {
                var c =
                    this,
                    d = c.series,
                    e = d.chart;
                a = p(a, !c.selected);
                c.firePointEvent(a ? "select" : "unselect", {
                    accumulate: b
                }, function() {
                    c.selected = c.options.selected = a;
                    d.options.data[f(c, d.data)] = c.options;
                    c.setState(a && "select");
                    b || m(e.getSelectedPoints(), function(a) {
                        a.selected && a !== c && (a.selected = a.options.selected = !1, d.options.data[f(a, d.data)] = a.options, a.setState(""), a.firePointEvent("unselect"))
                    })
                })
            },
            onMouseOver: function(a, b) {
                var c = this.series,
                    d = c.chart,
                    e = d.tooltip,
                    f = d.hoverPoint;
                if (this.series) {
                    if (!b) {
                        if (f && f !== this) f.onMouseOut();
                        if (d.hoverSeries !== c) c.onMouseOver();
                        d.hoverPoint = this
                    }!e || e.shared && !c.noSharedTooltip ? e || this.setState("hover") : (this.setState("hover"), e.refresh(this, a));
                    this.firePointEvent("mouseOver")
                }
            },
            onMouseOut: function() {
                var a = this.series.chart,
                    b = a.hoverPoints;
                this.firePointEvent("mouseOut");
                b && -1 !== f(this, b) || (this.setState(), a.hoverPoint = null)
            },
            importEvents: function() {
                if (!this.hasImportedEvents) {
                    var a = z(this.series.options.point, this.options).events,
                        b;
                    this.events = a;
                    for (b in a) D(this, b, a[b]);
                    this.hasImportedEvents = !0
                }
            },
            setState: function(a, b) {
                var c = Math.floor(this.plotX),
                    d = this.plotY,
                    e = this.series,
                    f = e.options.states[a] || {},
                    g = h[e.type].marker && e.options.marker,
                    k = g && !1 === g.enabled,
                    n = g && g.states && g.states[a] || {},
                    l = !1 === n.enabled,
                    m = e.stateMarkerGraphic,
                    u = this.marker || {},
                    q = e.chart,
                    z = e.halo,
                    r, A = g && e.markerAttribs;
                a = a || "";
                if (!(a === this.state && !b || this.selected && "select" !== a || !1 === f.enabled || a && (l || k && !1 === n.enabled) || a && u.states && u.states[a] && !1 === u.states[a].enabled)) {
                    A && (r = e.markerAttribs(this, a));
                    if (this.graphic) this.state &&
                        this.graphic.removeClass("highcharts-point-" + this.state), a && this.graphic.addClass("highcharts-point-" + a), this.graphic.attr(e.pointAttribs(this, a)), r && this.graphic.animate(r, p(q.options.chart.animation, n.animation, g.animation)), m && m.hide();
                    else {
                        if (a && n) {
                            g = u.symbol || e.symbol;
                            m && m.currentSymbol !== g && (m = m.destroy());
                            if (m) m[b ? "animate" : "attr"]({
                                x: r.x,
                                y: r.y
                            });
                            else g && (e.stateMarkerGraphic = m = q.renderer.symbol(g, r.x, r.y, r.width, r.height).add(e.markerGroup), m.currentSymbol = g);
                            m && m.attr(e.pointAttribs(this,
                                a))
                        }
                        m && (m[a && q.isInsidePlot(c, d, q.inverted) ? "show" : "hide"](), m.element.point = this)
                    }(c = f.halo) && c.size ? (z || (e.halo = z = q.renderer.path().add(A ? e.markerGroup : e.group)), z[b ? "animate" : "attr"]({
                        d: this.haloPath(c.size)
                    }), z.attr({
                        "class": "highcharts-halo highcharts-color-" + p(this.colorIndex, e.colorIndex)
                    }), z.attr(t({
                        fill: this.color || e.color,
                        "fill-opacity": c.opacity,
                        zIndex: -1
                    }, c.attributes))) : z && z.animate({
                        d: this.haloPath(0)
                    });
                    this.state = a
                }
            },
            haloPath: function(a) {
                return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX) -
                    a, this.plotY - a, 2 * a, 2 * a)
            }
        });
        t(e.prototype, {
            onMouseOver: function() {
                var a = this.chart,
                    b = a.hoverSeries;
                if (b && b !== this) b.onMouseOut();
                this.options.events.mouseOver && q(this, "mouseOver");
                this.setState("hover");
                a.hoverSeries = this
            },
            onMouseOut: function() {
                var a = this.options,
                    b = this.chart,
                    c = b.tooltip,
                    e = b.hoverPoint;
                b.hoverSeries = null;
                if (e) e.onMouseOut();
                this && a.events.mouseOut && q(this, "mouseOut");
                !c || a.stickyTracking || c.shared && !this.noSharedTooltip || c.hide();
                this.setState()
            },
            setState: function(a) {
                var b = this,
                    c =
                    b.options,
                    e = b.graph,
                    f = c.states,
                    g = c.lineWidth,
                    c = 0;
                a = a || "";
                if (b.state !== a && (m([b.group, b.markerGroup], function(c) {
                        c && (b.state && c.removeClass("highcharts-series-" + b.state), a && c.addClass("highcharts-series-" + a))
                    }), b.state = a, !f[a] || !1 !== f[a].enabled) && (a && (g = f[a].lineWidth || g + (f[a].lineWidthPlus || 0)), e && !e.dashstyle))
                    for (f = {
                            "stroke-width": g
                        }, e.attr(f); b["zone-graph-" + c];) b["zone-graph-" + c].attr(f), c += 1
            },
            setVisible: function(a, b) {
                var c = this,
                    d = c.chart,
                    e = c.legendItem,
                    f, g = d.options.chart.ignoreHiddenSeries,
                    k = c.visible;
                f = (c.visible = a = c.options.visible = c.userOptions.visible = void 0 === a ? !k : a) ? "show" : "hide";
                m(["group", "dataLabelsGroup", "markerGroup", "tracker", "tt"], function(a) {
                    if (c[a]) c[a][f]()
                });
                if (d.hoverSeries === c || (d.hoverPoint && d.hoverPoint.series) === c) c.onMouseOut();
                e && d.legend.colorizeItem(c, a);
                c.isDirty = !0;
                c.options.stacking && m(d.series, function(a) {
                    a.options.stacking && a.visible && (a.isDirty = !0)
                });
                m(c.linkedSeries, function(b) {
                    b.setVisible(a, !1)
                });
                g && (d.isDirtyBox = !0);
                !1 !== b && d.redraw();
                q(c, f)
            },
            show: function() {
                this.setVisible(!0)
            },
            hide: function() {
                this.setVisible(!1)
            },
            select: function(a) {
                this.selected = a = void 0 === a ? !this.selected : a;
                this.checkbox && (this.checkbox.checked = a);
                q(this, a ? "select" : "unselect")
            },
            drawTracker: a.drawTrackerGraph
        })
    })(N);
    (function(a) {
        var D = a.Chart,
            B = a.each,
            F = a.inArray,
            G = a.isObject,
            r = a.pick,
            h = a.splat;
        D.prototype.setResponsive = function(a) {
            var h = this.options.responsive;
            h && h.rules && B(h.rules, function(h) {
                this.matchResponsiveRule(h, a)
            }, this)
        };
        D.prototype.matchResponsiveRule = function(h, t) {
            var m = this.respRules,
                l = h.condition,
                f;
            f = l.callback || function() {
                return this.chartWidth <= r(l.maxWidth, Number.MAX_VALUE) && this.chartHeight <= r(l.maxHeight, Number.MAX_VALUE) && this.chartWidth >= r(l.minWidth, 0) && this.chartHeight >= r(l.minHeight, 0)
            };
            void 0 === h._id && (h._id = a.uniqueKey());
            f = f.call(this);
            !m[h._id] && f ? h.chartOptions && (m[h._id] = this.currentOptions(h.chartOptions), this.update(h.chartOptions, t)) : m[h._id] && !f && (this.update(m[h._id], t), delete m[h._id])
        };
        D.prototype.currentOptions = function(a) {
            function m(a, f, b) {
                var k, l;
                for (k in a)
                    if (-1 <
                        F(k, ["series", "xAxis", "yAxis"]))
                        for (a[k] = h(a[k]), b[k] = [], l = 0; l < a[k].length; l++) b[k][l] = {}, m(a[k][l], f[k][l], b[k][l]);
                    else G(a[k]) ? (b[k] = {}, m(a[k], f[k] || {}, b[k])) : b[k] = f[k] || null
            }
            var q = {};
            m(a, this.options, q);
            return q
        }
    })(N);
    (function(a) {
        var D = a.addEvent,
            B = a.Axis,
            F = a.Chart,
            G = a.css,
            r = a.dateFormat,
            h = a.defined,
            m = a.each,
            t = a.extend,
            q = a.noop,
            l = a.Series,
            f = a.timeUnits;
        a = a.wrap;
        a(l.prototype, "init", function(a) {
            var b;
            a.apply(this, Array.prototype.slice.call(arguments, 1));
            (b = this.xAxis) && b.options.ordinal && D(this,
                "updatedData",
                function() {
                    delete b.ordinalIndex
                })
        });
        a(B.prototype, "getTimeTicks", function(a, k, l, p, g, e, c, n) {
            var b = 0,
                d, m, q = {},
                v, z, I, t = [],
                w = -Number.MAX_VALUE,
                K = this.options.tickPixelInterval;
            if (!this.options.ordinal && !this.options.breaks || !e || 3 > e.length || void 0 === l) return a.call(this, k, l, p, g);
            z = e.length;
            for (d = 0; d < z; d++) {
                I = d && e[d - 1] > p;
                e[d] < l && (b = d);
                if (d === z - 1 || e[d + 1] - e[d] > 5 * c || I) {
                    if (e[d] > w) {
                        for (m = a.call(this, k, e[b], e[d], g); m.length && m[0] <= w;) m.shift();
                        m.length && (w = m[m.length - 1]);
                        t = t.concat(m)
                    }
                    b = d + 1
                }
                if (I) break
            }
            a =
                m.info;
            if (n && a.unitRange <= f.hour) {
                d = t.length - 1;
                for (b = 1; b < d; b++) r("%d", t[b]) !== r("%d", t[b - 1]) && (q[t[b]] = "day", v = !0);
                v && (q[t[0]] = "day");
                a.higherRanks = q
            }
            t.info = a;
            if (n && h(K)) {
                n = a = t.length;
                d = [];
                var M;
                for (v = []; n--;) b = this.translate(t[n]), M && (v[n] = M - b), d[n] = M = b;
                v.sort();
                v = v[Math.floor(v.length / 2)];
                v < .6 * K && (v = null);
                n = t[a - 1] > p ? a - 1 : a;
                for (M = void 0; n--;) b = d[n], p = M - b, M && p < .8 * K && (null === v || p < .8 * v) ? (q[t[n]] && !q[t[n + 1]] ? (p = n + 1, M = b) : p = n, t.splice(p, 1)) : M = b
            }
            return t
        });
        t(B.prototype, {
            beforeSetTickPositions: function() {
                var a,
                    f = [],
                    h = !1,
                    l, g = this.getExtremes(),
                    e = g.min,
                    c = g.max,
                    n, q = this.isXAxis && !!this.options.breaks,
                    g = this.options.ordinal,
                    d = this.chart.options.chart.ignoreHiddenSeries;
                if (g || q) {
                    m(this.series, function(b, c) {
                        if (!(d && !1 === b.visible || !1 === b.takeOrdinalPosition && !q) && (f = f.concat(b.processedXData), a = f.length, f.sort(function(a, b) {
                                return a - b
                            }), a))
                            for (c = a - 1; c--;) f[c] === f[c + 1] && f.splice(c, 1)
                    });
                    a = f.length;
                    if (2 < a) {
                        l = f[1] - f[0];
                        for (n = a - 1; n-- && !h;) f[n + 1] - f[n] !== l && (h = !0);
                        !this.options.keepOrdinalPadding && (f[0] - e > l || c - f[f.length -
                            1] > l) && (h = !0)
                    }
                    h ? (this.ordinalPositions = f, l = this.val2lin(Math.max(e, f[0]), !0), n = Math.max(this.val2lin(Math.min(c, f[f.length - 1]), !0), 1), this.ordinalSlope = c = (c - e) / (n - l), this.ordinalOffset = e - l * c) : this.ordinalPositions = this.ordinalSlope = this.ordinalOffset = void 0
                }
                this.isOrdinal = g && h;
                this.groupIntervalFactor = null
            },
            val2lin: function(a, f) {
                var b = this.ordinalPositions;
                if (b) {
                    var k = b.length,
                        g, e;
                    for (g = k; g--;)
                        if (b[g] === a) {
                            e = g;
                            break
                        }
                    for (g = k - 1; g--;)
                        if (a > b[g] || 0 === g) {
                            a = (a - b[g]) / (b[g + 1] - b[g]);
                            e = g + a;
                            break
                        }
                    f = f ? e : this.ordinalSlope *
                        (e || 0) + this.ordinalOffset
                } else f = a;
                return f
            },
            lin2val: function(a, f) {
                var b = this.ordinalPositions;
                if (b) {
                    var k = this.ordinalSlope,
                        g = this.ordinalOffset,
                        e = b.length - 1,
                        c;
                    if (f) 0 > a ? a = b[0] : a > e ? a = b[e] : (e = Math.floor(a), c = a - e);
                    else
                        for (; e--;)
                            if (f = k * e + g, a >= f) {
                                k = k * (e + 1) + g;
                                c = (a - f) / (k - f);
                                break
                            } return void 0 !== c && void 0 !== b[e] ? b[e] + (c ? c * (b[e + 1] - b[e]) : 0) : a
                }
                return a
            },
            getExtendedPositions: function() {
                var a = this.chart,
                    f = this.series[0].currentDataGrouping,
                    h = this.ordinalIndex,
                    l = f ? f.count + f.unitName : "raw",
                    g = this.getExtremes(),
                    e, c;
                h || (h = this.ordinalIndex = {});
                h[l] || (e = {
                    series: [],
                    chart: a,
                    getExtremes: function() {
                        return {
                            min: g.dataMin,
                            max: g.dataMax
                        }
                    },
                    options: {
                        ordinal: !0
                    },
                    val2lin: B.prototype.val2lin
                }, m(this.series, function(b) {
                    c = {
                        xAxis: e,
                        xData: b.xData,
                        chart: a,
                        destroyGroupedData: q
                    };
                    c.options = {
                        dataGrouping: f ? {
                            enabled: !0,
                            forced: !0,
                            approximation: "open",
                            units: [
                                [f.unitName, [f.count]]
                            ]
                        } : {
                            enabled: !1
                        }
                    };
                    b.processData.apply(c);
                    e.series.push(c)
                }), this.beforeSetTickPositions.apply(e), h[l] = e.ordinalPositions);
                return h[l]
            },
            getGroupIntervalFactor: function(a,
                f, h) {
                var b;
                h = h.processedXData;
                var g = h.length,
                    e = [];
                b = this.groupIntervalFactor;
                if (!b) {
                    for (b = 0; b < g - 1; b++) e[b] = h[b + 1] - h[b];
                    e.sort(function(a, b) {
                        return a - b
                    });
                    e = e[Math.floor(g / 2)];
                    a = Math.max(a, h[0]);
                    f = Math.min(f, h[g - 1]);
                    this.groupIntervalFactor = b = g * e / (f - a)
                }
                return b
            },
            postProcessTickInterval: function(a) {
                var b = this.ordinalSlope;
                return b ? this.options.breaks ? this.closestPointRange : a / (b / this.closestPointRange) : a
            }
        });
        a(F.prototype, "pan", function(a, f) {
            var b = this.xAxis[0],
                k = f.chartX,
                g = !1;
            if (b.options.ordinal && b.series.length) {
                var e =
                    this.mouseDownX,
                    c = b.getExtremes(),
                    h = c.dataMax,
                    l = c.min,
                    d = c.max,
                    q = this.hoverPoints,
                    r = b.closestPointRange,
                    e = (e - k) / (b.translationSlope * (b.ordinalSlope || r)),
                    v = {
                        ordinalPositions: b.getExtendedPositions()
                    },
                    r = b.lin2val,
                    E = b.val2lin,
                    t;
                v.ordinalPositions ? 1 < Math.abs(e) && (q && m(q, function(a) {
                    a.setState()
                }), 0 > e ? (q = v, t = b.ordinalPositions ? b : v) : (q = b.ordinalPositions ? b : v, t = v), v = t.ordinalPositions, h > v[v.length - 1] && v.push(h), this.fixedRange = d - l, e = b.toFixedRange(null, null, r.apply(q, [E.apply(q, [l, !0]) + e, !0]), r.apply(t, [E.apply(t, [d, !0]) + e, !0])), e.min >= Math.min(c.dataMin, l) && e.max <= Math.max(h, d) && b.setExtremes(e.min, e.max, !0, !1, {
                    trigger: "pan"
                }), this.mouseDownX = k, G(this.container, {
                    cursor: "move"
                })) : g = !0
            } else g = !0;
            g && a.apply(this, Array.prototype.slice.call(arguments, 1))
        });
        l.prototype.gappedPath = function() {
            var a = this.options.gapSize,
                f = this.points.slice(),
                h = f.length - 1;
            if (a && 0 < h)
                for (; h--;) f[h + 1].x - f[h].x > this.closestPointRange * a && f.splice(h + 1, 0, {
                    isNull: !0
                });
            return this.getGraphPath(f)
        }
    })(N);
    (function(a) {
        function D() {
            return Array.prototype.slice.call(arguments,
                1)
        }

        function B(a) {
            a.apply(this);
            this.drawBreaks(this.xAxis, ["x"]);
            this.drawBreaks(this.yAxis, F(this.pointArrayMap, ["y"]))
        }
        var F = a.pick,
            G = a.wrap,
            r = a.each,
            h = a.extend,
            m = a.fireEvent,
            t = a.Axis,
            q = a.Series;
        h(t.prototype, {
            isInBreak: function(a, f) {
                var b = a.repeat || Infinity,
                    k = a.from,
                    h = a.to - a.from;
                f = f >= k ? (f - k) % b : b - (k - f) % b;
                return a.inclusive ? f <= h : f < h && 0 !== f
            },
            isInAnyBreak: function(a, f) {
                var b = this.options.breaks,
                    k = b && b.length,
                    h, l, g;
                if (k) {
                    for (; k--;) this.isInBreak(b[k], a) && (h = !0, l || (l = F(b[k].showPoints, this.isXAxis ?
                        !1 : !0)));
                    g = h && f ? h && !l : h
                }
                return g
            }
        });
        G(t.prototype, "setTickPositions", function(a) {
            a.apply(this, Array.prototype.slice.call(arguments, 1));
            if (this.options.breaks) {
                var f = this.tickPositions,
                    b = this.tickPositions.info,
                    k = [],
                    h;
                for (h = 0; h < f.length; h++) this.isInAnyBreak(f[h]) || k.push(f[h]);
                this.tickPositions = k;
                this.tickPositions.info = b
            }
        });
        G(t.prototype, "init", function(a, f, b) {
            b.breaks && b.breaks.length && (b.ordinal = !1);
            a.call(this, f, b);
            if (this.options.breaks) {
                var k = this;
                k.isBroken = !0;
                this.val2lin = function(a) {
                    var b =
                        a,
                        f, e;
                    for (e = 0; e < k.breakArray.length; e++)
                        if (f = k.breakArray[e], f.to <= a) b -= f.len;
                        else if (f.from >= a) break;
                    else if (k.isInBreak(f, a)) {
                        b -= a - f.from;
                        break
                    }
                    return b
                };
                this.lin2val = function(a) {
                    var b, f;
                    for (f = 0; f < k.breakArray.length && !(b = k.breakArray[f], b.from >= a); f++) b.to < a ? a += b.len : k.isInBreak(b, a) && (a += b.len);
                    return a
                };
                this.setExtremes = function(a, b, f, e, c) {
                    for (; this.isInAnyBreak(a);) a -= this.closestPointRange;
                    for (; this.isInAnyBreak(b);) b -= this.closestPointRange;
                    t.prototype.setExtremes.call(this, a, b, f, e, c)
                };
                this.setAxisTranslation =
                    function(a) {
                        t.prototype.setAxisTranslation.call(this, a);
                        var b = k.options.breaks;
                        a = [];
                        var f = [],
                            e = 0,
                            c, h, l = k.userMin || k.min,
                            d = k.userMax || k.max,
                            q, r;
                        for (r in b) h = b[r], c = h.repeat || Infinity, k.isInBreak(h, l) && (l += h.to % c - l % c), k.isInBreak(h, d) && (d -= d % c - h.from % c);
                        for (r in b) {
                            h = b[r];
                            q = h.from;
                            for (c = h.repeat || Infinity; q - c > l;) q -= c;
                            for (; q < l;) q += c;
                            for (; q < d; q += c) a.push({
                                value: q,
                                move: "in"
                            }), a.push({
                                value: q + (h.to - h.from),
                                move: "out",
                                size: h.breakSize
                            })
                        }
                        a.sort(function(a, b) {
                            return a.value === b.value ? ("in" === a.move ? 0 : 1) - ("in" ===
                                b.move ? 0 : 1) : a.value - b.value
                        });
                        b = 0;
                        q = l;
                        for (r in a) h = a[r], b += "in" === h.move ? 1 : -1, 1 === b && "in" === h.move && (q = h.value), 0 === b && (f.push({
                            from: q,
                            to: h.value,
                            len: h.value - q - (h.size || 0)
                        }), e += h.value - q - (h.size || 0));
                        k.breakArray = f;
                        m(k, "afterBreaks");
                        k.transA *= (d - k.min) / (d - l - e);
                        k.min = l;
                        k.max = d
                    }
            }
        });
        G(q.prototype, "generatePoints", function(a) {
            a.apply(this, D(arguments));
            var f = this.xAxis,
                b = this.yAxis,
                h = this.points,
                l, m = h.length,
                g = this.options.connectNulls,
                e;
            if (f && b && (f.options.breaks || b.options.breaks))
                for (; m--;) l = h[m],
                    e = null === l.y && !1 === g, e || !f.isInAnyBreak(l.x, !0) && !b.isInAnyBreak(l.y, !0) || (h.splice(m, 1), this.data[m] && this.data[m].destroyElements())
        });
        a.Series.prototype.drawBreaks = function(a, f) {
            var b = this,
                h = b.points,
                l, p, g, e;
            r(f, function(c) {
                l = a.breakArray || [];
                p = a.isXAxis ? a.min : F(b.options.threshold, a.min);
                r(h, function(b) {
                    e = F(b["stack" + c.toUpperCase()], b[c]);
                    r(l, function(c) {
                        g = !1;
                        if (p < c.from && e > c.to || p > c.from && e < c.from) g = "pointBreak";
                        else if (p < c.from && e > c.from && e < c.to || p > c.from && e > c.to && e < c.from) g = "pointInBreak";
                        g && m(a, g, {
                            point: b,
                            brk: c
                        })
                    })
                })
            })
        };
        G(a.seriesTypes.column.prototype, "drawPoints", B);
        G(a.Series.prototype, "drawPoints", B)
    })(N);
    (function(a) {
        var D = a.arrayMax,
            B = a.arrayMin,
            F = a.Axis,
            G = a.defaultPlotOptions,
            r = a.defined,
            h = a.each,
            m = a.error,
            t = a.extend,
            q = a.format,
            l = a.isNumber,
            f = a.merge,
            b = a.pick,
            k = a.Point,
            z = a.Tooltip,
            p = a.wrap,
            g = a.Series.prototype,
            e = g.processData,
            c = g.generatePoints,
            n = g.destroy,
            u = {
                approximation: "average",
                groupPixelWidth: 2,
                dateTimeLabelFormats: {
                    millisecond: ["%A, %b %e, %H:%M:%S.%L", "%A, %b %e, %H:%M:%S.%L",
                        "-%H:%M:%S.%L"
                    ],
                    second: ["%A, %b %e, %H:%M:%S", "%A, %b %e, %H:%M:%S", "-%H:%M:%S"],
                    minute: ["%A, %b %e, %H:%M", "%A, %b %e, %H:%M", "-%H:%M"],
                    hour: ["%A, %b %e, %H:%M", "%A, %b %e, %H:%M", "-%H:%M"],
                    day: ["%A, %b %e, %Y", "%A, %b %e", "-%A, %b %e, %Y"],
                    week: ["Week from %A, %b %e, %Y", "%A, %b %e", "-%A, %b %e, %Y"],
                    month: ["%B %Y", "%B", "-%B %Y"],
                    year: ["%Y", "%Y", "-%Y"]
                }
            },
            d = {
                line: {},
                spline: {},
                area: {},
                areaspline: {},
                column: {
                    approximation: "sum",
                    groupPixelWidth: 10
                },
                arearange: {
                    approximation: "range"
                },
                areasplinerange: {
                    approximation: "range"
                },
                columnrange: {
                    approximation: "range",
                    groupPixelWidth: 10
                },
                candlestick: {
                    approximation: "ohlc",
                    groupPixelWidth: 10
                },
                ohlc: {
                    approximation: "ohlc",
                    groupPixelWidth: 5
                }
            },
            C = a.defaultDataGroupingUnits = [
                ["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]],
                ["second", [1, 2, 5, 10, 15, 30]],
                ["minute", [1, 2, 5, 10, 15, 30]],
                ["hour", [1, 2, 3, 4, 6, 8, 12]],
                ["day", [1]],
                ["week", [1]],
                ["month", [1, 3, 6]],
                ["year", null]
            ],
            y = {
                sum: function(a) {
                    var b = a.length,
                        c;
                    if (!b && a.hasNulls) c = null;
                    else if (b)
                        for (c = 0; b--;) c += a[b];
                    return c
                },
                average: function(a) {
                    var b =
                        a.length;
                    a = y.sum(a);
                    l(a) && b && (a /= b);
                    return a
                },
                open: function(a) {
                    return a.length ? a[0] : a.hasNulls ? null : void 0
                },
                high: function(a) {
                    return a.length ? D(a) : a.hasNulls ? null : void 0
                },
                low: function(a) {
                    return a.length ? B(a) : a.hasNulls ? null : void 0
                },
                close: function(a) {
                    return a.length ? a[a.length - 1] : a.hasNulls ? null : void 0
                },
                ohlc: function(a, b, c, d) {
                    a = y.open(a);
                    b = y.high(b);
                    c = y.low(c);
                    d = y.close(d);
                    if (l(a) || l(b) || l(c) || l(d)) return [a, b, c, d]
                },
                range: function(a, b) {
                    a = y.low(a);
                    b = y.high(b);
                    if (l(a) || l(b)) return [a, b]
                }
            };
        g.groupData = function(a,
            b, c, d) {
            var e = this.data,
                f = this.options.data,
                g = [],
                h = [],
                k = [],
                n = a.length,
                m, p, q = !!b,
                v = [
                    [],
                    [],
                    [],
                    []
                ];
            d = "function" === typeof d ? d : y[d];
            var r = this.pointArrayMap,
                u = r && r.length,
                t, E = 0;
            for (t = p = 0; t <= n && !(a[t] >= c[0]); t++);
            for (t; t <= n; t++) {
                for (;
                    (void 0 !== c[E + 1] && a[t] >= c[E + 1] || t === n) && (m = c[E], this.dataGroupInfo = {
                        start: p,
                        length: v[0].length
                    }, p = d.apply(this, v), void 0 !== p && (g.push(m), h.push(p), k.push(this.dataGroupInfo)), p = t, v[0] = [], v[1] = [], v[2] = [], v[3] = [], E += 1, t !== n););
                if (t === n) break;
                if (r) {
                    m = this.cropStart + t;
                    m = e && e[m] ||
                        this.pointClass.prototype.applyOptions.apply({
                            series: this
                        }, [f[m]]);
                    var I, z;
                    for (I = 0; I < u; I++) z = m[r[I]], l(z) ? v[I].push(z) : null === z && (v[I].hasNulls = !0)
                } else m = q ? b[t] : null, l(m) ? v[0].push(m) : null === m && (v[0].hasNulls = !0)
            }
            return [g, h, k]
        };
        g.processData = function() {
            var a = this.chart,
                c = this.options.dataGrouping,
                d = !1 !== this.allowDG && c && b(c.enabled, a.options._stock),
                f = this.visible || !a.options.chart.ignoreHiddenSeries,
                h;
            this.forceCrop = d;
            this.groupPixelWidth = null;
            this.hasProcessed = !0;
            if (!1 !== e.apply(this, arguments) &&
                d && f) {
                this.destroyGroupedData();
                var k = this.processedXData,
                    n = this.processedYData,
                    l = a.plotSizeX,
                    a = this.xAxis,
                    m = a.options.ordinal,
                    p = this.groupPixelWidth = a.getGroupPixelWidth && a.getGroupPixelWidth();
                if (p) {
                    this.isDirty = h = !0;
                    f = a.getExtremes();
                    d = f.min;
                    f = f.max;
                    m = m && a.getGroupIntervalFactor(d, f, this) || 1;
                    l = p * (f - d) / l * m;
                    p = a.getTimeTicks(a.normalizeTimeTickInterval(l, c.units || C), Math.min(d, k[0]), Math.max(f, k[k.length - 1]), a.options.startOfWeek, k, this.closestPointRange);
                    k = g.groupData.apply(this, [k, n, p, c.approximation]);
                    n = k[0];
                    m = k[1];
                    if (c.smoothed) {
                        c = n.length - 1;
                        for (n[c] = Math.min(n[c], f); c-- && 0 < c;) n[c] += l / 2;
                        n[0] = Math.max(n[0], d)
                    }
                    this.currentDataGrouping = p.info;
                    this.closestPointRange = p.info.totalRange;
                    this.groupMap = k[2];
                    r(n[0]) && n[0] < a.dataMin && (a.min === a.dataMin && (a.min = n[0]), a.dataMin = n[0]);
                    this.processedXData = n;
                    this.processedYData = m
                } else this.currentDataGrouping = this.groupMap = null;
                this.hasGroupedData = h
            }
        };
        g.destroyGroupedData = function() {
            var a = this.groupedData;
            h(a || [], function(b, c) {
                b && (a[c] = b.destroy ? b.destroy() :
                    null)
            });
            this.groupedData = null
        };
        g.generatePoints = function() {
            c.apply(this);
            this.destroyGroupedData();
            this.groupedData = this.hasGroupedData ? this.points : null
        };
        p(k.prototype, "update", function(a) {
            this.dataGroup ? m(24) : a.apply(this, [].slice.call(arguments, 1))
        });
        p(z.prototype, "tooltipFooterHeaderFormatter", function(b, c, d) {
            var f = c.series,
                e = f.tooltipOptions,
                g = f.options.dataGrouping,
                h = e.xDateFormat,
                k, n = f.xAxis,
                m = a.dateFormat;
            return n && "datetime" === n.options.type && g && l(c.key) ? (b = f.currentDataGrouping, g = g.dateTimeLabelFormats,
                b ? (n = g[b.unitName], 1 === b.count ? h = n[0] : (h = n[1], k = n[2])) : !h && g && (h = this.getXDateFormat(c, e, n)), h = m(h, c.key), k && (h += m(k, c.key + b.totalRange - 1)), q(e[(d ? "footer" : "header") + "Format"], {
                    point: t(c.point, {
                        key: h
                    }),
                    series: f
                })) : b.call(this, c, d)
        });
        g.destroy = function() {
            for (var a = this.groupedData || [], b = a.length; b--;) a[b] && a[b].destroy();
            n.apply(this)
        };
        p(g, "setOptions", function(a, b) {
            a = a.call(this, b);
            var c = this.type,
                e = this.chart.options.plotOptions,
                g = G[c].dataGrouping;
            d[c] && (g || (g = f(u, d[c])), a.dataGrouping = f(g, e.series &&
                e.series.dataGrouping, e[c].dataGrouping, b.dataGrouping));
            this.chart.options._stock && (this.requireSorting = !0);
            return a
        });
        p(F.prototype, "setScale", function(a) {
            a.call(this);
            h(this.series, function(a) {
                a.hasProcessed = !1
            })
        });
        F.prototype.getGroupPixelWidth = function() {
            var a = this.series,
                b = a.length,
                c, d = 0,
                f = !1,
                e;
            for (c = b; c--;)(e = a[c].options.dataGrouping) && (d = Math.max(d, e.groupPixelWidth));
            for (c = b; c--;)(e = a[c].options.dataGrouping) && a[c].hasProcessed && (b = (a[c].processedXData || a[c].data).length, a[c].groupPixelWidth ||
                b > this.chart.plotSizeX / d || b && e.forced) && (f = !0);
            return f ? d : 0
        };
        F.prototype.setDataGrouping = function(a, c) {
            var d;
            c = b(c, !0);
            a || (a = {
                forced: !1,
                units: null
            });
            if (this instanceof F)
                for (d = this.series.length; d--;) this.series[d].update({
                    dataGrouping: a
                }, !1);
            else h(this.chart.options.series, function(b) {
                b.dataGrouping = a
            }, !1);
            c && this.chart.redraw()
        }
    })(N);
    (function(a) {
        var D = a.each,
            B = a.Point,
            F = a.seriesType,
            G = a.seriesTypes;
        F("ohlc", "column", {
            lineWidth: 1,
            tooltip: {
                pointFormat: '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e \x3cb\x3e {series.name}\x3c/b\x3e\x3cbr/\x3eOpen: {point.open}\x3cbr/\x3eHigh: {point.high}\x3cbr/\x3eLow: {point.low}\x3cbr/\x3eClose: {point.close}\x3cbr/\x3e'
            },
            threshold: null,
            states: {
                hover: {
                    lineWidth: 3
                }
            }
        }, {
            pointArrayMap: ["open", "high", "low", "close"],
            toYData: function(a) {
                return [a.open, a.high, a.low, a.close]
            },
            pointValKey: "high",
            pointAttribs: function(a, h) {
                h = G.column.prototype.pointAttribs.call(this, a, h);
                var m = this.options;
                delete h.fill;
                h["stroke-width"] = m.lineWidth;
                h.stroke = a.options.color || (a.open < a.close ? m.upColor || this.color : this.color);
                return h
            },
            translate: function() {
                var a = this,
                    h = a.yAxis,
                    m = !!a.modifyValue,
                    t = ["plotOpen", "yBottom", "plotClose"];
                G.column.prototype.translate.apply(a);
                D(a.points, function(q) {
                    D([q.open, q.low, q.close], function(l, f) {
                        null !== l && (m && (l = a.modifyValue(l)), q[t[f]] = h.toPixels(l, !0))
                    })
                })
            },
            drawPoints: function() {
                var a = this,
                    h = a.chart;
                D(a.points, function(m) {
                    var r, q, l, f, b = m.graphic,
                        k, z = !b;
                    void 0 !== m.plotY && (b || (m.graphic = b = h.renderer.path().add(a.group)), b.attr(a.pointAttribs(m, m.selected && "select")), q = b.strokeWidth() % 2 / 2, k = Math.round(m.plotX) - q, l = Math.round(m.shapeArgs.width / 2), f = ["M", k, Math.round(m.yBottom), "L", k, Math.round(m.plotY)], null !== m.open && (r = Math.round(m.plotOpen) +
                        q, f.push("M", k, r, "L", k - l, r)), null !== m.close && (r = Math.round(m.plotClose) + q, f.push("M", k, r, "L", k + l, r)), b[z ? "attr" : "animate"]({
                        d: f
                    }).addClass(m.getClassName(), !0))
                })
            },
            animate: null
        }, {
            getClassName: function() {
                return B.prototype.getClassName.call(this) + (this.open < this.close ? " highcharts-point-up" : " highcharts-point-down")
            }
        })
    })(N);
    (function(a) {
        var D = a.defaultPlotOptions,
            B = a.each,
            F = a.merge,
            G = a.seriesType,
            r = a.seriesTypes;
        G("candlestick", "ohlc", F(D.column, {
            states: {
                hover: {
                    lineWidth: 2
                }
            },
            tooltip: D.ohlc.tooltip,
            threshold: null,
            lineColor: "#000000",
            lineWidth: 1,
            upColor: "#ffffff"
        }), {
            pointAttribs: function(a, m) {
                var h = r.column.prototype.pointAttribs.call(this, a, m),
                    q = this.options,
                    l = a.open < a.close,
                    f = q.lineColor || this.color;
                h["stroke-width"] = q.lineWidth;
                h.fill = a.options.color || (l ? q.upColor || this.color : this.color);
                h.stroke = a.lineColor || (l ? q.upLineColor || f : f);
                m && (a = q.states[m], h.fill = a.color || h.fill, h.stroke = a.stroke || h.stroke);
                return h
            },
            drawPoints: function() {
                var a = this,
                    m = a.chart;
                B(a.points, function(h) {
                    var q = h.graphic,
                        l, f, b, k, r, p, g, e = !q;
                    void 0 !== h.plotY && (q || (h.graphic = q = m.renderer.path().add(a.group)), q.attr(a.pointAttribs(h, h.selected && "select")).shadow(a.options.shadow), r = q.strokeWidth() % 2 / 2, p = Math.round(h.plotX) - r, l = h.plotOpen, f = h.plotClose, b = Math.min(l, f), l = Math.max(l, f), g = Math.round(h.shapeArgs.width / 2), f = Math.round(b) !== Math.round(h.plotY), k = l !== h.yBottom, b = Math.round(b) + r, l = Math.round(l) + r, r = [], r.push("M", p - g, l, "L", p - g, b, "L", p + g, b, "L", p + g, l, "Z", "M", p, b, "L", p, f ? Math.round(h.plotY) : b, "M", p, l, "L", p, k ? Math.round(h.yBottom) :
                        l), q[e ? "attr" : "animate"]({
                        d: r
                    }).addClass(h.getClassName(), !0))
                })
            }
        })
    })(N);
    (function(a) {
        var D = a.addEvent,
            B = a.each,
            F = a.merge,
            G = a.noop,
            r = a.Renderer,
            h = a.seriesType,
            m = a.seriesTypes,
            t = a.TrackerMixin,
            q = a.VMLRenderer,
            l = a.SVGRenderer.prototype.symbols;
        h("flags", "column", {
            pointRange: 0,
            shape: "flag",
            stackDistance: 12,
            textAlign: "center",
            tooltip: {
                pointFormat: "{point.text}\x3cbr/\x3e"
            },
            threshold: null,
            y: -30,
            fillColor: "#ffffff",
            lineWidth: 1,
            states: {
                hover: {
                    lineColor: "#000000",
                    fillColor: "#ccd6eb"
                }
            },
            style: {
                fontSize: "11px",
                fontWeight: "bold"
            }
        }, {
            sorted: !1,
            noSharedTooltip: !0,
            allowDG: !1,
            takeOrdinalPosition: !1,
            trackerGroups: ["markerGroup"],
            forceCrop: !0,
            init: a.Series.prototype.init,
            pointAttribs: function(a, b) {
                var f = this.options,
                    h = a && a.color || this.color,
                    l = f.lineColor;
                a = a && a.lineWidth;
                var g = f.fillColor;
                b && (g = f.states[b].fillColor, l = f.states[b].lineColor, a = f.states[b].lineWidth);
                return {
                    fill: g || h,
                    stroke: l || h,
                    "stroke-width": a || f.lineWidth || 0
                }
            },
            translate: function() {
                m.column.prototype.translate.apply(this);
                var a = this.options,
                    b = this.chart,
                    h = this.points,
                    l = h.length - 1,
                    p, g, e = a.onSeries;
                p = e && b.get(e);
                var a = a.onKey || "y",
                    e = p && p.options.step,
                    c = p && p.points,
                    n = c && c.length,
                    q = this.xAxis,
                    d = q.getExtremes(),
                    r = 0,
                    y, v, t;
                if (p && p.visible && n)
                    for (r = (p.pointXOffset || 0) + (p.barW || 0) / 2, p = p.currentDataGrouping, v = c[n - 1].x + (p ? p.totalRange : 0), h.sort(function(a, b) {
                            return a.x - b.x
                        }), a = "plot" + a[0].toUpperCase() + a.substr(1); n-- && h[l] && !(p = h[l], y = c[n], y.x <= p.x && void 0 !== y[a] && (p.x <= v && (p.plotY = y[a], y.x < p.x && !e && (t = c[n + 1]) && void 0 !== t[a] && (p.plotY += (p.x - y.x) / (t.x - y.x) *
                            (t[a] - y[a]))), l--, n++, 0 > l)););
                B(h, function(a, c) {
                    var e;
                    void 0 === a.plotY && (a.x >= d.min && a.x <= d.max ? a.plotY = b.chartHeight - q.bottom - (q.opposite ? q.height : 0) + q.offset - b.plotTop : a.shapeArgs = {});
                    a.plotX += r;
                    (g = h[c - 1]) && g.plotX === a.plotX && (void 0 === g.stackIndex && (g.stackIndex = 0), e = g.stackIndex + 1);
                    a.stackIndex = e
                })
            },
            drawPoints: function() {
                var a = this.points,
                    b = this.chart,
                    h = b.renderer,
                    l, m, g = this.options,
                    e = g.y,
                    c, n, q, d, r, y, v, t = this.yAxis;
                for (n = a.length; n--;) q = a[n], v = q.plotX > this.xAxis.len, l = q.plotX, d = q.stackIndex, c =
                    q.options.shape || g.shape, m = q.plotY, void 0 !== m && (m = q.plotY + e - (void 0 !== d && d * g.stackDistance)), r = d ? void 0 : q.plotX, y = d ? void 0 : q.plotY, d = q.graphic, void 0 !== m && 0 <= l && !v ? (d || (d = q.graphic = h.label("", null, null, c, null, null, g.useHTML).attr(this.pointAttribs(q)).css(F(g.style, q.style)).attr({
                        align: "flag" === c ? "left" : "center",
                        width: g.width,
                        height: g.height,
                        "text-align": g.textAlign
                    }).addClass("highcharts-point").add(this.markerGroup), d.shadow(g.shadow)), 0 < l && (l -= d.strokeWidth() % 2), d.attr({
                        text: q.options.title ||
                            g.title || "A",
                        x: l,
                        y: m,
                        anchorX: r,
                        anchorY: y
                    }), q.tooltipPos = b.inverted ? [t.len + t.pos - b.plotLeft - m, this.xAxis.len - l] : [l, m]) : d && (q.graphic = d.destroy())
            },
            drawTracker: function() {
                var a = this.points;
                t.drawTrackerPoint.apply(this);
                B(a, function(b) {
                    var f = b.graphic;
                    f && D(f.element, "mouseover", function() {
                        0 < b.stackIndex && !b.raised && (b._y = f.y, f.attr({
                            y: b._y - 8
                        }), b.raised = !0);
                        B(a, function(a) {
                            a !== b && a.raised && a.graphic && (a.graphic.attr({
                                y: a._y
                            }), a.raised = !1)
                        })
                    })
                })
            },
            animate: G,
            buildKDTree: G,
            setClip: G
        });
        l.flag = function(a,
            b, h, l, m) {
            return ["M", m && m.anchorX || a, m && m.anchorY || b, "L", a, b + l, a, b, a + h, b, a + h, b + l, a, b + l, "Z"]
        };
        B(["circle", "square"], function(a) {
            l[a + "pin"] = function(b, f, h, m, g) {
                var e = g && g.anchorX;
                g = g && g.anchorY;
                "circle" === a && m > h && (b -= Math.round((m - h) / 2), h = m);
                b = l[a](b, f, h, m);
                e && g && b.push("M", e, f > g ? f : f + m, "L", e, g);
                return b
            }
        });
        r === q && B(["flag", "circlepin", "squarepin"], function(a) {
            q.prototype.symbols[a] = l[a]
        })
    })(N);
    (function(a) {
        function D(a, b, e) {
            this.init(a, b, e)
        }
        var B = a.addEvent,
            F = a.Axis,
            G = a.correctFloat,
            r = a.defaultOptions,
            h = a.defined,
            m = a.destroyObjectProperties,
            t = a.doc,
            q = a.each,
            l = a.fireEvent,
            f = a.hasTouch,
            b = a.isTouchDevice,
            k = a.merge,
            z = a.pick,
            p = a.removeEvent,
            g = a.wrap,
            e = {
                height: b ? 20 : 14,
                barBorderRadius: 0,
                buttonBorderRadius: 0,
                liveRedraw: a.svg && !b,
                margin: 10,
                minWidth: 6,
                step: .2,
                zIndex: 3,
                barBackgroundColor: "#cccccc",
                barBorderWidth: 1,
                barBorderColor: "#cccccc",
                buttonArrowColor: "#333333",
                buttonBackgroundColor: "#e6e6e6",
                buttonBorderColor: "#cccccc",
                buttonBorderWidth: 1,
                rifleColor: "#333333",
                trackBackgroundColor: "#f2f2f2",
                trackBorderColor: "#f2f2f2",
                trackBorderWidth: 1
            };
        r.scrollbar = k(!0, e, r.scrollbar);
        D.prototype = {
            init: function(a, b, f) {
                this.scrollbarButtons = [];
                this.renderer = a;
                this.userOptions = b;
                this.options = k(e, b);
                this.chart = f;
                this.size = z(this.options.size, this.options.height);
                b.enabled && (this.render(), this.initEvents(), this.addEvents())
            },
            render: function() {
                var a = this.renderer,
                    b = this.options,
                    e = this.size,
                    d;
                this.group = d = a.g("scrollbar").attr({
                    zIndex: b.zIndex,
                    translateY: -99999
                }).add();
                this.track = a.rect().addClass("highcharts-scrollbar-track").attr({
                    x: 0,
                    r: b.trackBorderRadius || 0,
                    height: e,
                    width: e
                }).add(d);
                this.track.attr({
                    fill: b.trackBackgroundColor,
                    stroke: b.trackBorderColor,
                    "stroke-width": b.trackBorderWidth
                });
                this.trackBorderWidth = this.track.strokeWidth();
                this.track.attr({
                    y: -this.trackBorderWidth % 2 / 2
                });
                this.scrollbarGroup = a.g().add(d);
                this.scrollbar = a.rect().addClass("highcharts-scrollbar-thumb").attr({
                    height: e,
                    width: e,
                    r: b.barBorderRadius || 0
                }).add(this.scrollbarGroup);
                this.scrollbarRifles = a.path(this.swapXY(["M", -3, e / 4, "L", -3, 2 * e / 3, "M", 0, e / 4, "L",
                    0, 2 * e / 3, "M", 3, e / 4, "L", 3, 2 * e / 3
                ], b.vertical)).addClass("highcharts-scrollbar-rifles").add(this.scrollbarGroup);
                this.scrollbar.attr({
                    fill: b.barBackgroundColor,
                    stroke: b.barBorderColor,
                    "stroke-width": b.barBorderWidth
                });
                this.scrollbarRifles.attr({
                    stroke: b.rifleColor,
                    "stroke-width": 1
                });
                this.scrollbarStrokeWidth = this.scrollbar.strokeWidth();
                this.scrollbarGroup.translate(-this.scrollbarStrokeWidth % 2 / 2, -this.scrollbarStrokeWidth % 2 / 2);
                this.drawScrollbarButton(0);
                this.drawScrollbarButton(1)
            },
            position: function(a,
                b, e, d) {
                var c = this.options.vertical,
                    f = 0,
                    g = this.rendered ? "animate" : "attr";
                this.x = a;
                this.y = b + this.trackBorderWidth;
                this.width = e;
                this.xOffset = this.height = d;
                this.yOffset = f;
                c ? (this.width = this.yOffset = e = f = this.size, this.xOffset = b = 0, this.barWidth = d - 2 * e, this.x = a += this.options.margin) : (this.height = this.xOffset = d = b = this.size, this.barWidth = e - 2 * d, this.y += this.options.margin);
                this.group[g]({
                    translateX: a,
                    translateY: this.y
                });
                this.track[g]({
                    width: e,
                    height: d
                });
                this.scrollbarButtons[1].attr({
                    translateX: c ? 0 : e - b,
                    translateY: c ?
                        d - f : 0
                })
            },
            drawScrollbarButton: function(a) {
                var b = this.renderer,
                    c = this.scrollbarButtons,
                    d = this.options,
                    e = this.size,
                    f;
                f = b.g().add(this.group);
                c.push(f);
                f = b.rect().addClass("highcharts-scrollbar-button").add(f);
                f.attr({
                    stroke: d.buttonBorderColor,
                    "stroke-width": d.buttonBorderWidth,
                    fill: d.buttonBackgroundColor
                });
                f.attr(f.crisp({
                    x: -.5,
                    y: -.5,
                    width: e + 1,
                    height: e + 1,
                    r: d.buttonBorderRadius
                }, f.strokeWidth()));
                f = b.path(this.swapXY(["M", e / 2 + (a ? -1 : 1), e / 2 - 3, "L", e / 2 + (a ? -1 : 1), e / 2 + 3, "L", e / 2 + (a ? 2 : -2), e / 2], d.vertical)).addClass("highcharts-scrollbar-arrow").add(c[a]);
                f.attr({
                    fill: d.buttonArrowColor
                })
            },
            swapXY: function(a, b) {
                var c = a.length,
                    d;
                if (b)
                    for (b = 0; b < c; b += 3) d = a[b + 1], a[b + 1] = a[b + 2], a[b + 2] = d;
                return a
            },
            setRange: function(a, b) {
                var c = this.options,
                    d = c.vertical,
                    e = c.minWidth,
                    f = this.barWidth,
                    g, k, l = this.rendered && !this.hasDragged ? "animate" : "attr";
                h(f) && (a = Math.max(a, 0), g = f * a, this.calculatedWidth = k = G(f * Math.min(b, 1) - g), k < e && (g = (f - e + k) * a, k = e), e = Math.floor(g + this.xOffset + this.yOffset), f = k / 2 - .5, this.from = a, this.to = b, d ? (this.scrollbarGroup[l]({
                        translateY: e
                    }), this.scrollbar[l]({
                        height: k
                    }),
                    this.scrollbarRifles[l]({
                        translateY: f
                    }), this.scrollbarTop = e, this.scrollbarLeft = 0) : (this.scrollbarGroup[l]({
                    translateX: e
                }), this.scrollbar[l]({
                    width: k
                }), this.scrollbarRifles[l]({
                    translateX: f
                }), this.scrollbarLeft = e, this.scrollbarTop = 0), 12 >= k ? this.scrollbarRifles.hide() : this.scrollbarRifles.show(!0), !1 === c.showFull && (0 >= a && 1 <= b ? this.group.hide() : this.group.show()), this.rendered = !0)
            },
            initEvents: function() {
                var a = this;
                a.mouseMoveHandler = function(b) {
                    var c = a.chart.pointer.normalize(b),
                        d = a.options.vertical ?
                        "chartY" : "chartX",
                        e = a.initPositions;
                    !a.grabbedCenter || b.touches && 0 === b.touches[0][d] || (c = a.cursorToScrollbarPosition(c)[d], d = a[d], d = c - d, a.hasDragged = !0, a.updatePosition(e[0] + d, e[1] + d), a.hasDragged && l(a, "changed", {
                        from: a.from,
                        to: a.to,
                        trigger: "scrollbar",
                        DOMType: b.type,
                        DOMEvent: b
                    }))
                };
                a.mouseUpHandler = function(b) {
                    a.hasDragged && l(a, "changed", {
                        from: a.from,
                        to: a.to,
                        trigger: "scrollbar",
                        DOMType: b.type,
                        DOMEvent: b
                    });
                    a.grabbedCenter = a.hasDragged = a.chartX = a.chartY = null
                };
                a.mouseDownHandler = function(b) {
                    b = a.chart.pointer.normalize(b);
                    b = a.cursorToScrollbarPosition(b);
                    a.chartX = b.chartX;
                    a.chartY = b.chartY;
                    a.initPositions = [a.from, a.to];
                    a.grabbedCenter = !0
                };
                a.buttonToMinClick = function(b) {
                    var c = G(a.to - a.from) * a.options.step;
                    a.updatePosition(G(a.from - c), G(a.to - c));
                    l(a, "changed", {
                        from: a.from,
                        to: a.to,
                        trigger: "scrollbar",
                        DOMEvent: b
                    })
                };
                a.buttonToMaxClick = function(b) {
                    var c = (a.to - a.from) * a.options.step;
                    a.updatePosition(a.from + c, a.to + c);
                    l(a, "changed", {
                        from: a.from,
                        to: a.to,
                        trigger: "scrollbar",
                        DOMEvent: b
                    })
                };
                a.trackClick = function(b) {
                    var c = a.chart.pointer.normalize(b),
                        d = a.to - a.from,
                        e = a.y + a.scrollbarTop,
                        f = a.x + a.scrollbarLeft;
                    a.options.vertical && c.chartY > e || !a.options.vertical && c.chartX > f ? a.updatePosition(a.from + d, a.to + d) : a.updatePosition(a.from - d, a.to - d);
                    l(a, "changed", {
                        from: a.from,
                        to: a.to,
                        trigger: "scrollbar",
                        DOMEvent: b
                    })
                }
            },
            cursorToScrollbarPosition: function(a) {
                var b = this.options,
                    b = b.minWidth > this.calculatedWidth ? b.minWidth : 0;
                return {
                    chartX: (a.chartX - this.x - this.xOffset) / (this.barWidth - b),
                    chartY: (a.chartY - this.y - this.yOffset) / (this.barWidth - b)
                }
            },
            updatePosition: function(a,
                b) {
                1 < b && (a = G(1 - G(b - a)), b = 1);
                0 > a && (b = G(b - a), a = 0);
                this.from = a;
                this.to = b
            },
            update: function(a) {
                this.destroy();
                this.init(this.chart.renderer, k(!0, this.options, a), this.chart)
            },
            addEvents: function() {
                var a = this.options.inverted ? [1, 0] : [0, 1],
                    b = this.scrollbarButtons,
                    e = this.scrollbarGroup.element,
                    d = this.mouseDownHandler,
                    g = this.mouseMoveHandler,
                    h = this.mouseUpHandler,
                    a = [
                        [b[a[0]].element, "click", this.buttonToMinClick],
                        [b[a[1]].element, "click", this.buttonToMaxClick],
                        [this.track.element, "click", this.trackClick],
                        [e,
                            "mousedown", d
                        ],
                        [t, "mousemove", g],
                        [t, "mouseup", h]
                    ];
                f && a.push([e, "touchstart", d], [t, "touchmove", g], [t, "touchend", h]);
                q(a, function(a) {
                    B.apply(null, a)
                });
                this._events = a
            },
            removeEvents: function() {
                q(this._events, function(a) {
                    p.apply(null, a)
                });
                this._events = void 0
            },
            destroy: function() {
                var a = this.chart.scroller;
                this.removeEvents();
                q(["track", "scrollbarRifles", "scrollbar", "scrollbarGroup", "group"], function(a) {
                    this[a] && this[a].destroy && (this[a] = this[a].destroy())
                }, this);
                a && (a.scrollbar = null, m(a.scrollbarButtons))
            }
        };
        g(F.prototype, "init", function(a) {
            var b = this;
            a.apply(b, [].slice.call(arguments, 1));
            b.options.scrollbar && b.options.scrollbar.enabled && (b.options.scrollbar.vertical = !b.horiz, b.options.startOnTick = b.options.endOnTick = !1, b.scrollbar = new D(b.chart.renderer, b.options.scrollbar, b.chart), B(b.scrollbar, "changed", function(a) {
                var c = Math.min(z(b.options.min, b.min), b.min, b.dataMin),
                    e = Math.max(z(b.options.max, b.max), b.max, b.dataMax) - c,
                    f;
                b.horiz && !b.reversed || !b.horiz && b.reversed ? (f = c + e * this.to, c += e * this.from) : (f =
                    c + e * (1 - this.from), c += e * (1 - this.to));
                b.setExtremes(c, f, !0, !1, a)
            }))
        });
        g(F.prototype, "render", function(a) {
            var b = Math.min(z(this.options.min, this.min), this.min, this.dataMin),
                c = Math.max(z(this.options.max, this.max), this.max, this.dataMax),
                d = this.scrollbar,
                e;
            a.apply(this, [].slice.call(arguments, 1));
            d && (this.horiz ? d.position(this.left, this.top + this.height + this.offset + 2 + (this.opposite ? 0 : this.axisTitleMargin), this.width, this.height) : d.position(this.left + this.width + 2 + this.offset + (this.opposite ? this.axisTitleMargin :
                0), this.top, this.width, this.height), isNaN(b) || isNaN(c) || !h(this.min) || !h(this.max) ? d.setRange(0, 0) : (e = (this.min - b) / (c - b), b = (this.max - b) / (c - b), this.horiz && !this.reversed || !this.horiz && this.reversed ? d.setRange(e, b) : d.setRange(1 - b, 1 - e)))
        });
        g(F.prototype, "getOffset", function(a) {
            var b = this.horiz ? 2 : 1,
                c = this.scrollbar;
            a.apply(this, [].slice.call(arguments, 1));
            c && (this.chart.axisOffset[b] += c.size + c.options.margin)
        });
        g(F.prototype, "destroy", function(a) {
            this.scrollbar && (this.scrollbar = this.scrollbar.destroy());
            a.apply(this, [].slice.call(arguments, 1))
        });
        a.Scrollbar = D
    })(N);
    (function(a) {
        function D(a) {
            this.init(a)
        }
        var B = a.addEvent,
            F = a.Axis,
            G = a.Chart,
            r = a.color,
            h = a.defaultOptions,
            m = a.defined,
            t = a.destroyObjectProperties,
            q = a.doc,
            l = a.each,
            f = a.erase,
            b = a.error,
            k = a.extend,
            z = a.grep,
            p = a.hasTouch,
            g = a.isNumber,
            e = a.isObject,
            c = a.isTouchDevice,
            n = a.merge,
            u = a.pick,
            d = a.removeEvent,
            C = a.Scrollbar,
            y = a.Series,
            v = a.seriesTypes,
            E = a.wrap,
            I = [].concat(a.defaultDataGroupingUnits),
            H = function(a) {
                var b = z(arguments, g);
                if (b.length) return Math[a].apply(0,
                    b)
            };
        I[4] = ["day", [1, 2, 3, 4]];
        I[5] = ["week", [1, 2, 3]];
        v = void 0 === v.areaspline ? "line" : "areaspline";
        k(h, {
            navigator: {
                height: 40,
                margin: 25,
                maskInside: !0,
                handles: {
                    backgroundColor: "#f2f2f2",
                    borderColor: "#999999"
                },
                maskFill: r("#6685c2").setOpacity(.3).get(),
                outlineColor: "#cccccc",
                outlineWidth: 1,
                series: {
                    type: v,
                    color: "#335cad",
                    fillOpacity: .05,
                    lineWidth: 1,
                    compare: null,
                    dataGrouping: {
                        approximation: "average",
                        enabled: !0,
                        groupPixelWidth: 2,
                        smoothed: !0,
                        units: I
                    },
                    dataLabels: {
                        enabled: !1,
                        zIndex: 2
                    },
                    id: "highcharts-navigator-series",
                    className: "highcharts-navigator-series",
                    lineColor: null,
                    marker: {
                        enabled: !1
                    },
                    pointRange: 0,
                    shadow: !1,
                    threshold: null
                },
                xAxis: {
                    className: "highcharts-navigator-xaxis",
                    tickLength: 0,
                    lineWidth: 0,
                    gridLineColor: "#e6e6e6",
                    gridLineWidth: 1,
                    tickPixelInterval: 200,
                    labels: {
                        align: "left",
                        style: {
                            color: "#999999"
                        },
                        x: 3,
                        y: -4
                    },
                    crosshair: !1
                },
                yAxis: {
                    className: "highcharts-navigator-yaxis",
                    gridLineWidth: 0,
                    startOnTick: !1,
                    endOnTick: !1,
                    minPadding: .1,
                    maxPadding: .1,
                    labels: {
                        enabled: !1
                    },
                    crosshair: !1,
                    title: {
                        text: null
                    },
                    tickLength: 0,
                    tickWidth: 0
                }
            }
        });
        D.prototype = {
            drawHandle: function(a, b) {
                var c = this.chart.renderer,
                    d = this.handles;
                this.rendered || (d[b] = c.path(["M", -4.5, .5, "L", 3.5, .5, 3.5, 15.5, -4.5, 15.5, -4.5, .5, "M", -1.5, 4, "L", -1.5, 12, "M", .5, 4, "L", .5, 12]).attr({
                    zIndex: 10 - b
                }).addClass("highcharts-navigator-handle highcharts-navigator-handle-" + ["left", "right"][b]).add(), c = this.navigatorOptions.handles, d[b].attr({
                    fill: c.backgroundColor,
                    stroke: c.borderColor,
                    "stroke-width": 1
                }).css({
                    cursor: "ew-resize"
                }));
                d[b][this.rendered && !this.hasDragged ? "animate" : "attr"]({
                    translateX: Math.round(this.scrollerLeft +
                        this.scrollbarHeight + parseInt(a, 10)),
                    translateY: Math.round(this.top + this.height / 2 - 8)
                })
            },
            update: function(a) {
                this.destroy();
                n(!0, this.chart.options.navigator, this.options, a);
                this.init(this.chart)
            },
            render: function(a, b, c, d) {
                var e = this.chart,
                    f = e.renderer,
                    h, k, l, n;
                n = this.scrollbarHeight;
                var q = this.xAxis,
                    p = this.navigatorOptions,
                    w = p.maskInside,
                    r = this.height,
                    x = this.top,
                    v = this.navigatorEnabled,
                    y = this.outlineHeight,
                    t;
                t = this.rendered;
                if (g(a) && g(b) && (!this.hasDragged || m(c)) && (this.navigatorLeft = h = u(q.left, e.plotLeft +
                        n), this.navigatorWidth = k = u(q.len, e.plotWidth - 2 * n), this.scrollerLeft = l = h - n, this.scrollerWidth = n = n = k + 2 * n, c = u(c, q.translate(a)), d = u(d, q.translate(b)), g(c) && Infinity !== Math.abs(c) || (c = 0, d = n), !(q.translate(d, !0) - q.translate(c, !0) < e.xAxis[0].minRange))) {
                    this.zoomedMax = Math.min(Math.max(c, d, 0), k);
                    this.zoomedMin = Math.min(Math.max(this.fixedWidth ? this.zoomedMax - this.fixedWidth : Math.min(c, d), 0), k);
                    this.range = this.zoomedMax - this.zoomedMin;
                    b = Math.round(this.zoomedMax);
                    a = Math.round(this.zoomedMin);
                    !t && v && (this.navigatorGroup =
                        c = f.g("navigator").attr({
                            zIndex: 3
                        }).add(), this.leftShade = f.rect().addClass("highcharts-navigator-mask" + (w ? "-inside" : "")).attr({
                            fill: p.maskFill
                        }).css(w && {
                            cursor: "ew-resize"
                        }).add(c), w || (this.rightShade = f.rect().addClass("highcharts-navigator-mask").attr({
                            fill: p.maskFill
                        }).add(c)), this.outline = f.path().addClass("highcharts-navigator-outline").attr({
                            "stroke-width": p.outlineWidth,
                            stroke: p.outlineColor
                        }).add(c));
                    if (v) {
                        f = t && !this.hasDragged ? "animate" : "attr";
                        w = this.outline.strokeWidth();
                        w /= 2;
                        t = x + w;
                        this.leftShade[f](p.maskInside ? {
                            x: h + a,
                            y: x,
                            width: b - a,
                            height: r
                        } : {
                            x: h,
                            y: x,
                            width: a,
                            height: r
                        });
                        if (this.rightShade) this.rightShade[f]({
                            x: h + b,
                            y: x,
                            width: k - b,
                            height: r
                        });
                        this.outline[f]({
                            d: ["M", l, t, "L", h + a - w, t, h + a - w, t + y, "L", h + b - w, t + y, "L", h + b - w, t, l + n, t].concat(p.maskInside ? ["M", h + a + w, t, "L", h + b - w, t] : [])
                        });
                        this.drawHandle(a + w, 0);
                        this.drawHandle(b + w, 1)
                    }
                    this.scrollbar && (this.scrollbar.hasDragged = this.hasDragged, this.scrollbar.position(this.scrollerLeft, this.top + (v ? this.height : -this.scrollbarHeight), this.scrollerWidth, this.scrollbarHeight), this.scrollbar.setRange(a /
                        k, b / k));
                    this.rendered = !0
                }
            },
            addEvents: function() {
                var a = this.chart,
                    b = a.container,
                    c = this.mouseDownHandler,
                    d = this.mouseMoveHandler,
                    e = this.mouseUpHandler,
                    f;
                f = [
                    [b, "mousedown", c],
                    [b, "mousemove", d],
                    [q, "mouseup", e]
                ];
                p && f.push([b, "touchstart", c], [b, "touchmove", d], [q, "touchend", e]);
                l(f, function(a) {
                    B.apply(null, a)
                });
                this._events = f;
                this.series && this.series[0] && B(this.series[0].xAxis, "foundExtremes", function() {
                    a.scroller.modifyNavigatorAxisExtremes()
                });
                B(a, "redraw", function() {
                    var a = this.scroller,
                        b = a && (a.baseSeries &&
                            a.baseSeries[0] && a.baseSeries[0].xAxis || a.scrollbar && this.xAxis[0]);
                    b && a.render(b.min, b.max)
                })
            },
            removeEvents: function() {
                this._events && (l(this._events, function(a) {
                    d.apply(null, a)
                }), this._events = void 0);
                this.removeBaseSeriesEvents()
            },
            removeBaseSeriesEvents: function() {
                var a = this.baseSeries || [];
                this.navigatorEnabled && a[0] && !1 !== this.navigatorOptions.adaptToUpdatedData && (l(a, function(a) {
                    d(a, "updatedData", this.updatedDataHandler)
                }, this), a[0].xAxis && d(a[0].xAxis, "foundExtremes", this.modifyBaseAxisExtremes))
            },
            init: function(a) {
                var b = a.options,
                    d = b.navigator,
                    e = d.enabled,
                    b = b.scrollbar,
                    f = b.enabled,
                    g = e ? d.height : 0,
                    h = f ? b.height : 0;
                this.handles = [];
                this.scrollbarButtons = [];
                this.elementsToDestroy = [];
                this.chart = a;
                this.setBaseSeries();
                this.height = g;
                this.scrollbarHeight = h;
                this.scrollbarEnabled = f;
                this.navigatorEnabled = e;
                this.navigatorOptions = d;
                this.scrollbarOptions = b;
                this.outlineHeight = g + h;
                var k = this,
                    l, q, e = k.baseSeries;
                k.mouseDownHandler = function(b) {
                    b = a.pointer.normalize(b);
                    var d = k.zoomedMin,
                        e = k.zoomedMax,
                        f = k.top,
                        h = k.scrollerLeft,
                        m = k.scrollerWidth,
                        n = k.navigatorLeft,
                        p = k.navigatorWidth,
                        w = k.scrollbarPad || 0,
                        r = k.range,
                        x = b.chartX,
                        v = b.chartY;
                    b = a.xAxis[0];
                    var y, t = c ? 10 : 7;
                    v > f && v < f + g && (Math.abs(x - d - n) < t ? (k.grabbedLeft = !0, k.otherHandlePos = e, k.fixedExtreme = b.max, a.fixedRange = null) : Math.abs(x - e - n) < t ? (k.grabbedRight = !0, k.otherHandlePos = d, k.fixedExtreme = b.min, a.fixedRange = null) : x > n + d - w && x < n + e + w ? (k.grabbedCenter = x, k.fixedWidth = r, q = x - d) : x > h && x < h + m && (e = x - n - r / 2, 0 > e ? e = 0 : e + r >= p && (e = p - r, y = k.getUnionExtremes().dataMax), e !== d && (k.fixedWidth = r, d = l.toFixedRange(e,
                        e + r, null, y), b.setExtremes(d.min, d.max, !0, null, {
                        trigger: "navigator"
                    }))))
                };
                k.mouseMoveHandler = function(b) {
                    var c = k.scrollbarHeight,
                        d = k.navigatorLeft,
                        e = k.navigatorWidth,
                        f = k.scrollerLeft,
                        g = k.scrollerWidth,
                        h = k.range,
                        l;
                    b.touches && 0 === b.touches[0].pageX || (b = a.pointer.normalize(b), l = b.chartX, l < d ? l = d : l > f + g - c && (l = f + g - c), k.grabbedLeft ? (k.hasDragged = !0, k.render(0, 0, l - d, k.otherHandlePos)) : k.grabbedRight ? (k.hasDragged = !0, k.render(0, 0, k.otherHandlePos, l - d)) : k.grabbedCenter && (k.hasDragged = !0, l < q ? l = q : l > e + q - h && (l = e +
                        q - h), k.render(0, 0, l - q, l - q + h)), k.hasDragged && k.scrollbar && k.scrollbar.options.liveRedraw && (b.DOMType = b.type, setTimeout(function() {
                        k.mouseUpHandler(b)
                    }, 0)))
                };
                k.mouseUpHandler = function(b) {
                    var c, d, e = b.DOMEvent || b;
                    if (k.hasDragged || "scrollbar" === b.trigger) k.zoomedMin === k.otherHandlePos ? c = k.fixedExtreme : k.zoomedMax === k.otherHandlePos && (d = k.fixedExtreme), k.zoomedMax === k.navigatorWidth && (d = k.getUnionExtremes().dataMax), c = l.toFixedRange(k.zoomedMin, k.zoomedMax, c, d), m(c.min) && a.xAxis[0].setExtremes(c.min, c.max, !0, k.hasDragged ? !1 : null, {
                        trigger: "navigator",
                        triggerOp: "navigator-drag",
                        DOMEvent: e
                    });
                    "mousemove" !== b.DOMType && (k.grabbedLeft = k.grabbedRight = k.grabbedCenter = k.fixedWidth = k.fixedExtreme = k.otherHandlePos = k.hasDragged = q = null)
                };
                var b = a.xAxis.length,
                    f = a.yAxis.length,
                    p = e && e[0] && e[0].xAxis || a.xAxis[0];
                a.extraBottomMargin = k.outlineHeight + d.margin;
                a.isDirtyBox = !0;
                k.navigatorEnabled ? (k.xAxis = l = new F(a, n({
                    breaks: p.options.breaks,
                    ordinal: p.options.ordinal
                }, d.xAxis, {
                    id: "navigator-x-axis",
                    yAxis: "navigator-y-axis",
                    isX: !0,
                    type: "datetime",
                    index: b,
                    height: g,
                    offset: 0,
                    offsetLeft: h,
                    offsetRight: -h,
                    keepOrdinalPadding: !0,
                    startOnTick: !1,
                    endOnTick: !1,
                    minPadding: 0,
                    maxPadding: 0,
                    zoomEnabled: !1
                })), k.yAxis = new F(a, n(d.yAxis, {
                    id: "navigator-y-axis",
                    alignTicks: !1,
                    height: g,
                    offset: 0,
                    index: f,
                    zoomEnabled: !1
                })), e || d.series.data ? k.addBaseSeries() : 0 === a.series.length && E(a, "redraw", function(b, c) {
                    0 < a.series.length && !k.series && (k.setBaseSeries(), a.redraw = b);
                    b.call(a, c)
                })) : k.xAxis = l = {
                    translate: function(b, c) {
                        var d = a.xAxis[0],
                            e = d.getExtremes(),
                            f = a.plotWidth - 2 * h,
                            g = H("min", d.options.min, e.dataMin),
                            d = H("max", d.options.max, e.dataMax) - g;
                        return c ? b * d / f + g : f * (b - g) / d
                    },
                    toFixedRange: F.prototype.toFixedRange,
                    fake: !0
                };
                a.options.scrollbar.enabled && (a.scrollbar = k.scrollbar = new C(a.renderer, n(a.options.scrollbar, {
                    margin: k.navigatorEnabled ? 0 : 10
                }), a), B(k.scrollbar, "changed", function(b) {
                    var c = k.navigatorWidth,
                        d = c * this.to,
                        c = c * this.from;
                    k.hasDragged = k.scrollbar.hasDragged;
                    k.render(0, 0, c, d);
                    (a.options.scrollbar.liveRedraw || "mousemove" !== b.DOMType) && setTimeout(function() {
                        k.mouseUpHandler(b)
                    })
                }));
                k.addBaseSeriesEvents();
                k.addEvents()
            },
            getUnionExtremes: function(a) {
                var b = this.chart.xAxis[0],
                    c = this.xAxis,
                    d = c.options,
                    e = b.options,
                    f;
                a && null === b.dataMin || (f = {
                    dataMin: u(d && d.min, H("min", e.min, b.dataMin, c.dataMin, c.min)),
                    dataMax: u(d && d.max, H("max", e.max, b.dataMax, c.dataMax, c.max))
                });
                return f
            },
            setBaseSeries: function(a) {
                var b = this.chart,
                    c = this.baseSeries = [];
                a = a || b.options && b.options.navigator.baseSeries || 0;
                this.series && (this.removeBaseSeriesEvents(), l(this.series, function(a) {
                    a.destroy()
                }));
                l(b.series || [], function(b, d) {
                    (b.options.showInNavigator || (d === a || b.options.id === a) && !1 !== b.options.showInNavigator) && c.push(b)
                });
                this.xAxis && !this.xAxis.fake && this.addBaseSeries()
            },
            addBaseSeries: function() {
                var a = this,
                    b = a.chart,
                    c = a.series = [],
                    d = a.baseSeries,
                    e, f, g = a.navigatorOptions.series,
                    h, k = {
                        enableMouseTracking: !1,
                        group: "nav",
                        padXAxis: !1,
                        xAxis: "navigator-x-axis",
                        yAxis: "navigator-y-axis",
                        showInLegend: !1,
                        stacking: !1,
                        isInternal: !0,
                        visible: !0
                    };
                d ? l(d, function(d, l) {
                    k.name = "Navigator " + (l + 1);
                    e = d.options || {};
                    h = e.navigatorOptions || {};
                    f = n(e, k, g, h);
                    l = h.data || g.data;
                    a.hasNavigatorData = a.hasNavigatorData || !!l;
                    f.data = l || e.data && e.data.slice(0);
                    d.navigatorSeries = b.initSeries(f);
                    c.push(d.navigatorSeries)
                }) : (f = n(g, k), f.data = g.data, a.hasNavigatorData = !!f.data, c.push(b.initSeries(f)));
                this.addBaseSeriesEvents()
            },
            addBaseSeriesEvents: function() {
                var a = this,
                    b = a.baseSeries || [];
                b[0] && b[0].xAxis && B(b[0].xAxis, "foundExtremes", this.modifyBaseAxisExtremes);
                !1 !== this.navigatorOptions.adaptToUpdatedData && l(b, function(b) {
                    b.xAxis && (B(b, "updatedData",
                        this.updatedDataHandler), b.userOptions.events = k(b.userOptions.event, {
                        updatedData: this.updatedDataHandler
                    }));
                    B(b, "remove", function() {
                        this.navigatorSeries && (f(a.series, this.navigatorSeries), this.navigatorSeries.remove(), delete this.navigatorSeries)
                    })
                }, this)
            },
            modifyNavigatorAxisExtremes: function() {
                var a = this.xAxis,
                    b;
                a.getExtremes && (!(b = this.getUnionExtremes(!0)) || b.dataMin === a.min && b.dataMax === a.max || (a.min = b.dataMin, a.max = b.dataMax))
            },
            modifyBaseAxisExtremes: function() {
                var a = this.chart.scroller,
                    b = this.getExtremes(),
                    c = b.dataMin,
                    d = b.dataMax,
                    b = b.max - b.min,
                    e = a.stickToMin,
                    f = a.stickToMax,
                    h, k, l = a.series && a.series[0],
                    m = !!this.setExtremes;
                this.eventArgs && "rangeSelectorButton" === this.eventArgs.trigger || (e && (k = c, h = k + b), f && (h = d, e || (k = Math.max(h - b, l && l.xData ? l.xData[0] : -Number.MAX_VALUE))), m && (e || f) && g(k) && (this.min = this.userMin = k, this.max = this.userMax = h));
                a.stickToMin = a.stickToMax = null
            },
            updatedDataHandler: function() {
                var a = this.chart.scroller,
                    b = this.navigatorSeries;
                a.stickToMin = g(this.xAxis.min) && this.xAxis.min <= this.xData[0];
                a.stickToMax = Math.round(a.zoomedMax) >= Math.round(a.navigatorWidth);
                b && !a.hasNavigatorData && (b.options.pointStart = this.xData[0], b.setData(this.options.data, !1, null, !1))
            },
            destroy: function() {
                this.removeEvents();
                this.xAxis && (f(this.chart.xAxis, this.xAxis), f(this.chart.axes, this.xAxis));
                this.yAxis && (f(this.chart.yAxis, this.yAxis), f(this.chart.axes, this.yAxis));
                l(this.series || [], function(a) {
                    a.destroy && a.destroy()
                });
                l("series xAxis yAxis leftShade rightShade outline scrollbarTrack scrollbarRifles scrollbarGroup scrollbar navigatorGroup rendered".split(" "),
                    function(a) {
                        this[a] && this[a].destroy && this[a].destroy();
                        this[a] = null
                    }, this);
                l([this.handles, this.elementsToDestroy], function(a) {
                    t(a)
                }, this)
            }
        };
        a.Navigator = D;
        E(F.prototype, "zoom", function(a, b, c) {
            var d = this.chart,
                e = d.options,
                f = e.chart.zoomType,
                g = e.navigator,
                e = e.rangeSelector,
                h;
            this.isXAxis && (g && g.enabled || e && e.enabled) && ("x" === f ? d.resetZoomButton = "blocked" : "y" === f ? h = !1 : "xy" === f && (d = this.previousZoom, m(b) ? this.previousZoom = [this.min, this.max] : d && (b = d[0], c = d[1], delete this.previousZoom)));
            return void 0 !==
                h ? h : a.call(this, b, c)
        });
        E(G.prototype, "init", function(a, b, c) {
            B(this, "beforeRender", function() {
                var a = this.options;
                if (a.navigator.enabled || a.scrollbar.enabled) this.scroller = this.navigator = new D(this)
            });
            a.call(this, b, c)
        });
        E(G.prototype, "getMargins", function(a) {
            var b = this.legend,
                c = b.options,
                d = this.scroller,
                e, f;
            a.apply(this, [].slice.call(arguments, 1));
            d && (e = d.xAxis, f = d.yAxis, d.top = d.navigatorOptions.top || this.chartHeight - d.height - d.scrollbarHeight - this.spacing[2] - ("bottom" === c.verticalAlign && c.enabled &&
                !c.floating ? b.legendHeight + u(c.margin, 10) : 0), e && f && (e.options.top = f.options.top = d.top, e.setAxisSize(), f.setAxisSize()))
        });
        E(y.prototype, "addPoint", function(a, c, d, f, g) {
            var h = this.options.turboThreshold;
            h && this.xData.length > h && e(c, !0) && this.chart.scroller && b(20, !0);
            a.call(this, c, d, f, g)
        });
        E(G.prototype, "addSeries", function(a, b, c, d) {
            a = a.call(this, b, !1, d);
            this.scroller && this.scroller.setBaseSeries();
            u(c, !0) && this.redraw();
            return a
        });
        E(y.prototype, "update", function(a, b, c) {
            a.call(this, b, !1);
            this.chart.scroller &&
                this.chart.scroller.setBaseSeries();
            u(c, !0) && this.chart.redraw()
        })
    })(N);
    (function(a) {
        function D(a) {
            this.init(a)
        }
        var B = a.addEvent,
            F = a.Axis,
            G = a.Chart,
            r = a.css,
            h = a.createElement,
            m = a.dateFormat,
            t = a.defaultOptions,
            q = t.global.useUTC,
            l = a.defined,
            f = a.destroyObjectProperties,
            b = a.discardElement,
            k = a.each,
            z = a.extend,
            p = a.fireEvent,
            g = a.Date,
            e = a.isNumber,
            c = a.merge,
            n = a.pick,
            u = a.pInt,
            d = a.splat,
            C = a.wrap;
        z(t, {
            rangeSelector: {
                buttonTheme: {
                    "stroke-width": 0,
                    width: 28,
                    height: 18,
                    padding: 2,
                    zIndex: 7
                },
                height: 35,
                inputPosition: {
                    align: "right"
                },
                labelStyle: {
                    color: "#666666"
                }
            }
        });
        t.lang = c(t.lang, {
            rangeSelectorZoom: "Zoom",
            rangeSelectorFrom: "From",
            rangeSelectorTo: "To"
        });
        D.prototype = {
            clickButton: function(a, b) {
                var c = this,
                    f = c.chart,
                    g = c.buttonOptions[a],
                    h = f.xAxis[0],
                    l = f.scroller && f.scroller.getUnionExtremes() || h || {},
                    m = l.dataMin,
                    p = l.dataMax,
                    r, v = h && Math.round(Math.min(h.max, n(p, h.max))),
                    t = g.type,
                    y, l = g._range,
                    u, z, C, D = g.dataGrouping;
                if (null !== m && null !== p) {
                    f.fixedRange = l;
                    D && (this.forcedDataGrouping = !0, F.prototype.setDataGrouping.call(h || {
                            chart: this.chart
                        },
                        D, !1));
                    if ("month" === t || "year" === t) h ? (t = {
                        range: g,
                        max: v,
                        dataMin: m,
                        dataMax: p
                    }, r = h.minFromRange.call(t), e(t.newMax) && (v = t.newMax)) : l = g;
                    else if (l) r = Math.max(v - l, m), v = Math.min(r + l, p);
                    else if ("ytd" === t)
                        if (h) void 0 === p && (m = Number.MAX_VALUE, p = Number.MIN_VALUE, k(f.series, function(a) {
                            a = a.xData;
                            m = Math.min(a[0], m);
                            p = Math.max(a[a.length - 1], p)
                        }), b = !1), v = c.getYTDExtremes(p, m, q), r = u = v.min, v = v.max;
                        else {
                            B(f, "beforeRender", function() {
                                c.clickButton(a)
                            });
                            return
                        }
                    else "all" === t && h && (r = m, v = p);
                    c.setSelected(a);
                    h ? h.setExtremes(r,
                        v, n(b, 1), null, {
                            trigger: "rangeSelectorButton",
                            rangeSelectorButton: g
                        }) : (y = d(f.options.xAxis)[0], C = y.range, y.range = l, z = y.min, y.min = u, B(f, "load", function() {
                        y.range = C;
                        y.min = z
                    }))
                }
            },
            setSelected: function(a) {
                this.selected = this.options.selected = a
            },
            defaultButtons: [{
                type: "month",
                count: 1,
                text: "1m"
            }, {
                type: "month",
                count: 3,
                text: "3m"
            }, {
                type: "month",
                count: 6,
                text: "6m"
            }, {
                type: "ytd",
                text: "YTD"
            }, {
                type: "year",
                count: 1,
                text: "1y"
            }, {
                type: "all",
                text: "All"
            }],
            init: function(a) {
                var b = this,
                    c = a.options.rangeSelector,
                    d = c.buttons || [].concat(b.defaultButtons),
                    e = c.selected,
                    f = function() {
                        var a = b.minInput,
                            c = b.maxInput;
                        a && a.blur && p(a, "blur");
                        c && c.blur && p(c, "blur")
                    };
                b.chart = a;
                b.options = c;
                b.buttons = [];
                a.extraTopMargin = c.height;
                b.buttonOptions = d;
                this.unMouseDown = B(a.container, "mousedown", f);
                this.unResize = B(a, "resize", f);
                k(d, b.computeButtonRange);
                void 0 !== e && d[e] && this.clickButton(e, !1);
                B(a, "load", function() {
                    B(a.xAxis[0], "setExtremes", function(c) {
                        this.max - this.min !== a.fixedRange && "rangeSelectorButton" !== c.trigger && "updatedData" !== c.trigger &&
                            b.forcedDataGrouping && this.setDataGrouping(!1, !1)
                    })
                })
            },
            updateButtonStates: function() {
                var a = this.chart,
                    b = a.xAxis[0],
                    c = Math.round(b.max - b.min),
                    d = !b.hasVisibleSeries,
                    a = a.scroller && a.scroller.getUnionExtremes() || b,
                    f = a.dataMin,
                    g = a.dataMax,
                    a = this.getYTDExtremes(g, f, q),
                    h = a.min,
                    l = a.max,
                    m = this.selected,
                    n = e(m),
                    p = this.options.allButtonsEnabled,
                    r = this.buttons;
                k(this.buttonOptions, function(a, e) {
                    var k = a._range,
                        q = a.type,
                        w = a.count || 1;
                    a = r[e];
                    var t = 0;
                    e = e === m;
                    var v = k > g - f,
                        x = k < b.minRange,
                        y = !1,
                        u = !1,
                        k = k === c;
                    ("month" ===
                        q || "year" === q) && c >= 864E5 * {
                        month: 28,
                        year: 365
                    }[q] * w && c <= 864E5 * {
                        month: 31,
                        year: 366
                    }[q] * w ? k = !0 : "ytd" === q ? (k = l - h === c, y = !e) : "all" === q && (k = b.max - b.min >= g - f, u = !e && n && k);
                    q = !p && (v || x || u || d);
                    k = e && k || k && !n && !y;
                    q ? t = 3 : k && (n = !0, t = 2);
                    a.state !== t && a.setState(t)
                })
            },
            computeButtonRange: function(a) {
                var b = a.type,
                    c = a.count || 1,
                    d = {
                        millisecond: 1,
                        second: 1E3,
                        minute: 6E4,
                        hour: 36E5,
                        day: 864E5,
                        week: 6048E5
                    };
                if (d[b]) a._range = d[b] * c;
                else if ("month" === b || "year" === b) a._range = 864E5 * {
                    month: 30,
                    year: 365
                }[b] * c
            },
            setInputValue: function(a, b) {
                var c =
                    this.chart.options.rangeSelector,
                    d = this[a + "Input"];
                l(b) && (d.previousValue = d.HCTime, d.HCTime = b);
                d.value = m(c.inputEditDateFormat || "%Y-%m-%d", d.HCTime);
                this[a + "DateBox"].attr({
                    text: m(c.inputDateFormat || "%b %e, %Y", d.HCTime)
                })
            },
            showInput: function(a) {
                var b = this.inputGroup,
                    c = this[a + "DateBox"];
                r(this[a + "Input"], {
                    left: b.translateX + c.x + "px",
                    top: b.translateY + "px",
                    width: c.width - 2 + "px",
                    height: c.height - 2 + "px",
                    border: "2px solid silver"
                })
            },
            hideInput: function(a) {
                r(this[a + "Input"], {
                    border: 0,
                    width: "1px",
                    height: "1px"
                });
                this.setInputValue(a)
            },
            drawInput: function(a) {
                function b() {
                    var a = p.value,
                        b = (l.inputDateParser || Date.parse)(a),
                        c = f.xAxis[0],
                        g = f.scroller && f.scroller.xAxis ? f.scroller.xAxis : c,
                        h = g.dataMin,
                        g = g.dataMax;
                    b !== p.previousValue && (p.previousValue = b, e(b) || (b = a.split("-"), b = Date.UTC(u(b[0]), u(b[1]) - 1, u(b[2]))), e(b) && (q || (b += 6E4 * (new Date).getTimezoneOffset()), n ? b > d.maxInput.HCTime ? b = void 0 : b < h && (b = h) : b < d.minInput.HCTime ? b = void 0 : b > g && (b = g), void 0 !== b && c.setExtremes(n ? b : c.min, n ? c.max : b, void 0, void 0, {
                        trigger: "rangeSelectorInput"
                    })))
                }
                var d = this,
                    f = d.chart,
                    g = f.renderer.style || {},
                    k = f.renderer,
                    l = f.options.rangeSelector,
                    m = d.div,
                    n = "min" === a,
                    p, y, B = this.inputGroup;
                this[a + "Label"] = y = k.label(t.lang[n ? "rangeSelectorFrom" : "rangeSelectorTo"], this.inputGroup.offset).addClass("highcharts-range-label").attr({
                    padding: 2
                }).add(B);
                B.offset += y.width + 5;
                this[a + "DateBox"] = k = k.label("", B.offset).addClass("highcharts-range-input").attr({
                    padding: 2,
                    width: l.inputBoxWidth || 90,
                    height: l.inputBoxHeight || 17,
                    stroke: l.inputBoxBorderColor || "#cccccc",
                    "stroke-width": 1,
                    "text-align": "center"
                }).on("click", function() {
                    d.showInput(a);
                    d[a + "Input"].focus()
                }).add(B);
                B.offset += k.width + (n ? 10 : 0);
                this[a + "Input"] = p = h("input", {
                    name: a,
                    className: "highcharts-range-selector",
                    type: "text"
                }, {
                    top: f.plotTop + "px"
                }, m);
                y.css(c(g, l.labelStyle));
                k.css(c({
                    color: "#ffffff"
                }, g, l.inputStyle));
                r(p, z({
                    position: "absolute",
                    border: 0,
                    width: "1px",
                    height: "1px",
                    padding: 0,
                    textAlign: "center",
                    fontSize: g.fontSize,
                    fontFamily: g.fontFamily,
                    left: "-9em"
                }, l.inputStyle));
                p.onfocus = function() {
                    d.showInput(a)
                };
                p.onblur =
                    function() {
                        d.hideInput(a)
                    };
                p.onchange = b;
                p.onkeypress = function(a) {
                    13 === a.keyCode && b()
                }
            },
            getPosition: function() {
                var a = this.chart,
                    b = a.options.rangeSelector,
                    a = n((b.buttonPosition || {}).y, a.plotTop - a.axisOffset[0] - b.height);
                return {
                    buttonTop: a,
                    inputTop: a - 10
                }
            },
            getYTDExtremes: function(a, b, c) {
                var d = new g(a),
                    e = d[g.hcGetFullYear]();
                c = c ? g.UTC(e, 0, 1) : +new g(e, 0, 1);
                b = Math.max(b || 0, c);
                d = d.getTime();
                return {
                    max: Math.min(a || d, d),
                    min: b
                }
            },
            render: function(a, b) {
                var c = this,
                    d = c.chart,
                    e = d.renderer,
                    f = d.container,
                    g = d.options,
                    m = g.exporting && !1 !== g.exporting.enabled && g.navigation && g.navigation.buttonOptions,
                    p = g.rangeSelector,
                    q = c.buttons,
                    g = t.lang,
                    r = c.div,
                    r = c.inputGroup,
                    v = p.buttonTheme,
                    u = p.buttonPosition || {},
                    y = p.inputEnabled,
                    B = v && v.states,
                    C = d.plotLeft,
                    D, F = this.getPosition(),
                    G = c.group,
                    N = c.rendered;
                !1 !== p.enabled && (N || (c.group = G = e.g("range-selector-buttons").add(), c.zoomText = e.text(g.rangeSelectorZoom, n(u.x, C), 15).css(p.labelStyle).add(G), D = n(u.x, C) + c.zoomText.getBBox().width + 5, k(c.buttonOptions, function(a, b) {
                    q[b] = e.button(a.text,
                        D, 0,
                        function() {
                            c.clickButton(b);
                            c.isActive = !0
                        }, v, B && B.hover, B && B.select, B && B.disabled).attr({
                        "text-align": "center"
                    }).add(G);
                    D += q[b].width + n(p.buttonSpacing, 5)
                }), !1 !== y && (c.div = r = h("div", null, {
                    position: "relative",
                    height: 0,
                    zIndex: 1
                }), f.parentNode.insertBefore(r, f), c.inputGroup = r = e.g("input-group").add(), r.offset = 0, c.drawInput("min"), c.drawInput("max"))), c.updateButtonStates(), G[N ? "animate" : "attr"]({
                    translateY: F.buttonTop
                }), !1 !== y && (r.align(z({
                    y: F.inputTop,
                    width: r.offset,
                    x: m && F.inputTop < (m.y || 0) + m.height -
                        d.spacing[0] ? -40 : 0
                }, p.inputPosition), !0, d.spacingBox), l(y) || (d = G.getBBox(), r[r.alignAttr.translateX < d.x + d.width + 10 ? "hide" : "show"]()), c.setInputValue("min", a), c.setInputValue("max", b)), c.rendered = !0)
            },
            update: function(a) {
                var b = this.chart;
                c(!0, b.options.rangeSelector, a);
                this.destroy();
                this.init(b)
            },
            destroy: function() {
                var a = this.minInput,
                    c = this.maxInput,
                    d;
                this.unMouseDown();
                this.unResize();
                f(this.buttons);
                a && (a.onfocus = a.onblur = a.onchange = null);
                c && (c.onfocus = c.onblur = c.onchange = null);
                for (d in this) this[d] &&
                    "chart" !== d && (this[d].destroy ? this[d].destroy() : this[d].nodeType && b(this[d])), this[d] !== D.prototype[d] && (this[d] = null)
            }
        };
        F.prototype.toFixedRange = function(a, b, c, d) {
            var f = this.chart && this.chart.fixedRange;
            a = n(c, this.translate(a, !0));
            b = n(d, this.translate(b, !0));
            c = f && (b - a) / f;
            .7 < c && 1.3 > c && (d ? a = b - f : b = a + f);
            e(a) || (a = b = void 0);
            return {
                min: a,
                max: b
            }
        };
        F.prototype.minFromRange = function() {
            var a = this.range,
                b = {
                    month: "Month",
                    year: "FullYear"
                }[a.type],
                c, d = this.max,
                f, g, h = function(a, c) {
                    var d = new Date(a);
                    d["set" + b](d["get" +
                        b]() + c);
                    return d.getTime() - a
                };
            e(a) ? (c = d - a, g = a) : (c = d + h(d, -a.count), this.chart && (this.chart.fixedRange = d - c));
            f = n(this.dataMin, Number.MIN_VALUE);
            e(c) || (c = f);
            c <= f && (c = f, void 0 === g && (g = h(c, a.count)), this.newMax = Math.min(c + g, this.dataMax));
            e(d) || (c = void 0);
            return c
        };
        C(G.prototype, "init", function(a, b, c) {
            B(this, "init", function() {
                this.options.rangeSelector.enabled && (this.rangeSelector = new D(this))
            });
            a.call(this, b, c)
        });
        a.RangeSelector = D
    })(N);
    (function(a) {
        var D = a.addEvent,
            B = a.isNumber;
        a.Chart.prototype.callbacks.push(function(a) {
            function F() {
                r =
                    a.xAxis[0].getExtremes();
                B(r.min) && m.render(r.min, r.max)
            }
            var r, h = a.scroller,
                m = a.rangeSelector,
                t, q;
            h && (r = a.xAxis[0].getExtremes(), h.render(r.min, r.max));
            m && (q = D(a.xAxis[0], "afterSetExtremes", function(a) {
                m.render(a.min, a.max)
            }), t = D(a, "redraw", F), F());
            D(a, "destroy", function() {
                m && (t(), q())
            })
        })
    })(N);
    (function(a) {
        var D = a.arrayMax,
            B = a.arrayMin,
            F = a.Axis,
            G = a.Chart,
            r = a.defined,
            h = a.each,
            m = a.extend,
            t = a.format,
            q = a.inArray,
            l = a.isNumber,
            f = a.isString,
            b = a.map,
            k = a.merge,
            z = a.pick,
            p = a.Point,
            g = a.Renderer,
            e = a.Series,
            c =
            a.splat,
            n = a.SVGRenderer,
            u = a.VMLRenderer,
            d = a.wrap,
            C = e.prototype,
            y = C.init,
            v = C.processData,
            E = p.prototype.tooltipFormatter;
        a.StockChart = a.stockChart = function(d, e, g) {
            var h = f(d) || d.nodeName,
                l = arguments[h ? 1 : 0],
                m = l.series,
                n = a.getOptions(),
                p, q = z(l.navigator && l.navigator.enabled, !0) ? {
                    startOnTick: !1,
                    endOnTick: !1
                } : null,
                r = {
                    marker: {
                        enabled: !1,
                        radius: 2
                    }
                },
                t = {
                    shadow: !1,
                    borderWidth: 0
                };
            l.xAxis = b(c(l.xAxis || {}), function(a) {
                return k({
                        minPadding: 0,
                        maxPadding: 0,
                        ordinal: !0,
                        title: {
                            text: null
                        },
                        labels: {
                            overflow: "justify"
                        },
                        showLastLabel: !0
                    },
                    n.xAxis, a, {
                        type: "datetime",
                        categories: null
                    }, q)
            });
            l.yAxis = b(c(l.yAxis || {}), function(a) {
                p = z(a.opposite, !0);
                return k({
                    labels: {
                        y: -2
                    },
                    opposite: p,
                    showLastLabel: !1,
                    title: {
                        text: null
                    }
                }, n.yAxis, a)
            });
            l.series = null;
            l = k({
                chart: {
                    panning: !0,
                    pinchType: "x"
                },
                navigator: {
                    enabled: !0
                },
                scrollbar: {
                    enabled: !0
                },
                rangeSelector: {
                    enabled: !0
                },
                title: {
                    text: null,
                    style: {
                        fontSize: "16px"
                    }
                },
                tooltip: {
                    shared: !0,
                    crosshairs: !0
                },
                legend: {
                    enabled: !1
                },
                plotOptions: {
                    line: r,
                    spline: r,
                    area: r,
                    areaspline: r,
                    arearange: r,
                    areasplinerange: r,
                    column: t,
                    columnrange: t,
                    candlestick: t,
                    ohlc: t
                }
            }, l, {
                _stock: !0,
                chart: {
                    inverted: !1
                }
            });
            l.series = m;
            return h ? new G(d, l, g) : new G(l, e)
        };
        d(F.prototype, "autoLabelAlign", function(a) {
            var b = this.chart,
                c = this.options,
                b = b._labelPanes = b._labelPanes || {},
                d = this.options.labels;
            return this.chart.options._stock && "yAxis" === this.coll && (c = c.top + "," + c.height, !b[c] && d.enabled) ? (15 === d.x && (d.x = 0), void 0 === d.align && (d.align = "right"), b[c] = 1, "right") : a.call(this, [].slice.call(arguments, 1))
        });
        d(F.prototype, "getPlotLinePath", function(a, c, d, e, g, k) {
            var m =
                this,
                n = this.isLinked && !this.series ? this.linkedParent.series : this.series,
                p = m.chart,
                t = p.renderer,
                w = m.left,
                u = m.top,
                x, v, y, B, H = [],
                C = [],
                I, D;
            if ("colorAxis" === m.coll) return a.apply(this, [].slice.call(arguments, 1));
            C = function(a) {
                var c = "xAxis" === a ? "yAxis" : "xAxis";
                a = m.options[c];
                return l(a) ? [p[c][a]] : f(a) ? [p.get(a)] : b(n, function(a) {
                    return a[c]
                })
            }(m.coll);
            h(m.isXAxis ? p.yAxis : p.xAxis, function(a) {
                if (r(a.options.id) ? -1 === a.options.id.indexOf("navigator") : 1) {
                    var b = a.isXAxis ? "yAxis" : "xAxis",
                        b = r(a.options[b]) ? p[b][a.options[b]] :
                        p[b][0];
                    m === b && C.push(a)
                }
            });
            I = C.length ? [] : [m.isXAxis ? p.yAxis[0] : p.xAxis[0]];
            h(C, function(a) {
                -1 === q(a, I) && I.push(a)
            });
            D = z(k, m.translate(c, null, null, e));
            l(D) && (m.horiz ? h(I, function(a) {
                var b;
                v = a.pos;
                B = v + a.len;
                x = y = Math.round(D + m.transB);
                if (x < w || x > w + m.width) g ? x = y = Math.min(Math.max(w, x), w + m.width) : b = !0;
                b || H.push("M", x, v, "L", y, B)
            }) : h(I, function(a) {
                var b;
                x = a.pos;
                y = x + a.len;
                v = B = Math.round(u + m.height - D);
                if (v < u || v > u + m.height) g ? v = B = Math.min(Math.max(u, v), m.top + m.height) : b = !0;
                b || H.push("M", x, v, "L", y, B)
            }));
            return 0 <
                H.length ? t.crispPolyLine(H, d || 1) : null
        });
        F.prototype.getPlotBandPath = function(a, b) {
            b = this.getPlotLinePath(b, null, null, !0);
            a = this.getPlotLinePath(a, null, null, !0);
            var c = [],
                d;
            if (a && b && a.toString() !== b.toString())
                for (d = 0; d < a.length; d += 6) c.push("M", a[d + 1], a[d + 2], "L", a[d + 4], a[d + 5], b[d + 4], b[d + 5], b[d + 1], b[d + 2], "z");
            else c = null;
            return c
        };
        n.prototype.crispPolyLine = function(a, b) {
            var c;
            for (c = 0; c < a.length; c += 6) a[c + 1] === a[c + 4] && (a[c + 1] = a[c + 4] = Math.round(a[c + 1]) - b % 2 / 2), a[c + 2] === a[c + 5] && (a[c + 2] = a[c + 5] = Math.round(a[c +
                2]) + b % 2 / 2);
            return a
        };
        g === u && (u.prototype.crispPolyLine = n.prototype.crispPolyLine);
        d(F.prototype, "hideCrosshair", function(a, b) {
            a.call(this, b);
            this.crossLabel && (this.crossLabel = this.crossLabel.hide())
        });
        d(F.prototype, "drawCrosshair", function(a, b, c) {
            var d, e;
            a.call(this, b, c);
            if (r(this.crosshair.label) && this.crosshair.label.enabled && this.cross) {
                a = this.chart;
                var f = this.options.crosshair.label,
                    g = this.horiz;
                d = this.opposite;
                e = this.left;
                var h = this.top,
                    k = this.crossLabel,
                    l, n = f.format,
                    p = "",
                    q = "inside" === this.options.tickPosition,
                    u = !1 !== this.crosshair.snap,
                    w = 0;
                b || (b = this.cross && this.cross.e);
                l = g ? "center" : d ? "right" === this.labelAlign ? "right" : "left" : "left" === this.labelAlign ? "left" : "center";
                k || (k = this.crossLabel = a.renderer.label(null, null, null, f.shape || "callout").addClass("highcharts-crosshair-label" + (this.series[0] && " highcharts-color-" + this.series[0].colorIndex)).attr({
                    align: f.align || l,
                    padding: z(f.padding, 8),
                    r: z(f.borderRadius, 3),
                    zIndex: 2
                }).add(this.labelGroup), k.attr({
                    fill: f.backgroundColor || this.series[0] && this.series[0].color ||
                        "#666666",
                    stroke: f.borderColor || "",
                    "stroke-width": f.borderWidth || 0
                }).css(m({
                    color: "#ffffff",
                    fontWeight: "normal",
                    fontSize: "11px",
                    textAlign: "center"
                }, f.style)));
                g ? (l = u ? c.plotX + e : b.chartX, h += d ? 0 : this.height) : (l = d ? this.width + e : 0, h = u ? c.plotY + h : b.chartY);
                n || f.formatter || (this.isDatetimeAxis && (p = "%b %d, %Y"), n = "{value" + (p ? ":" + p : "") + "}");
                b = u ? c[this.isXAxis ? "x" : "y"] : this.toValue(g ? b.chartX : b.chartY);
                k.attr({
                    text: n ? t(n, {
                        value: b
                    }) : f.formatter.call(this, b),
                    x: l,
                    y: h,
                    visibility: "visible"
                });
                b = k.getBBox();
                if (g) {
                    if (q &&
                        !d || !q && d) h = k.y - b.height
                } else h = k.y - b.height / 2;
                g ? (d = e - b.x, e = e + this.width - b.x) : (d = "left" === this.labelAlign ? e : 0, e = "right" === this.labelAlign ? e + this.width : a.chartWidth);
                k.translateX < d && (w = d - k.translateX);
                k.translateX + b.width >= e && (w = -(k.translateX + b.width - e));
                k.attr({
                    x: l + w,
                    y: h,
                    anchorX: g ? l : this.opposite ? 0 : a.chartWidth,
                    anchorY: g ? this.opposite ? a.chartHeight : 0 : h + b.height / 2
                })
            }
        });
        C.init = function() {
            y.apply(this, arguments);
            this.setCompare(this.options.compare)
        };
        C.setCompare = function(a) {
            this.modifyValue = "value" ===
                a || "percent" === a ? function(b, c) {
                    var d = this.compareValue;
                    if (void 0 !== b && void 0 !== d) return b = "value" === a ? b - d : b = b / d * 100 - 100, c && (c.change = b), b
                } : null;
            this.userOptions.compare = a;
            this.chart.hasRendered && (this.isDirty = !0)
        };
        C.processData = function() {
            var a, b = -1,
                c, d, e, f;
            v.apply(this, arguments);
            if (this.xAxis && this.processedYData)
                for (c = this.processedXData, d = this.processedYData, e = d.length, this.pointArrayMap && (b = q("close", this.pointArrayMap), -1 === b && (b = q(this.pointValKey || "y", this.pointArrayMap))), a = 0; a < e - 1; a++)
                    if (f = -1 < b ? d[a][b] : d[a], l(f) && c[a + 1] >= this.xAxis.min && 0 !== f) {
                        this.compareValue = f;
                        break
                    }
        };
        d(C, "getExtremes", function(a) {
            var b;
            a.apply(this, [].slice.call(arguments, 1));
            this.modifyValue && (b = [this.modifyValue(this.dataMin), this.modifyValue(this.dataMax)], this.dataMin = B(b), this.dataMax = D(b))
        });
        F.prototype.setCompare = function(a, b) {
            this.isXAxis || (h(this.series, function(b) {
                b.setCompare(a)
            }), z(b, !0) && this.chart.redraw())
        };
        p.prototype.tooltipFormatter = function(b) {
            b = b.replace("{point.change}", (0 < this.change ? "+" : "") +
                a.numberFormat(this.change, z(this.series.tooltipOptions.changeDecimals, 2)));
            return E.apply(this, [b])
        };
        d(e.prototype, "render", function(a) {
            this.chart.options._stock && this.xAxis && (!this.clipBox && this.animate ? (this.clipBox = k(this.chart.clipBox), this.clipBox.width = this.xAxis.len, this.clipBox.height = this.yAxis.len) : this.chart[this.sharedClipKey] ? this.chart[this.sharedClipKey].attr({
                width: this.xAxis.len,
                height: this.yAxis.len
            }) : this.clipBox && (this.clipBox.width = this.xAxis.len, this.clipBox.height = this.yAxis.len));
            a.call(this)
        })
    })(N);
    return N
});