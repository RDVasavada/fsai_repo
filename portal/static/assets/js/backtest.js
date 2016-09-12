(function() {
    var a, c, d, b, f, g = {}.hasOwnProperty,
        l = function(a, q) {
            function e() {
                this.constructor = a
            }
            for (var b in q) g.call(q, b) && (a[b] = q[b]);
            e.prototype = q.prototype;
            a.prototype = new e;
            a.__super__ = q.prototype;
            return a
        };
    b = function() {
        function a() {
            this.options_index = 0;
            this.parsed = []
        }
        a.prototype.add_node = function(a) {
            return "OPTGROUP" === a.nodeName.toUpperCase() ? this.add_group(a) : this.add_option(a)
        };
        a.prototype.add_group = function(a) {
            var e, b, h, g, c, d;
            e = this.parsed.length;
            this.parsed.push({
                array_index: e,
                group: !0,
                label: this.escapeExpression(a.label),
                title: a.title ? a.title : void 0,
                children: 0,
                disabled: a.disabled,
                classes: a.className
            });
            c = a.childNodes;
            d = [];
            h = 0;
            for (g = c.length; h < g; h++) b = c[h], d.push(this.add_option(b, e, a.disabled));
            return d
        };
        a.prototype.add_option = function(a, e, b) {
            if ("OPTION" === a.nodeName.toUpperCase()) return "" !== a.text ? (null != e && (this.parsed[e].children += 1), this.parsed.push({
                array_index: this.parsed.length,
                options_index: this.options_index,
                value: a.value,
                text: a.text,
                html: a.innerHTML,
                title: a.title ? a.title : void 0,
                selected: a.selected,
                disabled: !0 ===
                    b ? b : a.disabled,
                group_array_index: e,
                group_label: null != e ? this.parsed[e].label : null,
                classes: a.className,
                style: a.style.cssText
            })) : this.parsed.push({
                array_index: this.parsed.length,
                options_index: this.options_index,
                empty: !0
            }), this.options_index += 1
        };
        a.prototype.escapeExpression = function(a) {
            var e;
            if (null == a || !1 === a) return "";
            if (!/[\&\<\>\"\'\`]/.test(a)) return a;
            e = {
                "\x3c": "\x26lt;",
                "\x3e": "\x26gt;",
                '"': "\x26quot;",
                "'": "\x26#x27;",
                "`": "\x26#x60;"
            };
            return a.replace(/&(?!\w+;)|[\<\>\"\'\`]/g, function(a) {
                return e[a] ||
                    "\x26amp;"
            })
        };
        return a
    }();
    b.select_to_array = function(a) {
        var q, e, m, g;
        q = new b;
        g = a.childNodes;
        e = 0;
        for (m = g.length; e < m; e++) a = g[e], q.add_node(a);
        return q.parsed
    };
    c = function() {
        function a(q, e) {
            this.form_field = q;
            this.options = null != e ? e : {};
            a.browser_is_supported() && (this.is_multiple = this.form_field.multiple, this.set_default_text(), this.set_default_values(), this.setup(), this.set_up_html(), this.register_observers(), this.on_ready())
        }
        a.prototype.set_default_values = function() {
            var a = this;
            this.click_test_action = function(e) {
                return a.test_active_click(e)
            };
            this.activate_action = function(e) {
                return a.activate_field(e)
            };
            this.results_showing = this.mouse_on_container = this.active_field = !1;
            this.result_highlighted = null;
            this.allow_single_deselect = null != this.options.allow_single_deselect && null != this.form_field.options[0] && "" === this.form_field.options[0].text ? this.options.allow_single_deselect : !1;
            this.disable_search_threshold = this.options.disable_search_threshold || 0;
            this.disable_search = this.options.disable_search || !1;
            this.enable_split_word_search = null != this.options.enable_split_word_search ?
                this.options.enable_split_word_search : !0;
            this.group_search = null != this.options.group_search ? this.options.group_search : !0;
            this.search_contains = this.options.search_contains || !1;
            this.single_backstroke_delete = null != this.options.single_backstroke_delete ? this.options.single_backstroke_delete : !0;
            this.max_selected_options = this.options.max_selected_options || Infinity;
            this.inherit_select_classes = this.options.inherit_select_classes || !1;
            this.display_selected_options = null != this.options.display_selected_options ?
                this.options.display_selected_options : !0;
            this.display_disabled_options = null != this.options.display_disabled_options ? this.options.display_disabled_options : !0;
            this.include_group_label_in_selected = this.options.include_group_label_in_selected || !1;
            return this.max_shown_results = this.options.max_shown_results || Number.POSITIVE_INFINITY
        };
        a.prototype.set_default_text = function() {
            this.form_field.getAttribute("data-placeholder") ? this.default_text = this.form_field.getAttribute("data-placeholder") : this.default_text =
                this.is_multiple ? this.options.placeholder_text_multiple || this.options.placeholder_text || a.default_multiple_text : this.options.placeholder_text_single || this.options.placeholder_text || a.default_single_text;
            return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || a.default_no_result_text
        };
        a.prototype.choice_label = function(a) {
            return this.include_group_label_in_selected && null != a.group_label ? "\x3cb class\x3d'group-name'\x3e" + a.group_label + "\x3c/b\x3e" +
                a.html : a.html
        };
        a.prototype.mouse_enter = function() {
            return this.mouse_on_container = !0
        };
        a.prototype.mouse_leave = function() {
            return this.mouse_on_container = !1
        };
        a.prototype.input_focus = function(a) {
            var e = this;
            if (this.is_multiple) {
                if (!this.active_field) return setTimeout(function() {
                    return e.container_mousedown()
                }, 50)
            } else if (!this.active_field) return this.activate_field()
        };
        a.prototype.input_blur = function(a) {
            var e = this;
            if (!this.mouse_on_container) return this.active_field = !1, setTimeout(function() {
                    return e.blur_test()
                },
                100)
        };
        a.prototype.results_option_build = function(a) {
            var e, b, g, c, d, h, l;
            e = "";
            c = 0;
            l = this.results_data;
            d = 0;
            for (h = l.length; d < h && !(b = l[d], g = b.group ? this.result_add_group(b) : this.result_add_option(b), "" !== g && (c++, e += g), null != a && a.first && (b.selected && this.is_multiple ? this.choice_build(b) : b.selected && !this.is_multiple && this.single_set_selected_text(this.choice_label(b))), c >= this.max_shown_results); d++);
            return e
        };
        a.prototype.result_add_option = function(a) {
            var e, b;
            if (!a.search_match || !this.include_option_in_results(a)) return "";
            e = [];
            a.disabled || a.selected && this.is_multiple || e.push("active-result");
            !a.disabled || a.selected && this.is_multiple || e.push("disabled-result");
            a.selected && e.push("result-selected");
            null != a.group_array_index && e.push("group-option");
            "" !== a.classes && e.push(a.classes);
            b = document.createElement("li");
            b.className = e.join(" ");
            b.style.cssText = a.style;
            b.setAttribute("data-option-array-index", a.array_index);
            b.innerHTML = a.search_text;
            a.title && (b.title = a.title);
            return this.outerHTML(b)
        };
        a.prototype.result_add_group =
            function(a) {
                var e, b;
                if (!a.search_match && !a.group_match || !(0 < a.active_options)) return "";
                e = [];
                e.push("group-result");
                a.classes && e.push(a.classes);
                b = document.createElement("li");
                b.className = e.join(" ");
                b.innerHTML = a.search_text;
                a.title && (b.title = a.title);
                return this.outerHTML(b)
            };
        a.prototype.results_update_field = function() {
            this.set_default_text();
            this.is_multiple || this.results_reset_cleanup();
            this.result_clear_highlight();
            this.results_build();
            if (this.results_showing) return this.winnow_results()
        };
        a.prototype.reset_single_select_options =
            function() {
                var a, e, b, g, c;
                g = this.results_data;
                c = [];
                e = 0;
                for (b = g.length; e < b; e++) a = g[e], a.selected ? c.push(a.selected = !1) : c.push(void 0);
                return c
            };
        a.prototype.results_toggle = function() {
            return this.results_showing ? this.results_hide() : this.results_show()
        };
        a.prototype.results_search = function(a) {
            return this.results_showing ? this.winnow_results() : this.results_show()
        };
        a.prototype.winnow_results = function() {
            var a, e, b, g, c, d, h, l, k, v, C;
            this.no_results_clear();
            b = 0;
            c = this.get_search_text();
            a = c.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,
                "\\$\x26");
            l = new RegExp(a, "i");
            e = this.get_search_regex(a);
            C = this.results_data;
            k = 0;
            for (v = C.length; k < v; k++)
                if (a = C[k], a.search_match = !1, g = null, this.include_option_in_results(a) && (a.group && (a.group_match = !1, a.active_options = 0), null != a.group_array_index && this.results_data[a.group_array_index] && (g = this.results_data[a.group_array_index], 0 === g.active_options && g.search_match && (b += 1), g.active_options += 1), a.search_text = a.group ? a.label : a.html, !a.group || this.group_search)) a.search_match = this.search_string_match(a.search_text,
                    e), a.search_match && !a.group && (b += 1), a.search_match ? (c.length && (d = a.search_text.search(l), h = a.search_text.substr(0, d + c.length) + "\x3c/em\x3e" + a.search_text.substr(d + c.length), a.search_text = h.substr(0, d) + "\x3cem\x3e" + h.substr(d)), null != g && (g.group_match = !0)) : null != a.group_array_index && this.results_data[a.group_array_index].search_match && (a.search_match = !0);
            this.result_clear_highlight();
            if (1 > b && c.length) return this.update_results_content(""), this.no_results(c);
            this.update_results_content(this.results_option_build());
            return this.winnow_results_set_highlight()
        };
        a.prototype.get_search_regex = function(a) {
            return new RegExp((this.search_contains ? "" : "^") + a, "i")
        };
        a.prototype.search_string_match = function(a, e) {
            var b, g, c, d;
            if (e.test(a)) return !0;
            if (this.enable_split_word_search && (0 <= a.indexOf(" ") || 0 === a.indexOf("[")) && (g = a.replace(/\[|\]/g, "").split(" "), g.length))
                for (c = 0, d = g.length; c < d; c++)
                    if (b = g[c], e.test(b)) return !0
        };
        a.prototype.choices_count = function() {
            var a, e, b, g;
            if (null != this.selected_option_count) return this.selected_option_count;
            this.selected_option_count = 0;
            g = this.form_field.options;
            e = 0;
            for (b = g.length; e < b; e++) a = g[e], a.selected && (this.selected_option_count += 1);
            return this.selected_option_count
        };
        a.prototype.choices_click = function(a) {
            a.preventDefault();
            if (!this.results_showing && !this.is_disabled) return this.results_show()
        };
        a.prototype.keyup_checker = function(a) {
            var e, b;
            e = null != (b = a.which) ? b : a.keyCode;
            this.search_field_scale();
            switch (e) {
                case 8:
                    if (this.is_multiple && 1 > this.backstroke_length && 0 < this.choices_count()) return this.keydown_backstroke();
                    if (!this.pending_backstroke) return this.result_clear_highlight(), this.results_search();
                    break;
                case 13:
                    a.preventDefault();
                    if (this.results_showing) return this.result_select(a);
                    break;
                case 27:
                    return this.results_showing && this.results_hide(), !0;
                case 9:
                case 38:
                case 40:
                case 16:
                case 91:
                case 17:
                case 18:
                    break;
                default:
                    return this.results_search()
            }
        };
        a.prototype.clipboard_event_checker = function(a) {
            var e = this;
            return setTimeout(function() {
                return e.results_search()
            }, 50)
        };
        a.prototype.container_width = function() {
            return null !=
                this.options.width ? this.options.width : "" + this.form_field.offsetWidth + "px"
        };
        a.prototype.include_option_in_results = function(a) {
            return this.is_multiple && !this.display_selected_options && a.selected || !this.display_disabled_options && a.disabled || a.empty ? !1 : !0
        };
        a.prototype.search_results_touchstart = function(a) {
            this.touch_started = !0;
            return this.search_results_mouseover(a)
        };
        a.prototype.search_results_touchmove = function(a) {
            this.touch_started = !1;
            return this.search_results_mouseout(a)
        };
        a.prototype.search_results_touchend =
            function(a) {
                if (this.touch_started) return this.search_results_mouseup(a)
            };
        a.prototype.outerHTML = function(a) {
            var e;
            if (a.outerHTML) return a.outerHTML;
            e = document.createElement("div");
            e.appendChild(a);
            return e.innerHTML
        };
        a.browser_is_supported = function() {
            return /iP(od|hone)/i.test(window.navigator.userAgent) || /Android/i.test(window.navigator.userAgent) && /Mobile/i.test(window.navigator.userAgent) || /IEMobile/i.test(window.navigator.userAgent) || /Windows Phone/i.test(window.navigator.userAgent) || /BlackBerry/i.test(window.navigator.userAgent) ||
                /BB10/i.test(window.navigator.userAgent) ? !1 : "Microsoft Internet Explorer" === window.navigator.appName ? 8 <= document.documentMode : !0
        };
        a.default_multiple_text = "Select Some Options";
        a.default_single_text = "Select an Option";
        a.default_no_result_text = "No results match";
        return a
    }();
    a = jQuery;
    a.fn.extend({
        chosen: function(b) {
            return c.browser_is_supported() ? this.each(function(g) {
                var e;
                g = a(this);
                e = g.data("chosen");
                "destroy" === b ? e instanceof d && e.destroy() : e instanceof d || g.data("chosen", new d(this, b))
            }) : this
        }
    });
    d = function(g) {
        function c() {
            return f = c.__super__.constructor.apply(this, arguments)
        }
        l(c, g);
        c.prototype.setup = function() {
            this.form_field_jq = a(this.form_field);
            this.current_selectedIndex = this.form_field.selectedIndex;
            return this.is_rtl = this.form_field_jq.hasClass("chosen-rtl")
        };
        c.prototype.set_up_html = function() {
            var e;
            e = ["chosen-container"];
            e.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
            this.inherit_select_classes && this.form_field.className && e.push(this.form_field.className);
            this.is_rtl &&
                e.push("chosen-rtl");
            e = {
                "class": e.join(" "),
                style: "width: " + this.container_width() + ";",
                title: this.form_field.title
            };
            this.form_field.id.length && (e.id = this.form_field.id.replace(/[^\w]/g, "_") + "_chosen");
            this.container = a("\x3cdiv /\x3e", e);
            this.is_multiple ? this.container.html('\x3cul class\x3d"chosen-choices"\x3e\x3cli class\x3d"search-field"\x3e\x3cinput type\x3d"text" value\x3d"' + this.default_text + '" class\x3d"default" autocomplete\x3d"off" style\x3d"width:25px;" /\x3e\x3c/li\x3e\x3c/ul\x3e\x3cdiv class\x3d"chosen-drop"\x3e\x3cul class\x3d"chosen-results"\x3e\x3c/ul\x3e\x3c/div\x3e') :
                this.container.html('\x3ca class\x3d"chosen-single chosen-default"\x3e\x3cspan\x3e' + this.default_text + '\x3c/span\x3e\x3cdiv\x3e\x3cb\x3e\x3c/b\x3e\x3c/div\x3e\x3c/a\x3e\x3cdiv class\x3d"chosen-drop"\x3e\x3cdiv class\x3d"chosen-search"\x3e\x3cinput type\x3d"text" autocomplete\x3d"off" /\x3e\x3c/div\x3e\x3cul class\x3d"chosen-results"\x3e\x3c/ul\x3e\x3c/div\x3e');
            this.form_field_jq.hide().after(this.container);
            this.dropdown = this.container.find("div.chosen-drop").first();
            this.search_field = this.container.find("input").first();
            this.search_results = this.container.find("ul.chosen-results").first();
            this.search_field_scale();
            this.search_no_results = this.container.find("li.no-results").first();
            this.is_multiple ? (this.search_choices = this.container.find("ul.chosen-choices").first(), this.search_container = this.container.find("li.search-field").first()) : (this.search_container = this.container.find("div.chosen-search").first(), this.selected_item = this.container.find(".chosen-single").first());
            this.results_build();
            this.set_tab_index();
            return this.set_label_behavior()
        };
        c.prototype.on_ready = function() {
            return this.form_field_jq.trigger("chosen:ready", {
                chosen: this
            })
        };
        c.prototype.register_observers = function() {
            var a = this;
            this.container.bind("touchstart.chosen", function(b) {
                a.container_mousedown(b);
                return b.preventDefault()
            });
            this.container.bind("touchend.chosen", function(b) {
                a.container_mouseup(b);
                return b.preventDefault()
            });
            this.container.bind("mousedown.chosen", function(b) {
                a.container_mousedown(b)
            });
            this.container.bind("mouseup.chosen", function(b) {
                a.container_mouseup(b)
            });
            this.container.bind("mouseenter.chosen", function(b) {
                a.mouse_enter(b)
            });
            this.container.bind("mouseleave.chosen", function(b) {
                a.mouse_leave(b)
            });
            this.search_results.bind("mouseup.chosen", function(b) {
                a.search_results_mouseup(b)
            });
            this.search_results.bind("mouseover.chosen", function(b) {
                a.search_results_mouseover(b)
            });
            this.search_results.bind("mouseout.chosen", function(b) {
                a.search_results_mouseout(b)
            });
            this.search_results.bind("mousewheel.chosen DOMMouseScroll.chosen", function(b) {
                a.search_results_mousewheel(b)
            });
            this.search_results.bind("touchstart.chosen", function(b) {
                a.search_results_touchstart(b)
            });
            this.search_results.bind("touchmove.chosen", function(b) {
                a.search_results_touchmove(b)
            });
            this.search_results.bind("touchend.chosen", function(b) {
                a.search_results_touchend(b)
            });
            this.form_field_jq.bind("chosen:updated.chosen", function(b) {
                a.results_update_field(b)
            });
            this.form_field_jq.bind("chosen:activate.chosen", function(b) {
                a.activate_field(b)
            });
            this.form_field_jq.bind("chosen:open.chosen", function(b) {
                a.container_mousedown(b)
            });
            this.form_field_jq.bind("chosen:close.chosen", function(b) {
                a.input_blur(b)
            });
            this.search_field.bind("blur.chosen", function(b) {
                a.input_blur(b)
            });
            this.search_field.bind("keyup.chosen", function(b) {
                a.keyup_checker(b)
            });
            this.search_field.bind("keydown.chosen", function(b) {
                a.keydown_checker(b)
            });
            this.search_field.bind("focus.chosen", function(b) {
                a.input_focus(b)
            });
            this.search_field.bind("cut.chosen", function(b) {
                a.clipboard_event_checker(b)
            });
            this.search_field.bind("paste.chosen", function(b) {
                a.clipboard_event_checker(b)
            });
            return this.is_multiple ? this.search_choices.bind("click.chosen", function(b) {
                a.choices_click(b)
            }) : this.container.bind("click.chosen", function(a) {
                a.preventDefault()
            })
        };
        c.prototype.destroy = function() {
            a(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
            this.search_field[0].tabIndex && (this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex);
            this.container.remove();
            this.form_field_jq.removeData("chosen");
            return this.form_field_jq.show()
        };
        c.prototype.search_field_disabled =
            function() {
                if (this.is_disabled = this.form_field_jq[0].disabled) return this.container.addClass("chosen-disabled"), this.search_field[0].disabled = !0, this.is_multiple || this.selected_item.unbind("focus.chosen", this.activate_action), this.close_field();
                this.container.removeClass("chosen-disabled");
                this.search_field[0].disabled = !1;
                if (!this.is_multiple) return this.selected_item.bind("focus.chosen", this.activate_action)
            };
        c.prototype.container_mousedown = function(b) {
            if (!this.is_disabled && (b && "mousedown" === b.type &&
                    !this.results_showing && b.preventDefault(), null == b || !a(b.target).hasClass("search-choice-close"))) return this.active_field ? this.is_multiple || !b || a(b.target)[0] !== this.selected_item[0] && !a(b.target).parents("a.chosen-single").length || (b.preventDefault(), this.results_toggle()) : (this.is_multiple && this.search_field.val(""), a(this.container[0].ownerDocument).bind("click.chosen", this.click_test_action), this.results_show()), this.activate_field()
        };
        c.prototype.container_mouseup = function(a) {
            if ("ABBR" === a.target.nodeName &&
                !this.is_disabled) return this.results_reset(a)
        };
        c.prototype.search_results_mousewheel = function(a) {
            var b;
            a.originalEvent && (b = a.originalEvent.deltaY || -a.originalEvent.wheelDelta || a.originalEvent.detail);
            if (null != b) return a.preventDefault(), "DOMMouseScroll" === a.type && (b *= 40), this.search_results.scrollTop(b + this.search_results.scrollTop())
        };
        c.prototype.blur_test = function(a) {
            if (!this.active_field && this.container.hasClass("chosen-container-active")) return this.close_field()
        };
        c.prototype.close_field = function() {
            a(this.container[0].ownerDocument).unbind("click.chosen",
                this.click_test_action);
            this.active_field = !1;
            this.results_hide();
            this.container.removeClass("chosen-container-active");
            this.clear_backstroke();
            this.show_search_field_default();
            return this.search_field_scale()
        };
        c.prototype.activate_field = function() {
            this.container.addClass("chosen-container-active");
            this.active_field = !0;
            this.search_field.val(this.search_field.val());
            return this.search_field.focus()
        };
        c.prototype.test_active_click = function(b) {
            b = a(b.target).closest(".chosen-container");
            return b.length &&
                this.container[0] === b[0] ? this.active_field = !0 : this.close_field()
        };
        c.prototype.results_build = function() {
            this.parsing = !0;
            this.selected_option_count = null;
            this.results_data = b.select_to_array(this.form_field);
            this.is_multiple ? this.search_choices.find("li.search-choice").remove() : this.is_multiple || (this.single_set_selected_text(), this.disable_search || this.form_field.options.length <= this.disable_search_threshold ? (this.search_field[0].readOnly = !0, this.container.addClass("chosen-container-single-nosearch")) :
                (this.search_field[0].readOnly = !1, this.container.removeClass("chosen-container-single-nosearch")));
            this.update_results_content(this.results_option_build({
                first: !0
            }));
            this.search_field_disabled();
            this.show_search_field_default();
            this.search_field_scale();
            return this.parsing = !1
        };
        c.prototype.result_do_highlight = function(a) {
            var b, c, g, d;
            if (a.length) {
                this.result_clear_highlight();
                this.result_highlight = a;
                this.result_highlight.addClass("highlighted");
                c = parseInt(this.search_results.css("maxHeight"), 10);
                d =
                    this.search_results.scrollTop();
                g = c + d;
                b = this.result_highlight.position().top + this.search_results.scrollTop();
                a = b + this.result_highlight.outerHeight();
                if (a >= g) return this.search_results.scrollTop(0 < a - c ? a - c : 0);
                if (b < d) return this.search_results.scrollTop(b)
            }
        };
        c.prototype.result_clear_highlight = function() {
            this.result_highlight && this.result_highlight.removeClass("highlighted");
            return this.result_highlight = null
        };
        c.prototype.results_show = function() {
            if (this.is_multiple && this.max_selected_options <= this.choices_count()) return this.form_field_jq.trigger("chosen:maxselected", {
                chosen: this
            }), !1;
            this.container.addClass("chosen-with-drop");
            this.results_showing = !0;
            this.search_field.focus();
            this.search_field.val(this.search_field.val());
            this.winnow_results();
            return this.form_field_jq.trigger("chosen:showing_dropdown", {
                chosen: this
            })
        };
        c.prototype.update_results_content = function(a) {
            return this.search_results.html(a)
        };
        c.prototype.results_hide = function() {
            this.results_showing && (this.result_clear_highlight(), this.container.removeClass("chosen-with-drop"), this.form_field_jq.trigger("chosen:hiding_dropdown", {
                chosen: this
            }));
            return this.results_showing = !1
        };
        c.prototype.set_tab_index = function(a) {
            if (this.form_field.tabIndex) return a = this.form_field.tabIndex, this.form_field.tabIndex = -1, this.search_field[0].tabIndex = a
        };
        c.prototype.set_label_behavior = function() {
            var b = this;
            this.form_field_label = this.form_field_jq.parents("label");
            !this.form_field_label.length && this.form_field.id.length && (this.form_field_label = a("label[for\x3d'" + this.form_field.id + "']"));
            if (0 < this.form_field_label.length) return this.form_field_label.bind("click.chosen",
                function(a) {
                    return b.is_multiple ? b.container_mousedown(a) : b.activate_field()
                })
        };
        c.prototype.show_search_field_default = function() {
            if (this.is_multiple && 1 > this.choices_count() && !this.active_field) return this.search_field.val(this.default_text), this.search_field.addClass("default");
            this.search_field.val("");
            return this.search_field.removeClass("default")
        };
        c.prototype.search_results_mouseup = function(b) {
            var c;
            c = a(b.target).hasClass("active-result") ? a(b.target) : a(b.target).parents(".active-result").first();
            if (c.length) return this.result_highlight = c, this.result_select(b), this.search_field.focus()
        };
        c.prototype.search_results_mouseover = function(b) {
            if (b = a(b.target).hasClass("active-result") ? a(b.target) : a(b.target).parents(".active-result").first()) return this.result_do_highlight(b)
        };
        c.prototype.search_results_mouseout = function(b) {
            if (a(b.target).hasClass("active-result")) return this.result_clear_highlight()
        };
        c.prototype.choice_build = function(b) {
            var c, g = this;
            c = a("\x3cli /\x3e", {
                "class": "search-choice"
            }).html("\x3cspan\x3e" +
                this.choice_label(b) + "\x3c/span\x3e");
            b.disabled ? c.addClass("search-choice-disabled") : (b = a("\x3ca /\x3e", {
                "class": "search-choice-close",
                "data-option-array-index": b.array_index
            }), b.bind("click.chosen", function(a) {
                return g.choice_destroy_link_click(a)
            }), c.append(b));
            return this.search_container.before(c)
        };
        c.prototype.choice_destroy_link_click = function(b) {
            b.preventDefault();
            b.stopPropagation();
            if (!this.is_disabled) return this.choice_destroy(a(b.target))
        };
        c.prototype.choice_destroy = function(a) {
            if (this.result_deselect(a[0].getAttribute("data-option-array-index"))) return this.show_search_field_default(),
                this.is_multiple && 0 < this.choices_count() && 1 > this.search_field.val().length && this.results_hide(), a.parents("li").first().remove(), this.search_field_scale()
        };
        c.prototype.results_reset = function() {
            this.reset_single_select_options();
            this.form_field.options[0].selected = !0;
            this.single_set_selected_text();
            this.show_search_field_default();
            this.results_reset_cleanup();
            this.form_field_jq.trigger("change");
            if (this.active_field) return this.results_hide()
        };
        c.prototype.results_reset_cleanup = function() {
            this.current_selectedIndex =
                this.form_field.selectedIndex;
            return this.selected_item.find("abbr").remove()
        };
        c.prototype.result_select = function(a) {
            var b;
            if (this.result_highlight) {
                b = this.result_highlight;
                this.result_clear_highlight();
                if (this.is_multiple && this.max_selected_options <= this.choices_count()) return this.form_field_jq.trigger("chosen:maxselected", {
                    chosen: this
                }), !1;
                this.is_multiple ? b.removeClass("active-result") : this.reset_single_select_options();
                b.addClass("result-selected");
                b = this.results_data[b[0].getAttribute("data-option-array-index")];
                b.selected = !0;
                this.form_field.options[b.options_index].selected = !0;
                this.selected_option_count = null;
                this.is_multiple ? this.choice_build(b) : this.single_set_selected_text(this.choice_label(b));
                (a.metaKey || a.ctrlKey) && this.is_multiple || this.results_hide();
                this.show_search_field_default();
                (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) && this.form_field_jq.trigger("change", {
                    selected: this.form_field.options[b.options_index].value
                });
                this.current_selectedIndex = this.form_field.selectedIndex;
                a.preventDefault();
                return this.search_field_scale()
            }
        };
        c.prototype.single_set_selected_text = function(a) {
            null == a && (a = this.default_text);
            a === this.default_text ? this.selected_item.addClass("chosen-default") : (this.single_deselect_control_build(), this.selected_item.removeClass("chosen-default"));
            return this.selected_item.find("span").html(a)
        };
        c.prototype.result_deselect = function(a) {
            a = this.results_data[a];
            if (this.form_field.options[a.options_index].disabled) return !1;
            a.selected = !1;
            this.form_field.options[a.options_index].selected = !1;
            this.selected_option_count = null;
            this.result_clear_highlight();
            this.results_showing && this.winnow_results();
            this.form_field_jq.trigger("change", {
                deselected: this.form_field.options[a.options_index].value
            });
            this.search_field_scale();
            return !0
        };
        c.prototype.single_deselect_control_build = function() {
            if (this.allow_single_deselect) return this.selected_item.find("abbr").length || this.selected_item.find("span").first().after('\x3cabbr class\x3d"search-choice-close"\x3e\x3c/abbr\x3e'), this.selected_item.addClass("chosen-single-with-deselect")
        };
        c.prototype.get_search_text = function() {
            return a("\x3cdiv/\x3e").text(a.trim(this.search_field.val())).html()
        };
        c.prototype.winnow_results_set_highlight = function() {
            var a;
            a = this.is_multiple ? [] : this.search_results.find(".result-selected.active-result");
            a = a.length ? a.first() : this.search_results.find(".active-result").first();
            if (null != a) return this.result_do_highlight(a)
        };
        c.prototype.no_results = function(b) {
            var c;
            c = a('\x3cli class\x3d"no-results"\x3e' + this.results_none_found + ' "\x3cspan\x3e\x3c/span\x3e"\x3c/li\x3e');
            c.find("span").first().html(b);
            this.search_results.append(c);
            return this.form_field_jq.trigger("chosen:no_results", {
                chosen: this
            })
        };
        c.prototype.no_results_clear = function() {
            return this.search_results.find(".no-results").remove()
        };
        c.prototype.keydown_arrow = function() {
            var a;
            if (this.results_showing && this.result_highlight) {
                if (a = this.result_highlight.nextAll("li.active-result").first()) return this.result_do_highlight(a)
            } else return this.results_show()
        };
        c.prototype.keyup_arrow = function() {
            var a;
            if (!this.results_showing &&
                !this.is_multiple) return this.results_show();
            if (this.result_highlight) {
                a = this.result_highlight.prevAll("li.active-result");
                if (a.length) return this.result_do_highlight(a.first());
                0 < this.choices_count() && this.results_hide();
                return this.result_clear_highlight()
            }
        };
        c.prototype.keydown_backstroke = function() {
            var a;
            if (this.pending_backstroke) return this.choice_destroy(this.pending_backstroke.find("a").first()), this.clear_backstroke();
            a = this.search_container.siblings("li.search-choice").last();
            if (a.length &&
                !a.hasClass("search-choice-disabled")) return this.pending_backstroke = a, this.single_backstroke_delete ? this.keydown_backstroke() : this.pending_backstroke.addClass("search-choice-focus")
        };
        c.prototype.clear_backstroke = function() {
            this.pending_backstroke && this.pending_backstroke.removeClass("search-choice-focus");
            return this.pending_backstroke = null
        };
        c.prototype.keydown_checker = function(a) {
            var b, c;
            b = null != (c = a.which) ? c : a.keyCode;
            this.search_field_scale();
            8 !== b && this.pending_backstroke && this.clear_backstroke();
            switch (b) {
                case 8:
                    this.backstroke_length = this.search_field.val().length;
                    break;
                case 9:
                    this.results_showing && !this.is_multiple && this.result_select(a);
                    this.mouse_on_container = !1;
                    break;
                case 13:
                    this.results_showing && a.preventDefault();
                    break;
                case 32:
                    this.disable_search && a.preventDefault();
                    break;
                case 38:
                    a.preventDefault();
                    this.keyup_arrow();
                    break;
                case 40:
                    a.preventDefault(), this.keydown_arrow()
            }
        };
        c.prototype.search_field_scale = function() {
            var b, c, g, d, h;
            if (this.is_multiple) {
                b = "position:absolute; left: -1000px; top: -1000px; display:none;";
                g = "font-size font-style font-weight font-family line-height text-transform letter-spacing".split(" ");
                d = 0;
                for (h = g.length; d < h; d++) c = g[d], b += c + ":" + this.search_field.css(c) + ";";
                b = a("\x3cdiv /\x3e", {
                    style: b
                });
                b.text(this.search_field.val());
                a("body").append(b);
                c = b.width() + 25;
                b.remove();
                b = this.container.outerWidth();
                c > b - 10 && (c = b - 10);
                return this.search_field.css({
                    width: c + "px"
                })
            }
        };
        return c
    }(c)
}).call(this);
"use strict";
(function(a) {
    "function" === typeof define && define.amd ? define(["jquery"], a) : "object" === typeof exports ? module.exports = a(require("jquery")) : a(jQuery || Zepto)
})(function(a) {
    var c = function(b, c, d) {
        var f = {
            invalid: [],
            getCaret: function() {
                try {
                    var a, c = 0,
                        d = b.get(0),
                        e = document.selection,
                        k = d.selectionStart;
                    if (e && -1 === navigator.appVersion.indexOf("MSIE 10")) a = e.createRange(), a.moveStart("character", -f.val().length), c = a.text.length;
                    else if (k || "0" === k) c = k;
                    return c
                } catch (v) {}
            },
            setCaret: function(a) {
                try {
                    if (b.is(":focus")) {
                        var c;
                        c = b.get(0).createTextRange();
                        c.collapse(!0);
                        c.moveEnd("character", a);
                        c.moveStart("character", a);
                        c.select()
                    }
                } catch (d) {}
            },
            events: function() {
                b.on("keydown.mask", function(a) {
                    b.data("mask-keycode", a.keyCode || a.which)
                }).on(a.jMaskGlobals.useInput ? "input.mask" : "keyup.mask", f.behaviour).on("paste.mask drop.mask", function() {
                    setTimeout(function() {
                        b.keydown().keyup()
                    }, 100)
                }).on("change.mask", function() {
                    b.data("changed", !0)
                }).on("blur.mask", function() {
                    m === f.val() || b.data("changed") || b.trigger("change");
                    b.data("changed", !1)
                }).on("blur.mask", function() {
                    m = f.val()
                }).on("focus.mask", function(b) {
                    !0 === d.selectOnFocus && a(b.target).select()
                }).on("focusout.mask", function() {
                    d.clearIfNotMatch && !w.test(f.val()) && f.val("")
                })
            },
            getRegexMask: function() {
                for (var a = [], b, d, g, k, v = 0; v < c.length; v++)(b = e.translation[c.charAt(v)]) ? (d = b.pattern.toString().replace(/.{1}$|^.{1}/g, ""), g = b.optional, (b = b.recursive) ? (a.push(c.charAt(v)), k = {
                    digit: c.charAt(v),
                    pattern: d
                }) : a.push(g || b ? d + "?" : d)) : a.push(c.charAt(v).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$\x26"));
                a = a.join("");
                k && (a = a.replace(new RegExp("(" + k.digit + "(.*" + k.digit + ")?)"), "($1)?").replace(new RegExp(k.digit, "g"), k.pattern));
                return new RegExp(a)
            },
            destroyEvents: function() {
                b.off("input keydown keyup paste drop blur focusout ".split(" ").join(".mask "))
            },
            val: function(a) {
                var c = b.is("input") ? "val" : "text";
                if (0 < arguments.length) {
                    if (b[c]() !== a) b[c](a);
                    c = b
                } else c = b[c]();
                return c
            },
            getMCharsBeforeCount: function(a, b) {
                for (var d = 0, g = 0, k = c.length; g < k && g < a; g++) e.translation[c.charAt(g)] || (a = b ? a + 1 : a, d++);
                return d
            },
            caretPos: function(a, b, d, g) {
                return e.translation[c.charAt(Math.min(a - 1, c.length - 1))] ? Math.min(a + d - b - g, d) : f.caretPos(a + 1, b, d, g)
            },
            behaviour: function(c) {
                c = c || window.event;
                f.invalid = [];
                var d = b.data("mask-keycode");
                if (-1 === a.inArray(d, e.byPassKeys)) {
                    var h = f.getCaret(),
                        l = f.val().length,
                        k = f.getMasked(),
                        v = k.length,
                        C = f.getMCharsBeforeCount(v - 1) - f.getMCharsBeforeCount(l - 1),
                        y = h < l;
                    f.val(k);
                    y && (8 !== d && 46 !== d && (h = f.caretPos(h, l, v, C)), f.setCaret(h));
                    return f.callbacks(c)
                }
            },
            getMasked: function(a) {
                var b = [],
                    g = f.val(),
                    r = 0,
                    k = c.length,
                    v = 0,
                    C = g.length,
                    y = 1,
                    J = "push",
                    n = -1,
                    V, w;
                d.reverse ? (J = "unshift", y = -1, V = 0, r = k - 1, v = C - 1, w = function() {
                    return -1 < r && -1 < v
                }) : (V = k - 1, w = function() {
                    return r < k && v < C
                });
                for (; w();) {
                    var x = c.charAt(r),
                        m = g.charAt(v),
                        t = e.translation[x];
                    if (t) m.match(t.pattern) ? (b[J](m), t.recursive && (-1 === n ? n = r : r === V && (r = n - y), V === n && (r -= y)), r += y) : t.optional ? (r += y, v -= y) : t.fallback ? (b[J](t.fallback), r += y, v -= y) : f.invalid.push({
                        p: v,
                        v: m,
                        e: t.pattern
                    }), v += y;
                    else {
                        if (!a) b[J](x);
                        m === x && (v += y);
                        r += y
                    }
                }
                a = c.charAt(V);
                k !== C + 1 || e.translation[a] ||
                    b.push(a);
                return b.join("")
            },
            callbacks: function(a) {
                var e = f.val(),
                    u = e !== m,
                    r = [e, a, b, d],
                    k = function(a, b, k) {
                        "function" === typeof d[a] && b && d[a].apply(this, k)
                    };
                k("onChange", !0 === u, r);
                k("onKeyPress", !0 === u, r);
                k("onComplete", e.length === c.length, r);
                k("onInvalid", 0 < f.invalid.length, [e, a, b, f.invalid, d])
            }
        };
        b = a(b);
        var e = this,
            m = f.val(),
            w;
        c = "function" === typeof c ? c(f.val(), void 0, b, d) : c;
        e.mask = c;
        e.options = d;
        e.remove = function() {
            var a = f.getCaret();
            f.destroyEvents();
            f.val(e.getCleanVal());
            f.setCaret(a - f.getMCharsBeforeCount(a));
            return b
        };
        e.getCleanVal = function() {
            return f.getMasked(!0)
        };
        e.init = function(c) {
            c = c || !1;
            d = d || {};
            e.clearIfNotMatch = a.jMaskGlobals.clearIfNotMatch;
            e.byPassKeys = a.jMaskGlobals.byPassKeys;
            e.translation = a.extend({}, a.jMaskGlobals.translation, d.translation);
            e = a.extend(!0, {}, e, d);
            w = f.getRegexMask();
            !1 === c ? (d.placeholder && b.attr("placeholder", d.placeholder), b.data("mask") && b.attr("autocomplete", "off"), f.destroyEvents(), f.events(), c = f.getCaret(), f.val(f.getMasked()), f.setCaret(c + f.getMCharsBeforeCount(c, !0))) :
                (f.events(), f.val(f.getMasked()))
        };
        e.init(!b.is("input"))
    };
    a.maskWatchers = {};
    var d = function() {
            var d = a(this),
                f = {},
                h = d.attr("data-mask");
            d.attr("data-mask-reverse") && (f.reverse = !0);
            d.attr("data-mask-clearifnotmatch") && (f.clearIfNotMatch = !0);
            "true" === d.attr("data-mask-selectonfocus") && (f.selectOnFocus = !0);
            if (b(d, h, f)) return d.data("mask", new c(this, h, f))
        },
        b = function(b, c, d) {
            d = d || {};
            var f = a(b).data("mask"),
                e = JSON.stringify;
            b = a(b).val() || a(b).text();
            try {
                return "function" === typeof c && (c = c(b)), "object" !==
                    typeof f || e(f.options) !== e(d) || f.mask !== c
            } catch (m) {}
        };
    a.fn.mask = function(d, f) {
        f = f || {};
        var h = this.selector,
            q = a.jMaskGlobals,
            e = a.jMaskGlobals.watchInterval,
            m = function() {
                if (b(this, d, f)) return a(this).data("mask", new c(this, d, f))
            };
        a(this).each(m);
        h && "" !== h && q.watchInputs && (clearInterval(a.maskWatchers[h]), a.maskWatchers[h] = setInterval(function() {
            a(document).find(h).each(m)
        }, e));
        return this
    };
    a.fn.unmask = function() {
        clearInterval(a.maskWatchers[this.selector]);
        delete a.maskWatchers[this.selector];
        return this.each(function() {
            var b =
                a(this).data("mask");
            b && b.remove().removeData("mask")
        })
    };
    a.fn.cleanVal = function() {
        return this.data("mask").getCleanVal()
    };
    a.applyDataMask = function(b) {
        b = b || a.jMaskGlobals.maskElements;
        (b instanceof a ? b : a(b)).filter(a.jMaskGlobals.dataMaskAttr).each(d)
    };
    var f = {
        maskElements: "input,td,span,div",
        dataMaskAttr: "*[data-mask]",
        dataMask: !0,
        watchInterval: 300,
        watchInputs: !0,
        useInput: function(a) {
            var b = document.createElement("div");
            a = "on" + a;
            var c = a in b;
            c || (b.setAttribute(a, "return;"), c = "function" === typeof b[a]);
            return c
        }("input"),
        watchDataMask: !1,
        byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
        translation: {
            0: {
                pattern: /\d/
            },
            9: {
                pattern: /\d/,
                optional: !0
            },
            "#": {
                pattern: /\d/,
                recursive: !0
            },
            A: {
                pattern: /[a-zA-Z0-9]/
            },
            S: {
                pattern: /[a-zA-Z]/
            }
        }
    };
    a.jMaskGlobals = a.jMaskGlobals || {};
    f = a.jMaskGlobals = a.extend(!0, {}, f, a.jMaskGlobals);
    f.dataMask && a.applyDataMask();
    setInterval(function() {
        a.jMaskGlobals.watchDataMask && a.applyDataMask()
    }, f.watchInterval)
});
(function(a) {
    "function" === typeof define && define.amd ? define(["jquery"], a) : "object" === typeof module && module.exports ? a(require("jquery")) : a(jQuery)
})(function(a) {
    function c(b) {
        var c = {},
            d = /^jQuery\d+$/;
        a.each(b.attributes, function(a, b) {
            b.specified && !d.test(b.name) && (c[b.name] = b.value)
        });
        return c
    }

    function d(b, c) {
        var d = a(this);
        if (this.value === d.attr("placeholder") && d.hasClass(m.customClass))
            if (this.value = "", d.removeClass(m.customClass), d.data("placeholder-password")) {
                d = d.hide().nextAll('input[type\x3d"password"]:first').show().attr("id",
                    d.removeAttr("id").data("placeholder-id"));
                if (!0 === b) return d[0].value = c;
                d.focus()
            } else this == f() && this.select()
    }

    function b(b) {
        var f, e = a(this),
            g = this.id;
        if (!b || "blur" !== b.type || !e.hasClass(m.customClass))
            if ("" === this.value) {
                if ("password" === this.type) {
                    if (!e.data("placeholder-textinput")) {
                        try {
                            f = e.clone().prop({
                                type: "text"
                            })
                        } catch (h) {
                            f = a("\x3cinput\x3e").attr(a.extend(c(this), {
                                type: "text"
                            }))
                        }
                        f.removeAttr("name").data({
                            "placeholder-enabled": !0,
                            "placeholder-password": e,
                            "placeholder-id": g
                        }).bind("focus.placeholder",
                            d);
                        e.data({
                            "placeholder-textinput": f,
                            "placeholder-id": g
                        }).before(f)
                    }
                    this.value = "";
                    e = e.removeAttr("id").hide().prevAll('input[type\x3d"text"]:first').attr("id", e.data("placeholder-id")).show()
                } else if (b = e.data("placeholder-password")) b[0].value = "", e.attr("id", e.data("placeholder-id")).show().nextAll('input[type\x3d"password"]:last').hide().removeAttr("id");
                e.addClass(m.customClass);
                e[0].value = e.attr("placeholder")
            } else e.removeClass(m.customClass)
    }

    function f() {
        try {
            return document.activeElement
        } catch (a) {}
    }
    var g = "[object OperaMini]" === Object.prototype.toString.call(window.operamini),
        l = "placeholder" in document.createElement("input") && !g && !0,
        g = "placeholder" in document.createElement("textarea") && !g && !0,
        h = a.valHooks,
        q = a.propHooks,
        e, m = {};
    l && g ? (e = a.fn.placeholder = function() {
        return this
    }, e.input = !0, e.textarea = !0) : (e = a.fn.placeholder = function(c) {
        m = a.extend({}, {
            customClass: "placeholder"
        }, c);
        return this.filter((l ? "textarea" : ":input") + "[placeholder]").not("." + m.customClass).not(":radio, :checkbox, [type\x3dhidden]").bind({
            "focus.placeholder": d,
            "blur.placeholder": b
        }).data("placeholder-enabled", !0).trigger("blur.placeholder")
    }, e.input = l, e.textarea = g, e = {
        get: function(b) {
            var c = a(b),
                d = c.data("placeholder-password");
            return d ? d[0].value : c.data("placeholder-enabled") && c.hasClass(m.customClass) ? "" : b.value
        },
        set: function(c, e) {
            var g = a(c),
                h, l;
            "" !== e && (h = g.data("placeholder-textinput"), l = g.data("placeholder-password"), h ? (d.call(h[0], !0, e) || (c.value = e), h[0].value = e) : l && (d.call(c, !0, e) || (l[0].value = e), c.value = e));
            if (!g.data("placeholder-enabled")) return c.value =
                e, g;
            "" === e ? (c.value = e, c != f() && b.call(c)) : (g.hasClass(m.customClass) && d.call(c), c.value = e);
            return g
        }
    }, l || (h.input = e, q.value = e), g || (h.textarea = e, q.value = e), a(function() {
        a(document).delegate("form", "submit.placeholder", function() {
            var c = a("." + m.customClass, this).each(function() {
                d.call(this, !0, "")
            });
            setTimeout(function() {
                c.each(b)
            }, 10)
        })
    }), a(window).bind("beforeunload.placeholder", function() {
        var b = !0;
        try {
            "javascript:void(0)" === document.activeElement.toString() && (b = !1)
        } catch (c) {}
        b && a("." + m.customClass).each(function() {
            this.value =
                ""
        })
    }))
});
(function(a) {
    function c(a, b) {
        if (8 == e) {
            var k = u.width(),
                c = h.debounce(function() {
                    var a = u.width();
                    k != a && (k = a, b())
                }, 1);
            u.on(a, c)
        } else u.on(a, h.debounce(b, 1))
    }

    function d(b) {
        b = b[0].parentElement;
        do
            if ("visible" != window.getComputedStyle(b).getPropertyValue("overflow")) break;
        while (b = b.parentElement);
        return b == document.body ? a([]) : a(b)
    }

    function b(a) {
        window && window.console && window.console.error && window.console.error("jQuery.floatThead: " + a)
    }

    function f() {
        var b = a('\x3cdiv style\x3d"width:50px;height:50px;overflow-y:scroll;position:absolute;top:-200px;left:-200px;"\x3e\x3cdiv style\x3d"height:100px;width:100%"\x3e\x3c/div\x3e');
        a("body").append(b);
        var k = b.innerWidth(),
            c = a("div", b).innerWidth();
        b.remove();
        return k - c
    }

    function g(a) {
        if (a.dataTableSettings)
            for (var b = 0; b < a.dataTableSettings.length; b++)
                if (a[0] == a.dataTableSettings[b].nTable) return !0;
        return !1
    }

    function l(a, b, k) {
        var c = k ? "outerWidth" : "width";
        if (A && a.css("max-width")) {
            c = 0;
            k && (c += parseInt(a.css("borderLeft"), 10), c += parseInt(a.css("borderRight"), 10));
            for (a = 0; a < b.length; a++) c += b.get(a).offsetWidth;
            return c
        }
        return a[c]()
    }
    a.floatThead = a.floatThead || {};
    a.floatThead.defaults = {
        headerCellSelector: "tr:visible:first\x3e*:visible",
        zIndex: 1001,
        position: "auto",
        top: 0,
        bottom: 0,
        scrollContainer: function(b) {
            return a([])
        },
        responsiveContainer: function(b) {
            return a([])
        },
        getSizingRow: function(a, b, k) {
            return a.find("tbody tr:visible:first\x3e*:visible")
        },
        floatTableClass: "floatThead-table",
        floatWrapperClass: "floatThead-wrapper",
        floatContainerClass: "floatThead-container",
        copyTableClass: !0,
        enableAria: !1,
        autoReflow: !1,
        debug: !1,
        support: {
            bootstrap: !0,
            datatables: !0,
            jqueryUI: !0,
            perfectScrollbar: !0
        }
    };
    var h = window._,
        q = "undefined" !== typeof MutationObserver,
        e = function() {
            for (var a = 3, b = document.createElement("b"), k = b.all || []; a = 1 + a, b.innerHTML = "\x3c!--[if gt IE " + a + "]\x3e\x3ci\x3e\x3c![endif]--\x3e", k[0];);
            return 4 < a ? a : document.documentMode
        }(),
        m = /Gecko\//.test(navigator.userAgent),
        w = /WebKit\//.test(navigator.userAgent);
    e || m || w || (e = 11);
    var A = function() {
            if (w) {
                var b = a('\x3cdiv style\x3d"width:0px"\x3e\x3ctable style\x3d"max-width:100%"\x3e\x3ctr\x3e\x3cth\x3e\x3cdiv style\x3d"min-width:100px;"\x3eX\x3c/div\x3e\x3c/th\x3e\x3c/tr\x3e\x3c/table\x3e\x3c/div\x3e');
                a("body").append(b);
                var k = 0 == b.find("table").width();
                b.remove();
                return k
            }
            return !1
        },
        F = !m && !e,
        u = a(window);
    if (!window.matchMedia) {
        var r = window.onbeforeprint,
            k = window.onafterprint;
        window.onbeforeprint = function() {
            r && r();
            u.triggerHandler("beforeprint")
        };
        window.onafterprint = function() {
            k && k();
            u.triggerHandler("afterprint")
        }
    }
    a.fn.floatThead = function(k) {
        k = k || {};
        if (!h && (h = window._ || a.floatThead._, !h)) throw Error("jquery.floatThead-slim.js requires underscore. You should use the non-lite version since you do not have underscore.");
        if (8 > e) return this;
        var C = null;
        h.isFunction(A) && (A = A());
        if (h.isString(k)) {
            var y = k,
                J = this;
            this.filter("table").each(function() {
                var b = a(this),
                    k = b.data("floatThead-lazy");
                k && b.floatThead(k);
                (b = b.data("floatThead-attached")) && h.isFunction(b[y]) && (b = b[y](), "undefined" !== typeof b && (J = b))
            });
            return J
        }
        var n = a.extend({}, a.floatThead.defaults || {}, k);
        a.each(k, function(k, v) {
            k in a.floatThead.defaults || !n.debug || b("Used [" + k + "] key to init plugin, but that param is not an option for the plugin. Valid options are: " +
                h.keys(a.floatThead.defaults).join(", "))
        });
        n.debug && (k = a.fn.jquery.split("."), 1 == parseInt(k[0], 10) && 7 >= parseInt(k[1], 10) && b("jQuery version " + a.fn.jquery + " detected! This plugin supports 1.8 or better, or 1.7.x with jQuery UI 1.8.24 -\x3e http://jqueryui.com/resources/download/jquery-ui-1.8.24.zip"));
        this.filter(":not(." + n.floatTableClass + ")").each(function() {
            function k(a) {
                return a + ".fth-" + ta + ".floatTHead"
            }

            function v() {
                var b = 0;
                O.children("tr:visible").each(function() {
                    b += a(this).outerHeight(!0)
                });
                if ("collapse" == p.css("border-collapse")) {
                    var k = parseInt(p.css("border-top-width"), 10),
                        c = parseInt(p.find("thead tr:first").find("\x3e*:first").css("border-top-width"), 10);
                    k > c && (b -= k / 2)
                }
                ba.outerHeight(b);
                ua.outerHeight(b)
            }

            function y() {
                P = (h.isFunction(n.top) ? n.top(p) : n.top) || 0;
                va = (h.isFunction(n.bottom) ? n.bottom(p) : n.bottom) || 0
            }

            function J() {
                var b, k = O.find(n.headerCellSelector);
                ca ? b = M.find("col").length : (b = 0, k.each(function() {
                    b += parseInt(a(this).attr("colspan") || 1, 10)
                }));
                if (b != wa) {
                    wa = b;
                    for (var v = [], c = [], d = [], e, f = 0; f < b; f++) n.enableAria && (e = k.eq(f).text()) ? v.push('\x3cth scope\x3d"col" class\x3d"floatThead-col"\x3e' + e + "\x3c/th\x3e") : v.push('\x3cth class\x3d"floatThead-col"/\x3e'), c.push("\x3ccol/\x3e"), d.push("\x3cfthtd style\x3d'display:table-cell;height:0;width:auto;'/\x3e");
                    c = c.join("");
                    v = v.join("");
                    F && (d = d.join(""), ia.html(d), Q = ia.find("fthtd"));
                    ba.html(v);
                    ua = ba.find("th");
                    ca || M.html(c);
                    W = M.find("col");
                    ja.html(c);
                    xa = ja.find("col")
                }
                return b
            }

            function t() {
                if (!X) {
                    X = !0;
                    if (D) {
                        var a = l(p, Q, !0),
                            b = da.width();
                        a > b && p.css("minWidth", a)
                    }
                    p.css(ya);
                    G.css(ya);
                    G.append(O);
                    za.before(Y);
                    v()
                }
            }

            function r() {
                X && (X = !1, D && p.width(Ha), Y.detach(), p.prepend(O), p.css(Z), G.css(Z), p.css("minWidth", Aa), p.css("minWidth", l(p, Q)))
            }

            function m(a) {
                Ba != a && (Ba = a, p.triggerHandler("floatThead", [a, E]))
            }

            function A(a) {
                D != a && (D = a, E.css({
                    position: D ? "absolute" : "fixed"
                }))
            }

            function ka() {
                var a, b = J();
                return function() {
                    var k = E.scrollLeft();
                    W = M.find("col");
                    var c;
                    c = W;
                    c = F ? Q : e ? n.getSizingRow(p, c, Q) : c;
                    if (c.length == b && 0 < b) {
                        if (!ca)
                            for (a = 0; a < b; a++) W.eq(a).css("width",
                                "");
                        r();
                        var d = [];
                        for (a = 0; a < b; a++) {
                            var f = d,
                                C = a,
                                g = c.get(a).getBoundingClientRect();
                            f[C] = g.width || g.right - g.left
                        }
                        for (a = 0; a < b; a++) xa.eq(a).width(d[a]), W.eq(a).width(d[a]);
                        t()
                    } else G.append(O), p.css(Z), G.css(Z), v();
                    E.scrollLeft(k);
                    p.triggerHandler("reflowed", [E])
                }
            }

            function Da(a) {
                a = B.css("border-" + a + "-width");
                var b = 0;
                a && ~a.indexOf("px") && (b = parseInt(a, 10));
                return b
            }

            function la() {
                return "auto" == K.css("overflow-x")
            }

            function ma() {
                var a = B.scrollTop(),
                    b, k = 0,
                    v = ea ? fa.outerHeight(!0) : 0,
                    c = ga ? v : -v,
                    d = E.height(),
                    e =
                    p.offset(),
                    f = 0,
                    C = 0;
                if (H) {
                    var g = B.offset(),
                        k = e.top - g.top + a;
                    ea && ga && (k += v);
                    f = Da("left");
                    C = Da("top");
                    k -= C
                } else b = e.top - P - d + va + R.horizontal;
                var y = u.scrollTop(),
                    h = u.scrollLeft(),
                    n = (la() ? K : B).scrollLeft();
                return function(g) {
                    aa = la();
                    var J = 0 >= p[0].offsetWidth && 0 >= p[0].offsetHeight;
                    if (!J && ha) return ha = !1, setTimeout(function() {
                        p.triggerHandler("reflow")
                    }, 1), null;
                    if (J && (ha = !0, !D)) return null;
                    if ("windowScroll" == g) y = u.scrollTop(), h = u.scrollLeft();
                    else if ("containerScroll" == g)
                        if (K.length) {
                            if (!aa) return;
                            n = K.scrollLeft()
                        } else a =
                            B.scrollTop(), n = B.scrollLeft();
                    else "init" != g && (y = u.scrollTop(), h = u.scrollLeft(), a = B.scrollTop(), n = (aa ? K : B).scrollLeft());
                    if (!w || !(0 > y || 0 > h)) {
                        if (Ea) "windowScrollDone" == g ? A(!0) : A(!1);
                        else if ("windowScrollDone" == g) return null;
                        e = p.offset();
                        ea && ga && (e.top += v);
                        var l, q;
                        g = p.outerHeight();
                        H && D ? (k >= a ? (l = k - a + C, l = 0 < l ? l : 0, m(!1)) : (l = na ? C : a, m(!0)), q = f) : !H && D ? (y > b + g + c ? l = g - d + c : e.top >= y + P ? (l = 0, r(), m(!1)) : (l = P + y - e.top + k + (ga ? v : 0), t(), m(!0)), q = n) : H && !D ? (k > a || a - k > g ? (l = e.top - y, r(), m(!1)) : (l = e.top + a - y - k, t(), m(!0)), q = e.left +
                            n - h) : H || D || (y > b + g + c ? l = g + P - y + b + c : e.top > y + P ? (l = e.top - y, t(), m(!1)) : (l = P, m(!0)), q = e.left + n - h);
                        return {
                            top: l,
                            left: q
                        }
                    }
                }
            }

            function Fa() {
                var a = null,
                    b = null,
                    k = null;
                return function(c, d, e) {
                    null == c || a == c.top && b == c.left || (E.css({
                        top: c.top,
                        left: c.left
                    }), a = c.top, b = c.left);
                    if (d) {
                        c = l(p, Q, !0);
                        d = aa ? K : B;
                        var f = d.width() || c;
                        d = "hidden" != d.css("overflow-y") ? f - R.vertical : f;
                        E.width(d);
                        H ? G.css("width", 100 * c / d + "%") : G.outerWidth(c)
                    }
                    e && v();
                    e = (aa ? K : B).scrollLeft();
                    D && k == e || (E.scrollLeft(e), k = e)
                }
            }

            function oa() {
                if (B.length)
                    if (n.support &&
                        n.support.perfectScrollbar && B.data().perfectScrollbar) R = {
                        horizontal: 0,
                        vertical: 0
                    };
                    else {
                        if ("scroll" == B.css("overflow-x")) R.horizontal = T;
                        else {
                            var a = B.width(),
                                b = l(p, Q);
                            R.horizontal = a - (k < v ? T : 0) < b ? T : 0
                        }
                        if ("scroll" == B.css("overflow-y")) R.vertical = T;
                        else {
                            var k = B.height(),
                                v = p.height();
                            R.vertical = k - (a < b ? T : 0) < v ? T : 0
                        }
                    }
            }
            var ta = h.uniqueId(),
                p = a(this);
            if (p.data("floatThead-attached")) return !0;
            if (!p.is("table")) throw Error('jQuery.floatThead must be run on a table element. ex: $("table").floatThead();');
            q = n.autoReflow &&
                q;
            var O = p.children("thead:first"),
                za = p.children("tbody:first");
            if (0 == O.length || 0 == za.length) p.data("floatThead-lazy", n), p.unbind("reflow").one("reflow", function() {
                p.floatThead(n)
            });
            else {
                p.data("floatThead-lazy") && p.unbind("reflow");
                p.data("floatThead-lazy", !1);
                var X = !0,
                    P, va, R = {
                        vertical: 0,
                        horizontal: 0
                    },
                    T = f(),
                    wa = 0;
                !0 === n.scrollContainer && (n.scrollContainer = d);
                var B = n.scrollContainer(p) || a([]),
                    H = 0 < B.length,
                    K = H ? a([]) : n.responsiveContainer(p) || a([]),
                    aa = la(),
                    D = null;
                "undefined" !== typeof n.useAbsolutePositioning &&
                    (n.position = "auto", n.useAbsolutePositioning && (n.position = n.useAbsolutePositioning ? "absolute" : "fixed"), b("option 'useAbsolutePositioning' has been removed in v1.3.0, use `position:'" + n.position + "'` instead. See docs for more info: http://mkoryak.github.io/floatThead/#options"));
                "undefined" !== typeof n.scrollingTop && (n.top = n.scrollingTop, b("option 'scrollingTop' has been renamed to 'top' in v1.3.0. See docs for more info: http://mkoryak.github.io/floatThead/#options"));
                "undefined" !== typeof n.scrollingBottom &&
                    (n.bottom = n.scrollingBottom, b("option 'scrollingBottom' has been renamed to 'bottom' in v1.3.0. See docs for more info: http://mkoryak.github.io/floatThead/#options"));
                "auto" == n.position ? D = null : "fixed" == n.position ? D = !1 : "absolute" == n.position ? D = !0 : n.debug && b('Invalid value given to "position" option, valid is "fixed", "absolute" and "auto". You passed: ', n.position);
                null == D && (D = H);
                var fa = p.find("caption"),
                    ea = 1 == fa.length;
                if (ea) var ga = "top" === (fa.css("caption-side") || fa.attr("align") || "top");
                var pa =
                    a('\x3cfthfoot style\x3d"display:table-footer-group;border-spacing:0;height:0;border-collapse:collapse;visibility:hidden"/\x3e'),
                    na = !1,
                    da = a([]),
                    Ea = 9 >= e && !H && D,
                    G = a("\x3ctable/\x3e"),
                    ja = a("\x3ccolgroup/\x3e"),
                    M = p.children("colgroup:first"),
                    ca = !0;
                0 == M.length && (M = a("\x3ccolgroup/\x3e"), ca = !1);
                var ia = a('\x3cfthtr style\x3d"display:table-row;border-spacing:0;height:0;border-collapse:collapse"/\x3e'),
                    E = a('\x3cdiv style\x3d"overflow: hidden;" aria-hidden\x3d"true"\x3e\x3c/div\x3e'),
                    ha = !1,
                    Y = a("\x3cthead/\x3e"),
                    ba = a('\x3ctr class\x3d"size-row"/\x3e'),
                    ua = a([]),
                    W = a([]),
                    xa = a([]),
                    Q = a([]);
                Y.append(ba);
                p.prepend(M);
                F && (pa.append(ia), p.append(pa));
                G.append(ja);
                E.append(G);
                n.copyTableClass && G.attr("class", p.attr("class"));
                G.attr({
                    cellpadding: p.attr("cellpadding"),
                    cellspacing: p.attr("cellspacing"),
                    border: p.attr("border")
                });
                var I = p.css("display");
                G.css({
                    borderCollapse: p.css("borderCollapse"),
                    border: p.css("border"),
                    display: I
                });
                H || G.css("width", "auto");
                "none" == I && (ha = !0);
                G.addClass(n.floatTableClass).css({
                    margin: 0,
                    "border-bottom-width": 0
                });
                D ? (I = function(a, b) {
                    var k = a.css("position"),
                        v = a;
                    if ("relative" != k && "absolute" != k || b) k = {
                        paddingLeft: a.css("paddingLeft"),
                        paddingRight: a.css("paddingRight")
                    }, E.css(k), v = a.data("floatThead-containerWrap") || a.wrap("\x3cdiv class\x3d'" + n.floatWrapperClass + "' style\x3d'position: relative; clear:both;'\x3e\x3c/div\x3e").parent(), a.data("floatThead-containerWrap", v), na = !0;
                    return v
                }, H ? (da = I(B, !0), da.prepend(E)) : (da = I(p), p.before(E))) : p.before(E);
                E.css({
                    position: D ? "absolute" : "fixed",
                    marginTop: 0,
                    top: D ? 0 : "auto",
                    zIndex: n.zIndex
                });
                E.addClass(n.floatContainerClass);
                y();
                var ya = {
                        "table-layout": "fixed"
                    },
                    Z = {
                        "table-layout": p.css("tableLayout") || "auto"
                    },
                    Ha = p[0].style.width || "",
                    Aa = p.css("minWidth") || "",
                    Ba = !1;
                oa();
                var U;
                U = ka();
                U();
                var N = ma(),
                    S = Fa();
                S(N("init"), !0);
                var Ia = h.debounce(function() {
                        S(N("windowScrollDone"), !1)
                    }, 1),
                    I = function() {
                        S(N("windowScroll"), !1);
                        Ea && Ia()
                    },
                    qa = function() {
                        S(N("containerScroll"), !1)
                    },
                    L = h.debounce(function() {
                        p.is(":hidden") || (oa(), y(), U = ka(), U(), N = ma(), S(N("reflow"), !0))
                    }, 1),
                    ra = function() {
                        p.floatThead("destroy", [!0])
                    },
                    sa = function() {
                        p.floatThead(n)
                    },
                    Ga = function(a) {
                        a.matches ? ra() : sa()
                    };
                window.matchMedia ? window.matchMedia("print").addListener(Ga) : (u.on("beforeprint", ra), u.on("afterprint", sa));
                if (H)
                    if (D) B.on(k("scroll"), qa);
                    else B.on(k("scroll"), qa), u.on(k("scroll"), I);
                else K.on(k("scroll"), qa), u.on(k("scroll"), I);
                u.on(k("load"), L);
                c(k("resize"), function() {
                    p.is(":hidden") || (y(), oa(), U = ka(), U(), N = ma(), S = Fa(), S(N("resize"), !0, !0))
                });
                p.on("reflow", L);
                if (n.support &&
                    n.support.datatables && g(p)) p.on("filter", L).on("sort", L).on("page", L);
                if (n.support && n.support.bootstrap) u.on(k("shown.bs.tab"), L);
                if (n.support && n.support.jqueryUI) u.on(k("tabsactivate"), L);
                q && (I = null, h.isFunction(n.autoReflow) && (I = n.autoReflow(p, B)), I || (I = B.length ? B[0] : p[0]), C = new MutationObserver(function(a) {
                    for (var b = function(a) {
                            return a && a[0] && ("THEAD" == a[0].nodeName || "TD" == a[0].nodeName || "TH" == a[0].nodeName)
                        }, k = 0; k < a.length; k++)
                        if (!b(a[k].addedNodes) && !b(a[k].removedNodes)) {
                            L();
                            break
                        }
                }), C.observe(I, {
                    childList: !0,
                    subtree: !0
                }));
                p.data("floatThead-attached", {
                    destroy: function(a, b) {
                        var k = ".fth-" + ta;
                        r();
                        p.css(Z);
                        M.remove();
                        F && pa.remove();
                        Y.parent().length && Y.replaceWith(O);
                        m(!1);
                        q && (C.disconnect(), C = null);
                        p.off("reflow reflowed");
                        B.off(k);
                        K.off(k);
                        na && (B.length ? B.unwrap() : p.unwrap());
                        H ? B.data("floatThead-containerWrap", !1) : p.data("floatThead-containerWrap", !1);
                        p.css("minWidth", Aa);
                        E.remove();
                        p.data("floatThead-attached", !1);
                        u.off(k);
                        b || (window.matchMedia && window.matchMedia("print").removeListener(Ga),
                            ra = sa = function() {})
                    },
                    reflow: function() {
                        L()
                    },
                    setHeaderHeight: function() {
                        v()
                    },
                    getFloatContainer: function() {
                        return E
                    },
                    getRowGroups: function() {
                        return X ? E.find("\x3etable\x3ethead").add(p.children("tbody,tfoot")) : p.children("thead,tbody,tfoot")
                    }
                })
            }
        });
        return this
    }
})(jQuery);
(function(a) {
    a.floatThead = a.floatThead || {};
    a.floatThead._ = window._ || function() {
        var c = {},
            d = Object.prototype.hasOwnProperty;
        c.has = function(a, b) {
            return d.call(a, b)
        };
        c.keys = function(a) {
            if (a !== Object(a)) throw new TypeError("Invalid object");
            var b = [],
                d;
            for (d in a) c.has(a, d) && b.push(d);
            return b
        };
        var b = 0;
        c.uniqueId = function(a) {
            var c = ++b + "";
            return a ? a + c : c
        };
        a.each("Arguments Function String Number Date RegExp".split(" "), function() {
            var a = this;
            c["is" + a] = function(b) {
                return Object.prototype.toString.call(b) ==
                    "[object " + a + "]"
            }
        });
        c.debounce = function(a, b, c) {
            var d, q, e, m, w;
            return function() {
                e = this;
                q = arguments;
                m = new Date;
                var A = function() {
                        var u = new Date - m;
                        u < b ? d = setTimeout(A, b - u) : (d = null, c || (w = a.apply(e, q)))
                    },
                    F = c && !d;
                d || (d = setTimeout(A, b));
                F && (w = a.apply(e, q));
                return w
            }
        };
        return c
    }()
})(jQuery);
(function(a, c) {
    "undefined" !== typeof module && module.exports ? module.exports = c(require("jquery")) : "function" === typeof define && define.amd ? define(["jquery"], function(a) {
        return c(a)
    }) : c(a.jQuery)
})(this, function(a) {
    var c = function(b, c) {
        this.$element = a(b);
        this.options = a.extend({}, a.fn.typeahead.defaults, c);
        this.matcher = this.options.matcher || this.matcher;
        this.sorter = this.options.sorter || this.sorter;
        this.select = this.options.select || this.select;
        this.autoSelect = "boolean" == typeof this.options.autoSelect ? this.options.autoSelect :
            !0;
        this.highlighter = this.options.highlighter || this.highlighter;
        this.render = this.options.render || this.render;
        this.updater = this.options.updater || this.updater;
        this.displayText = this.options.displayText || this.displayText;
        this.source = this.options.source;
        this.delay = this.options.delay;
        this.$menu = a(this.options.menu);
        this.$appendTo = this.options.appendTo ? a(this.options.appendTo) : null;
        this.shown = !1;
        this.listen();
        this.showHintOnFocus = "boolean" == typeof this.options.showHintOnFocus ? this.options.showHintOnFocus :
            !1;
        this.afterSelect = this.options.afterSelect;
        this.addItem = !1
    };
    c.prototype = {
        constructor: c,
        select: function() {
            var a = this.$menu.find(".active").data("value");
            this.$element.data("active", a);
            if (this.autoSelect || a) a = this.updater(a), this.$element.val(this.displayText(a) || a).change(), this.afterSelect(a);
            return this.hide()
        },
        updater: function(a) {
            return a
        },
        setSource: function(a) {
            this.source = a
        },
        show: function() {
            var b = a.extend({}, this.$element.position(), {
                    height: this.$element[0].offsetHeight
                }),
                c;
            c = "function" == typeof this.options.scrollHeight ?
                this.options.scrollHeight.call() : this.options.scrollHeight;
            (this.$appendTo ? this.$menu.appendTo(this.$appendTo) : this.$menu.insertAfter(this.$element)).css({
                top: b.top + b.height + c,
                left: b.left
            }).show();
            this.shown = !0;
            return this
        },
        hide: function() {
            this.$menu.hide();
            this.shown = !1;
            return this
        },
        lookup: function(b) {
            this.query = "undefined" != typeof b && null !== b ? b : this.$element.val() || "";
            if (this.query.length < this.options.minLength) return this.shown ? this.hide() : this;
            b = a.proxy(function() {
                a.isFunction(this.source) ? this.source(this.query,
                    a.proxy(this.process, this)) : this.source && this.process(this.source)
            }, this);
            clearTimeout(this.lookupWorker);
            this.lookupWorker = setTimeout(b, this.delay)
        },
        process: function(b) {
            var c = this;
            b = a.grep(b, function(a) {
                return c.matcher(a)
            });
            b = this.sorter(b);
            if (!b.length && !this.options.addItem) return this.shown ? this.hide() : this;
            0 < b.length ? this.$element.data("active", b[0]) : this.$element.data("active", null);
            this.options.addItem && b.push(this.options.addItem);
            return "all" == this.options.items ? this.render(b).show() : this.render(b.slice(0,
                this.options.items)).show()
        },
        matcher: function(a) {
            return ~this.displayText(a).toLowerCase().indexOf(this.query.toLowerCase())
        },
        sorter: function(a) {
            for (var c = [], d = [], l = [], h; h = a.shift();) {
                var q = this.displayText(h);
                q.toLowerCase().indexOf(this.query.toLowerCase()) ? ~q.indexOf(this.query) ? d.push(h) : l.push(h) : c.push(h)
            }
            return c.concat(d, l)
        },
        highlighter: function(b) {
            var c = a("\x3cdiv\x3e\x3c/div\x3e"),
                d = this.query,
                l = b.toLowerCase().indexOf(d.toLowerCase()),
                h, q, e;
            h = d.length;
            if (0 === h) return c.text(b).html();
            for (; - 1 <
                l;) q = b.substr(0, l), e = b.substr(l, h), b = b.substr(l + h), e = a("\x3cstrong\x3e\x3c/strong\x3e").text(e), c.append(document.createTextNode(q)).append(e), l = b.toLowerCase().indexOf(d.toLowerCase());
            return c.append(document.createTextNode(b)).html()
        },
        render: function(b) {
            var c = this,
                d = this,
                l = !1;
            b = a(b).map(function(b, q) {
                var e = d.displayText(q);
                b = a(c.options.item).data("value", q);
                b.find("a").html(c.highlighter(e));
                e == d.$element.val() && (b.addClass("active"), d.$element.data("active", q), l = !0);
                return b[0]
            });
            this.autoSelect &&
                !l && (b.first().addClass("active"), this.$element.data("active", b.first().data("value")));
            this.$menu.html(b);
            return this
        },
        displayText: function(a) {
            return a.name || a
        },
        next: function(b) {
            b = this.$menu.find(".active").removeClass("active").next();
            b.length || (b = a(this.$menu.find("li")[0]));
            b.addClass("active")
        },
        prev: function(a) {
            a = this.$menu.find(".active").removeClass("active").prev();
            a.length || (a = this.$menu.find("li").last());
            a.addClass("active")
        },
        listen: function() {
            this.$element.on("focus", a.proxy(this.focus,
                this)).on("blur", a.proxy(this.blur, this)).on("keypress", a.proxy(this.keypress, this)).on("keyup", a.proxy(this.keyup, this));
            if (this.eventSupported("keydown")) this.$element.on("keydown", a.proxy(this.keydown, this));
            this.$menu.on("click", a.proxy(this.click, this)).on("mouseenter", "li", a.proxy(this.mouseenter, this)).on("mouseleave", "li", a.proxy(this.mouseleave, this))
        },
        destroy: function() {
            this.$element.data("typeahead", null);
            this.$element.data("active", null);
            this.$element.off("focus").off("blur").off("keypress").off("keyup");
            this.eventSupported("keydown") && this.$element.off("keydown");
            this.$menu.remove()
        },
        eventSupported: function(a) {
            var c = a in this.$element;
            c || (this.$element.setAttribute(a, "return;"), c = "function" === typeof this.$element[a]);
            return c
        },
        move: function(a) {
            if (this.shown) {
                switch (a.keyCode) {
                    case 9:
                    case 13:
                    case 27:
                        a.preventDefault();
                        break;
                    case 38:
                        if (a.shiftKey) return;
                        a.preventDefault();
                        this.prev();
                        break;
                    case 40:
                        if (a.shiftKey) return;
                        a.preventDefault();
                        this.next()
                }
                a.stopPropagation()
            }
        },
        keydown: function(b) {
            this.suppressKeyPressRepeat = ~a.inArray(b.keyCode, [40, 38, 9, 13, 27]);
            this.shown || 40 != b.keyCode ? this.move(b) : this.lookup()
        },
        keypress: function(a) {
            this.suppressKeyPressRepeat || this.move(a)
        },
        keyup: function(a) {
            switch (a.keyCode) {
                case 40:
                case 38:
                case 16:
                case 17:
                case 18:
                    break;
                case 9:
                case 13:
                    if (!this.shown) return;
                    this.select();
                    break;
                case 27:
                    if (!this.shown) return;
                    this.hide();
                    break;
                default:
                    this.lookup()
            }
            a.stopPropagation();
            a.preventDefault()
        },
        focus: function(a) {
            this.focused || (this.focused = !0, this.options.showHintOnFocus && this.lookup(""))
        },
        blur: function(a) {
            this.focused = !1;
            !this.mousedover && this.shown && this.hide()
        },
        click: function(a) {
            a.stopPropagation();
            a.preventDefault();
            this.select();
            this.$element.focus()
        },
        mouseenter: function(b) {
            this.mousedover = !0;
            this.$menu.find(".active").removeClass("active");
            a(b.currentTarget).addClass("active")
        },
        mouseleave: function(a) {
            this.mousedover = !1;
            !this.focused && this.shown && this.hide()
        }
    };
    var d = a.fn.typeahead;
    a.fn.typeahead = function(b) {
        var d = arguments;
        return "string" == typeof b && "getActive" == b ? this.data("active") :
            this.each(function() {
                var g = a(this),
                    l = g.data("typeahead"),
                    h = "object" == typeof b && b;
                l || g.data("typeahead", l = new c(this, h));
                if ("string" == typeof b)
                    if (1 < d.length) l[b].apply(l, Array.prototype.slice.call(d, 1));
                    else l[b]()
            })
    };
    a.fn.typeahead.defaults = {
        source: [],
        items: 8,
        menu: '\x3cul class\x3d"typeahead dropdown-menu" role\x3d"listbox"\x3e\x3c/ul\x3e',
        item: '\x3cli\x3e\x3ca href\x3d"#" role\x3d"option"\x3e\x3c/a\x3e\x3c/li\x3e',
        minLength: 1,
        scrollHeight: 0,
        autoSelect: !0,
        afterSelect: a.noop,
        addItem: !1,
        delay: 0
    };
    a.fn.typeahead.Constructor =
        c;
    a.fn.typeahead.noConflict = function() {
        a.fn.typeahead = d;
        return this
    };
    a(document).on("focus.typeahead.data-api", '[data-provide\x3d"typeahead"]', function(b) {
        b = a(this);
        b.data("typeahead") || b.typeahead(b.data())
    })
});
(function(a) {
    "function" === typeof define && define.amd ? define(["jquery"], a) : "object" === typeof exports ? a(require("jquery")) : a(jQuery)
})(function(a, c) {
    function d() {
        return new Date(Date.UTC.apply(Date, arguments))
    }

    function b() {
        var a = new Date;
        return d(a.getFullYear(), a.getMonth(), a.getDate())
    }

    function f(a) {
        return function() {
            return this[a].apply(this, arguments)
        }
    }

    function g(b, c) {
        function d(a, b) {
            return b.toLowerCase()
        }
        var e = a(b).data(),
            f = {},
            g, h = new RegExp("^" + c.toLowerCase() + "([A-Z])");
        c = new RegExp("^" + c.toLowerCase());
        for (var l in e) c.test(l) && (g = l.replace(h, d), f[g] = e[l]);
        return f
    }

    function l(b) {
        var c = {};
        if (!u[b] && (b = b.split("-")[0], !u[b])) return;
        var d = u[b];
        a.each(F, function(a, b) {
            b in d && (c[b] = d[b])
        });
        return c
    }
    var h = function() {
            var b = {
                get: function(a) {
                    return this.slice(a)[0]
                },
                contains: function(a) {
                    a = a && a.valueOf();
                    for (var b = 0, k = this.length; b < k; b++)
                        if (this[b].valueOf() === a) return b;
                    return -1
                },
                remove: function(a) {
                    this.splice(a, 1)
                },
                replace: function(b) {
                    b && (a.isArray(b) || (b = [b]), this.clear(), this.push.apply(this, b))
                },
                clear: function() {
                    this.length =
                        0
                },
                copy: function() {
                    var a = new h;
                    a.replace(this);
                    return a
                }
            };
            return function() {
                var c = [];
                c.push.apply(c, arguments);
                a.extend(c, b);
                return c
            }
        }(),
        q = function(b, c) {
            a(b).data("datepicker", this);
            this._process_options(c);
            this.dates = new h;
            this.viewDate = this.o.defaultViewDate;
            this.focusDate = null;
            this.element = a(b);
            this.isInline = !1;
            this.isInput = this.element.is("input");
            this.hasInput = (this.component = this.element.hasClass("date") ? this.element.find(".add-on, .input-group-addon, .btn") : !1) && this.element.find("input").length;
            this.component && 0 === this.component.length && (this.component = !1);
            this.picker = a(r.template);
            this._check_template(this.o.templates.leftArrow) && this.picker.find(".prev").html(this.o.templates.leftArrow);
            this._check_template(this.o.templates.rightArrow) && this.picker.find(".next").html(this.o.templates.rightArrow);
            this._buildEvents();
            this._attachEvents();
            this.isInline ? this.picker.addClass("datepicker-inline").appendTo(this.element) : this.picker.addClass("datepicker-dropdown dropdown-menu");
            this.o.rtl && this.picker.addClass("datepicker-rtl");
            this.viewMode = this.o.startView;
            this.o.calendarWeeks && this.picker.find("thead .datepicker-title, tfoot .today, tfoot .clear").attr("colspan", function(a, b) {
                return parseInt(b) + 1
            });
            this._allow_update = !1;
            this.setStartDate(this._o.startDate);
            this.setEndDate(this._o.endDate);
            this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);
            this.setDaysOfWeekHighlighted(this.o.daysOfWeekHighlighted);
            this.setDatesDisabled(this.o.datesDisabled);
            this.fillDow();
            this.fillMonths();
            this._allow_update = !0;
            this.update();
            this.showMode();
            this.isInline && this.show()
        };
    q.prototype = {
        constructor: q,
        _resolveViewName: function(a, b) {
            return 0 === a || "days" === a || "month" === a ? 0 : 1 === a || "months" === a || "year" === a ? 1 : 2 === a || "years" === a || "decade" === a ? 2 : 3 === a || "decades" === a || "century" === a ? 3 : 4 === a || "centuries" === a || "millennium" === a ? 4 : b === c ? !1 : b
        },
        _check_template: function(b) {
            try {
                return b === c || "" === b ? !1 : 0 >= (b.match(/[<>]/g) || []).length ? !0 : 0 < a(b).length
            } catch (v) {
                return !1
            }
        },
        _process_options: function(k) {
            this._o = a.extend({}, this._o, k);
            var c = this.o = a.extend({}, this._o);
            k = c.language;
            u[k] || (k = k.split("-")[0], u[k] || (k = A.language));
            c.language = k;
            c.startView = this._resolveViewName(c.startView, 0);
            c.minViewMode = this._resolveViewName(c.minViewMode, 0);
            c.maxViewMode = this._resolveViewName(c.maxViewMode, 4);
            c.startView = Math.min(c.startView, c.maxViewMode);
            c.startView = Math.max(c.startView, c.minViewMode);
            !0 !== c.multidate && (c.multidate = Number(c.multidate) || !1, !1 !== c.multidate && (c.multidate = Math.max(0, c.multidate)));
            c.multidateSeparator = String(c.multidateSeparator);
            c.weekStart %= 7;
            c.weekEnd = (c.weekStart + 6) % 7;
            var e = r.parseFormat(c.format); - Infinity !== c.startDate && (c.startDate = c.startDate ? c.startDate instanceof Date ? this._local_to_utc(this._zero_time(c.startDate)) : r.parseDate(c.startDate, e, c.language, c.assumeNearbyYear) : -Infinity);
            Infinity !== c.endDate && (c.endDate = c.endDate ? c.endDate instanceof Date ? this._local_to_utc(this._zero_time(c.endDate)) : r.parseDate(c.endDate, e, c.language, c.assumeNearbyYear) : Infinity);
            c.daysOfWeekDisabled = c.daysOfWeekDisabled || [];
            a.isArray(c.daysOfWeekDisabled) ||
                (c.daysOfWeekDisabled = c.daysOfWeekDisabled.split(/[,\s]*/));
            c.daysOfWeekDisabled = a.map(c.daysOfWeekDisabled, function(a) {
                return parseInt(a, 10)
            });
            c.daysOfWeekHighlighted = c.daysOfWeekHighlighted || [];
            a.isArray(c.daysOfWeekHighlighted) || (c.daysOfWeekHighlighted = c.daysOfWeekHighlighted.split(/[,\s]*/));
            c.daysOfWeekHighlighted = a.map(c.daysOfWeekHighlighted, function(a) {
                return parseInt(a, 10)
            });
            c.datesDisabled = c.datesDisabled || [];
            a.isArray(c.datesDisabled) || (k = [], k.push(r.parseDate(c.datesDisabled, e, c.language,
                c.assumeNearbyYear)), c.datesDisabled = k);
            c.datesDisabled = a.map(c.datesDisabled, function(a) {
                return r.parseDate(a, e, c.language, c.assumeNearbyYear)
            });
            k = String(c.orientation).toLowerCase().split(/\s+/g);
            var f = c.orientation.toLowerCase();
            k = a.grep(k, function(a) {
                return /^auto|left|right|top|bottom$/.test(a)
            });
            c.orientation = {
                x: "auto",
                y: "auto"
            };
            if (f && "auto" !== f)
                if (1 === k.length) switch (k[0]) {
                    case "top":
                    case "bottom":
                        c.orientation.y = k[0];
                        break;
                    case "left":
                    case "right":
                        c.orientation.x = k[0]
                } else f = a.grep(k, function(a) {
                        return /^left|right$/.test(a)
                    }),
                    c.orientation.x = f[0] || "auto", f = a.grep(k, function(a) {
                        return /^top|bottom$/.test(a)
                    }), c.orientation.y = f[0] || "auto";
            c.defaultViewDate ? (k = c.defaultViewDate.year || (new Date).getFullYear(), c.defaultViewDate = d(k, c.defaultViewDate.month || 0, c.defaultViewDate.day || 1)) : c.defaultViewDate = b()
        },
        _events: [],
        _secondaryEvents: [],
        _applyEvents: function(a) {
            for (var b = 0, d, e, f; b < a.length; b++) d = a[b][0], 2 === a[b].length ? (e = c, f = a[b][1]) : 3 === a[b].length && (e = a[b][1], f = a[b][2]), d.on(f, e)
        },
        _unapplyEvents: function(a) {
            for (var b = 0,
                    d, e, f; b < a.length; b++) d = a[b][0], 2 === a[b].length ? (f = c, e = a[b][1]) : 3 === a[b].length && (f = a[b][1], e = a[b][2]), d.off(e, f)
        },
        _buildEvents: function() {
            var b = {
                keyup: a.proxy(function(b) {
                    -1 === a.inArray(b.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) && this.update()
                }, this),
                keydown: a.proxy(this.keydown, this),
                paste: a.proxy(this.paste, this)
            };
            !0 === this.o.showOnFocus && (b.focus = a.proxy(this.show, this));
            this.isInput ? this._events = [
                [this.element, b]
            ] : this.component && this.hasInput ? this._events = [
                [this.element.find("input"), b],
                [this.component, {
                    click: a.proxy(this.show, this)
                }]
            ] : this.element.is("div") ? this.isInline = !0 : this._events = [
                [this.element, {
                    click: a.proxy(this.show, this)
                }]
            ];
            this._events.push([this.element, "*", {
                blur: a.proxy(function(a) {
                    this._focused_from = a.target
                }, this)
            }], [this.element, {
                blur: a.proxy(function(a) {
                    this._focused_from = a.target
                }, this)
            }]);
            this.o.immediateUpdates && this._events.push([this.element, {
                "changeYear changeMonth": a.proxy(function(a) {
                    this.update(a.date)
                }, this)
            }]);
            this._secondaryEvents = [
                [this.picker, {
                    click: a.proxy(this.click,
                        this)
                }],
                [a(window), {
                    resize: a.proxy(this.place, this)
                }],
                [a(document), {
                    mousedown: a.proxy(function(a) {
                        this.element.is(a.target) || this.element.find(a.target).length || this.picker.is(a.target) || this.picker.find(a.target).length || this.picker.hasClass("datepicker-inline") || this.hide()
                    }, this)
                }]
            ]
        },
        _attachEvents: function() {
            this._detachEvents();
            this._applyEvents(this._events)
        },
        _detachEvents: function() {
            this._unapplyEvents(this._events)
        },
        _attachSecondaryEvents: function() {
            this._detachSecondaryEvents();
            this._applyEvents(this._secondaryEvents)
        },
        _detachSecondaryEvents: function() {
            this._unapplyEvents(this._secondaryEvents)
        },
        _trigger: function(b, c) {
            var d = c || this.dates.get(-1),
                d = this._utc_to_local(d);
            this.element.trigger({
                type: b,
                date: d,
                dates: a.map(this.dates, this._utc_to_local),
                format: a.proxy(function(a, b) {
                    0 === arguments.length ? (a = this.dates.length - 1, b = this.o.format) : "string" === typeof a && (b = a, a = this.dates.length - 1);
                    b = b || this.o.format;
                    var c = this.dates.get(a);
                    return r.formatDate(c, b, this.o.language)
                }, this)
            })
        },
        show: function() {
            if (!(this.component ?
                    this.element.find("input") : this.element).attr("readonly") || !1 !== this.o.enableOnReadonly) return this.isInline || this.picker.appendTo(this.o.container), this.place(), this.picker.show(), this._attachSecondaryEvents(), this._trigger("show"), (window.navigator.msMaxTouchPoints || "ontouchstart" in document) && this.o.disableTouchKeyboard && a(this.element).blur(), this
        },
        hide: function() {
            if (this.isInline || !this.picker.is(":visible")) return this;
            this.focusDate = null;
            this.picker.hide().detach();
            this._detachSecondaryEvents();
            this.viewMode = this.o.startView;
            this.showMode();
            this.o.forceParse && (this.isInput && this.element.val() || this.hasInput && this.element.find("input").val()) && this.setValue();
            this._trigger("hide");
            return this
        },
        destroy: function() {
            this.hide();
            this._detachEvents();
            this._detachSecondaryEvents();
            this.picker.remove();
            delete this.element.data().datepicker;
            this.isInput || delete this.element.data().date;
            return this
        },
        paste: function(b) {
            var c;
            if (b.originalEvent.clipboardData && b.originalEvent.clipboardData.types && -1 !==
                a.inArray("text/plain", b.originalEvent.clipboardData.types)) c = b.originalEvent.clipboardData.getData("text/plain");
            else if (window.clipboardData) c = window.clipboardData.getData("Text");
            else return;
            this.setDate(c);
            this.update();
            b.preventDefault()
        },
        _utc_to_local: function(a) {
            return a && new Date(a.getTime() + 6E4 * a.getTimezoneOffset())
        },
        _local_to_utc: function(a) {
            return a && new Date(a.getTime() - 6E4 * a.getTimezoneOffset())
        },
        _zero_time: function(a) {
            return a && new Date(a.getFullYear(), a.getMonth(), a.getDate())
        },
        _zero_utc_time: function(a) {
            return a &&
                new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate()))
        },
        getDates: function() {
            return a.map(this.dates, this._utc_to_local)
        },
        getUTCDates: function() {
            return a.map(this.dates, function(a) {
                return new Date(a)
            })
        },
        getDate: function() {
            return this._utc_to_local(this.getUTCDate())
        },
        getUTCDate: function() {
            var a = this.dates.get(-1);
            return "undefined" !== typeof a ? new Date(a) : null
        },
        clearDates: function() {
            var a;
            this.isInput ? a = this.element : this.component && (a = this.element.find("input"));
            a && a.val("");
            this.update();
            this._trigger("changeDate");
            this.o.autoclose && this.hide()
        },
        setDates: function() {
            var b = a.isArray(arguments[0]) ? arguments[0] : arguments;
            this.update.apply(this, b);
            this._trigger("changeDate");
            this.setValue();
            return this
        },
        setUTCDates: function() {
            var b = a.isArray(arguments[0]) ? arguments[0] : arguments;
            this.update.apply(this, a.map(b, this._utc_to_local));
            this._trigger("changeDate");
            this.setValue();
            return this
        },
        setDate: f("setDates"),
        setUTCDate: f("setUTCDates"),
        remove: f("destroy"),
        setValue: function() {
            var a = this.getFormattedDate();
            this.isInput ? this.element.val(a) : this.component && this.element.find("input").val(a);
            return this
        },
        getFormattedDate: function(b) {
            b === c && (b = this.o.format);
            var d = this.o.language;
            return a.map(this.dates, function(a) {
                return r.formatDate(a, b, d)
            }).join(this.o.multidateSeparator)
        },
        getStartDate: function() {
            return this.o.startDate
        },
        setStartDate: function(a) {
            this._process_options({
                startDate: a
            });
            this.update();
            this.updateNavArrows();
            return this
        },
        getEndDate: function() {
            return this.o.endDate
        },
        setEndDate: function(a) {
            this._process_options({
                endDate: a
            });
            this.update();
            this.updateNavArrows();
            return this
        },
        setDaysOfWeekDisabled: function(a) {
            this._process_options({
                daysOfWeekDisabled: a
            });
            this.update();
            this.updateNavArrows();
            return this
        },
        setDaysOfWeekHighlighted: function(a) {
            this._process_options({
                daysOfWeekHighlighted: a
            });
            this.update();
            return this
        },
        setDatesDisabled: function(a) {
            this._process_options({
                datesDisabled: a
            });
            this.update();
            this.updateNavArrows()
        },
        place: function() {
            if (this.isInline) return this;
            var b = this.picker.outerWidth(),
                c = this.picker.outerHeight(),
                d = a(this.o.container),
                e = d.width(),
                f = "body" === this.o.container ? a(document).scrollTop() : d.scrollTop(),
                g = d.offset(),
                h = [];
            this.element.parents().each(function() {
                var b = a(this).css("z-index");
                "auto" !== b && 0 !== b && h.push(parseInt(b))
            });
            var d = Math.max.apply(Math, h) + this.o.zIndexOffset,
                l = this.component ? this.component.parent().offset() : this.element.offset(),
                q = this.component ? this.component.outerHeight(!0) : this.element.outerHeight(!1),
                r = this.component ? this.component.outerWidth(!0) : this.element.outerWidth(!1),
                t =
                l.left - g.left,
                g = l.top - g.top;
            "body" !== this.o.container && (g += f);
            this.picker.removeClass("datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left");
            "auto" !== this.o.orientation.x ? (this.picker.addClass("datepicker-orient-" + this.o.orientation.x), "right" === this.o.orientation.x && (t -= b - r)) : 0 > l.left ? (this.picker.addClass("datepicker-orient-left"), t -= l.left - 10) : t + b > e ? (this.picker.addClass("datepicker-orient-right"), t += r - b) : this.picker.addClass("datepicker-orient-left");
            b = this.o.orientation.y;
            "auto" === b && (b = 0 > -f + g - c ? "bottom" : "top");
            this.picker.addClass("datepicker-orient-" + b);
            g = "top" === b ? g - (c + parseInt(this.picker.css("padding-top"))) : g + q;
            this.o.rtl ? this.picker.css({
                top: g,
                right: e - (t + r),
                zIndex: d
            }) : this.picker.css({
                top: g,
                left: t,
                zIndex: d
            });
            return this
        },
        _allow_update: !0,
        update: function() {
            if (!this._allow_update) return this;
            var b = this.dates.copy(),
                c = [],
                d = !1;
            arguments.length ? (a.each(arguments, a.proxy(function(a, b) {
                    b instanceof Date && (b = this._local_to_utc(b));
                    c.push(b)
                },
                this)), d = !0) : (c = (c = this.isInput ? this.element.val() : this.element.data("date") || this.element.find("input").val()) && this.o.multidate ? c.split(this.o.multidateSeparator) : [c], delete this.element.data().date);
            c = a.map(c, a.proxy(function(a) {
                return r.parseDate(a, this.o.format, this.o.language, this.o.assumeNearbyYear)
            }, this));
            c = a.grep(c, a.proxy(function(a) {
                return !this.dateWithinRange(a) || !a
            }, this), !0);
            this.dates.replace(c);
            this.viewDate = this.dates.length ? new Date(this.dates.get(-1)) : this.viewDate < this.o.startDate ?
                new Date(this.o.startDate) : this.viewDate > this.o.endDate ? new Date(this.o.endDate) : this.o.defaultViewDate;
            d ? this.setValue() : c.length && String(b) !== String(this.dates) && this._trigger("changeDate");
            !this.dates.length && b.length && this._trigger("clearDate");
            this.fill();
            this.element.change();
            return this
        },
        fillDow: function() {
            var b = this.o.weekStart,
                c = "\x3ctr\x3e";
            this.o.calendarWeeks && (this.picker.find(".datepicker-days .datepicker-switch").attr("colspan", function(a, b) {
                return parseInt(b) + 1
            }), c += '\x3cth class\x3d"cw"\x3e\x26#160;\x3c/th\x3e');
            for (; b < this.o.weekStart + 7;) c += '\x3cth class\x3d"dow', -1 < a.inArray(b, this.o.daysOfWeekDisabled) && (c += " disabled"), c += '"\x3e' + u[this.o.language].daysMin[b++ % 7] + "\x3c/th\x3e";
            c += "\x3c/tr\x3e";
            this.picker.find(".datepicker-days thead").append(c)
        },
        fillMonths: function() {
            for (var a = this._utc_to_local(this.viewDate), b = "", c = 0; 12 > c;) var d = a && a.getMonth() === c ? " focused" : "",
                b = b + ('\x3cspan class\x3d"month' + d + '"\x3e' + u[this.o.language].monthsShort[c++] + "\x3c/span\x3e");
            this.picker.find(".datepicker-months td").html(b)
        },
        setRange: function(b) {
            b && b.length ? this.range = a.map(b, function(a) {
                return a.valueOf()
            }) : delete this.range;
            this.fill()
        },
        getClassNames: function(b) {
            var c = [],
                d = this.viewDate.getUTCFullYear(),
                e = this.viewDate.getUTCMonth(),
                f = new Date;
            b.getUTCFullYear() < d || b.getUTCFullYear() === d && b.getUTCMonth() < e ? c.push("old") : (b.getUTCFullYear() > d || b.getUTCFullYear() === d && b.getUTCMonth() > e) && c.push("new");
            this.focusDate && b.valueOf() === this.focusDate.valueOf() && c.push("focused");
            this.o.todayHighlight && b.getUTCFullYear() ===
                f.getFullYear() && b.getUTCMonth() === f.getMonth() && b.getUTCDate() === f.getDate() && c.push("today"); - 1 !== this.dates.contains(b) && c.push("active");
            this.dateWithinRange(b) && !this.dateIsDisabled(b) || c.push("disabled"); - 1 !== a.inArray(b.getUTCDay(), this.o.daysOfWeekHighlighted) && c.push("highlighted");
            this.range && (b > this.range[0] && b < this.range[this.range.length - 1] && c.push("range"), -1 !== a.inArray(b.valueOf(), this.range) && c.push("selected"), b.valueOf() === this.range[0] && c.push("range-start"), b.valueOf() === this.range[this.range.length -
                1] && c.push("range-end"));
            return c
        },
        _fill_yearsView: function(b, d, e, f, g, h, l, q) {
            var r, m, t, u, z;
            r = "";
            b = this.picker.find(b);
            g = parseInt(g / e, 10) * e;
            h = parseInt(h / f, 10) * f;
            e = parseInt(l / f, 10) * f;
            l = a.map(this.dates, function(a) {
                return parseInt(a.getUTCFullYear() / f, 10) * f
            });
            b.find(".datepicker-switch").text(g + "-" + (g + 9 * f));
            g -= f;
            for (m = -1; 11 > m; m += 1) t = [d], u = null, -1 === m ? t.push("old") : 10 === m && t.push("new"), -1 !== a.inArray(g, l) && t.push("active"), (g < h || g > e) && t.push("disabled"), g === this.viewDate.getFullYear() && t.push("focused"),
                q !== a.noop && (z = q(new Date(g, 0, 1)), z === c ? z = {} : "boolean" === typeof z ? z = {
                    enabled: z
                } : "string" === typeof z && (z = {
                    classes: z
                }), !1 === z.enabled && t.push("disabled"), z.classes && (t = t.concat(z.classes.split(/\s+/))), z.tooltip && (u = z.tooltip)), r += '\x3cspan class\x3d"' + t.join(" ") + '"' + (u ? ' title\x3d"' + u + '"' : "") + "\x3e" + g + "\x3c/span\x3e", g += f;
            b.find("td").html(r)
        },
        fill: function() {
            var b = new Date(this.viewDate),
                e = b.getUTCFullYear(),
                f = b.getUTCMonth(),
                g = -Infinity !== this.o.startDate ? this.o.startDate.getUTCFullYear() : -Infinity,
                h = -Infinity !== this.o.startDate ? this.o.startDate.getUTCMonth() : -Infinity,
                l = Infinity !== this.o.endDate ? this.o.endDate.getUTCFullYear() : Infinity,
                q = Infinity !== this.o.endDate ? this.o.endDate.getUTCMonth() : Infinity,
                m = u[this.o.language].today || u.en.today || "",
                x = u[this.o.language].clear || u.en.clear || "",
                w = u[this.o.language].titleFormat || u.en.titleFormat,
                t;
            if (!isNaN(e) && !isNaN(f)) {
                this.picker.find(".datepicker-days .datepicker-switch").text(r.formatDate(b, w, this.o.language));
                this.picker.find("tfoot .today").text(m).toggle(!1 !==
                    this.o.todayBtn);
                this.picker.find("tfoot .clear").text(x).toggle(!1 !== this.o.clearBtn);
                this.picker.find("thead .datepicker-title").text(this.o.title).toggle("" !== this.o.title);
                this.updateNavArrows();
                this.fillMonths();
                b = d(e, f - 1, 28);
                f = r.getDaysInMonth(b.getUTCFullYear(), b.getUTCMonth());
                b.setUTCDate(f);
                b.setUTCDate(f - (b.getUTCDay() - this.o.weekStart + 7) % 7);
                f = new Date(b);
                100 > b.getUTCFullYear() && f.setUTCFullYear(b.getUTCFullYear());
                f.setUTCDate(f.getUTCDate() + 42);
                f = f.valueOf();
                for (m = []; b.valueOf() < f;) {
                    if (b.getUTCDay() ===
                        this.o.weekStart && (m.push("\x3ctr\x3e"), this.o.calendarWeeks)) {
                        var x = new Date(+b + (this.o.weekStart - b.getUTCDay() - 7) % 7 * 864E5),
                            x = new Date(Number(x) + (11 - x.getUTCDay()) % 7 * 864E5),
                            A = new Date(Number(A = d(x.getUTCFullYear(), 0, 1)) + (11 - A.getUTCDay()) % 7 * 864E5);
                        m.push('\x3ctd class\x3d"cw"\x3e' + ((x - A) / 864E5 / 7 + 1) + "\x3c/td\x3e")
                    }
                    w = this.getClassNames(b);
                    w.push("day");
                    this.o.beforeShowDay !== a.noop && (x = this.o.beforeShowDay(this._utc_to_local(b)), x === c ? x = {} : "boolean" === typeof x ? x = {
                        enabled: x
                    } : "string" === typeof x && (x = {
                        classes: x
                    }), !1 === x.enabled && w.push("disabled"), x.classes && (w = w.concat(x.classes.split(/\s+/))), x.tooltip && (t = x.tooltip));
                    w = a.unique(w);
                    m.push('\x3ctd class\x3d"' + w.join(" ") + '"' + (t ? ' title\x3d"' + t + '"' : "") + "\x3e" + b.getUTCDate() + "\x3c/td\x3e");
                    t = null;
                    b.getUTCDay() === this.o.weekEnd && m.push("\x3c/tr\x3e");
                    b.setUTCDate(b.getUTCDate() + 1)
                }
                this.picker.find(".datepicker-days tbody").empty().append(m.join(""));
                t = u[this.o.language].monthsTitle || u.en.monthsTitle || "Months";
                var z = this.picker.find(".datepicker-months").find(".datepicker-switch").text(2 >
                    this.o.maxViewMode ? t : e).end().find("span").removeClass("active");
                a.each(this.dates, function(a, b) {
                    b.getUTCFullYear() === e && z.eq(b.getUTCMonth()).addClass("active")
                });
                (e < g || e > l) && z.addClass("disabled");
                e === g && z.slice(0, h).addClass("disabled");
                e === l && z.slice(q + 1).addClass("disabled");
                if (this.o.beforeShowMonth !== a.noop) {
                    var F = this;
                    a.each(z, function(b, k) {
                        var d = F.o.beforeShowMonth(new Date(e, b, 1));
                        d === c ? d = {} : "boolean" === typeof d ? d = {
                            enabled: d
                        } : "string" === typeof d && (d = {
                            classes: d
                        });
                        !1 !== d.enabled || a(k).hasClass("disabled") ||
                            a(k).addClass("disabled");
                        d.classes && a(k).addClass(d.classes);
                        d.tooltip && a(k).prop("title", d.tooltip)
                    })
                }
                this._fill_yearsView(".datepicker-years", "year", 10, 1, e, g, l, this.o.beforeShowYear);
                this._fill_yearsView(".datepicker-decades", "decade", 100, 10, e, g, l, this.o.beforeShowDecade);
                this._fill_yearsView(".datepicker-centuries", "century", 1E3, 100, e, g, l, this.o.beforeShowCentury)
            }
        },
        updateNavArrows: function() {
            if (this._allow_update) {
                var a = new Date(this.viewDate),
                    b = a.getUTCFullYear(),
                    a = a.getUTCMonth();
                switch (this.viewMode) {
                    case 0:
                        -Infinity !==
                            this.o.startDate && b <= this.o.startDate.getUTCFullYear() && a <= this.o.startDate.getUTCMonth() ? this.picker.find(".prev").css({
                                visibility: "hidden"
                            }) : this.picker.find(".prev").css({
                                visibility: "visible"
                            });
                        Infinity !== this.o.endDate && b >= this.o.endDate.getUTCFullYear() && a >= this.o.endDate.getUTCMonth() ? this.picker.find(".next").css({
                            visibility: "hidden"
                        }) : this.picker.find(".next").css({
                            visibility: "visible"
                        });
                        break;
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        -Infinity !== this.o.startDate && b <= this.o.startDate.getUTCFullYear() ||
                            2 > this.o.maxViewMode ? this.picker.find(".prev").css({
                                visibility: "hidden"
                            }) : this.picker.find(".prev").css({
                                visibility: "visible"
                            }), Infinity !== this.o.endDate && b >= this.o.endDate.getUTCFullYear() || 2 > this.o.maxViewMode ? this.picker.find(".next").css({
                                visibility: "hidden"
                            }) : this.picker.find(".next").css({
                                visibility: "visible"
                            })
                }
            }
        },
        click: function(c) {
            c.preventDefault();
            c.stopPropagation();
            var e, f, g, h, l;
            c = a(c.target);
            c.hasClass("datepicker-switch") && this.showMode(1);
            e = c.closest(".prev, .next");
            0 < e.length && (e = r.modes[this.viewMode].navStep *
                (e.hasClass("prev") ? -1 : 1), 0 === this.viewMode ? (this.viewDate = this.moveMonth(this.viewDate, e), this._trigger("changeMonth", this.viewDate)) : (this.viewDate = this.moveYear(this.viewDate, e), 1 === this.viewMode && this._trigger("changeYear", this.viewDate)), this.fill());
            c.hasClass("today") && (this.showMode(-2), this._setDate(b(), "linked" === this.o.todayBtn ? null : "view"));
            c.hasClass("clear") && this.clearDates();
            !c.hasClass("disabled") && (c.hasClass("day") && (e = parseInt(c.text(), 10) || 1, f = this.viewDate.getUTCFullYear(), g =
                this.viewDate.getUTCMonth(), c.hasClass("old") && (0 === g ? (g = 11, --f, l = h = !0) : (--g, h = !0)), c.hasClass("new") && (11 === g ? (g = 0, f += 1, l = h = !0) : (g += 1, h = !0)), this._setDate(d(f, g, e)), l && this._trigger("changeYear", this.viewDate), h && this._trigger("changeMonth", this.viewDate)), c.hasClass("month") && (this.viewDate.setUTCDate(1), e = 1, g = c.parent().find("span").index(c), f = this.viewDate.getUTCFullYear(), this.viewDate.setUTCMonth(g), this._trigger("changeMonth", this.viewDate), 1 === this.o.minViewMode ? (this._setDate(d(f, g, e)), this.showMode()) :
                this.showMode(-1), this.fill()), c.hasClass("year") || c.hasClass("decade") || c.hasClass("century")) && (this.viewDate.setUTCDate(1), e = 1, g = 0, f = parseInt(c.text(), 10) || 0, this.viewDate.setUTCFullYear(f), c.hasClass("year") && (this._trigger("changeYear", this.viewDate), 2 === this.o.minViewMode && this._setDate(d(f, g, e))), c.hasClass("decade") && (this._trigger("changeDecade", this.viewDate), 3 === this.o.minViewMode && this._setDate(d(f, g, e))), c.hasClass("century") && (this._trigger("changeCentury", this.viewDate), 4 === this.o.minViewMode &&
                this._setDate(d(f, g, e))), this.showMode(-1), this.fill());
            this.picker.is(":visible") && this._focused_from && a(this._focused_from).focus();
            delete this._focused_from
        },
        _toggle_multidate: function(a) {
            var b = this.dates.contains(a);
            a || this.dates.clear(); - 1 !== b ? (!0 === this.o.multidate || 1 < this.o.multidate || this.o.toggleActive) && this.dates.remove(b) : (!1 === this.o.multidate && this.dates.clear(), this.dates.push(a));
            if ("number" === typeof this.o.multidate)
                for (; this.dates.length > this.o.multidate;) this.dates.remove(0)
        },
        _setDate: function(a,
            b) {
            b && "date" !== b || this._toggle_multidate(a && new Date(a));
            b && "view" !== b || (this.viewDate = a && new Date(a));
            this.fill();
            this.setValue();
            b && "view" === b || this._trigger("changeDate");
            var c;
            this.isInput ? c = this.element : this.component && (c = this.element.find("input"));
            c && c.change();
            !this.o.autoclose || b && "date" !== b || this.hide()
        },
        moveDay: function(a, b) {
            var c = new Date(a);
            c.setUTCDate(a.getUTCDate() + b);
            return c
        },
        moveWeek: function(a, b) {
            return this.moveDay(a, 7 * b)
        },
        moveMonth: function(a, b) {
            if (!a || isNaN(a.getTime())) return this.o.defaultViewDate;
            if (!b) return a;
            var c = new Date(a.valueOf()),
                d = c.getUTCDate(),
                e = c.getUTCMonth(),
                f = Math.abs(b),
                g;
            b = 0 < b ? 1 : -1;
            if (1 === f) {
                if (f = -1 === b ? function() {
                        return c.getUTCMonth() === e
                    } : function() {
                        return c.getUTCMonth() !== g
                    }, g = e + b, c.setUTCMonth(g), 0 > g || 11 < g) g = (g + 12) % 12
            } else {
                for (var h = 0; h < f; h++) c = this.moveMonth(c, b);
                g = c.getUTCMonth();
                c.setUTCDate(d);
                f = function() {
                    return g !== c.getUTCMonth()
                }
            }
            for (; f();) c.setUTCDate(--d), c.setUTCMonth(g);
            return c
        },
        moveYear: function(a, b) {
            return this.moveMonth(a, 12 * b)
        },
        moveAvailableDate: function(a,
            b, c) {
            do {
                a = this[c](a, b);
                if (!this.dateWithinRange(a)) return !1;
                c = "moveDay"
            } while (this.dateIsDisabled(a));
            return a
        },
        weekOfDateIsDisabled: function(b) {
            return -1 !== a.inArray(b.getUTCDay(), this.o.daysOfWeekDisabled)
        },
        dateIsDisabled: function(b) {
            return this.weekOfDateIsDisabled(b) || 0 < a.grep(this.o.datesDisabled, function(a) {
                return b.getUTCFullYear() === a.getUTCFullYear() && b.getUTCMonth() === a.getUTCMonth() && b.getUTCDate() === a.getUTCDate()
            }).length
        },
        dateWithinRange: function(a) {
            return a >= this.o.startDate && a <= this.o.endDate
        },
        keydown: function(a) {
            if (this.picker.is(":visible")) {
                var b = !1,
                    c, d, e = this.focusDate || this.viewDate;
                switch (a.keyCode) {
                    case 27:
                        this.focusDate ? (this.focusDate = null, this.viewDate = this.dates.get(-1) || this.viewDate, this.fill()) : this.hide();
                        a.preventDefault();
                        a.stopPropagation();
                        break;
                    case 37:
                    case 38:
                    case 39:
                    case 40:
                        if (!this.o.keyboardNavigation || 7 === this.o.daysOfWeekDisabled.length) break;
                        c = 37 === a.keyCode || 38 === a.keyCode ? -1 : 1;
                        if (0 === this.viewMode) a.ctrlKey ? (d = this.moveAvailableDate(e, c, "moveYear")) && this._trigger("changeYear",
                            this.viewDate) : a.shiftKey ? (d = this.moveAvailableDate(e, c, "moveMonth")) && this._trigger("changeMonth", this.viewDate) : 37 === a.keyCode || 39 === a.keyCode ? d = this.moveAvailableDate(e, c, "moveDay") : this.weekOfDateIsDisabled(e) || (d = this.moveAvailableDate(e, c, "moveWeek"));
                        else if (1 === this.viewMode) {
                            if (38 === a.keyCode || 40 === a.keyCode) c *= 4;
                            d = this.moveAvailableDate(e, c, "moveMonth")
                        } else if (2 === this.viewMode) {
                            if (38 === a.keyCode || 40 === a.keyCode) c *= 4;
                            d = this.moveAvailableDate(e, c, "moveYear")
                        }
                        d && (this.focusDate = this.viewDate =
                            d, this.setValue(), this.fill(), a.preventDefault());
                        break;
                    case 13:
                        if (!this.o.forceParse) break;
                        e = this.focusDate || this.dates.get(-1) || this.viewDate;
                        this.o.keyboardNavigation && (this._toggle_multidate(e), b = !0);
                        this.focusDate = null;
                        this.viewDate = this.dates.get(-1) || this.viewDate;
                        this.setValue();
                        this.fill();
                        this.picker.is(":visible") && (a.preventDefault(), a.stopPropagation(), this.o.autoclose && this.hide());
                        break;
                    case 9:
                        this.focusDate = null, this.viewDate = this.dates.get(-1) || this.viewDate, this.fill(), this.hide()
                }
                if (b) {
                    this.dates.length ?
                        this._trigger("changeDate") : this._trigger("clearDate");
                    var f;
                    this.isInput ? f = this.element : this.component && (f = this.element.find("input"));
                    f && f.change()
                }
            } else if (40 === a.keyCode || 27 === a.keyCode) this.show(), a.stopPropagation()
        },
        showMode: function(a) {
            a && (this.viewMode = Math.max(this.o.minViewMode, Math.min(this.o.maxViewMode, this.viewMode + a)));
            this.picker.children("div").hide().filter(".datepicker-" + r.modes[this.viewMode].clsName).show();
            this.updateNavArrows()
        }
    };
    var e = function(b, c) {
        a(b).data("datepicker",
            this);
        this.element = a(b);
        this.inputs = a.map(c.inputs, function(a) {
            return a.jquery ? a[0] : a
        });
        delete c.inputs;
        w.call(a(this.inputs), c).on("changeDate", a.proxy(this.dateUpdated, this));
        this.pickers = a.map(this.inputs, function(b) {
            return a(b).data("datepicker")
        });
        this.updateDates()
    };
    e.prototype = {
        updateDates: function() {
            this.dates = a.map(this.pickers, function(a) {
                return a.getUTCDate()
            });
            this.updateRanges()
        },
        updateRanges: function() {
            var b = a.map(this.dates, function(a) {
                return a.valueOf()
            });
            a.each(this.pickers, function(a,
                c) {
                c.setRange(b)
            })
        },
        dateUpdated: function(b) {
            if (!this.updating) {
                this.updating = !0;
                var c = a(b.target).data("datepicker");
                if ("undefined" !== typeof c) {
                    var d = c.getUTCDate();
                    b = a.inArray(b.target, this.inputs);
                    var c = b - 1,
                        e = b + 1,
                        f = this.inputs.length;
                    if (-1 !== b) {
                        a.each(this.pickers, function(a, b) {
                            b.getUTCDate() || b.setUTCDate(d)
                        });
                        if (d < this.dates[c])
                            for (; 0 <= c && d < this.dates[c];) this.pickers[c--].setUTCDate(d);
                        else if (d > this.dates[e])
                            for (; e < f && d > this.dates[e];) this.pickers[e++].setUTCDate(d);
                        this.updateDates();
                        delete this.updating
                    }
                }
            }
        },
        remove: function() {
            a.map(this.pickers, function(a) {
                a.remove()
            });
            delete this.element.data().datepicker
        }
    };
    var m = a.fn.datepicker,
        w = function(b) {
            var d = Array.apply(null, arguments);
            d.shift();
            var f;
            this.each(function() {
                var c = a(this),
                    h = c.data("datepicker"),
                    n = "object" === typeof b && b;
                if (!h) {
                    var h = g(this, "date"),
                        m = a.extend({}, A, h, n),
                        m = l(m.language),
                        n = a.extend({}, A, m, h, n);
                    c.hasClass("input-daterange") || n.inputs ? (a.extend(n, {
                        inputs: n.inputs || c.find("input").toArray()
                    }), h = new e(this, n)) : h = new q(this, n);
                    c.data("datepicker",
                        h)
                }
                "string" === typeof b && "function" === typeof h[b] && (f = h[b].apply(h, d))
            });
            if (f === c || f instanceof q || f instanceof e) return this;
            if (1 < this.length) throw Error("Using only allowed for the collection of a single element (" + b + " function)");
            return f
        };
    a.fn.datepicker = w;
    var A = a.fn.datepicker.defaults = {
            assumeNearbyYear: !1,
            autoclose: !1,
            beforeShowDay: a.noop,
            beforeShowMonth: a.noop,
            beforeShowYear: a.noop,
            beforeShowDecade: a.noop,
            beforeShowCentury: a.noop,
            calendarWeeks: !1,
            clearBtn: !1,
            toggleActive: !1,
            daysOfWeekDisabled: [],
            daysOfWeekHighlighted: [],
            datesDisabled: [],
            endDate: Infinity,
            forceParse: !0,
            format: "mm/dd/yyyy",
            keyboardNavigation: !0,
            language: "en",
            minViewMode: 0,
            maxViewMode: 4,
            multidate: !1,
            multidateSeparator: ",",
            orientation: "auto",
            rtl: !1,
            startDate: -Infinity,
            startView: 0,
            todayBtn: !1,
            todayHighlight: !1,
            weekStart: 0,
            disableTouchKeyboard: !1,
            enableOnReadonly: !0,
            showOnFocus: !0,
            zIndexOffset: 10,
            container: "body",
            immediateUpdates: !1,
            title: "",
            templates: {
                leftArrow: "\x26laquo;",
                rightArrow: "\x26raquo;"
            }
        },
        F = a.fn.datepicker.locale_opts = ["format", "rtl", "weekStart"];
    a.fn.datepicker.Constructor = q;
    var u = a.fn.datepicker.dates = {
            en: {
                days: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
                daysShort: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
                daysMin: "Su Mo Tu We Th Fr Sa".split(" "),
                months: "January February March April May June July August September October November December".split(" "),
                monthsShort: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
                today: "Today",
                clear: "Clear",
                titleFormat: "MM yyyy"
            }
        },
        r = {
            modes: [{
                clsName: "days",
                navFnc: "Month",
                navStep: 1
            }, {
                clsName: "months",
                navFnc: "FullYear",
                navStep: 1
            }, {
                clsName: "years",
                navFnc: "FullYear",
                navStep: 10
            }, {
                clsName: "decades",
                navFnc: "FullDecade",
                navStep: 100
            }, {
                clsName: "centuries",
                navFnc: "FullCentury",
                navStep: 1E3
            }],
            isLeapYear: function(a) {
                return 0 === a % 4 && 0 !== a % 100 || 0 === a % 400
            },
            getDaysInMonth: function(a, b) {
                return [31, r.isLeapYear(a) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][b]
            },
            validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
            nonpunctuation: /[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g,
            parseFormat: function(a) {
                if ("function" ===
                    typeof a.toValue && "function" === typeof a.toDisplay) return a;
                var b = a.replace(this.validParts, "\x00").split("\x00");
                a = a.match(this.validParts);
                if (!b || !b.length || !a || 0 === a.length) throw Error("Invalid date format.");
                return {
                    separators: b,
                    parts: a
                }
            },
            parseDate: function(e, f, g, h) {
                function l(a, b) {
                    !0 === b && (b = 10);
                    100 > a && (a += 2E3, a > (new Date).getFullYear() + b && (a -= 100));
                    return a
                }

                function n() {
                    var a = this.slice(0, w[t].length),
                        b = w[t].slice(0, a.length);
                    return a.toLowerCase() === b.toLowerCase()
                }
                if (!e) return c;
                if (e instanceof Date) return e;
                "string" === typeof f && (f = r.parseFormat(f));
                if (f.toValue) return f.toValue(e, f, g);
                var m = /([\-+]\d+)([dmwy])/,
                    w = e.match(/([\-+]\d+)([dmwy])/g),
                    x = {
                        d: "moveDay",
                        m: "moveMonth",
                        w: "moveWeek",
                        y: "moveYear"
                    },
                    A = {
                        yesterday: "-1d",
                        today: "+0d",
                        tomorrow: "+1d"
                    },
                    t;
                if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(e)) {
                    e = new Date;
                    for (t = 0; t < w.length; t++) f = m.exec(w[t]), g = parseInt(f[1]), f = x[f[2]], e = q.prototype[f](e, g);
                    return d(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate())
                }
                if ("undefined" !== typeof A[e] && (e =
                        A[e], w = e.match(/([\-+]\d+)([dmwy])/g), /^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(e))) {
                    e = new Date;
                    for (t = 0; t < w.length; t++) f = m.exec(w[t]), g = parseInt(f[1]), f = x[f[2]], e = q.prototype[f](e, g);
                    return d(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate())
                }
                w = e && e.match(this.nonpunctuation) || [];
                e = new Date;
                var m = {},
                    F = "yyyy yy M MM m mm d dd".split(" "),
                    x = {
                        yyyy: function(a, b) {
                            return a.setUTCFullYear(h ? l(b, h) : b)
                        },
                        yy: function(a, b) {
                            return a.setUTCFullYear(h ? l(b, h) : b)
                        },
                        m: function(a, b) {
                            if (isNaN(a)) return a;
                            for (--b; 0 >
                                b;) b += 12;
                            b %= 12;
                            for (a.setUTCMonth(b); a.getUTCMonth() !== b;) a.setUTCDate(a.getUTCDate() - 1);
                            return a
                        },
                        d: function(a, b) {
                            return a.setUTCDate(b)
                        }
                    },
                    z;
                x.M = x.MM = x.mm = x.m;
                x.dd = x.d;
                e = b();
                A = f.parts.slice();
                w.length !== A.length && (A = a(A).filter(function(b, c) {
                    return -1 !== a.inArray(c, F)
                }).toArray());
                if (w.length === A.length) {
                    var Ca;
                    t = 0;
                    for (Ca = A.length; t < Ca; t++) {
                        z = parseInt(w[t], 10);
                        f = A[t];
                        if (isNaN(z)) switch (f) {
                            case "MM":
                                z = a(u[g].months).filter(n);
                                z = a.inArray(z[0], u[g].months) + 1;
                                break;
                            case "M":
                                z = a(u[g].monthsShort).filter(n),
                                    z = a.inArray(z[0], u[g].monthsShort) + 1
                        }
                        m[f] = z
                    }
                    for (t = 0; t < F.length; t++) f = F[t], f in m && !isNaN(m[f]) && (g = new Date(e), x[f](g, m[f]), isNaN(g) || (e = g))
                }
                return e
            },
            formatDate: function(b, c, d) {
                if (!b) return "";
                "string" === typeof c && (c = r.parseFormat(c));
                if (c.toDisplay) return c.toDisplay(b, c, d);
                d = {
                    d: b.getUTCDate(),
                    D: u[d].daysShort[b.getUTCDay()],
                    DD: u[d].days[b.getUTCDay()],
                    m: b.getUTCMonth() + 1,
                    M: u[d].monthsShort[b.getUTCMonth()],
                    MM: u[d].months[b.getUTCMonth()],
                    yy: b.getUTCFullYear().toString().substring(2),
                    yyyy: b.getUTCFullYear()
                };
                d.dd = (10 > d.d ? "0" : "") + d.d;
                d.mm = (10 > d.m ? "0" : "") + d.m;
                b = [];
                for (var e = a.extend([], c.separators), f = 0, g = c.parts.length; f <= g; f++) e.length && b.push(e.shift()), b.push(d[c.parts[f]]);
                return b.join("")
            },
            headTemplate: '\x3cthead\x3e\x3ctr\x3e\x3cth colspan\x3d"7" class\x3d"datepicker-title"\x3e\x3c/th\x3e\x3c/tr\x3e\x3ctr\x3e\x3cth class\x3d"prev"\x3e\x26laquo;\x3c/th\x3e\x3cth colspan\x3d"5" class\x3d"datepicker-switch"\x3e\x3c/th\x3e\x3cth class\x3d"next"\x3e\x26raquo;\x3c/th\x3e\x3c/tr\x3e\x3c/thead\x3e',
            contTemplate: '\x3ctbody\x3e\x3ctr\x3e\x3ctd colspan\x3d"7"\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/tbody\x3e',
            footTemplate: '\x3ctfoot\x3e\x3ctr\x3e\x3cth colspan\x3d"7" class\x3d"today"\x3e\x3c/th\x3e\x3c/tr\x3e\x3ctr\x3e\x3cth colspan\x3d"7" class\x3d"clear"\x3e\x3c/th\x3e\x3c/tr\x3e\x3c/tfoot\x3e'
        };
    r.template = '\x3cdiv class\x3d"datepicker"\x3e\x3cdiv class\x3d"datepicker-days"\x3e\x3ctable class\x3d" table-condensed"\x3e' + r.headTemplate + "\x3ctbody\x3e\x3c/tbody\x3e" + r.footTemplate + '\x3c/table\x3e\x3c/div\x3e\x3cdiv class\x3d"datepicker-months"\x3e\x3ctable class\x3d"table-condensed"\x3e' + r.headTemplate +
        r.contTemplate + r.footTemplate + '\x3c/table\x3e\x3c/div\x3e\x3cdiv class\x3d"datepicker-years"\x3e\x3ctable class\x3d"table-condensed"\x3e' + r.headTemplate + r.contTemplate + r.footTemplate + '\x3c/table\x3e\x3c/div\x3e\x3cdiv class\x3d"datepicker-decades"\x3e\x3ctable class\x3d"table-condensed"\x3e' + r.headTemplate + r.contTemplate + r.footTemplate + '\x3c/table\x3e\x3c/div\x3e\x3cdiv class\x3d"datepicker-centuries"\x3e\x3ctable class\x3d"table-condensed"\x3e' + r.headTemplate + r.contTemplate + r.footTemplate + "\x3c/table\x3e\x3c/div\x3e\x3c/div\x3e";
    a.fn.datepicker.DPGlobal = r;
    a.fn.datepicker.noConflict = function() {
        a.fn.datepicker = m;
        return this
    };
    a.fn.datepicker.version = "1.6.0";
    a(document).on("focus.datepicker.data-api click.datepicker.data-api", '[data-provide\x3d"datepicker"]', function(b) {
        var c = a(this);
        c.data("datepicker") || (b.preventDefault(), w.call(c, "show"))
    });
    a(function() {
        w.call(a('[data-provide\x3d"datepicker-inline"]'))
    })
});
window.console || (console = {});
console.log = console.log || function() {};
console.warn = console.warn || function() {};
console.error = console.error || function() {};
console.info = console.info || function() {};
window.jsErrors = [];
window.onerror = function(a, c, d, b, f) {
    window.jsErrors[window.jsErrors.length] = "Error: " + a + " Script: " + c + " Line: " + d + " Column: " + b + " StackTrace: " + f
};
"function" !== typeof String.prototype.startsWith && (String.prototype.startsWith = function(a) {
    return a && this.substr(0, a.length) === a
});
"function" !== typeof String.prototype.endsWith && (String.prototype.endsWith = function(a) {
    return -1 !== this.indexOf(a, this.length - a.length)
});
"function" !== typeof String.prototype.trim && (String.prototype.trim = function() {
    return $.trim(this)
});
var addAssetRowsLinkHTML = ' \x3cspan id\x3d"showExtraRowsSpan" class\x3d"hidden-print"\x3e(\x3ca href\x3d"javascript:void(0);" onclick\x3d"return addAssetRows(10);"\x3eAdd More\x3c/a\x3e)\x3c/span\x3e';
"undefined" !== typeof addRowsLinkText && (addAssetRowsLinkHTML = addAssetRowsLinkHTML.replace("Add More", addRowsLinkText));
var htmlEntityMap = {
    "\x26": "\x26amp;",
    "\x3c": "\x26lt;",
    "\x3e": "\x26gt;",
    '"': "\x26quot;",
    "'": "\x26#39;",
    "/": "\x26#x2F;"
};

