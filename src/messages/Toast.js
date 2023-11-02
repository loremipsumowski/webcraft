"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toast = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Component_1 = require("../common/Component");
require("./toast.style.css");
const classnames_1 = __importDefault(require("classnames"));
const Button_1 = require("../controls/button/Button");
class ToastMessage extends Component_1.Component {
    constructor(attrs, toast) {
        super(attrs);
        this.width = 100;
        this._isActive = false;
        this.toast = toast;
        this._createCloseBtn();
    }
    hasExpirationTime() {
        return Boolean(this.attrs.expirationMs);
    }
    run() {
        if (!this.hasExpirationTime()) {
            throw new Error('Cannot run message without expiration time');
        }
        this._isActive = true;
        this.toast.runDrawing();
    }
    reset() {
        this.startTime = Date.now();
        this.width = 100;
    }
    stop() {
        this._isActive = false;
    }
    isActive() {
        return this._isActive;
    }
    isExpired() {
        return this.width <= 0;
    }
    getColor() {
        return this.attrs.color || 'primary';
    }
    remove() {
        this.toast.remove(this.getId());
    }
    computeWidth() {
        if (!this._isActive) {
            return;
        }
        if (!this.startTime) {
            this.reset();
        }
        if (!this.startTime || !this.attrs.expirationMs) {
            return;
        }
        this.width = 100 - (((Date.now() - this.startTime) / this.attrs.expirationMs) * 100);
        if (this.dom) {
            this.dom.style.width = `${this.width}%`;
        }
    }
    view() {
        var _a;
        const getEvents = () => {
            if (!this.hasExpirationTime()) {
                return {};
            }
            return {
                onmouseover: () => {
                    this.stop();
                    this.reset();
                    mithril_1.default.redraw();
                },
                onmouseout: () => {
                    this.run();
                },
            };
        };
        return (0, mithril_1.default)('div.webcraft_toast_message', Object.assign({ className: (0, classnames_1.default)(`webcraft_toast_message--${this.getColor()}`) }, getEvents()), [
            (0, mithril_1.default)('div.webcraft_toast_message_content', [
                this.attrs.icon ? (0, mithril_1.default)('div', (0, mithril_1.default)('span', { className: (0, classnames_1.default)(this.attrs.icon, 'webcraft_toast_message_icon') }, '')) : null,
                (0, mithril_1.default)('div', { style: { flex: 1 } }, [
                    this.attrs.title ? (0, mithril_1.default)('div', { className: 'webcraft_toast_message_title' }, this.attrs.title) : null,
                    (0, mithril_1.default)('div.webcraft_toast_message_text', this.attrs.text),
                ]),
                (0, mithril_1.default)('div', (_a = this._closeBtn) === null || _a === void 0 ? void 0 : _a.view()),
            ]),
            this.attrs.expirationMs
                ? (0, mithril_1.default)('div.webcraft_toast_message_progress', {
                    oncreate: (vnode) => {
                        this.dom = vnode.dom;
                    },
                    onupdate: (vnode) => {
                        this.dom = vnode.dom;
                    },
                    style: {
                        width: `${this.width}%`,
                    },
                }, '') : null,
        ]);
    }
    _createCloseBtn() {
        this._closeBtn = new Button_1.Button({
            icon: 'mdi mdi-close',
            color: this.getColor(),
            round: true,
            style: 'plain',
            size: 'small',
        });
        this._closeBtn.events.on('click', () => {
            this.remove();
        });
    }
}
class Toast extends Component_1.Component {
    constructor(attrs, container) {
        super(attrs);
        this.container = container;
        this._messages = [];
        this._isDrawing = false;
        this.modal = true;
    }
    runDrawing() {
        if (this._isDrawing) {
            return;
        }
        this._isDrawing = true;
        const draw = () => {
            this._messages.filter(msg => msg.hasExpirationTime() && msg.isActive()).forEach((msg => {
                msg.computeWidth();
                if (msg.isExpired()) {
                    msg.remove();
                }
            }));
            if (this._messages.filter(msg => msg.hasExpirationTime() && msg.isActive()).length) {
                requestAnimationFrame(() => {
                    draw();
                });
            }
            else {
                this._isDrawing = false;
            }
        };
        requestAnimationFrame(() => {
            draw();
        });
    }
    show(config) {
        const message = new ToastMessage(config, this);
        this._messages.unshift(message);
        if (message.hasExpirationTime()) {
            message.run();
        }
        if (!this.container) {
            this.mount();
        }
        this.runDrawing();
        mithril_1.default.redraw();
    }
    remove(id) {
        const index = this._messages.findIndex(msg => msg.getId() === id);
        if (index > -1) {
            this._messages.splice(index, 1);
        }
        if (this._messages.length === 0 && !this.container) {
            this.unmount();
        }
        mithril_1.default.redraw();
    }
    view() {
        if (this._messages.length === 0) {
            return null;
        }
        return (0, mithril_1.default)('div.webcraft_toast', this._messages.map(item => item.view()));
    }
}
exports.Toast = Toast;
