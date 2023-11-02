"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Popup = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Container_1 = require("../common/Container");
require("./popup.style.css");
class Popup extends Container_1.Container {
    constructor() {
        super(...arguments);
        this.modal = true;
        this._shape = {
            targetWidth: 0,
            targetHeight: 0,
            targetTop: 0,
            targetLeft: 0,
            top: 0,
            left: 0,
            width: 0,
            height: 0,
        };
    }
    isHidden() {
        return Boolean(this.attrs.hidden);
    }
    hide() {
        this.attrs.hidden = true;
        this.unmount();
        if (this.hidePopup) {
            document.removeEventListener('click', this.hidePopup);
            delete this.hidePopup;
        }
        this.events.emit('afterHide');
    }
    show(target, position) {
        this.position = position;
        this.target = target;
        this.attrs.hidden = false;
        this.mount();
        this._fixShape();
        mithril_1.default.redraw();
        this.events.emit('afterShow');
        if (this.hidePopup) {
            return;
        }
        this.hidePopup = (e) => {
            var _a;
            if ((_a = this.node) === null || _a === void 0 ? void 0 : _a.contains(e.target)) {
                return;
            }
            this.hide();
            if (this.hidePopup) {
                document.removeEventListener('click', this.hidePopup);
            }
        };
        setTimeout(() => {
            if (this.hidePopup) {
                document.addEventListener('click', this.hidePopup);
            }
        }, 100);
    }
    view() {
        return this._getView({
            key: this.getId(),
            className: 'webcraft_popup',
            style: Object.assign({}, this._getStyle()),
            oncreate: (vnode) => {
                const dom = vnode.dom;
                dom.style.position = 'fixed';
                const c = () => {
                    if (!this.node) {
                        return;
                    }
                    this._shape.width = dom.offsetWidth;
                    this._shape.height = dom.offsetHeight;
                    this._fixShape();
                    dom.style.top = `${this._shape.top}px`;
                    dom.style.left = `${this._shape.left}px`;
                    this.node.style.opacity = '1';
                };
                if (dom.offsetWidth) {
                    c();
                }
                else {
                    requestAnimationFrame(c);
                }
            }
        });
    }
    _fixShape() {
        var _a, _b;
        if (!this.target) {
            return;
        }
        if (this.target instanceof HTMLElement) {
            const bounds = this.target.getBoundingClientRect();
            this._shape.targetWidth = this.target.offsetWidth;
            this._shape.targetHeight = this.target.offsetHeight;
            this._shape.targetTop = bounds.top;
            this._shape.targetLeft = bounds.left;
        }
        else {
            this._shape.targetWidth = 0;
            this._shape.targetHeight = 0;
            this._shape.targetTop = this.target.y;
            this._shape.targetLeft = this.target.x;
        }
        const sidesOrder = [];
        const side = this.attrs.side;
        if (typeof side === 'string') {
            sidesOrder.push(side);
        }
        else if (Array.isArray(side)) {
            sidesOrder.push(...side);
        }
        ['bottom', 'right', 'left', 'top'].forEach(pos => {
            if (!sidesOrder.includes(pos)) {
                sidesOrder.push(pos);
            }
        });
        const offset = (_a = this.attrs.offset) !== null && _a !== void 0 ? _a : 5;
        const isSpaceOnSide = (side) => {
            switch (side) {
                case 'top': {
                    return this._shape.targetTop - offset - this._shape.targetHeight > 0;
                }
                case 'right': {
                    return this._shape.targetLeft + this._shape.targetWidth + this._shape.targetWidth + offset < document.body.offsetWidth;
                }
                case 'bottom': {
                    return this._shape.targetTop + this._shape.targetHeight + offset + this._shape.targetHeight < document.body.offsetHeight;
                }
                case 'left': {
                    return this._shape.targetLeft - offset - this._shape.width > 0;
                }
                default: {
                    return false;
                }
            }
        };
        const sideToSet = (_b = sidesOrder.find(isSpaceOnSide)) !== null && _b !== void 0 ? _b : 'bottom';
        let top;
        let left;
        let width;
        let height;
        switch (sideToSet) {
            case 'top': {
                top = this._shape.targetTop - offset - this._shape.targetHeight;
                left = this._shape.targetLeft;
                break;
            }
            case 'right': {
                top = this._shape.targetTop;
                left = this._shape.targetLeft + offset + this._shape.targetWidth;
                break;
            }
            case 'left': {
                top = this._shape.targetTop;
                left = this._shape.targetLeft - offset - this._shape.width;
                break;
            }
            default: {
                top = this._shape.targetTop + this._shape.targetHeight + offset;
                left = this._shape.targetLeft;
                break;
            }
        }
        if (top + this._shape.targetHeight > document.body.offsetHeight) {
            top = top - 10 - (top + this._shape.targetHeight - document.body.offsetHeight);
        }
        if (left + this._shape.targetWidth > document.body.offsetWidth) {
            left = left - 10 - (left + this._shape.targetWidth - document.body.offsetWidth);
        }
        if (top < offset) {
            height = this._shape.targetHeight + top - offset;
            top = offset;
        }
        if (left < offset) {
            width = this._shape.targetWidth + left - offset;
            left = offset;
        }
        this._shape.top = top;
        this._shape.left = left;
        this._shape.width = width !== null && width !== void 0 ? width : 0;
        this._shape.height = height !== null && height !== void 0 ? height : 0;
    }
    _getStyle() {
        if (!this.position) {
            return {};
        }
        const style = Object.assign({}, this.position);
        ['left', 'top', 'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight'].forEach(type => {
            if (typeof style[type] === 'number') {
                style[type] += 'px';
            }
        });
        return style;
    }
}
exports.Popup = Popup;