function escapeHTML(a) {
    return String(a).replace(/[&<>"'\/]/g, function(a) {
        return htmlEntityMap[a]
    })
}
var selectedSymbolField = null,
    saveIndex = 0,
    useChosen = navigator.userAgent && 0 > navigator.userAgent.search(/iPad|iPhone|Android|SeleniumWebDriver/),
    maxChartsPerPage = 15;
$(function() {
    var a = /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : !1;
    a && 8 >= a && $("tbody tr:even").addClass("highlightRow");
    useChosen && $("select").chosen({
        disable_search_threshold: 100,
        width: "100%"
    });
    $("input[type\x3dtext],textarea").placeholder();
    $("form").attr("autocomplete", "off");
    $("input").attr("autocomplete", "off");
    $("input[type\x3dtext]").attr("autocorrect", "off").attr("spellcheck", "false");
    $("form").preventDoubleSubmission();
    a = $("div.navbar-fixed-top");
    a = 0 >= a.length ? 0 : a.outerHeight();
    $("table.stickyHeaders").floatThead({
        enableAria: !0,
        top: a
    });
    $("span.directPrint").html('\x3ca href\x3d"#"\x3e\x3cspan class\x3d"fa fa-print"\x3e\x3c/span\x3e\x3c/a\x3e \x3ca href\x3d"#"\x3ePrint\x3c/a\x3e').find("a").attr("href", "javascript:alert('Please print using landscape mode for page orientation.');window.print()");
    $(".modal").on("shown.bs.modal", function() {
        $(this).find("[autofocus]").focus()
    });
    a = $(window).width();
    380 < a && 768 >= a && $("div[id^\x3d'allocation-menu']").addClass("btn-group-xs").removeClass("btn-group-sm");
    $(document).on("submit", "form[data-async]", function(a) {
        var d = $(this),
            b = $(d.attr("data-messages")),
            f = $("#saveType").val(),
            g = $("#saveName").val();
        $.ajax({
            type: d.attr("method"),
            url: d.attr("action"),
            data: d.serialize(),
            dataType: "json",
            success: function(a) {
                if (a.success) {
                    var c = "Model saved";
                    "allocation" == f ? c = "Asset allocation saved as '" + escapeHTML(g) + "'." : "portfolio" == f ? c = "Portfolio saved as '" + escapeHTML(g) + "'." : "timing" == f && (c = "Timing model saved as '" + escapeHTML(g) + "'.");
                    c += ' \x3ca href\x3d"preferences"\x3eManage saved models \x26raquo;\x3c/a\x3e';
                    $("#saveConfirmMsg" + saveIndex).html(c);
                    $("#saveDialog").modal("hide");
                    window.savedConfigurations = a.list
                } else b.html('\x3cdiv class\x3d"alert alert-danger" role\x3d"alert"\x3e' + escapeHTML(a.message) + "\x3c/div\x3e")
            },
            error: function(a) {
                b.html('\x3cdiv class\x3d"alert alert-danger" role\x3d"alert"\x3e' + escapeHTML(a.responseText || "Save Failed!") + "\x3c/div\x3e")
            }
        });
        a.preventDefault()
    });
    $("#selectConfigButton").on("click", function(a) {
        a = $("#configs").val();
        populatePortfolio(a);
        $("#loadDialog").modal("hide")
    });
    $(".fmt-uppercase").blur(function() {
        $(this).val($(this).val().trim().toUpperCase())
    });
    $("form").on("submit", function(a) {
        $(".fmt-uppercase").each(function() {
            $(this).val($(this).val().trim().toUpperCase())
        })
    });
    $("[data-toggle\x3d'tooltip']").tooltip({
        container: "body",
        placement: "bottom"
    });
    $("#emailLink").wrap("\x3ca href\x3d\"javascript:sendEmail('admin')\"\x3e\x3c/a\x3e");
    $("span.glyphicon-calendar").on("click", function(a) {
        $(this).closest("div").find("input").datepicker("show")
    });
    $(".fmt-date").datepicker({
        format: "mm/dd/yyyy",
        clearBtn: !0,
        autoclose: !0,
        showOnFocus: !1,
        enableOnReadonly: !1
    });
    $(document).keydown(function(a) {
        27 == a.keyCode && $(".fmt-date").each(function() {
            $(this).datepicker("hide")
        })
    });
    $(".fmt-date").mask("99/99/9999");
    $(".fmt-int").mask("S#", {
        translation: {
            S: {
                pattern: /-/,
                optional: !0
            }
        }
    });
    $(".fmt-posint").mask("#");
    $(".fmt-int3").mask("S999", {
        translation: {
            S: {
                pattern: /-/,
                optional: !0
            }
        }
    });
    $(".fmt-pct").mask("S09Z00", {
        translation: {
            S: {
                pattern: /-/,
                optional: !0
            },
            Z: {
                pattern: /[0-9]|\./,
                optional: !0
            }
        }
    });
    $(".fmt-pospct").mask("09Z00", {
        translation: {
            Z: {
                pattern: /[0-9]|\./,
                optional: !0
            }
        }
    });
    $(".fmt-ticker").mask("QTTTTTTTTT", {
        translation: {
            Q: {
                pattern: /[a-zA-Z]|\^/
            },
            T: {
                pattern: /[a-zA-Z0-9]|\/|\.|\+|\-/
            }
        }
    });
    $(".fmt-ticker").blur(function() {
        $(this).val($(this).val().trim().toUpperCase())
    });
    $("input.typeahead").typeahead({
        minLength: 3,
        items: 10,
        source: function(a, d) {
            var b = $("#type").val(),
                f = $("#category").val();
            $("#name").val();
            return $.get("SymbolLookupServlet", {
                query: b + "|" + f + "|" + a
            }, function(a) {
                return d(a.options)
            })
        },
        matcher: function(a) {
            return !0
        }
    });
    $("span.glyphicon-search").not("[id^\x3dsearchConfig]").on("click", function(a) {
        selectedSymbolField = $(this).closest("div").find("input");
        $("#name").val("");
        $("#symbolPicker").modal()
    });
    $("#type").change(function() {
        var a = $(this).val(),
            d = "Cash" == a,
            b = "Index" == a,
            a = "Class" == a,
            f = !(d || b || a);
        $("#name").closest(".form-group").toggle(f);
        $("#cashAsset").closest(".form-group").toggle(d);
        $("#indexAsset").closest(".form-group").toggle(b);
        $("#assetClassAsset").closest(".form-group").toggle(a)
    });
    $("#selectTicker").on("click",
        function(a) {
            var d = $("#type").val();
            a = "Cash" == d;
            var b = "Index" == d,
                f = "Class" == d,
                d = null;
            a || b || f ? a ? d = $("#cashAsset").val() : b ? d = $("#indexAsset").val() : f && (d = $("#assetClassAsset").val()) : d = (a = $("#name").val().match(/\(([^)]+)\)$/)) && a[1];
            d && (selectedSymbolField.hasClass("pv-multiple") ? (a = selectedSymbolField.val(), selectedSymbolField.val($.trim(a) + " " + d)) : selectedSymbolField.val(d));
            $("#symbolPicker").modal("hide")
        });
    $(".allocation-menu").on("show.bs.dropdown", function() {
        var a = $(this).prop("id").match(/\d+$/),
            d = window.savedConfigurations,
            b = !isMultiplePortfolios();
        if (d) {
            var f = $(this).find("li.saved-items"),
                g = !1,
                l;
            for (l in d)
                if (d.hasOwnProperty(l)) {
                    g || (f.siblings("li.saved-item").remove(), g = !0);
                    var h = '\x3cli class\x3d"saved-item"\x3e\x3ca href\x3d"#"\x3e' + escapeHTML(l) + "\x3c/a\x3e\x3c/li\x3e",
                        h = $($.parseHTML(h));
                    h.find("a").click(function(d) {
                        var e = $(this).text();
                        populatePortfolio(e, a, isAssetClasses(), !1, b);
                        d.preventDefault()
                    });
                    f.after(h)
                }
        }
    });
    $("div[id^\x3d'chartDiv']").bind("contextmenu", function() {
        return !1
    });
    jQuery.fn.highcharts && Highcharts.setOptions({
        credits: {
            enabled: !1
        },
        colors: "#3366CC #DC3912 #FF9900 #109618 #990099 #0099C6 #DD4477 #66AA00 #B82E2E #316395 #994499 #22AA99 #AAAA11 #6633CC #E67300 #8B0707 #651067 #329262 #5574A6 #3B3EAC".split(" "),
        title: {
            text: "",
            style: {
                fontWeight: "bold",
                fontSize: "14px",
                fontFamily: "Arial, Trebuchet MS, Verdana, sans-serif"
            }
        },
        chart: {
            style: {
                fontSize: "14px",
                fontFamily: "Arial, Trebuchet MS, Verdana, sans-serif"
            }
        },
        xAxis: {
            labels: {
                style: {
                    font: "14px Arial, Trebuchet MS, Verdana, sans-serif"
                }
            }
        },
        yAxis: {
            labels: {
                style: {
                    font: "14px Arial, Trebuchet MS, Verdana, sans-serif"
                }
            }
        },
        tooltip: {
            style: {
                fontSize: "14px",
                fontFamily: "Arial, Trebuchet MS, Verdana, sans-serif"
            },
            headerFormat: '\x3cspan style\x3d"font-size: 14px"\x3e\x3cb\x3e{point.key}\x3c/b\x3e\x3c/span\x3e\x3cbr/\x3e'
        },
        legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "middle",
            itemStyle: {
                fontWeight: "normal",
                fontFamily: "Arial, Trebuchet MS, Verdana, sans-serif",
                width: "100px"
            }
        },
        lang: {
            thousandsSep: ","
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    style: {
                        fontWeight: "normal",
                        textShadow: !1
                    }
                },
                point: {
                    events: {
                        legendItemClick: function() {
                            return !1
                        }
                    }
                },
                showInLegend: !0
            },
            line: {
                events: {
                    legendItemClick: function() {
                        return !1
                    }
                },
                marker: {
                    radius: 4
                }
            },
            column: {
                events: {
                    legendItemClick: function() {
                        return !1
                    }
                }
            },
            bar: {
                events: {
                    legendItemClick: function() {
                        return !1
                    }
                }
            },
            series: {
                animation: !1,
                lineWidth: 2,
                states: {
                    hover: {
                        enabled: !0,
                        lineWidth: 2
                    }
                }
            }
        }
    });
    $('a[data-toggle\x3d"tab"]').on("shown.bs.tab", function(a) {
        a = $(a.target).attr("href");
        for (var d = 1; d <= maxChartsPerPage; d++) {
            var b = $("#chartDiv" + d);
            b.length && b.closest(a).length &&
                renderChart(d)
        }
    });
    setTimeout(function() {
        for (var a = 0 < $('a[data-toggle\x3d"tab"]').length, d = 1; d <= maxChartsPerPage; d++) {
            var b = $("#chartDiv" + d);
            if (b.length) {
                var f = !0;
                a && (f = 0 < b.closest("div.tab-pane.active").length);
                f && renderChart(d)
            }
        }
    }, 0);
    window.matchMedia && (a = window.matchMedia("print"), a.addListener && a.addListener(function(a) {
        a.matches && triggerCharts()
    }));
    window.onbeforeprint = function() {
        triggerCharts()
    };
    window.onafterprint = function() {};
    applyLegacyIEFontFix();
    $(document).on("change", ".btn-file :file",
        function() {
            var a = $(this),
                d = a.val().replace(/\\/g, "/").replace(/.*\//, "");
            a.parents(".input-group").find(":text").val(d)
        })
});

