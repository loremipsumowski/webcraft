import m from 'mithril';

import { Editor, EditorAttributes, EditorEventTypes } from '../Editor';
import classNames from 'classnames';

export declare type InputTextAttributes = EditorAttributes<string> & {
	placeholder?: string;
}

export class InputText extends Editor<string, InputTextAttributes, EditorEventTypes<string>> {
	protected controlView(): m.Children | m.Vnode<unknown, unknown> {
		return [
			m('input.webcraft_editor_control', {
				id: this.getId(),
				type: 'text',
				placeholder: this.attrs.placeholder,
				disabled: this.attrs.disabled,
				value: this._editingValue ?? this.attrs.value,
				onchange: (e: InputEvent) => {
					this.setValue((e.target as HTMLInputElement).value);
				},
				oninput: (e: InputEvent) => {
					const value = (e.target as HTMLInputElement).value;
					this._editingValue = value;
					this.validate(value);
				}
			}),
		];
	}

	protected _getEditorAttrs(attrs: m.Attributes): m.Attributes {
		attrs.className = classNames(attrs.className, 'webcraft_input');
		return attrs;
	}
}