import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import ElementUI from 'element-ui' //element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css' //element-ui的css
import axios from "axios"
import moment from "moment"
import VueClipBoard from 'vue-clipboard2'
// let ul = "http://3366.scum.asia:520"
// let ul = "http://10.0.0.18:3366"
let ul = ""
Vue.use(VueClipBoard)
Vue.use(ElementUI) //使用elementUI
Vue.config.productionTip = false
Vue.prototype.url = ul
Vue.prototype.$cache = {}
Vue.prototype.$moment = moment
Vue.prototype.$axios = function(cfg) {
	cfg["url"] = ul + cfg["url"]
	cfg["method"] = "POST",
		cfg["headers"] = {
			Authorization: "Bearer " + localStorage.getItem("token")
		}
	return axios(cfg)
}
new Vue({
	store,
	router,
	render: function(h) {
		return h(App)
	}
}).$mount('#app')