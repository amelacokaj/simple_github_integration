import Vue from "vue";
import { router } from './router';
import App from './App';

import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

import 'bootstrap/dist/css/bootstrap.min.css';

Vue.config.productionTip = false;
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
