import { IDataComponent, IdType } from '../common/Types';
import { DataItemType } from '../data/Types';
import { ValidEventTypes } from '../event-emitter/EventEmitter';

export declare type SelectionAttributes = {
	multiple?: boolean;
	selected?: IdType[];
}

export declare type SelectionEventTypes = ValidEventTypes & {
	afterSelect: (ids: IdType[]) => void;
	afterUnselect: (ids: IdType[]) => void;
}

export class Selection<T extends DataItemType> {
	private selectedItems: IdType[] = [];
	private readonly parent;
	private readonly attrs;

	constructor(parent: IDataComponent<T>, attrs?: SelectionAttributes) {
		this.parent = parent;
		this.attrs = attrs || {};
		this.setSelection(attrs?.selected);
	}

	getSelected(): IdType[] {
		return [ ...this.selectedItems ];
	}

	isMultipleMode(): boolean {
		return Boolean(this.attrs.multiple);
	}

	setMultipleMode(mode: boolean): void {
		let selected;
		if (mode === true && (selected = this.getSelected()).length > 1) {
			selected.slice(1).forEach(id => { this.unselect(id); });
		}
		this.attrs.multiple = mode;
	}

	unselect(id: IdType, suppressEvents?: boolean): void {
		const index = this.selectedItems.indexOf(id);
		if (index === -1) {
			return;
		}
		this.selectedItems.splice(index, 1);
		if (!suppressEvents) {
			this.parent.events.emit('afterUnselect', [id]);
		}
	}

	select(id: IdType, config?: {
		ctrlKey?: boolean;
	}, suppressEvents?: boolean): void {
		if (this.selectedItems.length > 0 && (!this.isMultipleMode() || !config?.ctrlKey)) {
			const itemsToUnselect = [ ...this.selectedItems ];
			itemsToUnselect.forEach(item => {
				this.unselect(item);
			});
		}
		this.selectedItems.push(id);
		if (!suppressEvents) {
			this.parent.events.emit('afterSelect', [id]);
		}
	}

	selectAll(): void {
		if (!this.isMultipleMode()) {
			throw new Error('Cannot select all items while multiple mode is set off');
		}
		const ids: IdType[] = [];
		this.parent.data.forEach(item => {
			this.select(item.id, { ctrlKey: true }, true);
			ids.push(item.id);
		});
		this.parent.events.emit('afterSelect', ids);
	}

	unselectAll(): void {
		const ids: IdType[] = [];
		this.parent.data.forEach(item => {
			this.unselect(item.id, true);
			ids.push(item.id);
		});
		this.parent.events.emit('afterUnselect', ids);
	}

	isSelected(id: IdType): boolean {
		return this.selectedItems.includes(id);
	}

	setSelection(selection?: IdType[]): void {
		if (selection) {
			this.selectedItems = [...selection];
		} else {
			this.selectedItems = [];
		}
	}
}