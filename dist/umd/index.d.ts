/**
 * @name TKEventEmitter
 * @license MIT
 * @description
 * custom events emitter inspired by Events module of Nodejs
 * @author TanKingKhun
 */
declare class TKEventEmitter {
    private listenersCache;
    private oncedFnMap;
    get eventNames(): (string | symbol)[];
    private getCache;
    private executing;
    addEventListener(eventName: string | symbol, listener: Function): this;
    removeAllListeners(eventName?: string | symbol): void;
    removeListener(eventName: string | symbol, listener: Function): boolean;
    listenerCount(eventName: string | symbol): number;
    listeners(eventName: string | symbol): Function[];
    emit(eventName: string | symbol, ...args: any[]): this;
    off(eventName: string | symbol, listener: Function): boolean;
    on(eventName: string | symbol, listener: Function): this;
    once(eventName: string | symbol, listener: Function): this;
}
