import m from 'mithril';
import { Progress } from '../box/Progress';
import { ValidEventTypes } from '../event-emitter/EventEmitter';
import { Component, ComponentAttributes } from './Component';
import { FlexAlignment, FlexJustification } from './Types';
import classNames from 'classnames';
import { Toast } from '../messages/Toast';
import { Message, MessageAttributes } from '../messages/Message';
import { Window, WindowAttributes } from '../window/Window';
import { Popup, PopupAttrs } from '../popup/Popup';

export type ContainerAttributes = ComponentAttributes & {
	content?: string;

	justify?: FlexJustification;

	align?: FlexAlignment;
};

declare type ContentType = string | Component<ComponentAttributes, ValidEventTypes>;

export abstract class Container<A extends ContainerAttributes, E extends ValidEventTypes> extends Component<A, E> {
	protected content?: ContentType;
	progress: Progress;
	toast: Toast;
	messages: Message[];
	popups: Popup[];
	windows: Window[];

	constructor(attrs?: A) {
		super(attrs);
		this.progress = new Progress();
		this.toast = new Toast(undefined, this);
		this.messages = [];
		this.popups = [];
		this.windows = [];
		if (attrs?.content) {
			this.attach(attrs.content);
		}
	}

	attach(content: ContentType) {
		this.content = content;
	}

	getContent(): ContentType | undefined {
		return this.content;
	}

	createPopup(config: PopupAttrs): Popup {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const Popup = require('../popup/Popup').Popup;
		const popup = new Popup(config);
		popup.events.on('afterHide', () => {
			const index = this.popups.findIndex(item => item === popup);
			if (index > -1) {
				this.popups.splice(index, 1);
			}
		});
		this.popups.push(popup);
		return popup;
	}

	createMessage(config: MessageAttributes): Message {
		const message = new Message(config, this);
		message.events.on('afterHide', () => {
			const index = this.messages.findIndex(item => item === message);
			if (index > -1) {
				this.messages.splice(index, 1);
			}
		});
		this.messages.push(message);
		return message;
	}

	createWindow(config: WindowAttributes): Window {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const Window = require('../window/Window').Window;
		const window = new Window(config, this);
		window.events.on('afterHide', () => {
			const index = this.windows.findIndex(item => item === window);
			if (index > -1) {
				this.windows.splice(index, 1);
			}
		});
		this.windows.push(window);
		return window;
	}

	protected _getChildren(): m.Children {
		if (this.content instanceof Component) {
			return this.content.view();
		}

		return this.content;
	}

	protected _getView({ className, ...attrs }: m.Attributes): m.Vnode<unknown, unknown> {
		return m('div.webcraft_container', {
			className: classNames([
				className,
				this.attrs.justify ? `webcraft_flex--justify-${this.attrs.justify}` : null,
				this.attrs.align ? `webcraft_flex--align-${this.attrs.align ?? 'start'}` : null,
			]),
			...attrs,
		}, [
			this.progress.isActive() ? this.progress.view() : null, 
			this._getChildren(),
			this.toast.view(),
			this.popups.map(item => (item as Popup).view()).filter(Boolean),
			this.windows.map(item => (item as Window).view()).filter(Boolean),
			this.messages.map(item => item.view()).filter(Boolean),
		].filter(Boolean).filter(item => !Array.isArray(item) || item.length));
	}	
}