import m from 'mithril';

import { Editor, EditorAttributes, EditorEventTypes } from '../Editor';
import classNames from 'classnames';
import { hasDecimalLegalChars, hasIntegerLegalChars, isEmpty } from '../../tools/Validators';
import { Button } from '../..';
import { convertDelimitters, convertToDecimal } from '../../tools/Converters';
import { formatDecimal, formatInteger } from '../../tools/Formatters';

export declare type InputNumberAttributes = EditorAttributes<number> & {
	/**
	 * Text to place inside editor as pattern that value should be of. Alternatively it could be used as label describes field.
	 */
	placeholder?: string;
	/**
	 * Number type defines wheather field's value could contain decimal part or it should be integer. That field is used to format displaying value and to prevent input illegal characters into input
	 */
	numberType?: 'integer' | 'decimal';
	/**
	 * Decides whater show or hide buttons to decrement and increment field's value. Buttons are placed on the right side of the editor and make input narrower.
	 */
	showUpDownButtons?: boolean;
	/**
	 * Prefix value is placed in the beggining of the value during displaying formatted value; it is when edior is not focused. When control is focused it is editing and prefix is not displaying then.
	 */
	prefix?: string;
	/**
	 * Suffix value is placed in the end of the value during displaying formatted value; it is when edior is not focused. When control is focused it is editing and suffix is not displaying then.
	 */
	suffix?: string;
	/**
	 * Minimal value of the field used during validating
	 */
	min?: number;
	/**
	 * Maximal value of the field used during validating
	 */
	max?: number;
	/**
	 * Defines wheather it is possible to set value that is out of <min, max> range or prevent it. When strict mode is on and there was "setValue" method called with value out of range, then min or max value is placed instead
	 */
	strict?: boolean;
	/**
	 * Specifies value to add or minus by increment or decrement methods
	 */
	stepSize?: number;
	/**
	 * Function takes current value of control and returns representative text to display. When function is defined, then another formatting configuration (like prefix, suffix, etc.) is not applied.
	 * @param value current value of control
	 * @returns text to display as value
	 */
	valueFormatter?: (value?: number) => string;
}

/**
 * Editor input control of number type. User can type there digit values like integers of decimals. Control has abilities to display current value as formatted text with prefix or suffix, with thousand separators and decimal delimitter and number of decimals based on global library configuration.
 */
export class InputNumber extends Editor<number, InputNumberAttributes, EditorEventTypes<number>> {
	private _btnMinus: Button;
	private _btnPlus: Button;

	constructor(attrs?: InputNumberAttributes) {
		super(attrs);
		this._btnMinus = new Button({
			text: '-',
			style: 'plain',
			color: 'secondary',
			size: 'small',
			disabled: this.attrs.disabled,
		});
		this._btnPlus = new Button({
			text: '+',
			style: 'plain',
			color: 'secondary',
			size: 'small',
			disabled: this.attrs.disabled,
		});
		const onBtnClick = (btn: Button, action: () => void) => {
			let to: NodeJS.Timeout | undefined = undefined;
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
		this._btnMinus.events.on('mousedown', () => { onBtnClick(this._btnMinus, () => { this.decrement(); } );});
		this._btnPlus.events.on('mousedown', () => { onBtnClick(this._btnPlus, () => { this.increment(); } );});
	}

	/**
	 * Changes current value of the control by plus amount defined in "stepSize" attribute or 1 by default
	 */
	increment(): void {
		this.setValue((this.getValue() ?? 0) + (this.attrs.stepSize ?? 1));
	}

	/**
	 * Changes current value of the control by minus amount defined in "stepSize" attribute or 1 by default
	 */
	decrement(): void {
		this.setValue((this.getValue() ?? 0) - (this.attrs.stepSize ?? 1));
	}

	setDisabled(disabled: boolean): boolean {
		if (super.setDisabled(disabled)) {
			this._btnMinus.setDisabled(disabled);
			this._btnPlus.setDisabled(disabled);
			return true;
		} else {
			return false;
		}
	}

	setValue(value?: number | undefined, suppressEvents?: boolean): void {	
		const { strict, min, max } = this.attrs;
		if (strict && value !== undefined) {			
			if (min !== undefined && min > value) {
				value = min;
			} else if (max !== undefined && max < value) {
				value = max;
			}
		}
		return super.setValue(value, suppressEvents);
	}

	protected controlView(): m.Children | m.Vnode<unknown, unknown> {
		return [
			m('input.webcraft_editor_control', {
				key: this.getId(),
				id: this.getId(),
				placeholder: this.attrs.placeholder,
				disabled: this.attrs.disabled,
				value: this._editingValue !== undefined ? convertDelimitters(this._editingValue ?? String(this.attrs.value ?? '')) : this.getFormattedValue(),
				onchange: (e: InputEvent) => {
					this.setValue(convertToDecimal((e.target as HTMLInputElement).value));
				},
				oninput: (e: InputEvent) => {
					const value = (e.target as HTMLInputElement).value;
					const hasLegalChars = this.attrs.numberType === 'integer' && hasIntegerLegalChars(value) || this.attrs.numberType !== 'integer' && hasDecimalLegalChars(value);

					if (hasLegalChars) {
						this._editingValue = value;
						this.validate(convertToDecimal(value));
					} else {
						(e.target as HTMLInputElement).value = this._editingValue ?? '';
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
	validate(value?: number | undefined): boolean {
		if (!super.validate(value)) {
			return false;
		}
		if (value === undefined) {
			value = this.attrs.value;
		}

		if (!isEmpty(value)) {
			const { min, max } = this.attrs;
			const invalidMin = min !== undefined && min > value!;
			const invalidMax = max !== undefined && max < value!;
			if ((invalidMin || invalidMax) && min !== undefined && max !== undefined) {
				this._validationMessages.push(`The value should be within the range of ${min}-${max}.`);
			} else if (invalidMin) {
				this._validationMessages.push(`The value should be at least ${min}.`);
			} else if(invalidMax) {
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
	getFormattedValue(): string {
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
			formattedValue += formatInteger(value);
		} else {
			formattedValue += formatDecimal(value);
		}

		if (suffix) {
			formattedValue += suffix;
		}

		return formattedValue;
	}

	protected _getButtons(): Button[] {
		return [
			...super._getButtons(),
			...(this.attrs.showUpDownButtons && !this.isDisabled() ? [this._btnMinus, this._btnPlus] : []),
		];
	}

	protected _getEditorAttrs(attrs: m.Attributes): m.Attributes {
		attrs.className = classNames(attrs.className, 'webcraft_input');
		return attrs;
	}
}