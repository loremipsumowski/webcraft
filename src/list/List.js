"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const mithril_1 = __importDefault(require("mithril"));
require("./list.style.css");
const Component_1 = require("../common/Component");
const Data_1 = require("../data/Data");
const Template_1 = require("../common/Template");
const Selection_1 = require("../selection/Selection");
const classnames_1 = __importDefault(require("classnames"));
class List extends Component_1.Component {
    constructor(attrs, data) {
        super(attrs);
        this.fitContainer = true;
        this._activeKeyboardNavigation = false;
        this._eventHandlers = {
            onKeyDown: (e) => {
                if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
                    e.preventDefault();
                    const dataLength = this.data.getLength();
                    if (this._focusedIndex === undefined) {
                        this._focusedIndex = -1;
                    }
                    if (e.code === 'ArrowUp')
                        this._focusedIndex--;
                    else
                        this._focusedIndex++;
                    if (this._focusedIndex < 0)
                        this._focusedIndex = 0;
                    else if (this._focusedIndex > dataLength - 1)
                        this._focusedIndex = dataLength - 1;
                }
                if (this._focusedIndex !== undefined && (e.code === 'Enter' || e.code === 'Space')) {
                    e.preventDefault();
                    const item = this.data.getItemByIndex(this._focusedIndex);
                    if (!item) {
                        return;
                    }
                    this.selection.select(item.id, { ctrlKey: e.code === 'Space' });
                }
                mithril_1.default.redraw();
            },
            onClick: (e) => {
                var _a;
                const target = e.target;
                if ((_a = this._listNode) === null || _a === void 0 ? void 0 : _a.contains(target)) {
                    return;
                }
                this.deactivateKeyboardNavigation();
            }
        };
        this.data = data || new Data_1.Data();
        this.selection = new Selection_1.Selection(this, this.attrs.selection);
    }
    view() {
        return (0, mithril_1.default)('div.webcraft_list_wrapper', {
            oncreate: (vnode) => { this._listNode = vnode.dom; },
            onupdate: (vnode) => { this._listNode = vnode.dom; },
        }, (0, mithril_1.default)('div.webcraft_list', this.data.getLength() ? this.data.map((item, index) => (0, Template_1.getTemplate)(item, this.attrs.template, {
            className: (0, classnames_1.default)('webcraft_list_item', this.selection.isSelected(item.id) ? 'webcraft_list_item--selected' : null, this._focusedIndex === index ? 'webcraft_list_item--focused' : null),
            onclick: (e) => {
                this._focusedIndex = index;
                if (this.selection.isSelected(item.id)) {
                    this.selection.unselect(item.id);
                }
                else {
                    this.selection.select(item.id, {
                        ctrlKey: e.ctrlKey,
                    });
                }
            },
            onmouseover: () => {
                this._focusedIndex = index;
                mithril_1.default.redraw();
            }
        })) :
            (0, mithril_1.default)('span.webcraft_text_no_data', 'There is no data to display')));
    }
    isActiveKeyboardNavigation() {
        return this._activeKeyboardNavigation;
    }
    activateKeyboardNavigation() {
        if (this.isActiveKeyboardNavigation()) {
            return;
        }
        this._activeKeyboardNavigation = true;
        setTimeout(() => {
            document.addEventListener('keydown', this._eventHandlers.onKeyDown);
            document.addEventListener('click', this._eventHandlers.onClick);
        }, 100);
    }
    deactivateKeyboardNavigation() {
        if (!this.isActiveKeyboardNavigation()) {
            return;
        }
        this._activeKeyboardNavigation = false;
        document.removeEventListener('keydown', this._eventHandlers.onKeyDown);
        document.removeEventListener('click', this._eventHandlers.onClick);
    }
}
exports.List = List;
