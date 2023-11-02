"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Component_1 = require("../common/Component");
const TreeData_1 = require("../data/TreeData");
const Template_1 = require("../common/Template");
require("./tree.style.css");
const classnames_1 = __importDefault(require("classnames"));
const Selection_1 = require("../selection/Selection");
class Tree extends Component_1.Component {
    constructor(attrs) {
        super(attrs);
        this.data = new TreeData_1.TreeData(this);
        this.selection = new Selection_1.Selection(this, this.attrs.selection);
    }
    isCollapsed(id) {
        var _a;
        return !((_a = this.data.getItemById(id)) === null || _a === void 0 ? void 0 : _a.$opened);
    }
    expandAll() {
        this.data.forEach(item => {
            this.expand(item.id);
        });
    }
    collapseAll() {
        this.data.forEach(item => {
            this.collapse(item.id);
        });
    }
    expand(id) {
        this.data.update(id, { $opened: true });
        mithril_1.default.redraw();
    }
    collapse(id) {
        this.data.update(id, { $opened: false });
        mithril_1.default.redraw();
    }
    toggle(id) {
        if (this.isCollapsed(id)) {
            this.expand(id);
        }
        else {
            this.collapse(id);
        }
    }
    view() {
        const template = (0, Template_1.getTemplateFunction)(this.attrs.template, {
            className: 'webcraft_tree_item'
        });
        const generateLeaves = (leaves) => {
            if (!(leaves === null || leaves === void 0 ? void 0 : leaves.length)) {
                return null;
            }
            return (0, mithril_1.default)('div.webcraft_tree_leaves', {
                style: {
                    paddingLeft: '20px',
                },
            }, leaves.map((item) => generateBranch(item)));
        };
        const getIcon = (item) => {
            let iconClassName = 'icon-folder';
            if (this.data.getChildrenByParent(item.id).length === 0) {
                iconClassName = 'icon-doc-inv';
            }
            if (item.$opened) {
                iconClassName = 'icon-folder-open';
            }
            return (0, mithril_1.default)('span.webcraft_tree_leaf_icon', { className: iconClassName });
        };
        const generateBranch = (item) => {
            const children = this.data.getChildrenByParent(item.id);
            return (0, mithril_1.default)('div.webcraft_tree_branch', { key: item.id }, [
                (0, mithril_1.default)('div.webcraft_tree_leaf', {
                    className: (0, classnames_1.default)([
                        this.selection.isSelected(item.id) ? 'webcraft_tree_leaf--selected' : null,
                    ]),
                    onclick: (e) => {
                        this.events.emit('onClick', e);
                        if (e.target.classList.contains('webcraft_tree_leaf_populated')) {
                            this.toggle(item.id);
                        }
                        else {
                            this.selection.select(item.id, e);
                        }
                    },
                }, [
                    (children === null || children === void 0 ? void 0 : children.length) ? (0, mithril_1.default)('span.webcraft_tree_leaf_populated', {
                        className: (0, classnames_1.default)([
                            item.$opened ? 'icon-down-dir' : 'icon-right-dir',
                        ]),
                    }) : (0, mithril_1.default)('span.webcraft_tree_leaf_empty'),
                    getIcon(item),
                    template(item),
                ]),
                item.$opened ? generateLeaves(children) : null,
            ]);
        };
        const rootLevelItems = this.data.getRootLevelItems();
        return (0, mithril_1.default)('div.webcraft_tree_wrapper', (0, mithril_1.default)('div.webcraft_tree', rootLevelItems.length ? rootLevelItems.map((item) => generateBranch(item)) :
            (0, mithril_1.default)('span.webcraft_text_no_data', 'There is no data to display')));
    }
}
exports.Tree = Tree;
