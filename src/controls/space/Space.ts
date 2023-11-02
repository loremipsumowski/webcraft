import m from 'mithril';

import { getControlEvents } from '../common/Control';
import { Control, ControlAttributes, ControlEventTypes } from '../common/Control';
import classNames from 'classnames';

import './space.style.css';

export class Space extends Control<ControlAttributes, ControlEventTypes> {	
	view(): m.Vnode<unknown, unknown> | m.Children {
		if (this.isHidden()) {
			return null;
		}
		return m('div.webcraft_space', {
			key: this.getId(),
			...getControlEvents(this),
			className: classNames([
				this.attrs.classNames
			])
		});
	}

}