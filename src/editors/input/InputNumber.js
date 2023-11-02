"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputNumber = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Editor_1 = require("../Editor");
const classnames_1 = __importDefault(require("classnames"));
const Validators_1 = require("../../tools/Validators");
const __1 = require("../..");
const Converters_1 = require("../../tools/Converters");
const Formatters_1 = require("../../tools/Formatters");
/**
 * Editor input control of number type. User can type there digit values like integers of decimals. Control has abilities to display current value as formatted text with prefix or suffix, with thousand separators and decimal delimitter and number of decimals based on global library configuration.
 */
class InputNumber extends Editor_1.Editor {
    constructor(attrs) {
        super(attrs);
        this._btnMinus = new __1.Button({
            text: '-',
            style: 'plain',
            color: 'secondary',
            size: 'small',
            disabled: this.attrs.disabled,
        });
        this._btnPlus = new __1.Button({
            text: '+',
            style: 'plain',
            color: 'secondary',
            size: 'small',
            disabled: this.attrs.disabled,
        });
        const onBtnClick = (btn, action) => {
            let to = undefined;
            let deactive = false;
            const mouseUpEvent = () => {
                if (to) {
                    clearTimeout(to);
                    action();
                }
                deactive = true;
                document.removeEventListener('mouseup', mouseUpEvent);
            };
            document.addEventListener('mouseup', mouseUpEvent);
            to = setTimeout(() => {
                const _action = () => {
                    if (deactive) {
                        return;
                    }
                    action();
                    requestAnimationFrame(() => { _action(); });
                };
                _action();
            }, 500);
        };
        this._btnMinus.events.on('mousedown', () => { onBtnClick(this._btnMinus, () => { this.decrement(); }); });
        this._btnPlus.events.on('mousedown', () => { onBtnClick(this._btnPlus, () => { this.increment(); }); });
    }
    /**
     * Changes current value of the control by plus amount defined in "stepSize" attribute or 1 by default
     */
    increment() {
        var _a, _b;
        this.setValue(((_a = this.getValue()) !== null && _a !== void 0 ? _a : 0) + ((_b = this.attrs.stepSize) !== null && _b !== void 0 ? _b : 1));
    }
    /**
     * Changes current value of the control by minus amount defined in "stepSize" attribute or 1 by default
     */
    decrement() {
        var _a, _b;
        this.setValue(((_a = this.getValue()) !== null && _a !== void 0 ? _a : 0) - ((_b = this.attrs.stepSize) !== null && _b !== void 0 ? _b : 1));
    }
    setDisabled(disabled) {
        if (super.setDisabled(disabled)) {
            this._btnMinus.setDisabled(disabled);
            this._btnPlus.setDisabled(disabled);
            return true;
        }
        else {
            return false;
        }
    }
    setValue(value, suppressEvents) {
        const { strict, min, max } = this.attrs;
        if (strict && value !== undefined) {
            if (min !== undefined && min > value) {
                value = min;
            }
            else if (max !== undefined && max < value) {
                value = max;
            }
        }
        return super.setValue(value, suppressEvents);
    }
    controlView() {
        var _a, _b;
        return [
            (0, mithril_1.default)('input.webcraft_editor_control', {
                key: this.getId(),
                id: this.getId(),
                placeholder: this.attrs.placeholder,
                disabled: this.attrs.disabled,
                value: this._editingValue !== undefined ? (0, Converters_1.convertDelimitters)((_a = this._editingValue) !== null && _a !== void 0 ? _a : String((_b = this.attrs.value) !== null && _b !== void 0 ? _b : '')) : this.getFormattedValue(),
                onchange: (e) => {
                    this.setValue((0, Converters_1.convertToDecimal)(e.target.value));
                },
                oninput: (e) => {
                    var _a;
                    const value = e.target.value;
                    const hasLegalChars = this.attrs.numberType === 'integer' && (0, Validators_1.hasIntegerLegalChars)(value) || this.attrs.numberType !== 'integer' && (0, Validators_1.hasDecimalLegalChars)(value);
                    if (hasLegalChars) {
                        this._editingValue = value;
                        this.validate((0, Converters_1.convertToDecimal)(value));
                    }
                    else {
                        e.target.value = (_a = this._editingValue) !== null && _a !== void 0 ? _a : '';
                    }
                },
                onfocusin: () => {
                    const value = this.getValue();
                    if (value) {
                        this._editingValue = String(value);
                    }
                },
            }),
        ];
    }
    /**
     * Checks that value of the control is correct or not and changes style of the control depends on the validation result
     * @param value value to validate control by with
     * @returns true if validation is successed or false in case of failure
     */
    validate(value) {
        if (!super.validate(value)) {
            return false;
        }
        if (value === undefined) {
            value = this.attrs.value;
        }
        if (!(0, Validators_1.isEmpty)(value)) {
            const { min, max } = this.attrs;
            const invalidMin = min !== undefined && min > value;
            const invalidMax = max !== undefined && max < value;
            if ((invalidMin || invalidMax) && min !== undefined && max !== undefined) {
                this._validationMessages.push(`The value should be within the range of ${min}-${max}.`);
            }
            else if (invalidMin) {
                this._validationMessages.push(`The value should be at least ${min}.`);
            }
            else if (invalidMax) {
                this._validationMessages.push(`The value should be at most ${max}.`);
            }
        }
        this._validationStatus = this._validationMessages.length === 0;
        this.events.emit('afterValidate', this._validationStatus, this._validationMessages);
        return this._validationStatus;
    }
    /**
     * Get string represents formatted value of the control. It includes prefix, suffix and separators.
     * @returns formatted value of the field
     */
    getFormattedValue() {
        const value = this.getValue();
        if (this.attrs.valueFormatter) {
            return this.attrs.valueFormatter(value);
        }
        if (value === null || value === undefined) {
            return '';
        }
        const { prefix, suffix } = this.attrs;
        let formattedValue = '';
        if (prefix) {
            formattedValue += prefix;
        }
        if (this.attrs.numberType === 'integer') {
            formattedValue += (0, Formatters_1.formatInteger)(value);
        }
        else {
            formattedValue += (0, Formatters_1.formatDecimal)(value);
        }
        if (suffix) {
            formattedValue += suffix;
        }
        return formattedValue;
    }
    _getButtons() {
        return [
            ...super._getButtons(),
            ...(this.attrs.showUpDownButtons && !this.isDisabled() ? [this._btnMinus, this._btnPlus] : []),
        ];
    }
    _getEditorAttrs(attrs) {
        attrs.className = (0, classnames_1.default)(attrs.className, 'webcraft_input');
        return attrs;
    }
}
exports.InputNumber = InputNumber;
