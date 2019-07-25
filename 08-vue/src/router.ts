import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';

import { Route } from '.';
import Home from './views/Home.vue';
import Todo from './views/Todo.vue';

Vue.use(Router)
export const routes:Route[] = [
    {
        name: 'Index',
        path: '/',
        redirect: { name: 'Home' },
	},
	{
		name: 'GraphQL',
		path: '/graphql',
		// component: Home,
		beforeEnter() {
			location.pathname += 'graphql/';
		},
	},
	{
		name: 'Home',
		path: '/home',
		component: Home,
		label: 'pages.home',
		icon: 'home',
	},
    {
        name: 'Todo',
        path: '/todo',
        component: Todo,
        label: 'Todo',
        icon: 'widgets'
    },
    {
        path: '*',
        redirect: { name: 'Index'},
    }
]

export default new Router({
	base: '/app/',
    routes: routes as RouteConfig[]
})