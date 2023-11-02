import { getGlobalConfig } from './Global';

export function isCharNumber(value: string): boolean {
	return typeof value === 'string' && value.length == 1 && value >= '0' && value <= '9';
}

export function hasDecimalLegalChars(value: string): boolean {
	if (value === '') {
		return true;
	}
	const delimitter = getGlobalConfig().number.delimitter;

	if (value.split(delimitter).length > 2) {
		return false;
	}

	const reg = new RegExp(`^[0-9${delimitter}]+$`);
	return reg.test(value);
}

export function hasIntegerLegalChars(value: string): boolean {	
	if (value === '') {
		return true;
	}
	return /^[0-9]+$/.test(value);
}

export function isEmpty(value: unknown): boolean {
	return value === undefined || value === null || value === '' || (typeof value === 'number' && isNaN(value));
}

export function hasDateLegalParts(years?: number, months?: number, days?: number, hours?: number, minutes?: number, seconds?: number) {
	if ([years, months, days, hours, minutes, seconds].every(val => val === null || val === undefined)) {
		return false;
	}
  
	const date = new Date(years ?? 0, months ?? 0, days ?? 1, hours ?? 0, minutes ?? 0, seconds ?? 0);

	return (
		!isNaN(date.getTime()) &&
		date.getFullYear() === (years ?? 0) &&
		date.getMonth() === (months ?? 0) &&
		date.getDate() === (days ?? 1) &&
		date.getHours() === (hours ?? 0) &&
		date.getMinutes() === (minutes ?? 0) &&
		date.getSeconds() === (seconds ?? 0)
	);
}