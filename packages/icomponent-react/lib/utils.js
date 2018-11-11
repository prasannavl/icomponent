import { defineComponentsCore, defineTagCore } from "icomponent/lib/utils";
import { IFnComponent } from "./index";

export function defineTag(name, component) {
    defineTagCore(defineComponent, name, component);
}

export function defineComponents(...components) {
    defineComponentsCore(IFnComponent, ...components);
}