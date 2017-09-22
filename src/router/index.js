import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home';
import Detail from '../components/Detail';
import NoFound from '../components/NoFound';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '*', component: Home, name: 'home' },
    { path: '/', component: Home, name: 'home-2' },
    { path: '/filter/:date1/:date2/:region/:regionId', component: Home, name: 'fullFilter' },
    { path: '/filter/:date1/:date2', component: Home, name: 'basicFilter' },
    { path: '/appeals/:appealId', component: Detail, name: 'appealDetail' },
    { path: '/not-found', component: NoFound, name: 'noFound' },
  ],
  base: '/apps/zoning-appeals/',
});
