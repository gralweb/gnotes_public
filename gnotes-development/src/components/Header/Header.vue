<script setup>
	import { ref, onMounted, onUpdated, computed } from 'vue'
	import { getCurrentUser } from 'vuefire'
	import AppNavigation from './AppNavigation.vue'

	const currentUser = ref(null)
	const stateMenu = ref(false)
	let _body = null

	const handleMenuOpen = () => {
		stateMenu.value = !stateMenu.value
		_body.classList.toggle("active")
	}

	const getUser = async () => {
		currentUser.value = await getCurrentUser()
	}

	const userData = computed(() => (
		currentUser.value !== null
		? currentUser.value.providerData[0]
		: null
	))

	onMounted(() => {
		_body = document.querySelector("body")
		getUser()
	})

	onUpdated(() => {
		getUser()
	})
</script>

<template>
	<header class="gn_header">
		<router-link v-if="currentUser !== null" to="#" :title="userData.displayName" class="gn_header_profile">
			<img :src="userData.photoURL" :alt="userData.displayName">
		</router-link>
		
		<router-link to="/">
			<section class="gn_brand">
				<figure>
						<img src="./../../assets/gnotes_logo.png" alt="GNOTES" title="GNOTES">
				</figure>
			</section>
		</router-link>
		
		<section class="gn_content_navigation">		
			<button type="button" class="gn_navigation_open" @click="handleMenuOpen">
				<span></span>
				<span></span>
				<span></span>
			</button>

			<AppNavigation :menuState="stateMenu" :menuHandle="handleMenuOpen" :currentUser="currentUser"/>
		</section>
	</header>
</template>
