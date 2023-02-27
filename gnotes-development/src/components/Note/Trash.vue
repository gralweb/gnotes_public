<script setup>
	import { collection, where, query } from 'firebase/firestore'
	import { useFirestore, useCollection, useCurrentUser } from 'vuefire'
	import { computed, ref } from 'vue'
	import { onBeforeRouteUpdate } from 'vue-router'
	
	import CardComponent from './../CardComponent.vue'
	import Loader from './../Loader.vue'

	const props = defineProps({
		content: String
	})

	const user = useCurrentUser()
	const db = useFirestore()
	const contentQuery = ref(query(
	    collection(db, props.content),
		where("userID", "==", user.value.uid),
		where("deleted", "==", true)
	))

	onBeforeRouteUpdate((to, from) => {
		if(to.params.content !== from.params.content) {
			contentQuery.value = query(
			    collection(db, to.params.content),
				where("userID", "==", user.value.uid),
				where("deleted", "==", true)
			)
		}
	})

	const contentData = useCollection(contentQuery)

	const containData = computed(() => ((contentData.value.length > 0) ? true : false))

	const loadedData = computed(() => ((contentData.value) ? true : false))
</script>

<template>
	<section v-if="loadedData">
		<section class="gn_title_main">
			<h1>Trash</h1>
		</section>
		
		<section v-if="containData" class="gn_main">
			<CardComponent
				v-for="cont in contentData"
				:key="cont.id"
				:id="cont.id"
				:pined="cont.pined"
				:deleted="cont.deleted"
				:to="content"
				:load="containData"
				url="#"
				type="title"
				>
				{{ cont.title }}
			</CardComponent>
		</section>

		<section v-else class="gn_trash_nocontent">
			<span>No hay {{ content }} en la papelera</span>
		</section>
	</section>
	<section v-else>
		<Loader />
	</section>	
</template>