"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabView = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Container_1 = require("../common/Container");
const classnames_1 = __importDefault(require("classnames"));
const Tooltip_1 = require("../messages/Tooltip");
class TabView extends Container_1.Container {
    constructor(attrs, parent) {
        super(attrs);
        this._parent = parent;
        this.events.on('mouseover', (e) => {
            if (this.attrs.tooltip) {
                const tooltipHide = Tooltip_1.Tooltip.show(this.attrs.tooltip, e);
                this.events.once('mouseout', () => { tooltipHide(); });
            }
        });
    }
    isDisabled() {
        return Boolean(this.attrs.disabled);
    }
    enable() {
        this.attrs.disabled = false;
        mithril_1.default.redraw();
    }
    disable() {
        this.attrs.disabled = true;
        mithril_1.default.redraw();
    }
    isActive() {
        var _a;
        return ((_a = this._parent.getActiveTabView()) === null || _a === void 0 ? void 0 : _a.getId()) === this.getId();
    }
    setActive() {
        this._parent.setActive(this.getId());
    }
    viewHeader() {
        return (0, mithril_1.default)('div.webcraft_tabview_header', {
            className: (0, classnames_1.default)([
                this.isActive() ? 'webcraft_tabview_header--active' : null,
                this.isDisabled() ? 'webcraft_tabview_header--disabled' : null,
            ]),
            onclick: () => {
                if (!this.isDisabled()) {
                    this.setActive();
                }
            },
            onmouseover: (e) => { this.events.emit('mouseover', e); },
            onmouseout: (e) => { this.events.emit('mouseout', e); },
        }, [
            this.attrs.icon ? (0, mithril_1.default)('i.webcraft_tabview_header_icon', { className: this.attrs.icon, style: {
                    marginRight: this.attrs.header ? 'var(--webcraft-space)' : null,
                } }) : null,
            this.attrs.header ? (0, mithril_1.default)('span.webcraft_tabview_header_text', this.attrs.header) : null,
        ]);
    }
    view() {
        return this._getView({
            className: 'webcraft_tabview',
        });
    }
}
exports.TabView = TabView;
