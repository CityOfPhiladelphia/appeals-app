import Home from '../../../components/Home.vue';
import Detail from '../../../components/Detail.vue';
import NoFound from '../../../components/NoFound.vue';
export default [
	{ 'path': '*', component: Home, name: 'home' },
	{ 'path': '/', component: Home, name: 'home2' },
	{ 'path': '/filter/:date1/:date2/:region/:regionId', component: Home, name: 'fullFilter' },
	{ 'path': '/filter/:date1/:date2', component: Home, name: 'basicFilter' },
	{ 'path': '/appeals/:appealId', component: Detail, name: 'appealDetail' },
	{ 'path': '/not-found', component: NoFound, name: 'noFound' }
];