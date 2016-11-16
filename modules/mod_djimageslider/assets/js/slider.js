/**
 * @version $Id: slider.js 33 2016-06-28 15:10:53Z szymon $
 * @package DJ-ImageSlider
 * @subpackage DJ-ImageSlider Component
 * @copyright Copyright (C) 2012 DJ-Extensions.com, All rights reserved.
 * @license DJ-Extensions.com Proprietary Use License
 * @author url: http://dj-extensions.com
 * @author email contact@dj-extensions.com
 * @developer Szymon Woronowski - szymon.woronowski@design-joomla.eu
 *
 */
!function (t) {
  var i = {
    init: function (i) {
      function n(i) {
        var n = {x: i.width(), y: i.height()};
        if ((0 == n.x || 0 == n.y) && i.is(":hidden")) {
          for (var s, o, e = i.parent(); e.is(":hidden");)s = e, e = e.parent();
          o = e.width(), s && (o -= parseInt(s.css("margin-left")), o -= parseInt(s.css("margin-right")), o -= parseInt(s.css("border-left-width")), o -= parseInt(s.css("border-right-width")), o -= parseInt(s.css("padding-left")), o -= parseInt(s.css("padding-right")));
          var a = i.clone();
          a.css({
            position:    "absolute",
            visibility:  "hidden",
            "max-width": o
          }), t(document.body).append(a), n = {x: a.width(), y: a.height()}, a.remove()
        }
        return n
      }

      function s() {
        var s = i.parent(), o = n(s).x, e = parseInt(y.css("max-width")), a = n(y), d = a.x;
        d > o ? d = o : o >= d && (!e || e > d) && (d = o > e ? e : o), D[x] || (D[x] = a.x / a.y);
        var r = D[x], u = d / r;
        if (y.css("width", d), y.css("height", u), 2 == g.slider_type)b.css("width", d), w.css("width", d), w.css("height", u); else if (1 == g.slider_type) {
          var h = parseInt(t(w[0]).css("margin-bottom"));
          _ = (u + h) / x, k = w.length * _ + w.length, b.css("height", k), w.css("width", d), w.css("height", _ - h), b.css("top", -_ * j)
        } else {
          var h = "right" == g.direction ? parseInt(t(w[0]).css("margin-left")) : parseInt(t(w[0]).css("margin-right")), p = Math.ceil(d / (g.slide_size + h));
          if (p != x) {
            if (x = p > g.visible_slides ? g.visible_slides : p, I = w.length - x, t("#cust-navigation" + g.id).length) {
              var f = t("#cust-navigation" + g.id).find(".load-button");
              f.each(function (i) {
                var n = t(this);
                i > I ? n.css("display", "none") : n.css("display", "")
              })
            }
            D[x] || (D[x] = (x * _ - h) / a.y), r = D[x], u = d / r, y.css("height", u)
          }
          _ = (d + h) / x, k = w.length * _ + w.length, b.css("width", k), w.css("width", _ - h), w.css("height", u), b.css(g.direction, -_ * j), j > I && c(I)
        }
        (g.show_buttons > 0 || g.show_arrows > 0) && (button_pos = t("#navigation" + g.id).position().top, button_pos < 0 ? (i.css("padding-top", -button_pos), i.css("padding-bottom", 0)) : (buttons_height = 0, g.show_arrows > 0 && (buttons_height = n(t("#next" + g.id)).y, buttons_height = Math.max(buttons_height, n(t("#prev" + g.id)).y)), g.show_buttons > 0 && (buttons_height = Math.max(buttons_height, n(t("#play" + g.id)).y), buttons_height = Math.max(buttons_height, n(t("#pause" + g.id)).y)), padding = button_pos + buttons_height - u, padding > 0 ? (i.css("padding-top", 0), i.css("padding-bottom", padding)) : (i.css("padding-top", 0), i.css("padding-bottom", 0))), buttons_margin = parseInt(t("#navigation" + g.id).css("margin-left")) + parseInt(t("#navigation" + g.id).css("margin-right")), buttons_margin < 0 && n(t(window)).x < n(t("#navigation" + g.id)).x - buttons_margin && (t("#navigation" + g.id).css("margin-left", 0), t("#navigation" + g.id).css("margin-right", 0))), l()
      }

      function o(i) {
        t("#cust-navigation" + g.id).length && E.each(function (n) {
          var s = t(this);
          s.removeClass("load-button-active"), n == i && s.addClass("load-button-active")
        })
      }

      function e() {
        c(I > j ? j + 1 : 0)
      }

      function a() {
        c(j > 0 ? j - 1 : I)
      }

      function c(t) {
        if (j != t) {
          if (2 == g.slider_type) {
            if (P)return;
            P = !0, prev_slide = j, j = t, d(prev_slide)
          } else j = t, 1 == g.slider_type ? m ? b.css("top", -_ * j) : b.animate({top: -_ * j}, f.duration, f.transition) : m ? b.css(g.direction, -_ * j) : "right" == g.direction ? b.animate({right: -_ * j}, f.duration, f.transition) : b.animate({left: -_ * j}, f.duration, f.transition);
          l(), o(j)
        }
      }

      function d(i) {
        t(w[j]).css("visibility", "visible"), m ? (t(w[j]).css("opacity", 1), t(w[i]).css("opacity", 0)) : (t(w[j]).animate({opacity: 1}, f.duration, f.transition), t(w[i]).animate({opacity: 0}, f.duration, f.transition)), setTimeout(function () {
          t(w[i]).css("visibility", "hidden"), P = !1
        }, f.duration)
      }

      function r() {
        C ? (t("#pause" + g.id).css("display", "none"), t("#play" + g.id).css("display", "block")) : (t("#play" + g.id).css("display", "none"), t("#pause" + g.id).css("display", "block"))
      }

      function u() {
        setTimeout(function () {
          C && !M && e(), u()
        }, f.delay)
      }

      function h() {
        i.css("background", "none"), y.css("opacity", 1), g.show_buttons > 0 && (play_width = n(t("#play" + g.id)).x, t("#play" + g.id).css("margin-left", -play_width / 2), pause_width = n(t("#pause" + g.id)).x, t("#pause" + g.id).css("margin-left", -pause_width / 2), C ? t("#play" + g.id).css("display", "none") : t("#pause" + g.id).css("display", "none")), u()
      }

      function p(t) {
        var i = document.body || document.documentElement, n = i.style;
        if ("undefined" == typeof n)return !1;
        if ("string" == typeof n[t])return t;
        v = ["Moz", "Webkit", "Khtml", "O", "ms", "Icab"], pu = t.charAt(0).toUpperCase() + t.substr(1);
        for (var s = 0; s < v.length; s++)if ("string" == typeof n[v[s] + pu])return "-" + v[s].toLowerCase() + "-" + t;
        return !1
      }

      function l() {
        w.each(function (i) {
          var n = t(this).find("a[href], input, select, textarea, button");
          i >= j && i < j + parseInt(x) ? n.each(function () {
            t(this).removeProp("tabindex")
          }) : n.each(function () {
            t(this).prop("tabindex", "-1")
          })
        })
      }

      i.data();
      var g = i.data("djslider"), f = i.data("animation");
      i.removeAttr("data-djslider"), i.removeAttr("data-animation");
      var y = t("#djslider" + g.id).css("opacity", 0), b = t("#slider" + g.id).css("position", "relative"), m = "1" == g.css3 ? p("transition") : !1, w = b.children("li"), _ = g.slide_size, x = g.visible_slides, k = _ * w.length, I = w.length - x, j = 0, C = "1" == f.auto ? 1 : 0, M = 0, P = !1, D = [];
      if (2 == g.slider_type ? (w.css("position", "absolute"), w.css("top", 0), w.css("left", 0), b.css("width", _), w.css("opacity", 0), w.css("visibility", "hidden"), t(w[0]).css("opacity", 1), t(w[0]).css("visibility", "visible"), m && w.css(m, "opacity " + f.duration + "ms " + f.css3transition)) : 1 == g.slider_type ? (b.css("top", 0), b.css("height", k), m && b.css(m, "top " + f.duration + "ms " + f.css3transition)) : (b.css(g.direction, 0), b.css("width", k), m && b.css(m, g.direction + " " + f.duration + "ms " + f.css3transition)), g.show_arrows > 0 && (t("#next" + g.id).on("click", function () {
                "right" == g.direction ? a() : e()
              }).on("keydown", function (t) {
                var i = t.which;
                (13 == i || 32 == i) && ("right" == g.direction ? a() : e(), t.preventDefault(), t.stopPropagation())
              }), t("#prev" + g.id).on("click", function () {
                "right" == g.direction ? e() : a()
              }).on("keydown", function (t) {
                var i = t.which;
                (13 == i || 32 == i) && ("right" == g.direction ? e() : a(), t.preventDefault(), t.stopPropagation())
              })), g.show_buttons > 0 && (t("#play" + g.id).on("click", function () {
                r(), C = 1
              }).on("keydown", function (i) {
                var n = i.which;
                (13 == n || 32 == n) && (r(), C = 1, t("#pause" + g.id).focus(), i.preventDefault(), i.stopPropagation())
              }), t("#pause" + g.id).on("click", function () {
                r(), C = 0
              }).on("keydown", function (i) {
                var n = i.which;
                (13 == n || 32 == n) && (r(), C = 0, t("#play" + g.id).focus(), i.preventDefault(), i.stopPropagation())
              })), i.on("mouseenter", function () {
                M = 1
              }).on("mouseleave", function () {
                i.removeClass("focused"), M = 0
              }).on("focus", function () {
                i.addClass("focused"), i.trigger("mouseenter")
              }).on("keydown", function (t) {
                var i = t.which;
                (37 == i || 39 == i) && (39 == i ? "right" == g.direction ? a() : e() : "right" == g.direction ? e() : a(), t.preventDefault(), t.stopPropagation())
              }), t(".djslider-end").on("focus", function () {
                i.trigger("mouseleave")
              }), i.djswipe(function (t, i) {
                i.x < 50 || i.y > 50 || ("left" == t.x ? "right" == g.direction ? a() : e() : "right" == t.x && ("right" == g.direction ? e() : a()))
              }), t("#cust-navigation" + g.id).length)
      {
        var E = t("#cust-navigation" + g.id).find(".load-button");
        E.each(function (i) {
          var n = t(this);
          n.on("click", function (t) {
            P || n.hasClass("load-button-active") || c(i)
          }).on("keydown", function (t) {
            var s = t.which;
            (13 == s || 32 == s) && (P || n.hasClass("load-button-active") || c(i), t.preventDefault(), t.stopPropagation())
          }), i > I && n.css("display", "none")
        })
      }
      g.preload ? setTimeout(h, g.preload) : t(window).load(h), s(), t(window).on("resize", s), t(window).on("load", s)
    }
  };
  t.fn.djswipe = t.fn.djswipe || function (i) {
            function n(t) {
              var i, n, s = t.originalEvent.changedTouches || e.originalEvent.touches, a = s[0].pageX, c = s[0].pageY;
              return i = a > o.x ? "right" : "left", n = c > o.y ? "down" : "up", {
                direction: {x: i, y: n},
                offset:    {
                  x: Math.abs(a - o.x),
                  y: Math.abs(o.y - c)
                }
              }
            }

            var s = !1, o = null, a = null;
            return $el = t(this), $el.on("touchstart", function (t) {
              s = !0;
              var i = t.originalEvent.changedTouches || e.originalEvent.touches;
              o = {x: i[0].pageX, y: i[0].pageY}
            }), $el.on("touchend", function () {
              s = !1, a && i(a.direction, a.offset), o = null, a = null
            }), $el.on("touchmove", function (t) {
              s && (a = n(t))
            }), !0
          }, t(document).ready(function () {
    t("[data-djslider]").each(function () {
      i.init(t(this))
    })
  })
}(jQuery);