"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioGroup = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Editor_1 = require("../Editor");
const classnames_1 = __importDefault(require("classnames"));
require("./radioGroup.style.css");
class RadioGroup extends Editor_1.Editor {
    getDirection() {
        return this.attrs.direction || 'column';
    }
    controlView() {
        const value = this.getValue();
        return this.attrs.items.map(item => (0, mithril_1.default)('div.webcraft_radio_item', {
            className: (0, classnames_1.default)(this.isDisabled() || item.disabled ? 'webcraft_radio--disabled' : null)
        }, [
            (0, mithril_1.default)('div.webcraft_radio', {
                className: (0, classnames_1.default)(value === item.id ? 'webcraft_radio--checked' : null),
                onclick: () => {
                    if (!this.isDisabled() && !item.disabled) {
                        this.setValue(item.id);
                    }
                }
            }, [
                (0, mithril_1.default)('input', {
                    type: 'radio',
                    disabled: this.isDisabled() || item.disabled,
                    required: this.isRequired(),
                    name: this.getId(),
                    id: item.id,
                }),
            ]),
            (0, mithril_1.default)('label', {
                for: item.id,
            }, item.label),
        ]));
    }
    _getEditorAttrs(attrs) {
        attrs.className = (0, classnames_1.default)(attrs.className, 'webcraft_radiogroup', `webcraft_radiogroup--${this.getDirection()}`);
        return attrs;
    }
}
exports.RadioGroup = RadioGroup;
