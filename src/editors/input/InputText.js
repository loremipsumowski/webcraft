"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputText = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Editor_1 = require("../Editor");
const classnames_1 = __importDefault(require("classnames"));
class InputText extends Editor_1.Editor {
    controlView() {
        var _a;
        return [
            (0, mithril_1.default)('input.webcraft_editor_control', {
                id: this.getId(),
                type: 'text',
                placeholder: this.attrs.placeholder,
                disabled: this.attrs.disabled,
                value: (_a = this._editingValue) !== null && _a !== void 0 ? _a : this.attrs.value,
                onchange: (e) => {
                    this.setValue(e.target.value);
                },
                oninput: (e) => {
                    const value = e.target.value;
                    this._editingValue = value;
                    this.validate(value);
                }
            }),
        ];
    }
    _getEditorAttrs(attrs) {
        attrs.className = (0, classnames_1.default)(attrs.className, 'webcraft_input');
        return attrs;
    }
}
exports.InputText = InputText;
