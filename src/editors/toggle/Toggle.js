"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toggle = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Editor_1 = require("../Editor");
const __1 = require("../..");
require("./toggle.style.css");
class Toggle extends Editor_1.Editor {
    controlView() {
        const value = this.getValue();
        return (0, mithril_1.default)('div.webcraft_toggle', this.attrs.items.map(item => {
            var _a;
            return new __1.Button({
                disabled: this.isDisabled(),
                id: item.id,
                text: item.text,
                color: (_a = item.color) !== null && _a !== void 0 ? _a : 'secondary',
                icon: item.icon,
                style: value === item.id ? 'filled' : 'plain',
                events: {
                    click: () => {
                        if (value === item.id) {
                            this.setValue(undefined);
                        }
                        else {
                            this.setValue(item.id);
                        }
                    }
                }
            }).view();
        }));
    }
}
exports.Toggle = Toggle;
