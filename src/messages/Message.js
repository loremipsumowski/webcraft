"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Component_1 = require("../common/Component");
require("./message.style.css");
const classnames_1 = __importDefault(require("classnames"));
const __1 = require("..");
const Button_1 = require("../controls/button/Button");
class Message extends Component_1.Component {
    constructor(attrs, container) {
        super(attrs);
        this.container = container;
        this.modal = true;
        this.toolbar = new __1.Toolbar({
            justify: 'center',
            classNames: 'webcraft_message_toolbar',
            items: this.attrs.buttons || [
                new Button_1.Button({ id: 'btn_hide', text: 'OK', color: this.getColor() }),
            ],
        });
        this.toolbar.events.on('click', () => {
            this.hide();
        });
    }
    hide() {
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
    getColor() {
        return this.attrs.color || 'primary';
    }
    view() {
        return (0, mithril_1.default)('div.webcraft_modal_wrapper', {
            className: (0, classnames_1.default)(this.attrs.modal !== false ? 'webcraft_modal_wrapper--modal' : null)
        }, (0, mithril_1.default)('div.webcraft_message', {
            className: (0, classnames_1.default)([
                `webcraft_message--${this.getColor()}`,
            ])
        }, [
            (0, mithril_1.default)('div.webcraft_message_title', this.attrs.title),
            (0, mithril_1.default)('div.webcraft_message_content_wrapper', (0, mithril_1.default)('div.webcraft_message_content', this.attrs.text)),
            this.toolbar.view(),
        ]));
    }
}
exports.Message = Message;
