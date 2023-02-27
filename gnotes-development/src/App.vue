<script setup>
	import Header from './components/Header/Header.vue'
	import Footer from './components/Footer/Footer.vue'
</script>

<template>
	<!-- Header -->
	<Header />
	<!-- --------- -->

	<main class="gn_main_route_view">
		<!-- Declarando lugar donde sera la ruta dinamica -->
		<router-view></router-view>
	</main>

	<!-- Footer -->
	<Footer />
	<!-- --------- -->
</template>
