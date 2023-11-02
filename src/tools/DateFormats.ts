
declare type DateFormatType = {
	yearRange?: [number, number],
	monthRange?: [number, number],
	dateRange?: [number, number],
	separators?: number[],
};

export const dateFormats: Record<string, DateFormatType> = {
	'YYYY-MM-DD': {
		yearRange: [0, 4],
		monthRange: [5, 7],
		dateRange: [8, 10],
		separators: [4, 7],
	},
	'YYYY/MM/DD': {
		yearRange: [0, 4],
		monthRange: [5, 7],
		dateRange: [8, 10],
		separators: [4, 7],
	},
};