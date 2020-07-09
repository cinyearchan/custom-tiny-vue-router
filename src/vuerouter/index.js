/* eslint-disable no-mixed-spaces-and-tabs */
let _Vue = null

function checkMode (options) {
	return options && options.mode && options.mode === 'history'
}

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
			current: checkMode(this.options) ? '/' : '#/'
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
		const self = this

		Vue.component('router-link', {
			name: 'router-link',
			props: {
				to: String
			},
			render (h) {
				// console.log(checkMode(self.options))
				return h('a', {
					attrs: {
						href: checkMode(self.options) ? this.to : `#${this.to}`
					},
					on: {
						click: this.clickHandler
					}
				}, [this.$slots.default])
			},
			// template: '<a :href="to"><slot></slot></a>'
			methods: {
				clickHandler (e) {
					if (checkMode(self.options)) {
						history.pushState({}, '', this.to)
					} else {
						// console.log(this.to)
						location.hash = this.to
					}
					
					this.$router.data.current = this.to
					e.preventDefault()
				}
			}
		})

		
		Vue.component('router-view', {
			name: 'router-view',
			render (h) {
				// console.log(self)

				const component = self.routeMap[checkMode(self.options) ? self.data.current : self.data.current.slice(1) ]
				return h(component)
			}
		})
	}

	initEvent() {
		if (checkMode(this.options)) {
			window.addEventListener('popstate', () => {
				this.data.current = window.location.pathname
			})
		} else {
			window.addEventListener('hashchange', () => {
				this.data.current = window.location.hash
			})
		}
	}
}