function loadStyleSheet(a) {
    if (document.createStyleSheet) try {
        document.createStyleSheet(a)
    } catch (c) {} else $('\x3clink rel\x3d"stylesheet" type\x3d"text/css" href\x3d"' + a + '"\x3e').appendTo("head")
}

function applyLegacyIEFontFix() {
    if (document.all && !document.addEventListener) {
        var a = document.getElementsByTagName("head")[0],
            c = document.createElement("style");
        c.type = "text/css";
        c.styleSheet.cssText = ":before,:after{content:none !important;}";
        a.appendChild(c);
        setTimeout(function() {
            a.removeChild(c)
        }, 0)
    }
}

function triggerCharts() {
    if (0 < $('a[data-toggle\x3d"tab"]').length) {
        for (var a = $("div.tab-pane.active").attr("id"), c = 1; c <= maxChartsPerPage; c++) {
            var d = $("#chartDiv" + c);
            d.length && !d.data("data-rendered") && (d = d.closest("div.tab-pane"), 0 < d.length && (d = d.attr("id"), $('.nav-tabs a[href\x3d"#' + d + '"]').tab("show"), renderChart(c)))
        }
        $('.nav-tabs a[href\x3d"#' + a + '"]').tab("show")
    }
}

function renderChart(a) {
    var c = $("#chartDiv" + a);
    if (c.length && !c.data("data-rendered")) {
        var d = "getChartData" + a;
        try {
            if (window[d]) {
                var b = window[d]();
                if (b.length) {
                    var f = b[0],
                        g = b[1],
                        l = b[2];
                    f.draw(g, l);
                    c.data("chartObj", f);
                    c.data("chartData", g);
                    c.data("chartOptions", l)
                } else c.highcharts(b)
            } else window["chart" + a].draw(window["data" + a], window["options" + a])
        } catch (h) {
            console.error("Failed to render chart: " + h), c.text("Failed to render chart").css("border", "1px solid red"), window.jsErrors[window.jsErrors.length] =
                "Failed to render chart: " + h
        }
        c.data("data-rendered", !0)
    }
}

