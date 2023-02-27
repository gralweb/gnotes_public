<script setup>
	import { onMounted } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import { getCurrentUser, useFirebaseAuth } from 'vuefire'

	import { GoogleAuthProvider } from "firebase/auth"
	import * as firebaseui from 'firebaseui'
	import 'firebaseui/dist/firebaseui.css'

	import Loader from './Loader.vue'

	const auth = useFirebaseAuth()
	const providerGoogle = new GoogleAuthProvider()

	const router = useRouter()
	const route = useRoute()

	onMounted(async () => {
		const to = 
			route.query.redirect && typeof route.query.redirect === 'string'
			? route.query.redirect
			: '/'
		// Initialize the FirebaseUI Widget using Firebase.
		const ui = new firebaseui.auth.AuthUI(auth)
		const uiConfig = {
			callbacks: {
				signInSuccessWithAuthResult: function(authResult, redirectUrl) {
					// User successfully signed in.
					// Return type determines whether we continue the redirect automatically
					// or whether we leave that to developer to handle.
					return true
				},
				uiShown: function() {
				  	// The widget is rendered.
				  	// Hide the loader.
					document.getElementById('loader').style.display = 'none'
				}
			},
			// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
			signInFlow: 'popup',
			signInSuccessUrl: to,
			signInOptions: [
				// Leave the lines as is for the providers you want to offer your users.
				providerGoogle.providerId,
			],
			// // Terms of service url.
			// tosUrl: '#',
			// // Privacy policy url.
			// privacyPolicyUrl: '#'
		}
	
		const currentUser = await getCurrentUser()

		if(currentUser) {
			router.push(to)
		}

		// The start method will wait until the DOM is loaded.
		ui.start('#firebaseui-auth-container', uiConfig)
	})
</script>

<template>
	<section class="gn_login">
		<div id="firebaseui-auth-container"></div>
		<div id="loader">
			<Loader />
		</div>
	</section>
</template>

<style>
	.gn_login {
		display: flex;
		width: 100%;
		height: 75vh;
		place-items: center;
		place-content: center;
	}
</style>