import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'

// Vue.use(VueRouter)
// const router = new VueRouter({
//   routes // (缩写) 相当于 routes: routes
// })
// +
// App.provide($bus)
// App.config.globalProperties.$bus = $bus
createApp(App).use(router).mount('#app')