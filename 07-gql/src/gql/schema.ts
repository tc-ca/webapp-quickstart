export default `
type Query {
    todoList: [Todo!]!
}

type Mutation {
	deleteTodo(id: Int!): Int!	
}

type Todo {
	id: Int
	name: String
	priority: Int
}
`;
