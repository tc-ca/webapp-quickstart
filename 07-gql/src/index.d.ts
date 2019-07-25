import {
    Table
} from './index.d';

export type GQLType = 'String' | 'Int' | 'Float' | 'Boolean';

export interface Dictionary < T > {
    [index: string]: T;
}

export interface GQLParam {
	name: string;
	type: GQLType;
}
