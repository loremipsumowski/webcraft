import m from 'mithril';
import { IdType } from './Types';
import { generateId } from './Tools';
import { EventEmitter, ValidEventTypes } from '../event-emitter/EventEmitter';

declare type ViewType = {
	view: () => m.Vnode<unknown, unknown> | m.Children;
}

export declare type ComponentAttributes = {
	id?: IdType;
	events?: ValidEventTypes;
}

export abstract class Component<A extends ComponentAttributes, E extends ValidEventTypes> implements ViewType {
	private readonly id: IdType;
	protected readonly attrs: A;
	protected node?: HTMLElement;
	protected modal = false;

	events: EventEmitter<E>;
	fitContainer: boolean = false;
	parent?: Component<ComponentAttributes, ValidEventTypes>;

	constructor(attrs?: A) {
		this.attrs = attrs || {} as A;
		this.id = this.attrs.id || generateId();
		this.events = new EventEmitter(this);
		if (this.attrs.events) {
			for (const name in this.attrs.events) {
				(this.events as EventEmitter<ValidEventTypes>).on(name, this.attrs.events[name]);
			}
		}
		
	}

	getId(): IdType { 
		return this.id;
	}

	mount(parentNode: HTMLElement = document.body): void {
		if (!this.node) {
			this.node = document.createElement('div');
			this.node.classList.add('webcraft');
			if (this.modal) {
				this.node.classList.add('webcraft--modal');
			}
		}
		m.mount(this.node, {
			view: () => this.view(),
			oncreate: () => {
				parentNode.appendChild(this.node!);
			},
			onremove: () => {
				parentNode.removeChild(this.node!);
			},
		});
	}

	unmount() {
		if (this.node) {
			m.mount(this.node, null);
		}
	}

	abstract view(): m.Vnode<unknown, unknown> | m.Children;
}