"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Datagrid = void 0;
const mithril_1 = __importDefault(require("mithril"));
const Component_1 = require("../common/Component");
const Data_1 = require("../data/Data");
const Template_1 = require("../common/Template");
class Datagrid extends Component_1.Component {
    constructor(attrs) {
        super(attrs);
        this.data = new Data_1.Data();
        const d = [];
        for (let i = 0; i < 100; i++) {
            d.push({
                id: i,
            });
        }
        this.data.load(d);
    }
    view() {
        const template = (0, Template_1.getTemplateFunction)(this.attrs.template, {
            className: 'webcraft_datagrid_item'
        });
        return (0, mithril_1.default)('div.webcraft_datagrid', this.data.map(template));
    }
}
exports.Datagrid = Datagrid;
