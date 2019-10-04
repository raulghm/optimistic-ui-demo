<template>
  <div class="hello">
    <section class="todoapp">
      <header class="header">
        <h1>Todos</h1>
        <input
          class="new-todo"
          autofocus
          autocomplete="off"
          placeholder="What needs to be done?"
          v-model="newTodo"
          @keyup.enter="addTodo"
        />
      </header>

      <section class="main" v-show="todos" v-cloak>
        <ul class="todo-list">
          <li
            v-for="todo in todos"
            class="todo"
            :key="todo.id"
            :class="{ completed: todo.completed, editing: todo == editedTodo }"
          >
            <div class="view">
              <input @click="completeTodo(todo.id)" class="toggle" type="checkbox" v-model="todo.completed" />
              <label >{{ todo.name }}</label>
            </div>
          </li>
        </ul>
      </section>
    </section>
  </div>
</template>

<script>
/* eslint-disable */
import gql from 'graphql-tag'

const TODOS = gql`
  query todos {
    todos {
      id
      name
      completed
    }
  }
`

const CREATE_TODO = gql`
  mutation createTodo($name: String!) {
    createTodo(name: $name) {
      todo {
        id
        name
        completed
      }
    }
  }
`

const COMPLETE_TODO = gql`
  mutation completeTodo($id: ID!) {
    completeTodo(id: $id) {
      todo {
        id
        name
        completed
      }
    }
  }
`

export default {
  name: 'Todo',

  data() {
    return {
      todos: [],
      newTodo: '',
      editedTodo: null
    }
  },

  apollo: {
    todos: {
      query: TODOS,
      update: res => {
        return res.todos
      },
    },
  },

  methods: {
    addTodo () {
      // We save the user input in case of an error
      const newTodo = this.newTodo
      // We clear it early to give the UI a snappy feel
      //this.newTodo = ''
      // Call to the graphql mutation
      this.$apollo
        .mutate({
          // Query
          mutation: CREATE_TODO,

          // Variables
          variables: {
            name: newTodo,
          },

          // Optimistic UI
          optimisticResponse: {
            __typename: 'Mutation',
            createTodo: {
              __typename: 'Query',
              todo: {
                __typename: 'Todo',
                id: -1,
                name: newTodo,
                completed: false
              },
            },
          },

          // Update the cache with the result
          update: (store, { data: { createTodo: { todo } } }) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({ query: TODOS })
            //data = JSON.parse(data)
            // Add our todo from the mutation to the end
            data.todos.push(todo)
            // Write our data back to the cache.
            store.writeQuery({
              query: TODOS,
              data
            })
            this.newTodo = ''
          },
        })
        .catch(error => {
          // Error
          console.error(error)
          alert('Ha ocurrido un error de conexión!')
          setTimeout(() => {
            // We restore the initial user input
            this.newTodo = newTodo
          }, 1000)
        })
    },

    completeTodo (id) {
      this.$apollo
        .mutate({
          // Query
          mutation: COMPLETE_TODO,

          // Variables
          variables: {
            id,
          },

          // Update the cache with the result
          update: (store, { data }) => {
            console.log(data)
          },
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: block;
  margin: 0 10px;
  text-align: left;
}
a {
  color: #42b983;
}
</style>
