<template>
  <div id="app">
    <Customer/>
    <AppFooter/>
  </div>
</template>

<script>
import Vue from 'vue'
import Vue2Filters from 'vue2-filters'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { ModalPlugin, TablePlugin, BootstrapVue, IconsPlugin } from 'bootstrap-vue'

Vue.use(ModalPlugin)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(TablePlugin)
Vue.use(Vue2Filters)
Vue.use(require('vue-moment'));
Vue.filter('toCurrency', function (value) {
    if(value==''||value==null||value==undefined){
        value = 0;
    }
    var n = Number(value).toFixed(2);
    return Number(n).toLocaleString();
});



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
