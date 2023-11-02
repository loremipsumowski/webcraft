import m from 'mithril';
import classNames from 'classnames';

import { Component, ComponentAttributes } from '../common/Component';

import './toolbar.style.css';
import { ValidEventTypes } from '../event-emitter/EventEmitter';
import { FlexJustification, IdType } from '../common/Types';
import { Control, ControlAttributes, ControlEventTypes } from '../controls/common/Control';

export declare type ToolbarAttributes = ComponentAttributes & {
	classNames?: string | string[];
	items?: Control<ControlAttributes, ControlEventTypes>[];
	justify?: FlexJustification;
}

export class Toolbar extends Component<ToolbarAttributes, ValidEventTypes> {	
	constructor(attrs: ToolbarAttributes) {
		super(attrs);
		this.fitContainer = true;
	}

	getItem<T extends Control<ControlAttributes, ControlEventTypes>>(id: IdType): T | undefined {
		return this.getItems()?.find(item => item.getId() === id) as T;
	}

	addItem(item: Control<ControlAttributes, ControlEventTypes>, index?: number): void {
		if (!this.attrs.items) {
			this.attrs.items = [];
		}
		this.attrs.items.splice(index ?? this.attrs.items.length, 0, item);
		m.redraw();
	}

	view(): m.Vnode<unknown, unknown> {
		return m('div', {
			className: classNames([
				'webcraft_toolbar',
				this.attrs.justify ? `webcraft_flex--justify-${this.attrs.justify}` : null,
				this.attrs.classNames,
			]),
		}, this.getItems()?.map(item => item.view()).filter(Boolean));
	}

	getItems(): Control<ControlAttributes, ControlEventTypes>[] {
		return this.attrs.items || [];
	}
}