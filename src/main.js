import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios';

Vue.use(Vuetify)

Vue.config.productionTip = false
axios.defaults.baseURL = '';
/* eslint-disable no-new */
new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  router,
  store,
  components: { App },
  render: h => h(App),
}).$mount('#app');

