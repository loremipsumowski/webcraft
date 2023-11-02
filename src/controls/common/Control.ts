import m from 'mithril';
import { Component, ComponentAttributes } from '../../common/Component';
import { ValidEventTypes } from '../../event-emitter/EventEmitter';
import { TooltipAttrs } from '../../messages/Tooltip';

export function getControlEvents(control: Component<ComponentAttributes, ControlEventTypes>) {
	return {
		onclick: (e: PointerEvent) => {
			control.events.emit('click', e);
		},
		ondblclick: (e: PointerEvent) => {
			control.events.emit('dblclick', e);
		},
		onmouseover: (e: PointerEvent) => {
			control.events.emit('mouseover', e);
		},
		onmouseout: (e: PointerEvent) => {
			control.events.emit('mouseout', e);
		},
		onmousedown: (e: PointerEvent) => {
			control.events.emit('mousedown', e);
		},
		onmouseup: (e: PointerEvent) => {
			control.events.emit('mouseup', e);
		},
	};
}

export type ControlAttributes = ComponentAttributes & {
	classNames?: string | string[];
	tooltip?: TooltipAttrs;
	hidden?: boolean;
}

export type ControlEventTypes = ValidEventTypes & {
	click: (e: PointerEvent) => void;
	dblclick: (e: PointerEvent) => void;
	mouseover: (e: PointerEvent) => void;
	mouseout: (e: PointerEvent) => void;
};

export abstract class Control<A extends ControlAttributes, E extends ControlEventTypes> extends Component<A, E> {
	show(): void {
		this.attrs.hidden = false;
		m.redraw();
	}

	hide(): void {
		this.attrs.hidden = true;
		m.redraw();
	}

	isHidden(): boolean {
		return Boolean(this.attrs.hidden);
	}

	constructor(attrs?: A) {
		super(attrs);

		this.events.on('mouseover', (e) => {
			if (this.attrs.tooltip) {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const Tooltip = require('../../messages/Tooltip').Tooltip;
				const tooltipHide = Tooltip.show(this.attrs.tooltip, e.target as HTMLElement);
				this.events.once('mouseout', () => { tooltipHide(); });
			}
		});
	}
}