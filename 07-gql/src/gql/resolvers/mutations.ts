import { GraphQLResolveInfo } from 'graphql';
import { IncomingMessage } from 'http';
import { database } from '../../db';

export default {
    async createTodo(args : any, msg : IncomingMessage, info : GraphQLResolveInfo) {
        await database.executeProcedure('SP_TODO_CREATE', {
			name: args.name,
			priority: args.priority
        });
        return 1;
	},
	async updateTodo(args : any, msg : IncomingMessage, info : GraphQLResolveInfo) {
        await database.executeProcedure('SP_TODO_CREATE', {
			id: args.id,
			name: args.name,
			priority: args.priority
        });
        return 1;
	},
	async deleteTodo(args : any, msg : IncomingMessage, info : GraphQLResolveInfo) {
        await database.executeProcedure('SP_TODO_CREATE', {
			id: args.id
        });
        return 1;
    },
}