import m from 'mithril';

import { ValidEventTypes } from '../../event-emitter/EventEmitter';
import { getControlEvents } from '../common/Control';
import { Control, ControlAttributes, ControlEventTypes } from '../common/Control';
import classNames from 'classnames';

export declare type TextAttributes = ControlAttributes & {
	value?: string;
};

declare type TextEventTypes = ValidEventTypes & ControlEventTypes;

export class Text extends Control<TextAttributes, TextEventTypes> {

	setValue(value: string): void {
		this.attrs.value = value;

		m.redraw();
	}
	
	view(): m.Vnode<unknown, unknown>  | m.Children{
		if (this.isHidden()) {
			return null;
		}
		return m('div.webcraft_text', {
			key: this.getId(),
			...getControlEvents(this),
			className: classNames([
				this.attrs.classNames
			])
		}, this.attrs.value);
	}

}