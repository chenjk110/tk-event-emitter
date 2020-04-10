"use strict";
/**
 * @name TKEventEmitter
 * @license MIT
 * @description
 * custom events emitter inspired by Events module of Nodejs
 * @author TanKingKhun
 */
class TKEventEmitter {
    constructor() {
        this.listenersCache = new Map();
        this.oncedFnMap = new Map();
    }
    get eventNames() {
        return Array.from(this.listenersCache.keys());
    }
    getCache(eventName) {
        return this.listenersCache.get(eventName);
    }
    executing(fns) {
        fns.forEach((fn) => globalThis.setTimeout(fn, 0));
    }
    addEventListener(eventName, listener) {
        const cache = this.getCache(eventName);
        if (cache) {
            cache.add(listener);
        }
        else {
            this.listenersCache.set(eventName, new Set([listener]));
        }
        return this;
    }
    removeAllListeners(eventName) {
        if (eventName) {
            this.listenersCache.get(eventName).forEach((fn) => {
                // remove all once cached fn
                this.oncedFnMap.delete(fn);
            });
            this.listenersCache.delete(eventName);
        }
        else {
            this.listenersCache = new Map();
        }
    }
    removeListener(eventName, listener) {
        const cache = this.getCache(eventName);
        if (cache) {
            return cache.delete(listener);
        }
        return false;
    }
    listenerCount(eventName) {
        const cache = this.getCache(eventName);
        if (cache) {
            return cache.size;
        }
        return 0;
    }
    listeners(eventName) {
        const cache = this.getCache(eventName);
        if (cache) {
            return Array.from(cache);
        }
        return [];
    }
    emit(eventName, ...args) {
        const cache = this.getCache(eventName);
        if (cache) {
            const bindedFn = Array.from(cache).map((fn) => fn.bind(null, ...args));
            this.executing(bindedFn);
        }
        return this;
    }
    off(eventName, listener) {
        const cache = this.getCache(eventName);
        if (cache) {
            const wrap = this.oncedFnMap.get(listener);
            if (wrap) {
                this.oncedFnMap.delete(listener);
                return cache.delete(wrap);
            }
            return cache.delete(listener);
        }
        return false;
    }
    on(eventName, listener) {
        return this.addEventListener(eventName, listener);
    }
    once(eventName, listener) {
        const wrap = (...args) => {
            try {
                listener.call(null, ...args);
            }
            catch (err) {
                this.off(eventName, wrap);
                throw err;
            }
        };
        this.oncedFnMap.set(listener, wrap);
        return this.addEventListener(eventName, wrap);
    }
}
