import m from 'mithril';
import { Component, ComponentAttributes } from '../common/Component';
import { ValidEventTypes } from '../event-emitter/EventEmitter';
import { Color, IdType } from '../common/Types';

import './toast.style.css';
import classNames from 'classnames';
import { Button } from '../controls/button/Button';
import { Container, ContainerAttributes } from '../common/Container';

export declare type ToastMessageAttributes = ComponentAttributes & {
	title?: string;
	text?: string;
	icon?: string;
	expirationMs?: number;
	color?: Color;
};

class ToastMessage extends Component<ToastMessageAttributes, ValidEventTypes> {
	private width = 100;
	private startTime?: number;
	private _isActive = false;
	private toast: Toast;
	private _closeBtn?: Button;
	private dom?: HTMLElement;

	constructor(attrs: ToastMessageAttributes, toast: Toast) {
		super(attrs);
		this.toast = toast;
		this._createCloseBtn();
	}

	hasExpirationTime(): boolean {
		return Boolean(this.attrs.expirationMs);
	}

	run(): void {
		if (!this.hasExpirationTime()) {
			throw new Error('Cannot run message without expiration time');
		}

		this._isActive = true;
		this.toast.runDrawing();
	}

	reset(): void {
		this.startTime = Date.now();
		this.width = 100;
	}

	stop(): void {
		this._isActive = false;
	}

	isActive(): boolean {
		return this._isActive;
	}

	isExpired(): boolean {
		return this.width <= 0;
	}

	getColor(): Color {
		return this.attrs.color || 'primary';
	}

	remove(): void {
		this.toast.remove(this.getId());
	}

	computeWidth(): void {
		if (!this._isActive) {
			return;
		}

		if (!this.startTime) {
			this.reset();
		}

		if (!this.startTime || !this.attrs.expirationMs) {
			return;
		}

		this.width = 100 - (((Date.now() - this.startTime) / this.attrs.expirationMs) * 100);

		if (this.dom) {
			this.dom.style.width = `${this.width}%`;
		}
	}

	view(): m.Vnode<unknown, unknown> {
		const getEvents = () => {
			if (!this.hasExpirationTime()) {
				return {};
			}

			return {
				onmouseover: () => {
					this.stop();
					this.reset();
					m.redraw();
				},
				onmouseout: () => {
					this.run();
				},
			};
		};

		return m('div.webcraft_toast_message', {
			className: classNames(
				`webcraft_toast_message--${this.getColor()}`,
			),
			...getEvents(),
		},
		[
			m('div.webcraft_toast_message_content', [
				this.attrs.icon ? m('div', m('span', {className: classNames(this.attrs.icon, 'webcraft_toast_message_icon')}, '')) : null,
				m('div', {style: {flex: 1}}, [
					this.attrs.title ? m('div', {className: 'webcraft_toast_message_title'}, this.attrs.title) : null,
					m('div.webcraft_toast_message_text', this.attrs.text),
				]),
				m('div', this._closeBtn?.view()),
			]),
			this.attrs.expirationMs
				? m('div.webcraft_toast_message_progress', {
					oncreate: (vnode) => {
						this.dom = vnode.dom as HTMLElement;
					},
					onupdate: (vnode) => {
						this.dom = vnode.dom as HTMLElement;
					},
					style: {
						width: `${this.width}%`,
					},
				}, '') : null,
		]);
	}

	private _createCloseBtn(): void {
		this._closeBtn = new Button({
			icon: 'mdi mdi-close',
			color: this.getColor(),
			round: true,
			style: 'plain',
			size: 'small',
		});
		this._closeBtn.events.on('click', () => {
			this.remove();
		});
	}

}
export class Toast extends Component<ComponentAttributes, ValidEventTypes> {
	private _messages: ToastMessage[] = [];
	private _isDrawing = false;
	protected modal = true;

	constructor(attrs?: ComponentAttributes, private container?: Container<ContainerAttributes, ValidEventTypes>) {
		super(attrs);
	}

	runDrawing(): void {
		if (this._isDrawing) {
			return;
		}

		this._isDrawing = true;
		const draw = () => {
			this._messages.filter(msg => msg.hasExpirationTime() && msg.isActive()).forEach((msg => {
				msg.computeWidth();
				if (msg.isExpired()) {
					msg.remove();
				}
			}));
			if (this._messages.filter(msg => msg.hasExpirationTime() && msg.isActive()).length) {
				requestAnimationFrame(() => {
					draw();
				});
			} else {
				this._isDrawing = false;
			}
		};

		requestAnimationFrame(() => {
			draw();
		});
	}

	show(config: ToastMessageAttributes) {
		const message = new ToastMessage(config, this);
		this._messages.unshift(message);
		if (message.hasExpirationTime()) {
			message.run();
		}

		if (!this.container) {
			this.mount();
		}
		this.runDrawing();
		m.redraw();
	}

	remove(id: IdType): void {
		const index = this._messages.findIndex(msg => msg.getId() === id);
		if (index > -1) {
			this._messages.splice(index, 1);
		}
		if (this._messages.length === 0 && !this.container) {
			this.unmount();
		}
		m.redraw();
	}

	view(): m.Children {
		if (this._messages.length === 0) {
			return null;
		}
		return m('div.webcraft_toast', this._messages.map(item => item.view()));
	}

}