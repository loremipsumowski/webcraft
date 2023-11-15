import { Box } from '../box/Box';
import { generateId } from '../common/Tools';
import { IData, IDataComponent, IdType } from '../common/Types';
import { EventEmitter, ValidEventTypes } from '../event-emitter/EventEmitter';
import m from 'mithril';
import { TreeDataItemType } from './Types';

export class TreeData implements IData<TreeDataItemType> {
	private items: TreeDataItemType[];
	private itemsMap: Record<IdType, TreeDataItemType>;
	private itemsTopLevel: TreeDataItemType[];
	private itemsChildrenMap: Record<IdType, TreeDataItemType[]>;
	events: EventEmitter<ValidEventTypes>;
	parent: IDataComponent<TreeDataItemType>;

	constructor(parent: IDataComponent<TreeDataItemType>) {
		this.parent = parent;
		this.events = new EventEmitter(this);
		this.items = [];
		this.itemsMap = {};
		this.itemsTopLevel = [];
		this.itemsChildrenMap = {};
	}

	clear(): void {
		this.items = [];
		this.itemsMap = {};
		this.itemsTopLevel = [];
		this.itemsChildrenMap = {};
		m.redraw();
	}

	load(items: TreeDataItemType[]) {
		this.clear();
		this.items.push(...items);
		this.items.map(item => {
			const {id, ...rest} = item;
			return {
				id: id ?? generateId(),
				...rest,
			};
		}).forEach(item => {
			this.itemsMap[item.id] = item;
			if (item.parent) {
				if (!this.itemsChildrenMap[item.parent]) {
					this.itemsChildrenMap[item.parent] = [];
				}
				this.itemsChildrenMap[item.parent].push(item);
			} else {
				this.itemsTopLevel.push(item);
			}
		});
		this.events.emit('afterLoad');
		m.redraw();
	}

	async loadAsync(data: TreeDataItemType[] | Promise<TreeDataItemType[]>): Promise<void> {
		const progressOff = (this.parent.parent as Box)?.progress.on();
		if (data instanceof Promise) {
			const items = await data;
			this.load(items);
		} else {
			this.load(data);
		}
		progressOff?.();
		return Promise.resolve();
	}

	forEach<T>(callback: (value: TreeDataItemType, index: number, array: TreeDataItemType[]) => T) {
		return this.items.map(callback);
	}

	map<T>(callback: (value: TreeDataItemType, index: number, array: TreeDataItemType[]) => T): T[] {
		return this.items.map(callback);
	}
	
	getRootLevelItems(): TreeDataItemType[] {
		return this.itemsTopLevel;
	}

	getItemById(id: IdType): TreeDataItemType | undefined {
		return this.itemsMap[id];
	}

	getChildrenByParent(parentId: IdType): TreeDataItemType[] {
		return this.itemsChildrenMap[parentId] || [];
	}

	update(id: IdType, value: Partial<TreeDataItemType>): void {
		const item = this.getItemById(id);
		if (item) {
			Object.assign(item, value);
		}
		m.redraw();
	}
}