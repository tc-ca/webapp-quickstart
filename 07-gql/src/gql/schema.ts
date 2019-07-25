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
