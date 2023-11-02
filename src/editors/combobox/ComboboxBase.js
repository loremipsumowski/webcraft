"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComboboxBase = void 0;
const Editor_1 = require("../Editor");
const classnames_1 = __importDefault(require("classnames"));
const Popup_1 = require("../../popup/Popup");
const List_1 = require("../../list/List");
const __1 = require("../..");
const Data_1 = require("../../data/Data");
const Space_1 = require("../../controls/space/Space");
require("./combobox.style.css");
const Tools_1 = require("../../tools/Tools");
class ComboboxBase extends Editor_1.Editor {
    constructor(attrs) {
        super(attrs);
        this.data = new Data_1.Data();
        this._dropDownButton = new __1.Button({
            color: 'secondary',
            icon: 'icon-down-open',
            size: 'small',
            style: 'plain',
            events: {
                click: () => {
                    this.showPopup();
                },
            }
        });
        this._list = new List_1.List({
            template: (item) => this._itemTemplate(item),
        }, this.data);
        this._popup = new Popup_1.Popup({
            events: {
                afterHide: () => {
                    this._setFocus(false);
                    this._dropDownButton.setIcon('icon-down-open');
                    this._list.deactivateKeyboardNavigation();
                },
                afterShow: () => {
                    this._dropDownButton.setIcon('icon-up-open');
                },
            }
        });
        this._toolbar = new __1.Toolbar({
            items: [
                new Space_1.Space(),
                new __1.Button({
                    text: 'Select all',
                    style: 'plain',
                    events: {
                        click: () => {
                            this._list.selection.selectAll();
                        }
                    }
                }),
            ]
        });
        this._popupBox = new __1.Box({
            sizes: {
                maxHeight: 400,
            },
            content: [
                {
                    flex: '1 1 content',
                    content: this._list,
                },
                {
                    id: 'box_toolbar',
                    flex: '0 0 content',
                    content: this._toolbar,
                },
            ]
        });
        this._popup.attach(this._popupBox);
    }
    setValue(value) {
        super.setValue(value);
        if (this.attrs.autoHidePopup !== false) {
            this._popup.hide();
        }
        this._fixListView();
    }
    showPopup() {
        var _a;
        if (this.isDisabled()) {
            return;
        }
        if (!this.editorNode) {
            throw new Error('Cannot show popup on unmounted component');
        }
        this._popup.show(this.editorNode, {
            width: this.editorNode.offsetWidth,
        });
        this._list.activateKeyboardNavigation();
        (_a = this.editorNode.querySelector('input')) === null || _a === void 0 ? void 0 : _a.focus();
    }
    setDisabled(disabled) {
        if (super.setDisabled(disabled)) {
            this._dropDownButton.setDisabled(disabled);
            return true;
        }
        else {
            return false;
        }
    }
    _fixListView() {
        const value = this.getValue();
        if (value === undefined) {
            this._list.selection.setSelection(undefined);
        }
        else if (Array.isArray(value)) {
            this._list.selection.setSelection(value);
        }
        else {
            this._list.selection.setSelection([value]);
        }
        const filteringFunction = this._getListFilteringFunction();
        this.data.clearFilters();
        if (filteringFunction) {
            this.data.applyFilter(filteringFunction);
        }
    }
    _itemTemplate(item) {
        return String(item.value);
    }
    _getEditorAttrs(attrs) {
        attrs.className = (0, classnames_1.default)(attrs.className, 'webcraft_combobox');
        return attrs;
    }
    _getEditorContentAttrs(attrs) {
        return Object.assign({
            onclick: () => {
                this.showPopup();
            }
        }, attrs);
    }
    _getButtons() {
        return [
            ...super._getButtons(),
            ...(!this.isDisabled() ? [this._dropDownButton] : []),
        ];
    }
    _setFocus(focus) {
        if (focus === false && this._popup.isHidden() === false) {
            return;
        }
        super._setFocus(focus);
    }
    _getListFilteringFunction() {
        const x = [];
        if (this._editingValue) {
            const regexp = new RegExp((0, Tools_1.escapeRegExp)(this._editingValue), 'gmi');
            x.push((item) => { var _a; return (_a = item.value) === null || _a === void 0 ? void 0 : _a.match(regexp); });
        }
        if (x.length) {
            return (item) => x.every(f => f(item));
        }
        return undefined;
    }
}
exports.ComboboxBase = ComboboxBase;
