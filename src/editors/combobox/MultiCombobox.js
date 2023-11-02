"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiCombobox = void 0;
const mithril_1 = __importDefault(require("mithril"));
const classnames_1 = __importDefault(require("classnames"));
const ComboboxBase_1 = require("./ComboboxBase");
const __1 = require("../..");
const Tools_1 = require("../../common/Tools");
class MultiCombobox extends ComboboxBase_1.ComboboxBase {
    constructor(attrs) {
        super(attrs);
        this._list.selection.setMultipleMode(true);
        this._list.events.on('afterSelect', (ids) => {
            var _a, _b;
            const value = this.getValue() || [];
            value.push(...ids);
            this.setValue(value);
            (_b = (_a = this.editorNode) === null || _a === void 0 ? void 0 : _a.querySelector('input')) === null || _b === void 0 ? void 0 : _b.focus();
        });
        this._addOptionBtn = new __1.Button({
            text: 'Add option',
            hidden: this.attrs.allowAddingOptions !== true,
            disabled: true,
            events: {
                click: () => {
                    if (this._editingValue) {
                        this.addOption(this._editingValue);
                    }
                }
            }
        });
        this._toolbar.addItem(this._addOptionBtn, 0);
    }
    addOption(value) {
        const item = this.data.add({
            id: (0, Tools_1.generateId)(),
            value,
        });
        const v = this.getValue() || [];
        v.push(item.id);
        this.setValue(v);
    }
    getValue() {
        const value = super.getValue();
        if (value) {
            return [...value];
        }
        return undefined;
    }
    validate(value) {
        if (value === undefined) {
            value = this.attrs.value;
        }
        if (value !== undefined && this.attrs.limit && value.length > this.attrs.limit) {
            this._validationMessages.push(`Max number of selected items is ${this.attrs.limit}`);
            this._validationStatus = false;
            return this._validationStatus;
        }
        return super.validate(value);
    }
    _getEditorAttrs(attrs) {
        attrs.className = (0, classnames_1.default)(attrs.className, 'webcraft_combobox--multiple');
        return attrs;
    }
    _getListFilteringFunction() {
        const x = [];
        const superFunc = super._getListFilteringFunction();
        if (superFunc) {
            x.push(superFunc);
        }
        const value = this.getValue();
        if (value !== undefined) {
            x.push((v) => !value.includes(v.id));
        }
        if (x.length) {
            return (item) => x.every(f => f(item));
        }
        return undefined;
    }
    valueView() {
        const value = this.getValue();
        if (!value) {
            return undefined;
        }
        const valueArr = (value === undefined ? [] : Array.isArray(value) ? value : [value]).map(x => this.data.getItemById(x));
        return valueArr.map(item => (0, mithril_1.default)('div.webcraft_combobox_value', {
            onclick: () => {
                var _a, _b;
                (_b = (_a = this.editorNode) === null || _a === void 0 ? void 0 : _a.querySelector('.webcraft_editor_control')) === null || _b === void 0 ? void 0 : _b.focus();
            },
        }, [
            (0, mithril_1.default)('span', { key: `${this.getId()}-${item.id}`, style: { marginRight: 'var(--webcraft-space)' } }, item.value),
            this.isDisabled() || this.attrs.showItemRemoveButton === false ? mithril_1.default.fragment({ key: `${this.getId()}-btn` }, []) : (new __1.Button({
                id: `${this.getId()}-btn`,
                text: 'X',
                size: 'small',
                style: 'plain',
                color: 'secondary',
                events: {
                    click: (e) => {
                        e.stopPropagation();
                        this.setValue(valueArr.filter(x => x.id !== item.id).map(x => x.id));
                    }
                }
            }).view()),
        ]));
    }
    controlView() {
        return [
            this.valueView(),
            (0, mithril_1.default)('input.webcraft_editor_control', {
                id: this.getId(),
                placeholder: this.attrs.placeholder,
                disabled: this.attrs.disabled,
                readonly: this.attrs.readonly,
                value: this._editingValue,
                oninput: (e) => {
                    this._setEditingValue(e.target.value);
                    this._fixListView();
                    this.showPopup();
                },
                onkeydown: (e) => {
                    if (e.key === 'Backspace' && !e.target.value) {
                        const value = this.getValue();
                        if (Array.isArray(value) && (value === null || value === void 0 ? void 0 : value.length) > 0) {
                            value.splice(value.length - 1, 1);
                            this.setValue(value);
                        }
                    }
                }
            }),
        ];
    }
    _setEditingValue(value) {
        console.log(1);
        super._setEditingValue(value);
        this._addOptionBtn.setDisabled(!(value === null || value === void 0 ? void 0 : value.length));
    }
}
exports.MultiCombobox = MultiCombobox;
