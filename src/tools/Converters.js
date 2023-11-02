"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToDate = exports.convertDelimitters = exports.convertToDecimal = exports.removeWhiteSpaces = void 0;
const DateFormats_1 = require("./DateFormats");
const Global_1 = require("./Global");
const Validators_1 = require("./Validators");
function removeWhiteSpaces(value) {
    return value.replace(/\s/g, '');
}
exports.removeWhiteSpaces = removeWhiteSpaces;
function convertToDecimal(value) {
    if (value === '') {
        return undefined;
    }
    return Number(removeWhiteSpaces(value.replace(/,/g, '.')));
}
exports.convertToDecimal = convertToDecimal;
function convertDelimitters(value) {
    const delimitter = (0, Global_1.getGlobalConfig)().number.delimitter;
    return value.replace(/[,.]/g, delimitter);
}
exports.convertDelimitters = convertDelimitters;
function convertToDate(value) {
    var _a;
    if (value === '') {
        return undefined;
    }
    const format = (0, Global_1.getGlobalConfig)().date.format;
    const dateFormat = DateFormats_1.dateFormats[format];
    const year = dateFormat.yearRange ? value.substring(...dateFormat.yearRange) : undefined;
    const month = dateFormat.monthRange ? value.substring(...dateFormat.monthRange) : undefined;
    const day = dateFormat.dateRange ? value.substring(...dateFormat.dateRange) : undefined;
    const hasLegalParts = (0, Validators_1.hasDateLegalParts)((0, Validators_1.isEmpty)(year) ? undefined : Number(year), (0, Validators_1.isEmpty)(month) ? undefined : Number(month) - 1, (0, Validators_1.isEmpty)(day) ? undefined : Number(day));
    if (!hasLegalParts || value.length > format.length || ((_a = dateFormat.separators) === null || _a === void 0 ? void 0 : _a.find(ind => value.length > ind && value[ind] !== format[ind]))) {
        return new Date(NaN);
    }
    const date = new Date(2000, 0, 1);
    date.setFullYear(Number(year));
    if (!(0, Validators_1.isEmpty)(month)) {
        date.setMonth(Number(month) - 1);
    }
    if (!(0, Validators_1.isEmpty)(day)) {
        date.setDate(Number(day));
    }
    return date;
}
exports.convertToDate = convertToDate;
