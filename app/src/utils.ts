export function mergeResolvers(
	resolvers,
	toJoin,
): Record<string, Record<string, Function>> {
	if (typeof toJoin !== "object")
		throw `Merging resolvers failed given ${toJoin}`;
	const entries = Object.entries(toJoin);
	for (const [type, dict] of entries) {
		if (resolvers[type] === undefined) resolvers[type] = {};
		const funcs = Object.entries(dict);
		for (const [name, f] of funcs) {
			if (resolvers[type][name] !== undefined)
				throw `Duplicate resolver method found: ${type}::${name}`;
			if (typeof f !== "function")
				throw `Resolver ${type}::${name} is not a function!`;
			resolvers[type][name] = f;
		}
	}
	return resolvers;
}
