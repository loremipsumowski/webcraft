"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
let lastGeneratedId = Date.now();
function generateId() {
    return `w_${lastGeneratedId++}`;
}
exports.generateId = generateId;
