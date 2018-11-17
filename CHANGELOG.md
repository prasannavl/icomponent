# v5.0.0

- [**BREAKING**]
    - `Component` now only refers to the plain component with a renderer that does nothing.
    - `ComponentFn` follows the same convention as above.
    - Dedicated components are prefixed - for instance, `LitComponent` refers to the component impl that uses `lit-html`, `ReactComponent` for react, etc.
    - Being explicit seems to make the codebase less confusing and lot better to work with.
    - support adapters no longer export `icomponent` primitives. For the advantage of saving adding one dependency manually, this only added more confusion than worth. The semantics are just simpler to add it and use it manually if needed.  

- [internal]
    - `core` - an internal module for the base interfaces and methods
    - `component` - provides the default `Component` impl and `ComponentFn`

# v4.3.1

- [add] default `observedAttributes`
- [change] [ts] make `attr` params optional  

# v4.3.0

- [change] more generic typing-fu for better ergonomics. `ComponentFn` now works better.

# v4.2.0

- [change] Better and more ergonomic type definitions

# v4.0.0

- [**BREAKING**] The following have been renamed to simplify things: 
    - `IComponentCore` -> `ComponentCore`
    - `IComponent` -> `Component`
    - `IComponentFn` -> `ComponentFn`
- [change] The project is now re-written in TypeScript, providing the `I` prefixed versions as interfaces. 

# v3.3.0

- [add] Introduced `renderBegin` and `renderEnd` methods.
- [add] `ComponentRenderer` that extends `Renderer` and calls the above render cycle methods.

# v3.2.0

- [add] `attr` method on IComponent that's a helper for raw html attributes.

# v3.1.0

- [**BREAKING**] `IComponentFn` now passes in the component itself rather than just `this.attributes`. This is simpler, provides more control, and is more performant.

# v3.0.0

- [**BREAKING**] Almost complete rewrite. The following changes have been done.
    - There are no longer `IElement` and `IComponent`. It's now simplified. `IComponentCore` which is baseless class, and `IComponent` is a class that inherits `HTMLElement`. `IComponentCore` can be utilized to make lightweight virtual components.
    - `Renderer` is now handles all the rendering logic, which is a cheap per-instance object created through `createRenderer`
    - `createRender` is now a creates a `Renderer` per instance.
    - `utils` have been removed. They are largely redundant, but created as helpers, but scraped to remove unnecessary API surface.
    - `IFnComponent` is now `IComponentFn`
    - Previously, `IDefault` only the rendering helpers, it's contents are now inside `Renderer`, which is far more appropriate.
    - Since `IComponentCore` is now a baseless, class, any object can be made to extend it either with inheritance, or with `IComponentCore.extend` - The latter also requires calling `IComponentCore.init` inside the constructor. 

# v2.0.0

- [**BREAKING**] `renderNow` method is now just called `render`. `queueRender` and `render` is obvious enough, and shorter form is just nicer in large codebases.

- [**BREAKING**] From v2, since `CustomElement` require a reasonably modern browser anyway, es5 modules are no longer provided. Previously, icomponent provided both es6 modules, that can be accessed as `icomponent/lib`, and cjs, by default. Also had `pkg.module` defined for es6 bundlers, like webpack. This no longer holds. So, if you use polyfills and use an older browser that doesn't support es6, you should to set your bundler configs to let icomponent transpile to es5.

- [**BREAKING**] `render` event is no no emitted by default, and `_postRender` (which is a bit redundant anyway due to `rendered`) has been removed. Since this observation is not required in most cases, it makes sense for components that need it to manually override `rendered` and dispatch the event.

# v1.4.1

- [fix] Incorrect function call for functional components

# v1.4.0

- [fix] A bug that caused functional components to always implement the default IElement. It now works correctly.
- [change] Functional components now implement IComponent instead of just IElement

# v1.3.x

- [add] Supported adaptors for `react`, `hyperhtml` and `lit-html`.

# v1.2.0

- [**BREAKING**] This is a minor, but breaking release, due to an immediate, small rename.

    - `registerTag` -> `defineTag`
    - `register` -> `defineComponents`
    
    This helps staying closer to standard `customElements.define` naming conventions.

# v1.1.0

- [**BREAKING**] This is a minor, but breaking release, due to an immediate, small rename.
    - `IConfig` -> `IDefault` to better reflect intention.

# v1.0.0

- [**BREAKING**] The project is now called `icomponent`.
    - `LiteElement` -> `IElement`
    - `LiteComponent` -> `IComponent`
    - `LiteFn` -> `IFnComponent`
    
    Everything else remains the same.

# v0.1.0

- [**BREAKING**] The following methods have been renamed while retaining the same 
  semantics. 
    - `load` -> `connected`
    - `unload` -> `disconnected`
    - `attrChanged` -> `attributeChanged`

    This has been done to not only stay in line with DOM spec, but also
    to avoid misconceptions due to the name such as `load`. connected does not
    mean the component is fully loaded. It just means it's connected to the DOM
    tree.

# v0.0.4

- [change] A `render` event is now emitted on after every render. This is useful for external
  components to know when a render has occurred. This can also be used to execute
  code once on immediate next render, without having to hook into `rendered` method.
  
- [note] The above can easily be disabled by overriding the _postRender method.