function toggleLogScale(a) {
    var c = "getChartData" + a,
        d = null,
        b = null,
        f = null;
    try {
        var g = $("#logScale").is(":checked");
        if (window[c]) {
            var l = $("#chartDiv" + a);
            if (d = l.data("chartObj")) b = l.data("chartData"), f = l.data("chartOptions");
            else {
                if (l.highcharts) {
                    l.highcharts().yAxis[0].update({
                        type: g ? "logarithmic" : "linear"
                    });
                    return
                }
                var h = window[c](),
                    d = h[0],
                    b = h[1],
                    f = h[2]
            }
        } else d = window["chart" + a], b = window["data" + a], f = window["options" + a];
        f.logScale = g;
        d.draw(b, f)
    } catch (q) {
        console.error("Failed to render Google charts: " + q),
            $("#chartDiv" + a).text("Failed to render chart").css("border", "1px solid red")
    }
}
var growthPortfolio = {
        TotalStockMarket: 52,
        IntlStockMarket: 28,
        TotalBond: 16,
        GlobalBond: 4
    },
    moderatePortfolio = {
        TotalStockMarket: 39,
        IntlStockMarket: 21,
        TotalBond: 32,
        GlobalBond: 8
    },
    conservativePortfolio = {
        TotalStockMarket: 26,
        IntlStockMarket: 14,
        TotalBond: 48,
        GlobalBond: 12
    },
    incomePortfolio = {
        TotalStockMarket: 13,
        IntlStockMarket: 7,
        TotalBond: 64,
        GlobalBond: 16
    },
    stockBond6040 = {
        TotalStockMarket: 60,
        TotalBond: 40
    },
    stockBond4060 = {
        TotalStockMarket: 40,
        TotalBond: 60
    },
    bhThreeFund = {
        TotalStockMarket: 50,
        IntlStockMarket: 30,
        TotalBond: 20
    },
    bhFourFund = {
        TotalStockMarket: 50,
        IntlStockMarket: 30,
        TotalBond: 10,
        TIPS: 10
    },
    rickFerri = {
        TotalStockMarket: 48,
        REIT: 8,
        IntlStockMarket: 24,
        TotalBond: 20
    },
    billSchultheis = {
        LargeCapValue: 10,
        LargeCapBlend: 10,
        SmallCapValue: 10,
        SmallCapBlend: 10,
        REIT: 10,
        IntlStockMarket: 10,
        TotalBond: 40
    },
    davidSwensenYale = {
        TotalStockMarket: 30,
        REIT: 20,
        EAFE: 15,
        EmergingMarket: 5,
        LongTermBond: 15,
        TIPS: 15
    },
    scottBurns = {
        TotalStockMarket: 50,
        TIPS: 50
    },
    harryBrowne = {
        TotalStockMarket: 25,
        LongTermBond: 25,
        TBills: 25,
        Gold: 25
    },
    billBernstein = {
        LargeCapBlend: 25,
        SmallCapBlend: 25,
        IntlStockMarket: 25,
        TotalBond: 25
    },
    fundAdvice = {
        LargeCapBlend: 6,
        LargeCapValue: 6,
        SmallCapBlend: 6,
        SmallCapValue: 6,
        REIT: 6,
        EAFE: 6,
        EmergingMarket: 6,
        IntlValue: 6,
        FiveYearTBills: 20,
        TIPS: 8,
        TwoYearTBills: 12,
        IntlSmall: 12
    },
    davidSwensenLazy = {
        TotalStockMarket: 30,
        REIT: 20,
        EAFE: 15,
        EmergingMarket: 5,
        TIPS: 15,
        TwoYearTBills: 15
    },
    larrySwedroeSimple = {
        LargeCapValue: 15,
        SmallCapValue: 15,
        SmallCapBlend: 13,
        EmergingMarket: 4,
        IntlValue: 13,
        TIPS: 40
    },
    larrySwedroeFatTails = {
        SmallCapValue: 15,
        EmergingMarket: 15,
        TIPS: 35,
        TwoYearTBills: 35
    },
    ivyPortfolio = {
        TotalStockMarket: 20,
        IntlStockMarket: 20,
        TotalBond: 20,
        REIT: 20,
        Commodities: 20
    },
    growthPortfolioAssets = {
        VTSMX: 52,
        VGTSX: 28,
        VBMFX: 16,
        PIGLX: 4
    },
    moderatePortfolioAssets = {
        VTSMX: 39,
        VGTSX: 21,
        VBMFX: 32,
        PIGLX: 8
    },
    conservativePortfolioAssets = {
        VTSMX: 26,
        VGTSX: 14,
        VBMFX: 48,
        PIGLX: 12
    },
    incomePortfolioAssets = {
        VTSMX: 13,
        VGTSX: 7,
        VBMFX: 64,
        PIGLX: 16
    },
    stockBond6040Assets = {
        VTSMX: 60,
        VBMFX: 40
    },
    stockBond4060Assets = {
        VTSMX: 40,
        VBMFX: 60
    },
    bhThreeFundAssets = {
        VTSMX: 50,
        VGTSX: 30,
        VBMFX: 20
    },
    bhFourFundAssets = {
        VTSMX: 50,
        VGTSX: 30,
        VBMFX: 10,
        VIPSX: 10
    },
    rickFerriAssets = {
        VTSMX: 48,
        VGSIX: 8,
        VGTSX: 24,
        VBMFX: 20
    },
    billSchultheisAssets = {
        VIVAX: 10,
        VFINX: 10,
        VISVX: 10,
        NAESX: 10,
        VGSIX: 10,
        VGTSX: 10,
        VBMFX: 40
    },
    davidSwensenYaleAssets = {
        VTSMX: 30,
        VGSIX: 20,
        VTMGX: 15,
        VEIEX: 5,
        TLT: 15,
        VIPSX: 15
    },
    scottBurnsAssets = {
        VTSMX: 50,
        VIPSX: 50
    },
    harryBrowneAssets = {
        VTI: 25,
        TLT: 25,
        CASHX: 25,
        GLD: 25
    },
    billBernsteinAssets = {
        VFINX: 25,
        NAESX: 25,
        VGTSX: 25,
        VBMFX: 25
    },
    fundAdviceAssets = {
        VFINX: 6,
        VIVAX: 6,
        NAESX: 6,
        VISVX: 6,
        VGSIX: 6,
        VTMGX: 12,
        VEIEX: 6,
        EFV: 12,
        VFITX: 20,
        VFISX: 12,
        VIPSX: 8
    },
    davidSwensenLazyAssets = {
        VTSMX: 30,
        VGSIX: 20,
        VTMGX: 15,
        VEIEX: 5,
        VIPSX: 15,
        VFISX: 15
    },
    larrySwedroeSimpleAssets = {
        VIVAX: 15,
        IJS: 15,
        NAESX: 13,
        VEIEX: 4,
        EFV: 13,
        VIPSX: 40
    },
    larrySwedroeFatTailsAssets = {
        IJS: 15,
        VWO: 15,
        TIP: 35,
        SHY: 35
    },
    ivyPortfolioAssets = {
        VTI: 20,
        VEU: 20,
        IEF: 20,
        VNQ: 20,
        DBC: 20
    },
    lazyPortfolios = {
        "Growth Portfolio": growthPortfolio,
        "Moderate Portfolio": moderatePortfolio,
        "Conservative Portfolio": conservativePortfolio,
        "Income Portfolio": incomePortfolio,
        "Stocks/Bonds (60/40)": stockBond6040,
        "Stocks/Bonds (40/60)": stockBond4060,
        "Bogleheads Three Funds": bhThreeFund,
        "Bogleheads Four Funds": bhFourFund,
        "Rick Ferri Core Four": rickFerri,
        "Bill Bernstein No Brainer": billBernstein,
        "Bill Schultheis Coffee House": billSchultheis,
        "FundAdvice Ultimate Buy \x26 Hold Portfolio": fundAdvice,
        "David Swensen Lazy Portfolio": davidSwensenLazy,
        "David Swensen Yale Endowment": davidSwensenYale,
        "Scott Burns Couch Portfolio": scottBurns,
        "Harry Browne Permanent Portfolio": harryBrowne,
        "Larry Swedroe Simple Portfolio": larrySwedroeSimple,
        "Larry Swedroe Minimize FatTails Portfolio": larrySwedroeFatTails,
        "Mebane Faber Ivy Portfolio": ivyPortfolio
    },
    lazyPortfolioAssets = {
        "Growth Portfolio": growthPortfolioAssets,
        "Moderate Portfolio": moderatePortfolioAssets,
        "Conservative Portfolio": conservativePortfolioAssets,
        "Income Portfolio": incomePortfolioAssets,
        "Stocks/Bonds (60/40)": stockBond6040Assets,
        "Stocks/Bonds (40/60)": stockBond4060Assets,
        "Bogleheads Three Funds": bhThreeFundAssets,
        "Bogleheads Four Funds": bhFourFundAssets,
        "Rick Ferri Core Four": rickFerriAssets,
        "Bill Bernstein No Brainer": billBernsteinAssets,
        "Bill Schultheis Coffee House": billSchultheisAssets,
        "FundAdvice Ultimate Buy \x26 Hold Portfolio": fundAdviceAssets,
        "David Swensen Lazy Portfolio": davidSwensenLazyAssets,
        "David Swensen Yale Endowment": davidSwensenYaleAssets,
        "Scott Burns Couch Portfolio": scottBurnsAssets,
        "Harry Browne Permanent Portfolio": harryBrowneAssets,
        "Larry Swedroe Simple Portfolio": larrySwedroeSimpleAssets,
        "Larry Swedroe Minimize FatTails Portfolio": larrySwedroeFatTailsAssets,
        "Mebane Faber Ivy Portfolio": ivyPortfolioAssets
    };

