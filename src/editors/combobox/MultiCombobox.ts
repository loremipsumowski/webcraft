import m from 'mithril';
import classNames from 'classnames';
import { IdType } from '../../common/Types';
import { ComboboxAttributes, ComboboxBase, ComboboxDataItemType } from './ComboboxBase';
import { Button } from '../..';
import { generateId } from '../../common/Tools';

declare type MultiComboboxAttributes = ComboboxAttributes<IdType[]> & {
	showItemRemoveButton?: boolean;
	limit?: number;
	allowAddingOptions?: boolean;
}

export class MultiCombobox extends ComboboxBase<IdType[], MultiComboboxAttributes> {
	private _addOptionBtn: Button;
	constructor(attrs?: MultiComboboxAttributes) {
		super(attrs);
		this._list.selection.setMultipleMode(true);
		
		this._list.events.on('afterSelect', (ids) => {
			const value = this.getValue() || [];
			value.push(...ids);
			this.setValue(value);
			this.editorNode?.querySelector('input')?.focus();
		});

		this._addOptionBtn = new Button({
			text: 'Add option',
			hidden: this.attrs.allowAddingOptions !== true,
			disabled: true,
			events: {
				click: () => {
					if (this._editingValue) {
						this.addOption(this._editingValue);
					}
				}
			}
		});
		this._toolbar.addItem(this._addOptionBtn, 0);
	}

	addOption(value: string): void {
		const item = this.data.add({
			id: generateId(),
			value,
		});

		const v = this.getValue() || [];
		v.push(item.id);
		this.setValue(v);
	}

	getValue(): IdType[] | undefined {
		const value = super.getValue();
		if (value) {
			return [ ...value ];
		}
		return undefined;
	}

	validate(value?: IdType[]): boolean {
		if (value === undefined) {
			value = this.attrs.value;
		}
		if (value !== undefined && this.attrs.limit && value.length > this.attrs.limit) {
			this._validationMessages.push(`Max number of selected items is ${this.attrs.limit}`);
			this._validationStatus = false;
			return this._validationStatus;

		}
		return super.validate(value);
	}

	protected _getEditorAttrs(attrs: m.Attributes): m.Attributes {
		attrs.className = classNames(attrs.className, 'webcraft_combobox--multiple');
		return attrs;
	}

	protected _getListFilteringFunction(): undefined | ((value: ComboboxDataItemType, index?: number, array?: ComboboxDataItemType[]) => unknown) {
		const x: ((value: ComboboxDataItemType, index?: number, array?: ComboboxDataItemType[]) => unknown)[] = [];
		const superFunc = super._getListFilteringFunction();
		if (superFunc) {
			x.push(superFunc);
		}
		const value = this.getValue();
		if (value !== undefined) {
			x.push((v: ComboboxDataItemType) => !value.includes(v.id));
		}

		if (x.length) {
			return (item: ComboboxDataItemType) => x.every(f => f(item));
		}

		return undefined;
	}

	protected valueView(): m.Children | m.Vnode<unknown, unknown> {
		const value = this.getValue();
		if (!value) {
			return undefined;
		} 
		const valueArr = (value === undefined ? [] : Array.isArray(value) ? value : [value]).map(x => this.data.getItemById(x));
		return valueArr.map(item => m('div.webcraft_combobox_value', {
			onclick: () => {
				(this.editorNode?.querySelector('.webcraft_editor_control') as HTMLElement)?.focus();
			},
		}, [
			m('span', { key: `${this.getId()}-${item!.id}`, style: { marginRight: 'var(--webcraft-space)'} }, item!.value),
			this.isDisabled() || this.attrs.showItemRemoveButton === false ? m.fragment({key: `${this.getId()}-btn`}, []) : (new Button({
				id: `${this.getId()}-btn`,
				text: 'X',
				size: 'small',
				style: 'plain',
				color: 'secondary',
				events: {
					click: (e: PointerEvent) => {
						e.stopPropagation();
						this.setValue(valueArr.filter(x => x!.id !== item!.id).map(x => x!.id));
					}
				}
			}).view()),
		]));
	}

	protected controlView(): m.Children | m.Vnode<unknown, unknown> {
		return [
			this.valueView(),
			m('input.webcraft_editor_control', {
				id: this.getId(),
				placeholder: this.attrs.placeholder,
				disabled: this.attrs.disabled,
				readonly: this.attrs.readonly,
				value: this._editingValue,
				oninput: (e: KeyboardEvent) => {
					this._setEditingValue((e.target as HTMLInputElement).value);
					this._fixListView();
					this.showPopup();
				},
				onkeydown: (e: KeyboardEvent) => {
					if (e.key === 'Backspace' && !(e.target as HTMLInputElement).value) {
						const value = this.getValue();
						if (Array.isArray(value) && value?.length > 0) {
							value.splice(value.length - 1, 1);
							this.setValue(value);
						}
					}
				}
			}),
		];
	}

	protected _setEditingValue(value?: string | undefined): void {
		console.log(1);
		super._setEditingValue(value);
		this._addOptionBtn.setDisabled(!value?.length);
	}
}