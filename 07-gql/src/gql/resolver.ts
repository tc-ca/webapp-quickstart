import { GraphQLResolveInfo } from 'graphql';
import { IncomingMessage } from 'http';

import { Column, Dictionary, Table } from '../';
import { database } from '../db';
import tables from './../tables';

const resolver = {
    async table(args : any, msg : IncomingMessage, info : GraphQLResolveInfo) {
        function sanitize(s: string): string {
            return s.replace(/\W+/g, '_').toLowerCase();
        }
        const tables: Dictionary< Table > = (await database.query(database.tableQuery)).reduce((map : any, col : Column & {
            tableName: string
        }) => {
            const tableName = sanitize(col.tableName);
            col.gqlName = sanitize(col.dbName);
            if (tableName in map) {
                map[tableName].columns.push(col);
            } else {
                map[tableName] = {
                    name: col.tableName,
                    columns: [col]
                };
            }
            return map;
        }, {});
        return tables[args.name];
    },

    ...require('./resolvers/queries').default,
	...require('./resolvers/mutations').default,

};

// wraps each route so we can know response times
const resolverProxy = {};
const useCache = false;
for (let key of Object.keys(resolver)) {
    resolverProxy[key] = async (...args : any) => {
        let start = Date.now();
        let result: any;
        while (true) {
            result = await resolver[key](...args);
            if (result === undefined) 
                throw new Error("undefined result returned");
            

            break;
        }
        let finish = Date.now();
        console.log(`GraphQL resolved ${key} giving ${
            result.length
        } rows in ${
            (finish - start) / 1000
        } seconds (${
            args[0].length || 'no'
        } arguments)`);
        return result;
    }
}

export default resolverProxy;
