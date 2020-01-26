import { ConnectionPool, Request, config } from "mssql";
import { DBQueryTemplateParameter, DBQueryTemplateToplevelParameter } from ".";

const pool: ConnectionPool = new ConnectionPool({
	password: process.env.MSSQL_PASSWORD,
	database: process.env.MSSQL_DB_NAME,
	connectionTimeout: 15000,
	requestTimeout: 60000,
	stream: true,
	options: { readOnlyIntent: undefined, encrypt: false },
	user: process.env.MSSQL_USER,
	server: process.env.MSSQL_SERVER,
	port: parseInt(process.env.MSSQL_PORT),
	parseJSON: false,
} as config);

const poolConnection: Promise<void | ConnectionPool> = pool
	.connect()
	.catch(err => {
		console.error(`\nError connecting to pool, exiting: ${err}.`);
		process.exit(-1);
	});

pool.on("error", err => {
	console.error(`SQL connection pool error has occurred\n${err}`);
});

class Database {
	/**
	 * Template variables must be wrapped!
	 * Template ${} can return either an object or a list of objects.
	 * Valid objects:
	 * {raw: string} => no escaping
	 * {var: string} => var is escaped for sql injection
	 *
	 * Example usage:
	 *
	 * await database.query`
	 * 		SELECT *
	 * 		FROM FC001_EMPLOYEE
	 * 		WHERE EMPLOYEE_PRI_ID = ${{var: myID}}
	 * `;
	 *
	 * await database.query`
	 * 		SELECT
	 * 			${[
	 * 				{raw: '[9+10] AS NONESCAPED'},
	 * 				{var:  '\' THIS IS ESCAPED PROPERLY!!! --OR'},
	 * 			]}
	 * 	`;
	 *
	 */
	/* eslint-disable @typescript-eslint/no-explicit-any */
	async query(
		blocks: TemplateStringsArray,
		...args: DBQueryTemplateToplevelParameter[]
	): Promise<Record<string, any>[]> {
		const newBlocks = new Array(...blocks);
		const newArgs = [];
		console.log();
		// console.dir(blocks);
		// console.dir(args);
		for (let i = args.length - 1; i >= 0; i--) {
			const arg = args[i];
			if (Array.isArray(arg)) {
				if (arg.length === 0) {
					newArgs.unshift({ raw: `` });
				} else {
					for (let j = arg.length - 1; j >= 0; j--) {
						if (j != arg.length - 1) newBlocks.splice(i + 1, 0, "");
						newArgs.unshift(arg[j]);
					}
				}
			} else {
				newArgs.unshift(arg);
			}
		}

		// console.dir(newBlocks);
		// console.dir(newArgs);
		for (let i = 0; i < newBlocks.length && i < newArgs.length; i++) {
			const arg = newArgs[i];
			if (typeof arg !== "object")
				throw new Error("Template variable must be wrapped in object");
			if ("raw" in arg) {
				newBlocks.splice(
					i,
					2,
					newBlocks[i] +
						arg.raw +
						(i < newBlocks.length - 1 ? newBlocks[i + 1] : ""),
				);
				newArgs.splice(i, 1);
				i--;
			} else if ("var" in arg) {
				newArgs.splice(i, 1, arg.var);
			} else {
				throw new Error(
					"Template variable not marked with raw or var at position " +
						i +
						" " +
						require("util").inspect(arg),
				);
			}
		}
		// console.dir(newBlocks);
		// console.dir(newArgs);
		console.log(
			newBlocks
				.map(
					(block: string, i: number) =>
						block + (i < newArgs.length ? `\${${newArgs[i]}}` : ""),
				)
				.join(""),
		);
		await poolConnection;
		const start = Date.now();
		const rtn = [];
		const request: Request = pool.request();
		request.stream = true;
		request.query.apply(request, [newBlocks, ...newArgs]);
		request.on("row", row => {
			rtn.push(row);
		});
		return await new Promise((resolve, reject) => {
			request.on("error", err => {
				console.log(`\nError folding query\n${err}\n`);
				reject(err);
			});
			request.on("done", (/*result*/) => {
				console.log(
					`Query got ${rtn.length} rows and took ${(Date.now() - start) /
						1000} seconds`,
				);
				resolve(rtn);
			});
		});
	}

	concat(
		separator = ` OR `,
	): [
		(
			rtn: DBQueryTemplateParameter[],
			item: DBQueryTemplateParameter[],
		) => DBQueryTemplateParameter[],
		[],
	] {
		return [
			(
				rtn: DBQueryTemplateParameter[],
				v: DBQueryTemplateParameter[],
			): DBQueryTemplateParameter[] => {
				if (rtn.length > 0) rtn.push({ raw: separator });
				rtn.push(...v);
				return rtn;
			},
			[],
		];
	}
}

export const database = new Database();
