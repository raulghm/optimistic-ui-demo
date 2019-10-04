<template>
  <div id="app">
    <Todo />
  </div>
</template>

<script>
import Todo from './components/Todo'

export default {
  name: 'app',

  components: {
    Todo
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
