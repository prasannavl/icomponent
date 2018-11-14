class Renderer {
    constructor(component, fn) {
        this.renderQueueToken = null;
        this.component = component;
        this.fn = fn || Renderer.render;
        // Provide an early binding since this can get passed
        // into the scheduler repeatedly.
        this.render = this.render.bind(this);
    }

    // Render immediately.
    render() {
        this.cancel();
        this.fn(this.component);
    }

    // Queue a render using the default scheduler.
    schedule() {
        if (this.renderQueueToken !== null) return;
        this.renderQueueToken = Renderer.schedule(this.render);
    }

    // Clear any previously scheduled render.
    cancel() {
        if (this.renderQueueToken === null) return;
        Renderer.cancel(this.renderQueueToken);
        this.renderQueueToken = null;
    }
}

class ComponentRenderer extends Renderer {
    constructor(component, fn) {
        super(component, fn);
    }

    render() {
        this.component.renderBegin();
        super.render();
        this.component.renderEnd();
    }
}

Renderer.render = function () { }
let schedule = window.requestAnimationFrame ? window.requestAnimationFrame : setTimeout;
let cancel = schedule === setTimeout ? clearTimeout : window.cancelAnimationFrame;
Renderer.schedule = schedule.bind(window);
Renderer.cancel = cancel.bind(window);

export { Renderer, IComponentRenderer };