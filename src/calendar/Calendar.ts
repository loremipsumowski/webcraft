import m from 'mithril';

import './calendar.style.css';
import { Component, ComponentAttributes } from '../common/Component';
import { Toolbar } from '../toolbar/Toolbar';
import { Space } from '../controls/space/Space';
import { Button } from '../controls/button/Button';
import { addDaysToDate, addMonthsToDate, addYearsToDate, compareDatesByYearAndMonth, compareDatesIgnoringTime, getFirstDayOfMonth, getFirstDayOfWeek, getWeekNumber } from '../tools/Date';
import classNames from 'classnames';
import { getGlobalConfig } from '../tools/Global';

declare type ViewType = 'years' | 'months' | 'days';

declare type CalendarAttributes = ComponentAttributes & {
	value?: Date;
	focusOnDate?: Date;
	view?: ViewType;
	showWeekNumbers?: boolean;
	showWeekdayShortcuts?: boolean;
};

declare type CalendarEventTypes = {
	change: (value: Date | undefined) => void;
};

export class Calendar extends Component<CalendarAttributes, CalendarEventTypes> {
	private _toolbarTop: Toolbar;
	private _toolbarBottom: Toolbar;
	private _yearsOnPage = 16;

	constructor(attrs?: CalendarAttributes) {
		super(attrs);
		const { prev, next, today, clear } = getGlobalConfig().i18n.calendar;
		this._toolbarTop = new Toolbar({
			items: [
				new Button({ id: 'current_view', text: 'Sierpień', style: 'plain', events: {
					click: () => { 
						switch(this._getView()) {
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
				new Space(),
				new Button({ icon: 'icon-left-open', size: 'small', round: true, color: 'secondary', style: 'plain', tooltip: prev, events: {
					click: () => { this.prevPage(); }
				} }),
				new Button({ icon: 'icon-right-open', size: 'small', round: true, color: 'secondary', style: 'plain', tooltip: next, events: {
					click: () => { this.nextPage(); }
				} }),
			]
		});
		this._toolbarBottom = new Toolbar({
			items: [
				new Space(),
				new Button({ text: today, size: 'small', style: 'plain', events: {
					click: () => { 
						this.setValue(new Date());
						this.setView('days');
						this.setFocusDate(new Date());
					}
				} }),
				new Button({ text: clear, size: 'small', style: 'plain', events: {
					click: () => { this.clear(); }
				} }),
			]
		});
		this._updateCurrentViewButton();
	}

	view(): m.Children | m.Vnode<unknown, unknown> {
		let view;
		switch(this._getView()) {
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
		return m('div.webcraft_calendar', [
			this._toolbarTop.view(),
			view,
			this._toolbarBottom.view(),
		]);
	}

	clear(): void {
		this.setValue(undefined);
	}

	setValue(value: Date | undefined): void {
		const time = value?.getTime();
		if (this.attrs.value === value || (typeof time === 'number' && isNaN(time))) {
			return;
		}
		this.attrs.value = value;
		this._updateCurrentViewButton();
		this.events.emit('change', this.attrs.value);
		m.redraw();
	}

	getValue(): Date | undefined {
		return this.attrs.value;
	}

	prevPage(): void {
		const focusDate = this._getFocusDate();
		switch(this._getView()) {
		case 'years': {
			this.setFocusDate(addYearsToDate(focusDate, -this._yearsOnPage));
			break;
		}
		case 'months': {
			this.setFocusDate(addYearsToDate(focusDate, - 1));
			break;
		}
		default: {
			this.setFocusDate(addMonthsToDate(focusDate, - 1));
			break;
		}
		}
	}

	nextPage(): void {
		const focusDate = this._getFocusDate();
		switch(this._getView()) {
		case 'years': {
			this.setFocusDate(addYearsToDate(focusDate, this._yearsOnPage));
			break;
		}
		case 'months': {
			this.setFocusDate(addYearsToDate(focusDate, + 1));
			break;
		}
		default: {
			this.setFocusDate(addMonthsToDate(focusDate, + 1));
			break;
		}
		}
	}

	setFocusDate(date: Date): void {
		this.attrs.focusOnDate = date;
		this._updateCurrentViewButton();
		m.redraw();
	}

	private setView(view: ViewType): void {
		this.attrs.view = view;
		this._updateCurrentViewButton();
		m.redraw();
	}

	private _getView(): ViewType {
		return this.attrs.view ||  'days';
	}

	private _updateCurrentViewButton(): void {
		const focusDate = this._getFocusDate();
		let text;
		switch(this._getView()) {
		case 'years': {
			text = `${focusDate.getFullYear() - (this._yearsOnPage / 2)}-${focusDate.getFullYear() + (this._yearsOnPage / 2) - 1}`;
			break;
		}
		case 'months': {
			text = `${focusDate.getFullYear()}`;
			break;
		}
		default: {
			text = `${getGlobalConfig().i18n.calendar.months[focusDate.getMonth()]} ${focusDate.getFullYear()}`;
			break;
		}
		}
		this._toolbarTop.getItem<Button>('current_view')?.setText(text);
	}

	private _getFocusDate(): Date {
		return this.attrs.focusOnDate ?? this.getValue() ?? new Date();
	}

	private _getDaysView(): m.Children | m.Vnode<unknown, unknown> {
		const dateToDrawAround = this._getFocusDate();
		const startDay = getFirstDayOfWeek(getFirstDayOfMonth(dateToDrawAround));
		const today = new Date();

		const lines = [];

		if (this.attrs.showWeekdayShortcuts !== false) {
			const items = getGlobalConfig().i18n.calendar.daysShort.map(dayShort => 
				m('div.webcraft_calendar_weekday', dayShort)
			);

			if (this.attrs.showWeekNumbers !== false) {
				items.unshift(m('div.webcraft_calendar_weekday', ''));
			}
			lines.push(m('div.webcraft_calendar_line', items));
		}

		for(let i = 0; i < 7 * 6;) {
			const items = [];
			while (items.length < 7) {
				const currentDate = addDaysToDate(startDay, i);
				i++;
				
				if (items.length === 0 && this.attrs.showWeekNumbers !== false) {
					items.push(m('div.webcraft_calendar_weeknumber', getWeekNumber(currentDate)));
				}

				items.push(m('div.webcraft_calendar_item', {
					onclick: () => {
						this.setValue(currentDate);
					},
					className: classNames(
						dateToDrawAround.getMonth() !== currentDate.getMonth() ? 'webcraft_calendar_item--gray' : null,
						compareDatesIgnoringTime(this.attrs.value, currentDate) === 0 ? 'webcraft_calendar_item--selected' : null,
						compareDatesIgnoringTime(currentDate, today) === 0 ? 'webcraft_calendar_item--today' : null,
					)
				}, currentDate.getDate()));
			}
			lines.push(m('div.webcraft_calendar_line', items));
		}
		return m('div.webcraft_calendar_view', lines);
	}

	private _getMonthsView(): m.Children | m.Vnode<unknown, unknown> {
		const dateToDrawAround = this._getFocusDate();
		dateToDrawAround.setMonth(0);

		const lines = [];
		for(let i = -4; i < 16; i) {
			const items = [];
			while (items.length < 4) {
				const currentDate = addMonthsToDate(dateToDrawAround, i);
				i++;
				items.push(m('div.webcraft_calendar_item', {
					onclick: () => {
						this.setView('days');
						this.setFocusDate(currentDate);
					},
					className: classNames(
						dateToDrawAround.getFullYear() !== currentDate.getFullYear() ? 'webcraft_calendar_item--gray' : null,
						compareDatesByYearAndMonth(this.attrs.value, currentDate) === 0 ? 'webcraft_calendar_item--selected' : null
					)
				}, getGlobalConfig().i18n.calendar.monthsShort[currentDate.getMonth()]));
			}
			lines.push(m('div.webcraft_calendar_line', items));
		}
		return m('div.webcraft_calendar_view', lines);
	}

	private _getYearsView(): m.Children | m.Vnode<unknown, unknown> {
		const dateToDrawAround = this._getFocusDate();

		const lines = [];
		for(let i = 0 - (this._yearsOnPage / 2); i < this._yearsOnPage / 2; i) {
			const items = [];
			while (items.length < 4) {
				const currentDate = addYearsToDate(dateToDrawAround, i);
				i++;
				items.push(m('div.webcraft_calendar_item', {
					onclick: () => {
						this.setView('months');
						this.setFocusDate(currentDate);
					},
					className: classNames(
						this.attrs.value?.getFullYear() === currentDate.getFullYear() ? 'webcraft_calendar_item--selected' : null
					)
				}, currentDate.getFullYear()));
			}
			lines.push(m('div.webcraft_calendar_line', items));
		}
		return m('div.webcraft_calendar_view', lines);
	}

}