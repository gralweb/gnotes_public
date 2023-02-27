<script setup>
	const props = defineProps({
		to: String,
	})
</script>

<template>
	<li>
		<router-link :to="to">
			<slot></slot>
		</router-link>
	</li>
</template>