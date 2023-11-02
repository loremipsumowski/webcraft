"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.prependZero = exports.formatDecimal = exports.formatInteger = void 0;
const Converters_1 = require("./Converters");
const Global_1 = require("./Global");
function formatThousandSeparators(value) {
    const thousandSeparator = (0, Global_1.getGlobalConfig)().number.thousandSeparator;
    if (!thousandSeparator) {
        return value.toString();
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
}
function formatInteger(value) {
    const delimitter = (0, Global_1.getGlobalConfig)().number.delimitter;
    return formatDecimal(value).split(delimitter)[0];
}
exports.formatInteger = formatInteger;
function formatDecimal(value) {
    var _a;
    if (value === null || value === undefined) {
        return '';
    }
    if (typeof value !== 'string') {
        value = String(value);
    }
    value = (0, Converters_1.removeWhiteSpaces)(value);
    value = (0, Converters_1.convertDelimitters)(value);
    const { delimitter, decimalPlaces } = (0, Global_1.getGlobalConfig)().number;
    const parts = value.split(delimitter);
    let decimalPart = '';
    if (decimalPlaces === undefined) {
        if (parts[1]) {
            decimalPart = `${delimitter}${parts[1]}`;
        }
    }
    else {
        decimalPart = (_a = parts[1]) !== null && _a !== void 0 ? _a : '';
        while (decimalPart.length < decimalPlaces) {
            decimalPart += '0';
        }
        decimalPart = decimalPart.substring(0, decimalPlaces);
        if (decimalPlaces) {
            decimalPart = `${delimitter}${decimalPart}`;
        }
    }
    return `${formatThousandSeparators(parts[0])}${decimalPart}`;
}
exports.formatDecimal = formatDecimal;
function prependZero(maxLength, value) {
    if (value.length < maxLength)
        return prependZero(maxLength, `0${value}`);
    else
        return value;
}
exports.prependZero = prependZero;
function formatDate(value) {
    if (!value || isNaN(value.getTime())) {
        return '';
    }
    const format = (0, Global_1.getGlobalConfig)().date.format;
    const year = value.getFullYear();
    const month = value.getMonth() + 1;
    const day = value.getDate();
    return format
        .replace('YYYY', prependZero(4, String(year)))
        .replace('MM', prependZero(2, String(month)))
        .replace('DD', prependZero(2, String(day)));
}
exports.formatDate = formatDate;
