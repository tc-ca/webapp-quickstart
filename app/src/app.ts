import * as express from "express";
import * as morgan from "morgan";
import * as cors from "cors";

import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import { resolvers, typeDefs } from "./schema";
import { assertTests } from "./tests";

async function main(): Promise<void> {
	await assertTests();
	console.log("Building server...");
	try {
		const server = new ApolloServer({
			schema: makeExecutableSchema({
				typeDefs,
				resolvers,
			}),
			context: require("./dataloaders").create,
			introspection: true,
			playground: {
				// endpoint: "/app/graphql/",
			},
		});
		const app = express();

		app.set("port", process.env.PORT || 80);
		app.use(morgan("combined"));
		app.use(cors());
		app.get("/test", (req, res) => {
			res.setHeader("Content-Type", "application/json");
			const getCircularReplacer = (): ((key, value) => unknown) => {
				const seen = new WeakSet();
				return <T>(key: string, value: T): T | string => {
					if (typeof value === "object" && value !== null) {
						if (seen.has(value as Record<string, unknown>)) {
							return "[circular]";
						}
						seen.add(value as Record<string, unknown>);
					}
					return value;
				};
			};

			res.end(
				JSON.stringify(
					{
						headers: req.headers,
						req,
						res,
					},
					getCircularReplacer(),
				),
			);
		});
		app.use(
			server.getMiddleware({
				path: "/graphql",
			}),
		);
		app.listen({ port: app.get("port") }, () => {
			console.log(
				`🚀 Server ready at http://localhost:${app.get("port")}${
					server.graphqlPath
				}`,
			);
		});
	} catch (e) {
		console.error(`Error initializing GraphQL server\n${e}`);
	}
}

main();
