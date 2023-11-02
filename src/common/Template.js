"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplate = exports.getTemplateFunction = void 0;
const mithril_1 = __importDefault(require("mithril"));
function getTemplateFunction(template, attributes) {
    return (...args) => getTemplate(args, template, attributes);
}
exports.getTemplateFunction = getTemplateFunction;
function getTemplate(item, template, attributes) {
    let content;
    if (template) {
        const result = template(item);
        if (typeof result === 'string') {
            content = result;
        }
        else if ((result === null || result === void 0 ? void 0 : result.html) !== undefined) {
            content = mithril_1.default.trust(result.html);
        }
        else {
            content = JSON.stringify(item);
        }
    }
    else {
        content = JSON.stringify(item);
    }
    return (0, mithril_1.default)('div.webcraft_template', attributes || {}, content);
}
exports.getTemplate = getTemplate;
