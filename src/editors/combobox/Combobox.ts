import m from 'mithril';
import { IdType } from '../../common/Types';
import { ComboboxAttributes, ComboboxBase } from './ComboboxBase';

export class Combobox extends ComboboxBase<IdType, ComboboxAttributes<IdType>> {
	constructor(attrs?: ComboboxAttributes<IdType>) {
		super(attrs);

		this._popupBox.getContainer('box_toolbar')?.setHidden(true);
		this._list.events.on('afterSelect', (ids) => {
			this.setValue(ids[0]);
			this.editorNode?.querySelector('input')?.focus();
		});
	}

	protected controlView(): m.Children | m.Vnode<unknown, unknown> {
		const value = this.getValue();
		const item = value !== undefined ? this.data.getItemById(value) : undefined;
		return [
			m('input.webcraft_editor_control', {
				id: this.getId(),
				placeholder: this.attrs.placeholder,
				disabled: this.attrs.disabled,
				readonly: this.attrs.readonly,
				value: this._editingValue ?? item?.value,
				oninput: (e: KeyboardEvent) => {
					this._setEditingValue((e.target as HTMLInputElement).value);
					this._fixListView();
					this.showPopup();
				}
			}),
		];
	}

}