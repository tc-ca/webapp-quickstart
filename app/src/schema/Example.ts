import { gql } from "apollo-server-express";
// import * as graphQLFields from "graphql-fields";
// import { database } from "../db";

export const typeDef = gql`
	extend type Query {
		test: String!
	}
`;

export const resolvers = {
	Query: {
		async test(/*parent, args, context, info*/): Promise<string> {
			return "Hello, world!";
		},
	},
};
