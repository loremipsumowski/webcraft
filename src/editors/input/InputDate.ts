import m from 'mithril';

import { Editor, EditorAttributes, EditorEventTypes } from '../Editor';
import classNames from 'classnames';
import { convertToDate } from '../../tools/Converters';
import { formatDate } from '../../tools/Formatters';
import { Button } from '../..';
import { Popup } from '../../popup/Popup';
import { Calendar } from '../../calendar/Calendar';
import { dateFormats } from '../../tools/DateFormats';

declare type PopupMode = true | false | 'onlyByButton' | 'onlyByFocus';

export declare type InputDateAttributes = EditorAttributes<Date> & {
	placeholder?: string;
	readonly?: boolean;
	popup?: PopupMode;
	format?: keyof typeof dateFormats;
}

export class InputDate extends Editor<Date, InputDateAttributes, EditorEventTypes<Date>> {
	private _btnShowPopup: Button;
	private _popup: Popup;
	private _calendar: Calendar;

	constructor(attrs?: InputDateAttributes) {
		super(attrs);
		this._popup = new Popup();
		this._calendar = new Calendar({
			value: this.getValue(),
			events: {
				change: (value?: Date) => {
					this.setValue(value);
				}
			}
		});
		this._popup.attach(this._calendar);
		this._btnShowPopup = new Button({
			color: 'secondary',
			icon: 'icon-calendar',
			size: 'small',
			style: 'plain',
			events: {
				click: (e: PointerEvent) => {
					this.showPopup((e.target as HTMLElement).parentElement as HTMLElement);
				},
			}
		});
	}

	showPopup(target: PointerEvent | HTMLElement): void {
		this._popup.show(target);
	}

	setValue(value?: Date | undefined): void {
		super.setValue(value);
		this._calendar.setValue(value);
		this._popup.hide();
	}

	setDisabled(disabled: boolean): boolean {
		if (super.setDisabled(disabled)) {
			this._btnShowPopup.setDisabled(disabled);
			return true;
		} else {
			return false;
		}
	}

	protected controlView(): m.Children | m.Vnode<unknown, unknown> {
		return [
			m('input.webcraft_editor_control', {
				id: this.getId(),
				type: 'text',
				placeholder: this.attrs.placeholder,
				disabled: this.attrs.disabled,
				readonly: this.attrs.readonly,
				value: this._editingValue ? this._editingValue : this.getFormattedValue(),
				onchange: (e: InputEvent) => {
					this.setValue(convertToDate((e.target as HTMLInputElement).value, this.attrs.format));
				},
				oninput: (e: InputEvent) => {
					const value = (e.target as HTMLInputElement).value;
					this._editingValue = value;
					this.validate(convertToDate(value, this.attrs.format));
				},
				onfocusin: (e: FocusEvent) => {
					this._editingValue = this.getFormattedValue();
					const PopupMode = this._getPopupMode();
					if (PopupMode === true || PopupMode === 'onlyByFocus') {
						this.showPopup((e.target as HTMLElement).parentElement as HTMLElement);
					}
				},
			}),
		];
	}

	validate(value?: Date | undefined): boolean {
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

	getFormattedValue(): string {
		return formatDate(this.getValue(), this.attrs.format);
	}

	private _getPopupMode(): PopupMode {
		return this.attrs.popup ?? 'onlyByButton';
	}

	protected _getButtons(): Button[] {
		const popupMode = this._getPopupMode();
		return [
			...super._getButtons(),
			...((popupMode === true || popupMode === 'onlyByButton') && !this.isDisabled() ? [this._btnShowPopup] : []),
		];
	}

	protected _getEditorAttrs(attrs: m.Attributes): m.Attributes {
		attrs.className = classNames(attrs.className, 'webcraft_input');
		return attrs;
	}
}