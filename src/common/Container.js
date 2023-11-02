"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Progress_1 = require("../box/Progress");
const Component_1 = require("./Component");
const classnames_1 = __importDefault(require("classnames"));
const Toast_1 = require("../messages/Toast");
const Message_1 = require("../messages/Message");
class Container extends Component_1.Component {
    constructor(attrs) {
        super(attrs);
        this.progress = new Progress_1.Progress();
        this.toast = new Toast_1.Toast(undefined, this);
        this.messages = [];
        this.popups = [];
        this.windows = [];
        if (attrs === null || attrs === void 0 ? void 0 : attrs.content) {
            this.attach(attrs.content);
        }
    }
    attach(content) {
        this.content = content;
    }
    getContent() {
        return this.content;
    }
    createPopup(config) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Popup = require('../popup/Popup').Popup;
        const popup = new Popup(config);
        popup.events.on('afterHide', () => {
            const index = this.popups.findIndex(item => item === popup);
            if (index > -1) {
                this.popups.splice(index, 1);
            }
        });
        this.popups.push(popup);
        return popup;
    }
    createMessage(config) {
        const message = new Message_1.Message(config, this);
        message.events.on('afterHide', () => {
            const index = this.messages.findIndex(item => item === message);
            if (index > -1) {
                this.messages.splice(index, 1);
            }
        });
        this.messages.push(message);
        return message;
    }
    createWindow(config) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Window = require('../window/Window').Window;
        const window = new Window(config, this);
        window.events.on('afterHide', () => {
            const index = this.windows.findIndex(item => item === window);
            if (index > -1) {
                this.windows.splice(index, 1);
            }
        });
        this.windows.push(window);
        return window;
    }
    _getChildren() {
        if (this.content instanceof Component_1.Component) {
            return this.content.view();
        }
        return this.content;
    }
    _getView(_a) {
        var _b;
        var { className } = _a, attrs = __rest(_a, ["className"]);
        return (0, mithril_1.default)('div.webcraft_container', Object.assign({ className: (0, classnames_1.default)([
                className,
                this.attrs.justify ? `webcraft_flex--justify-${this.attrs.justify}` : null,
                this.attrs.align ? `webcraft_flex--align-${(_b = this.attrs.align) !== null && _b !== void 0 ? _b : 'start'}` : null,
            ]) }, attrs), [
            this.progress.isActive() ? this.progress.view() : null,
            this._getChildren(),
            this.toast.view(),
            this.popups.map(item => item.view()).filter(Boolean),
            this.windows.map(item => item.view()).filter(Boolean),
            this.messages.map(item => item.view()).filter(Boolean),
        ].filter(Boolean).filter(item => !Array.isArray(item) || item.length));
    }
}
exports.Container = Container;
