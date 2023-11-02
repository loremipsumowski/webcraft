"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
/**
 * Listener is object that is listening for specified event type emissions and is running when that kind of event was emitted
 */
class Listener {
    /**
     *
     * @param eventName name of event that listener is related to
     * @param callback function runs when listener is triggered
     * @param context context to run callback function on
     * @param once information that listener will be runned only once or on each time when event will emit
     */
    constructor(eventName, callback, context, once) {
        this.eventName = eventName;
        this.callback = callback;
        this.context = context;
        this.once = once;
        this.active = true;
    }
    /**
     * Makes listener active. In effect it will **run** when event will emit
     */
    on() {
        if (!this.active) {
            this.active = true;
        }
    }
    /**
     * Makes listener inactive. In effect it will **not run** if event will emit
     */
    off() {
        if (this.active) {
            this.active = false;
        }
    }
    /**
     * Method to run listener registered callback function
     * @param args arguments for callback function
     * @returns
     */
    run(...args) {
        return this.callback.apply(this.context, args);
    }
    /**
     * Gets information that listener is activated or not. If not then its callback will not run if event will emit
     * @returns
     */
    isActive() {
        return this.active;
    }
    /**
     * Gets information that listener waits for first event emission only or for each next
     * @returns
     */
    isOnce() {
        return Boolean(this.once);
    }
}
/**
 * Event emitter allows to register listeners for various event types, and trigger that events. After each event emission, all active listeners are running.
 */
class EventEmitter {
    /**
     * @param context context to run listeners callback on
     */
    constructor(context) {
        this.context = context;
        this.listeners = new Map();
    }
    /**
     * Registers new listener for event type
     * @param eventName name of event type to register listener into
     * @param callback function runs when listener was triggered
     * @returns instance of created listener
     */
    on(eventName, callback) {
        var _a;
        const listener = new Listener(eventName, callback, this.context);
        const eventListeners = (_a = this.listeners.get(eventName)) !== null && _a !== void 0 ? _a : [];
        eventListeners.push(listener);
        this.listeners.set(eventName, eventListeners);
        return listener;
    }
    /**
     * Registers new listener for event type, but that kind of listener will run only once, then removed from event emitter
     * @param eventName name of event type to register listener into
     * @param callback function runs when listener was triggered
     * @returns instance of created listener
     */
    once(eventName, callback) {
        var _a;
        const listener = new Listener(eventName, callback, this.context, true);
        const eventListeners = (_a = this.listeners.get(eventName)) !== null && _a !== void 0 ? _a : [];
        eventListeners.push(listener);
        this.listeners.set(eventName, eventListeners);
        return listener;
    }
    /**
     * Emits event of passed type. In consequence it runs all active listeners.
     * @param eventName Name of event type to run
     * @param args arguments to pass to all listeners callbacks
     * @returns true value if any of listeners callbacks returned true, otherwise false
     *
     * @example
     * ```
     * const value = events.emit('afterHide', id);
     * // value is information if any of callbacks returned true value or not, it could be used to determine any next actions
     * ```
     */
    emit(eventName, ...args) {
        const eventListeners = this.listeners.get(eventName);
        let returnValue = false;
        if (eventListeners) {
            const eventsToEmit = [...eventListeners];
            eventsToEmit.forEach(listener => {
                if (listener.isActive()) {
                    if (listener.run(...args) === true) {
                        returnValue = true;
                    }
                    if (listener.isOnce()) {
                        listener.off();
                    }
                }
            });
        }
        return returnValue;
    }
}
exports.EventEmitter = EventEmitter;
