"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LiteFn = LiteFn;
exports.RenderManager = exports.LiteComponent = exports.LiteElement = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var LiteElement =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(LiteElement, _HTMLElement);

  function LiteElement() {
    var _this;

    _classCallCheck(this, LiteElement);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LiteElement).call(this));
    _this.renderQueueToken = null;
    _this.renderNow = _this.renderNow.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(LiteElement, [{
    key: "view",
    value: function view() {}
  }, {
    key: "rendered",
    value: function rendered() {}
  }, {
    key: "load",
    value: function load() {
      this.queueRender();
    }
  }, {
    key: "unload",
    value: function unload() {
      this.clearRenderQueue();
    }
  }, {
    key: "adopted",
    value: function adopted() {
      this.queueRender();
    }
  }, {
    key: "attrChanged",
    value: function attrChanged(name, oldVal, newVal) {
      this.queueRender();
    }
  }, {
    key: "getRenderRoot",
    value: function getRenderRoot() {
      return this;
    }
  }, {
    key: "renderNow",
    value: function renderNow() {
      this.clearRenderQueue();

      this._render();

      this.rendered();
    }
  }, {
    key: "queueRender",
    value: function queueRender() {
      if (this.renderQueueToken !== null) return;
      this.renderQueueToken = RenderManager.schedule(this.renderNow);
    }
  }, {
    key: "clearRenderQueue",
    value: function clearRenderQueue() {
      if (this.renderQueueToken === null) return;
      RenderManager.cancel(this.renderQueueToken);
      this.renderQueueToken = null;
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      this.load();
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.unload();
    }
  }, {
    key: "adoptedCallback",
    value: function adoptedCallback() {
      this.adopted();
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, newValue) {
      this.attrChanged(name, oldValue, newValue);
    }
  }, {
    key: "_render",
    value: function _render() {
      RenderManager.render(this.view(), this.getRenderRoot());
    }
  }]);

  return LiteElement;
}(_wrapNativeSuper(HTMLElement));

exports.LiteElement = LiteElement;

var LiteComponent =
/*#__PURE__*/
function (_LiteElement) {
  _inherits(LiteComponent, _LiteElement);

  function LiteComponent() {
    var _this2;

    _classCallCheck(this, LiteComponent);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(LiteComponent).call(this));
    _this2.dispatch = _this2.dispatch.bind(_assertThisInitialized(_assertThisInitialized(_this2)));
    return _this2;
  }

  _createClass(LiteComponent, [{
    key: "update",
    value: function update(msg, val) {
      return true;
    }
  }, {
    key: "dispatch",
    value: function dispatch(msg, val) {
      if (this.update(msg, val)) this.queueRender();
    }
  }]);

  return LiteComponent;
}(LiteElement);

exports.LiteComponent = LiteComponent;

function LiteFn(fn) {
  if (!fn) throw new TypeError("invalid fn");
  return (
    /*#__PURE__*/
    function (_LiteElement2) {
      _inherits(_class, _LiteElement2);

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
      }

      _createClass(_class, [{
        key: "view",
        value: function view() {
          return fn(this.attributes);
        }
      }]);

      return _class;
    }(LiteElement)
  );
}

var RenderManager = {
  render: function render() {},
  // We already assume HTMLElement, so it's makes so sense testing for window and such.
  schedule: window.requestAnimationFrame ? window.requestAnimationFrame : setTimeout,
  cancel: window.cancelAnimationFrame ? window.cancelAnimationFrame : clearTimeout
};
exports.RenderManager = RenderManager;