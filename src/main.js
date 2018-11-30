// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Table, TableColumn } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {ajax_get, ajax_post } from './tools/ajax'
import { baseTime } from './config/config.js';

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(Table);
Vue.use(TableColumn);

Vue.prototype.$get = ajax_get;
Vue.prototype.$post = ajax_post;
Vue.prototype.$time = baseTime;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
