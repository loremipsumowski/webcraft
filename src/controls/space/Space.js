"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Space = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Control_1 = require("../common/Control");
const Control_2 = require("../common/Control");
const classnames_1 = __importDefault(require("classnames"));
require("./space.style.css");
class Space extends Control_2.Control {
    view() {
        if (this.isHidden()) {
            return null;
        }
        return (0, mithril_1.default)('div.webcraft_space', Object.assign(Object.assign({ key: this.getId() }, (0, Control_1.getControlEvents)(this)), { className: (0, classnames_1.default)([
                this.attrs.classNames
            ]) }));
    }
}
exports.Space = Space;
