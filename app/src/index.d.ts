export type GQLType = "String" | "Int" | "Float" | "Boolean";

export interface DBQueryVariable {
	var: string | number;
}

export interface DBQueryRawExpression {
	raw: string;
}

export type DBQueryTemplateParameter = DBQueryVariable | DBQueryRawExpression;

export type DBQueryTemplateToplevelParameter =
	| DBQueryTemplateParameter
	| DBQueryTemplateParameter[];

export interface GQLParam {
	name: string;
	type: GQLType;
}

export interface Column {
	tableName?: string;
	dbName: string;
	gqlName: string;
	gqlType: GQLType;
	isPrimaryKey: boolean;
	isIdentity: boolean;
}
