"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tabs = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Component_1 = require("../common/Component");
require("./tabs.style.css");
const TabView_1 = require("./TabView");
const classnames_1 = __importDefault(require("classnames"));
class Tabs extends Component_1.Component {
    constructor(attrs) {
        super(attrs);
        this.attrs = attrs;
        this._tabs = [];
        attrs.items.forEach(item => {
            this.add(item);
        });
    }
    getSide() {
        return this.attrs.side || 'top';
    }
    setSide(side) {
        this.attrs.side = side;
        mithril_1.default.redraw();
    }
    getTabView(id) {
        return this._tabs.find(item => item.getId() === id);
    }
    getActiveTabView() {
        if (this.attrs.activeTabView) {
            return this.getTabView(this.attrs.activeTabView);
        }
        return this._tabs[0];
    }
    add(config) {
        const tabView = new TabView_1.TabView(config, this);
        this._tabs.push(tabView);
        mithril_1.default.redraw();
        return tabView;
    }
    setActive(tabviewId) {
        this.attrs.activeTabView = tabviewId;
        mithril_1.default.redraw();
    }
    view() {
        var _a;
        return (0, mithril_1.default)('div.webcraft_tabs', {
            className: (0, classnames_1.default)([
                `webcraft_tabs--${this.getSide()}`,
            ])
        }, [
            (0, mithril_1.default)('div.webcraft_tabs_header', this._tabs.map(item => item.viewHeader())),
            (_a = this.getActiveTabView()) === null || _a === void 0 ? void 0 : _a.view(),
        ]);
    }
}
exports.Tabs = Tabs;
