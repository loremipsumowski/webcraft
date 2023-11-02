"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const mithril_1 = __importDefault(require("mithril"));
const classnames_1 = __importDefault(require("classnames"));
const Control_1 = require("../common/Control");
const Control_2 = require("../common/Control");
require("./button.style.css");
class Button extends Control_2.Control {
    getColor() {
        return this.attrs.color || 'primary';
    }
    getStyle() {
        var _a;
        return (_a = this.attrs.style) !== null && _a !== void 0 ? _a : 'filled';
    }
    getSize() {
        var _a;
        return (_a = this.attrs.size) !== null && _a !== void 0 ? _a : 'medium';
    }
    isDisabled() {
        return Boolean(this.attrs.disabled);
    }
    setDisabled(disabled) {
        if (this.attrs.disabled === disabled) {
            return false;
        }
        this.attrs.disabled = disabled;
        mithril_1.default.redraw();
        return true;
    }
    getText() {
        return this.attrs.text;
    }
    setText(text) {
        this.attrs.text = text;
        mithril_1.default.redraw();
    }
    getIcon() {
        return this.attrs.icon;
    }
    setIcon(icon) {
        this.attrs.icon = icon;
        mithril_1.default.redraw();
    }
    view() {
        if (this.isHidden()) {
            return null;
        }
        const text = this.getText();
        const icon = this.getIcon();
        return (0, mithril_1.default)('button.webcraft_button', Object.assign({ key: this.getId(), type: 'button', disabled: this.isDisabled(), className: (0, classnames_1.default)([
                `webcraft_button--${this.getColor()}`,
                `webcraft_button--${this.getStyle()}`,
                `webcraft_button--${this.getSize()}`,
                this.attrs.round ? 'webcraft_button--round' : null,
                this.attrs.classNames,
            ]) }, (0, Control_1.getControlEvents)(this)), [
            icon && (0, mithril_1.default)('i.webcraft_button_icon', { className: icon, style: {
                    marginRight: text ? 'var(--webcraft-space)' : null,
                } }),
            text && (0, mithril_1.default)('span.webcraft_button_text', text),
        ]);
    }
}
exports.Button = Button;
