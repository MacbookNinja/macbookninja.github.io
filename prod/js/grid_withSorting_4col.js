function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
function _decorate(decorators, factory, superClass, mixins) {
  var api = _getDecoratorsApi();
  if (mixins) {
    for (var i = 0; i < mixins.length; i++) {
      api = mixins[i](api);
    }
  }
  var r = factory(function initialize(O) {
    api.initializeInstanceElements(O, decorated.elements);
  }, superClass);
  var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators);
  api.initializeClassElements(r.F, decorated.elements);
  return api.runClassFinishers(r.F, decorated.finishers);
}
function _getDecoratorsApi() {
  _getDecoratorsApi = function () {
    return api;
  };
  var api = {
    elementsDefinitionOrder: [["method"], ["field"]],
    initializeInstanceElements: function (O, elements) {
      ["method", "field"].forEach(function (kind) {
        elements.forEach(function (element) {
          if (element.kind === kind && element.placement === "own") {
            this.defineClassElement(O, element);
          }
        }, this);
      }, this);
    },
    initializeClassElements: function (F, elements) {
      var proto = F.prototype;
      ["method", "field"].forEach(function (kind) {
        elements.forEach(function (element) {
          var placement = element.placement;
          if (element.kind === kind && (placement === "static" || placement === "prototype")) {
            var receiver = placement === "static" ? F : proto;
            this.defineClassElement(receiver, element);
          }
        }, this);
      }, this);
    },
    defineClassElement: function (receiver, element) {
      var descriptor = element.descriptor;
      if (element.kind === "field") {
        var initializer = element.initializer;
        descriptor = {
          enumerable: descriptor.enumerable,
          writable: descriptor.writable,
          configurable: descriptor.configurable,
          value: initializer === void 0 ? void 0 : initializer.call(receiver)
        };
      }
      Object.defineProperty(receiver, element.key, descriptor);
    },
    decorateClass: function (elements, decorators) {
      var newElements = [];
      var finishers = [];
      var placements = {
        static: [],
        prototype: [],
        own: []
      };
      elements.forEach(function (element) {
        this.addElementPlacement(element, placements);
      }, this);
      elements.forEach(function (element) {
        if (!_hasDecorators(element)) return newElements.push(element);
        var elementFinishersExtras = this.decorateElement(element, placements);
        newElements.push(elementFinishersExtras.element);
        newElements.push.apply(newElements, elementFinishersExtras.extras);
        finishers.push.apply(finishers, elementFinishersExtras.finishers);
      }, this);
      if (!decorators) {
        return {
          elements: newElements,
          finishers: finishers
        };
      }
      var result = this.decorateConstructor(newElements, decorators);
      finishers.push.apply(finishers, result.finishers);
      result.finishers = finishers;
      return result;
    },
    addElementPlacement: function (element, placements, silent) {
      var keys = placements[element.placement];
      if (!silent && keys.indexOf(element.key) !== -1) {
        throw new TypeError("Duplicated element (" + element.key + ")");
      }
      keys.push(element.key);
    },
    decorateElement: function (element, placements) {
      var extras = [];
      var finishers = [];
      for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) {
        var keys = placements[element.placement];
        keys.splice(keys.indexOf(element.key), 1);
        var elementObject = this.fromElementDescriptor(element);
        var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject);
        element = elementFinisherExtras.element;
        this.addElementPlacement(element, placements);
        if (elementFinisherExtras.finisher) {
          finishers.push(elementFinisherExtras.finisher);
        }
        var newExtras = elementFinisherExtras.extras;
        if (newExtras) {
          for (var j = 0; j < newExtras.length; j++) {
            this.addElementPlacement(newExtras[j], placements);
          }
          extras.push.apply(extras, newExtras);
        }
      }
      return {
        element: element,
        finishers: finishers,
        extras: extras
      };
    },
    decorateConstructor: function (elements, decorators) {
      var finishers = [];
      for (var i = decorators.length - 1; i >= 0; i--) {
        var obj = this.fromClassDescriptor(elements);
        var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj);
        if (elementsAndFinisher.finisher !== undefined) {
          finishers.push(elementsAndFinisher.finisher);
        }
        if (elementsAndFinisher.elements !== undefined) {
          elements = elementsAndFinisher.elements;
          for (var j = 0; j < elements.length - 1; j++) {
            for (var k = j + 1; k < elements.length; k++) {
              if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) {
                throw new TypeError("Duplicated element (" + elements[j].key + ")");
              }
            }
          }
        }
      }
      return {
        elements: elements,
        finishers: finishers
      };
    },
    fromElementDescriptor: function (element) {
      var obj = {
        kind: element.kind,
        key: element.key,
        placement: element.placement,
        descriptor: element.descriptor
      };
      var desc = {
        value: "Descriptor",
        configurable: true
      };
      Object.defineProperty(obj, Symbol.toStringTag, desc);
      if (element.kind === "field") obj.initializer = element.initializer;
      return obj;
    },
    toElementDescriptors: function (elementObjects) {
      if (elementObjects === undefined) return;
      return _toArray(elementObjects).map(function (elementObject) {
        var element = this.toElementDescriptor(elementObject);
        this.disallowProperty(elementObject, "finisher", "An element descriptor");
        this.disallowProperty(elementObject, "extras", "An element descriptor");
        return element;
      }, this);
    },
    toElementDescriptor: function (elementObject) {
      var kind = String(elementObject.kind);
      if (kind !== "method" && kind !== "field") {
        throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"');
      }
      var key = _toPropertyKey(elementObject.key);
      var placement = String(elementObject.placement);
      if (placement !== "static" && placement !== "prototype" && placement !== "own") {
        throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"');
      }
      var descriptor = elementObject.descriptor;
      this.disallowProperty(elementObject, "elements", "An element descriptor");
      var element = {
        kind: kind,
        key: key,
        placement: placement,
        descriptor: Object.assign({}, descriptor)
      };
      if (kind !== "field") {
        this.disallowProperty(elementObject, "initializer", "A method descriptor");
      } else {
        this.disallowProperty(descriptor, "get", "The property descriptor of a field descriptor");
        this.disallowProperty(descriptor, "set", "The property descriptor of a field descriptor");
        this.disallowProperty(descriptor, "value", "The property descriptor of a field descriptor");
        element.initializer = elementObject.initializer;
      }
      return element;
    },
    toElementFinisherExtras: function (elementObject) {
      var element = this.toElementDescriptor(elementObject);
      var finisher = _optionalCallableProperty(elementObject, "finisher");
      var extras = this.toElementDescriptors(elementObject.extras);
      return {
        element: element,
        finisher: finisher,
        extras: extras
      };
    },
    fromClassDescriptor: function (elements) {
      var obj = {
        kind: "class",
        elements: elements.map(this.fromElementDescriptor, this)
      };
      var desc = {
        value: "Descriptor",
        configurable: true
      };
      Object.defineProperty(obj, Symbol.toStringTag, desc);
      return obj;
    },
    toClassDescriptor: function (obj) {
      var kind = String(obj.kind);
      if (kind !== "class") {
        throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"');
      }
      this.disallowProperty(obj, "key", "A class descriptor");
      this.disallowProperty(obj, "placement", "A class descriptor");
      this.disallowProperty(obj, "descriptor", "A class descriptor");
      this.disallowProperty(obj, "initializer", "A class descriptor");
      this.disallowProperty(obj, "extras", "A class descriptor");
      var finisher = _optionalCallableProperty(obj, "finisher");
      var elements = this.toElementDescriptors(obj.elements);
      return {
        elements: elements,
        finisher: finisher
      };
    },
    runClassFinishers: function (constructor, finishers) {
      for (var i = 0; i < finishers.length; i++) {
        var newConstructor = (0, finishers[i])(constructor);
        if (newConstructor !== undefined) {
          if (typeof newConstructor !== "function") {
            throw new TypeError("Finishers must return a constructor.");
          }
          constructor = newConstructor;
        }
      }
      return constructor;
    },
    disallowProperty: function (obj, name, objectType) {
      if (obj[name] !== undefined) {
        throw new TypeError(objectType + " can't have a ." + name + " property.");
      }
    }
  };
  return api;
}
function _createElementDescriptor(def) {
  var key = _toPropertyKey(def.key);
  var descriptor;
  if (def.kind === "method") {
    descriptor = {
      value: def.value,
      writable: true,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "get") {
    descriptor = {
      get: def.value,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "set") {
    descriptor = {
      set: def.value,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "field") {
    descriptor = {
      configurable: true,
      writable: true,
      enumerable: true
    };
  }
  var element = {
    kind: def.kind === "field" ? "field" : "method",
    key: key,
    placement: def.static ? "static" : def.kind === "field" ? "own" : "prototype",
    descriptor: descriptor
  };
  if (def.decorators) element.decorators = def.decorators;
  if (def.kind === "field") element.initializer = def.value;
  return element;
}
function _coalesceGetterSetter(element, other) {
  if (element.descriptor.get !== undefined) {
    other.descriptor.get = element.descriptor.get;
  } else {
    other.descriptor.set = element.descriptor.set;
  }
}
function _coalesceClassElements(elements) {
  var newElements = [];
  var isSameElement = function (other) {
    return other.kind === "method" && other.key === element.key && other.placement === element.placement;
  };
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var other;
    if (element.kind === "method" && (other = newElements.find(isSameElement))) {
      if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) {
        if (_hasDecorators(element) || _hasDecorators(other)) {
          throw new ReferenceError("Duplicated methods (" + element.key + ") can't be decorated.");
        }
        other.descriptor = element.descriptor;
      } else {
        if (_hasDecorators(element)) {
          if (_hasDecorators(other)) {
            throw new ReferenceError("Decorators can't be placed on different accessors with for " + "the same property (" + element.key + ").");
          }
          other.decorators = element.decorators;
        }
        _coalesceGetterSetter(element, other);
      }
    } else {
      newElements.push(element);
    }
  }
  return newElements;
}
function _hasDecorators(element) {
  return element.decorators && element.decorators.length;
}
function _isDataDescriptor(desc) {
  return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
}
function _optionalCallableProperty(obj, name) {
  var value = obj[name];
  if (value !== undefined && typeof value !== "function") {
    throw new TypeError("Expected '" + name + "' to be a function");
  }
  return value;
}

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=window,e$5=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$4=Symbol(),n$5=new WeakMap;let o$4 = class o{constructor(t,e,n){if(this._$cssResult$=!0,n!==s$4)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$5&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=n$5.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n$5.set(s,t));}return t}toString(){return this.cssText}};const r$3=t=>new o$4("string"==typeof t?t:t+"",void 0,s$4),i$3=(t,...e)=>{const n=1===t.length?t[0]:e.reduce(((e,s,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[n+1]),t[0]);return new o$4(n,t,s$4)},S$2=(s,n)=>{e$5?s.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((e=>{const n=document.createElement("style"),o=t$2.litNonce;void 0!==o&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n);}));},c$2=e$5?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$3(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$3;const e$4=window,r$2=e$4.trustedTypes,h$2=r$2?r$2.emptyScript:"",o$3=e$4.reactiveElementPolyfillSupport,n$4={toAttribute(t,i){switch(i){case Boolean:t=t?h$2:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},a$2=(t,i)=>i!==t&&(i==i||t==t),l$3={attribute:!0,type:String,converter:n$4,reflect:!1,hasChanged:a$2};let d$2 = class d extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u();}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e));})),t}static createProperty(t,i=l$3){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$3}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(c$2(i));}else void 0!==i&&s.push(c$2(i));return s}static _$Ep(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1);}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S$2(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$EO(t,i,s=l$3){var e;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const h=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:n$4).toAttribute(i,s.type);this._$El=t,null==h?this.removeAttribute(r):this.setAttribute(r,h),this._$El=null;}}_$AK(t,i){var s;const e=this.constructor,r=e._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=e.getPropertyOptions(r),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:n$4;this._$El=r,this[r]=h.fromAttribute(i,t.type),this._$El=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||a$2)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej());}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek();}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek();}updated(t){}firstUpdated(t){}};d$2.finalized=!0,d$2.elementProperties=new Map,d$2.elementStyles=[],d$2.shadowRootOptions={mode:"open"},null==o$3||o$3({ReactiveElement:d$2}),(null!==(s$3=e$4.reactiveElementVersions)&&void 0!==s$3?s$3:e$4.reactiveElementVersions=[]).push("1.6.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t$1;const i$2=window,s$2=i$2.trustedTypes,e$3=s$2?s$2.createPolicy("lit-html",{createHTML:t=>t}):void 0,o$2=`lit$${(Math.random()+"").slice(9)}$`,n$3="?"+o$2,l$2=`<${n$3}>`,h$1=document,r$1=(t="")=>h$1.createComment(t),d$1=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u$1=Array.isArray,c$1=t=>u$1(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),v$1=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,a$1=/-->/g,f$1=/>/g,_$1=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),m$1=/'/g,p$1=/"/g,$$1=/^(?:script|style|textarea|title)$/i,g$1=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),y$1=g$1(1),x$1=Symbol.for("lit-noChange"),b$1=Symbol.for("lit-nothing"),T$1=new WeakMap,A$1=h$1.createTreeWalker(h$1,129,null,!1),E$1=(t,i)=>{const s=t.length-1,n=[];let h,r=2===i?"<svg>":"",d=v$1;for(let i=0;i<s;i++){const s=t[i];let e,u,c=-1,g=0;for(;g<s.length&&(d.lastIndex=g,u=d.exec(s),null!==u);)g=d.lastIndex,d===v$1?"!--"===u[1]?d=a$1:void 0!==u[1]?d=f$1:void 0!==u[2]?($$1.test(u[2])&&(h=RegExp("</"+u[2],"g")),d=_$1):void 0!==u[3]&&(d=_$1):d===_$1?">"===u[0]?(d=null!=h?h:v$1,c=-1):void 0===u[1]?c=-2:(c=d.lastIndex-u[2].length,e=u[1],d=void 0===u[3]?_$1:'"'===u[3]?p$1:m$1):d===p$1||d===m$1?d=_$1:d===a$1||d===f$1?d=v$1:(d=_$1,h=void 0);const y=d===_$1&&t[i+1].startsWith("/>")?" ":"";r+=d===v$1?s+l$2:c>=0?(n.push(e),s.slice(0,c)+"$lit$"+s.slice(c)+o$2+y):s+o$2+(-2===c?(n.push(void 0),i):y);}const u=r+(t[s]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return [void 0!==e$3?e$3.createHTML(u):u,n]};let C$1 = class C{constructor({strings:t,_$litType$:i},e){let l;this.parts=[];let h=0,d=0;const u=t.length-1,c=this.parts,[v,a]=E$1(t,i);if(this.el=C.createElement(v,e),A$1.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(l=A$1.nextNode())&&c.length<u;){if(1===l.nodeType){if(l.hasAttributes()){const t=[];for(const i of l.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(o$2)){const s=a[d++];if(t.push(i),void 0!==s){const t=l.getAttribute(s.toLowerCase()+"$lit$").split(o$2),i=/([.?@])?(.*)/.exec(s);c.push({type:1,index:h,name:i[2],strings:t,ctor:"."===i[1]?M$1:"?"===i[1]?k:"@"===i[1]?H$1:S$1});}else c.push({type:6,index:h});}for(const i of t)l.removeAttribute(i);}if($$1.test(l.tagName)){const t=l.textContent.split(o$2),i=t.length-1;if(i>0){l.textContent=s$2?s$2.emptyScript:"";for(let s=0;s<i;s++)l.append(t[s],r$1()),A$1.nextNode(),c.push({type:2,index:++h});l.append(t[i],r$1());}}}else if(8===l.nodeType)if(l.data===n$3)c.push({type:2,index:h});else {let t=-1;for(;-1!==(t=l.data.indexOf(o$2,t+1));)c.push({type:7,index:h}),t+=o$2.length-1;}h++;}}static createElement(t,i){const s=h$1.createElement("template");return s.innerHTML=t,s}};function P$1(t,i,s=t,e){var o,n,l,h;if(i===x$1)return i;let r=void 0!==e?null===(o=s._$Co)||void 0===o?void 0:o[e]:s._$Cl;const u=d$1(i)?void 0:i._$litDirective$;return (null==r?void 0:r.constructor)!==u&&(null===(n=null==r?void 0:r._$AO)||void 0===n||n.call(r,!1),void 0===u?r=void 0:(r=new u(t),r._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Co)&&void 0!==l?l:h._$Co=[])[e]=r:s._$Cl=r),void 0!==r&&(i=P$1(t,r._$AS(t,i.values),r,e)),i}let V$1 = class V{constructor(t,i){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:h$1).importNode(s,!0);A$1.currentNode=o;let n=A$1.nextNode(),l=0,r=0,d=e[0];for(;void 0!==d;){if(l===d.index){let i;2===d.type?i=new N$1(n,n.nextSibling,this,t):1===d.type?i=new d.ctor(n,d.name,d.strings,this,t):6===d.type&&(i=new I$1(n,this,t)),this.u.push(i),d=e[++r];}l!==(null==d?void 0:d.index)&&(n=A$1.nextNode(),l++);}return o}p(t){let i=0;for(const s of this.u)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}};let N$1 = class N{constructor(t,i,s,e){var o;this.type=2,this._$AH=b$1,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cm=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=P$1(this,t,i),d$1(t)?t===b$1||null==t||""===t?(this._$AH!==b$1&&this._$AR(),this._$AH=b$1):t!==this._$AH&&t!==x$1&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):c$1(t)?this.k(t):this.g(t);}O(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}g(t){this._$AH!==b$1&&d$1(this._$AH)?this._$AA.nextSibling.data=t:this.T(h$1.createTextNode(t)),this._$AH=t;}$(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=C$1.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.p(s);else {const t=new V$1(o,this),i=t.v(this.options);t.p(s),this.T(i),this._$AH=t;}}_$AC(t){let i=T$1.get(t.strings);return void 0===i&&T$1.set(t.strings,i=new C$1(t)),i}k(t){u$1(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new N(this.O(r$1()),this.O(r$1()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cm=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}};let S$1 = class S{constructor(t,i,s,e,o){this.type=1,this._$AH=b$1,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b$1;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=P$1(this,t,i,0),n=!d$1(t)||t!==this._$AH&&t!==x$1,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=P$1(this,e[s+l],i,l),h===x$1&&(h=this._$AH[l]),n||(n=!d$1(h)||h!==this._$AH[l]),h===b$1?t=b$1:t!==b$1&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.j(t);}j(t){t===b$1?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}};let M$1 = class M extends S$1{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===b$1?void 0:t;}};const R$1=s$2?s$2.emptyScript:"";class k extends S$1{constructor(){super(...arguments),this.type=4;}j(t){t&&t!==b$1?this.element.setAttribute(this.name,R$1):this.element.removeAttribute(this.name);}}let H$1 = class H extends S$1{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=P$1(this,t,i,0))&&void 0!==s?s:b$1)===x$1)return;const e=this._$AH,o=t===b$1&&e!==b$1||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==b$1&&(e===b$1||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}};let I$1 = class I{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){P$1(this,t);}};const z$1=i$2.litHtmlPolyfillSupport;null==z$1||z$1(C$1,N$1),(null!==(t$1=i$2.litHtmlVersions)&&void 0!==t$1?t$1:i$2.litHtmlVersions=[]).push("2.6.1");const Z$1=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new N$1(i.insertBefore(r$1(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l$1,o$1;let s$1 = class s extends d$2{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Z$1(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1);}render(){return x$1}};s$1.finalized=!0,s$1._$litElement$=!0,null===(l$1=globalThis.litElementHydrateSupport)||void 0===l$1||l$1.call(globalThis,{LitElement:s$1});const n$2=globalThis.litElementPolyfillSupport;null==n$2||n$2({LitElement:s$1});(null!==(o$1=globalThis.litElementVersions)&&void 0!==o$1?o$1:globalThis.litElementVersions=[]).push("3.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$2=e=>n=>"function"==typeof n?((e,n)=>(customElements.define(e,n),n))(e,n):((e,n)=>{const{kind:t,elements:s}=n;return {kind:t,elements:s,finisher(n){customElements.define(e,n);}}})(e,n);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const i$1=(i,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(n){n.createProperty(e.key,i);}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this));},finisher(n){n.createProperty(e.key,i);}};function e$1(e){return (n,t)=>void 0!==t?((i,e,n)=>{e.constructor.createProperty(n,i);})(e,n,t):i$1(e,n)}

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var n$1;null!=(null===(n$1=window.HTMLSlotElement)||void 0===n$1?void 0:n$1.prototype.assignedElements)?(o,n)=>o.assignedElements(n):(o,n)=>o.assignedNodes(n).filter((o=>o.nodeType===Node.ELEMENT_NODE));

function t(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,"symbol"==typeof(o=function(t,n){if("object"!=typeof t||null===t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var r=e.call(t,"string");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(r.key))?o:String(o),r);}var o;}function n(n,e,r){return e&&t(n.prototype,e),r&&t(n,r),Object.defineProperty(n,"prototype",{writable:!1}),n}function e(){return e=Object.assign?Object.assign.bind():function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);}return t},e.apply(this,arguments)}function r(t,n){t.prototype=Object.create(n.prototype),t.prototype.constructor=t,o(t,n);}function o(t,n){return o=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,n){return t.__proto__=n,t},o(t,n)}function i(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function u(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=new Array(n);e<n;e++)r[e]=t[e];return r}function s(t,n){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(e)return (e=e.call(t)).next.bind(e);if(Array.isArray(t)||(e=function(t,n){if(t){if("string"==typeof t)return u(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);return "Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?u(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var r=0;return function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a;!function(t){t[t.Init=0]="Init",t[t.Loading=1]="Loading",t[t.Loaded=2]="Loaded",t[t.Rendered=3]="Rendered",t[t.Error=4]="Error";}(a||(a={}));var l,c,f,p,d,h,_,m={},v=[],g=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function y(t,n){for(var e in n)t[e]=n[e];return t}function b(t){var n=t.parentNode;n&&n.removeChild(t);}function w(t,n,e){var r,o,i,u={};for(i in n)"key"==i?r=n[i]:"ref"==i?o=n[i]:u[i]=n[i];if(arguments.length>2&&(u.children=arguments.length>3?l.call(arguments,2):e),"function"==typeof t&&null!=t.defaultProps)for(i in t.defaultProps)void 0===u[i]&&(u[i]=t.defaultProps[i]);return x(t,u,r,o,null)}function x(t,n,e,r,o){var i={type:t,props:n,key:e,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==o?++f:o};return null==o&&null!=c.vnode&&c.vnode(i),i}function S(t){return t.children}function N(t,n){this.props=t,this.context=n;}function C(t,n){if(null==n)return t.__?C(t.__,t.__.__k.indexOf(t)+1):null;for(var e;n<t.__k.length;n++)if(null!=(e=t.__k[n])&&null!=e.__e)return e.__e;return "function"==typeof t.type?C(t):null}function P(t){var n,e;if(null!=(t=t.__)&&null!=t.__c){for(t.__e=t.__c.base=null,n=0;n<t.__k.length;n++)if(null!=(e=t.__k[n])&&null!=e.__e){t.__e=t.__c.base=e.__e;break}return P(t)}}function E(t){(!t.__d&&(t.__d=!0)&&d.push(t)&&!I.__r++||h!==c.debounceRendering)&&((h=c.debounceRendering)||setTimeout)(I);}function I(){for(var t;I.__r=d.length;)t=d.sort(function(t,n){return t.__v.__b-n.__v.__b}),d=[],t.some(function(t){var n,e,r,o,i,u;t.__d&&(i=(o=(n=t).__v).__e,(u=n.__P)&&(e=[],(r=y({},o)).__v=o.__v+1,F(u,o,r,n.__n,void 0!==u.ownerSVGElement,null!=o.__h?[i]:null,e,null==i?C(o):i,o.__h),O(e,o),o.__e!=i&&P(o)));});}function T(t,n,e,r,o,i,u,s,a,l){var c,f,p,d,h,_,g,y=r&&r.__k||v,b=y.length;for(e.__k=[],c=0;c<n.length;c++)if(null!=(d=e.__k[c]=null==(d=n[c])||"boolean"==typeof d?null:"string"==typeof d||"number"==typeof d||"bigint"==typeof d?x(null,d,null,null,d):Array.isArray(d)?x(S,{children:d},null,null,null):d.__b>0?x(d.type,d.props,d.key,d.ref?d.ref:null,d.__v):d)){if(d.__=e,d.__b=e.__b+1,null===(p=y[c])||p&&d.key==p.key&&d.type===p.type)y[c]=void 0;else for(f=0;f<b;f++){if((p=y[f])&&d.key==p.key&&d.type===p.type){y[f]=void 0;break}p=null;}F(t,d,p=p||m,o,i,u,s,a,l),h=d.__e,(f=d.ref)&&p.ref!=f&&(g||(g=[]),p.ref&&g.push(p.ref,null,d),g.push(f,d.__c||h,d)),null!=h?(null==_&&(_=h),"function"==typeof d.type&&d.__k===p.__k?d.__d=a=L(d,a,t):a=A(t,d,p,y,h,a),"function"==typeof e.type&&(e.__d=a)):a&&p.__e==a&&a.parentNode!=t&&(a=C(p));}for(e.__e=_,c=b;c--;)null!=y[c]&&W(y[c],y[c]);if(g)for(c=0;c<g.length;c++)U(g[c],g[++c],g[++c]);}function L(t,n,e){for(var r,o=t.__k,i=0;o&&i<o.length;i++)(r=o[i])&&(r.__=t,n="function"==typeof r.type?L(r,n,e):A(e,r,r,o,r.__e,n));return n}function A(t,n,e,r,o,i){var u,s,a;if(void 0!==n.__d)u=n.__d,n.__d=void 0;else if(null==e||o!=i||null==o.parentNode)t:if(null==i||i.parentNode!==t)t.appendChild(o),u=null;else {for(s=i,a=0;(s=s.nextSibling)&&a<r.length;a+=1)if(s==o)break t;t.insertBefore(o,i),u=i;}return void 0!==u?u:o.nextSibling}function H(t,n,e){"-"===n[0]?t.setProperty(n,e):t[n]=null==e?"":"number"!=typeof e||g.test(n)?e:e+"px";}function j(t,n,e,r,o){var i;t:if("style"===n)if("string"==typeof e)t.style.cssText=e;else {if("string"==typeof r&&(t.style.cssText=r=""),r)for(n in r)e&&n in e||H(t.style,n,"");if(e)for(n in e)r&&e[n]===r[n]||H(t.style,n,e[n]);}else if("o"===n[0]&&"n"===n[1])i=n!==(n=n.replace(/Capture$/,"")),n=n.toLowerCase()in t?n.toLowerCase().slice(2):n.slice(2),t.l||(t.l={}),t.l[n+i]=e,e?r||t.addEventListener(n,i?M:D,i):t.removeEventListener(n,i?M:D,i);else if("dangerouslySetInnerHTML"!==n){if(o)n=n.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("href"!==n&&"list"!==n&&"form"!==n&&"tabIndex"!==n&&"download"!==n&&n in t)try{t[n]=null==e?"":e;break t}catch(t){}"function"==typeof e||(null==e||!1===e&&-1==n.indexOf("-")?t.removeAttribute(n):t.setAttribute(n,e));}}function D(t){this.l[t.type+!1](c.event?c.event(t):t);}function M(t){this.l[t.type+!0](c.event?c.event(t):t);}function F(t,n,e,r,o,i,u,s,a){var l,f,p,d,h,_,m,v,g,b,w,x,k,C,P,E=n.type;if(void 0!==n.constructor)return null;null!=e.__h&&(a=e.__h,s=n.__e=e.__e,n.__h=null,i=[s]),(l=c.__b)&&l(n);try{t:if("function"==typeof E){if(v=n.props,g=(l=E.contextType)&&r[l.__c],b=l?g?g.props.value:l.__:r,e.__c?m=(f=n.__c=e.__c).__=f.__E:("prototype"in E&&E.prototype.render?n.__c=f=new E(v,b):(n.__c=f=new N(v,b),f.constructor=E,f.render=B),g&&g.sub(f),f.props=v,f.state||(f.state={}),f.context=b,f.__n=r,p=f.__d=!0,f.__h=[],f._sb=[]),null==f.__s&&(f.__s=f.state),null!=E.getDerivedStateFromProps&&(f.__s==f.state&&(f.__s=y({},f.__s)),y(f.__s,E.getDerivedStateFromProps(v,f.__s))),d=f.props,h=f.state,p)null==E.getDerivedStateFromProps&&null!=f.componentWillMount&&f.componentWillMount(),null!=f.componentDidMount&&f.__h.push(f.componentDidMount);else {if(null==E.getDerivedStateFromProps&&v!==d&&null!=f.componentWillReceiveProps&&f.componentWillReceiveProps(v,b),!f.__e&&null!=f.shouldComponentUpdate&&!1===f.shouldComponentUpdate(v,f.__s,b)||n.__v===e.__v){for(f.props=v,f.state=f.__s,n.__v!==e.__v&&(f.__d=!1),f.__v=n,n.__e=e.__e,n.__k=e.__k,n.__k.forEach(function(t){t&&(t.__=n);}),w=0;w<f._sb.length;w++)f.__h.push(f._sb[w]);f._sb=[],f.__h.length&&u.push(f);break t}null!=f.componentWillUpdate&&f.componentWillUpdate(v,f.__s,b),null!=f.componentDidUpdate&&f.__h.push(function(){f.componentDidUpdate(d,h,_);});}if(f.context=b,f.props=v,f.__v=n,f.__P=t,x=c.__r,k=0,"prototype"in E&&E.prototype.render){for(f.state=f.__s,f.__d=!1,x&&x(n),l=f.render(f.props,f.state,f.context),C=0;C<f._sb.length;C++)f.__h.push(f._sb[C]);f._sb=[];}else do{f.__d=!1,x&&x(n),l=f.render(f.props,f.state,f.context),f.state=f.__s;}while(f.__d&&++k<25);f.state=f.__s,null!=f.getChildContext&&(r=y(y({},r),f.getChildContext())),p||null==f.getSnapshotBeforeUpdate||(_=f.getSnapshotBeforeUpdate(d,h)),P=null!=l&&l.type===S&&null==l.key?l.props.children:l,T(t,Array.isArray(P)?P:[P],n,e,r,o,i,u,s,a),f.base=n.__e,n.__h=null,f.__h.length&&u.push(f),m&&(f.__E=f.__=null),f.__e=!1;}else null==i&&n.__v===e.__v?(n.__k=e.__k,n.__e=e.__e):n.__e=R(e.__e,n,e,r,o,i,u,a);(l=c.diffed)&&l(n);}catch(t){n.__v=null,(a||null!=i)&&(n.__e=s,n.__h=!!a,i[i.indexOf(s)]=null),c.__e(t,n,e);}}function O(t,n){c.__c&&c.__c(n,t),t.some(function(n){try{t=n.__h,n.__h=[],t.some(function(t){t.call(n);});}catch(t){c.__e(t,n.__v);}});}function R(t,n,e,r,o,i,u,s){var a,c,f,p=e.props,d=n.props,h=n.type,_=0;if("svg"===h&&(o=!0),null!=i)for(;_<i.length;_++)if((a=i[_])&&"setAttribute"in a==!!h&&(h?a.localName===h:3===a.nodeType)){t=a,i[_]=null;break}if(null==t){if(null===h)return document.createTextNode(d);t=o?document.createElementNS("http://www.w3.org/2000/svg",h):document.createElement(h,d.is&&d),i=null,s=!1;}if(null===h)p===d||s&&t.data===d||(t.data=d);else {if(i=i&&l.call(t.childNodes),c=(p=e.props||m).dangerouslySetInnerHTML,f=d.dangerouslySetInnerHTML,!s){if(null!=i)for(p={},_=0;_<t.attributes.length;_++)p[t.attributes[_].name]=t.attributes[_].value;(f||c)&&(f&&(c&&f.__html==c.__html||f.__html===t.innerHTML)||(t.innerHTML=f&&f.__html||""));}if(function(t,n,e,r,o){var i;for(i in e)"children"===i||"key"===i||i in n||j(t,i,null,e[i],r);for(i in n)o&&"function"!=typeof n[i]||"children"===i||"key"===i||"value"===i||"checked"===i||e[i]===n[i]||j(t,i,n[i],e[i],r);}(t,d,p,o,s),f)n.__k=[];else if(_=n.props.children,T(t,Array.isArray(_)?_:[_],n,e,r,o&&"foreignObject"!==h,i,u,i?i[0]:e.__k&&C(e,0),s),null!=i)for(_=i.length;_--;)null!=i[_]&&b(i[_]);s||("value"in d&&void 0!==(_=d.value)&&(_!==t.value||"progress"===h&&!_||"option"===h&&_!==p.value)&&j(t,"value",_,p.value,!1),"checked"in d&&void 0!==(_=d.checked)&&_!==t.checked&&j(t,"checked",_,p.checked,!1));}return t}function U(t,n,e){try{"function"==typeof t?t(n):t.current=n;}catch(t){c.__e(t,e);}}function W(t,n,e){var r,o;if(c.unmount&&c.unmount(t),(r=t.ref)&&(r.current&&r.current!==t.__e||U(r,null,n)),null!=(r=t.__c)){if(r.componentWillUnmount)try{r.componentWillUnmount();}catch(t){c.__e(t,n);}r.base=r.__P=null,t.__c=void 0;}if(r=t.__k)for(o=0;o<r.length;o++)r[o]&&W(r[o],n,e||"function"!=typeof t.type);e||null==t.__e||b(t.__e),t.__=t.__e=t.__d=void 0;}function B(t,n,e){return this.constructor(t,e)}function q(t,n,e){var r,o,i;c.__&&c.__(t,n),o=(r="function"==typeof e)?null:e&&e.__k||n.__k,i=[],F(n,t=(!r&&e||n).__k=w(S,null,[t]),o||m,m,void 0!==n.ownerSVGElement,!r&&e?[e]:o?null:n.firstChild?l.call(n.childNodes):null,i,!r&&e?e:o?o.__e:n.firstChild,r),O(i,t);}function z(){return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var n=16*Math.random()|0;return ("x"==t?n:3&n|8).toString(16)})}l=v.slice,c={__e:function(t,n,e,r){for(var o,i,u;n=n.__;)if((o=n.__c)&&!o.__)try{if((i=o.constructor)&&null!=i.getDerivedStateFromError&&(o.setState(i.getDerivedStateFromError(t)),u=o.__d),null!=o.componentDidCatch&&(o.componentDidCatch(t,r||{}),u=o.__d),u)return o.__E=o}catch(n){t=n;}throw t}},f=0,p=function(t){return null!=t&&void 0===t.constructor},N.prototype.setState=function(t,n){var e;e=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=y({},this.state),"function"==typeof t&&(t=t(y({},e),this.props)),t&&y(e,t),null!=t&&this.__v&&(n&&this._sb.push(n),E(this));},N.prototype.forceUpdate=function(t){this.__v&&(this.__e=!0,t&&this.__h.push(t),E(this));},N.prototype.render=S,d=[],I.__r=0,_=0;var V=/*#__PURE__*/function(){function t(t){this._id=void 0,this._id=t||z();}return n(t,[{key:"id",get:function(){return this._id}}]),t}();function $(t){return w(t.parentElement||"span",{dangerouslySetInnerHTML:{__html:t.content}})}function G(t,n){return w($,{content:t,parentElement:n})}var K,X=/*#__PURE__*/function(t){function n(n){var e;return (e=t.call(this)||this).data=void 0,e.update(n),e}r(n,t);var e=n.prototype;return e.cast=function(t){return t instanceof HTMLElement?G(t.outerHTML):t},e.update=function(t){return this.data=this.cast(t),this},n}(V),Z=/*#__PURE__*/function(t){function e(n){var e;return (e=t.call(this)||this)._cells=void 0,e.cells=n||[],e}r(e,t);var o=e.prototype;return o.cell=function(t){return this._cells[t]},o.toArray=function(){return this.cells.map(function(t){return t.data})},e.fromCells=function(t){return new e(t.map(function(t){return new X(t.data)}))},n(e,[{key:"cells",get:function(){return this._cells},set:function(t){this._cells=t;}},{key:"length",get:function(){return this.cells.length}}]),e}(V),J=/*#__PURE__*/function(t){function e(n){var e;return (e=t.call(this)||this)._rows=void 0,e._length=void 0,e.rows=n instanceof Array?n:n instanceof Z?[n]:[],e}return r(e,t),e.prototype.toArray=function(){return this.rows.map(function(t){return t.toArray()})},e.fromRows=function(t){return new e(t.map(function(t){return Z.fromCells(t.cells)}))},e.fromArray=function(t){return new e((t=function(t){return !t[0]||t[0]instanceof Array?t:[t]}(t)).map(function(t){return new Z(t.map(function(t){return new X(t)}))}))},n(e,[{key:"rows",get:function(){return this._rows},set:function(t){this._rows=t;}},{key:"length",get:function(){return this._length||this.rows.length},set:function(t){this._length=t;}}]),e}(V),Q=/*#__PURE__*/function(){function t(){this.callbacks=void 0;}var n=t.prototype;return n.init=function(t){this.callbacks||(this.callbacks={}),t&&!this.callbacks[t]&&(this.callbacks[t]=[]);},n.listeners=function(){return this.callbacks},n.on=function(t,n){return this.init(t),this.callbacks[t].push(n),this},n.off=function(t,n){var e=t;return this.init(),this.callbacks[e]&&0!==this.callbacks[e].length?(this.callbacks[e]=this.callbacks[e].filter(function(t){return t!=n}),this):this},n.emit=function(t){var n=arguments,e=t;return this.init(e),this.callbacks[e].length>0&&(this.callbacks[e].forEach(function(t){return t.apply(void 0,[].slice.call(n,1))}),!0)},t}();!function(t){t[t.Initiator=0]="Initiator",t[t.ServerFilter=1]="ServerFilter",t[t.ServerSort=2]="ServerSort",t[t.ServerLimit=3]="ServerLimit",t[t.Extractor=4]="Extractor",t[t.Transformer=5]="Transformer",t[t.Filter=6]="Filter",t[t.Sort=7]="Sort",t[t.Limit=8]="Limit";}(K||(K={}));var Y=/*#__PURE__*/function(t){function e(n){var e;return (e=t.call(this)||this).id=void 0,e._props=void 0,e._props={},e.id=z(),n&&e.setProps(n),e}r(e,t);var o=e.prototype;return o.process=function(){var t=[].slice.call(arguments);this.validateProps instanceof Function&&this.validateProps.apply(this,t),this.emit.apply(this,["beforeProcess"].concat(t));var n=this._process.apply(this,t);return this.emit.apply(this,["afterProcess"].concat(t)),n},o.setProps=function(t){return Object.assign(this._props,t),this.emit("propsUpdated",this),this},n(e,[{key:"props",get:function(){return this._props}}]),e}(Q),tt=/*#__PURE__*/function(t){function e(){return t.apply(this,arguments)||this}return r(e,t),e.prototype._process=function(t){return this.props.keyword?(n=String(this.props.keyword).trim(),e=this.props.columns,r=this.props.ignoreHiddenColumns,o=t,i=this.props.selector,n=n.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),new J(o.rows.filter(function(t,o){return t.cells.some(function(t,u){if(!t)return !1;if(r&&e&&e[u]&&"object"==typeof e[u]&&e[u].hidden)return !1;var s="";if("function"==typeof i)s=i(t.data,o,u);else if("object"==typeof t.data){var a=t.data;a&&a.props&&a.props.content&&(s=a.props.content);}else s=String(t.data);return new RegExp(n,"gi").test(s)})}))):t;var n,e,r,o,i;},n(e,[{key:"type",get:function(){return K.Filter}}]),e}(Y);function nt(){var t="gridjs";return ""+t+[].slice.call(arguments).reduce(function(t,n){return t+"-"+n},"")}function et(){return [].slice.call(arguments).map(function(t){return t?t.toString():""}).filter(function(t){return t}).reduce(function(t,n){return (t||"")+" "+n},"").trim()}var rt,ot,it,ut,st=/*#__PURE__*/function(t){function o(){return t.apply(this,arguments)||this}return r(o,t),o.prototype._process=function(t){if(!this.props.keyword)return t;var n={};return this.props.url&&(n.url=this.props.url(t.url,this.props.keyword)),this.props.body&&(n.body=this.props.body(t.body,this.props.keyword)),e({},t,n)},n(o,[{key:"type",get:function(){return K.ServerFilter}}]),o}(Y),at=0,lt=[],ct=[],ft=c.__b,pt=c.__r,dt=c.diffed,ht=c.__c,_t=c.unmount;function mt(t,n){c.__h&&c.__h(ot,t,at||n),at=0;var e=ot.__H||(ot.__H={__:[],__h:[]});return t>=e.__.length&&e.__.push({__V:ct}),e.__[t]}function vt(t){return at=1,function(t,n,e){var r=mt(rt++,2);if(r.t=t,!r.__c&&(r.__=[Pt(void 0,n),function(t){var n=r.__N?r.__N[0]:r.__[0],e=r.t(n,t);n!==e&&(r.__N=[e,r.__[1]],r.__c.setState({}));}],r.__c=ot,!ot.u)){ot.u=!0;var o=ot.shouldComponentUpdate;ot.shouldComponentUpdate=function(t,n,e){if(!r.__c.__H)return !0;var i=r.__c.__H.__.filter(function(t){return t.__c});if(i.every(function(t){return !t.__N}))return !o||o.call(this,t,n,e);var u=!1;return i.forEach(function(t){if(t.__N){var n=t.__[0];t.__=t.__N,t.__N=void 0,n!==t.__[0]&&(u=!0);}}),!(!u&&r.__c.props===t)&&(!o||o.call(this,t,n,e))};}return r.__N||r.__}(Pt,t)}function gt(t,n){var e=mt(rt++,3);!c.__s&&Ct(e.__H,n)&&(e.__=t,e.i=n,ot.__H.__h.push(e));}function yt(t){return at=5,bt(function(){return {current:t}},[])}function bt(t,n){var e=mt(rt++,7);return Ct(e.__H,n)?(e.__V=t(),e.i=n,e.__h=t,e.__V):e.__}function wt(){for(var t;t=lt.shift();)if(t.__P&&t.__H)try{t.__H.__h.forEach(St),t.__H.__h.forEach(Nt),t.__H.__h=[];}catch(n){t.__H.__h=[],c.__e(n,t.__v);}}c.__b=function(t){ot=null,ft&&ft(t);},c.__r=function(t){pt&&pt(t),rt=0;var n=(ot=t.__c).__H;n&&(it===ot?(n.__h=[],ot.__h=[],n.__.forEach(function(t){t.__N&&(t.__=t.__N),t.__V=ct,t.__N=t.i=void 0;})):(n.__h.forEach(St),n.__h.forEach(Nt),n.__h=[])),it=ot;},c.diffed=function(t){dt&&dt(t);var n=t.__c;n&&n.__H&&(n.__H.__h.length&&(1!==lt.push(n)&&ut===c.requestAnimationFrame||((ut=c.requestAnimationFrame)||kt)(wt)),n.__H.__.forEach(function(t){t.i&&(t.__H=t.i),t.__V!==ct&&(t.__=t.__V),t.i=void 0,t.__V=ct;})),it=ot=null;},c.__c=function(t,n){n.some(function(t){try{t.__h.forEach(St),t.__h=t.__h.filter(function(t){return !t.__||Nt(t)});}catch(e){n.some(function(t){t.__h&&(t.__h=[]);}),n=[],c.__e(e,t.__v);}}),ht&&ht(t,n);},c.unmount=function(t){_t&&_t(t);var n,e=t.__c;e&&e.__H&&(e.__H.__.forEach(function(t){try{St(t);}catch(t){n=t;}}),e.__H=void 0,n&&c.__e(n,e.__v));};var xt="function"==typeof requestAnimationFrame;function kt(t){var n,e=function(){clearTimeout(r),xt&&cancelAnimationFrame(n),setTimeout(t);},r=setTimeout(e,100);xt&&(n=requestAnimationFrame(e));}function St(t){var n=ot,e=t.__c;"function"==typeof e&&(t.__c=void 0,e()),ot=n;}function Nt(t){var n=ot;t.__c=t.__(),ot=n;}function Ct(t,n){return !t||t.length!==n.length||n.some(function(n,e){return n!==t[e]})}function Pt(t,n){return "function"==typeof n?n(t):n}function Et(){return function(t){var n=ot.context[t.__c],e=mt(rt++,9);return e.c=t,n?(null==e.__&&(e.__=!0,n.sub(ot)),n.props.value):t.__}(cn)}var It={search:{placeholder:"Type a keyword..."},sort:{sortAsc:"Sort column ascending",sortDesc:"Sort column descending"},pagination:{previous:"Previous",next:"Next",navigate:function(t,n){return "Page "+t+" of "+n},page:function(t){return "Page "+t},showing:"Showing",of:"of",to:"to",results:"results"},loading:"Loading...",noRecordsFound:"No matching records found",error:"An error happened while fetching the data"},Tt=/*#__PURE__*/function(){function t(t){this._language=void 0,this._defaultLanguage=void 0,this._language=t,this._defaultLanguage=It;}var n=t.prototype;return n.getString=function(t,n){if(!n||!t)return null;var e=t.split("."),r=e[0];if(n[r]){var o=n[r];return "string"==typeof o?function(){return o}:"function"==typeof o?o:this.getString(e.slice(1).join("."),o)}return null},n.translate=function(t){var n,e=this.getString(t,this._language);return (n=e||this.getString(t,this._defaultLanguage))?n.apply(void 0,[].slice.call(arguments,1)):t},t}();function Lt(){var t=Et();return function(n){var e;return (e=t.translator).translate.apply(e,[n].concat([].slice.call(arguments,1)))}}var At=function(t){return function(n){return e({},n,{search:{keyword:t}})}};function Ht(){return Et().store}function jt(t){var n=Ht(),e=vt(t(n.getState())),r=e[0],o=e[1];return gt(function(){return n.subscribe(function(){var e=t(n.getState());r!==e&&o(e);})},[]),r}function Dt(){var t,n=vt(void 0),e=n[0],r=n[1],o=Et(),i=o.search,u=Lt(),s=Ht().dispatch,a=jt(function(t){return t.search});gt(function(){e&&e.setProps({keyword:null==a?void 0:a.keyword});},[a,e]),gt(function(){r(i.server?new st({keyword:i.keyword,url:i.server.url,body:i.server.body}):new tt({keyword:i.keyword,columns:o.header&&o.header.columns,ignoreHiddenColumns:i.ignoreHiddenColumns||void 0===i.ignoreHiddenColumns,selector:i.selector})),i.keyword&&s(At(i.keyword));},[i]),gt(function(){return o.pipeline.register(e),function(){return o.pipeline.unregister(e)}},[o,e]);var l,c,f,p=function(t,n){return at=8,bt(function(){return t},n)}((l=function(t){t.target instanceof HTMLInputElement&&s(At(t.target.value));},c=e instanceof st?i.debounceTimeout||250:0,function(){var t=arguments;return new Promise(function(n){f&&clearTimeout(f),f=setTimeout(function(){return n(l.apply(void 0,[].slice.call(t)))},c);})}),[i,e]);return w("div",{className:nt(et("search",null==(t=o.className)?void 0:t.search))},w("input",{type:"search",placeholder:u("search.placeholder"),"aria-label":u("search.placeholder"),onInput:p,className:et(nt("input"),nt("search","input")),value:(null==a?void 0:a.keyword)||""}))}var Mt=/*#__PURE__*/function(t){function e(){return t.apply(this,arguments)||this}r(e,t);var o=e.prototype;return o.validateProps=function(){if(isNaN(Number(this.props.limit))||isNaN(Number(this.props.page)))throw Error("Invalid parameters passed")},o._process=function(t){var n=this.props.page;return new J(t.rows.slice(n*this.props.limit,(n+1)*this.props.limit))},n(e,[{key:"type",get:function(){return K.Limit}}]),e}(Y),Ft=/*#__PURE__*/function(t){function o(){return t.apply(this,arguments)||this}return r(o,t),o.prototype._process=function(t){var n={};return this.props.url&&(n.url=this.props.url(t.url,this.props.page,this.props.limit)),this.props.body&&(n.body=this.props.body(t.body,this.props.page,this.props.limit)),e({},t,n)},n(o,[{key:"type",get:function(){return K.ServerLimit}}]),o}(Y);function Ot(){var t=Et(),n=t.pagination,e=n.server,r=n.summary,o=void 0===r||r,i=n.nextButton,u=void 0===i||i,s=n.prevButton,a=void 0===s||s,l=n.buttonsCount,c=void 0===l?3:l,f=n.limit,p=void 0===f?10:f,d=n.page,h=void 0===d?0:d,_=n.resetPageOnUpdate,m=void 0===_||_,v=yt(null),g=vt(h),y=g[0],b=g[1],x=vt(0),k=x[0],N=x[1],C=Lt();gt(function(){return v.current=e?new Ft({limit:p,page:y,url:e.url,body:e.body}):new Mt({limit:p,page:y}),v.current instanceof Ft?t.pipeline.on("afterProcess",function(t){return N(t.length)}):v.current instanceof Mt&&v.current.on("beforeProcess",function(t){return N(t.length)}),t.pipeline.on("updated",P),t.pipeline.register(v.current),t.pipeline.on("error",function(){N(0),b(0);}),function(){t.pipeline.unregister(v.current),t.pipeline.off("updated",P);}},[]);var P=function(t){m&&t!==v.current&&b(0);},E=function(){return Math.ceil(k/p)},I=function(t){if(t>=E()||t<0||t===y)return null;b(t),v.current.setProps({page:t});};return w("div",{className:et(nt("pagination"),t.className.pagination)},w(S,null,o&&k>0&&w("div",{role:"status","aria-live":"polite",className:et(nt("summary"),t.className.paginationSummary),title:C("pagination.navigate",y+1,E())},C("pagination.showing")," ",w("b",null,C(""+(y*p+1)))," ",C("pagination.to")," ",w("b",null,C(""+Math.min((y+1)*p,k)))," ",C("pagination.of")," ",w("b",null,C(""+k))," ",C("pagination.results"))),w("div",{className:nt("pages")},a&&w("button",{tabIndex:0,role:"button",disabled:0===y,onClick:function(){return I(y-1)},title:C("pagination.previous"),"aria-label":C("pagination.previous"),className:et(t.className.paginationButton,t.className.paginationButtonPrev)},C("pagination.previous")),function(){if(c<=0)return null;var n=Math.min(E(),c),e=Math.min(y,Math.floor(n/2));return y+Math.floor(n/2)>=E()&&(e=n-(E()-y)),w(S,null,E()>n&&y-e>0&&w(S,null,w("button",{tabIndex:0,role:"button",onClick:function(){return I(0)},title:C("pagination.firstPage"),"aria-label":C("pagination.firstPage"),className:t.className.paginationButton},C("1")),w("button",{tabIndex:-1,className:et(nt("spread"),t.className.paginationButton)},"...")),Array.from(Array(n).keys()).map(function(t){return y+(t-e)}).map(function(n){return w("button",{tabIndex:0,role:"button",onClick:function(){return I(n)},className:et(y===n?et(nt("currentPage"),t.className.paginationButtonCurrent):null,t.className.paginationButton),title:C("pagination.page",n+1),"aria-label":C("pagination.page",n+1)},C(""+(n+1)))}),E()>n&&E()>y+e+1&&w(S,null,w("button",{tabIndex:-1,className:et(nt("spread"),t.className.paginationButton)},"..."),w("button",{tabIndex:0,role:"button",onClick:function(){return I(E()-1)},title:C("pagination.page",E()),"aria-label":C("pagination.page",E()),className:t.className.paginationButton},C(""+E()))))}(),u&&w("button",{tabIndex:0,role:"button",disabled:E()===y+1||0===E(),onClick:function(){return I(y+1)},title:C("pagination.next"),"aria-label":C("pagination.next"),className:et(t.className.paginationButton,t.className.paginationButtonNext)},C("pagination.next"))))}function Rt(t,n){return "string"==typeof t?t.indexOf("%")>-1?n/100*parseInt(t,10):parseInt(t,10):t}function Ut(t){return t?Math.floor(t)+"px":""}function Wt(t){var n=t.tableRef.cloneNode(!0);return n.style.position="absolute",n.style.width="100%",n.style.zIndex="-2147483640",n.style.visibility="hidden",w("div",{ref:function(t){t&&t.appendChild(n);}})}function Bt(t){if(!t)return "";var n=t.split(" ");return 1===n.length&&/([a-z][A-Z])+/g.test(t)?t:n.map(function(t,n){return 0==n?t.toLowerCase():t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()}).join("")}var qt,zt=new(/*#__PURE__*/function(){function t(){}var n=t.prototype;return n.format=function(t,n){return "[Grid.js] ["+n.toUpperCase()+"]: "+t},n.error=function(t,n){void 0===n&&(n=!1);var e=this.format(t,"error");if(n)throw Error(e);console.error(e);},n.warn=function(t){console.warn(this.format(t,"warn"));},n.info=function(t){console.info(this.format(t,"info"));},t}());!function(t){t[t.Header=0]="Header",t[t.Footer=1]="Footer",t[t.Cell=2]="Cell";}(qt||(qt={}));var Vt=/*#__PURE__*/function(){function t(){this.plugins=void 0,this.plugins=[];}var n=t.prototype;return n.get=function(t){return this.plugins.find(function(n){return n.id===t})},n.add=function(t){return t.id?this.get(t.id)?(zt.error("Duplicate plugin ID: "+t.id),this):(this.plugins.push(t),this):(zt.error("Plugin ID cannot be empty"),this)},n.remove=function(t){var n=this.get(t);return n&&this.plugins.splice(this.plugins.indexOf(n),1),this},n.list=function(t){var n;return n=null!=t||null!=t?this.plugins.filter(function(n){return n.position===t}):this.plugins,n.sort(function(t,n){return t.order&&n.order?t.order-n.order:1})},t}();function $t(t){var n=this,r=Et();if(t.pluginId){var o=r.plugin.get(t.pluginId);return o?w(S,{},w(o.component,e({plugin:o},t.props))):null}return void 0!==t.position?w(S,{},r.plugin.list(t.position).map(function(t){return w(t.component,e({plugin:t},n.props.props))})):null}var Gt=/*#__PURE__*/function(t){function o(){var n;return (n=t.call(this)||this)._columns=void 0,n._columns=[],n}r(o,t);var i=o.prototype;return i.adjustWidth=function(t,n,r){var i=t.container,u=t.autoWidth;if(!i)return this;var a=i.clientWidth,l={};n.current&&u&&(q(w(Wt,{tableRef:n.current}),r.current),l=function(t){var n=t.querySelector("table");if(!n)return {};var r=n.className,o=n.style.cssText;n.className=r+" "+nt("shadowTable"),n.style.tableLayout="auto",n.style.width="auto",n.style.padding="0",n.style.margin="0",n.style.border="none",n.style.outline="none";var i=Array.from(n.parentNode.querySelectorAll("thead th")).reduce(function(t,n){var r;return n.style.width=n.clientWidth+"px",e(((r={})[n.getAttribute("data-column-id")]={minWidth:n.clientWidth},r),t)},{});return n.className=r,n.style.cssText=o,n.style.tableLayout="auto",Array.from(n.parentNode.querySelectorAll("thead th")).reduce(function(t,n){return t[n.getAttribute("data-column-id")].width=n.clientWidth,t},i)}(r.current));for(var c,f=s(o.tabularFormat(this.columns).reduce(function(t,n){return t.concat(n)},[]));!(c=f()).done;){var p=c.value;p.columns&&p.columns.length>0||(!p.width&&u?p.id in l&&(p.width=Ut(l[p.id].width),p.minWidth=Ut(l[p.id].minWidth)):p.width=Ut(Rt(p.width,a)));}return n.current&&u&&q(null,r.current),this},i.setSort=function(t,n){for(var r,o=s(n||this.columns||[]);!(r=o()).done;){var i=r.value;i.columns&&i.columns.length>0?i.sort=void 0:void 0===i.sort&&t?i.sort={}:i.sort?"object"==typeof i.sort&&(i.sort=e({},i.sort)):i.sort=void 0,i.columns&&this.setSort(t,i.columns);}},i.setResizable=function(t,n){for(var e,r=s(n||this.columns||[]);!(e=r()).done;){var o=e.value;void 0===o.resizable&&(o.resizable=t),o.columns&&this.setResizable(t,o.columns);}},i.setID=function(t){for(var n,e=s(t||this.columns||[]);!(n=e()).done;){var r=n.value;r.id||"string"!=typeof r.name||(r.id=Bt(r.name)),r.id||zt.error('Could not find a valid ID for one of the columns. Make sure a valid "id" is set for all columns.'),r.columns&&this.setID(r.columns);}},i.populatePlugins=function(t,n){for(var r,o=s(n);!(r=o()).done;){var i=r.value;void 0!==i.plugin&&t.add(e({id:i.id},i.plugin,{position:qt.Cell}));}},o.fromColumns=function(t){for(var n,e=new o,r=s(t);!(n=r()).done;){var i=n.value;if("string"==typeof i||p(i))e.columns.push({name:i});else if("object"==typeof i){var u=i;u.columns&&(u.columns=o.fromColumns(u.columns).columns),"object"==typeof u.plugin&&void 0===u.data&&(u.data=null),e.columns.push(i);}}return e},o.createFromConfig=function(t){var n=new o;return t.from?n.columns=o.fromHTMLTable(t.from).columns:t.columns?n.columns=o.fromColumns(t.columns).columns:!t.data||"object"!=typeof t.data[0]||t.data[0]instanceof Array||(n.columns=Object.keys(t.data[0]).map(function(t){return {name:t}})),n.columns.length?(n.setID(),n.setSort(t.sort),n.setResizable(t.resizable),n.populatePlugins(t.plugin,n.columns),n):null},o.fromHTMLTable=function(t){for(var n,e=new o,r=s(t.querySelector("thead").querySelectorAll("th"));!(n=r()).done;){var i=n.value;e.columns.push({name:i.innerHTML,width:i.width});}return e},o.tabularFormat=function(t){var n=[],e=t||[],r=[];if(e&&e.length){n.push(e);for(var o,i=s(e);!(o=i()).done;){var u=o.value;u.columns&&u.columns.length&&(r=r.concat(u.columns));}r.length&&(n=n.concat(this.tabularFormat(r)));}return n},o.leafColumns=function(t){var n=[],e=t||[];if(e&&e.length)for(var r,o=s(e);!(r=o()).done;){var i=r.value;i.columns&&0!==i.columns.length||n.push(i),i.columns&&(n=n.concat(this.leafColumns(i.columns)));}return n},o.maximumDepth=function(t){return this.tabularFormat([t]).length-1},n(o,[{key:"columns",get:function(){return this._columns},set:function(t){this._columns=t;}},{key:"visibleColumns",get:function(){return this._columns.filter(function(t){return !t.hidden})}}]),o}(V),Kt=function(){},Xt=/*#__PURE__*/function(t){function n(n){var e;return (e=t.call(this)||this).data=void 0,e.set(n),e}r(n,t);var e=n.prototype;return e.get=function(){try{return Promise.resolve(this.data()).then(function(t){return {data:t,total:t.length}})}catch(t){return Promise.reject(t)}},e.set=function(t){return t instanceof Array?this.data=function(){return t}:t instanceof Function&&(this.data=t),this},n}(Kt),Zt=/*#__PURE__*/function(t){function n(n){var e;return (e=t.call(this)||this).options=void 0,e.options=n,e}r(n,t);var o=n.prototype;return o.handler=function(t){return "function"==typeof this.options.handle?this.options.handle(t):t.ok?t.json():(zt.error("Could not fetch data: "+t.status+" - "+t.statusText,!0),null)},o.get=function(t){var n=e({},this.options,t);return "function"==typeof n.data?n.data(n):fetch(n.url,n).then(this.handler.bind(this)).then(function(t){return {data:n.then(t),total:"function"==typeof n.total?n.total(t):void 0}})},n}(Kt),Jt=/*#__PURE__*/function(){function t(){}return t.createFromConfig=function(t){var n=null;return t.data&&(n=new Xt(t.data)),t.from&&(n=new Xt(this.tableElementToArray(t.from)),t.from.style.display="none"),t.server&&(n=new Zt(t.server)),n||zt.error("Could not determine the storage type",!0),n},t.tableElementToArray=function(t){for(var n,e,r=[],o=s(t.querySelector("tbody").querySelectorAll("tr"));!(n=o()).done;){for(var i,u=[],a=s(n.value.querySelectorAll("td"));!(i=a()).done;){var l=i.value;1===l.childNodes.length&&l.childNodes[0].nodeType===Node.TEXT_NODE?u.push((e=l.innerHTML,(new DOMParser).parseFromString(e,"text/html").documentElement.textContent)):u.push(G(l.innerHTML));}r.push(u);}return r},t}(),Qt="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function Yt(t,n,e){if(!t.s){if(e instanceof tn){if(!e.s)return void(e.o=Yt.bind(null,t,n));1&n&&(n=e.s),e=e.v;}if(e&&e.then)return void e.then(Yt.bind(null,t,n),Yt.bind(null,t,2));t.s=n,t.v=e;var r=t.o;r&&r(t);}}var tn=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(n,e){var r=new t,o=this.s;if(o){var i=1&o?n:e;if(i){try{Yt(r,1,i(this.v));}catch(t){Yt(r,2,t);}return r}return this}return this.o=function(t){try{var o=t.v;1&t.s?Yt(r,1,n?n(o):o):e?Yt(r,1,e(o)):Yt(r,2,o);}catch(t){Yt(r,2,t);}},r},t}();function nn(t){return t instanceof tn&&1&t.s}var en=/*#__PURE__*/function(t){function e(n){var e;return (e=t.call(this)||this)._steps=new Map,e.cache=new Map,e.lastProcessorIndexUpdated=-1,n&&n.forEach(function(t){return e.register(t)}),e}r(e,t);var o=e.prototype;return o.clearCache=function(){this.cache=new Map,this.lastProcessorIndexUpdated=-1;},o.register=function(t,n){if(void 0===n&&(n=null),t){if(null===t.type)throw Error("Processor type is not defined");t.on("propsUpdated",this.processorPropsUpdated.bind(this)),this.addProcessorByPriority(t,n),this.afterRegistered(t);}},o.unregister=function(t){if(t){var n=this._steps.get(t.type);n&&n.length&&(this._steps.set(t.type,n.filter(function(n){return n!=t})),this.emit("updated",t));}},o.addProcessorByPriority=function(t,n){var e=this._steps.get(t.type);if(!e){var r=[];this._steps.set(t.type,r),e=r;}if(null===n||n<0)e.push(t);else if(e[n]){var o=e.slice(0,n-1),i=e.slice(n+1);this._steps.set(t.type,o.concat(t).concat(i));}else e[n]=t;},o.getStepsByType=function(t){return this.steps.filter(function(n){return n.type===t})},o.getSortedProcessorTypes=function(){return Object.keys(K).filter(function(t){return !isNaN(Number(t))}).map(function(t){return Number(t)})},o.process=function(t){try{var n=function(t){return e.lastProcessorIndexUpdated=o.length,e.emit("afterProcess",i),i},e=this,r=e.lastProcessorIndexUpdated,o=e.steps,i=t,u=function(t,n){try{var u=function(t,n,e){if("function"==typeof t[Qt]){var r,o,i,u=t[Qt]();if(function t(e){try{for(;!(r=u.next()).done;)if((e=n(r.value))&&e.then){if(!nn(e))return void e.then(t,i||(i=Yt.bind(null,o=new tn,2)));e=e.v;}o?Yt(o,1,e):o=e;}catch(t){Yt(o||(o=new tn),2,t);}}(),u.return){var s=function(t){try{r.done||u.return();}catch(t){}return t};if(o&&o.then)return o.then(s,function(t){throw s(t)});s();}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var a=[],l=0;l<t.length;l++)a.push(t[l]);return function(t,n,e){var r,o,i=-1;return function e(u){try{for(;++i<t.length;)if((u=n(i))&&u.then){if(!nn(u))return void u.then(e,o||(o=Yt.bind(null,r=new tn,2)));u=u.v;}r?Yt(r,1,u):r=u;}catch(t){Yt(r||(r=new tn),2,t);}}(),r}(a,function(t){return n(a[t])})}(o,function(t){var n=e.findProcessorIndexByID(t.id),o=function(){if(n>=r)return Promise.resolve(t.process(i)).then(function(n){e.cache.set(t.id,i=n);});i=e.cache.get(t.id);}();if(o&&o.then)return o.then(function(){})});}catch(t){return n(t)}return u&&u.then?u.then(void 0,n):u}(0,function(t){throw zt.error(t),e.emit("error",i),t});return Promise.resolve(u&&u.then?u.then(n):n())}catch(t){return Promise.reject(t)}},o.findProcessorIndexByID=function(t){return this.steps.findIndex(function(n){return n.id==t})},o.setLastProcessorIndex=function(t){var n=this.findProcessorIndexByID(t.id);this.lastProcessorIndexUpdated>n&&(this.lastProcessorIndexUpdated=n);},o.processorPropsUpdated=function(t){this.setLastProcessorIndex(t),this.emit("propsUpdated"),this.emit("updated",t);},o.afterRegistered=function(t){this.setLastProcessorIndex(t),this.emit("afterRegister"),this.emit("updated",t);},n(e,[{key:"steps",get:function(){for(var t,n=[],e=s(this.getSortedProcessorTypes());!(t=e()).done;){var r=this._steps.get(t.value);r&&r.length&&(n=n.concat(r));}return n.filter(function(t){return t})}}]),e}(Q),rn=/*#__PURE__*/function(t){function e(){return t.apply(this,arguments)||this}return r(e,t),e.prototype._process=function(t){try{return Promise.resolve(this.props.storage.get(t))}catch(t){return Promise.reject(t)}},n(e,[{key:"type",get:function(){return K.Extractor}}]),e}(Y),on=/*#__PURE__*/function(t){function e(){return t.apply(this,arguments)||this}return r(e,t),e.prototype._process=function(t){var n=J.fromArray(t.data);return n.length=t.total,n},n(e,[{key:"type",get:function(){return K.Transformer}}]),e}(Y),un=/*#__PURE__*/function(t){function o(){return t.apply(this,arguments)||this}return r(o,t),o.prototype._process=function(){return Object.entries(this.props.serverStorageOptions).filter(function(t){return "function"!=typeof t[1]}).reduce(function(t,n){var r;return e({},t,((r={})[n[0]]=n[1],r))},{})},n(o,[{key:"type",get:function(){return K.Initiator}}]),o}(Y),sn=/*#__PURE__*/function(t){function e(){return t.apply(this,arguments)||this}r(e,t);var o=e.prototype;return o.castData=function(t){if(!t||!t.length)return [];if(!this.props.header||!this.props.header.columns)return t;var n=Gt.leafColumns(this.props.header.columns);return t[0]instanceof Array?t.map(function(t){var e=0;return n.map(function(n,r){return void 0!==n.data?(e++,"function"==typeof n.data?n.data(t):n.data):t[r-e]})}):"object"!=typeof t[0]||t[0]instanceof Array?[]:t.map(function(t){return n.map(function(n,e){return void 0!==n.data?"function"==typeof n.data?n.data(t):n.data:n.id?t[n.id]:(zt.error("Could not find the correct cell for column at position "+e+".\n                          Make sure either 'id' or 'selector' is defined for all columns."),null)})})},o._process=function(t){return {data:this.castData(t.data),total:t.total}},n(e,[{key:"type",get:function(){return K.Transformer}}]),e}(Y),an=/*#__PURE__*/function(){function t(){}return t.createFromConfig=function(t){var n=new en;return t.storage instanceof Zt&&n.register(new un({serverStorageOptions:t.server})),n.register(new rn({storage:t.storage})),n.register(new sn({header:t.header})),n.register(new on),n},t}(),ln=function(t){var n=this;this.state=void 0,this.listeners=[],this.isDispatching=!1,this.getState=function(){return n.state},this.getListeners=function(){return n.listeners},this.dispatch=function(t){if("function"!=typeof t)throw new Error("Reducer is not a function");if(n.isDispatching)throw new Error("Reducers may not dispatch actions");n.isDispatching=!0;var e=n.state;try{n.state=t(n.state);}finally{n.isDispatching=!1;}for(var r,o=s(n.listeners);!(r=o()).done;)(0, r.value)(n.state,e);return n.state},this.subscribe=function(t){if("function"!=typeof t)throw new Error("Listener is not a function");return n.listeners=[].concat(n.listeners,[t]),function(){return n.listeners=n.listeners.filter(function(n){return n!==t})}},this.state=t;},cn=function(t,n){var e={__c:n="__cC"+_++,__:null,Consumer:function(t,n){return t.children(n)},Provider:function(t){var e,r;return this.getChildContext||(e=[],(r={})[n]=this,this.getChildContext=function(){return r},this.shouldComponentUpdate=function(t){this.props.value!==t.value&&e.some(E);},this.sub=function(t){e.push(t);var n=t.componentWillUnmount;t.componentWillUnmount=function(){e.splice(e.indexOf(t),1),n&&n.call(t);};}),t.children}};return e.Provider.__=e.Consumer.contextType=e}(),fn=/*#__PURE__*/function(){function t(){Object.assign(this,t.defaultConfig());}var n=t.prototype;return n.assign=function(t){return Object.assign(this,t)},n.update=function(n){return n?(this.assign(t.fromPartialConfig(e({},this,n))),this):this},t.defaultConfig=function(){return {store:new ln({status:a.Init,header:void 0,data:null}),plugin:new Vt,tableRef:{current:null},width:"100%",height:"auto",autoWidth:!0,style:{},className:{}}},t.fromPartialConfig=function(n){var e=(new t).assign(n);return "boolean"==typeof n.sort&&n.sort&&e.assign({sort:{multiColumn:!0}}),e.assign({header:Gt.createFromConfig(e)}),e.assign({storage:Jt.createFromConfig(e)}),e.assign({pipeline:an.createFromConfig(e)}),e.assign({translator:new Tt(e.language)}),e.search&&e.plugin.add({id:"search",position:qt.Header,component:Dt}),e.pagination&&e.plugin.add({id:"pagination",position:qt.Footer,component:Ot}),e.plugins&&e.plugins.forEach(function(t){return e.plugin.add(t)}),e},t}();function pn(t){var n,r=Et();return w("td",e({role:t.role,colSpan:t.colSpan,"data-column-id":t.column&&t.column.id,className:et(nt("td"),t.className,r.className.td),style:e({},t.style,r.style.td),onClick:function(n){t.messageCell||r.eventEmitter.emit("cellClick",n,t.cell,t.column,t.row);}},(n=t.column)?"function"==typeof n.attributes?n.attributes(t.cell.data,t.row,t.column):n.attributes:{}),t.column&&"function"==typeof t.column.formatter?t.column.formatter(t.cell.data,t.row,t.column):t.column&&t.column.plugin?w($t,{pluginId:t.column.id,props:{column:t.column,cell:t.cell,row:t.row}}):t.cell.data)}function dn(t){var n=Et(),e=jt(function(t){return t.header});return w("tr",{className:et(nt("tr"),n.className.tr),onClick:function(e){t.messageRow||n.eventEmitter.emit("rowClick",e,t.row);}},t.children?t.children:t.row.cells.map(function(n,r){var o=function(t){if(e){var n=Gt.leafColumns(e.columns);if(n)return n[t]}return null}(r);return o&&o.hidden?null:w(pn,{key:n.id,cell:n,row:t.row,column:o})}))}function hn(t){return w(dn,{messageRow:!0},w(pn,{role:"alert",colSpan:t.colSpan,messageCell:!0,cell:new X(t.message),className:et(nt("message"),t.className?t.className:null)}))}function _n(){var t=Et(),n=jt(function(t){return t.data}),e=jt(function(t){return t.status}),r=jt(function(t){return t.header}),o=Lt(),i=function(){return r?r.visibleColumns.length:0};return w("tbody",{className:et(nt("tbody"),t.className.tbody)},n&&n.rows.map(function(t){return w(dn,{key:t.id,row:t})}),e===a.Loading&&(!n||0===n.length)&&w(hn,{message:o("loading"),colSpan:i(),className:et(nt("loading"),t.className.loading)}),e===a.Rendered&&n&&0===n.length&&w(hn,{message:o("noRecordsFound"),colSpan:i(),className:et(nt("notfound"),t.className.notfound)}),e===a.Error&&w(hn,{message:o("error"),colSpan:i(),className:et(nt("error"),t.className.error)}))}var mn=/*#__PURE__*/function(t){function e(){return t.apply(this,arguments)||this}r(e,t);var o=e.prototype;return o.validateProps=function(){for(var t,n=s(this.props.columns);!(t=n()).done;){var e=t.value;void 0===e.direction&&(e.direction=1),1!==e.direction&&-1!==e.direction&&zt.error("Invalid sort direction "+e.direction);}},o.compare=function(t,n){return t>n?1:t<n?-1:0},o.compareWrapper=function(t,n){for(var e,r=0,o=s(this.props.columns);!(e=o()).done;){var i=e.value;if(0!==r)break;var u=t.cells[i.index].data,a=n.cells[i.index].data;r|="function"==typeof i.compare?i.compare(u,a)*i.direction:this.compare(u,a)*i.direction;}return r},o._process=function(t){var n=[].concat(t.rows);n.sort(this.compareWrapper.bind(this));var e=new J(n);return e.length=t.length,e},n(e,[{key:"type",get:function(){return K.Sort}}]),e}(Y),vn=function(t,n,r,o){return function(i){var u=i.sort?[].concat(i.sort.columns):[],s=u.length,a=u.find(function(n){return n.index===t}),l=!1,c=!1,f=!1,p=!1;if(void 0!==a?r?-1===a.direction?f=!0:p=!0:1===s?p=!0:s>1&&(c=!0,l=!0):0===s?l=!0:s>0&&!r?(l=!0,c=!0):s>0&&r&&(l=!0),c&&(u=[]),l)u.push({index:t,direction:n,compare:o});else if(p){var d=u.indexOf(a);u[d].direction=n;}else if(f){var h=u.indexOf(a);u.splice(h,1);}return e({},i,{sort:{columns:u}})}},gn=function(t,n,r){return function(o){var i=(o.sort?[].concat(o.sort.columns):[]).find(function(n){return n.index===t});return e({},o,i?vn(t,1===i.direction?-1:1,n,r)(o):vn(t,1,n,r)(o))}},yn=/*#__PURE__*/function(t){function o(){return t.apply(this,arguments)||this}return r(o,t),o.prototype._process=function(t){var n={};return this.props.url&&(n.url=this.props.url(t.url,this.props.columns)),this.props.body&&(n.body=this.props.body(t.body,this.props.columns)),e({},t,n)},n(o,[{key:"type",get:function(){return K.ServerSort}}]),o}(Y);function bn(t){var n=Et(),r=Lt(),o=vt(0),i=o[0],u=o[1],s=vt(void 0),a=s[0],l=s[1],c=jt(function(t){return t.sort}),f=Ht().dispatch,p=n.sort;gt(function(){var t=d();t&&l(t);},[]),gt(function(){return n.pipeline.register(a),function(){return n.pipeline.unregister(a)}},[n,a]),gt(function(){if(c){var n=c.columns.find(function(n){return n.index===t.index});u(n?n.direction:0);}},[c]),gt(function(){a&&c&&a.setProps({columns:c.columns});},[c]);var d=function(){var t=K.Sort;return p&&"object"==typeof p.server&&(t=K.ServerSort),0===n.pipeline.getStepsByType(t).length?t===K.ServerSort?new yn(e({columns:c?c.columns:[]},p.server)):new mn({columns:c?c.columns:[]}):null};return w("button",{tabIndex:-1,"aria-label":r("sort.sort"+(1===i?"Desc":"Asc")),title:r("sort.sort"+(1===i?"Desc":"Asc")),className:et(nt("sort"),nt("sort",function(t){return 1===t?"asc":-1===t?"desc":"neutral"}(i)),n.className.sort),onClick:function(n){n.preventDefault(),n.stopPropagation(),f(gn(t.index,!0===n.shiftKey&&p.multiColumn,t.compare));}})}function wn(t){var n,e=function(t){return t instanceof MouseEvent?Math.floor(t.pageX):Math.floor(t.changedTouches[0].pageX)},r=function(r){r.stopPropagation();var u,s,a,l,c,f=parseInt(t.thRef.current.style.width,10)-e(r);u=function(t){return o(t,f)},void 0===(s=10)&&(s=100),n=function(){var t=[].slice.call(arguments);a?(clearTimeout(l),l=setTimeout(function(){Date.now()-c>=s&&(u.apply(void 0,t),c=Date.now());},Math.max(s-(Date.now()-c),0))):(u.apply(void 0,t),c=Date.now(),a=!0);},document.addEventListener("mouseup",i),document.addEventListener("touchend",i),document.addEventListener("mousemove",n),document.addEventListener("touchmove",n);},o=function(n,r){n.stopPropagation();var o=t.thRef.current;r+e(n)>=parseInt(o.style.minWidth,10)&&(o.style.width=r+e(n)+"px");},i=function t(e){e.stopPropagation(),document.removeEventListener("mouseup",t),document.removeEventListener("mousemove",n),document.removeEventListener("touchmove",n),document.removeEventListener("touchend",t);};return w("div",{className:et(nt("th"),nt("resizable")),onMouseDown:r,onTouchStart:r,onClick:function(t){return t.stopPropagation()}})}function xn(t){var n=Et(),r=yt(null),o=vt({}),i=o[0],u=o[1],s=Ht().dispatch;gt(function(){if(n.fixedHeader&&r.current){var t=r.current.offsetTop;"number"==typeof t&&u({top:t});}},[r]);var a,l=function(){return null!=t.column.sort},c=function(e){e.stopPropagation(),l()&&s(gn(t.index,!0===e.shiftKey&&n.sort.multiColumn,t.column.sort.compare));};return w("th",e({ref:r,"data-column-id":t.column&&t.column.id,className:et(nt("th"),l()?nt("th","sort"):null,n.fixedHeader?nt("th","fixed"):null,n.className.th),onClick:c,style:e({},n.style.th,{minWidth:t.column.minWidth,width:t.column.width},i,t.style),onKeyDown:function(t){l()&&13===t.which&&c(t);},rowSpan:t.rowSpan>1?t.rowSpan:void 0,colSpan:t.colSpan>1?t.colSpan:void 0},(a=t.column)?"function"==typeof a.attributes?a.attributes(null,null,t.column):a.attributes:{},l()?{tabIndex:0}:{}),w("div",{className:nt("th","content")},void 0!==t.column.name?t.column.name:void 0!==t.column.plugin?w($t,{pluginId:t.column.plugin.id,props:{column:t.column}}):null),l()&&w(bn,e({index:t.index},t.column.sort)),t.column.resizable&&t.index<n.header.visibleColumns.length-1&&w(wn,{column:t.column,thRef:r}))}function kn(){var t,n=Et(),e=jt(function(t){return t.header});return e?w("thead",{key:e.id,className:et(nt("thead"),n.className.thead)},(t=Gt.tabularFormat(e.columns)).map(function(n,r){return function(t,n,r){var o=Gt.leafColumns(e.columns);return w(dn,null,t.map(function(t){return t.hidden?null:function(t,n,e,r){var o=function(t,n,e){var r=Gt.maximumDepth(t),o=e-n;return {rowSpan:Math.floor(o-r-r/o),colSpan:t.columns&&t.columns.length||1}}(t,n,r);return w(xn,{column:t,index:e,colSpan:o.colSpan,rowSpan:o.rowSpan})}(t,n,o.indexOf(t),r)}))}(n,r,t.length)})):null}var Sn=function(t){return function(n){return e({},n,{header:t})}};function Nn(){var t=Et(),n=yt(null),r=Ht().dispatch;return gt(function(){n&&r(function(t){return function(n){return e({},n,{tableRef:t})}}(n));},[n]),w("table",{ref:n,role:"grid",className:et(nt("table"),t.className.table),style:e({},t.style.table,{height:t.height})},w(kn,null),w(_n,null))}function Cn(){var t=vt(!0),n=t[0],r=t[1],o=yt(null),i=Et();return gt(function(){0===o.current.children.length&&r(!1);},[o]),n?w("div",{ref:o,className:et(nt("head"),i.className.header),style:e({},i.style.header)},w($t,{position:qt.Header})):null}function Pn(){var t=yt(null),n=vt(!0),r=n[0],o=n[1],i=Et();return gt(function(){0===t.current.children.length&&o(!1);},[t]),r?w("div",{ref:t,className:et(nt("footer"),i.className.footer),style:e({},i.style.footer)},w($t,{position:qt.Footer})):null}function En(){var t=Et(),n=Ht().dispatch,r=jt(function(t){return t.status}),o=jt(function(t){return t.data}),i=jt(function(t){return t.tableRef}),u={current:null};gt(function(){return n(Sn(t.header)),s(),t.pipeline.on("updated",s),function(){return t.pipeline.off("updated",s)}},[]),gt(function(){t.header&&r===a.Loaded&&null!=o&&o.length&&n(Sn(t.header.adjustWidth(t,i,u)));},[o,t,u]);var s=function(){try{n(function(t){return e({},t,{status:a.Loading})});var r=function(r,o){try{var i=Promise.resolve(t.pipeline.process()).then(function(t){n(function(t){return function(n){return t?e({},n,{data:t,status:a.Loaded}):n}}(t)),setTimeout(function(){n(function(t){return t.status===a.Loaded?e({},t,{status:a.Rendered}):t});},0);});}catch(t){return o(t)}return i&&i.then?i.then(void 0,o):i}(0,function(t){zt.error(t),n(function(t){return e({},t,{data:null,status:a.Error})});});return Promise.resolve(r&&r.then?r.then(function(){}):void 0)}catch(t){return Promise.reject(t)}};return w("div",{role:"complementary",className:et("gridjs",nt("container"),r===a.Loading?nt("loading"):null,t.className.container),style:e({},t.style.container,{width:t.width})},r===a.Loading&&w("div",{className:nt("loading-bar")}),w(Cn,null),w("div",{className:nt("wrapper"),style:{height:t.height}},w(Nn,null)),w(Pn,null),w("div",{ref:u,id:"gridjs-temp",className:nt("temp")}))}var In=/*#__PURE__*/function(t){function n(n){var e;return (e=t.call(this)||this).config=void 0,e.plugin=void 0,e.config=(new fn).assign({instance:i(e),eventEmitter:i(e)}).update(n),e.plugin=e.config.plugin,e}r(n,t);var e=n.prototype;return e.updateConfig=function(t){return this.config.update(t),this},e.createElement=function(){return w(cn.Provider,{value:this.config,children:w(En,{})})},e.forceRender=function(){return this.config&&this.config.container||zt.error("Container is empty. Make sure you call render() before forceRender()",!0),this.destroy(),q(this.createElement(),this.config.container),this},e.destroy=function(){this.config.pipeline.clearCache(),q(null,this.config.container);},e.render=function(t){return t||zt.error("Container element cannot be null",!0),t.childNodes.length>0?(zt.error("The container element "+t+" is not empty. Make sure the container is empty and call render() again"),this):(this.config.container=t,q(this.createElement(),t),this)},n}(Q);

const baseStyle = i$3`
  :host {
    height: 100%;
    width: 100%;
    display: block;
  }
`;

/**
 * Copied from https://unpkg.com/gridjs/dist/theme/mermaid.css
 */
const girdJsStyles = i$3`
  .gridjs-head button,
  .gridjs-footer button {
    cursor: pointer;
    background-color: transparent;
    background-image: none;
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
  }

  .gridjs-temp {
    position: relative;
  }

  .gridjs-head {
    width: 100%;
    margin-bottom: 5px;
    padding: 5px 1px;
  }
  .gridjs-head::after {
    content: '';
    display: block;
    clear: both;
  }
  .gridjs-head:empty {
    padding: 0;
    border: none;
  }

  .gridjs-container {
    overflow: hidden;
    display: inline-block;
    padding: 2px;
    color: #000;
    position: relative;
    z-index: 0;
  }

  .gridjs-footer {
    display: block;
    position: relative;
    width: 100%;
    z-index: 5;
    padding: 12px 24px;
    border-top: 1px solid #e5e7eb;
    background-color: #fff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.26);
    border-radius: 0 0 8px 8px;
    border-bottom-width: 1px;
    border-color: #e5e7eb;
  }
  .gridjs-footer:empty {
    padding: 0;
    border: none;
  }

  input.gridjs-input {
    outline: none;
    background-color: #fff;
    border: 1px solid #d2d6dc;
    border-radius: 5px;
    padding: 10px 13px;
    font-size: 12px;
    line-height: 1.45;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  input.gridjs-input:focus {
    box-shadow: 0 0 0 3px rgba(149, 189, 243, 0.5);
    border-color: #9bc2f7;
  }

  .gridjs-pagination {
    color: #3d4044;
  }
  .gridjs-pagination::after {
    content: '';
    display: block;
    clear: both;
  }
  .gridjs-pagination .gridjs-summary {
    float: left;
    margin-top: 5px;
  }
  .gridjs-pagination .gridjs-pages {
    float: right;
  }
  .gridjs-pagination .gridjs-pages button {
    padding: 5px 14px;
    border: 1px solid #d2d6dc;
    background-color: #fff;
    border-right: none;
    outline: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }
  .gridjs-pagination .gridjs-pages button:focus {
    box-shadow: 0 0 0 2px rgba(149, 189, 243, 0.5);
    position: relative;
    margin-right: -1px;
    border-right: 1px solid #d2d6dc;
  }
  .gridjs-pagination .gridjs-pages button:hover {
    background-color: #f7f7f7;
    color: rgb(60, 66, 87);
    outline: none;
  }
  .gridjs-pagination .gridjs-pages button:disabled,
  .gridjs-pagination .gridjs-pages button[disabled],
  .gridjs-pagination .gridjs-pages button:hover:disabled {
    cursor: default;
    background-color: #fff;
    color: #6b7280;
  }
  .gridjs-pagination .gridjs-pages button.gridjs-spread {
    cursor: default;
    box-shadow: none;
    background-color: #fff;
  }
  .gridjs-pagination .gridjs-pages button.gridjs-currentPage {
    background-color: #f7f7f7;
    font-weight: bold;
  }
  .gridjs-pagination .gridjs-pages button:last-child {
    border-bottom-right-radius: 6px;
    border-top-right-radius: 6px;
    border-right: 1px solid #d2d6dc;
  }
  .gridjs-pagination .gridjs-pages button:first-child {
    border-bottom-left-radius: 6px;
    border-top-left-radius: 6px;
  }
  .gridjs-pagination .gridjs-pages button:last-child:focus {
    margin-right: 0;
  }

  button.gridjs-sort {
    float: right;
    height: 24px;
    width: 13px;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position-x: center;
    cursor: pointer;
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    background-size: contain;
  }
  button.gridjs-sort-neutral {
    opacity: 0.3;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSI0MDEuOTk4cHgiIGhlaWdodD0iNDAxLjk5OHB4IiB2aWV3Qm94PSIwIDAgNDAxLjk5OCA0MDEuOTk4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MDEuOTk4IDQwMS45OTg7IgoJIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik03My4wOTIsMTY0LjQ1MmgyNTUuODEzYzQuOTQ5LDAsOS4yMzMtMS44MDcsMTIuODQ4LTUuNDI0YzMuNjEzLTMuNjE2LDUuNDI3LTcuODk4LDUuNDI3LTEyLjg0NwoJCQljMC00Ljk0OS0xLjgxMy05LjIyOS01LjQyNy0xMi44NUwyMTMuODQ2LDUuNDI0QzIxMC4yMzIsMS44MTIsMjA1Ljk1MSwwLDIwMC45OTksMHMtOS4yMzMsMS44MTItMTIuODUsNS40MjRMNjAuMjQyLDEzMy4zMzEKCQkJYy0zLjYxNywzLjYxNy01LjQyNCw3LjkwMS01LjQyNCwxMi44NWMwLDQuOTQ4LDEuODA3LDkuMjMxLDUuNDI0LDEyLjg0N0M2My44NjMsMTYyLjY0NSw2OC4xNDQsMTY0LjQ1Miw3My4wOTIsMTY0LjQ1MnoiLz4KCQk8cGF0aCBkPSJNMzI4LjkwNSwyMzcuNTQ5SDczLjA5MmMtNC45NTIsMC05LjIzMywxLjgwOC0xMi44NSw1LjQyMWMtMy42MTcsMy42MTctNS40MjQsNy44OTgtNS40MjQsMTIuODQ3CgkJCWMwLDQuOTQ5LDEuODA3LDkuMjMzLDUuNDI0LDEyLjg0OEwxODguMTQ5LDM5Ni41N2MzLjYyMSwzLjYxNyw3LjkwMiw1LjQyOCwxMi44NSw1LjQyOHM5LjIzMy0xLjgxMSwxMi44NDctNS40MjhsMTI3LjkwNy0xMjcuOTA2CgkJCWMzLjYxMy0zLjYxNCw1LjQyNy03Ljg5OCw1LjQyNy0xMi44NDhjMC00Ljk0OC0xLjgxMy05LjIyOS01LjQyNy0xMi44NDdDMzM4LjEzOSwyMzkuMzUzLDMzMy44NTQsMjM3LjU0OSwzMjguOTA1LDIzNy41NDl6Ii8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+');
    background-position-y: center;
  }
  button.gridjs-sort-asc {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSIyOTIuMzYycHgiIGhlaWdodD0iMjkyLjM2MXB4IiB2aWV3Qm94PSIwIDAgMjkyLjM2MiAyOTIuMzYxIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyOTIuMzYyIDI5Mi4zNjE7IgoJIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIGQ9Ik0yODYuOTM1LDE5Ny4yODdMMTU5LjAyOCw2OS4zODFjLTMuNjEzLTMuNjE3LTcuODk1LTUuNDI0LTEyLjg0Ny01LjQyNHMtOS4yMzMsMS44MDctMTIuODUsNS40MjRMNS40MjQsMTk3LjI4NwoJCUMxLjgwNywyMDAuOTA0LDAsMjA1LjE4NiwwLDIxMC4xMzRzMS44MDcsOS4yMzMsNS40MjQsMTIuODQ3YzMuNjIxLDMuNjE3LDcuOTAyLDUuNDI1LDEyLjg1LDUuNDI1aDI1NS44MTMKCQljNC45NDksMCw5LjIzMy0xLjgwOCwxMi44NDgtNS40MjVjMy42MTMtMy42MTMsNS40MjctNy44OTgsNS40MjctMTIuODQ3UzI5MC41NDgsMjAwLjkwNCwyODYuOTM1LDE5Ny4yODd6Ii8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+');
    background-position-y: 35%;
    background-size: 10px;
  }
  button.gridjs-sort-desc {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSIyOTIuMzYycHgiIGhlaWdodD0iMjkyLjM2MnB4IiB2aWV3Qm94PSIwIDAgMjkyLjM2MiAyOTIuMzYyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyOTIuMzYyIDI5Mi4zNjI7IgoJIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIGQ9Ik0yODYuOTM1LDY5LjM3N2MtMy42MTQtMy42MTctNy44OTgtNS40MjQtMTIuODQ4LTUuNDI0SDE4LjI3NGMtNC45NTIsMC05LjIzMywxLjgwNy0xMi44NSw1LjQyNAoJCUMxLjgwNyw3Mi45OTgsMCw3Ny4yNzksMCw4Mi4yMjhjMCw0Ljk0OCwxLjgwNyw5LjIyOSw1LjQyNCwxMi44NDdsMTI3LjkwNywxMjcuOTA3YzMuNjIxLDMuNjE3LDcuOTAyLDUuNDI4LDEyLjg1LDUuNDI4CgkJczkuMjMzLTEuODExLDEyLjg0Ny01LjQyOEwyODYuOTM1LDk1LjA3NGMzLjYxMy0zLjYxNyw1LjQyNy03Ljg5OCw1LjQyNy0xMi44NDdDMjkyLjM2Miw3Ny4yNzksMjkwLjU0OCw3Mi45OTgsMjg2LjkzNSw2OS4zNzd6Ii8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+');
    background-position-y: 65%;
    background-size: 10px;
  }
  button.gridjs-sort:focus {
    outline: none;
  }

  table.gridjs-table {
    width: 100%;
    max-width: 100%;
    border-collapse: collapse;
    text-align: left;
    display: table;
    margin: 0;
    padding: 0;
    overflow: auto;
    table-layout: fixed;
  }

  .gridjs-tbody {
    background-color: #fff;
  }

  td.gridjs-td {
    border: 1px solid #e5e7eb;
    padding: 5px 10px;
    background-color: #fff;
    box-sizing: content-box;
  }
  td.gridjs-td:first-child {
    border-left: none;
  }
  td.gridjs-td:last-child {
    border-right: none;
  }
  td.gridjs-message {
    text-align: center;
  }

  th.gridjs-th {
    position: relative;
    color: #6b7280;
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-top: none;
    padding: 14px 24px;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    box-sizing: border-box;
    white-space: nowrap;
    outline: none;
    vertical-align: middle;
  }
  th.gridjs-th .gridjs-th-content {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    float: left;
  }
  th.gridjs-th-sort {
    cursor: pointer;
  }
  th.gridjs-th-sort .gridjs-th-content {
    width: calc(100% - 15px);
  }
  th.gridjs-th-sort:hover {
    background-color: #e5e7eb;
  }
  th.gridjs-th-sort:focus {
    background-color: #e5e7eb;
  }
  th.gridjs-th-fixed {
    position: sticky;
    box-shadow: 0 1px 0 0 #e5e7eb;
  }
  @supports (-moz-appearance: none) {
    th.gridjs-th-fixed {
      box-shadow: 0 0 0 1px #e5e7eb;
    }
  }
  th.gridjs-th:first-child {
    border-left: none;
  }
  th.gridjs-th:last-child {
    border-right: none;
  }
  .gridjs-tr {
    border: none;
  }
  tr.gridjs-tr:nth-child(even) {
    background-color: #f5f5f5;
  }
  .gridjs-tr:hover  td.gridjs-td {
    border: none;
	background-color: coral; 
	color: white;
	font-size: 100%; 
  }
  .gridjs-tr-selected td {
    background-color: #ebf5ff;
  }
  .gridjs-tr:last-child td {
    border-bottom: 0;
  }

  .gridjs *,
  .gridjs :after,
  .gridjs :before {
    box-sizing: border-box;
  }

  .gridjs-wrapper {
    position: relative;
    z-index: 1;
    overflow: auto;
    width: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.26);
    border-radius: 8px 8px 0 0;
    display: block;
    border-top-width: 1px;
    border-color: #e5e7eb;
  }
  .gridjs-wrapper:nth-last-of-type(2) {
    border-radius: 8px;
    border-bottom-width: 1px;
  }

  .gridjs-search {
    float: left;
  }
  .gridjs-search-input {
    width: 250px;
  }

  .gridjs-loading-bar {
    z-index: 10;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
    opacity: 0.5;
  }
  .gridjs-loading-bar::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(204, 204, 204, 0) 0,
      rgba(204, 204, 204, 0.2) 20%,
      rgba(204, 204, 204, 0.5) 60%,
      rgba(204, 204, 204, 0)
    );
    animation: shimmer 2s infinite;
    content: '';
  }
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }

  .gridjs-td .gridjs-checkbox {
    display: block;
    margin: auto;
    cursor: pointer;
  }

  .gridjs-resizable {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 5px;
  }
  .gridjs-resizable:hover {
    cursor: ew-resize;
    background-color: #9bc2f7;
  }
`;
const styles = [baseStyle, girdJsStyles];

let NintexSamplegridRepeatingSection = _decorate([e$2('grid-activitylog-4col')], function (_initialize, _LitElement) {
  class NintexSamplegridRepeatingSection extends _LitElement {
    constructor(...args) {
      super(...args);
      _initialize(this);
    }
  }
  return {
    F: NintexSamplegridRepeatingSection,
    d: [{
      kind: "field",
      key: "grid",
      value: void 0
    }, {
      kind: "field",
      static: true,
      key: "styles",
      value() {
        return styles;
      }
    }, {
      kind: "field",
      decorators: [e$1({
        type: Boolean
      })],
      key: "sortable",
      value() {
        return false;
      }
    }, {
      kind: "field",
      decorators: [e$1()],
      key: "Data",
      value: void 0
    }, {
      kind: "field",
      decorators: [e$1()],
      key: "Col1",
      value: void 0
    }, {
      kind: "field",
      decorators: [e$1()],
      key: "Col2",
      value: void 0
    }, {
      kind: "field",
      decorators: [e$1()],
      key: "Col3",
      value: void 0
    }, {
      kind: "field",
      decorators: [e$1()],
      key: "Col4",
      value: void 0
    }, {
      kind: "method",
      static: true,
      key: "getMetaConfig",
      value:
      /**
         * Allow Grid Sorting
         */

      /**
         * Data to render in Grid
         */

      /**
         * Header for Column1
         */

      /**
         * Header for Column1
         */

      /**
         * Header for Column1
         */

      /**
         * Header for Column1
         */

      function getMetaConfig() {
        // plugin contract information
        return {
          controlName: 'grid-activitylog-4col',
          description: 'Data Grid 4Cols for Activity Log by Garrett Fernandez',
		  groupName: 'Plugins by Garrett',
          iconUrl: 'one-line-text',
          fallbackDisableSubmit: false,
          version: '1.2',
          properties: {
            sortable: {
              type: 'boolean',
              title: 'Allow Sorting',
              description: 'Select true to allow sorting'
            },
            Data: {
              type: 'string',
              title: 'Data to be rendered in the grid',
              minLength: 1,
              maxLength: 20000
            },
            Col1: {
              type: 'string',
              title: 'Header for Column1'
            },
            Col2: {
              type: 'string',
              title: 'Header for Column2'
            },
            Col3: {
              type: 'string',
              title: 'Header for Column3'
            },
            Col4: {
              type: 'string',
              title: 'Header for Column4'
            }
          }
        };
      }
    }, {
      kind: "method",
      key: "firstUpdated",
      value: function firstUpdated() {
        this.grid = new In({
          columns: [{
            id: 'col1',
            name: this.Col1
          }, {
            id: 'col2',
            name: this.Col2
          }, {
            id: 'col3',
            name: this.Col3
          }, {
            id: 'col4',
            name: this.Col4
          }],
          data: JSON.parse(this.Data),
          pagination: true,
          sort: this.sortable
        });
        this.grid.render(this.shadowRoot?.getElementById('js-canvas'));
      }
    }, {
      kind: "method",
      key: "render",
      value: function render() {
        if (this.grid) {
          this.grid.updateConfig({
            columns: [{
              id: 'col1',
              name: this.Col1
            }, {
              id: 'col2',
              name: this.Col2
            }, {
              id: 'col3',
              name: this.Col3
            }, {
              id: 'col4',
              name: this.Col4
            }],
            sort: this.sortable,
            pagination: true,
            data: JSON.parse(this.Data)
          });
          this.grid.forceRender();
        }
        return y$1`
  <div style="display:none;">${JSON.parse(this.Data)}</div>
  <div id="js-canvas"></div>`;
      }
    }]
  };
}, s$1);

export { NintexSamplegridRepeatingSection };
