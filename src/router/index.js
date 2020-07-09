// 原生 vue-rotuer
// import VueRouter from 'vue-router'
// 自定义 vue-router
import VueRouter from '../vuerouter/index'

import Vue from 'vue'

Vue.use(VueRouter)

const Foo = {
	render(h) {
		return h('div', {}, 'foo')
	}
}
const Bar = {
	render(h) {
		return h('div', {}, 'bar')
	}
}

const routes = [
	{
		path: '/foo',
		component: Foo
	},
	{
		path: '/bar',
		component: Bar
	}
]

const router = new VueRouter({
	mode: 'history',
	routes
})

export default router