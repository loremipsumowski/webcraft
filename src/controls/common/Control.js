"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Control = exports.getControlEvents = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Component_1 = require("../../common/Component");
function getControlEvents(control) {
    return {
        onclick: (e) => {
            control.events.emit('click', e);
        },
        ondblclick: (e) => {
            control.events.emit('dblclick', e);
        },
        onmouseover: (e) => {
            control.events.emit('mouseover', e);
        },
        onmouseout: (e) => {
            control.events.emit('mouseout', e);
        },
        onmousedown: (e) => {
            control.events.emit('mousedown', e);
        },
        onmouseup: (e) => {
            control.events.emit('mouseup', e);
        },
    };
}
exports.getControlEvents = getControlEvents;
class Control extends Component_1.Component {
    show() {
        this.attrs.hidden = false;
        mithril_1.default.redraw();
    }
    hide() {
        this.attrs.hidden = true;
        mithril_1.default.redraw();
    }
    isHidden() {
        return Boolean(this.attrs.hidden);
    }
    constructor(attrs) {
        super(attrs);
        this.events.on('mouseover', (e) => {
            if (this.attrs.tooltip) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const Tooltip = require('../../messages/Tooltip').Tooltip;
                const tooltipHide = Tooltip.show(this.attrs.tooltip, e.target);
                this.events.once('mouseout', () => { tooltipHide(); });
            }
        });
    }
}
exports.Control = Control;
