type ComponentType = any;
type RenderQueueToken = number; 
export type RenderFn = (component: ComponentType) => void;

export interface IRenderer {
    render(): void;
    schedule(): void;
    cancel(): void;
}

export class Renderer implements IRenderer {
    static render: RenderFn;
    static schedule: (render: RenderFn) => RenderQueueToken;
    static cancel: (renderQueueToken: RenderQueueToken) => void;

    renderQueueToken: number | null = null;

    constructor(
        protected component: ComponentType,
        protected fn: RenderFn = Renderer.render) {
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

export class ComponentRenderer extends Renderer {
    render() {
        this.component.renderBegin();
        super.render();
        this.component.renderEnd();
    }
}

Renderer.render = function (comp: ComponentType) { }
let schedule = window.requestAnimationFrame ? window.requestAnimationFrame : setTimeout;
let cancel = schedule === setTimeout ? clearTimeout : window.cancelAnimationFrame;
Renderer.schedule = schedule.bind(window);
Renderer.cancel = cancel.bind(window);
