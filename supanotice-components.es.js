/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a;
const t$2 = globalThis, e$2 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$2 = Symbol(), o$4 = /* @__PURE__ */ new WeakMap();
let n$3 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$2 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$4.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$4.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$4 = (t2) => new n$3("string" == typeof t2 ? t2 : t2 + "", void 0, s$2), i$3 = (t2, ...e2) => {
  const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
    if (true === t3._$cssResult$) return t3.cssText;
    if ("number" == typeof t3) return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[o3 + 1], t2[0]);
  return new n$3(o2, t2, s$2);
}, S$1 = (s2, o2) => {
  if (e$2) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t$2.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$2 = e$2 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$4(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$2, defineProperty: e$1, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$3, getOwnPropertySymbols: o$3, getPrototypeOf: n$2 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$1 = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l$1 : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i2 = t2;
  switch (s2) {
    case Boolean:
      i2 = null !== t2;
      break;
    case Number:
      i2 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i2 = JSON.parse(t2);
      } catch (t3) {
        i2 = null;
      }
  }
  return i2;
} }, f$1 = (t2, s2) => !i$2(t2, s2), b = { attribute: true, type: String, converter: u$1, reflect: false, useDefault: false, hasChanged: f$1 };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a$1.litPropertyMetadata ?? (a$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let y$1 = class y extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = b) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i2 = Symbol(), h2 = this.getPropertyDescriptor(t2, i2, s2);
      void 0 !== h2 && e$1(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s2, i2) {
    const { get: e2, set: r2 } = h$1(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get: e2, set(s3) {
      const h2 = e2 == null ? void 0 : e2.call(this);
      r2 == null ? void 0 : r2.call(this, s3), this.requestUpdate(t2, h2, i2);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties"))) return;
    const t2 = n$2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t3 = this.properties, s2 = [...r$3(t3), ...o$3(t3)];
      for (const i2 of s2) this.createProperty(i2, t3[i2]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i2 = this._$Eu(t3, s2);
      void 0 !== i2 && this._$Eh.set(i2, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i2 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i2.unshift(c$2(s3));
    } else void 0 !== s2 && i2.push(c$2(s2));
    return i2;
  }
  static _$Eu(t2, s2) {
    const i2 = s2.attribute;
    return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a2;
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a2 = this.constructor.l) == null ? void 0 : _a2.forEach((t2) => t2(this));
  }
  addController(t2) {
    var _a2;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_a2 = t2.hostConnected) == null ? void 0 : _a2.call(t2));
  }
  removeController(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    var _a2;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostConnected) == null ? void 0 : _a3.call(t2);
    });
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostDisconnected) == null ? void 0 : _a3.call(t2);
    });
  }
  attributeChangedCallback(t2, s2, i2) {
    this._$AK(t2, i2);
  }
  _$ET(t2, s2) {
    var _a2;
    const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
    if (void 0 !== e2 && true === i2.reflect) {
      const h2 = (void 0 !== ((_a2 = i2.converter) == null ? void 0 : _a2.toAttribute) ? i2.converter : u$1).toAttribute(s2, i2.type);
      this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    var _a2, _b;
    const i2 = this.constructor, e2 = i2._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i2.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u$1;
      this._$Em = e2, this[e2] = h2.fromAttribute(s2, t3.type) ?? ((_b = this._$Ej) == null ? void 0 : _b.get(e2)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i2) {
    var _a2;
    if (void 0 !== t2) {
      const e2 = this.constructor, h2 = this[t2];
      if (i2 ?? (i2 = e2.getPropertyOptions(t2)), !((i2.hasChanged ?? f$1)(h2, s2) || i2.useDefault && i2.reflect && h2 === ((_a2 = this._$Ej) == null ? void 0 : _a2.get(t2)) && !this.hasAttribute(e2._$Eu(t2, i2)))) return;
      this.C(t2, s2, i2);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t2, s2, { useDefault: i2, reflect: e2, wrapped: h2 }, r2) {
    i2 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i2 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t2));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a2;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i2] of t3) {
        const { wrapped: t4 } = i2, e2 = this[s3];
        true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i2, e2);
      }
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
        var _a3;
        return (_a3 = t3.hostUpdate) == null ? void 0 : _a3.call(t3);
      }), this.update(s2)) : this._$EM();
    } catch (s3) {
      throw t2 = false, this._$EM(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
      var _a3;
      return (_a3 = t3.hostUpdated) == null ? void 0 : _a3.call(t3);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t3) => this._$ET(t3, this[t3]))), this._$EM();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1 == null ? void 0 : p$1({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ?? (a$1.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis, i$1 = t$1.trustedTypes, s$1 = i$1 ? i$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, e = "$lit$", h = `lit$${Math.random().toFixed(9).slice(2)}$`, o$2 = "?" + h, n$1 = `<${o$2}>`, r$2 = document, l = () => r$2.createComment(""), c = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, a = Array.isArray, u = (t2) => a(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), d = "[ 	\n\f\r]", f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, v = /-->/g, _ = />/g, m = RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), p = /'/g, g = /"/g, $ = /^(?:script|style|textarea|title)$/i, y2 = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), x = y2(1), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), A = /* @__PURE__ */ new WeakMap(), C = r$2.createTreeWalker(r$2, 129);
function P(t2, i2) {
  if (!a(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== s$1 ? s$1.createHTML(i2) : i2;
}
const V = (t2, i2) => {
  const s2 = t2.length - 1, o2 = [];
  let r2, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = f;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let a2, u2, d2 = -1, y3 = 0;
    for (; y3 < s3.length && (c2.lastIndex = y3, u2 = c2.exec(s3), null !== u2); ) y3 = c2.lastIndex, c2 === f ? "!--" === u2[1] ? c2 = v : void 0 !== u2[1] ? c2 = _ : void 0 !== u2[2] ? ($.test(u2[2]) && (r2 = RegExp("</" + u2[2], "g")), c2 = m) : void 0 !== u2[3] && (c2 = m) : c2 === m ? ">" === u2[0] ? (c2 = r2 ?? f, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? m : '"' === u2[3] ? g : p) : c2 === g || c2 === p ? c2 = m : c2 === v || c2 === _ ? c2 = f : (c2 = m, r2 = void 0);
    const x2 = c2 === m && t2[i3 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === f ? s3 + n$1 : d2 >= 0 ? (o2.push(a2), s3.slice(0, d2) + e + s3.slice(d2) + h + x2) : s3 + h + (-2 === d2 ? i3 : x2);
  }
  return [P(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), o2];
};
class N {
  constructor({ strings: t2, _$litType$: s2 }, n3) {
    let r2;
    this.parts = [];
    let c2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = V(t2, s2);
    if (this.el = N.createElement(f2, n3), C.currentNode = this.el.content, 2 === s2 || 3 === s2) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = C.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(e)) {
          const i2 = v2[a2++], s3 = r2.getAttribute(t3).split(h), e2 = /([.?@])?(.*)/.exec(i2);
          d2.push({ type: 1, index: c2, name: e2[2], strings: s3, ctor: "." === e2[1] ? H : "?" === e2[1] ? I : "@" === e2[1] ? L : k }), r2.removeAttribute(t3);
        } else t3.startsWith(h) && (d2.push({ type: 6, index: c2 }), r2.removeAttribute(t3));
        if ($.test(r2.tagName)) {
          const t3 = r2.textContent.split(h), s3 = t3.length - 1;
          if (s3 > 0) {
            r2.textContent = i$1 ? i$1.emptyScript : "";
            for (let i2 = 0; i2 < s3; i2++) r2.append(t3[i2], l()), C.nextNode(), d2.push({ type: 2, index: ++c2 });
            r2.append(t3[s3], l());
          }
        }
      } else if (8 === r2.nodeType) if (r2.data === o$2) d2.push({ type: 2, index: c2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r2.data.indexOf(h, t3 + 1)); ) d2.push({ type: 7, index: c2 }), t3 += h.length - 1;
      }
      c2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = r$2.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function S(t2, i2, s2 = t2, e2) {
  var _a2, _b;
  if (i2 === T) return i2;
  let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
  const o2 = c(i2) ? void 0 : i2._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = S(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
}
class M {
  constructor(t2, i2) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? r$2).importNode(i2, true);
    C.currentNode = e2;
    let h2 = C.nextNode(), o2 = 0, n3 = 0, l2 = s2[0];
    for (; void 0 !== l2; ) {
      if (o2 === l2.index) {
        let i3;
        2 === l2.type ? i3 = new R(h2, h2.nextSibling, this, t2) : 1 === l2.type ? i3 = new l2.ctor(h2, l2.name, l2.strings, this, t2) : 6 === l2.type && (i3 = new z(h2, this, t2)), this._$AV.push(i3), l2 = s2[++n3];
      }
      o2 !== (l2 == null ? void 0 : l2.index) && (h2 = C.nextNode(), o2++);
    }
    return C.currentNode = r$2, e2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
}
class R {
  get _$AU() {
    var _a2;
    return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
  }
  constructor(t2, i2, s2, e2) {
    this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (e2 == null ? void 0 : e2.isConnected) ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = S(this, t2, i2), c(t2) ? t2 === E || null == t2 || "" === t2 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t2 !== this._$AH && t2 !== T && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : u(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== E && c(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(r$2.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    var _a2;
    const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = N.createElement(P(s2.h, s2.h[0]), this.options)), s2);
    if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2) this._$AH.p(i2);
    else {
      const t3 = new M(e2, this), s3 = t3.u(this.options);
      t3.p(i2), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = A.get(t2.strings);
    return void 0 === i2 && A.set(t2.strings, i2 = new N(t2)), i2;
  }
  k(t2) {
    a(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new R(this.O(l()), this.O(l()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, i2) {
    var _a2;
    for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, i2); t2 && t2 !== this._$AB; ) {
      const i3 = t2.nextSibling;
      t2.remove(), t2 = i3;
    }
  }
  setConnected(t2) {
    var _a2;
    void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
  }
}
class k {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i2, s2, e2, h2) {
    this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = E;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = S(this, t2, i2, 0), o2 = !c(t2) || t2 !== this._$AH && t2 !== T, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r2 = S(this, e3[s2 + n3], i2, n3), r2 === T && (r2 = this._$AH[n3]), o2 || (o2 = !c(r2) || r2 !== this._$AH[n3]), r2 === E ? t2 = E : t2 !== E && (t2 += (r2 ?? "") + h2[n3 + 1]), this._$AH[n3] = r2;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
}
class H extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === E ? void 0 : t2;
  }
}
class I extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== E);
  }
}
class L extends k {
  constructor(t2, i2, s2, e2, h2) {
    super(t2, i2, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    if ((t2 = S(this, t2, i2, 0) ?? E) === T) return;
    const s2 = this._$AH, e2 = t2 === E && s2 !== E || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== E && (s2 === E || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var _a2;
    "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class z {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    S(this, t2);
  }
}
const j = t$1.litHtmlPolyfillSupport;
j == null ? void 0 : j(N, R), (t$1.litHtmlVersions ?? (t$1.litHtmlVersions = [])).push("3.3.0");
const B = (t2, i2, s2) => {
  const e2 = (s2 == null ? void 0 : s2.renderBefore) ?? i2;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = (s2 == null ? void 0 : s2.renderBefore) ?? null;
    e2._$litPart$ = h2 = new R(i2.insertBefore(l(), t3), t3, void 0, s2 ?? {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s = globalThis;
class i extends y$1 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a2;
    const t2 = super.createRenderRoot();
    return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t2.firstChild), t2;
  }
  update(t2) {
    const r2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = B(r2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _a2;
    super.connectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(true);
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(false);
  }
  render() {
    return T;
  }
}
i._$litElement$ = true, i["finalized"] = true, (_a = s.litElementHydrateSupport) == null ? void 0 : _a.call(s, { LitElement: i });
const o$1 = s.litElementPolyfillSupport;
o$1 == null ? void 0 : o$1({ LitElement: i });
(s.litElementVersions ?? (s.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = (t2) => (e2, o2) => {
  void 0 !== o2 ? o2.addInitializer(() => {
    customElements.define(t2, e2);
  }) : customElements.define(t2, e2);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 }, r$1 = (t2 = o, e2, r2) => {
  const { kind: n3, metadata: i2 } = r2;
  let s2 = globalThis.litPropertyMetadata.get(i2);
  if (void 0 === s2 && globalThis.litPropertyMetadata.set(i2, s2 = /* @__PURE__ */ new Map()), "setter" === n3 && ((t2 = Object.create(t2)).wrapped = true), s2.set(r2.name, t2), "accessor" === n3) {
    const { name: o2 } = r2;
    return { set(r3) {
      const n4 = e2.get.call(this);
      e2.set.call(this, r3), this.requestUpdate(o2, n4, t2);
    }, init(e3) {
      return void 0 !== e3 && this.C(o2, void 0, t2, e3), e3;
    } };
  }
  if ("setter" === n3) {
    const { name: o2 } = r2;
    return function(r3) {
      const n4 = this[o2];
      e2.call(this, r3), this.requestUpdate(o2, n4, t2);
    };
  }
  throw Error("Unsupported decorator location: " + n3);
};
function n2(t2) {
  return (e2, o2) => "object" == typeof o2 ? r$1(t2, e2, o2) : ((t3, e3, o3) => {
    const r2 = e3.hasOwnProperty(o3);
    return e3.constructor.createProperty(o3, t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
  })(t2, e2, o2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function r(r2) {
  return n2({ ...r2, state: true, attribute: false });
}
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
let SupanoticeWidget = class extends i {
  constructor() {
    super(...arguments);
    this.widgetId = "default";
    this.previewMode = false;
    this.refreshKey = "";
    this.apiEndpoint = "https://supanotice.com";
    this.widgetSettings = {
      title: "What's New",
      backgroundColor: "#4f46e5",
      // Default indigo color
      color: "#ffffff",
      // White color for icons and text
      maxItems: 10
    };
    this.isLoading = false;
    this.errorMessage = null;
    this.publications = [];
    this.LOCAL_STORAGE_KEY = "supanotice-read-publications";
    this.publicationViewTimes = /* @__PURE__ */ new Map();
    this.viewTimer = null;
    this._boundUpdateViewportHeight = this.updateViewportHeight.bind(this);
    this.handleExternalClick = (event) => {
      const target = event.target;
      if (!target) return;
      const el = target.closest("[data-supanotice-open],[data-supanotice-toggle],[data-supanotice-close]");
      if (!el) return;
      const selector = el.getAttribute("data-supanotice-target");
      if (selector) {
        const selected = document.querySelector(selector);
        if (selected !== this) return;
      } else {
        const targetId = el.getAttribute("data-supanotice-widget");
        if (!targetId) {
          const widgets = document.querySelectorAll("supanotice-widget");
          if (widgets.length > 1) return;
        } else if (targetId !== this.widgetId) {
          return;
        }
      }
      const anchor = el.closest("a");
      if (anchor) {
        event.preventDefault();
      }
      if (el.hasAttribute("data-supanotice-open")) {
        this.open();
      } else if (el.hasAttribute("data-supanotice-close")) {
        this.close();
      } else {
        this.toggle();
      }
    };
    this.isOpen = false;
    this.expandedPublications = /* @__PURE__ */ new Set();
    this.showSubscribeModal = false;
    this.subscribeEmail = "";
    this.subscribeLoading = false;
    this.subscribeError = null;
    this.subscribeSuccess = false;
    this.subscribeMessage = null;
  }
  /**
   * Lifecycle callback when element is connected to DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.fetchWidgetConfiguration();
    this.updateViewportHeight();
    window.addEventListener("resize", this._boundUpdateViewportHeight);
    window.addEventListener("orientationchange", this._boundUpdateViewportHeight);
    document.addEventListener("click", this.handleExternalClick);
  }
  /**
   * Clean up any global listeners when element is disconnected
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this._boundUpdateViewportHeight);
    window.removeEventListener("orientationchange", this._boundUpdateViewportHeight);
    document.removeEventListener("click", this.handleExternalClick);
  }
  /**
   * Updates the CSS variable for viewport height to handle mobile browsers
   * with dynamic toolbars like Safari
   */
  updateViewportHeight() {
    const vh = window.innerHeight * 0.01;
    this.style.setProperty("--vh", `${vh}px`);
  }
  /**
   * Safely build absolute API URLs from the configured apiEndpoint
   */
  buildApiUrl(path) {
    const base = (this.apiEndpoint || "").replace(/\/$/, "");
    return `${base}${path}`;
  }
  /**
   * Called when an observed property changes.
   * Detects changes to the refresh-key property and reloads the configuration.
   */
  updated(changedProperties) {
    if (changedProperties.has("refreshKey")) {
      this.fetchWidgetConfiguration();
    }
    this.setupAttachmentLinks();
  }
  /**
   * Fetches widget configuration from the API
   */
  async fetchWidgetConfiguration() {
    if (!this.widgetId) return;
    this.isLoading = true;
    this.errorMessage = null;
    try {
      const response = await fetch(this.buildApiUrl(`/api/v1/widgets/${this.widgetId}`));
      if (!response.ok) {
        throw new Error(`Failed to fetch widget configuration: ${response.statusText}`);
      }
      const data = await response.json();
      this.widgetSettings = {
        ...this.widgetSettings,
        title: data.title || this.widgetSettings.title,
        color: data.color || this.widgetSettings.color,
        backgroundColor: data.background_color || this.widgetSettings.backgroundColor,
        newspage_url: data.newspage_url || this.widgetSettings.newspage_url,
        projectName: data.project_name || this.widgetSettings.projectName,
        projectId: data.project_id || this.widgetSettings.projectId
      };
      if (data.publications) {
        this.publications = data.publications;
      }
    } catch (error) {
      console.error("Error fetching widget configuration:", error);
      this.errorMessage = error instanceof Error ? error.message : "Unknown error";
    } finally {
      this.isLoading = false;
    }
  }
  openSubscribeModal() {
    this.subscribeEmail = "";
    this.subscribeError = null;
    this.subscribeSuccess = false;
    this.showSubscribeModal = true;
  }
  closeSubscribeModal() {
    this.showSubscribeModal = false;
    this.subscribeLoading = false;
  }
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  async submitSubscription(e2) {
    var _a2;
    e2 == null ? void 0 : e2.preventDefault();
    this.subscribeError = null;
    this.subscribeSuccess = false;
    this.subscribeMessage = null;
    const email = (this.subscribeEmail || "").trim();
    if (!this.isValidEmail(email)) {
      this.subscribeError = "Please enter a valid email address.";
      return;
    }
    this.subscribeLoading = true;
    try {
      const url = this.widgetSettings.projectId ? this.buildApiUrl(`/api/v1/projects/${this.widgetSettings.projectId}/subscribers`) : this.buildApiUrl(`/api/v1/widgets/${this.widgetId}/subscriptions`);
      console.debug("Supanotice subscription request", {
        url,
        projectId: this.widgetSettings.projectId,
        widgetId: this.widgetId
      });
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email })
      });
      let payload = null;
      try {
        payload = await res.json();
      } catch {
      }
      if (res.status === 201) {
        this.subscribeSuccess = true;
        this.subscribeMessage = (payload == null ? void 0 : payload.message) || "Subscription successful. Please check your email to confirm your subscription.";
        return;
      }
      if (res.status === 409) {
        this.subscribeError = (payload == null ? void 0 : payload.error) || "Email address is already subscribed to this project";
        return;
      }
      if (res.status === 422) {
        const emailErrors = (_a2 = payload == null ? void 0 : payload.details) == null ? void 0 : _a2.email;
        this.subscribeError = emailErrors && emailErrors.length > 0 ? emailErrors[0] : (payload == null ? void 0 : payload.error) || "Validation failed";
        return;
      }
      if (res.status === 404) {
        this.subscribeError = (payload == null ? void 0 : payload.error) || "Project not found";
        return;
      }
      if (res.status === 400) {
        this.subscribeError = (payload == null ? void 0 : payload.error) || "Missing required parameters: project_id and email";
        return;
      }
      this.subscribeError = (payload == null ? void 0 : payload.error) || "Unable to subscribe right now. Please try again later.";
    } catch (err) {
      console.error("Supanotice subscription network error", err);
      this.subscribeError = err instanceof TypeError ? "Network error (possibly CORS or connectivity). Please verify your API endpoint and CORS configuration." : err instanceof Error ? err.message : "Something went wrong.";
    } finally {
      this.subscribeLoading = false;
    }
  }
  renderSubscribeModal() {
    const title = "Subscribe to Updates";
    const projectName = this.widgetSettings.projectName || this.widgetSettings.title;
    const subtitle = `Get notified when ${projectName} publishes new updates.`;
    const canSubmit = this.isValidEmail(this.subscribeEmail) && !this.subscribeLoading;
    return x`
      <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="subscribe-title" @click=${() => this.closeSubscribeModal()}>
        <div class="modal-card" @click=${(e2) => e2.stopPropagation()}>
          <button class="modal-close" @click=${() => this.closeSubscribeModal()} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4b5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <h3 id="subscribe-title" class="modal-title">${title}</h3>
          <p class="modal-subtitle">${subtitle}</p>

          ${this.subscribeSuccess ? x`
            <div class="success-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>${this.subscribeMessage || "Thanks! You're subscribed."}</span>
            </div>
          ` : x`
            <form class="subscribe-form" @submit=${(e2) => this.submitSubscription(e2)}>
              <label class="input-label" for="subscribe-email">Email address</label>
              <input
                id="subscribe-email"
                type="email"
                class="email-input"
                placeholder="your@email.com"
                .value=${this.subscribeEmail}
                @input=${(e2) => {
      const target = e2.target;
      this.subscribeEmail = target.value;
    }}
                required
                autocomplete="email"
                ?disabled=${this.subscribeLoading}
              />
              ${this.subscribeError ? x`<div class="error-text">${this.subscribeError}</div>` : ""}

              <p class="legal-text">
                By clicking subscribe, you accept our
                <a href="https://supanotice.com/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>
                and
                <a href="https://supanotice.com/terms" target="_blank" rel="noopener noreferrer">terms and conditions</a>.
              </p>

              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" @click=${() => this.closeSubscribeModal()} ?disabled=${this.subscribeLoading}>Cancel</button>
                <button type="submit" class="btn btn-primary" ?disabled=${!canSubmit}>
                  ${this.subscribeLoading ? x`<span class="btn-spinner"></span> Subscribing...` : "Subscribe"}
                </button>
              </div>
            </form>
          `}
        </div>
      </div>
    `;
  }
  get unreadCount() {
    const readPublications = this.getReadPublications();
    return this.publications.filter((publication) => !readPublications.includes(publication.id)).length;
  }
  render() {
    return x`
      <div class="container" style="--background-color: ${this.widgetSettings.backgroundColor}; --color: ${this.widgetSettings.color};">
        ${this.errorMessage ? x`<div class="error">${this.errorMessage}</div>` : ""}
        ${this.isOpen ? this.renderWidget() : ""}
        <button 
          class="bubble ${this.isOpen ? "open" : ""}" 
          @click=${this._toggleWidget}
          aria-label="Notifications"
          aria-expanded=${this.isOpen}
        >
          ${this.unreadCount > 0 ? x`<span class="badge">${this.unreadCount}</span>` : ""}
          ${this.isLoading ? x`<div class="spinner"></div>` : this.isOpen ? x`
                  <!-- X icon when open -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" fill="none"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
              ` : x`
                <!-- Beautiful bell notification icon when closed -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="notification-bell">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" class="bell-clapper"></path>
                  <circle cx="12" cy="3" r="1" class="bell-top"></circle>
                  <path class="bell-wave bell-wave-1" d="M2 8c0 0 4-1 10-1s10 1 10 1" stroke-opacity="0.3"></path>
                  <path class="bell-wave bell-wave-2" d="M4 6c0 0 3.5-0.5 8-0.5s8 0.5 8 0.5" stroke-opacity="0.6"></path>
                </svg>
              `}
        </button>
      </div>
    `;
  }
  closeWidget() {
    this.isOpen = false;
    this.clearViewTracking();
    this.requestUpdate();
  }
  openNewsPage() {
    if (this.widgetSettings.newspage_url) {
      window.open(this.widgetSettings.newspage_url, "_blank", "noopener,noreferrer");
    }
  }
  // Public API to control the widget programmatically
  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.startViewTracking();
    this.setupAttachmentLinks();
    this.requestUpdate();
  }
  close() {
    if (!this.isOpen) return;
    this.closeWidget();
  }
  toggle() {
    this._toggleWidget();
  }
  renderWidget() {
    return x`
      <div class="widget" role="dialog" aria-labelledby="widget-title">
        <header>
          ${this.widgetSettings.newspage_url ? x`
            <h2 id="widget-title" class="clickable-title" @click=${() => this.openNewsPage()}>
              ${this.widgetSettings.title}
              <svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15,3 21,3 21,9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </h2>
          ` : x`
            <h2 id="widget-title">${this.widgetSettings.title}</h2>
          `}
          <div class="header-actions">
            <button class="subscribe-header-btn" @click=${() => this.openSubscribeModal()} aria-label="Subscribe to updates">
              <svg class="icon-mail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="6" width="18" height="14" rx="2" ry="2"></rect>
                <polyline points="3 7 12 13 21 7"></polyline>
              </svg>
              <span>Subscribe</span>
            </button>
            <button class="close-button" @click=${() => this.closeWidget()} aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </header>
        <div class="publication-list">
              ${this.publications.length === 0 ? x`<div class="empty">No publications available</div>` : this.publications.slice(0, this.widgetSettings.maxItems).map((publication) => this.renderPublication(publication))}
        </div>
        <footer class="widget-footer">
          Powered by <a href="https://supanotice.com" target="_blank" rel="noopener noreferrer" class="supanotice-link">Supanotice</a>
        </footer>
        ${this.showSubscribeModal ? this.renderSubscribeModal() : ""}
      </div>
    `;
  }
  renderPublication(publication) {
    const isExpanded = this.expandedPublications.has(publication.id);
    const hasFullBody = !!publication.fullBody;
    const bodyText = isExpanded && hasFullBody ? publication.fullBody : publication.body;
    const isRead = this.isPublicationRead(publication.id);
    const formattedDate = this._formatDate(publication.published_at);
    return x`
      <div class="publication-item ${isRead ? "read" : "unread"} ${isExpanded ? "expanded" : ""}"
           @mouseenter=${() => this.startTrackingPublication(publication.id)}
           @touchstart=${() => this.startTrackingPublication(publication.id)}>
        ${formattedDate ? x`<div class="publication-top">
          <span class="publication-date">${formattedDate}</span>
        </div>` : ""}
        <div class="publication-header" @click=${() => this.startTrackingPublication(publication.id)}>
          <h3>${publication.title}</h3>
          <div class="publication-labels">
            ${publication.labels.map((label) => x`<span class="label">${label.name}</span>`)}
          </div>
        </div>
        ${publication.image ? x`
          <div class="publication-image" @click=${() => this.startTrackingPublication(publication.id)}>
            <img src="${publication.image}" alt="${publication.title || "Publication image"}" />
          </div>
        ` : ""}
        <div class="publication-content" @click=${() => this.startTrackingPublication(publication.id)}>
          <div class="publication-body" .innerHTML=${bodyText}></div>
          ${hasFullBody ? x`
            <button @click=${(e2) => this._toggleExpand(e2, publication.id)} class="read-more-btn">
              ${isExpanded ? "Read less" : "Read more"}
            </button>
          ` : ""}
        </div>
      </div>
    `;
  }
  _toggleWidget() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.clearViewTracking();
    } else {
      this.startViewTracking();
      this.setupAttachmentLinks();
    }
  }
  _toggleExpand(e2, id) {
    e2.stopPropagation();
    if (this.expandedPublications.has(id)) {
      this.expandedPublications.delete(id);
    } else {
      this.expandedPublications.add(id);
    }
    this.requestUpdate();
  }
  _formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const options = date.getFullYear() !== now.getFullYear() ? { month: "short", day: "numeric", year: "numeric" } : { month: "short", day: "numeric" };
    return new Intl.DateTimeFormat(void 0, options).format(date);
  }
  /**
   * Get read publications from localStorage
   */
  getReadPublications() {
    try {
      const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Error accessing localStorage", err);
      return [];
    }
  }
  /**
   * Add a publication ID to the read list in localStorage
   */
  addToReadPublications(id) {
    try {
      const readPublications = this.getReadPublications();
      if (!readPublications.includes(id)) {
        readPublications.push(id);
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(readPublications));
      }
    } catch (err) {
      console.error("Error writing to localStorage", err);
    }
  }
  /**
   * Check if publication is read
   */
  isPublicationRead(id) {
    return this.getReadPublications().includes(id);
  }
  /**
   * Begin tracking view time for a specific publication
   */
  startTrackingPublication(id) {
    if (!this.publicationViewTimes.has(id)) {
      this.publicationViewTimes.set(id, Date.now());
    }
  }
  /**
   * Start view tracking timer for all visible publications
   */
  startViewTracking() {
    this.clearViewTracking();
    this.viewTimer = window.setInterval(() => {
      const now = Date.now();
      this.publicationViewTimes.forEach((startTime, id) => {
        const viewDuration = now - startTime;
        if (viewDuration > 3e3) {
          this.addToReadPublications(id);
          this.publicationViewTimes.delete(id);
        }
      });
      this.requestUpdate();
    }, 1e3);
  }
  /**
   * Clear all view tracking
   */
  clearViewTracking() {
    if (this.viewTimer !== null) {
      window.clearInterval(this.viewTimer);
      this.viewTimer = null;
    }
    this.publicationViewTimes.clear();
  }
  /**
   * Setup attachment links to open in new tab
   */
  setupAttachmentLinks() {
    setTimeout(() => {
      const selectors = [
        ".publication-body .attachment[href]",
        '.publication-body a[href*=".jpg"]',
        '.publication-body a[href*=".png"]',
        '.publication-body a[href*=".jpeg"]',
        ".publication-body figure a[href]"
      ];
      selectors.forEach((selector) => {
        var _a2;
        const links = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelectorAll(selector);
        links == null ? void 0 : links.forEach((link) => {
          if (link.href && (link.href.includes(".jpg") || link.href.includes(".png") || link.href.includes(".jpeg") || link.classList.contains("attachment"))) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
          }
        });
      });
    }, 100);
  }
};
SupanoticeWidget.styles = i$3`
    :host {
      --bubble-size: 4rem;
      --vh: 1vh; /* Dynamic viewport height unit */
      display: block;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      pointer-events: none;
    }
    
    :host([preview-mode]) .container {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }

    .bubble {
      pointer-events: auto;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: var(--background-color, #4f46e5);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: transform 0.2s ease, filter 0.2s ease;
    }

    .bubble:hover {
      transform: scale(1.05);
      filter: brightness(0.85);
    }
    
    /* Bell notification animation styles */
    .notification-bell {
      animation: bell-pulse 2s infinite;
      transform-origin: center top;
    }
    
    @keyframes bell-pulse {
      0% { transform: scale(1); }
      5% { transform: scale(1.1); }
      10% { transform: scale(1); }
      15% { transform: scale(1.05); }
      20% { transform: scale(1); }
      100% { transform: scale(1); }
    }
    
    .bell-wave {
      opacity: 0;
      animation: wave-fade 4s infinite;
    }
    
    .bell-wave-1 {
      animation-delay: 0.5s;
    }
    
    .bell-wave-2 {
      animation-delay: 1s;
    }
    
    @keyframes wave-fade {
      0% { opacity: 0; transform: translateY(0); }
      20% { opacity: 0.8; transform: translateY(-2px); }
      40% { opacity: 0; transform: translateY(-4px); }
      100% { opacity: 0; transform: translateY(-4px); }
    }
    
    .bubble:hover .notification-bell {
      animation: bell-ring 0.5s ease;
    }
    
    @keyframes bell-ring {
      0% { transform: rotate(0); }
      20% { transform: rotate(15deg); }
      40% { transform: rotate(-15deg); }
      60% { transform: rotate(7deg); }
      80% { transform: rotate(-7deg); }
      100% { transform: rotate(0); }
    }

    .bubble.open {
      filter: brightness(0.75);
    }
    
    /* Loading spinner animation */
    @keyframes spinner {
      to {transform: rotate(360deg);}
    }
    
    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spinner 0.8s linear infinite;
    }

    .badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: #ef4444;
      color: white;
      font-size: 12px;
      font-weight: bold;
      height: 20px;
      min-width: 20px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
    }

    .widget {
      pointer-events: auto; /* Make widget clickable */
      width: 460px;
      height: calc(var(--vh, 1vh) * 100 - 100px);
      max-height: 80vh;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      margin-bottom: 16px;
      margin-top: 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: fixed;
      right: 20px;
      bottom: 96px;
    }
    
    :host([preview-mode]) .widget {
      position: absolute;
      height: auto;
      max-height: 400px; /* Better size for preview context */
      width: 400px; /* Slightly smaller for preview */
      bottom: 50px;
      right: 20px;
    }

    header {
      padding: 16px 20px;
      background-color: var(--background-color, #4f46e5);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-actions {
       display: flex;
       align-items: center;
       gap: 8px;
     }

    #widget-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--color, #ffffff);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .external-link-icon {
      opacity: 0.8;
      transition: opacity 0.2s ease;
      flex-shrink: 0;
    }
    
    .external-link-icon:hover {
      opacity: 1;
    }
    
    .clickable-title {
      cursor: pointer;
      transition: opacity 0.2s ease;
    }
    
    .clickable-title:hover {
      opacity: 0.9;
    }
    
    .close-button {
      pointer-events: auto; /* Make sure it's clickable */
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s ease;
    }
    
    .close-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .subscribe-header-btn {
      pointer-events: auto;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #ffffff;
      padding: 6px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      line-height: 1; /* ensure consistent vertical centering */
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .subscribe-header-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-1px);
    }

    .subscribe-header-btn:active {
      transform: translateY(0);
    }
    
    /* Center and size the email icon in the subscribe button */
    .subscribe-header-btn .icon-mail {
      width: 16px;
      height: 16px;
      display: block;
      flex-shrink: 0;
      margin-top: -2px; /* align exactly centered */
      align-self: center;
      transform: translateY(0.5px); /* micro-tweak for optical centering */
    }

    /* Ensure text aligns with icon vertically */
    .subscribe-header-btn span {
      display: inline-block;
      line-height: 16px; /* match icon height for perfect centering */
    }

    .feather {
      transition: transform 0.2s ease;
    }

    .publication-list {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      scrollbar-width: thin;
    }

    .publication-item {
      padding: 16px;
      border-radius: 8px;
      background-color: white;
      cursor: pointer;
      transition: transform 0.1s ease, box-shadow 0.1s ease;
      border: 1px solid #e5e7eb;
    }

    .publication-item.unread {
      background-color: white;
      border-left: 3px solid #3b82f6;
    }

    .publication-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .publication-top {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 8px;
    }

    .publication-header {
      margin-bottom: 8px;
    }

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }


    .publication-date {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 9999px; /* pill */
      font-size: 12px;
      font-weight: 500;
      line-height: 1;
      color: #374151;
      background-color: #f3f4f6; /* neutral badge */
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }

    .publication-body {
      margin: 0 0 12px 0;
      font-size: 14px;
      line-height: 1.5;
      color: #374151;
      white-space: pre-line;
    }
    
    .publication-image {
      margin: 0 0 12px 0;
      width: 100%;
      max-height: 200px;
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f9fafb;
    }
    
    .publication-image img {
      width: 100%;
      height: auto;
      max-height: 200px;
      object-fit: cover;
      object-position: center;
      display: block;
      transition: transform 0.3s ease;
    }
    
    /* Styles for Trix attachment galleries and figures */
    .publication-body .attachment-gallery {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 12px 0;
    }
    
    .publication-body .attachment-gallery figure {
      flex: 1;
      min-width: 0;
      margin: 0;
    }
    
    .publication-body .attachment-gallery--3 figure {
      flex-basis: calc(33.333% - 6px);
    }
    
    .publication-body .attachment {
      display: block;
      width: 100%;
    }
    
    .publication-body .attachment[href] {
      cursor: pointer;
    }
    
    /* Style regular links in publication content */
    .publication-body a:not(.attachment) {
      color: #2563eb;
      text-decoration: underline;
    }
    
    .publication-body a:not(.attachment):hover {
      color: #1d4ed8;
    }
    
    .publication-body .attachment img {
      width: 100%;
      height: auto;
      object-fit: cover;
      object-position: center;
      border-radius: 4px;
      display: block;
    }
    
    .publication-body .attachment__caption {
      display: none;
    }
    
    /* Handle standalone figures (not in galleries) */
    .publication-body figure:not(.attachment-gallery figure) {
      margin: 16px 0;
      text-align: center;
    }
    
    .publication-body figure:not(.attachment-gallery figure) .attachment {
      display: inline-block;
      max-width: 100%;
    }
    
    .publication-body figure:not(.attachment-gallery figure) .attachment img {
      max-width: 100%;
      height: auto;
      max-height: 200px;
      object-fit: contain;
      object-position: center;
      border-radius: 4px;
      display: block;
      margin: 0 auto;
    }
    
    .publication-body figure:not(.attachment-gallery figure) .attachment__caption {
      display: none;
    }
    
    /* Handle single images in content */
    .publication-body img:not(.attachment img) {
      max-width: 100%;
      height: auto;
      max-height: 200px;
      object-fit: cover;
      border-radius: 4px;
      display: block;
      margin: 8px auto;
    }
    
    .publication-item:hover .publication-image img {
      transform: scale(1.02);
    }
    
    .publication-content {
      position: relative;
    }
    
    .read-more-btn {
      background: none;
      border: none;
      color: #4f46e5;
      font-size: 14px;
      font-weight: 500;
      padding: 0;
      cursor: pointer;
      margin-top: 4px;
      text-decoration: underline;
      transition: color 0.2s ease;
    }
    
    .read-more-btn:hover {
      color: #4338ca;
    }
    
    .publication-item {
      transition: all 0.3s ease;
    }
    
    .publication-item.expanded {
      padding-bottom: 24px;
    }

    .publication-labels {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .label {
      font-size: 11px;
      font-weight: 500;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    /* Different colors for different label types */
    .label:nth-child(1) {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .label:nth-child(2) {
      background-color: #dcfce7;
      color: #166534;
    }

    .label:nth-child(3) {
      background-color: #fef3c7;
      color: #92400e;
    }

    .label:nth-child(4) {
      background-color: #fce7f3;
      color: #be185d;
    }

    .label:nth-child(n+5) {
      background-color: #f3f4f6;
      color: #374151;
    }

    .empty {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      padding: 24px;
    }
    
    .widget-footer {
      padding: 12px 16px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
    }
    
    .supanotice-link {
      color: #3b82f6;
      text-decoration: none;
      transition: color 0.2s ease;
      font-weight: 500;
    }
    
    .supanotice-link:hover {
      color: #1d4ed8;
    }

    /* Subscribe modal */
    .modal-overlay {
      position: absolute;
      inset: 0;
      background: rgba(17, 24, 39, 0.6); /* slate-900/60 */
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 20;
    }

    .modal-card {
      position: relative;
      width: 100%;
      max-width: 520px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      border: 1px solid #e5e7eb;
      padding: 20px 20px 16px 20px;
      color: #111827;
    }

    .modal-close {
      position: absolute;
      top: 12px;
      right: 12px;
      background: transparent;
      border: none;
      border-radius: 6px;
      padding: 4px;
      cursor: pointer;
    }

    .modal-close:hover {
      background: #f3f4f6;
    }

    .modal-title {
      margin: 4px 0 6px 0;
      font-size: 20px;
      font-weight: 700;
      color: #111827;
    }

    .modal-subtitle {
      margin: 0 0 16px 0;
      color: #4b5563;
      font-size: 14px;
    }

    .subscribe-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .input-label {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }

    .email-input {
      width: 100%;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      font-size: 14px;
      color: #111827;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      box-sizing: border-box;
    }

    .email-input::placeholder {
      color: #9ca3af;
    }

    .email-input:focus {
      border-color: var(--background-color, #4f46e5);
      box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
    }

    .legal-text {
      margin: 2px 0 0 0;
      font-size: 12px;
      color: #6b7280;
    }

    .legal-text a {
      color: #4f46e5;
      text-decoration: underline;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      padding: 0 14px;
      border-radius: 8px;
      border: 1px solid transparent;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, filter 0.2s ease;
    }

    .btn-secondary {
      background: #ffffff;
      color: #111827;
      border-color: #d1d5db;
    }

    .btn-secondary:hover {
      background: #f9fafb;
    }

    .btn-primary {
      background: var(--background-color, #4f46e5);
      border-color: var(--background-color, #4f46e5);
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    }

    .btn-primary:hover {
      background: var(--background-color, #4f46e5);
      border-color: var(--background-color, #4f46e5);
    }

    .btn[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.5);
      border-top-color: #fff;
      border-radius: 50%;
      margin-right: 8px;
      animation: spinner 0.8s linear infinite;
    }

    .error-text {
      color: #b91c1c;
      font-size: 12px;
      margin-top: 2px;
    }

    .success-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border: 1px solid #d1fae5;
      background: #ecfdf5;
      color: #065f46;
      border-radius: 8px;
      margin-top: 8px;
    }

    /* Blockquote styling */
    .publication-body blockquote {
      margin: 16px 0;
      padding: 12px 16px;
      border-left: 4px solid #e5e7eb;
      background-color: #f9fafb;
      font-style: italic;
      color: #6b7280;
      border-radius: 0 4px 4px 0;
    }
    
    .publication-body blockquote p {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .publication-body blockquote p:not(:last-child) {
      margin-bottom: 8px;
    }
    
    /* Code block styling */
    .publication-body pre {
      margin: 16px 0;
      padding: 16px;
      background-color: #1e293b;
      color: #e2e8f0;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.5;
      border: 1px solid #334155;
    }
    
    .publication-body pre code {
      background: none;
      padding: 0;
      border-radius: 0;
      font-size: inherit;
      color: inherit;
    }
    
    /* Inline code styling */
    .publication-body code {
      background-color: #f1f5f9;
      color: #475569;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      font-size: 13px;
    }

    /* Responsive adjustments */
    @media (max-width: 600px) {
      .widget {
        width: 100%;
        max-width: calc(100vw - 40px);
        height: calc(var(--vh, 1vh) * 100 - 100px);
        max-height: calc(var(--vh, 1vh) * 80);
        right: 50%;
        transform: translateX(50%);
      }
    }
  `;
