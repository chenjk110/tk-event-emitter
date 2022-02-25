"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TKEventEmitter = void 0;
/**
 * @name TKEventEmitter
 * @license MIT
 * @author TanKingKhun
 */
class TKEventEmitter {
    constructor() {
        this.cache = Object.create(null);
    }
    get eventNames() {
        return Object.keys(this.cache);
    }
    addEventListener(name, listener) {
        if (!name) {
            return this;
        }
        const funcs = this.cache[name] || [];
        this.cache[name] = funcs;
        if (funcs.indexOf(listener) < 0) {
            funcs.push(listener);
        }
        return this;
    }
    removeAllListeners(name) {
        if (!name) {
            this.cache = Object.create(null);
            return true;
        }
        const funcs = this.cache[name];
        if (funcs) {
            this.cache[name] = [];
            return true;
        }
        return false;
    }
    removeListener(name, listener) {
        if (!name) {
            return false;
        }
        const funcs = this.cache[name];
        if (funcs) {
            const index = funcs.indexOf(listener);
            if (index > -1) {
                funcs.splice(index, 1);
                return true;
            }
        }
        return false;
    }
    listenerCount(name) {
        return (this.cache[name] || []).length;
    }
    listeners(name) {
        return this.cache[name] || [];
    }
    emit(name, ...args) {
        const funcs = this.cache[name];
        if (funcs) {
            const queue = funcs.slice();
            try {
                for (let i = 0, size = queue.length; i < size; i++) {
                    queue[i](...args);
                }
            }
            catch (err) {
                this.emit('error', err);
                throw err;
            }
        }
    }
    off(name, listener) {
        return this.removeListener(name, listener);
    }
    on(name, listener) {
        return this.addEventListener(name, listener);
    }
    once(name, listener) {
        const funcs = this.cache[name] || [];
        const autoRemove = () => {
            this.removeListener(name, listener);
            this.removeListener(name, autoRemove);
        };
        funcs.push(listener);
        funcs.push(autoRemove);
        this.cache[name] = funcs;
        return this;
    }
}
exports.TKEventEmitter = TKEventEmitter;
TKEventEmitter.shared = new TKEventEmitter;
exports.default = TKEventEmitter;
