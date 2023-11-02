import { IdType } from './Types';

let lastGeneratedId = 0;
export function generateId(): IdType {
	return lastGeneratedId++;
}