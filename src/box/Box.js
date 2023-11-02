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
exports.Box = void 0;
const mithril_1 = __importDefault(require("mithril"));
const classnames_1 = __importDefault(require("classnames"));
const Component_1 = require("../common/Component");
require("./box.style.css");
const Toolbar_1 = require("../toolbar/Toolbar");
const Button_1 = require("../controls/button/Button");
const __1 = require("..");
const Tree_1 = require("../tree/Tree");
const Container_1 = require("../common/Container");
const Text_1 = require("../controls/text/Text");
/**
 * The Box class represents a flexible container that uses the flexbox model in CSS.
 * It allows for the creation of a dynamic layout where each cell can have its own functionality,
 * including a title, collapsible/expandable behavior, and the ability to hide/show content.
 * Cells can contain plain text, html or other components like Box, Toolbar, Table etc.
 */
class Box extends Container_1.Container {
    constructor(attrs, parent) {
        if (attrs && Array.isArray(attrs.content)) {
            const { content } = attrs, rest = __rest(attrs, ["content"]);
            super(rest);
            this._boxes = [];
            content.forEach(attributes => {
                this.add(attributes);
            });
        }
        else {
            super(attrs);
            this._boxes = [];
        }
        this._parent = parent;
        this._createHeader();
        this._computeFlex();
    }
    getContainer(id) {
        let container = this._boxes.find(x => x.getId() === id);
        if (container) {
            return container;
        }
        this._boxes.find(x => {
            container = x.getContainer(id);
            return container;
        });
        return container;
    }
    getAllContainers() {
        const containers = [];
        containers.push(...this._boxes);
        this._boxes.forEach(container => {
            containers.push(...container.getAllContainers() || []);
        });
        return containers;
    }
    add(attributes) {
        if (this.getContent() !== undefined) {
            throw new Error('Cannot add container because box contains component attached!');
        }
        else {
            let boxAttributes;
            if (attributes instanceof Component_1.Component) {
                boxAttributes = {
                    content: attributes
                };
            }
            else {
                boxAttributes = attributes;
            }
            const box = new Box(boxAttributes, this);
            this._boxes.push(box);
            this._computeFlex();
            mithril_1.default.redraw();
            return box;
        }
    }
    getDirection() {
        var _a;
        return (_a = this.attrs.direction) !== null && _a !== void 0 ? _a : 'column';
    }
    setDirection(direction) {
        this.attrs.direction = direction;
        this._computeFlex();
        mithril_1.default.redraw();
    }
    setHidden(value) {
        this.attrs.hidden = value;
        mithril_1.default.redraw();
    }
    getHeader() {
        return this.attrs.header;
    }
    setHeader(header) {
        this.attrs.header = header;
        this._computeFlex();
        mithril_1.default.redraw();
    }
    getGap() {
        var _a;
        return this.attrs.gap || ((_a = this._parent) === null || _a === void 0 ? void 0 : _a.getGap()) || 'small';
    }
    collapse() {
        this.attrs.collapsed = true;
        this.header.getItem('toggle').setIcon(this._getCollapsingIcon());
        this._computeFlex();
        mithril_1.default.redraw();
    }
    expand() {
        this.attrs.collapsed = false;
        this.header.getItem('toggle').setIcon(this._getCollapsingIcon());
        this._computeFlex();
        mithril_1.default.redraw();
    }
    toggle() {
        if (this.isCollapsed()) {
            this.expand();
        }
        else {
            this.collapse();
        }
    }
    isCollapsed() {
        return Boolean(this.attrs.collapsed);
    }
    view() {
        if (this.attrs.hidden) {
            return mithril_1.default.fragment({ key: this.getId() }, []);
        }
        return (0, mithril_1.default)('div', {
            key: this.getId(),
            className: (0, classnames_1.default)([
                'webcraft_box',
                this.attrs.gap ? `webcraft_box--${this.attrs.gap}` : null,
                this.isCollapsed() ? 'webcraft_box--collapsed' : null,
                this._boxes.length === 0 ? 'webcraft_box--container' : null,
                this._getOverflowCss(),
                this.attrs.classnames,
            ]),
            style: Object.assign(Object.assign({}, this._getSizes()), { flex: this._flex }),
            oncreate: (vnode) => {
                this.events.emit('onCreate', vnode.dom);
            },
            onupdate: (vnode) => {
                this.events.emit('onUpdate', vnode.dom);
            },
        }, [
            this.header.getItems().length ? this.header.view() : null,
            !this.isCollapsed() && this._getView({
                className: (0, classnames_1.default)([
                    'webcraft_box_content',
                    `webcraft_flex--${this.getDirection()}`,
                ]),
                style: {
                    flexWrap: this.attrs.flexWrap === false ? 'nowrap' : undefined,
                }
            }),
        ]);
    }
    _getOverflowCss() {
        const content = this.getContent();
        if (content instanceof __1.Datagrid || content instanceof Tree_1.Tree) {
            return 'webcraft_overflow--hidden';
        }
    }
    _computeFlex() {
        const getFlex = () => {
            if (this.isCollapsed()) {
                return '0 0 content';
            }
            if (this.attrs.flex) {
                return this.attrs.flex;
            }
            const contentStyle = this._getSizes();
            if (this.content instanceof Component_1.Component && this.content.fitContainer) {
                return '0 0 content';
            }
            if (contentStyle.width) {
                return '0 0 content';
            }
            if (contentStyle.maxWidth) {
                return '1 1 content';
            }
            if (this._boxes.map(item => item.content).every(Boolean)) {
                return '1 0 content';
            }
            return '1 1 0%';
        };
        this._flex = getFlex();
    }
    _getChildren() {
        if (this._boxes.length > 0) {
            return this._boxes.map(item => item.view());
        }
        return super._getChildren();
    }
    _createHeader() {
        const toolbarItems = [];
        if (this.attrs.header) {
            toolbarItems.push(new Text_1.Text({
                value: this.attrs.header,
                classNames: 'webcraft_header_title',
            }));
        }
        if (this.attrs.collapsable) {
            toolbarItems.push(new Button_1.Button({
                id: 'toggle',
                round: true,
                size: 'small',
                color: 'secondary',
                style: 'plain',
                icon: this._getCollapsingIcon(),
            }));
        }
        this.header = new Toolbar_1.Toolbar({
            classNames: 'webcraft_box_header',
            items: toolbarItems,
            justify: 'between'
        });
        this.header.events.on('click', (id) => {
            if (id === 'toggle') {
                this.toggle();
            }
        });
    }
    _getSizes() {
        const style = Object.assign({}, (this.attrs.sizes || {}));
        ['width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight'].forEach(type => {
            if (typeof style[type] === 'number') {
                style[type] += 'px';
            }
        });
        return style;
    }
    _getCollapsingIcon() {
        var _a;
        return {
            'row': {
                'true': 'icon-right-open',
                'false': 'icon-left-open',
            },
            'column': {
                'true': 'icon-down-open',
                'false': 'icon-up-open',
            },
        }[((_a = this._parent) === null || _a === void 0 ? void 0 : _a.getDirection()) || 'column'][String(this.isCollapsed())];
    }
}
exports.Box = Box;
