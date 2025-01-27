var O = Object.defineProperty;
var U = (o, t, e) =>
  t in o
    ? O(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e })
    : (o[t] = e);
var c = (o, t, e) => U(o, typeof t != "symbol" ? t + "" : t, e);
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) i(n);
  new MutationObserver((n) => {
    for (const r of n)
      if (r.type === "childList")
        for (const a of r.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && i(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(n) {
    const r = {};
    return (
      n.integrity && (r.integrity = n.integrity),
      n.referrerPolicy && (r.referrerPolicy = n.referrerPolicy),
      n.crossOrigin === "use-credentials"
        ? (r.credentials = "include")
        : n.crossOrigin === "anonymous"
        ? (r.credentials = "omit")
        : (r.credentials = "same-origin"),
      r
    );
  }
  function i(n) {
    if (n.ep) return;
    n.ep = !0;
    const r = e(n);
    fetch(n.href, r);
  }
})();
const A = "data-slot",
  f = "data-preserve",
  w = "data-intercepted",
  P = "data-nointercepted",
  u = "data-prefetch",
  g = "data-prefetched";
var h = ((o) => (
    (o.GET = "GET"),
    (o.POST = "POST"),
    (o.PUT = "PUT"),
    (o.PATCH = "PATCH"),
    (o.DELETE = "DELETE"),
    o
  ))(h || {}),
  E = ((o) => (
    (o.HTML = "text/html"),
    (o.JSON = "application/json"),
    (o.TEXT = "text/plain"),
    o
  ))(E || {}),
  s = ((o) => (
    (o.IsLoading = "is-loading"),
    (o.IsIndeterminate = "is-indeterminate"),
    (o.BeforeLoading = "before-loading"),
    (o.AfterLoading = "after-loading"),
    o
  ))(s || {});
function L(o, t) {
  t.replaceChildren(...Array.from(o.children).map((e) => e.cloneNode(!0)));
}
function I(o) {
  return o
    ? new DOMParser().parseFromString(o, "text/html")
    : document.implementation.createHTMLDocument();
}
function y(o, t) {
  document.dispatchEvent(new CustomEvent(o, t));
}
class S {
  constructor() {
    c(this, "config", {});
  }
  async load(t, e = h.GET, i, n) {
    if (!t) return console.error("URL is required to load HTML"), "";
    try {
      const r = await fetch(t, {
        method: e,
        headers: { "Content-Type": E.HTML },
        ...(i ? { body: JSON.stringify(i) } : {}),
        ...n,
      });
      if (!r.ok) throw new Error(`Failed to load ${t}: ${r.statusText}`);
      return await r.text();
    } catch (r) {
      return console.error("Error loading HTML: ", r), "";
    }
  }
  async loadHTMLDocument(t, e = h.GET, i, n) {
    const r = await this.load(t, e, i, n);
    return I(r);
  }
  async firstToMatch(t, e) {
    for (const i of t) {
      const n = await this.load(i);
      if (n && e(n)) return n;
    }
    return console.error("None of the urls could be loaded"), "";
  }
}
class D {
  constructor() {
    c(this, "currentLayouts", []);
    c(this, "loadedLayouts", []);
  }
  resetLayouts() {
    this.currentLayouts = [];
  }
  render(t, e, i) {
    const n = e;
    if (!i) throw new Error("layout is required");
    this.currentLayouts.push(n),
      !this.isAlreadyRendered(n) &&
        (this.loadedLayouts.push(n),
        this._copyElementAttributes(i.body, t.body),
        this._replaceContent(i.body, t.body));
  }
  replaceSlotContents(t) {
    document.querySelectorAll("slot").forEach((i) => {
      const n = i.getAttribute("name") || "default",
        r = t.find((a) => a.slot === n);
      r && i.innerHTML !== r.content.innerHTML && L(r.content, i);
    });
  }
  isAlreadyRendered(t) {
    return this.loadedLayouts.includes(t);
  }
  getSlotsContents(t) {
    const e = [];
    return (
      t.querySelectorAll(`slot, [slot], [${A}]`).forEach((n) => {
        const r = n.getAttribute("slot") || n.getAttribute(A) || "default";
        e.push({ slot: r, content: n });
      }),
      e
    );
  }
  _copyElementAttributes(t, e) {
    Array.from(t.attributes).forEach((i) => {
      e.setAttribute(i.name, i.value);
    });
  }
  mergeHeads(t, e) {
    const i = t.head,
      n = e.head;
    if (i.innerHTML) {
      if (i.innerHTML && !n.innerHTML) {
        L(i, n);
        return;
      }
      this._mergeElements(i, n);
    }
  }
  _mergeElements(t, e) {
    const i = e.innerHTML;
    Array.from(t.children).forEach((n) => {
      if (this._elementIsPapelScript(n)) return;
      const r = n.outerHTML;
      i.includes(r) || e.appendChild(n);
    });
  }
  consolidateLayouts() {
    const t = new Set(this.currentLayouts),
      e = new Set(this.loadedLayouts);
    this.currentLayouts
      .filter((n) => !e.has(n))
      .forEach((n) => {
        const r = document.querySelector(`link[href$="${n}"]`);
        r == null || r.remove();
      }),
      (this.loadedLayouts = Array.from(t)),
      (this.currentLayouts = []);
  }
  _replaceContent(t, e) {
    const i = e.querySelectorAll(`[${f}]`),
      n = new Map();
    i.forEach((r, a) => {
      const d = r.getAttribute(f) ?? `preserve-${a}`;
      n.set(d, r);
    }),
      L(t, e),
      n.forEach((r, a) => {
        const d = e.querySelector(`[${f}="${a}"]`);
        d ? d.replaceWith(r) : e.insertBefore(r, e.firstChild);
      });
  }
  _elementIsPapelScript(t) {
    var e;
    return (
      t.tagName === "SCRIPT" &&
      !!((e = t.getAttribute("src")) != null && e.includes("papel"))
    );
  }
}
class M {
  constructor() {
    c(this, "navigationCallback");
    c(this, "scrollPositions");
    (this.navigationCallback = async () => {}),
      (this.scrollPositions = new Map()),
      window.addEventListener("popstate", (t) => {
        const e = new URL(location.href);
        this._handlePopState(e, t);
      });
  }
  onNavigate(t) {
    this.navigationCallback = t;
  }
  startInterception(t) {
    this._interceptLinks(t);
  }
  _isNavigationAvailable() {
    return "navigation" in window && typeof window.navigation < "u";
  }
  _isLocalUrl(t) {
    return t.origin === location.origin;
  }
  _shouldIntercept(t) {
    return this._isLocalUrl(t) && !!this.navigationCallback;
  }
  _interceptLinks(t) {
    t.querySelectorAll(`a:not([${w}]):not([${P}]):not([target])`).forEach(
      (e) => {
        if (e instanceof HTMLAnchorElement) {
          if (!this._shouldIntercept(new URL(e.href))) {
            e.setAttribute(P, "true");
            return;
          }
          e.setAttribute(w, "true"),
            e.addEventListener("click", (i) =>
              this._handleLinkClick.bind(this)(i, e)
            );
        }
      }
    );
  }
  async _handleLinkClick(t, e) {
    t.preventDefault(), this.navigate(e.href);
  }
  navigate(t) {
    const e = new URL(t);
    if (this._shouldIntercept(e)) {
      if (
        (this.scrollPositions.set(location.href, {
          x: window.scrollX,
          y: window.scrollY,
        }),
        this._addNavigationToBrowserHistory(e),
        this._isNavigationAvailable())
      ) {
        document.startViewTransition(() => this._handleNavigation(e));
        return;
      }
      this._handleNavigation(e);
    }
  }
  _addNavigationToBrowserHistory(t) {
    window.history.pushState({}, "", t);
  }
  async _handleNavigation(t) {
    await this.navigationCallback(t), this._restoreScrollPosition(t);
  }
  _handlePopState(t, e) {
    if (this._shouldIntercept(t)) {
      if ((e.preventDefault(), this._isNavigationAvailable())) {
        document.startViewTransition(() => this._handleNavigation(t));
        return;
      }
      this._handleNavigation(t);
    }
  }
  _restoreScrollPosition(t) {
    window.scrollTo(0, 0);
  }
}
class C {
  constructor(t) {
    c(this, "loadedUrls", []);
    this.htmlLoader = t;
  }
  startPrefetch(t) {
    this._addObserverToLinks(t, async (e) => {
      const i = e.getAttribute(u);
      if (i !== "all") {
        this._prefetchRequest(e.href);
        return;
      }
      if (i === "all") {
        const n = await this._prefetchRequest(e.href),
          a = new DOMParser().parseFromString(n, "text/html");
        this.imagePrefetch(a), this.templateImagePrefetch(a);
      }
    });
  }
  imagePrefetch(t) {
    t.querySelectorAll(`img[${u}]`).forEach((i) => {
      this._prefetchRequest(i.src), this.loadedUrls.push(i.src);
    });
  }
  templateImagePrefetch(t) {
    t.querySelectorAll("template").forEach((i) => {
      this.imagePrefetch(i.content);
    });
  }
  _addObserverToLinks(t, e) {
    const i = this._getIntersectionObserver(e);
    t.querySelectorAll(`a[${u}]:not([${u}="none"]):not([${g}])`).forEach(
      (r) => {
        if (this._isLocalLink(r)) {
          if (this._isAlreadyPrefetched(r)) {
            r.setAttribute(g, "true");
            return;
          }
          i.observe(r);
        }
      }
    );
  }
  _getIntersectionObserver(t) {
    return new IntersectionObserver((e) => {
      e.forEach((i) => {
        if (i.isIntersecting) {
          const n = i.target;
          if ((n.setAttribute(g, "true"), this._isAlreadyPrefetched(n))) return;
          t(n), this.loadedUrls.push(n.href);
        }
      });
    });
  }
  _isAlreadyPrefetched(t) {
    return this.loadedUrls.includes(t.href);
  }
  _isLocalLink(t) {
    return t.hostname === window.location.hostname;
  }
  async _prefetchRequest(t) {
    return this.htmlLoader.load(t, h.GET, void 0, { priority: "low" });
  }
}
class N {
  constructor() {
    c(this, "currentPath");
    c(this, "cumulativePaths");
    c(this, "allLinks");
    (this.currentPath = this.normalizePath(window.location.pathname)),
      (this.cumulativePaths = this.getCumulativePaths()),
      (this.allLinks = document.querySelectorAll("a"));
  }
  normalizePath(t) {
    return t.endsWith("/") ? t.slice(0, -1) : t;
  }
  ensureIndexPath(t) {
    return /\.[a-zA-Z0-9]+$/.test(t) ? t : `${t}/index.html`;
  }
  getCumulativePaths() {
    return this.currentPath
      .split("/")
      .filter((e) => e !== "")
      .reduce((e, i) => {
        const n = e.length > 0 ? e[e.length - 1] : "";
        return e.push(`${n}/${i}`), e;
      }, []);
  }
  getMatchingLinks() {
    return this.allLinks
      ? Array.from(this.allLinks).filter((t) => {
          const e = this.normalizePath(
              new URL(t.href, window.location.origin).pathname
            ),
            i = this.ensureIndexPath(e),
            n = this.ensureIndexPath(this.currentPath);
          return this.cumulativePaths.includes(e) || i === n;
        })
      : [];
  }
  clearPreviousMatches() {
    var t;
    (t = this.allLinks) == null ||
      t.forEach((e) => e.classList.remove("pl-path-match"));
  }
  highlightMatchingLinks(t) {
    (this.currentPath = this.normalizePath(window.location.pathname)),
      (this.cumulativePaths = this.getCumulativePaths()),
      (this.allLinks = t.querySelectorAll("a")),
      this.clearPreviousMatches(),
      this.getMatchingLinks().forEach((i) => {
        i.classList.add("pl-path-match");
      });
  }
}
class H {
  constructor() {
    c(this, "startAnimationTimeout", null);
  }
  startLoadingAnimation() {
    document.body.classList.contains(s.IsLoading) ||
      document.body.classList.contains(s.BeforeLoading) ||
      document.body.classList.contains(s.IsIndeterminate) ||
      (this.startAnimationTimeout &&
        (clearTimeout(this.startAnimationTimeout),
        (this.startAnimationTimeout = null)),
      document.body.classList.add(s.BeforeLoading),
      (this.startAnimationTimeout = setTimeout(() => {
        this.triggerLoadingAnimation();
      }, 200)));
  }
  triggerLoadingAnimation() {
    document.body.classList.add(s.IsLoading),
      document.body.classList.remove(s.BeforeLoading),
      (this.startAnimationTimeout = setTimeout(() => {
        document.body.classList.add(s.IsIndeterminate);
      }, 2e3));
  }
  stopLoadingAnimation() {
    this.startAnimationTimeout &&
      (clearTimeout(this.startAnimationTimeout),
      (this.startAnimationTimeout = null)),
      (document.body.classList.contains(s.IsLoading) ||
        document.body.classList.contains(s.IsIndeterminate)) &&
        (document.body.classList.add(s.AfterLoading),
        setTimeout(() => {
          document.body.classList.remove(s.AfterLoading);
        }, 500)),
      document.body.classList.remove(s.IsLoading),
      document.body.classList.remove(s.BeforeLoading),
      document.body.classList.remove(s.IsIndeterminate);
  }
}
const v = new S(),
  l = new D(),
  b = new M(),
  x = new C(v),
  B = new N(),
  m = new H();
async function T() {
  m.startLoadingAnimation();
  const o = l.getSlotsContents(document),
    t = R(document),
    e = !!t;
  e && (await $(t)),
    l.replaceSlotContents(o),
    e && (await T()),
    m.stopLoadingAnimation(),
    q(document),
    e || y("page-loaded");
}
async function k(o) {
  m.startLoadingAnimation(), l.resetLayouts();
  const t = await z(o),
    e = l.getSlotsContents(t),
    i = R(t),
    n = !!i;
  n && (l.mergeHeads(t, document), await $(i)),
    l.replaceSlotContents(e),
    n && (await T()),
    l.consolidateLayouts(),
    m.stopLoadingAnimation(),
    q(document),
    n || y("page-loaded");
}
async function z(o) {
  const t = await v.load(o.toString());
  return I(t);
}
function R(o) {
  const t = o.querySelector('link[rel="preload"]'),
    e = (t == null ? void 0 : t.getAttribute("href")) || "";
  return e && (t == null || t.remove()), e;
}
async function $(o) {
  const t = await v.loadHTMLDocument(o);
  l.render(document, o, t),
    l.mergeHeads(t, document),
    y("layout-rendered", { layoutUrl: o });
}
function q(o) {
  b.startInterception(o),
    b.onNavigate(k),
    x.startPrefetch(o),
    B.highlightMatchingLinks(o);
}
const G = new S(),
  p = new M(),
  F = new C(G),
  V = new N(),
  _ = new H(),
  J = {
    interceptLinks(o) {
      p.startInterception(o), p.onNavigate(k);
    },
    prefetchLinks(o) {
      F.startPrefetch(o);
    },
    highlightMatchingLinks(o) {
      V.highlightMatchingLinks(o);
    },
    navigate(o) {
      p.navigate(o);
    },
    startLoading() {
      _.startLoadingAnimation();
    },
    stopLoading() {
      _.stopLoadingAnimation();
    },
  };
window.addEventListener(
  "load",
  () => {
    T();
  },
  { once: !0 }
);
window.papel = J;