function selectPortfolio(a) {
    var c = $(a).val(),
        d = a.id.substring(9),
        b = "input[id$\x3d'" + d + "']";
    if (0 == a.selectedIndex) $(b).removeAttr("readonly");
    else {
        $(b).attr("readonly", "readonly").val("");
        if (a = lazyPortfolios[c])
            for (var f in a) a.hasOwnProperty(f) && $("#" + f + "" + d).val(a[f]);
        else populatePortfolioAllocation(d, c);
        processTotal(d)
    }
}

function sendEmail(a, c) {
    c || (c = "portfoliovisualizer.com");
    location.href = "mailto:" + a + "@" + c
}

function writeEmailLink(a, c, d) {
    d || (d = "portfoliovisualizer.com");
    document.write("\x3ca href\x3d\"javascript:sendEmail('" + c + "', '" + d + "')\"\x3e");
    document.write(a);
    document.write("\x3c/a\x3e")
}

function processTotal(a, c) {
    var d = "total" + a,
        b = $("#" + d),
        f = 0;
    $(c ? "input[id^\x3d'allocation']" : "input[id$\x3d'" + a + "']").each(function() {
        var b = this.id.substring(this.id.length - 1);
        this.id != d && b == a && (f += Number($(this).val()))
    });
    b.val(0 === f % 1 ? f : f.toFixed(2));
    "100.00" == f.toFixed(2) ? b.css("background-color", "#dff0d8") : 0 != f ? b.css("background-color", "#f2dede") : b.css("background-color", "#eeeeee")
}

