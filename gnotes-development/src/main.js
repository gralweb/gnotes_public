import { createApp } from 'vue'
import './sass/style.scss'
import AppRouterManager from './AppRouterManager'
import App from './App.vue'
// Dependecias de Firebase
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './store/firebase'

const _app = createApp(App)

_app.use(VueFire, {
	firebaseApp,
	modules: [ VueFireAuth() ]
})
_app.use(AppRouterManager)
_app.mount('#app')
