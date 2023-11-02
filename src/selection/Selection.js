"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Selection = void 0;
class Selection {
    constructor(parent, attrs) {
        this.selectedItems = [];
        this.parent = parent;
        this.attrs = attrs || {};
        this.setSelection(attrs === null || attrs === void 0 ? void 0 : attrs.selected);
    }
    getSelected() {
        return [...this.selectedItems];
    }
    isMultipleMode() {
        return Boolean(this.attrs.multiple);
    }
    setMultipleMode(mode) {
        let selected;
        if (mode === true && (selected = this.getSelected()).length > 1) {
            selected.slice(1).forEach(id => { this.unselect(id); });
        }
        this.attrs.multiple = mode;
    }
    unselect(id, suppressEvents) {
        const index = this.selectedItems.indexOf(id);
        if (index === -1) {
            return;
        }
        this.selectedItems.splice(index, 1);
        if (!suppressEvents) {
            this.parent.events.emit('afterUnselect', [id]);
        }
    }
    select(id, config, suppressEvents) {
        if (this.selectedItems.length > 0 && (!this.isMultipleMode() || !(config === null || config === void 0 ? void 0 : config.ctrlKey))) {
            const itemsToUnselect = [...this.selectedItems];
            itemsToUnselect.forEach(item => {
                this.unselect(item);
            });
        }
        this.selectedItems.push(id);
        if (!suppressEvents) {
            this.parent.events.emit('afterSelect', [id]);
        }
    }
    selectAll() {
        if (!this.isMultipleMode()) {
            throw new Error('Cannot select all items while multiple mode is set off');
        }
        const ids = [];
        this.parent.data.forEach(item => {
            this.select(item.id, { ctrlKey: true }, true);
            ids.push(item.id);
        });
        this.parent.events.emit('afterSelect', ids);
    }
    unselectAll() {
        const ids = [];
        this.parent.data.forEach(item => {
            this.unselect(item.id, true);
            ids.push(item.id);
        });
        this.parent.events.emit('afterUnselect', ids);
    }
    isSelected(id) {
        return this.selectedItems.includes(id);
    }
    setSelection(selection) {
        if (selection) {
            this.selectedItems = [...selection];
        }
        else {
            this.selectedItems = [];
        }
    }
}
exports.Selection = Selection;