function openPopupURL(a) {
    a = window.open(a);
    null == a.opener && (a.opener = self);
    a.focus();
    return a
}

function isNumber(a) {
    return !isNaN(parseFloat(a)) && isFinite(a)
}
jQuery.fn.preventDoubleSubmission = function() {
    $(this).on("submit", function(a) {
        var c = $(this);
        !0 === c.data("submitted") ? a.preventDefault() : c.data("submitted", !0)
    });
    return this
};

function addFieldError(a, c) {
    var d = $("#" + a),
        b = d.closest(".form-group");
    b.addClass("has-error");
    for (var f = b.find("label.control-label").attr("class").split(" "), b = -1, g = 0; g < f.length; g++) {
        var l = /^col\-sm\-(.+)/.exec(f[g]);
        if (null != l) {
            b = l[1] - 0;
            break
        }
    }
    0 >= b ? console.log("Error: Failed to determine grid width of the label for field: " + a) : (d = d.closest("div:not(.input-group)"), d.wrap("\x3cdiv class\x3d'col-sm-" + (12 - b) + "'\x3e\x3c/div\x3e"), d.wrap("\x3cdiv class\x3d'row'\x3e\x3c/div\x3e"), $("#" + a + "_chosen").find("span").addClass("error-text"),
        d.parent().parent().append('\x3cdiv class\x3d"row"\x3e\x3cspan class\x3d"help-block col-sm-12"\x3e' + c + "\x3c/span\x3e\x3c/div\x3e"))
}

