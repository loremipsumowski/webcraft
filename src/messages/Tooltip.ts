import { Popup, PopupAttrs } from '../popup/Popup';

export type TooltipAttrs = string | {
	side?: 'bottom' | 'top' | 'right' | 'left';
	content?: string;
};

export class Tooltip {
	static show(attrs: TooltipAttrs, target: PointerEvent | HTMLElement): () => void {
		let popupAttributes: PopupAttrs = {};
		if (typeof attrs === 'string') {
			popupAttributes.content = attrs;
		} else {
			popupAttributes = { ...attrs };
		}
		const popup = new Popup(popupAttributes);
		popup.show(target);

		return () => {
			popup.hide();
		};
	}
}