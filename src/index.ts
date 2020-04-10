/**
 * @name TKEventEmitter
 * @license MIT
 * @description
 * custom events emitter inspired by Events module of Node.js
 * @author TanKingKhun
 */
class TKEventEmitter {
  private listenersCache: Map<string | symbol, Set<Function>> = new Map();
  private oncedFnMap: Map<Function, Function> = new Map();

  get eventNames() {
    return Array.from(this.listenersCache.keys());
  }

  private getCache(eventName: string | symbol) {
    return this.listenersCache.get(eventName);
  }

  private executing(fns: Function[]) {
    fns.forEach((fn) => globalThis.setTimeout(fn, 0));
  }

  public addEventListener(eventName: string | symbol, listener: Function) {
    const cache = this.getCache(eventName);
    if (cache) {
      cache.add(listener);
    } else {
      this.listenersCache.set(eventName, new Set([listener]));
    }
    return this;
  }

  public removeAllListeners(eventName?: string | symbol) {
    if (eventName) {
      this.listenersCache.get(eventName).forEach((fn) => {
        // remove all once cached fn
        this.oncedFnMap.delete(fn);
      });
      this.listenersCache.delete(eventName);
    } else {
      this.listenersCache = new Map();
    }
  }

  public removeListener(eventName: string | symbol, listener: Function) {
    const cache = this.getCache(eventName);
    if (cache) {
      return cache.delete(listener);
    }
    return false;
  }

  public listenerCount(eventName: string | symbol) {
    const cache = this.getCache(eventName);
    if (cache) {
      return cache.size;
    }
    return 0;
  }

  public listeners(eventName: string | symbol) {
    const cache = this.getCache(eventName);
    if (cache) {
      return Array.from(cache);
    }
    return [];
  }

  public emit(eventName: string | symbol, ...args: any[]) {
    const cache = this.getCache(eventName);
    if (cache) {
      const bindedFn = Array.from(cache).map((fn) => fn.bind(null, ...args));
      this.executing(bindedFn);
    }
    return this;
  }

  public off(eventName: string | symbol, listener: Function) {
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

  public on(eventName: string | symbol, listener: Function) {
    return this.addEventListener(eventName, listener);
  }

  public once(eventName: string | symbol, listener: Function) {
    const wrap = (...args: any[]) => {
      try {
        listener.call(null, ...args);
      } catch (err) {
        this.off(eventName, wrap);
        throw err;
      }
    };
    this.oncedFnMap.set(listener, wrap);
    return this.addEventListener(eventName, wrap);
  }
}