__decorateClass$1([
  n2({ type: String, attribute: "widget-id" })
], SupanoticeWidget.prototype, "widgetId", 2);
__decorateClass$1([
  n2({ type: Boolean, attribute: "preview-mode" })
], SupanoticeWidget.prototype, "previewMode", 2);
__decorateClass$1([
  n2({ type: String, attribute: "refresh-key" })
], SupanoticeWidget.prototype, "refreshKey", 2);
__decorateClass$1([
  n2({ type: String, attribute: "api-endpoint" })
], SupanoticeWidget.prototype, "apiEndpoint", 2);
__decorateClass$1([
  r()
], SupanoticeWidget.prototype, "widgetSettings", 2);
__decorateClass$1([
  r()
], SupanoticeWidget.prototype, "isLoading", 2);
__decorateClass$1([
  r()
], SupanoticeWidget.prototype, "errorMessage", 2);
__decorateClass$1([
  r()
], SupanoticeWidget.prototype, "publications", 2);
__decorateClass$1([
  r()
], SupanoticeWidget.prototype, "publicationViewTimes", 2);
__decorateClass$1([
  n2({ type: Number })
], SupanoticeWidget.prototype, "unreadCount", 1);
__decorateClass$1([
  r()
], SupanoticeWidget.prototype, "isOpen", 2);
__decorateClass$1([
  r()
], SupanoticeWidget.prototype, "expandedPublications", 2);
__decorateClass$1([
  r()
], SupanoticeWidget.prototype, "showSubscribeModal", 2);
__decorateClass$1([
  r()
], SupanoticeWidget.prototype, "subscribeEmail", 2);
__decorateClass$1([
  r()
], SupanoticeWidget.prototype, "subscribeLoading", 2);
__decorateClass$1([
  r()
], SupanoticeWidget.prototype, "subscribeError", 2);
__decorateClass$1([
  r()
], SupanoticeWidget.prototype, "subscribeSuccess", 2);
__decorateClass$1([
  r()
], SupanoticeWidget.prototype, "subscribeMessage", 2);
SupanoticeWidget = __decorateClass$1([
  t("supanotice-widget")
], SupanoticeWidget);
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
let SupanoticePreview = class extends i {
  constructor() {
    super(...arguments);
    this.isDarkMode = false;
  }
  /**
   * Toggle between dark and light mode
   */
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }
  /**
   * Reset the widget states (clears localStorage for read publications)
   */
  resetWidgetStates() {
    var _a2;
    localStorage.removeItem("supanotice-read-publications");
    const widget = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector("supanotice-widget");
    if (widget) {
      widget.dispatchEvent(new CustomEvent("reset"));
    }
    window.location.reload();
  }
  connectedCallback() {
    super.connectedCallback();
  }
  render() {
    return x`
      <div class="preview-container ${this.isDarkMode ? "dark-mode" : "light-mode"}">
        <div class="controls">
          <div class="mode-toggle">
            <button 
              class="theme-toggle ${this.isDarkMode ? "active" : ""}" 
              @click=${this.toggleTheme} 
              title="Dark mode"
              aria-label="Toggle dark mode">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
            <button 
              class="theme-toggle ${!this.isDarkMode ? "active" : ""}" 
              @click=${this.toggleTheme} 
              title="Light mode"
              aria-label="Toggle light mode">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </button>
          </div>
          <button 
            class="reset-button" 
            @click=${this.resetWidgetStates}
            title="Reset widget states"
            aria-label="Reset widget states">
            Reset widget states
          </button>
        </div>
        <div class="preview-frame">
          <slot></slot>
        </div>
      </div>
    `;
  }
};
SupanoticePreview.styles = i$3`
    :host {
      display: block;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .preview-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 80vh;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .dark-mode {
      background-color: #0f172a;
      color: #f1f5f9;
    }

    .light-mode {
      background-color: #f1f5f9;
      color: #0f172a;
    }

    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid;
      border-color: rgba(229, 231, 235, 0.1);
    }

    .dark-mode .controls {
      border-color: rgba(229, 231, 235, 0.1);
    }

    .light-mode .controls {
      border-color: rgba(15, 23, 42, 0.1);
    }

    .mode-toggle {
      display: flex;
      gap: 8px;
    }

    .theme-toggle {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }

    .theme-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .light-mode .theme-toggle:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .theme-toggle.active {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .light-mode .theme-toggle.active {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .reset-button {
      background-color: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .reset-button:hover {
      background-color: #2563eb;
    }

    .preview-frame {
      flex: 1;
      position: relative;
      background-image: linear-gradient(45deg, rgba(0, 0, 0, 0.05) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.05) 75%),
                        linear-gradient(45deg, rgba(0, 0, 0, 0.05) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.05) 75%);
      background-size: 40px 40px;
      background-position: 0 0, 20px 20px;
      /* Make the frame behave like a real browser viewport */
      overflow: hidden;
    }

    .dark-mode .preview-frame {
      background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.05) 75%),
                        linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.05) 75%);
    }
    
    /* Style the slotted widget to ensure it behaves as expected */
    ::slotted(supanotice-widget) {
      position: absolute !important;
      bottom: 0 !important;
      right: 0 !important;
    }
  `;
__decorateClass([
  r()
], SupanoticePreview.prototype, "isDarkMode", 2);
SupanoticePreview = __decorateClass([
  t("supanotice-preview")
], SupanoticePreview);
export {
  SupanoticePreview,
  SupanoticeWidget
};
//# sourceMappingURL=supanotice-components.es.js.map
