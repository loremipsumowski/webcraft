import m from 'mithril';
import { Color, IdType } from '../../common/Types';
import { Editor, EditorAttributes, EditorEventTypes } from '../Editor';
import { Button } from '../..';

import './toggle.style.css';

declare type ToggleAttributes = EditorAttributes<IdType> & {
	items: {
		id: IdType,
		text?: string;
		color?: Color;
		icon?: string;
	}[]
}

export class Toggle extends Editor<IdType, ToggleAttributes, EditorEventTypes<IdType>> {
	protected controlView(): m.Children | m.Vnode<unknown, unknown> {
		const value = this.getValue();
		return m('div.webcraft_toggle', this.attrs.items.map(item => new Button({
			disabled: this.isDisabled(),
			id: item.id,
			text: item.text,
			color: item.color ?? 'secondary',
			icon: item.icon,
			style: value === item.id ? 'filled' : 'plain',
			events: {
				click: () => {
					if (value === item.id) {
						this.setValue(undefined);
					} else {
						this.setValue(item.id);
					}
				}
			}
		}).view()));
	}

}