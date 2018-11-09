const requestAnimationFrame = window.requestAnimationFrame || setTimeout;
const cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

export class LiteElementBase extends HTMLElement {
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

export class LiteComponentBase extends LiteElementBase {
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
    
    unload() {
        this.clearEventSubscriptions();
        super.unload();
    }
}