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
