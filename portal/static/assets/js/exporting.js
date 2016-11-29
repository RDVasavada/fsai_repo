/*
 Highcharts JS v5.0.4 (2016-11-22)
 Exporting module

 (c) 2010-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(l) {
    "object" === typeof module && module.exports ? module.exports = l : l(Highcharts)
})(function(l) {
    (function(f) {
        var l = f.defaultOptions,
            n = f.doc,
            A = f.Chart,
            v = f.addEvent,
            G = f.removeEvent,
            D = f.fireEvent,
            q = f.createElement,
            B = f.discardElement,
            w = f.css,
            p = f.merge,
            C = f.pick,
            m = f.each,
            t = f.extend,
            H = f.isTouchDevice,
            E = f.win,
            I = f.Renderer.prototype.symbols;
        t(l.lang, {
            printChart: "Print chart",
            downloadPNG: "Download PNG image",
            downloadJPEG: "Download JPEG image",
            downloadPDF: "Download PDF document",
            downloadSVG: "Download SVG vector image",
            contextButtonTitle: "Chart context menu"
        });
        l.navigation = {
            buttonOptions: {
                theme: {},
                symbolSize: 14,
                symbolX: 12.5,
                symbolY: 10.5,
                align: "right",
                buttonSpacing: 3,
                height: 22,
                verticalAlign: "top",
                width: 24
            }
        };
        p(!0, l.navigation, {
            menuStyle: {
                border: "1px solid #999999",
                background: "#ffffff",
                padding: "5px 0"
            },
            menuItemStyle: {
                padding: "0.5em 1em",
                background: "none",
                color: "#333333",
                fontSize: H ? "14px" : "11px",
                transition: "background 250ms, color 250ms"
            },
            menuItemHoverStyle: {
                background: "#335cad",
                color: "#ffffff"
            },
            buttonOptions: {
                symbolFill: "#666666",
                symbolStroke: "#666666",
                symbolStrokeWidth: 3,
                theme: {
                    fill: "#ffffff",
                    stroke: "none",
                    padding: 5
                }
            }
        });
        l.exporting = {
            type: "image/png",
            url: "https://export.highcharts.com/",
            printMaxWidth: 780,
            scale: 2,
            buttons: {
                contextButton: {
                    className: "highcharts-contextbutton",
                    menuClassName: "highcharts-contextmenu",
                    symbol: "menu",
                    _titleKey: "contextButtonTitle",
                    menuItems: [{
                        textKey: "printChart",
                        onclick: function() {
                            this.print()
                        }
                    }, {
                        separator: !0
                    }, {
                        textKey: "downloadPNG",
                        onclick: function() {
                            this.exportChart()
                        }
                    }, {
                        textKey: "downloadJPEG",
                        onclick: function() {
                            this.exportChart({
                                type: "image/jpeg"
                            })
                        }
                    }, {
                        textKey: "downloadPDF",
                        onclick: function() {
                            this.exportChart({
                                type: "application/pdf"
                            })
                        }
                    }, {
                        textKey: "downloadSVG",
                        onclick: function() {
                            this.exportChart({
                                type: "image/svg+xml"
                            })
                        }
                    }]
                }
            }
        };
        f.post = function(a, b, e) {
            var d;
            a = q("form", p({
                method: "post",
                action: a,
                enctype: "multipart/form-data"
            }, e), {
                display: "none"
            }, n.body);
            for (d in b) q("input", {
                type: "hidden",
                name: d,
                value: b[d]
            }, null, a);
            a.submit();
            B(a)
        };
        t(A.prototype, {
            sanitizeSVG: function(a, b) {
                if (b && b.exporting && b.exporting.allowHTML) {
                    var e = a.match(/<\/svg>(.*?$)/);
                    e && (e =
                        '\x3cforeignObject x\x3d"0" y\x3d"0" width\x3d"' + b.chart.width + '" height\x3d"' + b.chart.height + '"\x3e\x3cbody xmlns\x3d"http://www.w3.org/1999/xhtml"\x3e' + e[1] + "\x3c/body\x3e\x3c/foreignObject\x3e", a = a.replace("\x3c/svg\x3e", e + "\x3c/svg\x3e"))
                }
                a = a.replace(/zIndex="[^"]+"/g, "").replace(/isShadow="[^"]+"/g, "").replace(/symbolName="[^"]+"/g, "").replace(/jQuery[0-9]+="[^"]+"/g, "").replace(/url\(("|&quot;)(\S+)("|&quot;)\)/g, "url($2)").replace(/url\([^#]+#/g, "url(#").replace(/<svg /, '\x3csvg xmlns:xlink\x3d"http://www.w3.org/1999/xlink" ').replace(/ (NS[0-9]+\:)?href=/g,
                    " xlink:href\x3d").replace(/\n/, " ").replace(/<\/svg>.*?$/, "\x3c/svg\x3e").replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g, '$1\x3d"rgb($2)" $1-opacity\x3d"$3"').replace(/&nbsp;/g, "\u00a0").replace(/&shy;/g, "\u00ad");
                return a = a.replace(/<IMG /g, "\x3cimage ").replace(/<(\/?)TITLE>/g, "\x3c$1title\x3e").replace(/height=([^" ]+)/g, 'height\x3d"$1"').replace(/width=([^" ]+)/g, 'width\x3d"$1"').replace(/hc-svg-href="([^"]+)">/g, 'xlink:href\x3d"$1"/\x3e').replace(/ id=([^" >]+)/g, ' id\x3d"$1"').replace(/class=([^" >]+)/g,
                    'class\x3d"$1"').replace(/ transform /g, " ").replace(/:(path|rect)/g, "$1").replace(/style="([^"]+)"/g, function(a) {
                    return a.toLowerCase()
                })
            },
            getChartHTML: function() {
                return this.container.innerHTML
            },
            getSVG: function(a) {
                var b = this,
                    e, d, g, u, h, c = p(b.options, a);
                n.createElementNS || (n.createElementNS = function(a, b) {
                    return n.createElement(b)
                });
                d = q("div", null, {
                    position: "absolute",
                    top: "-9999em",
                    width: b.chartWidth + "px",
                    height: b.chartHeight + "px"
                }, n.body);
                g = b.renderTo.style.width;
                h = b.renderTo.style.height;
                g = c.exporting.sourceWidth ||
                    c.chart.width || /px$/.test(g) && parseInt(g, 10) || 600;
                h = c.exporting.sourceHeight || c.chart.height || /px$/.test(h) && parseInt(h, 10) || 400;
                t(c.chart, {
                    animation: !1,
                    renderTo: d,
                    forExport: !0,
                    renderer: "SVGRenderer",
                    width: g,
                    height: h
                });
                c.exporting.enabled = !1;
                delete c.data;
                c.series = [];
                m(b.series, function(a) {
                    u = p(a.userOptions, {
                        animation: !1,
                        enableMouseTracking: !1,
                        showCheckbox: !1,
                        visible: a.visible
                    });
                    u.isInternal || c.series.push(u)
                });
                e = new f.Chart(c, b.callback);
                a && m(["xAxis", "yAxis", "series"], function(b) {
                    var d = {};
                    a[b] &&
                        (d[b] = a[b], e.update(d))
                });
                m(["xAxis", "yAxis"], function(a) {
                    m(b[a], function(b, d) {
                        d = e[a][d];
                        var c = b.getExtremes();
                        b = c.userMin;
                        c = c.userMax;
                        !d || void 0 === b && void 0 === c || d.setExtremes(b, c, !0, !1)
                    })
                });
                g = e.getChartHTML();
                g = b.sanitizeSVG(g, c);
                c = null;
                e.destroy();
                B(d);
                return g
            },
            getSVGForExport: function(a, b) {
                var e = this.options.exporting;
                return this.getSVG(p({
                    chart: {
                        borderRadius: 0
                    }
                }, e.chartOptions, b, {
                    exporting: {
                        sourceWidth: a && a.sourceWidth || e.sourceWidth,
                        sourceHeight: a && a.sourceHeight || e.sourceHeight
                    }
                }))
            },
            exportChart: function(a,
                b) {
                b = this.getSVGForExport(a, b);
                a = p(this.options.exporting, a);
                f.post(a.url, {
                    filename: a.filename || "chart",
                    type: a.type,
                    width: a.width || 0,
                    scale: a.scale,
                    svg: b
                }, a.formAttributes)
            },
            print: function() {
                var a = this,
                    b = a.container,
                    e = [],
                    d = b.parentNode,
                    g = n.body,
                    f = g.childNodes,
                    h = a.options.exporting.printMaxWidth,
                    c, F;
                if (!a.isPrinting) {
                    a.isPrinting = !0;
                    a.pointer.reset(null, 0);
                    D(a, "beforePrint");
                    if (F = h && a.chartWidth > h) c = [a.options.chart.width, void 0, !1], a.setSize(h, void 0, !1);
                    m(f, function(a, b) {
                        1 === a.nodeType && (e[b] = a.style.display,
                            a.style.display = "none")
                    });
                    g.appendChild(b);
                    E.focus();
                    E.print();
                    setTimeout(function() {
                        d.appendChild(b);
                        m(f, function(a, b) {
                            1 === a.nodeType && (a.style.display = e[b])
                        });
                        a.isPrinting = !1;
                        F && a.setSize.apply(a, c);
                        D(a, "afterPrint")
                    }, 1E3)
                }
            },
            contextMenu: function(a, b, e, d, f, u, h) {
                var c = this,
                    g = c.options.navigation,
                    l = c.chartWidth,
                    r = c.chartHeight,
                    p = "cache-" + a,
                    k = c[p],
                    x = Math.max(f, u),
                    y, z;
                k || (c[p] = k = q("div", {
                    className: a
                }, {
                    position: "absolute",
                    zIndex: 1E3,
                    padding: x + "px"
                }, c.container), y = q("div", {
                        className: "highcharts-menu"
                    },
                    null, k), w(y, t({
                    MozBoxShadow: "3px 3px 10px #888",
                    WebkitBoxShadow: "3px 3px 10px #888",
                    boxShadow: "3px 3px 10px #888"
                }, g.menuStyle)), z = function() {
                    w(k, {
                        display: "none"
                    });
                    h && h.setState(0);
                    c.openMenu = !1
                }, v(k, "mouseleave", function() {
                    k.hideTimer = setTimeout(z, 500)
                }), v(k, "mouseenter", function() {
                    clearTimeout(k.hideTimer)
                }), p = v(n, "mouseup", function(b) {
                    c.pointer.inClass(b.target, a) || z()
                }), v(c, "destroy", p), m(b, function(a) {
                    if (a) {
                        var b;
                        a.separator ? b = q("hr", null, null, y) : (b = q("div", {
                            className: "highcharts-menu-item",
                            onclick: function(b) {
                                b && b.stopPropagation();
                                z();
                                a.onclick && a.onclick.apply(c, arguments)
                            },
                            innerHTML: a.text || c.options.lang[a.textKey]
                        }, null, y), b.onmouseover = function() {
                            w(this, g.menuItemHoverStyle)
                        }, b.onmouseout = function() {
                            w(this, g.menuItemStyle)
                        }, w(b, t({
                            cursor: "pointer"
                        }, g.menuItemStyle)));
                        c.exportDivElements.push(b)
                    }
                }), c.exportDivElements.push(y, k), c.exportMenuWidth = k.offsetWidth, c.exportMenuHeight = k.offsetHeight);
                b = {
                    display: "block"
                };
                e + c.exportMenuWidth > l ? b.right = l - e - f - x + "px" : b.left = e - x + "px";
                d + u + c.exportMenuHeight >
                    r && "top" !== h.alignOptions.verticalAlign ? b.bottom = r - d - x + "px" : b.top = d + u - x + "px";
                w(k, b);
                c.openMenu = !0
            },
            addButton: function(a) {
                var b = this,
                    e = b.renderer,
                    d = p(b.options.navigation.buttonOptions, a),
                    f = d.onclick,
                    l = d.menuItems,
                    h, c, m = d.symbolSize || 12;
                b.btnCount || (b.btnCount = 0);
                b.exportDivElements || (b.exportDivElements = [], b.exportSVGElements = []);
                if (!1 !== d.enabled) {
                    var n = d.theme,
                        r = n.states,
                        q = r && r.hover,
                        r = r && r.select,
                        k;
                    delete n.states;
                    f ? k = function(a) {
                        a.stopPropagation();
                        f.call(b, a)
                    } : l && (k = function() {
                        b.contextMenu(c.menuClassName,
                            l, c.translateX, c.translateY, c.width, c.height, c);
                        c.setState(2)
                    });
                    d.text && d.symbol ? n.paddingLeft = C(n.paddingLeft, 25) : d.text || t(n, {
                        width: d.width,
                        height: d.height,
                        padding: 0
                    });
                    c = e.button(d.text, 0, 0, k, n, q, r).addClass(a.className).attr({
                        "stroke-linecap": "round",
                        title: b.options.lang[d._titleKey],
                        zIndex: 3
                    });
                    c.menuClassName = a.menuClassName || "highcharts-menu-" + b.btnCount++;
                    d.symbol && (h = e.symbol(d.symbol, d.symbolX - m / 2, d.symbolY - m / 2, m, m).addClass("highcharts-button-symbol").attr({
                        zIndex: 1
                    }).add(c), h.attr({
                        stroke: d.symbolStroke,
                        fill: d.symbolFill,
                        "stroke-width": d.symbolStrokeWidth || 1
                    }));
                    c.add().align(t(d, {
                        width: c.width,
                        x: C(d.x, b.buttonOffset)
                    }), !0, "spacingBox");
                    b.buttonOffset += (c.width + d.buttonSpacing) * ("right" === d.align ? -1 : 1);
                    b.exportSVGElements.push(c, h)
                }
            },
            destroyExport: function(a) {
                var b = a ? a.target : this;
                a = b.exportSVGElements;
                var e = b.exportDivElements;
                a && (m(a, function(a, e) {
                    a && (a.onclick = a.ontouchstart = null, b.exportSVGElements[e] = a.destroy())
                }), a.length = 0);
                e && (m(e, function(a, e) {
                    clearTimeout(a.hideTimer);
                    G(a, "mouseleave");
                    b.exportDivElements[e] = a.onmouseout = a.onmouseover = a.ontouchstart = a.onclick = null;
                    B(a)
                }), e.length = 0)
            }
        });
        I.menu = function(a, b, e, d) {
            return ["M", a, b + 2.5, "L", a + e, b + 2.5, "M", a, b + d / 2 + .5, "L", a + e, b + d / 2 + .5, "M", a, b + d - 1.5, "L", a + e, b + d - 1.5]
        };
        A.prototype.renderExporting = function() {
            var a, b = this.options.exporting,
                e = b.buttons,
                d = this.isDirtyExporting || !this.exportSVGElements;
            this.buttonOffset = 0;
            this.isDirtyExporting && this.destroyExport();
            if (d && !1 !== b.enabled) {
                for (a in e) this.addButton(e[a]);
                this.isDirtyExporting = !1
            }
            v(this,
                "destroy", this.destroyExport)
        };
        A.prototype.callbacks.push(function(a) {
            a.renderExporting();
            v(a, "redraw", a.renderExporting);
            m(["exporting", "navigation"], function(b) {
                a[b] = {
                    update: function(e, d) {
                        a.isDirtyExporting = !0;
                        p(!0, a.options[b], e);
                        C(d, !0) && a.redraw()
                    }
                }
            })
        })
    })(l)
});