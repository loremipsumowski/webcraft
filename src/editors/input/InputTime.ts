import m from 'mithril';

import { Editor, EditorAttributes, EditorEventTypes } from '../Editor';
import classNames from 'classnames';
import { Button, Timepicker } from '../..';
import { Popup } from '../../popup/Popup';

declare type PopupMode = true | false | 'onlyByButton' | 'onlyByFocus';

export declare type InputTimeAttributes = EditorAttributes<string> & {
	placeholder?: string;
	readonly?: boolean;
	popup?: PopupMode;
}

export class InputTime extends Editor<string, InputTimeAttributes, EditorEventTypes<string>> {
	private _btnShowPopup: Button;
	private _popup: Popup;
	private _timepicker: Timepicker;

	constructor(attrs?: InputTimeAttributes) {
		super(attrs);
		this._popup = new Popup();
		this._timepicker = new Timepicker({
			value: this.getValue(),
			events: {
				change: (value?: string) => {
					this.setValue(value);
				}
			}
		});
		this._popup.attach(this._timepicker);
		this._btnShowPopup = new Button({
			color: 'secondary',
			icon: 'icon-clock',
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
		this._popup.show(target, { width: 300 });
	}

	setValue(value?: string | undefined): void {
		super.setValue(value);
		this._timepicker.setValue(value);
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
				value: this._editingValue ? this._editingValue : this.getValue(),
				onchange: (e: InputEvent) => {
					this.setValue((e.target as HTMLInputElement).value);
				},
				oninput: (e: InputEvent) => {
					const value = (e.target as HTMLInputElement).value;
					this._editingValue = value;
					this.validate(value);
				},
				onfocusin: (e: FocusEvent) => {
					this._editingValue = this.getValue();
					const PopupMode = this._getPopupMode();
					if (PopupMode === true || PopupMode === 'onlyByFocus') {
						this.showPopup((e.target as HTMLElement).parentElement as HTMLElement);
					}
				},
			}),
		];
	}

	validate(value?: string | undefined): boolean {
		if (value === undefined) {
			value = this.attrs.value;
		}
		return super.validate(value);
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