function saveDialog(a, c, d, b, f) {
    saveIndex = a;
    $("#saveDialogTitle").text("Save " + c);
    $("#saveSelection").val(b);
    $("#saveType").val(d);
    $("#saveConfig").val(JSON.stringify(f));
    a = c.charAt(0).toUpperCase() + c.substr(1).toLowerCase() + " name";
    $("#saveName").prop("readonly", !1).attr("placeholder", a).val("");
    $("#saveMessages").empty();
    $("#saveConfigButton").prop("disabled", !1);
    $("#saveDialog").modal()
}
var indexToPopulate = -1,
    populateAssetClasses = !1,
    clearExistingAssets = !1;

function populatePortfolioAllocation(a, c) {
    var d = window.savedConfigurations;
    if (d = null == d ? null : d[c]) {
        $("input[id$\x3d'" + a + "']").attr("readonly", "readonly").val("");
        for (var b in d)
            if (d.hasOwnProperty(b)) {
                var f = 100 * d[b],
                    f = 0 === f % 1 ? f : f.toFixed(2);
                $("#" + b + a).val(f)
            }
        $("#portfolio" + a).val(c).trigger("chosen:updated")
    }
}

function populatePortfolio(a, c, d, b, f) {
    c = c || indexToPopulate;
    var g = populateAssetClasses || d,
        l = window.savedConfigurations,
        l = null == l ? null : l[a],
        h = allowExtraRows();
    b && (l = d ? lazyPortfolios[a] : lazyPortfolioAssets[a]);
    if (l) {
        a = "input[id$\x3d'" + c + "']";
        $("input[id^\x3d'allocation']").filter(a).val("").removeAttr("readonly");
        $("#portfolio" + c).val("Custom").trigger("chosen:updated");
        if (clearExistingAssets || f) g ? $("select[id^\x3d'asset']").prop("selectedIndex", 0).trigger("chosen:updated") : $("input[id^\x3d'symbol']").val(""),
            $("input[id^\x3d'allocation']").val(""), processTotal(1, !0);
        for (var q in l)
            if (l.hasOwnProperty(q)) {
                f = b ? l[q] : 100 * l[q];
                f = 0 === f % 1 ? f : f.toFixed(2);
                a = 0;
                d = !0;
                for (var e = g ? 25 : 150, m = 1; m <= e; m++) {
                    var w = g ? $("#asset" + m) : $("#symbol" + m);
                    if (0 >= w.length) {
                        1 > a && h && (addAssetRows(1), a = m);
                        break
                    }
                    w = w.val();
                    if (w == q) {
                        a = m;
                        d = !1;
                        break
                    } else !w && 1 > a && (a = m)
                }
                a && (d && (g ? $("#asset" + a).val(q).trigger("chosen:updated") : $("#symbol" + a).val(q)), $("#allocation" + a + "_" + c).val(f))
            }
        processTotal(c, !0)
    }
}

