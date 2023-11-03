import m from 'mithril';
import { Container, ContainerAttributes } from '../common/Container';

import './popup.style.css';
import { IFixedComponent } from '../common/Types';

declare type PopupSide = 'top' | 'right' | 'bottom' | 'left';

export declare type PopupAttrs = ContainerAttributes & {
	side?: PopupSide | PopupSide[];
	offset?: number;
	hidden?: boolean;
};

declare type PopupEventTypes =  {
	afterShow: () => void;
	afterHide: () => void;
};

declare type PopupPosition = {
	left?: number | `${number}px` | `${number}%`;
	top?: number | `${number}px` | `${number}%`;
	width?: number | `${number}px` | `${number}%`;
	height?: number | `${number}px` | `${number}%`;
	minWidth?: number | `${number}px` | `${number}%`;
	minHeight?: number | `${number}px` | `${number}%`;
	maxWidth?: number | `${number}px` | `${number}%`;
	maxHeight?: number | `${number}px` | `${number}%`;
};

export class Popup extends Container<PopupAttrs, PopupEventTypes> implements IFixedComponent {	
	protected modal = true;
	private target?: PointerEvent | HTMLElement;
	private position?: PopupPosition;

	hidePopup?: (e: MouseEvent) => void;
	_shape: {
		targetWidth: number,
		targetHeight: number,
		targetTop: number,
		targetLeft: number,
		top: number,
		left: number,
		width: number,
		height: number,
	} = {
			targetWidth: 0,
			targetHeight: 0,
			targetTop: 0,
			targetLeft: 0,
			top: 0,
			left: 0,
			width: 0,
			height: 0,
		};

	isHidden(): boolean {
		return Boolean(this.attrs.hidden);
	}

	hide(): void {
		this.attrs.hidden = true;
		this.unmount();
		if (this.hidePopup) {
			document.removeEventListener('click', this.hidePopup);
			delete this.hidePopup;
		}
		this.events.emit('afterHide');

	}

	show(target: PointerEvent | HTMLElement, position?: PopupPosition): void {
		this.position = position;
		this.target = target;
		this.attrs.hidden = false;
		this.mount();
		this._fixShape();
		m.redraw();
		this.events.emit('afterShow');

		if (this.hidePopup) {
			return;
		}

		this.hidePopup = (e: MouseEvent) => {
			if (this.node?.contains(e.target as HTMLElement)) {
				return;
			}

			this.hide();
			if (this.hidePopup) {
				document.removeEventListener('click', this.hidePopup);
			}
		};

		setTimeout(() => {
			if (this.hidePopup) {
				document.addEventListener('click', this.hidePopup);
			}
		}, 100);
	}

	view(): m.Vnode<unknown, unknown> {
		return this._getView({
			key: this.getId(),
			className: 'webcraft_popup',
			style: {
				...this._getStyle(),
			},
			oncreate: (vnode) => {
				const dom = (vnode.dom as HTMLElement);
				dom.style.position = 'fixed';
				const c = () => {
					if (!this.node) {
						return;
					}
					this._shape.width = dom.offsetWidth;
					this._shape.height = dom.offsetHeight;
					this._fixShape();
					dom.style.top = `${this._shape.top}px`;
					dom.style.left = `${this._shape.left}px`;
					this.node!.style.opacity = '1';
				};
				if (dom.offsetWidth) {
					c();
				} else{
					requestAnimationFrame(c);
				}
			}				
		});
	}

	private _fixShape() {
		if (!this.target) {
			return;
		}
		if (this.target instanceof HTMLElement) {
			const bounds = this.target.getBoundingClientRect();
			this._shape.targetWidth = this.target.offsetWidth;
			this._shape.targetHeight = this.target.offsetHeight;
			this._shape.targetTop = bounds.top;
			this._shape.targetLeft = bounds.left;
		} else {
			this._shape.targetWidth = 0;
			this._shape.targetHeight = 0;
			this._shape.targetTop = this.target.y;
			this._shape.targetLeft = this.target.x;
		}

		const sidesOrder: PopupSide[] = [];
		const side = this.attrs.side;
		if (typeof side === 'string') {
			sidesOrder.push(side);
		} else if (Array.isArray(side)) {
			sidesOrder.push(...side);
		}

		['bottom', 'right', 'left', 'top'].forEach(pos => {
			if (!sidesOrder.includes(pos as PopupSide)) {
				sidesOrder.push(pos as PopupSide);
			}
		});

		const offset = this.attrs.offset ?? 5;

		const isSpaceOnSide = (side: PopupSide) => {
			switch (side) {
			case 'top': {
				return this._shape.targetTop - offset - this._shape.targetHeight > 0;
			}

			case 'right': {
				return this._shape.targetLeft + this._shape.targetWidth + this._shape.targetWidth + offset < document.body.offsetWidth;
			}

			case 'bottom': {
				return this._shape.targetTop + this._shape.targetHeight + offset + this._shape.targetHeight < document.body.offsetHeight;
			}

			case 'left': {
				return this._shape.targetLeft - offset - this._shape.width > 0;
			}

			default: {
				return false;
			}
			}
		};

		const sideToSet = sidesOrder.find(isSpaceOnSide) ?? 'bottom';

		let top;
		let left;
		let width;
		let height;

		switch (sideToSet) {
		case 'top': {
			top = this._shape.targetTop - offset - this._shape.targetHeight;
			left = this._shape.targetLeft;
			break;
		}

		case 'right': {
			top = this._shape.targetTop;
			left = this._shape.targetLeft + offset + this._shape.targetWidth;
			break;
		}

		case 'left': {
			top = this._shape.targetTop;
			left = this._shape.targetLeft - offset - this._shape.width;
			break;
		}

		default: {
			top = this._shape.targetTop + this._shape.targetHeight + offset;
			left = this._shape.targetLeft;
			break;
		}
		}

		if (top + this._shape.targetHeight > document.body.offsetHeight) {
			top = top - 10 - (top + this._shape.targetHeight - document.body.offsetHeight);
		}

		if (left + this._shape.targetWidth > document.body.offsetWidth) {
			left = left - 10 - (left + this._shape.targetWidth - document.body.offsetWidth);
		}

		if (top < offset) {
			height = this._shape.targetHeight + top - offset;
			top = offset;
		}

		if (left < offset) {
			width = this._shape.targetWidth + left - offset;
			left = offset;
		}

		this._shape.top = top;
		this._shape.left = left;
		this._shape.width = width ?? 0;
		this._shape.height = height ?? 0;
	}

	private _getStyle(): Record<string, string |  number> {
		if (!this.position) {
			return {};
		}

		const style: Record<string, string | number> = {
			...this.position
		};

		['left', 'top', 'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight'].forEach(type => {
			if (typeof style[type] === 'number') {
				style[type] += 'px';
			}
		});

		return style;
	}

}