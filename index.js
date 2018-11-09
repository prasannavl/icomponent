import { render } from "lit-html";

const requestAnimationFrame = window.requestAnimationFrame || setTimeout;
const cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

export class XElementBase extends HTMLElement {
    constructor() {
        super();
        this.renderQueueToken = null;
        this.renderNow = this.renderNow.bind(this);
    }

    view() {}
    rendered() {}
    load() { this.queueRender(); }
    unload() { this.clearRenderQueue(); }
    adopted() { this.queueRender(); }
    attrChanged(name, oldVal, newVal) { this.queueRender(); }
    getRenderRoot() { return this; }

    renderNow() {
        this.clearRenderQueue();
        this._render();
        this.rendered();
    }

    queueRender() {
        if (this.renderQueueToken !== null) return;
        this.renderQueueToken = requestAnimationFrame(this.renderNow);
    }

    clearRenderQueue() {
        if (this.renderQueueToken === null) return;
        cancelAnimationFrame(this.renderQueueToken);
        this.renderQueueToken = null;
    }

    connectedCallback() { this.load() }
    disconnectedCallback() { this.unload() }
    adoptedCallback() { this.adopted() }
    attributeChangedCallback(name, oldValue, newValue) { this.attrChanged(name, oldValue, newValue) }

    _render() { }
}

export class XComponentBase extends XElementBase {
    constructor() {
        super();
        this._eventSubscriptions = null;
        this.dispatch = this.dispatch.bind(this);
    }

    update(msg, val) {
        return true;
    }

    dispatch(msg, val) {
        if (this.update(msg, val))
            this.queueRender();
    }
    
    unload() {
        this.clearEventSubscriptions();
        super.unload();
    }

    attachEventSubscription(target, event, listener) {
        let s = this._eventSubscriptions;
        if (s == null) {
            s = this._eventSubscriptions = [];
        }
        s.push({ target, event, listener });
    }

    detachEventSubscription(target, event, detachAction) {
        let s = this._eventSubscriptions;
        if (s == null) return;
        if (!detachAction) detachAction = function () { };
        for ([index, val] of s.entries()) {
            if (val.target === target) {
                if (event == null || val.event === event) {
                    detachAction(val);
                    s.splice(index, 1);
                }
            }
        }
    }

    createEventSubscription(target, event, listener, opts) {
        target.addEventListener(event, listener, opts);
        this.attachEventSubscription(target, event, listener);
    }

    removeEventSubscription(target, event) {
        this.detachEventSubscription(target, event, removeEventListener);
    }

    clearEventSubscriptions() {
        let s = this._eventSubscriptions;
        if (s == null) return;
        for (subscription of s) {
            removeEventListener(subscription);
        }
        this._eventSubscriptions = null;
    }
}

function removeEventListener(subscription) {
    let { target, event, listener } = subscription;
    target.removeEventListener(event, listener);
}

export class XElement extends XElementBase {
    _render() {
        render(this.view(), this.getRenderRoot());
    }
}

export class XComponent extends XComponentBase {
    _render() {
        render(this.view(), this.getRenderRoot());
    }
}

function XElementFn(fn, className) {
    let c = class extends XElement {
        view() {
            return fn(this.attributes);
        }
    }
    if (className)
    c.name = className;
    return c;
}

export function register(name, component) {
    if (component == null) throw new TypeError("null component");
    component.tag = name;
    registerComponents(component);
}

export function registerComponents(...components) {
    for (let c of components) {
        if (c == null) throw new TypeError("null component");
        if (!isPrototypeOf(c, HTMLElement)) {
            let o = c;
            c = XElementFn(c);
            c.tag = o.tag;
        }
        let name = c.tag;
        if (!name) {
            let n = c.name;
            if (!n) {
                throw new TypeError("couldn't guess tag name for type");
            }
            name = "x-" + kebabCase(n);
        }
        customElements.define(name, c);
    }
}

function kebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')    // get all lowercase letters that are near to uppercase ones
        .replace(/[\s_]+/g, '-')                // replace all spaces and low dash
        .toLowerCase()                          // convert to lower case
}

function isPrototypeOf(target, prototypeClass) {
    return target.prototype instanceof prototypeClass;
}