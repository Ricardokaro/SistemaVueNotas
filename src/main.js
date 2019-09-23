import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://ricardocaro-001-site1.ctempurl.com/api/Usuarios/Login';
new Vue({
  router,
  store,  
  render: h => h(App)
}).$mount('#app')
