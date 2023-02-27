// previously was
// import Router from 'vue-router'
import { getCurrentUser } from 'vuefire'
import { createRouter, createWebHistory } from 'vue-router'
// Importar Componentes
// 
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Note from './components/Note/Note.vue'
import TagNote from './components/Note/TagNote.vue'
import AddNote from './components/Note/AddNote.vue'
import Trash from './components/Note/Trash.vue'
// import EditNote from './components/Note/EditNote.vue'
 
const routes = [
    { path: '/login', component: Login, meta: { requiresAuth: false }, props: true },
	{ path: '/', component: Home, meta: { requiresAuth: true } },
	{ path: '/add', component: AddNote, meta: { requiresAuth: true } },
	{ path: '/tag/:tag', component: TagNote, meta: { requiresAuth: true }, props : true },
	{ path: '/note/:id', component: Note, meta: { requiresAuth: true }, props : true },
	{ path: '/trash/:content', component: Trash, meta: { requiresAuth: true }, props : true },
	// { path: '/edit/:id', component: EditNote, props : true },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const AppRouterManager = createRouter({
	// 4. Provide the history implementation to use. We are using the hash history for simplicity here.
	history: createWebHistory(),
	routes, // short for `routes: routes`
})

AppRouterManager.beforeEach(async (to) => {
	if (to.meta.requiresAuth) {
		const currentUser = await getCurrentUser()

		if(!currentUser) {
			return {
				path: '/login',
				query: {
					redirect: to.fullPath
				}
			}
		}
	}
})

export default AppRouterManager