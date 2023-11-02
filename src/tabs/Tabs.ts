import m from 'mithril';
import { Component, ComponentAttributes } from '../common/Component';
import { ValidEventTypes } from '../event-emitter/EventEmitter';

import './tabs.style.css';
import { TabView, TabViewAttributes } from './TabView';
import { IdType } from '../common/Types';
import classNames from 'classnames';

declare type TabsEventTypes = ValidEventTypes;

declare type TabsSide = 'top' | 'bottom' | 'left' | 'right';

declare type TabsAttributes = ComponentAttributes & {
	items: TabViewAttributes[];
	activeTabView?: IdType;
	side?: TabsSide;
};

export class Tabs extends Component<TabsAttributes, TabsEventTypes> {
	private _tabs: TabView[];
	attrs: TabsAttributes;

	constructor(attrs: TabsAttributes) {
		super(attrs);
		this.attrs = attrs;
		this._tabs = [];
		attrs.items.forEach(item => {
			this.add(item);
		});
	}

	getSide(): TabsSide {
		return this.attrs.side || 'top';
	}

	setSide(side: TabsSide): void {
		this.attrs.side = side;

		m.redraw();
	}

	getTabView(id: IdType): TabView | undefined {
		return this._tabs.find(item => item.getId() === id);
	}

	getActiveTabView(): TabView | undefined {
		if (this.attrs.activeTabView) {
			return this.getTabView(this.attrs.activeTabView);
		}
		return this._tabs[0];
	}

	add(config: TabViewAttributes) {
		const tabView = new TabView(config, this);
		this._tabs.push(tabView);
		m.redraw();
		return tabView;
	}

	setActive(tabviewId: IdType): void {
		this.attrs.activeTabView = tabviewId;

		m.redraw();
	}

	view(): m.Vnode<unknown, unknown> {
		return m('div.webcraft_tabs', {
			className: classNames([
				`webcraft_tabs--${this.getSide()}`,
			])
		}, [
			m('div.webcraft_tabs_header', this._tabs.map(item => item.viewHeader())),
			this.getActiveTabView()?.view(),
		]);
	}

}