import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home';
import LegacyHome from '../components/legacy/Home';
import Detail from '../components/Detail';
import NoFound from '../components/NoFound';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '*', component: Home, name: 'home' },
    { path: '/', component: Home, name: 'home-2' },
    { path: '/appeals/:appealId', component: Detail, name: 'appealDetail' },
    { path: '/appeals/:appealId/:date', component: Detail, name: 'appealDetail2' },

    { path: '/:year/:month', component: Home },
    { path: '/:year/:month/:region/:regionId', component: Home },

    // Legacy
    { path: '/filter/:date1/:date2/:region/:regionId', component: LegacyHome, name: 'fullFilter' },
    { path: '/filter/:date1/:date2', component: LegacyHome, name: 'basicFilter' },
    // /Legacy

    { path: '/not-found', component: NoFound, name: 'noFound' },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});
