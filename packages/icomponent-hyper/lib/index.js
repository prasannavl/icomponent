import { IComponent as IComponentBase, ComponentRenderer  } from "icomponent/lib";
import { componentFn } from "icomponent/lib/component";
import { bind } from "hyperhtml";

export { IComponentCore } from "icomponent/lib";
export { bind, wire } from "hyperhtml";

export const html = (...args) => args;

export function hyperRender() {
    bind(this.getRenderRoot())(...this.view());
}

export class IComponent extends IComponentBase {
    createRenderer() {
        return new ComponentRenderer(this, hyperRender.bind(this));
    }
}

export function IComponentFn(fn) { return componentFn(fn, IComponent); }
