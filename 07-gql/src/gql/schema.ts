import { GQLType, Table, Column } from '..';
import tables from '../tables';

function getParamSchema(table: Table) {
    return table.params.map(({name, type} : {
        name: string,
        type: GQLType
    }) => name + ': ' + type);
}


export default `
type Query {
    todoList: [Todo!]!
}


type Mutation {
	
}

type Todo {
	id: Int
	name: String
	priority: Int
}
`;
