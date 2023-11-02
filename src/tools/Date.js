"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekNumber = exports.compareDatesByYearAndMonth = exports.compareDatesIgnoringTime = exports.addYearsToDate = exports.addMonthsToDate = exports.addDaysToDate = exports.getLastDayOfWeek = exports.getFirstDayOfWeek = exports.getLastDayOfMonth = exports.getFirstDayOfMonth = void 0;
function getFirstDayOfMonth(date) {
    const firstDayOfMonth = new Date(date);
    firstDayOfMonth.setDate(1);
    return firstDayOfMonth;
}
exports.getFirstDayOfMonth = getFirstDayOfMonth;
function getLastDayOfMonth(date) {
    const lastDayOfMonth = new Date(date);
    lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
    lastDayOfMonth.setDate(0);
    return lastDayOfMonth;
}
exports.getLastDayOfMonth = getLastDayOfMonth;
function getFirstDayOfWeek(date) {
    const firstDayOfWeek = new Date(date);
    const dayOfWeek = firstDayOfWeek.getDay();
    const daysToMonday = (dayOfWeek === 0) ? 6 : (dayOfWeek - 1);
    firstDayOfWeek.setDate(date.getDate() - daysToMonday);
    return firstDayOfWeek;
}
exports.getFirstDayOfWeek = getFirstDayOfWeek;
function getLastDayOfWeek(date) {
    const lastDayOfWeek = new Date(date);
    const dayOfWeek = lastDayOfWeek.getDay();
    const daysToAdd = (dayOfWeek === 0) ? 0 : 7 - dayOfWeek;
    lastDayOfWeek.setDate(date.getDate() + daysToAdd);
    return lastDayOfWeek;
}
exports.getLastDayOfWeek = getLastDayOfWeek;
function addDaysToDate(date, daysToAdd) {
    const resultDate = new Date(date);
    resultDate.setDate(date.getDate() + daysToAdd);
    return resultDate;
}
exports.addDaysToDate = addDaysToDate;
function addMonthsToDate(date, monthsToAdd) {
    const resultDate = new Date(date);
    resultDate.setMonth(date.getMonth() + monthsToAdd);
    return resultDate;
}
exports.addMonthsToDate = addMonthsToDate;
function addYearsToDate(date, yearsToAdd) {
    const resultDate = new Date(date);
    resultDate.setFullYear(date.getFullYear() + yearsToAdd);
    return resultDate;
}
exports.addYearsToDate = addYearsToDate;
function compareDatesIgnoringTime(date1, date2) {
    if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
        return null;
    }
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    if (d1 < d2)
        return -1;
    if (d1 > d2)
        return 1;
    return 0;
}
exports.compareDatesIgnoringTime = compareDatesIgnoringTime;
function compareDatesByYearAndMonth(date1, date2) {
    if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
        return null;
    }
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    if (year1 < year2)
        return -1;
    if (year1 > year2)
        return 1;
    if (month1 < month2)
        return -1;
    if (month1 > month2)
        return 1;
    return 0;
}
exports.compareDatesByYearAndMonth = compareDatesByYearAndMonth;
function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNumber = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNumber;
}
exports.getWeekNumber = getWeekNumber;
