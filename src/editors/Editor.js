"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Component_1 = require("../common/Component");
require("./editor.style.css");
const classnames_1 = __importDefault(require("classnames"));
const Tooltip_1 = require("../messages/Tooltip");
const __1 = require("..");
const Global_1 = require("../tools/Global");
class Editor extends Component_1.Component {
    constructor(attrs) {
        super(attrs);
        this._focused = false;
        this._validationMessages = [];
        this.events.on('mouseover', (e) => {
            if (this.attrs.tooltip) {
                const tooltipHide = Tooltip_1.Tooltip.show(this.attrs.tooltip, e);
                this.events.once('mouseout', () => { tooltipHide(); });
            }
        });
        this._btnClear = new __1.Button({
            text: 'x',
            style: 'plain',
            color: 'secondary',
            size: 'small',
            events: {
                click: () => {
                    this.clear();
                }
            }
        });
    }
    /**
     * Returns true/false specifies wheather control is disabled or not to input there value manually by the user
     * @returns true if control is disabled
     */
    isDisabled() {
        return Boolean(this.attrs.disabled);
    }
    /**
     * Change state of control's disabling. Set it to true to disallow user to input value into control directly, or make it falsy to allow to input values manually
     * @param disabled new state of control disabling
     * @returns true if state was changed, otherwise false
     */
    setDisabled(disabled) {
        if (this.attrs.disabled === disabled) {
            return false;
        }
        this.attrs.disabled = disabled;
        this.events.emit(this.attrs.disabled ? 'afterDisable' : 'afterEnable');
        mithril_1.default.redraw();
        return true;
    }
    /**
     * Returns information that control's value is required in order to successed validation
     * @returns true if control's value is required
     */
    isRequired() {
        return Boolean(this.attrs.required);
    }
    /**
     * Change state of control's requirement, then validate it. When state is true, then validation function can success only if value is not empty.
     * @param required new state of control requirement
     * @returns true if state was changed, otherwise false
     */
    setRequired(required) {
        if (this.attrs.required === required) {
            return false;
        }
        this.attrs.required = required;
        this.validate();
        mithril_1.default.redraw();
        return true;
    }
    /**
     * Get current value of the control
     * @returns current value of the control of unformatted style
     */
    getValue() {
        return this.attrs.value;
    }
    /**
     * Sets current value of the control, then validates control
     * @param value new value to set
     * @param suppressEvents when true, then change event does not emit
     */
    setValue(value, suppressEvents) {
        this._setEditingValue(undefined);
        this.attrs.value = value;
        if (suppressEvents !== true) {
            this.events.emit('change', this.attrs.value);
        }
        this.validate();
        mithril_1.default.redraw();
    }
    /**
     * Clears current value of the control. It is equivalent to "setValue(undefined)"
     */
    clear() {
        this.setValue(undefined);
    }
    /**
     * Checks that value of the control is correct or not and changes style of the control depends on the validation result
     * @param value value to validate control by with
     * @param suppressEvents true to suppress "afterValidate" event emission
     * @returns true if validation is successed or false in case of failure
     */
    validate(value, suppressEvents) {
        this._validationMessages = [];
        if (value === undefined) {
            value = this.attrs.value;
        }
        if (this.isRequired() && (value === '' || value === undefined || value === null)) {
            this._validationMessages.push('Value is required');
        }
        mithril_1.default.redraw();
        this._validationStatus = this._validationMessages.length === 0;
        if (suppressEvents !== true) {
            this.events.emit('afterValidate', this._validationStatus, this._validationMessages);
        }
        return this._validationStatus;
    }
    view() {
        const label = this._getLabel();
        const description = this._getDescription();
        return (0, mithril_1.default)('div.webcraft_editor', this._getEditorAttrs({
            key: this.getId(),
            oncreate: (vnode) => { this.editorNode = vnode.dom; },
            onupdate: (vnode) => { this.editorNode = vnode.dom; },
            onfocusin: () => {
                this._setFocus(true);
            },
            onfocusout: () => {
                this._setFocus(false);
            },
            onmouseover: (e) => { this.events.emit('mouseover', e); },
            onmouseout: (e) => { this.events.emit('mouseout', e); },
            className: (0, classnames_1.default)(this._focused ? 'webcraft_editor--focused' : null, this.attrs.required ? 'webcraft_editor--required' : null, this.attrs.disabled ? 'webcraft_editor--disabled' : null, this._validationStatus === true ? 'webcraft_editor--success' : null, this._validationStatus === false ? 'webcraft_editor--danger' : null),
            style: Object.assign({}, this._getSizes()),
        }), [
            (0, mithril_1.default)('label.webcraft_editor_label', { for: this.getId() }, label.text),
            (0, mithril_1.default)('div.webcraft_control_wrapper', [
                this.attrs.icon ? (0, mithril_1.default)('div.webcraft_editor_icon', (0, mithril_1.default)('span', { className: this.attrs.icon })) : null,
                (0, mithril_1.default)('div.webcraft_editor_content', this._getEditorContentAttrs({}), this.controlView()),
                this._getButtons().map(item => item.view()),
            ]),
            description ? (0, mithril_1.default)('div.webcraft_editor_desc', description) : null,
        ]);
    }
    _setEditingValue(value) {
        this._editingValue = value;
    }
    _getButtons() {
        var _a, _b;
        const showClearButton = (this._editingValue !== undefined && this._editingValue !== '' || this.getValue() !== undefined) && ((_a = this.attrs.showClearButton) !== null && _a !== void 0 ? _a : (_b = (0, Global_1.getGlobalConfig)().editor) === null || _b === void 0 ? void 0 : _b.showClearButton);
        return [
            ...(showClearButton && !this.isDisabled() && this._focused ? [this._btnClear] : []),
        ];
    }
    _getEditorContentAttrs(attrs) {
        return attrs;
    }
    _getEditorAttrs(attrs) {
        return attrs;
    }
    _getSizes() {
        const style = Object.assign({}, (this.attrs.sizes || {}));
        ['width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight'].forEach(type => {
            if (typeof style[type] === 'number') {
                style[type] += 'px';
            }
        });
        return style;
    }
    _getDescription() {
        if (this._validationMessages.length) {
            return this._validationMessages[0];
        }
        return this.attrs.description;
    }
    _getLabel() {
        if (typeof this.attrs.label === 'object') {
            return this.attrs.label;
        }
        else if (typeof this.attrs.label === 'string') {
            return {
                text: this.attrs.label,
            };
        }
        else {
            return {};
        }
    }
    _setFocus(focus) {
        var _a;
        if (focus === false && ((_a = this.editorNode) === null || _a === void 0 ? void 0 : _a.contains(document.activeElement))) {
            return;
        }
        this._focused = focus;
        if (!this._focused) {
            this._setEditingValue(undefined);
        }
        mithril_1.default.redraw();
    }
}
exports.Editor = Editor;
