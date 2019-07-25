const resolver = {
    
    ...require('./resolvers/queries').default,
	...require('./resolvers/mutations').default,

};

// wraps each route so we can know response times
const resolverProxy = {};
const useCache = false;
for (let key of Object.keys(resolver)) {
    resolverProxy[key] = async (...args : any) => {
        let start = Date.now();
        let result: any;
        while (true) {
            result = await resolver[key](...args);
            if (result === undefined) 
                throw new Error("undefined result returned");
            

            break;
        }
        let finish = Date.now();
        console.log(`GraphQL resolved ${key} giving ${
            result.length
        } rows in ${
            (finish - start) / 1000
        } seconds (${
            args[0].length || 'no'
        } arguments)`);
        return result;
    }
}

export default resolverProxy;
