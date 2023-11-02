import { generateId } from '../common/Tools';
import { IData, IdType } from '../common/Types';
import { EventEmitter, ValidEventTypes } from '../event-emitter/EventEmitter';
import m from 'mithril';
import { DataItemType } from './Types';

export class Data<T extends DataItemType> implements IData<T> {
	private _items?: T[];
	private _all: T[];
	events: EventEmitter<ValidEventTypes>;
	private _filters: Array<(value: T, index: number, array: T[]) => unknown> = [];

	constructor() {
		this._all = [];
		this.events = new EventEmitter(this);
	}

	getItemById(id: IdType): T | undefined {
		return this._all.find(item => item.id === id);
	}

	getItemByIndex(index: number): T | undefined {
		return this._getItems()[index];
	}

	clear(): void {
		this._all = [];
		delete this._items;
		m.redraw();
	}

	add(item: T): T {
		const { id, ...rest } = item;
		const x = {
			id: id ?? generateId(),
			...rest
		} as T;
		this._all.push(x);
		if (this._filters.length && this._filters.every(f => f(x, 0, [x]))) {
			this._items?.push(x);
		}
		return x;
	}

	load(items: T[]) {
		this.clear();
		const x = items.map(item => {
			const { id, ...rest } = item;

			return {
				id: id ?? generateId(),
				...rest,
			} as T;
		});

		this._all.push(...x);
		if (this._filters.length) {
			this._items = this._all.filter((z: T, index: number, array: T[]) => this._filters.every(f => f(z, index, array)));
		}
		this.events.emit('afterLoad');
		m.redraw();
	}

	async loadAsync(data: T[] | Promise<T[]>) {
		if (data instanceof Promise) {
			const items = await data;
			this.load(items);
		} else {
			this.load(data);
		}
	}

	getLength(): number {
		return this._getItems().length;
	}

	map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[] {
		return this._getItems().map<U>(callbackfn);
	}

	forEach<U>(callbackfn: (value: T, index: number, array: T[]) => U) {
		this._getItems().map<U>(callbackfn);
	}

	applyFilter(predicate: (value: T, index: number, array: T[]) => unknown): void {
		this._filters.push(predicate);
		this._items = this._getItems().filter(predicate);
	}

	clearFilters(): void {
		this._filters = [];
		delete this._items;
	}

	private _getItems(): T[] {
		if (this._items) {
			return this._items;
		}
		return this._all;
	}
}