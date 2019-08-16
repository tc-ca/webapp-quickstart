import { GraphQLResolveInfo } from 'graphql';
import * as graphqlFields from 'graphql-fields';
import { IncomingMessage } from 'http';

import { Dictionary } from '../..';
import { database } from '../../db';

export default {
    async todoList(args : any, msg : IncomingMessage, info : GraphQLResolveInfo) {
        const fields: Dictionary< any > = graphqlFields(info);
        return await database.query(`
            SELECT DISTINCT
				${
					[
						{gqlName: 'id', dbName: 'TODO_ID'},
						{gqlName: 'name', dbName: 'NAME_NM'},
						{gqlName: 'priority', dbName: 'PRIORITY_AMT'},
					]
						.filter((x:any) => x.gqlName in fields)
						.map((x: any) => `[${x.dbName}] AS [${x.gqlName}]`)
						.join(',\n')
				}
            FROM
                FC001_TODO
        `);
	},
    async todo(args : any, msg : IncomingMessage, info : GraphQLResolveInfo) {
        const fields: Dictionary< any > = graphqlFields(info);
		return (await database.query(`
			SELECT TOP(1)
					${
						[
							{gqlName: 'id', dbName: 'TODO_ID'},
							{gqlName: 'name', dbName: 'NAME_NM'},
							{gqlName: 'priority', dbName: 'PRIORITY_AMT'},
						]
							.filter((x:any) => x.gqlName in fields)
							.map((x: any) => `[${x.dbName}] AS [${x.gqlName}]`)
							.join(',\n')
					}
			FROM
				FC001_TODO
		`))[0];
	},
};