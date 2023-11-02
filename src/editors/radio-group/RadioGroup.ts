import m from 'mithril';

import { Editor, EditorAttributes, EditorEventTypes } from '../Editor';
import { IdType } from '../../common/Types';
import classNames from 'classnames';

import './radioGroup.style.css';

declare type RadioItemType = {
	id: IdType;
	label?: string;
	disabled?: boolean;
};

declare type RadioGroupAttributes = EditorAttributes<IdType> & {
	items: RadioItemType[];
	direction?: 'column' | 'row';
};

export class RadioGroup extends Editor<IdType, RadioGroupAttributes, EditorEventTypes<IdType>> {
	getDirection(): 'column' | 'row' {
		return this.attrs.direction || 'column';
	}

	protected controlView(): m.Children | m.Vnode<unknown, unknown> {		
		const value = this.getValue();
		return this.attrs.items.map(item => m('div.webcraft_radio_item', {
			className: classNames(
				this.isDisabled() || item.disabled ? 'webcraft_radio--disabled' : null,
			)
		}, [
			m('div.webcraft_radio', {
				className: classNames(
					value === item.id ? 'webcraft_radio--checked' : null,
				),
				onclick: () => {
					if (!this.isDisabled() && !item.disabled) {
						this.setValue(item.id);
					}
				}
			}, [
				m('input', {
					type: 'radio',
					disabled: this.isDisabled() || item.disabled,
					required: this.isRequired(),
					name: this.getId(),
					id: item.id,
				}),
			]),
			m('label', {
				for: item.id,
			}, item.label),
		]));
	}

	protected _getEditorAttrs(attrs: m.Attributes): m.Attributes {
		attrs.className = classNames(attrs.className, 'webcraft_radiogroup', `webcraft_radiogroup--${this.getDirection()}`);
		return attrs;
	}
}