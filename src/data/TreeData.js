"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeData = void 0;
const Tools_1 = require("../common/Tools");
const EventEmitter_1 = require("../event-emitter/EventEmitter");
const mithril_1 = __importDefault(require("mithril"));
class TreeData {
    constructor(parent) {
        this.parent = parent;
        this.events = new EventEmitter_1.EventEmitter(this);
        this.items = [];
        this.itemsMap = {};
        this.itemsTopLevel = [];
        this.itemsChildrenMap = {};
    }
    clear() {
        this.items = [];
        this.itemsMap = {};
        this.itemsTopLevel = [];
        this.itemsChildrenMap = {};
        mithril_1.default.redraw();
    }
    load(items) {
        this.clear();
        this.items.push(...items);
        this.items.map(item => {
            const { id } = item, rest = __rest(item, ["id"]);
            return Object.assign({ id: id !== null && id !== void 0 ? id : (0, Tools_1.generateId)() }, rest);
        }).forEach(item => {
            this.itemsMap[item.id] = item;
            if (item.parent) {
                if (!this.itemsChildrenMap[item.parent]) {
                    this.itemsChildrenMap[item.parent] = [];
                }
                this.itemsChildrenMap[item.parent].push(item);
            }
            else {
                this.itemsTopLevel.push(item);
            }
        });
        this.events.emit('afterLoad');
        mithril_1.default.redraw();
    }
    loadAsync(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const progressOff = (_a = this.parent.parent) === null || _a === void 0 ? void 0 : _a.progress.on();
            if (data instanceof Promise) {
                const items = yield data;
                this.load(items);
            }
            else {
                this.load(data);
            }
            progressOff === null || progressOff === void 0 ? void 0 : progressOff();
            return Promise.resolve();
        });
    }
    forEach(callback) {
        return this.items.map(callback);
    }
    map(callback) {
        return this.items.map(callback);
    }
    getRootLevelItems() {
        return this.itemsTopLevel;
    }
    getItemById(id) {
        return this.itemsMap[id];
    }
    getChildrenByParent(parentId) {
        return this.itemsChildrenMap[parentId] || [];
    }
    update(id, value) {
        const item = this.getItemById(id);
        if (item) {
            Object.assign(item, value);
        }
        mithril_1.default.redraw();
    }
}
exports.TreeData = TreeData;
