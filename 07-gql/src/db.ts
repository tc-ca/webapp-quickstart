import {Dictionary, GQLType, GQLParam} from './index.d';
import {
    ConnectionPool,
    Request,
    PreparedStatement,
    IProcedureResult,
    NVarChar,
    Float,
    ISqlType,
    Int,
	config
} from 'mssql';
import {inspect} from 'util';

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

const poolConnection:Promise<any> = pool.connect().catch(err => {
	console.error(`\nError connecting to pool, exiting: ${err}.`);
	process.exit(-1);
});

pool.on('error', err => {
    console.error(`SQL connection pool error has occurred\n${err}`);
});

class Database {
    query(query : string): Promise<any[]> {
        return new Promise(async (resolve, reject) => {
            await poolConnection;
            console.log(`Query\n${query}`);
            let start = Date.now();
            let rtn = [];
            const request: Request = pool.request();
            request.stream = true;
            request.query(query);
            request.on('error', err => {
                console.log(`\nError folding query\n${query}\n${err}\n`);
                reject(err);
            });
            request.on('row', row => {
                rtn.push(row);
            });
            request.on('done', result => {
                console.log(`Query got ${
                    rtn.length
                } rows and took ${
                    (Date.now() - start) / 1000
                } seconds`);
                resolve(rtn);
            });
        });
    };

    executeProcedure(procedureName : string, args : Dictionary<any>): Promise<any[]> {
        return new Promise(async (resolve, reject) => {
            await poolConnection;
            console.log(`Executing stored procedure [${procedureName}] with args \n${
                inspect(args)
            }.`);
            const request: Request = pool.request();
            request.stream = true;
            Object.entries(args).forEach(([key, value] : [string, any]) => {
                request.input(key, value);
            });
			request.on('error', e => {
				console.log(`Error executing stored procedure [${procedureName}]: ${e}`);
				reject(e);
			});
            request.execute(procedureName, function (err: any, results: IProcedureResult<any>, returnValue: any) {
                if (err) 
                    reject(err);
                
                resolve(returnValue);
			});
        });
    };

    parameterizedQuery(params : GQLParam[], args : Dictionary<any>, query : string): Promise < any[] > {
        return new Promise(async (resolve, reject) => {
            await poolConnection;
            const start = Date.now();
            const rows = [];
            const ps: PreparedStatement = new PreparedStatement(pool);
            params.forEach((param : GQLParam) => {
                switch (param.type) {
                    case 'String':
						ps.input(param.name, NVarChar);
						if (args[param.name] === undefined)
							args[param.name] = '';
                        break;
                    case 'Float':
						ps.input(param.name, Float);
						if (args[param.name] === undefined)
							args[param.name] = 0;
                        break;
                    case 'Int':
						ps.input(param.name, Int);
						if (args[param.name] === undefined)
							args[param.name] = 0;
                        break;
                    case 'Boolean':
						ps.input(param.name, Int);
						if (args[param.name] === undefined)
							args[param.name] = 0;
						else 
							args[param.name] = args[param.name] ? 1 : 0;
                        break;
                    default:
                        console.error(`Unknown type ${
                            param.type
                        } for argument ${
                            param.name
                        } = ${
                            args[param.name]
                        }`);
                        break;
                }
			});
			
			console.log(`PreparedStatement \n${query}`);
			console.dir(params);
			console.dir(args);
			
            ps.prepare(query, (err) => {
                if (err) 
                    reject(err);
				ps.stream = true;
				const request = ps.execute(args, err => reject(err));
				// ps.unprepare(err => reject(err));
				// resolve(request.recordset)
				request.on('row', row => {
					rows.push(row);
				});
				request.on('done', result => {
					ps.unprepare(err => reject(err));
					console.log(`Query took ${
						(Date.now() - start) / 1000
					} seconds.`);
					resolve(rows);
				});
            });
        });
    };

    tableQuery = `
SELECT 
    col.TABLE_NAME as [tableName],
    col.COLUMN_NAME as [dbName],
    CASE col.DATA_TYPE
        WHEN 'char'			THEN 'String'
        WHEN 'datetime'		THEN 'String'
        WHEN 'datetime2'	THEN 'String'
        WHEN 'float'		THEN 'Float'
        WHEN 'int'			THEN 'Int'
        WHEN 'numeric'		THEN 'Float'
        WHEN 'nvarchar'		THEN 'String'
        WHEN 'varbinary'	THEN 'String'
        WHEN 'varchar'		THEN 'String'
    END as [gqlType],
    MAX(CASE WHEN con.CONSTRAINT_TYPE = 'PRIMARY KEY' THEN 1 ELSE 0 END) AS [isPrimaryKey],
    MAX(COLUMNPROPERTY(OBJECT_ID(col.TABLE_SCHEMA+'.'+col.TABLE_NAME), col.COLUMN_NAME, 'IsIdentity')) AS [isIdentity]
FROM 
    INFORMATION_SCHEMA.COLUMNS col
    LEFT JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE concu
        ON col.TABLE_NAME = concu.TABLE_NAME 
        AND col.COLUMN_NAME = concu.COLUMN_NAME 
    LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS con
        ON col.TABLE_NAME = con.TABLE_NAME  
        AND con.CONSTRAINT_NAME = concu.CONSTRAINT_NAME
    WHERE col.TABLE_NAME <> 'sysdiagrams'
        AND col.TABLE_NAME IS NOT NULL 
        AND col.COLUMN_NAME IS NOT NULL
GROUP BY 
    col.TABLE_NAME, 
    col.COLUMN_NAME, 
    CASE col.DATA_TYPE
        WHEN 'char'			THEN 'String'
        WHEN 'datetime'		THEN 'String'
        WHEN 'datetime2'	THEN 'String'
        WHEN 'float'		THEN 'Float'
        WHEN 'int'			THEN 'Int'
        WHEN 'numeric'		THEN 'Float'
        WHEN 'nvarchar'		THEN 'String'
        WHEN 'varbinary'	THEN 'String'
        WHEN 'varchar'		THEN 'String'
    END
ORDER BY col.TABLE_NAME, col.COLUMN_NAME
`
}

export const database = new Database();
