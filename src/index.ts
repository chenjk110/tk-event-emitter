type AnyFunc = (...args: any) => any

/**
 * @name TKEventEmitter
 * @license MIT
 * @author TanKingKhun
 */
export class TKEventEmitter {
    static readonly shared = new TKEventEmitter
    private cache: Record<string | symbol, AnyFunc[]> = Object.create(null)
    get eventNames() {
        return Object.keys(this.cache)
    }
    addEventListener(name: string | symbol, listener: AnyFunc) {
        if (!name) {
            return this
        }
        const funcs = this.cache[name] || []
        this.cache[name] = funcs
        if (funcs.indexOf(listener) < 0) {
            funcs.push(listener)
        }
        return this
    }
    removeAllListeners(name?: string | symbol) {
        if (!name) {
            this.cache = Object.create(null)
            return true
        }
        const funcs = this.cache[name]
        if (funcs) {
            this.cache[name] = []
            return true
        }
        return false
    }
    removeListener(name: string | symbol, listener: AnyFunc) {
        if (!name) {
            return false
        }
        const funcs = this.cache[name]
        if (funcs) {
            const index = funcs.indexOf(listener)
            if (index > -1) {
                funcs.splice(index, 1)
                return true
            }
        }

        return false
    }
    listenerCount(name: string | symbol) {
        return (this.cache[name] || []).length
    }
    listeners(name: string | symbol) {
        return this.cache[name] || []
    }
    emit(name: string | symbol, ...args: any[]) {
        const funcs = this.cache[name]
        if (funcs) {
            const queue = funcs.slice()
            try {
                for (let i = 0, size = queue.length; i < size; i++) {
                    queue[i](...args)
                }
            } catch (err) {
                this.emit('error', err)
                throw err
            }
        }
    }
    off(name: string | symbol, listener: AnyFunc) {
        return this.removeListener(name, listener)
    }
    on(name: string | symbol, listener: AnyFunc) {
        return this.addEventListener(name, listener)
    }
    once(name: string | symbol, listener: AnyFunc) {
        const funcs = this.cache[name] || []
        const autoRemove = () => {
            this.removeListener(name, listener)
            this.removeListener(name, autoRemove)
        }
        funcs.push(listener)
        funcs.push(autoRemove)
        this.cache[name] = funcs
        return this
    }
}

export default TKEventEmitter