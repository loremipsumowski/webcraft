import m from 'mithril';

import './list.style.css';
import { Component, ComponentAttributes } from '../common/Component';
import { ValidEventTypes } from '../event-emitter/EventEmitter';
import { Data } from '../data/Data';
import { TemplateCallbackType, getTemplate } from '../common/Template';
import { Selection, SelectionAttributes } from '../selection/Selection';
import classNames from 'classnames';
import { DataItemType } from '../data/Types';

declare type ListAttributes = ComponentAttributes & {
	template?: TemplateCallbackType;
	selection?: SelectionAttributes;
}

export class List extends Component<ListAttributes, ValidEventTypes> {
	data: Data<DataItemType>;
	fitContainer: boolean = true;
	selection: Selection<DataItemType>;
	private _focusedIndex?: number;
	private _listNode?: HTMLElement;
	private _activeKeyboardNavigation: boolean = false;
	private _eventHandlers = {
		onKeyDown: (e: KeyboardEvent) => {
			if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
				e.preventDefault();
				const dataLength = this.data.getLength();
				if (this._focusedIndex === undefined) {
					this._focusedIndex = -1;
				}
	
				if (e.code === 'ArrowUp') this._focusedIndex--;
				else this._focusedIndex++;
	
				if (this._focusedIndex < 0) this._focusedIndex = 0;
				else if (this._focusedIndex > dataLength - 1) this._focusedIndex = dataLength - 1;
			}
			if (this._focusedIndex !== undefined && (e.code === 'Enter' || e.code === 'Space')) {
				e.preventDefault();
				const item = this.data.getItemByIndex(this._focusedIndex);
				if (!item) {
					return;
				}
				this.selection.select(item.id, { ctrlKey: e.code === 'Space' });
			}
			m.redraw();
		},
		onClick: (e: Event) => {
			const target = e.target as HTMLElement;
			if (this._listNode?.contains(target)) {
				return;
			}
			this.deactivateKeyboardNavigation();
		}
	};

	constructor(attrs?: ListAttributes, data?: Data<DataItemType>) {
		super(attrs);
		this.data = data || new Data();
		this.selection = new Selection(this, this.attrs.selection);
	}

	view(): m.Children | m.Vnode<unknown, unknown> {
		return m('div.webcraft_list_wrapper', {
			oncreate: (vnode) => { this._listNode = vnode.dom as HTMLElement; },
			onupdate: (vnode) => { this._listNode = vnode.dom as HTMLElement; },
		}, m('div.webcraft_list', this.data.getLength() ? this.data.map((item, index) => 
			getTemplate(item, this.attrs.template, {
				className: classNames(
					'webcraft_list_item',
					this.selection.isSelected(item.id) ? 'webcraft_list_item--selected': null,
					this._focusedIndex === index ? 'webcraft_list_item--focused' : null,
				),
				onclick: (e: PointerEvent) => {
					this._focusedIndex = index;
					if (this.selection.isSelected(item.id)) {
						this.selection.unselect(item.id);
					} else {
						this.selection.select(item.id, {
							ctrlKey: e.ctrlKey,
						});
					}					
				},
				onmouseover: () => {
					this._focusedIndex = index;
					m.redraw();
				}
			})
		) : 
			m('span.webcraft_text_no_data', 'There is no data to display' )),
		);
	}

	isActiveKeyboardNavigation(): boolean {
		return this._activeKeyboardNavigation;
	}

	activateKeyboardNavigation(): void {
		if (this.isActiveKeyboardNavigation()) {
			return;
		}
		this._activeKeyboardNavigation = true;
		setTimeout(() => {
			document.addEventListener('keydown', this._eventHandlers.onKeyDown);
			document.addEventListener('click', this._eventHandlers.onClick);
		}, 100);
	}

	deactivateKeyboardNavigation(): void {
		if (!this.isActiveKeyboardNavigation()) {
			return;
		}
		this._activeKeyboardNavigation = false;
		document.removeEventListener('keydown', this._eventHandlers.onKeyDown);
		document.removeEventListener('click', this._eventHandlers.onClick);
	}
}