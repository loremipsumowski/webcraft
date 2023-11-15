import m from 'mithril';
import { Component, ComponentAttributes } from '../common/Component';
import { EventEmitter } from '../event-emitter/EventEmitter';

import './editor.style.css';
import classNames from 'classnames';
import { SizeType } from '../common/Types';
import { Tooltip, TooltipAttrs } from '../messages/Tooltip';
import { Button } from '../controls/button/Button';
import { getGlobalConfig } from '../tools/Global';

declare type LabelAttributes = {
	text?: string;
}

export declare type EditorAttributes<T> = ComponentAttributes & {
	/**
	 * Specifies wheather control is disabled or not to input value there by the user
	 */
	disabled?: boolean;
	/**
	 * Specifies wheather control's value is required in order to get validation successed
	 */
	required?: boolean;	
	/**
	 * Text to place next to the control editor as label. It could be passed and simple text with default options or more complex object with detailed configuration of the label
	 */
	label?: string | LabelAttributes;
	/**
	 * Specifies default value of the control
	 */
	value?: T;
	/**
	 * Specifies default sizes of the control like min, max and defaults width and height
	 */
	sizes?: SizeType;
	/**
	 * Specifies short text message placed below editor control with smaller font size and gray color
	 */
	description?: string;
	/**
	 * Specifies configuration of tooltip to show it on mouse over the control
	 */
	tooltip?: TooltipAttrs;
	/**
	 * Specifies wheather there is clear button visible next to the control. Button allows to clear input's value by single click on it. That setting overrides default setting saved in global configuration
	 */
	showClearButton?: boolean;
	/**
	 * Name of css class to use as editor's icon. Icon is placed on the left side of the control. Icon narrows editor. 
	 */
	icon?: string;
}

export declare type EditorEventTypes<T> = {
	change: (value?: T) => void;
	mouseover: (e: PointerEvent) => void;
	mouseout: (e: PointerEvent) => void;
	afterEnable: () => void;
	afterDisable: () => void;
	afterValidate: (status: boolean, messages: string[]) => void;
	afterChange: (value?: T) => void;
}

export abstract class Editor<T, A extends EditorAttributes<T>, E extends EditorEventTypes<T>> extends Component<A, E> {
	protected _focused = false;
	protected _validationStatus?: boolean;
	protected _validationMessages: string[] = [];
	protected _editingValue?: string;
	private _btnClear: Button;
	protected editorNode?: HTMLElement;

	constructor(attrs?: A) {
		super(attrs);

		this.events.on('mouseover', (e) => {
			if (this.attrs.tooltip) {
				const tooltipHide = Tooltip.show(this.attrs.tooltip, e);
				this.events.once('mouseout', () => { tooltipHide(); });
			}
		});

		this._btnClear = new Button({
			text: 'x',
			style: 'plain',
			color: 'secondary',
			size: 'small',
			events: {
				click: () => {
					this.clear();
				}
			}
		});
	}

	/**
	 * Returns true/false specifies wheather control is disabled or not to input there value manually by the user
	 * @returns true if control is disabled
	 */
	isDisabled(): boolean {
		return Boolean(this.attrs.disabled);
	}

	/**
	 * Change state of control's disabling. Set it to true to disallow user to input value into control directly, or make it falsy to allow to input values manually
	 * @param disabled new state of control disabling
	 * @returns true if state was changed, otherwise false
	 */
	setDisabled(disabled: boolean): boolean {
		if (this.attrs.disabled === disabled) {
			return false;
		}
		this.attrs.disabled = disabled;
		(this.events as EventEmitter<EditorEventTypes<T>>).emit(this.attrs.disabled ? 'afterDisable' : 'afterEnable');
		m.redraw();
		return true;
	}

	/**
	 * Returns information that control's value is required in order to successed validation
	 * @returns true if control's value is required
	 */
	isRequired(): boolean {
		return Boolean(this.attrs.required);
	}

	/**
	 * Change state of control's requirement, then validate it. When state is true, then validation function can success only if value is not empty. 
	 * @param required new state of control requirement
	 * @returns true if state was changed, otherwise false
	 */
	setRequired(required: boolean): boolean {
		if (this.attrs.required === required) {
			return false;
		}
		this.attrs.required = required;
		this.validate();
		m.redraw();
		return true;
	}

	/**
	 * Get current value of the control
	 * @returns current value of the control of unformatted style
	 */
	getValue(): T | undefined {
		return this.attrs.value;
	}

