import { database } from "../db";

export async function getExamples(codes: string[]): Promise<{}[]> {
	const rows = await database.query`
		SELECT 
		${{
			raw: Object.entries({
				/* fields */
			})
				.map(([k, v]: [string, string]) => `[${v}] as [${k}]`)
				.join(","),
		}}
		FROM VW019_PROJECT
		WHERE ${codes
			.map(id => [{ raw: `PROJECT_CD = ` }, { var: id }])
			.reduce(...database.concat(" OR "))}
	`;

	const map = {};
	for (const row of rows) map[row.code] = row;

	const rtn = codes.map(id => (id in map ? map[id] : null));

	return rtn;
}
