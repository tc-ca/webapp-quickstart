import * as DataLoader from "dataloader";
import { getExamples } from "./example";

export const create = (/*{ req }*/): Record<
	string,
	DataLoader<string, {}, string>
> => {
	return {
		exampleLoader: new DataLoader((keys: string[]) => getExamples(keys)),
	};
};
