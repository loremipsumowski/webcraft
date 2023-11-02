"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = void 0;
const mithril_1 = __importDefault(require("mithril"));
require("./form.style.css");
const __1 = require("..");
const Editor_1 = require("../editors/Editor");
class Form extends __1.Box {
    constructor(attrs) {
        if (!attrs) {
            attrs = {};
        }
        if (!attrs.gap) {
            attrs.gap = 'none';
        }
        super(attrs);
    }
    getAllEditors() {
        const containers = this.getAllContainers();
        if (!containers) {
            return [];
        }
        return containers.map(container => container.getContent()).filter(content => content instanceof Editor_1.Editor);
    }
    getEditor(id) {
        var _a;
        const contents = (_a = this.getAllContainers()) === null || _a === void 0 ? void 0 : _a.map(container => container.getContent());
        if (!contents) {
            return undefined;
        }
        return contents.find(content => content instanceof Editor_1.Editor && content.getId() === id);
    }
    setDisabled(disabled) {
        this.getAllEditors().forEach(editor => {
            editor.setDisabled(disabled);
        });
    }
    getValue() {
        return Object.fromEntries(this.getAllEditors().map(editor => [editor.getId(), editor.getValue()]));
    }
    setValue(value) {
        Object.entries(value).forEach(entry => {
            var _a;
            (_a = this.getEditor(entry[0])) === null || _a === void 0 ? void 0 : _a.setValue(entry[1]);
        });
    }
    clear() {
        this.getAllEditors().forEach(editor => editor.clear());
    }
    validate() {
        return this.getAllEditors().map(editor => editor.validate()).includes(false) ? false : true;
    }
    view() {
        return (0, mithril_1.default)('div.webcraft_form', super.view());
    }
}
exports.Form = Form;
