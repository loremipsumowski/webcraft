import m from 'mithril';

import { Editor, EditorAttributes, EditorEventTypes } from '../Editor';
import classNames from 'classnames';
import { Popup } from '../../popup/Popup';
import { List } from '../../list/List';
import { Box, Button, Toolbar } from '../..';
import { Data } from '../../data/Data';
import { TemplateResultType } from '../../common/Template';
import { Space } from '../../controls/space/Space';
import { DataItemType } from '../../data/Types';

import './combobox.style.css';
import { escapeRegExp } from '../../tools/Tools';
import { IdType } from '../../common/Types';

export declare type ComboboxAttributes<T> = EditorAttributes<T> & {
	placeholder?: string;
	readonly?: boolean;
	autoHidePopup?: boolean;
}

export declare type ComboboxDataItemType = DataItemType & {
	value?: string;
}

export abstract class ComboboxBase<T, A extends ComboboxAttributes<T>> extends Editor<T, A, EditorEventTypes<T>> {
	protected _popup: Popup;
	protected _list: List;
	protected _popupBox: Box;
	protected _toolbar: Toolbar;
	private _dropDownButton: Button;
	protected _editingValue?: string;
	data: Data<ComboboxDataItemType>;

	constructor(attrs?: A) {
		super(attrs);
		this.data = new Data();
		this._dropDownButton = new Button({
			color: 'secondary',
			icon: 'icon-down-open',
			size: 'small',
			style: 'plain',
			events: {
				click: () => {
					this.showPopup();
				},
			}
		});
		
		this._list = new List({
			template: (item) => this._itemTemplate(item),
		}, this.data);

		this._popup = new Popup({
			events: {
				afterHide: () => {
					this._setFocus(false);
					this._dropDownButton.setIcon('icon-down-open');
					this._list.deactivateKeyboardNavigation();
				},
				afterShow: () => {
					this._dropDownButton.setIcon('icon-up-open');
				},
			}
		});		

		this._toolbar = new Toolbar({
			items: [
				new Space(),
				new Button({
					text: 'Select all',
					style: 'plain',
					events: {
						click: () => {
							this._list.selection.selectAll();
						}
					}
				}),
			]
		});

		this._popupBox = new Box({
			sizes: {
				maxHeight: 400,
			},
			content: [
				{
					flex: '1 1 content',
					content: this._list,
				},
				{
					id: 'box_toolbar',
					flex: '0 0 content',
					content: this._toolbar,
				},
			]
		});
		this._popup.attach(this._popupBox);
	}

	setValue(value?: T | undefined): void {
		super.setValue(value);
		if (this.attrs.autoHidePopup !== false) {
			this._popup.hide();
		}
		this._fixListView();
	}

	showPopup(): void {
		if (this.isDisabled()) {
			return;
		}
		if (!this.editorNode) {
			throw new Error('Cannot show popup on unmounted component');
		}
		this._popup.show(this.editorNode, {
			width: this.editorNode.offsetWidth,
		});

		this._list.activateKeyboardNavigation();
		this.editorNode.querySelector('input')?.focus();
	}

	setDisabled(disabled: boolean): boolean {
		if (super.setDisabled(disabled)) {
			this._dropDownButton.setDisabled(disabled);
			return true;
		} else {
			return false;
		}		
	}

	protected _fixListView(): void {
		const value = this.getValue();
		if (value === undefined) {
			this._list.selection.setSelection(undefined);
		} else if (Array.isArray(value)) {
			this._list.selection.setSelection(value);
		} else {
			this._list.selection.setSelection([value as IdType]);
		}
		const filteringFunction = this._getListFilteringFunction();
		this.data.clearFilters();
		if (filteringFunction) {
			this.data.applyFilter(filteringFunction);
		}
	}

	
	protected _itemTemplate(item: Record<string, unknown>): TemplateResultType {
		return String(item.value);
	}

	protected _getEditorAttrs(attrs: m.Attributes): m.Attributes {
		attrs.className = classNames(attrs.className, 'webcraft_combobox');
		return attrs;
	}

	protected _getEditorContentAttrs(attrs: m.Attributes): m.Attributes {
		return Object.assign({			
			onclick: () => {
				this.showPopup();
			}
		}, attrs);
	}

	protected _getButtons(): Button[] {
		return [
			...super._getButtons(),
			...(!this.isDisabled() ? [this._dropDownButton] : []),
		];
	}

	protected _setFocus(focus: boolean): void {
		if (focus === false && this._popup.isHidden() === false) {
			return;
		}
		super._setFocus(focus);
	}

	protected _getListFilteringFunction(): undefined | ((value: ComboboxDataItemType, index?: number, array?: ComboboxDataItemType[]) => unknown) {
		const x: ((value: ComboboxDataItemType, index?: number, array?: ComboboxDataItemType[]) => unknown)[] = [];
		if (this._editingValue) {
			const regexp = new RegExp(escapeRegExp(this._editingValue), 'gmi');
			x.push((item: ComboboxDataItemType) => item.value?.match(regexp));
		}

		if (x.length) {
			return (item: ComboboxDataItemType) => x.every(f => f(item));
		}

		return undefined;
	}
}