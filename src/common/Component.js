"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Tools_1 = require("./Tools");
const EventEmitter_1 = require("../event-emitter/EventEmitter");
class Component {
    constructor(attrs) {
        this.modal = false;
        this.fitContainer = false;
        this.attrs = attrs || {};
        this.id = this.attrs.id || (0, Tools_1.generateId)();
        this.events = new EventEmitter_1.EventEmitter(this);
        if (this.attrs.events) {
            for (const name in this.attrs.events) {
                this.events.on(name, this.attrs.events[name]);
            }
        }
    }
    getId() {
        return this.id;
    }
    mount(parentNode = document.body) {
        if (!this.node) {
            this.node = document.createElement('div');
            this.node.classList.add('webcraft');
            if (this.modal) {
                this.node.classList.add('webcraft--modal');
            }
        }
        mithril_1.default.mount(this.node, {
            view: () => this.view(),
            oncreate: () => {
                parentNode.appendChild(this.node);
            },
            onremove: () => {
                parentNode.removeChild(this.node);
            },
        });
    }
    unmount() {
        if (this.node) {
            mithril_1.default.mount(this.node, null);
        }
    }
}
exports.Component = Component;
