import { database } from "./db";

export async function assertTests(): Promise<void> {
	console.log("Beginning tests...");
	try {
		console.log((await database.query`SELECT 'LOADED!'`)[0][""]);
		console.log((await database.query`SELECT ${{ raw: `'RAW'` }}`)[0][""]);
		console.log(
			(
				await database.query`SELECT ${{ raw: `'TWO ` }}${{
					raw: ` RAWS'`,
				}} WHERE 1=1`
			)[0][""],
		);
		console.log((await database.query`SELECT ${{ var: `VARIABLE` }}`)[0][""]);
		console.log(
			(await database.query`SELECT ${{ var: `'CHECK QUOTES'` }}`)[0][""],
		);
		console.log(
			(
				await database.query`SELECT ${{ raw: `'MIXED' ` }} WHERE 1=${{
					var: 1,
				}}`
			)[0][""],
		);
		console.log(
			(await database.query`SELECT 'CHECK EMPTY RAW' ${{ raw: "" }}`)[0][""],
		);
		console.log(
			(await database.query`SELECT 'CHECK EMPTY VAR' + ${{ var: "" }}`)[0][""],
		);
		console.log(
			(
				await database.query`SELECT ${[
					{ raw: `'LIST OF ` },
					{ raw: `RAWS'` },
				]} WHERE 1=1`
			)[0][""],
		);
		console.log(
			(
				await database.query`SELECT 'LIST OF MIXED' ${[
					{ raw: "WHERE 1=" },
					{ var: 1 },
					{ raw: " AND 2=2" },
				]}`
			)[0][""],
		);
		console.log(
			(
				await database.query`SELECT * FROM (SELECT 'MANY LIST' ${[
					{ raw: ` WHERE 1=` },
					{ var: 1 },
				]} ) a(z), (SELECT ' OF MIXED' ${[
					{ raw: ` WHERE 2=` },
					{ var: 2 },
				]} ) b(x) WHERE 3=3`
			)[0],
		);
		console.log(
			(
				await database.query`SELECT * FROM (SELECT 'DOUBLE' ${[]} ) a(z), (SELECT ' EMPTY' ${[]} ) b(x) WHERE 3=3`
			)[0],
		);
		console.log("All tests passed!");
		console.log();
	} catch (e) {
		console.error(e);
		process.exit();
	}
}
