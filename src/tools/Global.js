"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalConfig = void 0;
const config = {
    editor: {
        showClearButton: true,
    },
    number: {
        delimitter: ',',
        thousandSeparator: ' ',
        decimalPlaces: 2,
    },
    date: {
        format: 'YYYY/MM/DD'
    },
    time: {
        clockFormat: 24,
    },
    i18n: {
        calendar: {
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            today: 'Today',
            clear: 'Clear',
            prev: 'Prev',
            next: 'Next',
        }
    },
};
function getGlobalConfig() {
    return config;
}
exports.getGlobalConfig = getGlobalConfig;
