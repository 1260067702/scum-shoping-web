import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [{
		path: '/',
		name: 'home-2',
		component: ()=>{
			return import("../views/Home-2.vue")
		},
		meta: {
			title: "服务器商城"
		}
	},
	{
		path: '/about',
		name: 'about',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: function() {
			return import( /* webpackChunkName: "about" */ '../views/AboutView.vue')
		}
	}, {
		path: "/main",
		name: "main",
		component: () => {
			return import("../views/mian.vue")
		},
		children: [{
			path: "main_view",
			name: "main_view",
			component: () => {
				return import("../views/main_view.vue")
			}
		}, {
			path: "admin_shoping",
			name: "admin_shoping",
			component: () => {
				return import("../views/admin_shoping.vue")
			}
		}, {
			path: "admin_gift",
			name: "admin_gift",
			component: () => {
				return import("../views/admin_gift.vue")
			}
		}, {
			path: "admin_transmit",
			name: "admin_transmit",
			component: () => {
				return import("../views/admin_transmit.vue")
			}
		}, {
			path: "jf",
			name: "jf",
			component: () => {
				return import("../views/jf.vue")
			}
		}, {
			path: "orders",
			name: "orders",
			component: () => {
				return import("../views/orders.vue")
			}
		}, {
			path: "admin_recharge",
			name: "admin_recharge",
			component: () => {
				return import("../views/admin_recharge.vue")
			}
		}, {
			path: "admin_user",
			name: "admin_user",
			component: () => {
				return import("../views/admin_user.vue")
			}
		}, {
			path: "map",
			name: "map",
			component: () => {
				return import("../views/map.vue")
			}
		}, {
			path: "admin_log",
			name: "admin_log",
			component: () => {
				return import("../views/admin_log.vue")
			},
			children: [{
				path: "admin_login_table",
				name: "admin_login_table",
				component: () => {
					return import("../views/admin_login_table.vue")
				}
			}, {
				path: "admin_enevt_kill",
				name: "admin_enevt_kill",
				component: () => {
					return import("../views/admin_enevt_kill.vue")
				}
			}, {
				path: "admin_gameplay",
				name: "admin_gameplay",
				component: () => {
					return import("../views/admin_gameplay.vue")
				}
			}, {
				path: "admin_log_list",
				name: "admin_log_list",
				component: () => {
					return import("../views/admin_log_list.vue")
				}
			}, {
				path: "admin_recovery",
				name: "admin_recovery",
				component: () => {
					return import("../views/admin_recovery.vue")
				}
			}]
		}, {
			path: "admin_recovery_list",
			name: "admin_recovery_list",
			component: () => {
				return import("../views/admin_recovery_list.vue")
			}
		}, {
			path: "admin_server_config",
			name: "admin_server_config",
			component: () => {
				return import("../views/admin_server_config.vue")
			}
		}]
	}
]

const router = new VueRouter({
	routes
})

export default router