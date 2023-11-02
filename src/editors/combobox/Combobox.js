"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Combobox = void 0;
const mithril_1 = __importDefault(require("mithril"));
const ComboboxBase_1 = require("./ComboboxBase");
class Combobox extends ComboboxBase_1.ComboboxBase {
    constructor(attrs) {
        var _a;
        super(attrs);
        (_a = this._popupBox.getContainer('box_toolbar')) === null || _a === void 0 ? void 0 : _a.setHidden(true);
        this._list.events.on('afterSelect', (ids) => {
            var _a, _b;
            this.setValue(ids[0]);
            (_b = (_a = this.editorNode) === null || _a === void 0 ? void 0 : _a.querySelector('input')) === null || _b === void 0 ? void 0 : _b.focus();
        });
    }
    controlView() {
        var _a;
        const value = this.getValue();
        const item = value !== undefined ? this.data.getItemById(value) : undefined;
        return [
            (0, mithril_1.default)('input.webcraft_editor_control', {
                id: this.getId(),
                placeholder: this.attrs.placeholder,
                disabled: this.attrs.disabled,
                readonly: this.attrs.readonly,
                value: (_a = this._editingValue) !== null && _a !== void 0 ? _a : item === null || item === void 0 ? void 0 : item.value,
                oninput: (e) => {
                    this._setEditingValue(e.target.value);
                    this._fixListView();
                    this.showPopup();
                }
            }),
        ];
    }
}
exports.Combobox = Combobox;
