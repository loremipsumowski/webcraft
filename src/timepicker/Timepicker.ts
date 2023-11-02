import m from 'mithril';
import { Component, ComponentAttributes } from '../common/Component';
import { ValidEventTypes } from '../event-emitter/EventEmitter';
import { Box, InputNumber, Toggle } from '..';
import { prependZero } from '../tools/Formatters';
import { getGlobalConfig } from '../tools/Global';

import './timepicker.style.css';
import { InputNumberAttributes } from '../editors/input/InputNumber';

declare type TimepickerAttributes = ComponentAttributes & {
	value?: string;
}

declare type TimeParts = [number | undefined, number | undefined] | [number | undefined, number | undefined, 'am' | 'pm' | undefined];

export class Timepicker extends Component<TimepickerAttributes, ValidEventTypes> {
	private _box: Box;
	private _hoursInput: InputNumber;
	private _minutesInput: InputNumber;
	private _meridiemIndicatorToggle: Toggle;

	constructor(attrs?: TimepickerAttributes) {
		super(attrs);
		const { clockFormat } = getGlobalConfig().time;
		const inputAttrs: InputNumberAttributes = {
			valueFormatter: (value?: number) => {
				if (value === undefined) {
					return '';
				}
				return prependZero(2, String(value));
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

		this._hoursInput = new InputNumber({
			...inputAttrs,
			value: parts[0],
			min: 0,
			max: clockFormat === 24 ? 23 : 11,
			events: {
				change: () => { this.setValue(this._getValue(), true); }
			}
		});

		this._minutesInput = new InputNumber({
			...inputAttrs,
			value: parts[1],
			min: 0,
			max: 59,
			events: {
				change: () => { this.setValue(this._getValue(), true); }
			}
		});

		this._meridiemIndicatorToggle = new Toggle({
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

		this._box = new Box({
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

	view(): m.Children | m.Vnode<unknown, unknown> {
		return m('div.webcraft_timepicker', this._box.view());
	}

	setValue(value?: string, suppresInputsUpdating?: boolean): void {
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
		m.redraw();
	}

	getValue(): string | undefined {
		return this.attrs.value;
	}

	private _getValue(): string | undefined {
		const [hours, minutes, meridiemIndicator] = this._getPartsByInputs();
		if (hours === undefined || minutes === undefined) {
			return undefined;
		}
		if (getGlobalConfig().time.clockFormat === 24) {
			return `${prependZero(2, String(hours))}:${prependZero(2, String(minutes))}`;
		} else {
			if (meridiemIndicator === undefined) {
				return undefined;
			}

			return `${prependZero(2, String(hours))}:${prependZero(2, String(minutes))} ${meridiemIndicator.toUpperCase()}`;
		}
	}

	private _getPartsByValue(value?: string): TimeParts {
		if (!value) {
			return [undefined, undefined, undefined];
		}

		const [hours, rest] = value.split(':');
		let minutes, indicator;
		if (getGlobalConfig().time.clockFormat === 24) {
			minutes = rest;
			return [hours === undefined ? undefined : Number(hours), minutes === undefined ? undefined : Number(minutes)];
		} else {
			[minutes, indicator] = rest.split(' ');
			return  [hours === undefined ? undefined : Number(hours), minutes === undefined ? undefined : Number(minutes), indicator.toLowerCase() as 'am' | 'pm' | undefined];
		}
	}

	private _getPartsByInputs(): TimeParts {
		if (getGlobalConfig().time.clockFormat === 24) {
			return [this._hoursInput.getValue(), this._minutesInput.getValue()];
		} else {
			return [this._hoursInput.getValue(), this._minutesInput.getValue(), this._meridiemIndicatorToggle.getValue() as 'am' | 'pm' | undefined];
		}
	}
}