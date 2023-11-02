"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDateLegalParts = exports.isEmpty = exports.hasIntegerLegalChars = exports.hasDecimalLegalChars = exports.isCharNumber = void 0;
const Global_1 = require("./Global");
function isCharNumber(value) {
    return typeof value === 'string' && value.length == 1 && value >= '0' && value <= '9';
}
exports.isCharNumber = isCharNumber;
function hasDecimalLegalChars(value) {
    if (value === '') {
        return true;
    }
    const delimitter = (0, Global_1.getGlobalConfig)().number.delimitter;
    if (value.split(delimitter).length > 2) {
        return false;
    }
    const reg = new RegExp(`^[0-9${delimitter}]+$`);
    return reg.test(value);
}
exports.hasDecimalLegalChars = hasDecimalLegalChars;
function hasIntegerLegalChars(value) {
    if (value === '') {
        return true;
    }
    return /^[0-9]+$/.test(value);
}
exports.hasIntegerLegalChars = hasIntegerLegalChars;
function isEmpty(value) {
    return value === undefined || value === null || value === '' || (typeof value === 'number' && isNaN(value));
}
exports.isEmpty = isEmpty;
function hasDateLegalParts(years, months, days, hours, minutes, seconds) {
    if ([years, months, days, hours, minutes, seconds].every(val => val === null || val === undefined)) {
        return false;
    }
    const date = new Date(years !== null && years !== void 0 ? years : 0, months !== null && months !== void 0 ? months : 0, days !== null && days !== void 0 ? days : 1, hours !== null && hours !== void 0 ? hours : 0, minutes !== null && minutes !== void 0 ? minutes : 0, seconds !== null && seconds !== void 0 ? seconds : 0);
    return (!isNaN(date.getTime()) &&
        date.getFullYear() === (years !== null && years !== void 0 ? years : 0) &&
        date.getMonth() === (months !== null && months !== void 0 ? months : 0) &&
        date.getDate() === (days !== null && days !== void 0 ? days : 1) &&
        date.getHours() === (hours !== null && hours !== void 0 ? hours : 0) &&
        date.getMinutes() === (minutes !== null && minutes !== void 0 ? minutes : 0) &&
        date.getSeconds() === (seconds !== null && seconds !== void 0 ? seconds : 0));
}
exports.hasDateLegalParts = hasDateLegalParts;
