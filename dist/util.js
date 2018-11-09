"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTag = registerTag;
exports.register = register;

var _base = require("./base");

function registerTag(name, component) {
  if (component == null) nullComponentError();
  component.tag = name;
  register(component);
}

function register() {
  for (var _len = arguments.length, components = new Array(_len), _key = 0; _key < _len; _key++) {
    components[_key] = arguments[_key];
  }

  for (var _i = 0; _i < components.length; _i++) {
    var c = components[_i];
    if (c == null) nullComponentError();

    if (!isPrototypeOf(c, HTMLElement)) {
      console.log("fn: ", c);
      var o = c;
      c = (0, _base.LiteFn)(c);
      c.tag = o.tag;
    }

    var name = c.tag;

    if (!name) {
      throw new TypeError("no tag name provided for custom component");
    }

    customElements.define(name, c);
  }
}

function nullComponentError() {
  throw new TypeError("null component");
}

function isPrototypeOf(target, prototypeClass) {
  return target.prototype instanceof prototypeClass;
}