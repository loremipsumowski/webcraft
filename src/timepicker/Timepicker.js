"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timepicker = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Component_1 = require("../common/Component");
const __1 = require("..");
const Formatters_1 = require("../tools/Formatters");
const Global_1 = require("../tools/Global");
require("./timepicker.style.css");
class Timepicker extends Component_1.Component {
    constructor(attrs) {
        super(attrs);
        const { clockFormat } = (0, Global_1.getGlobalConfig)().time;
        const inputAttrs = {
            valueFormatter: (value) => {
                if (value === undefined) {
                    return '';
                }
                return (0, Formatters_1.prependZero)(2, String(value));
            },
            sizes: {
                width: 70
            },
            showClearButton: false,
            showUpDownButtons: true,
            strict: true,
            numberType: 'integer',
        };
        const parts = this._getPartsByValue(this.attrs.value);
        this._hoursInput = new __1.InputNumber(Object.assign(Object.assign({}, inputAttrs), { value: parts[0], min: 0, max: clockFormat === 24 ? 23 : 11, events: {
                change: () => { this.setValue(this._getValue(), true); }
            } }));
        this._minutesInput = new __1.InputNumber(Object.assign(Object.assign({}, inputAttrs), { value: parts[1], min: 0, max: 59, events: {
                change: () => { this.setValue(this._getValue(), true); }
            } }));
        this._meridiemIndicatorToggle = new __1.Toggle({
            value: parts[2],
            sizes: {
                width: 100
            },
            showClearButton: false,
            items: [
                { id: 'am', text: 'AM' },
                { id: 'pm', text: 'PM' },
            ],
            events: {
                change: () => { this.setValue(this._getValue(), true); }
            }
        });
        this._box = new __1.Box({
            content: [
                {
                    direction: 'row',
                    align: 'center',
                    justify: 'center',
                    flexWrap: false,
                    content: [
                        { flex: '0 0 content', direction: 'row', flexWrap: false, content: this._hoursInput },
                        { flex: '0 0 10px', content: ':', justify: 'center', classnames: 'webcraft_timepicker_separator' },
                        { flex: '0 0 content', direction: 'row', flexWrap: false, content: this._minutesInput },
                    ]
                },
                { hidden: clockFormat === 24, align: 'center', content: this._meridiemIndicatorToggle }
            ]
        });
        if (this.attrs.value) {
            this.setValue(this.attrs.value);
        }
    }
    view() {
        return (0, mithril_1.default)('div.webcraft_timepicker', this._box.view());
    }
    setValue(value, suppresInputsUpdating) {
        if (this.attrs.value === value) {
            return;
        }
        this.attrs.value = value;
        if (!suppresInputsUpdating) {
            const parts = this._getPartsByValue(value);
            this._hoursInput.setValue(parts[0], true);
            this._minutesInput.setValue(parts[1], true);
            this._meridiemIndicatorToggle.setValue(parts[2], true);
        }
        this.events.emit('change', this.getValue());
        mithril_1.default.redraw();
    }
    getValue() {
        return this.attrs.value;
    }
    _getValue() {
        const [hours, minutes, meridiemIndicator] = this._getPartsByInputs();
        if (hours === undefined || minutes === undefined) {
            return undefined;
        }
        if ((0, Global_1.getGlobalConfig)().time.clockFormat === 24) {
            return `${(0, Formatters_1.prependZero)(2, String(hours))}:${(0, Formatters_1.prependZero)(2, String(minutes))}`;
        }
        else {
            if (meridiemIndicator === undefined) {
                return undefined;
            }
            return `${(0, Formatters_1.prependZero)(2, String(hours))}:${(0, Formatters_1.prependZero)(2, String(minutes))} ${meridiemIndicator.toUpperCase()}`;
        }
    }
    _getPartsByValue(value) {
        if (!value) {
            return [undefined, undefined, undefined];
        }
        const [hours, rest] = value.split(':');
        let minutes, indicator;
        if ((0, Global_1.getGlobalConfig)().time.clockFormat === 24) {
            minutes = rest;
            return [hours === undefined ? undefined : Number(hours), minutes === undefined ? undefined : Number(minutes)];
        }
        else {
            [minutes, indicator] = rest.split(' ');
            return [hours === undefined ? undefined : Number(hours), minutes === undefined ? undefined : Number(minutes), indicator.toLowerCase()];
        }
    }
    _getPartsByInputs() {
        if ((0, Global_1.getGlobalConfig)().time.clockFormat === 24) {
            return [this._hoursInput.getValue(), this._minutesInput.getValue()];
        }
        else {
            return [this._hoursInput.getValue(), this._minutesInput.getValue(), this._meridiemIndicatorToggle.getValue()];
        }
    }
}
exports.Timepicker = Timepicker;
