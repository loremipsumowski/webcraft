import { convertDelimitters, removeWhiteSpaces } from './Converters';
import { dateFormats } from './DateFormats';
import { getGlobalConfig } from './Global';

function formatThousandSeparators(value: number | string): string {
	const thousandSeparator = getGlobalConfig().number.thousandSeparator;
	if (!thousandSeparator) {
		return value.toString();
	}
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
}

export function formatInteger(value: string | number): string {
	const delimitter = getGlobalConfig().number.delimitter;
	return formatDecimal(value).split(delimitter)[0];
}

export function formatDecimal(value: string | number): string {
	if (value === null || value === undefined) {
		return '';
	}

	if (typeof value !== 'string') {
		value = String(value);
	}

	value = removeWhiteSpaces(value);

	value = convertDelimitters(value);

	const {delimitter, decimalPlaces} = getGlobalConfig().number;
	const parts = value.split(delimitter);
	let decimalPart = '';
	
	if (decimalPlaces === undefined) {
		if (parts[1]) {
			decimalPart = `${delimitter}${parts[1]}`;
		}
	} else {
		decimalPart = parts[1] ?? '';
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

export function prependZero(maxLength: number, value: string): string {
	if (value.length < maxLength) return prependZero(maxLength, `0${value}`);
	else return value;
}

export function formatDate(value?: Date, format?: keyof typeof dateFormats): string {
	if (!value || isNaN(value.getTime())) {
		return '';
	}

	if (!format) {
		format = getGlobalConfig().date.format;
	}
	const year = value.getFullYear();
	const month = value.getMonth() + 1;
	const day = value.getDate();

	return format
		.replace('YYYY', prependZero(4, String(year)))
		.replace('MM', prependZero(2, String(month)))
		.replace('DD', prependZero(2, String(day)));
}