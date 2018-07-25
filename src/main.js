// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import moment from 'moment';
import './main.css';
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.filter('readableDate', v => moment(v, 'MM/DD/YYYY').format('ll'));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store,
});
