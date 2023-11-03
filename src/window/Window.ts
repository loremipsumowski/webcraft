import m from 'mithril';
import { ValidEventTypes } from '../event-emitter/EventEmitter';
import { Container, ContainerAttributes } from '../common/Container';

import './window.style.css';
import { Button, Toolbar } from '..';
import classNames from 'classnames';
import { SizeType } from '../common/Types';
import { Space } from '../controls/space/Space';
import { Text } from '../controls/text/Text';

export declare type WindowAttributes = ContainerAttributes & {
	modal?: boolean;
	title?: string;
	width?: number;
	maximized?: boolean;
	sizes?: SizeType;
	hidden?: boolean;

};

declare type WindowEventsType = {
	afterHide: () => void;
};

export class Window extends Container<WindowAttributes, WindowEventsType> {
	protected modal = true;
	private header: Toolbar;

	constructor(attrs?: WindowAttributes, private container?: Container<ContainerAttributes, ValidEventTypes>) {
		super(attrs as WindowAttributes);
		this.header = new Toolbar({
			classNames: 'webcraft_window_header',
			items: [
				new Text({ id: 'title', value: this.attrs.title, classNames: 'webcraft_window_header_title' }),
				new Space({ id: 'space' }),
				new Button({ style: 'plain', color: 'secondary', icon: 'icon-window-minimize', size: 'small', tooltip: 'Minimize' }),
				new Button({ id: 'restore', style: 'plain', color: 'secondary', icon: 'icon-window-restore', size: 'small', tooltip: 'Restore' }),
				new Button({ id: 'maximize', style: 'plain', color: 'secondary', icon: 'icon-window-maximize', size: 'small', tooltip: 'Maximize' }),
				new Button({ id: 'hide', style: 'plain', color: 'secondary', icon: 'icon-cancel', size: 'small', tooltip: 'Hide' }),
			],
		});
		this.header.events.on('click', (id) => {
			switch(id) {
			case 'restore': {
				this.restore();
				break;
			}
			case 'maximize': {
				this.maximize();
				break;
			}
			case 'hide': {
				this.hide();
				break;
			}
			}
		});
		this.header.events.on('dblclick', (id) => {
			switch(id) {
			case 'title':
			case 'space': {
				if (this.isMaximized()) {
					this.restore();
				} else {
					this.maximize();
				}
				break;
			}
			}
		});
		this._refreshHeaderButtons();
	}

	isHidden(): boolean {
		return Boolean(this.attrs.hidden);
	}

	hide(): void {
		this.attrs.hidden = true;
		if (!this.container) {
			this.unmount();
		}
		this.events.emit('afterHide');
	}

	show(): void {
		this.attrs.hidden = false;
		if (!this.container) {
			this.mount();
		}
	}

	restore(): void {
		this.attrs.maximized = false;
		this._refreshHeaderButtons();
		m.redraw();
	}

	maximize(): void {
		this.attrs.maximized = true;
		this._refreshHeaderButtons();
		m.redraw();
	}

	isMaximized(): boolean {
		return Boolean(this.attrs.maximized);
	}

	view(): m.Children | m.Vnode<unknown, unknown> {
		if (this.isHidden()) {
			return null;
		}
		return m('div.webcraft_modal_wrapper', {
			className: classNames(this.attrs.modal !== false ? 'webcraft_modal_wrapper--modal' : null)
		}, m('div.webcraft_window', {
			className: classNames(
				this.attrs.maximized ? 'webcraft_window--maximized' : null,
			),
			style: {
				...this._getSizes(),
			},
		}, [
			this.header.view(),
			this._getView({
				className: 'webcraft_window_content',
			}),
		]));
	}

	private _refreshHeaderButtons(): void {
		if (this.isMaximized()) {
			this.header.getItem('maximize')?.hide();
			this.header.getItem('restore')?.show();
		} else {
			this.header.getItem('maximize')?.show();
			this.header.getItem('restore')?.hide();
		}
	}

	private _getSizes(): Record<string, string |  number> {
		const style: Record<string, string | number> = {
			...(this.attrs.sizes || {})
		};
		if (style.width === undefined) {
			style.width = '50%';
		}
		if (style.height === undefined) {
			style.height = '50%';
		}
		['width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight'].forEach(type => {
			if (typeof style[type] === 'number') {
				style[type] += 'px';
			}
		});

		return style;
	}

}