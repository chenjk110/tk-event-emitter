import 'jest'
import { TKEventEmitter } from '../src/index'

let emitter: TKEventEmitter | null

beforeEach(() => {
    emitter = new TKEventEmitter
})

afterEach(() => {
    emitter = null
})

describe('addEventListener, on', () => {

    const checkingRegistered = (name: string | number, cb: (...args: any) => any, size: number) => {
        const cbs = emitter['cache'][name]
        expect(cbs).toBeInstanceOf(Array)
        expect(cbs).toHaveLength(size)
        expect(cbs).toContain(cb)
    }

    ['addEventListener', 'on'].forEach(method => {
        it(`<${method}> should ignore registering when invalid 'name' argument.`, () => {
            ['', false, undefined, null].forEach(name => {
                emitter[method](name, () => { })
                expect(Object.keys(emitter['cache'])).toHaveLength(0)

                emitter[method](name, () => { })
                expect(Object.keys(emitter['cache'])).toHaveLength(0)
            })
        })

        it(`<${method}> should register correctly.`, () => {
            const cb = () => { }
            const cb2 = () => { }
            emitter[method]('event-1', cb)
            checkingRegistered('event-1', cb, 1)

            emitter[method]('event-1', cb)
            checkingRegistered('event-1', cb, 1)

            emitter[method]('event-2', cb2)
            checkingRegistered('event-2', cb2, 1)

            emitter[method]('event-2', cb)
            checkingRegistered('event-2', cb, 2)
        })
    })
})

describe('removeListener, off', () => {
    const cb1 = () => { }
    const cb2 = () => { }
    ['removeListener', 'off'].forEach(method => {
        beforeEach(() => {
            emitter.addEventListener('event-1', cb1)
            emitter.addEventListener('event-1', cb2)
        })
        it(`<${method}> should ignore when invalid 'name' argument.`, () => {
            emitter[method]('', cb1)
            emitter[method]('', cb2)
            expect(emitter['cache']['event-1']).toHaveLength(2)
            expect(emitter['cache']['event-1']).toContain(cb1)
            expect(emitter['cache']['event-1']).toContain(cb2)
        })

        it(`<${method}> should ignore when listener not existed.`, () => {
            emitter[method]('event-1', () => {})
            expect(emitter['cache']['event-1']).toContain(cb1)
            expect(emitter['cache']['event-1']).toContain(cb2)
        })
        
        it(`<${method}> should remove target listener`, () => {
            emitter[method]('event-1', cb1)
            expect(emitter['cache']['event-1']).toHaveLength(1)
            expect(emitter['cache']['event-1']).toContain(cb2)
            expect(emitter['cache']['event-1']).not.toContain(cb1)
        })
    })
})

describe('removeAllListeners', () => {
    beforeEach(() => {
        emitter.addEventListener('event-1', () => { })
        emitter.addEventListener('event-1', () => { })
        emitter.addEventListener('event-1', () => { })
    })
    it('should remove all listeners of target name', () => {
        expect(emitter['cache']['event-1']).toHaveLength(3)

        emitter.removeAllListeners('event-2')
        expect(emitter['cache']['event-1']).toHaveLength(3)

        emitter.removeAllListeners('event-1')
        expect(emitter['cache']['event-1']).toHaveLength(0)
    })
    it('should clear all when no name argument', () => {
        expect(emitter['cache']['event-1']).toHaveLength(3)

        emitter.removeAllListeners()
        expect(Object.keys(emitter['cache'])).toHaveLength(0)
    })
})

describe('listenerCount', () => {
    it('should return listener counts of target name correctly.', () => {
        emitter.addEventListener('event-1', () => { })
        emitter.addEventListener('event-1', () => { })
        emitter.addEventListener('event-2', () => { })
        expect(emitter.listenerCount('event-1')).toEqual(2)
        expect(emitter.listenerCount('event-2')).toEqual(1)
        expect(emitter.listenerCount('event-3')).toEqual(0)
    })
})

describe('listeners', () => {
    it('should return listeners of target name correctly.', () => {
        const cb1 = () => { }
        const cb2 = () => { }
        emitter.addEventListener('event-1', cb1)
        emitter.addEventListener('event-1', cb2)
        emitter.addEventListener('event-2', cb1)

        expect(emitter.listeners('event-1')).toHaveLength(2)
        expect(emitter.listeners('event-1')).toContain(cb1)
        expect(emitter.listeners('event-1')).toContain(cb2)

        expect(emitter.listeners('event-2')).toHaveLength(1)
        expect(emitter.listeners('event-2')).toContain(cb1)
        expect(emitter.listeners('event-2')).not.toContain(cb2)

        // fallback `[]` when name is not exist.
        expect(emitter.listeners('event-3')).toHaveLength(0)
    })
})

describe('eventNames', () => {
    const emitter = new TKEventEmitter
    it('eventNames get registered names correctly.', () => {
        expect(emitter.eventNames).toHaveLength(0)
    })
})

describe('emit', () => {
    it('listener should be called correctly.', () => {
        const cb1 = jest.fn()
        const cb2 = jest.fn()
        emitter.addEventListener('event-1', cb1)
        emitter.addEventListener('event-2', cb2)

        emitter.emit('event-1')
        expect(cb1).toBeCalled()
        expect(cb1).toBeCalledTimes(1)

        emitter.emit('event-2')
        expect(cb2).toBeCalled()
        expect(cb2).toBeCalledTimes(1)

        emitter.emit('event-2')
        expect(cb1).toBeCalledTimes(1)
        expect(cb2).toBeCalledTimes(2)
    })

    it('should emit `error` when listener called failed.', () => {
        const error = new Error()
        const onError = jest.fn()
        const cb = jest.fn(() => { throw error })

        emitter.addEventListener('error', onError)
        emitter.addEventListener('event-1', cb)

        expect(cb).toBeCalledTimes(0)
        expect(onError).toBeCalledTimes(0)
        try {
            emitter.emit('event-1')
        } catch (err) {
            expect(err).toEqual(error)
        } finally {
            expect(cb).toThrowError()
            expect(onError).toBeCalledTimes(1)
        }

        try {
            emitter.emit('event-1')
        } catch (err) {
            expect(err).toEqual(error)
        } finally {
            expect(cb).toThrowError()
            expect(onError).toBeCalledTimes(2)
        }
    })
})

describe('once', () => {
    it('listener should be called only once', () => {
        const cb = jest.fn()
        emitter.once('event-1', cb)
        expect(cb).toBeCalledTimes(0)

        emitter.emit('event-1')
        expect(cb).toBeCalledTimes(1)

        emitter.emit('event-1')
        expect(cb).toBeCalledTimes(1)
    })
})