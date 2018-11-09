export class LiteElement extends HTMLElement {
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
        this.renderQueueToken = RenderManager.schedule(this.renderNow);
    }

    clearRenderQueue() {
        if (this.renderQueueToken === null) return;
        RenderManager.cancel(this.renderQueueToken);
        this.renderQueueToken = null;
    }

    connectedCallback() { this.load() }
    disconnectedCallback() { this.unload() }
    adoptedCallback() { this.adopted() }
    attributeChangedCallback(name, oldValue, newValue) { this.attrChanged(name, oldValue, newValue) }

    _render() { 
        RenderManager.render(this.view(), this.getRenderRoot());
    }
}

export class LiteComponent extends LiteElement {
    constructor() {
        super();
        this.dispatch = this.dispatch.bind(this);
    }

    update(msg, val) {
        return true;
    }

    dispatch(msg, val) {
        if (this.update(msg, val))
            this.queueRender();
    }
}

export function LiteFn(fn) {
    if (!fn) throw new TypeError("invalid fn");
    return class extends LiteElement {
        view() {
            return fn(this.attributes);
        }
    }
}

export const RenderManager = {
    render: function () { },
    // We already assume HTMLElement, so it's makes so sense testing for window and such.
    schedule: window.requestAnimationFrame ? window.requestAnimationFrame : setTimeout,
    cancel: window.cancelAnimationFrame ? window.cancelAnimationFrame : clearTimeout,
}
