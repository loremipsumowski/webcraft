import { dateFormats } from './DateFormats';
import { getGlobalConfig } from './Global';
import { hasDateLegalParts, isEmpty } from './Validators';

export function removeWhiteSpaces(value: string): string {
	return value.replace(/\s/g, '');
}

export function convertToDecimal(value: string): number | undefined {
	if (value === '') {
		return undefined;
	}
	return Number(removeWhiteSpaces(value.replace(/,/g, '.')));
}

export function convertDelimitters(value: string): string {
	const delimitter = getGlobalConfig().number.delimitter;
	return value.replace(/[,.]/g, delimitter);
}

export function convertToDate(value: string): Date | undefined {
	if (value === '') {
		return undefined;
	}
	const format = getGlobalConfig().date.format;
	const dateFormat = dateFormats[format];
	const year = dateFormat.yearRange ? value.substring(...dateFormat.yearRange) : undefined;
	const month = dateFormat.monthRange ? value.substring(...dateFormat.monthRange) : undefined;
	const day = dateFormat.dateRange ? value.substring(...dateFormat.dateRange) : undefined;

	const hasLegalParts = hasDateLegalParts(
		isEmpty(year) ? undefined : Number(year),
		isEmpty(month) ? undefined : Number(month) - 1,
		isEmpty(day) ? undefined : Number(day),
	);

	if (!hasLegalParts || value.length > format.length || dateFormat.separators?.find(ind => value.length > ind && value[ind] !== format[ind])) {
		return new Date(NaN);
	}
	const date = new Date(2000, 0, 1);
	date.setFullYear(Number(year));
	
	
	if (!isEmpty(month)) {
		date.setMonth(Number(month) - 1);
	}

	if (!isEmpty(day)) {
		date.setDate(Number(day));
	}
	return date;
}