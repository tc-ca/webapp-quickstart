export default `
type Query {
    todoList: [Todo!]!
}

type Mutation {
	createTodo(name: String!, priority: Int!): Int!
	updateTodo(id: Int!, name: String!, priority: Int!): Int!
	deleteTodo(id: Int!): Int!	
}

type Todo {
	id: Int
	name: String
	priority: Int
}
`;
