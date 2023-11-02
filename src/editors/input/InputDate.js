"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputDate = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Editor_1 = require("../Editor");
const classnames_1 = __importDefault(require("classnames"));
const Converters_1 = require("../../tools/Converters");
const Formatters_1 = require("../../tools/Formatters");
const __1 = require("../..");
const Popup_1 = require("../../popup/Popup");
const Calendar_1 = require("../../calendar/Calendar");
class InputDate extends Editor_1.Editor {
    constructor(attrs) {
        super(attrs);
        this._popup = new Popup_1.Popup();
        this._calendar = new Calendar_1.Calendar({
            value: this.getValue(),
            events: {
                change: (value) => {
                    this.setValue(value);
                }
            }
        });
        this._popup.attach(this._calendar);
        this._btnShowPopup = new __1.Button({
            color: 'secondary',
            icon: 'icon-calendar',
            size: 'small',
            style: 'plain',
            events: {
                click: (e) => {
                    this.showPopup(e.target.parentElement);
                },
            }
        });
    }
    showPopup(target) {
        this._popup.show(target);
    }
    setValue(value) {
        super.setValue(value);
        this._calendar.setValue(value);
        this._popup.hide();
    }
    setDisabled(disabled) {
        if (super.setDisabled(disabled)) {
            this._btnShowPopup.setDisabled(disabled);
            return true;
        }
        else {
            return false;
        }
    }
    controlView() {
        return [
            (0, mithril_1.default)('input.webcraft_editor_control', {
                id: this.getId(),
                type: 'text',
                placeholder: this.attrs.placeholder,
                disabled: this.attrs.disabled,
                readonly: this.attrs.readonly,
                value: this._editingValue ? this._editingValue : this.getFormattedValue(),
                onchange: (e) => {
                    this.setValue((0, Converters_1.convertToDate)(e.target.value));
                },
                oninput: (e) => {
                    const value = e.target.value;
                    this._editingValue = value;
                    this.validate((0, Converters_1.convertToDate)(value));
                },
                onfocusin: (e) => {
                    this._editingValue = this.getFormattedValue();
                    const PopupMode = this._getPopupMode();
                    if (PopupMode === true || PopupMode === 'onlyByFocus') {
                        this.showPopup(e.target.parentElement);
                    }
                },
            }),
        ];
    }
    validate(value) {
        if (value === undefined) {
            value = this.attrs.value;
        }
        if (value !== undefined && isNaN(value.getTime())) {
            this._validationMessages.push('Value is not correct Date');
            this._validationStatus = false;
            return this._validationStatus;
        }
        return super.validate(value);
    }
    getFormattedValue() {
        return (0, Formatters_1.formatDate)(this.getValue());
    }
    _getPopupMode() {
        var _a;
        return (_a = this.attrs.popup) !== null && _a !== void 0 ? _a : 'onlyByButton';
    }
    _getButtons() {
        const popupMode = this._getPopupMode();
        return [
            ...super._getButtons(),
            ...((popupMode === true || popupMode === 'onlyByButton') && !this.isDisabled() ? [this._btnShowPopup] : []),
        ];
    }
    _getEditorAttrs(attrs) {
        attrs.className = (0, classnames_1.default)(attrs.className, 'webcraft_input');
        return attrs;
    }
}
exports.InputDate = InputDate;
