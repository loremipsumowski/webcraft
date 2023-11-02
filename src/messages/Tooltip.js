"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tooltip = void 0;
const Popup_1 = require("../popup/Popup");
class Tooltip {
    static show(attrs, target) {
        let popupAttributes = {};
        if (typeof attrs === 'string') {
            popupAttributes.content = attrs;
        }
        else {
            popupAttributes = Object.assign({}, attrs);
        }
        const popup = new Popup_1.Popup(popupAttributes);
        popup.show(target);
        return () => {
            popup.hide();
        };
    }
}
exports.Tooltip = Tooltip;
