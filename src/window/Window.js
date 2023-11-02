"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Window = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Container_1 = require("../common/Container");
require("./window.style.css");
const __1 = require("..");
const classnames_1 = __importDefault(require("classnames"));
const Space_1 = require("../controls/space/Space");
const Text_1 = require("../controls/text/Text");
class Window extends Container_1.Container {
    constructor(attrs, container) {
        super(attrs);
        this.container = container;
        this.modal = true;
        this.header = new __1.Toolbar({
            classNames: 'webcraft_window_header',
            items: [
                new Text_1.Text({ id: 'title', value: this.attrs.title, classNames: 'webcraft_window_header_title' }),
                new Space_1.Space({ id: 'space' }),
                new __1.Button({ style: 'plain', color: 'secondary', icon: 'icon-window-minimize', size: 'small', tooltip: 'Minimize' }),
                new __1.Button({ id: 'restore', style: 'plain', color: 'secondary', icon: 'icon-window-restore', size: 'small', tooltip: 'Restore' }),
                new __1.Button({ id: 'maximize', style: 'plain', color: 'secondary', icon: 'icon-window-maximize', size: 'small', tooltip: 'Maximize' }),
                new __1.Button({ id: 'hide', style: 'plain', color: 'secondary', icon: 'icon-cancel', size: 'small', tooltip: 'Hide' }),
            ],
        });
        this.header.events.on('click', (id) => {
            switch (id) {
                case 'restore': {
                    this.restore();
                    break;
                }
                case 'maximize': {
                    this.maximize();
                    break;
                }
                case 'hide': {
                    this.hide();
                    break;
                }
            }
        });
        this.header.events.on('dblclick', (id) => {
            switch (id) {
                case 'title':
                case 'space': {
                    if (this.isMaximized()) {
                        this.restore();
                    }
                    else {
                        this.maximize();
                    }
                    break;
                }
            }
        });
        this._refreshHeaderButtons();
    }
    isHidden() {
        return Boolean(this.attrs.hidden);
    }
    hide() {
        this.attrs.hidden = true;
        if (!this.container) {
            this.unmount();
        }
        this.events.emit('afterHide');
    }
    show() {
        this.attrs.hidden = false;
        if (!this.container) {
            this.mount();
        }
    }
    restore() {
        this.attrs.maximized = false;
        this._refreshHeaderButtons();
        mithril_1.default.redraw();
    }
    maximize() {
        this.attrs.maximized = true;
        this._refreshHeaderButtons();
        mithril_1.default.redraw();
    }
    isMaximized() {
        return Boolean(this.attrs.maximized);
    }
    view() {
        if (this.isHidden()) {
            return null;
        }
        return (0, mithril_1.default)('div.webcraft_modal_wrapper', {
            className: (0, classnames_1.default)(this.attrs.modal !== false ? 'webcraft_modal_wrapper--modal' : null)
        }, (0, mithril_1.default)('div.webcraft_window', {
            className: (0, classnames_1.default)(this.attrs.maximized ? 'webcraft_window--maximized' : null),
            style: Object.assign({}, this._getSizes()),
        }, [
            this.header.view(),
            this._getView({
                className: 'webcraft_window_content',
            }),
        ]));
    }
    _refreshHeaderButtons() {
        var _a, _b, _c, _d;
        if (this.isMaximized()) {
            (_a = this.header.getItem('maximize')) === null || _a === void 0 ? void 0 : _a.hide();
            (_b = this.header.getItem('restore')) === null || _b === void 0 ? void 0 : _b.show();
        }
        else {
            (_c = this.header.getItem('maximize')) === null || _c === void 0 ? void 0 : _c.show();
            (_d = this.header.getItem('restore')) === null || _d === void 0 ? void 0 : _d.hide();
        }
    }
    _getSizes() {
        const style = Object.assign({}, (this.attrs.sizes || {}));
        if (style.width === undefined) {
            style.width = '50%';
        }
        if (style.height === undefined) {
            style.height = '50%';
        }
        ['width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight'].forEach(type => {
            if (typeof style[type] === 'number') {
                style[type] += 'px';
            }
        });
        return style;
    }
}
exports.Window = Window;
