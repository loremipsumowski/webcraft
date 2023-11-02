"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Control_1 = require("../common/Control");
const Control_2 = require("../common/Control");
const classnames_1 = __importDefault(require("classnames"));
class Text extends Control_2.Control {
    setValue(value) {
        this.attrs.value = value;
        mithril_1.default.redraw();
    }
    view() {
        if (this.isHidden()) {
            return null;
        }
        return (0, mithril_1.default)('div.webcraft_text', Object.assign(Object.assign({ key: this.getId() }, (0, Control_1.getControlEvents)(this)), { className: (0, classnames_1.default)([
                this.attrs.classNames
            ]) }), this.attrs.value);
    }
}
exports.Text = Text;
