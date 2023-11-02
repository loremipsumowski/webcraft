"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
const mithril_1 = __importDefault(require("mithril"));
require("./progress.style.css");
const Tools_1 = require("../common/Tools");
class Progress {
    constructor() {
        this._runnedIds = new Array();
        this.id = (0, Tools_1.generateId)();
    }
    /**
     * Gets information, that progress is active now or not
     * @returns
     */
    isActive() {
        return this._runnedIds.length > 0;
    }
    /**
     * Turn progress on. It adds next request to run progress, and returns function to stop exactly that single request.
     *
     * @example
     * ```javascript
     * // run progress and get callback to turn off that single request of progress
     * const off = progress.on();
     *
     * // make another request for progress
     * const anotherOff = progress.on();
     *
     * // now to turn whole progress off, invoke progress.off() method
     *
     * // below code turns off only single request of progress, but second one is still active, so whole progress is active also:
     * off();
     *
     * // now there is one active request for progress, and still we can make progress off by progress.off function
     * // but invoking callback of second progress request will make, then any requests are present, so whole progress is off also
     * anotherOff();
     * ```
     * @returns callback to stop progress
     */
    on() {
        const id = (0, Tools_1.generateId)();
        this._runnedIds.push(id);
        mithril_1.default.redraw();
        return () => {
            this._offSingle(id);
        };
    }
    /**
     * Stops all running progress requests
     */
    off() {
        this._runnedIds.length = 0;
        mithril_1.default.redraw();
    }
    /**
     * @hidden
     */
    view() {
        return (0, mithril_1.default)('div', {
            key: this.id,
            className: 'webcraft_progress'
        }, (0, mithril_1.default)('div', { className: 'webcraft_progress_spinner' }, ''));
    }
    _offSingle(id) {
        const index = this._runnedIds.indexOf(id);
        if (index > -1) {
            this._runnedIds.splice(index, 1);
            mithril_1.default.redraw();
        }
    }
}
exports.Progress = Progress;
