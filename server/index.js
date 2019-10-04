const { ApolloServer, gql } = require('apollo-server')
const cuid = require('cuid')

// schema
const typeDefs = gql`
  type Query {
    todos: [Todo]
    todo(id: String): Todo
  }

  type Mutation {
    createTodo(name: String!): Query
    completeTodo(id: ID!): Query
  }

  type Todo {
    id: String
    name: String
    completed: Boolean
  }
`

const todos = [
  { id: 0, name: 'Sleep', completed: true },
  { id: 1, name: 'Eat', completed: false },
  { id: 2, name: 'Beer', completed: false }
]

// resolvers
const resolvers = {
  Query: {
    todos: (root, args, context) => {
      return todos
    },

    todo: (root, args, context) => {
      return todos[root.id || args.id]
    }
  },
  Mutation: {
    createTodo: (root, args, context) => {
      const todo = {
        id: cuid(),
        name: args.name,
        completed: false
      }
      todos.push(todo)
      todos[todo.id] = todo

      return todo
    },

    completeTodo: (root, args, context) => {
      const findIndex = todos.findIndex(todo => todo.id === parseInt(args.id))
      if (findIndex > -1) {
        todos[findIndex].completed = !todos[findIndex].completed
        return todos[findIndex]
      }
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
