/* eslint-disable no-mixed-spaces-and-tabs */
let _Vue = null

export default class VueRouter {
  static install (Vue) {
  	// eslint-disable-next-line no-mixed-spaces-and-tabs
  	if (VueRouter.install.installed) {
			return
		}
		VueRouter.install.installed = true

		_Vue = Vue

		_Vue.mixin({
			beforeCreate () {
				if (this.$options.router) {
					_Vue.prototype.$router = this.$options.router
					this.$options.router.init()
				}
			}
		})
	}
	
	constructor (options) {
		this.options = options
		this.routeMap = {}
		this.data = _Vue.observable({
			current: '/'
		})
	}

	init () {
		this.createRouteMap()
		this.initComponents(_Vue)
		this.initEvent()
	}

	createRouteMap () {
		this.options.routes.forEach(route => {
			this.routeMap[route.path] = route.component
		})
	}

	initComponents (Vue) {
		Vue.component('router-link', {
			name: 'router-link',
			props: {
				to: String
			},
			render (h) {
				return h('a', {
					attrs: {
						href: this.to
					},
					on: {
						click: this.clickHandler
					}
				}, [this.$slots.default])
			},
			// template: '<a :href="to"><slot></slot></a>'
			methods: {
				clickHandler (e) {
					history.pushState({}, '', this.to)
					this.$router.data.current = this.to
					e.preventDefault()
				}
			}
		})

		const self = this
		Vue.component('router-view', {
			name: 'router-view',
			render (h) {
				const component = self.routeMap[self.data.current]
				return h(component)
			}
		})
	}

	initEvent() {
		window.addEventListener('popstate', () => {
			this.data.current = window.location.pathname
		})
	}
}