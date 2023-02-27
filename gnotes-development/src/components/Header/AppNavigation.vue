<script setup>
	import { signOut } from 'firebase/auth'
	import { useFirebaseAuth } from 'vuefire'
	import { useRouter } from 'vue-router'
	import { computed } from 'vue'

	import NavLink from './../general/NavLink.vue'

	const auth = useFirebaseAuth()
	const router = useRouter()

	const props = defineProps({
		menuState: Boolean,
		menuHandle: Function,
		currentUser: Object
	})

	const userData = computed(() => (
		props.currentUser !== null
		? props.currentUser.providerData[0]
		: null
	))

	const handleSignOut = () => {
		props.menuHandle()
		signOut(auth).then(() => {
			router.push('/login')
		}).catch((err) => {
			console.log(err)
		})
	}
</script>

<template>
	<section :class="`gn_navigation ${menuState ? 'open' : ''}`">
		<button type="button" class="gn_navigation_close" @click="menuHandle">
			<span></span>
			<span></span>
		</button>

		<ul v-if="currentUser !== null" class="gn_navbar_user" @click="menuHandle">
			<h2>Usuario</h2>
			<NavLink to="#" :title="userData.displayName"><img :src="userData.photoURL" :alt="userData.displayName"></NavLink>
			<span>{{ userData.displayName }}</span>
			<span>{{ userData.email }}</span>
		</ul>

		<!-- <ul v-if="currentUser !== null" class="gn_navbar_favs" @click="menuHandle">
			<h2>Favoritos</h2>
			<div class="gn_navbar_favs_content gn_navbar_favs_tags">
				<h2>Tags</h2>
				<NavLink to="#">Tag 1</NavLink>
				<NavLink to="#">Tag 2</NavLink>
				<NavLink to="#">Tag 3</NavLink>
			</div>
			<div class="gn_navbar_favs_content gn_navbar_favs_notes">
				<h2>Notas</h2>
				<NavLink to="#">Note 1</NavLink>
				<NavLink to="#">Note 2</NavLink>
				<NavLink to="#">Note 3</NavLink>
			</div>
		</ul> -->
		
		<ul class="gn_navbar_main" @click="menuHandle">
			<h2>Principal</h2>
			<NavLink to="/">Inicio</NavLink>
			<NavLink to="/add">Añadir</NavLink>
			<NavLink to="/trash/tags">Papelera de Tags</NavLink>
			<NavLink to="/trash/notes">Papelera de Notas</NavLink>
		</ul>

		<section v-if="currentUser !== null" class="gn_navigation_logout">
			<NavLink to="#" @click="handleSignOut">logout <i class="las la-power-off"></i></NavLink>
		</section>
	</section>
</template>