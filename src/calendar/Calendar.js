"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calendar = void 0;
const mithril_1 = __importDefault(require("mithril"));
require("./calendar.style.css");
const Component_1 = require("../common/Component");
const Toolbar_1 = require("../toolbar/Toolbar");
const Space_1 = require("../controls/space/Space");
const __1 = require("..");
const Date_1 = require("../tools/Date");
const classnames_1 = __importDefault(require("classnames"));
const Global_1 = require("../tools/Global");
class Calendar extends Component_1.Component {
    constructor(attrs) {
        super(attrs);
        this._yearsOnPage = 16;
        const { prev, next, today, clear } = (0, Global_1.getGlobalConfig)().i18n.calendar;
        this._toolbarTop = new Toolbar_1.Toolbar({
            items: [
                new __1.Button({ id: 'current_view', text: 'Sierpień', style: 'plain', events: {
                        click: () => {
                            switch (this._getView()) {
                                case 'days': {
                                    this.setView('months');
                                    break;
                                }
                                case 'months': {
                                    this.setView('years');
                                    break;
                                }
                                default: {
                                    break;
                                }
                            }
                        }
                    } }),
                new Space_1.Space(),
                new __1.Button({ icon: 'icon-left-open', size: 'small', round: true, color: 'secondary', style: 'plain', tooltip: prev, events: {
                        click: () => { this.prevPage(); }
                    } }),
                new __1.Button({ icon: 'icon-right-open', size: 'small', round: true, color: 'secondary', style: 'plain', tooltip: next, events: {
                        click: () => { this.nextPage(); }
                    } }),
            ]
        });
        this._toolbarBottom = new Toolbar_1.Toolbar({
            items: [
                new Space_1.Space(),
                new __1.Button({ text: today, size: 'small', style: 'plain', events: {
                        click: () => {
                            this.setValue(new Date());
                            this.setView('days');
                            this.setFocusDate(new Date());
                        }
                    } }),
                new __1.Button({ text: clear, size: 'small', style: 'plain', events: {
                        click: () => { this.clear(); }
                    } }),
            ]
        });
        this._updateCurrentViewButton();
    }
    view() {
        let view;
        switch (this._getView()) {
            case 'days': {
                view = this._getDaysView();
                break;
            }
            case 'months': {
                view = this._getMonthsView();
                break;
            }
            case 'years': {
                view = this._getYearsView();
                break;
            }
        }
        return (0, mithril_1.default)('div.webcraft_calendar', [
            this._toolbarTop.view(),
            view,
            this._toolbarBottom.view(),
        ]);
    }
    clear() {
        this.setValue(undefined);
    }
    setValue(value) {
        const time = value === null || value === void 0 ? void 0 : value.getTime();
        if (this.attrs.value === value || (typeof time === 'number' && isNaN(time))) {
            return;
        }
        this.attrs.value = value;
        this._updateCurrentViewButton();
        this.events.emit('change', this.attrs.value);
        mithril_1.default.redraw();
    }
    getValue() {
        return this.attrs.value;
    }
    prevPage() {
        const focusDate = this._getFocusDate();
        switch (this._getView()) {
            case 'years': {
                this.setFocusDate((0, Date_1.addYearsToDate)(focusDate, -this._yearsOnPage));
                break;
            }
            case 'months': {
                this.setFocusDate((0, Date_1.addYearsToDate)(focusDate, -1));
                break;
            }
            default: {
                this.setFocusDate((0, Date_1.addMonthsToDate)(focusDate, -1));
                break;
            }
        }
    }
    nextPage() {
        const focusDate = this._getFocusDate();
        switch (this._getView()) {
            case 'years': {
                this.setFocusDate((0, Date_1.addYearsToDate)(focusDate, this._yearsOnPage));
                break;
            }
            case 'months': {
                this.setFocusDate((0, Date_1.addYearsToDate)(focusDate, +1));
                break;
            }
            default: {
                this.setFocusDate((0, Date_1.addMonthsToDate)(focusDate, +1));
                break;
            }
        }
    }
    setFocusDate(date) {
        this.attrs.focusOnDate = date;
        this._updateCurrentViewButton();
        mithril_1.default.redraw();
    }
    setView(view) {
        this.attrs.view = view;
        this._updateCurrentViewButton();
        mithril_1.default.redraw();
    }
    _getView() {
        return this.attrs.view || 'days';
    }
    _updateCurrentViewButton() {
        var _a;
        const focusDate = this._getFocusDate();
        let text;
        switch (this._getView()) {
            case 'years': {
                text = `${focusDate.getFullYear() - (this._yearsOnPage / 2)}-${focusDate.getFullYear() + (this._yearsOnPage / 2) - 1}`;
                break;
            }
            case 'months': {
                text = `${focusDate.getFullYear()}`;
                break;
            }
            default: {
                text = `${(0, Global_1.getGlobalConfig)().i18n.calendar.months[focusDate.getMonth()]} ${focusDate.getFullYear()}`;
                break;
            }
        }
        (_a = this._toolbarTop.getItem('current_view')) === null || _a === void 0 ? void 0 : _a.setText(text);
    }
    _getFocusDate() {
        var _a, _b;
        return (_b = (_a = this.attrs.focusOnDate) !== null && _a !== void 0 ? _a : this.getValue()) !== null && _b !== void 0 ? _b : new Date();
    }
    _getDaysView() {
        const dateToDrawAround = this._getFocusDate();
        const startDay = (0, Date_1.getFirstDayOfWeek)((0, Date_1.getFirstDayOfMonth)(dateToDrawAround));
        const today = new Date();
        const lines = [];
        if (this.attrs.showWeekdayShortcuts !== false) {
            const items = (0, Global_1.getGlobalConfig)().i18n.calendar.daysShort.map(dayShort => (0, mithril_1.default)('div.webcraft_calendar_weekday', dayShort));
            if (this.attrs.showWeekNumbers !== false) {
                items.unshift((0, mithril_1.default)('div.webcraft_calendar_weekday', ''));
            }
            lines.push((0, mithril_1.default)('div.webcraft_calendar_line', items));
        }
        for (let i = 0; i < 7 * 6;) {
            const items = [];
            while (items.length < 7) {
                const currentDate = (0, Date_1.addDaysToDate)(startDay, i);
                i++;
                if (items.length === 0 && this.attrs.showWeekNumbers !== false) {
                    items.push((0, mithril_1.default)('div.webcraft_calendar_weeknumber', (0, Date_1.getWeekNumber)(currentDate)));
                }
                items.push((0, mithril_1.default)('div.webcraft_calendar_item', {
                    onclick: () => {
                        this.setValue(currentDate);
                    },
                    className: (0, classnames_1.default)(dateToDrawAround.getMonth() !== currentDate.getMonth() ? 'webcraft_calendar_item--gray' : null, (0, Date_1.compareDatesIgnoringTime)(this.attrs.value, currentDate) === 0 ? 'webcraft_calendar_item--selected' : null, (0, Date_1.compareDatesIgnoringTime)(currentDate, today) === 0 ? 'webcraft_calendar_item--today' : null)
                }, currentDate.getDate()));
            }
            lines.push((0, mithril_1.default)('div.webcraft_calendar_line', items));
        }
        return (0, mithril_1.default)('div.webcraft_calendar_view', lines);
    }
    _getMonthsView() {
        const dateToDrawAround = this._getFocusDate();
        dateToDrawAround.setMonth(0);
        const lines = [];
        for (let i = -4; i < 16; i) {
            const items = [];
            while (items.length < 4) {
                const currentDate = (0, Date_1.addMonthsToDate)(dateToDrawAround, i);
                i++;
                items.push((0, mithril_1.default)('div.webcraft_calendar_item', {
                    onclick: () => {
                        this.setView('days');
                        this.setFocusDate(currentDate);
                    },
                    className: (0, classnames_1.default)(dateToDrawAround.getFullYear() !== currentDate.getFullYear() ? 'webcraft_calendar_item--gray' : null, (0, Date_1.compareDatesByYearAndMonth)(this.attrs.value, currentDate) === 0 ? 'webcraft_calendar_item--selected' : null)
                }, (0, Global_1.getGlobalConfig)().i18n.calendar.monthsShort[currentDate.getMonth()]));
            }
            lines.push((0, mithril_1.default)('div.webcraft_calendar_line', items));
        }
        return (0, mithril_1.default)('div.webcraft_calendar_view', lines);
    }
    _getYearsView() {
        var _a;
        const dateToDrawAround = this._getFocusDate();
        const lines = [];
        for (let i = 0 - (this._yearsOnPage / 2); i < this._yearsOnPage / 2; i) {
            const items = [];
            while (items.length < 4) {
                const currentDate = (0, Date_1.addYearsToDate)(dateToDrawAround, i);
                i++;
                items.push((0, mithril_1.default)('div.webcraft_calendar_item', {
                    onclick: () => {
                        this.setView('months');
                        this.setFocusDate(currentDate);
                    },
                    className: (0, classnames_1.default)(((_a = this.attrs.value) === null || _a === void 0 ? void 0 : _a.getFullYear()) === currentDate.getFullYear() ? 'webcraft_calendar_item--selected' : null)
                }, currentDate.getFullYear()));
            }
            lines.push((0, mithril_1.default)('div.webcraft_calendar_line', items));
        }
        return (0, mithril_1.default)('div.webcraft_calendar_view', lines);
    }
}
exports.Calendar = Calendar;
