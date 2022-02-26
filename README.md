# TKEventEmitter

- `version: 0.2.2`
- `update: 2022.2.25`

## API

```ts
class TKEventEmitter
```

```ts
.eventNames: (string | symbol)[]
```

```ts
.addEventListener (eventName: string | symbol, listener: Function): this
```

```ts
.removeAllListeners (eventName?: string | symbol): void
```

```ts
.removeListener (eventName: string | symbol, listener: Function): boolean
```

```ts
.listenerCount (eventName: string | symbol): number
```

```ts
.listeners (eventName: string | symbol): Function[]
```

```ts
.emit (eventName: string | symbol, ...args: any[]): this
```

```ts
.off (eventName: string | symbol, listener: Function): boolean
```

```ts
.on (eventName: string | symbol, listener: Function): this
```

```ts
.once (eventName: string | symbol, listener: Function): this
```

## Examples

### 1. `on` and `emit`

```js
const emitter = new TKEventEmitter();

emitter.on("update", (id) => {
  console.log("task: " + id + "update completed!");
});

emitter.emit("update", 12);
```

### 2. `once` and `emit`

```js
const handler = () => {
  console.log("Hello World!");
};

emitter.once("only-one", handler);

emitter.emit("only-one"); // 'Hello World'

emitter.emit("only-one"); // nothing happened

emitter.emit("only-one"); // nothing happened
```

### 3. `on` and `off`

```js
const handler = () => {
  console.log("some message...");
};

emitter.on("run", handler);

emitter.emit("run"); // 'some message...'

emitter.off("run", handler);

emitter.emit("run"); // nothing happened
```
