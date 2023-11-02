import m from 'mithril';
import { Component, ComponentAttributes } from '../common/Component';
import { ValidEventTypes } from '../event-emitter/EventEmitter';

import './message.style.css';
import { Color } from '../common/Types';
import classNames from 'classnames';
import { Toolbar } from '..';
import { Button } from '../controls/button/Button';
import { Container, ContainerAttributes } from '../common/Container';

export declare type MessageAttributes = ComponentAttributes & {
	title?: string;
	text?: string;
	color?: Color;
	modal?: boolean;
	buttons?: Button[];
}

declare type MessageEventsType = ValidEventTypes & {
	afterHide: () => void;
};

export class Message extends Component<MessageAttributes, MessageEventsType> {
	private toolbar: Toolbar;
	protected modal = true;
	constructor(attrs?: MessageAttributes, private container?: Container<ContainerAttributes, ValidEventTypes>) {
		super(attrs);
		this.toolbar = new Toolbar({
			justify: 'center',
			classNames: 'webcraft_message_toolbar',
			items: this.attrs.buttons || [
				new Button({ id: 'btn_hide', text: 'OK', color: this.getColor() }),
			],
		});

		this.toolbar.events.on('click', () => {
			this.hide();
		});
	}

	hide(): void {
		if (!this.container) {
			this.unmount();
		}
		this.events.emit('afterHide');
	}

	show() {
		if (!this.container) {
			this.mount();
		}
	}

	getColor(): Color {
		return this.attrs.color || 'primary';
	}

	view(): m.Children | m.Vnode<unknown, unknown> {
		return m('div.webcraft_modal_wrapper', {
			className: classNames(this.attrs.modal !== false ? 'webcraft_modal_wrapper--modal' : null)
		}, m('div.webcraft_message', {
			className: classNames([
				`webcraft_message--${this.getColor()}`,
			])
		}, [
			m('div.webcraft_message_title', this.attrs.title),
			m('div.webcraft_message_content_wrapper', m('div.webcraft_message_content', this.attrs.text)),
			this.toolbar.view(),
		]));
	}
}
