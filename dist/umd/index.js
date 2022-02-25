(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TKEventEmitter = void 0;
    /**
     * @name TKEventEmitter
     * @license MIT
     * @author TanKingKhun
     */
    var TKEventEmitter = /** @class */ (function () {
        function TKEventEmitter() {
            this.cache = Object.create(null);
        }
        Object.defineProperty(TKEventEmitter.prototype, "eventNames", {
            get: function () {
                return Object.keys(this.cache);
            },
            enumerable: false,
            configurable: true
        });
        TKEventEmitter.prototype.addEventListener = function (name, listener) {
            if (!name) {
                return this;
            }
            var funcs = this.cache[name] || [];
            this.cache[name] = funcs;
            if (funcs.indexOf(listener) < 0) {
                funcs.push(listener);
            }
            return this;
        };
        TKEventEmitter.prototype.removeAllListeners = function (name) {
            if (!name) {
                this.cache = Object.create(null);
                return true;
            }
            var funcs = this.cache[name];
            if (funcs) {
                this.cache[name] = [];
                return true;
            }
            return false;
        };
        TKEventEmitter.prototype.removeListener = function (name, listener) {
            if (!name) {
                return false;
            }
            var funcs = this.cache[name];
            if (funcs) {
                var index = funcs.indexOf(listener);
                if (index > -1) {
                    funcs.splice(index, 1);
                    return true;
                }
            }
            return false;
        };
        TKEventEmitter.prototype.listenerCount = function (name) {
            return (this.cache[name] || []).length;
        };
        TKEventEmitter.prototype.listeners = function (name) {
            return this.cache[name] || [];
        };
        TKEventEmitter.prototype.emit = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var funcs = this.cache[name];
            if (funcs) {
                var queue = funcs.slice();
                try {
                    for (var i = 0, size = queue.length; i < size; i++) {
                        queue[i].apply(queue, args);
                    }
                }
                catch (err) {
                    this.emit('error', err);
                    throw err;
                }
            }
        };
        TKEventEmitter.prototype.off = function (name, listener) {
            return this.removeListener(name, listener);
        };
        TKEventEmitter.prototype.on = function (name, listener) {
            return this.addEventListener(name, listener);
        };
        TKEventEmitter.prototype.once = function (name, listener) {
            var _this = this;
            var funcs = this.cache[name] || [];
            var autoRemove = function () {
                _this.removeListener(name, listener);
                _this.removeListener(name, autoRemove);
            };
            funcs.push(listener);
            funcs.push(autoRemove);
            this.cache[name] = funcs;
            return this;
        };
        TKEventEmitter.shared = new TKEventEmitter;
        return TKEventEmitter;
    }());
    exports.TKEventEmitter = TKEventEmitter;
    exports.default = TKEventEmitter;
});