	/**
	 * Sets current value of the control, then validates control
	 * @param value new value to set
	 * @param suppressEvents when true, then change event does not emit
	 */
	setValue(value?: T, suppressEvents?: boolean) {
		this._setEditingValue(undefined);
		this.attrs.value = value;
		if (suppressEvents !== true) {
			(this.events as EventEmitter<EditorEventTypes<T>>).emit('change', this.attrs.value);
		}
		this.validate();
		m.redraw();
	}

	/**
	 * Clears current value of the control. It is equivalent to "setValue(undefined)"
	 */
	clear(): void {
		this.setValue(undefined);
	}

	/**
	 * Checks that value of the control is correct or not and changes style of the control depends on the validation result
	 * @param value value to validate control by with
	 * @param suppressEvents true to suppress "afterValidate" event emission
	 * @returns true if validation is successed or false in case of failure
	 */
	validate(value?: T, suppressEvents?: boolean): boolean {
		this._validationMessages = [];
		if (value === undefined) {
			value = this.attrs.value;
		}
		if (this.isRequired() && (value === '' || value === undefined || value === null)) {
			this._validationMessages.push('Value is required');
		}
		m.redraw();
		this._validationStatus = this._validationMessages.length === 0;
		if (suppressEvents !== true) {
			(this.events as EventEmitter<EditorEventTypes<T>>).emit('afterValidate', this._validationStatus, this._validationMessages);
		}
		return this._validationStatus;
	}

	view(): m.Children | m.Vnode<unknown, unknown> {
		const label = this._getLabel();
		const description = this._getDescription();
		return m('div.webcraft_editor', 			
			this._getEditorAttrs({
				key: this.getId(),
				oncreate: (vnode) => { this.editorNode = vnode.dom as HTMLElement; },
				onupdate: (vnode) => { this.editorNode = vnode.dom as HTMLElement; },
				onfocusin: () => {
					this._setFocus(true);
				},
				onfocusout: () => {
					this._setFocus(false);
				},
				onmouseover: (e: PointerEvent) => { (this.events as EventEmitter<EditorEventTypes<T>>).emit('mouseover', e); },
				onmouseout: (e: PointerEvent) => { (this.events as EventEmitter<EditorEventTypes<T>>).emit('mouseout', e); },
				className: classNames(
					this._focused ? 'webcraft_editor--focused' : null,
					this.attrs.required ? 'webcraft_editor--required' : null,
					this.attrs.disabled ? 'webcraft_editor--disabled' : null,
					this._validationStatus === true ? 'webcraft_editor--success' : null,
					this._validationStatus === false ? 'webcraft_editor--danger' : null,
				),
				style: {
					...this._getSizes(),
				},
			}), [
				m('label.webcraft_editor_label', { for: this.getId() }, label.text),
				m('div.webcraft_control_wrapper', [
					this.attrs.icon ? m('div.webcraft_editor_icon', m('span', { className: this.attrs.icon })) : null,
					m('div.webcraft_editor_content', this._getEditorContentAttrs({}), this.controlView()),
					this._getButtons().map(item => item.view()),
				]),
				description ? m('div.webcraft_editor_desc', description) : null,
			]);
	}

	protected _setEditingValue(value?: string): void {
		this._editingValue = value;
	}

	protected _getButtons(): Button[] {
		const showClearButton = (this._editingValue !== undefined && this._editingValue !== '' || this.getValue() !== undefined) && (this.attrs.showClearButton ?? getGlobalConfig().editor?.showClearButton);
		return [
			...(showClearButton && !this.isDisabled() && this._focused ? [this._btnClear] : []),
		];
	}

	protected abstract controlView(): m.Children | m.Vnode<unknown, unknown>;

	protected _getEditorContentAttrs(attrs: m.Attributes): m.Attributes {
		return attrs;
	}

	protected _getEditorAttrs(attrs: m.Attributes): m.Attributes {
		return attrs;
	}

	private _getSizes(): Record<string, string |  number> {
		const style: Record<string, string | number> = {
			...(this.attrs.sizes || {})
		};
		['width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight'].forEach(type => {
			if (typeof style[type] === 'number') {
				style[type] += 'px';
			}
		});

		return style;
	}

	private _getDescription(): string | undefined {
		if (this._validationMessages.length) {
			return this._validationMessages[0];
		}
		return this.attrs.description;
	}


	private _getLabel(): LabelAttributes {
		if (typeof this.attrs.label === 'object') {
			return this.attrs.label;
		} else if (typeof this.attrs.label === 'string') {
			return {
				text: this.attrs.label,
			};
		} else {
			return {};
		}
	}

	protected _setFocus(focus: boolean): void {
		if (focus === false && this.editorNode?.contains(document.activeElement)) {
			return;
		}
		this._focused = focus;
		if (!this._focused) {
			this._setEditingValue(undefined);
		}
		m.redraw();
	}
}