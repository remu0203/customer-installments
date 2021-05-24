<template>
  <div id="app">
    <Customer/>
    <AppFooter/>
  </div>
</template>

<script>
import AppFooter from './components/layout/AppFooter.vue'
import Customer from './components/pages/Customer.vue'

export default {
  name: 'App',
  components: {
    AppFooter,
    Customer
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
