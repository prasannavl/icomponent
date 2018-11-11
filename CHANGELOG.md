# v1.3.x:

Supported adaptors for `react`, `hyperhtml` and `lit-html`.

# v1.2.0:

**Breaking**

This is a minor, but breaking release, due to an immediate, small rename.

- `registerTag` -> `defineTag`
- `register` -> `defineComponents`

To stay closer to standard `customElements.define` naming conventions.

# v1.1.0:

**Breaking**

This is a minor, but breaking release, due to an immediate, small rename.

- `IConfig` -> `IDefault` to better reflect intention.

# v1.0.0:

**Breaking**

- The project is now called `icomponent`.

  - `LiteElement` -> `IElement`
  - `LiteComponent` -> `IComponent`
  - `LiteFn` -> `IFnComponent`

Everything else remains the same.

# v0.1.0:

**Breaking**

- The following methods have been renamed while retaining the same 
  semantics. 

  - `load` -> `connected`
  - `unload` -> `disconnected`
  - `attrChanged` -> `attributeChanged`

  This has been done to not only stay in line with DOM spec, but also
  to avoid misconceptions due to the name such as `load`. connected does not
  mean the component is fully loaded. It just means it's connected to the DOM
  tree.


# v0.0.4:

**Added**

- A `render` event is now emitted on after every render. This is useful for external
  components to know when a render has occurred. This can also be used to execute
  code once on immediate next render, without having to hook into `rendered` method.
  
- The above can easily be disabled by overriding the _postRender method.
