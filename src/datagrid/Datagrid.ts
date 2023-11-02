import m from 'mithril';
import { Component, ComponentAttributes } from '../common/Component';
import { ValidEventTypes } from '../event-emitter/EventEmitter';
import { Data } from '../data/Data';
import { TemplateCallbackType, getTemplateFunction } from '../common/Template';

declare type DatagridEventTypes = ValidEventTypes;

export declare type DatagridAttributes = ComponentAttributes & {
	template?: TemplateCallbackType;
}

export class Datagrid extends Component<DatagridAttributes, DatagridEventTypes> {
	data = new Data();
	constructor(attrs: DatagridAttributes) {
		super(attrs);

		const d = [];
		for (let i = 0; i < 100; i++) {
			d.push({
				id: i,
			});
		}
		this.data.load(d);

	}
	
	view(): m.Vnode<unknown, unknown> {
		const template = getTemplateFunction(this.attrs.template, {
			className: 'webcraft_datagrid_item'
		});
		return m('div.webcraft_datagrid', this.data.map(template));
	}

}