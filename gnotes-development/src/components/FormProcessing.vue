<script setup>
	import Loader from './Loader.vue'

	const props = defineProps({
		prossState: String
	})
	
</script>

<template>
	<section class="gn_form_pross_container">
		<Loader v-if="prossState == 'loading'" class="inset" />

		<section class="gn_form_pross_success" v-if="prossState == 'success'"></section>

		<section class="gn_form_pross_fail" v-if="prossState == 'fail'"></section>
	</section>
</template>