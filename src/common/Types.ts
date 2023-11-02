import { EventEmitter, ValidEventTypes } from '../event-emitter/EventEmitter';
import { Component, ComponentAttributes } from './Component';

export type SizeType = {
	width?: number | `${number}px` | `${number}%`;
	height?: number | `${number}px` | `${number}%`;
	minWidth?: number | `${number}px` | `${number}%`;
	maxWidth?: number | `${number}px` | `${number}%`;
	minHeight?: number | `${number}px` | `${number}%`;
	maxHeight?: number | `${number}px` | `${number}%`;
};

export type IdType = string | number;

export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

export declare type FlexDirection = 'row' | 'column';
export declare type FlexJustification = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export declare type FlexAlignment = 'start' | 'center' | 'end' | 'stretch';

export declare type IDataEventTypes = ValidEventTypes & {
	afterLoad: () => void;
}

export declare interface IData<T> {
	events: EventEmitter<IDataEventTypes>;
	getItemById(id: IdType): T | undefined;
	load(data: T[]): void;
	loadAsync(data: T[] | Promise<T[]>): void;
	map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[];
	forEach<U>(callbackfn: (value: T, index: number, array: T[]) => U): void;
}

export declare interface IDataComponent<T> extends Component<ComponentAttributes, ValidEventTypes> {
	data: IData<T>
}

export declare interface IFixedComponent extends Component<ComponentAttributes, ValidEventTypes> {

}