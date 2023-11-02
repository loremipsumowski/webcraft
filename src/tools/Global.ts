import { dateFormats } from './DateFormats';

declare type Config = {
	editor?: {
		showClearButton?: boolean;
	},
	number: {
		delimitter: ',' | '.',
		thousandSeparator?: string;
		decimalPlaces?: number;
	},
	date: {
		format: keyof typeof dateFormats;
	},
	time: {
		clockFormat: 12 | 24;
	},
	i18n: {
		calendar: {
			months: string[];
			monthsShort: string[];
			days: string[];
			daysShort: string[];
			today: string;
			clear: string;
			prev: string;
			next: string;
		}
	}
};

const config: Config = {
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

export function getGlobalConfig(): Config {
	return config;
}