"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegExp = void 0;
function escapeRegExp(value) {
    return value.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}
exports.escapeRegExp = escapeRegExp;
