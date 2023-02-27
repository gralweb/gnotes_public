<script setup>
	const props = defineProps({
		countContent: Number,
		content: String
	})
</script>

<template>
	<router-link 
		:to="`/trash/${content}`" 
		:class="`gn_trash_button ${countContent > 0 ? 'visible' : 'hidden'}`"
	>
		<span>{{ countContent }}</span>
		<i class="las la-trash-alt"></i>
	</router-link>
</template>