function showLoginPrompt(a) {
    $("#confirmDialogTitle").text("Login Required");
    $("#confirmText").text("Please login first to " + (a ? "save" : "download") + " results.");
    $("#confirmButton").text("Login").addClass("btn-primary");
    $("#confirmDialog").modal().on("click", "#confirmButton", function() {
        document.location.href = "login"
    })
}

function equalWeightAllocations(a, c) {
    clearAllocations(a, c);
    var d = c ? $("div.asset-row select[id^\x3d'asset']") : $("div.asset-row input[id^\x3d'symbol']"),
        d = d.filter(function() {
            return $(this).val().trim()
        }),
        b = d.length;
    if (!(0 >= b)) {
        for (var f = Math.floor(100 / b * 100) / 100, g = 100, l = 1; l < b; l++) {
            var h = "#allocation" + d[l].id.match(/\d+/) + "_" + a;
            $(h).val(f);
            g -= f
        }
        d = "#allocation" + d[0].id.match(/\d+/) + "_" + a;
        $(d).val(0 === g % 1 ? g : g.toFixed(2));
        processTotal(a, !0)
    }
}

function normalizeAllocations(a, c) {
    var d = (c ? $("div.asset-row select[id^\x3d'asset']") : $("div.asset-row input[id^\x3d'symbol']")).length,
        b = -1,
        f = 0,
        g, l, h;
    for (g = 1; g <= d; g++) l = "#allocation" + g + "_" + a, h = $(l).val(), $.isNumeric(h) && (h = Number(h), f += h, 0 > b && (b = g));
    if (!(0 >= f)) {
        var q = 100;
        for (g = 1; g <= d; g++) g != b && (l = "#allocation" + g + "_" + a, h = $(l).val(), $.isNumeric(h) && (h = Number(h), h = Math.floor(h / f * 1E4) / 100, $(l).val(h), q -= h));
        $("#allocation" + b + "_" + a).val(0 === q % 1 ? q : q.toFixed(2));
        processTotal(a, !0)
    }
}

function clearAllocations(a, c) {
    $("input[id^\x3d'allocation']").each(function() {
        $(this).attr("id").endsWith("" + a) && $(this).val("")
    });
    processTotal(a, !0)
}

function isAssetClasses() {
    return $("#pfSection").hasClass("pv-asset-classes")
}

function isMultiplePortfolios() {
    return $("#pfSection").hasClass("pv-multiple")
}

function allowExtraRows() {
    return $("#pfSection").hasClass("pv-allow-expansion")
}

function addAssetRows(a) {
    $("#showExtraRowsSpan").remove();
    var c = $("div.asset-row").length,
        d = $("div.asset-row:last"),
        b = isAssetClasses() ? 25 : 150;
    "undefined" !== typeof maxPortfolioAssets && (b = maxPortfolioAssets);
    for (var f = 0; f < a; f++) {
        var g = d.clone(!0, !0),
            l = parseInt(g.find("input[id^\x3d'allocation']:first").prop("id").match(/\d+/)),
            h = l + 1;
        g.find("input").each(function() {
            var a = $(this),
                b = a.prop("id"),
                c = a.prop("name");
            a.prop("id", b.replace(l, h)).prop("name", c.replace(l, h)).val("")
        });
        g.find("label").each(function() {
            var a =
                $(this),
                b = a.prop("for");
            a.prop("for", b.replace(l, h));
            a.text(a.text().replace(l, h))
        });
        g.find("select").each(function() {
            var a = $(this),
                b = a.prop("id"),
                c = a.prop("name");
            useChosen && (a.data("chosen", null).data("data-placeholder", null).css("display", "block"), a.next().remove());
            a.prop("id", b.replace(l, h)).prop("name", c.replace(l, h)).prop("selectedIndex", 0);
            useChosen && a.chosen({
                disable_search_threshold: 100,
                width: "100%"
            })
        });
        g.find("div:first").text("Asset " + h);
        g.toggleClass("highlightRow", 1 == h % 2);
        d.after(g);
        d = g;
        c++;
        if (c >= b) break
    }
    c < b && $("div.asset-row:last div:first").append(addAssetRowsLinkHTML);
    return !1
}

function trimExtraAssetRows() {
    for (;;) {
        var a = $("div.asset-row:last");
        if (15 >= parseInt(a.find("input[id^\x3d'allocation']:first").prop("id").match(/\d+/))) break;
        a.remove()
    }
};