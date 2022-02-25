declare type AnyFunc = (...args: any) => any;
/**
 * @name TKEventEmitter
 * @license MIT
 * @author TanKingKhun
 */
export declare class TKEventEmitter {
    static readonly shared: TKEventEmitter;
    private cache;
    get eventNames(): string[];
    addEventListener(name: string | symbol, listener: AnyFunc): this;
    removeAllListeners(name?: string | symbol): boolean;
    removeListener(name: string | symbol, listener: AnyFunc): boolean;
    listenerCount(name: string | symbol): number;
    listeners(name: string | symbol): AnyFunc[];
    emit(name: string | symbol, ...args: any[]): void;
    off(name: string | symbol, listener: AnyFunc): boolean;
    on(name: string | symbol, listener: AnyFunc): this;
    once(name: string | symbol, listener: AnyFunc): this;
}
export default TKEventEmitter;
