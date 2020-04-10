"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
/**
 * @name TKEventEmitter
 * @license MIT
 * @description
 * custom events emitter inspired by Events module of Nodejs
 * @author TanKingKhun
 */
var TKEventEmitter = /** @class */ (function () {
    function TKEventEmitter() {
        this.listenersCache = new Map();
        this.oncedFnMap = new Map();
    }
    Object.defineProperty(TKEventEmitter.prototype, "eventNames", {
        get: function () {
            return Array.from(this.listenersCache.keys());
        },
        enumerable: true,
        configurable: true
    });
    TKEventEmitter.prototype.getCache = function (eventName) {
        return this.listenersCache.get(eventName);
    };
    TKEventEmitter.prototype.executing = function (fns) {
        fns.forEach(function (fn) { return globalThis.setTimeout(fn, 0); });
    };
    TKEventEmitter.prototype.addEventListener = function (eventName, listener) {
        var cache = this.getCache(eventName);
        if (cache) {
            cache.add(listener);
        }
        else {
            this.listenersCache.set(eventName, new Set([listener]));
        }
        return this;
    };
    TKEventEmitter.prototype.removeAllListeners = function (eventName) {
        var _this = this;
        if (eventName) {
            this.listenersCache.get(eventName).forEach(function (fn) {
                // remove all once cached fn
                _this.oncedFnMap.delete(fn);
            });
            this.listenersCache.delete(eventName);
        }
        else {
            this.listenersCache = new Map();
        }
    };
    TKEventEmitter.prototype.removeListener = function (eventName, listener) {
        var cache = this.getCache(eventName);
        if (cache) {
            return cache.delete(listener);
        }
        return false;
    };
    TKEventEmitter.prototype.listenerCount = function (eventName) {
        var cache = this.getCache(eventName);
        if (cache) {
            return cache.size;
        }
        return 0;
    };
    TKEventEmitter.prototype.listeners = function (eventName) {
        var cache = this.getCache(eventName);
        if (cache) {
            return Array.from(cache);
        }
        return [];
    };
    TKEventEmitter.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var cache = this.getCache(eventName);
        if (cache) {
            var bindedFn = Array.from(cache).map(function (fn) { return fn.bind.apply(fn, __spreadArrays([null], args)); });
            this.executing(bindedFn);
        }
        return this;
    };
    TKEventEmitter.prototype.off = function (eventName, listener) {
        var cache = this.getCache(eventName);
        if (cache) {
            var wrap = this.oncedFnMap.get(listener);
            if (wrap) {
                this.oncedFnMap.delete(listener);
                return cache.delete(wrap);
            }
            return cache.delete(listener);
        }
        return false;
    };
    TKEventEmitter.prototype.on = function (eventName, listener) {
        return this.addEventListener(eventName, listener);
    };
    TKEventEmitter.prototype.once = function (eventName, listener) {
        var _this = this;
        var wrap = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            try {
                listener.call.apply(listener, __spreadArrays([null], args));
            }
            catch (err) {
                _this.off(eventName, wrap);
                throw err;
            }
        };
        this.oncedFnMap.set(listener, wrap);
        return this.addEventListener(eventName, wrap);
    };
    return TKEventEmitter;
}());
