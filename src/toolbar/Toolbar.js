"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toolbar = void 0;
const mithril_1 = __importDefault(require("mithril"));
const classnames_1 = __importDefault(require("classnames"));
const Component_1 = require("../common/Component");
require("./toolbar.style.css");
class Toolbar extends Component_1.Component {
    constructor(attrs) {
        super(attrs);
        this.fitContainer = true;
    }
    getItem(id) {
        var _a;
        return (_a = this.getItems()) === null || _a === void 0 ? void 0 : _a.find(item => item.getId() === id);
    }
    addItem(item, index) {
        if (!this.attrs.items) {
            this.attrs.items = [];
        }
        this.attrs.items.splice(index !== null && index !== void 0 ? index : this.attrs.items.length, 0, item);
        mithril_1.default.redraw();
    }
    view() {
        var _a;
        return (0, mithril_1.default)('div', {
            className: (0, classnames_1.default)([
                'webcraft_toolbar',
                this.attrs.justify ? `webcraft_flex--justify-${this.attrs.justify}` : null,
                this.attrs.classNames,
            ]),
        }, (_a = this.getItems()) === null || _a === void 0 ? void 0 : _a.map(item => item.view()).filter(Boolean));
    }
    getItems() {
        return this.attrs.items || [];
    }
}
exports.Toolbar = Toolbar;
