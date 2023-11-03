import m from 'mithril';
import classNames from 'classnames';

import { getControlEvents } from '../common/Control';
import { Control, ControlAttributes, ControlEventTypes } from '../common/Control';
import { Color } from '../../common/Types';

import './button.style.css';

declare type ButtonStyle = 'plain' | 'filled';
declare type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonAttributes = ControlAttributes & {
	text?: string;
	color?: Color;
	style?: ButtonStyle;
	size?: ButtonSize;
	disabled?: boolean;
	round?: boolean;
	icon?: string;

};

declare type ButtonEventTypes = ControlEventTypes;

export class Button extends Control<ButtonAttributes, ButtonEventTypes> {

	getColor(): Color {
		return this.attrs.color || 'primary';
	}

	getStyle(): ButtonStyle {
		return this.attrs.style ?? 'filled';
	}

	getSize(): ButtonSize {
		return this.attrs.size ?? 'medium';
	}

	isDisabled(): boolean {
		return Boolean(this.attrs.disabled);
	}
	
	setDisabled(disabled: boolean): boolean {
		if (this.attrs.disabled === disabled) {
			return false;
		}
		this.attrs.disabled = disabled;
		m.redraw();
		return true;
	}

	getText(): string | undefined {
		return this.attrs.text;
	}

	setText(text: string | undefined) {
		this.attrs.text = text;
		m.redraw();
	}

	getIcon(): string | undefined {
		return this.attrs.icon;
	}

	setIcon(icon: string | undefined) {
		this.attrs.icon = icon;
		m.redraw();
	}

	view(): m.Vnode<unknown, unknown> | m.Children {
		if (this.isHidden()) {
			return null;
		}
		const text = this.getText();
		const icon = this.getIcon();
		return m('button.webcraft_button', {
			key: this.getId(),
			type: 'button',
			disabled: this.isDisabled(),
			className: classNames([
				`webcraft_button--${this.getColor()}`,
				`webcraft_button--${this.getStyle()}`,
				`webcraft_button--${this.getSize()}`,
				this.attrs.round ? 'webcraft_button--round' : null,
				this.attrs.classNames,
			]),
			...getControlEvents(this),	
		}, [
			icon && m('i.webcraft_button_icon', { className: icon, style: {
				marginRight: text ? 'var(--webcraft-space)' : null,
			} }),
			text && m('span.webcraft_button_text', text ),
		]);
	}

}