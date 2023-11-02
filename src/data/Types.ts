import { IdType } from '../common/Types';

export declare type DataItemType = {
	id: IdType;
} & Record<string, unknown>;

export declare type TreeDataItemType = DataItemType & {
	parent?: IdType;
	$opened?: boolean;
};