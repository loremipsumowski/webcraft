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
exports.Data = void 0;
const Tools_1 = require("../common/Tools");
const EventEmitter_1 = require("../event-emitter/EventEmitter");
const mithril_1 = __importDefault(require("mithril"));
class Data {
    constructor() {
        this._filters = [];
        this._all = [];
        this.events = new EventEmitter_1.EventEmitter(this);
    }
    getItemById(id) {
        return this._all.find(item => item.id === id);
    }
    getItemByIndex(index) {
        return this._getItems()[index];
    }
    clear() {
        this._all = [];
        delete this._items;
        mithril_1.default.redraw();
    }
    add(item) {
        var _a;
        const { id } = item, rest = __rest(item, ["id"]);
        const x = Object.assign({ id: id !== null && id !== void 0 ? id : (0, Tools_1.generateId)() }, rest);
        this._all.push(x);
        if (this._filters.length && this._filters.every(f => f(x, 0, [x]))) {
            (_a = this._items) === null || _a === void 0 ? void 0 : _a.push(x);
        }
        return x;
    }
    load(items) {
        this.clear();
        const x = items.map(item => {
            const { id } = item, rest = __rest(item, ["id"]);
            return Object.assign({ id: id !== null && id !== void 0 ? id : (0, Tools_1.generateId)() }, rest);
        });
        this._all.push(...x);
        if (this._filters.length) {
            this._items = this._all.filter((z, index, array) => this._filters.every(f => f(z, index, array)));
        }
        this.events.emit('afterLoad');
        mithril_1.default.redraw();
    }
    loadAsync(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data instanceof Promise) {
                const items = yield data;
                this.load(items);
            }
            else {
                this.load(data);
            }
        });
    }
    getLength() {
        return this._getItems().length;
    }
    map(callbackfn) {
        return this._getItems().map(callbackfn);
    }
    forEach(callbackfn) {
        this._getItems().map(callbackfn);
    }
    applyFilter(predicate) {
        this._filters.push(predicate);
        this._items = this._getItems().filter(predicate);
    }
    clearFilters() {
        this._filters = [];
        delete this._items;
    }
    _getItems() {
        if (this._items) {
            return this._items;
        }
        return this._all;
    }
}
exports.Data = Data;
