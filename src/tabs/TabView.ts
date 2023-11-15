import m from 'mithril';
import { Container, ContainerAttributes } from '../common/Container';
import { Button } from '../controls/button/Button';
import { Tabs } from '..//tabs/Tabs';
import classNames from 'classnames';
import { Tooltip, TooltipAttrs } from '../messages/Tooltip';

declare type TabViewEventsType = {
	mouseover: (e: PointerEvent) => void;
	mouseout: (e: PointerEvent) => void;
}

export declare type TabViewAttributes = ContainerAttributes & {
	header?: string;
	disabled?: boolean;
	tooltip?: TooltipAttrs;
	icon?: string;
	closable?: boolean;
};

export class TabView extends Container<TabViewAttributes, TabViewEventsType> {
	private _parent: Tabs;
	private _btnClose: Button;

	constructor(attrs: TabViewAttributes, parent: Tabs) {
		super(attrs);
		this._parent = parent;

		this._btnClose = new Button({
			text: 'X',
			style: 'plain',
			size: 'small',
			color: 'secondary',
			classNames: 'webcraft_tabview_btn_close',
			events: {
				click: () => { this.close(); }
			}
		});

		this.events.on('mouseover', (e) => {
			if (this.attrs.tooltip) {
				const tooltipHide = Tooltip.show(this.attrs.tooltip, e);
				this.events.once('mouseout', () => { tooltipHide(); });
			}
		});
	}

	isDisabled(): boolean {
		return Boolean(this.attrs.disabled);
	}

	enable(): void {
		this.attrs.disabled = false;

		m.redraw();
	}

	disable(): void {
		this.attrs.disabled = true;

		m.redraw();
	}

	isActive(): boolean {
		return this._parent.getActiveTabView()?.getId() === this.getId();
	}

	setActive(): void {
		this._parent.setActive(this.getId());
	}

	close(): void {
		this._parent.close(this.getId());
	}

	viewHeader(): m.Vnode<unknown, unknown> {
		return m('div.webcraft_tabview_header', {
			className: classNames([
				this.isActive() ? 'webcraft_tabview_header--active' : null,
				this.isDisabled() ? 'webcraft_tabview_header--disabled' : null,
			]),
			onclick: () => { 
				if (!this.isDisabled()) {
					this.setActive();
				}				
			},
			onmouseover: (e: PointerEvent) => { this.events.emit('mouseover', e); },
			onmouseout: (e: PointerEvent) => { this.events.emit('mouseout', e); },
		}, [
			this.attrs.icon ? m('i.webcraft_tabview_header_icon', { key: `${this.getId()}-icon`, className: this.attrs.icon, style: {
				marginRight: this.attrs.header ? 'var(--webcraft-space)' : null,
			} }) : null,
			this.attrs.header ? m('span.webcraft_tabview_header_text', { key: `${this.getId()}-header`}, this.attrs.header) : null,
			this.attrs.closable && !this.isDisabled() ? this._btnClose.view() : null,
		].filter(Boolean));
	}

	view(): m.Vnode<unknown, unknown> {
		return this._getView({
			className: 'webcraft_tabview',
		});
	}

}