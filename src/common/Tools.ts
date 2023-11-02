import { IdType } from './Types';

let lastGeneratedId = Date.now();
export function generateId(): IdType {
	return `w_${lastGeneratedId++}`;
}