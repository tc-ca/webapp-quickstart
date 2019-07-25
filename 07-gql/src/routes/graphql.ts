import graphqlHTTP = require('express-graphql');
import {buildSchema} from 'graphql';

import resolver from '../gql/resolver';
import schema from '../gql/schema';

export default graphqlHTTP({
	schema: buildSchema(schema),
	rootValue: resolver,
	graphiql: true
});
