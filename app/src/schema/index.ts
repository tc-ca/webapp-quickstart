import { mergeResolvers } from "../utils";
import { readdirSync } from "fs";
import { gql } from "apollo-server-express";

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
const files = readdirSync(__dirname, { withFileTypes: true });

export const typeDefs = [
	gql`
		type Query
	`,
];
export const resolvers = {};

for (const file of files) {
	if (
		file.isFile() &&
		file.name.endsWith(".js") &&
		!file.name.startsWith("index")
	) {
		/* eslint-disable @typescript-eslint/no-var-requires */
		const req = require(`./${file.name}`);
		if (!("typeDef" in req))
			throw `Schema element ${file.name} missing typeDef export!`;
		if (!("resolvers" in req))
			throw `Schema element ${file.name} missing resolvers export!`;

		typeDefs.push(req.typeDef);
		mergeResolvers(resolvers, req.resolvers);
	}
}
