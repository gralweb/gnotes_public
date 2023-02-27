<script setup>
	import { useFirestore, useCollection, useCurrentUser } from 'vuefire'
	import { collection, where, query } from 'firebase/firestore'
	import { computed, onMounted } from 'vue'
	import CardComponent from './CardComponent.vue'
	import TrashButton from './TrashButton.vue'
	import Loader from './Loader.vue'

	const user = useCurrentUser()
	// user.value.providerData[0].uid
	// user.value.uid
	const db = useFirestore()
	const tagsQuery = query(
	    collection(db, 'tags'),
		where("userID", "==", user.value.uid)
	)
	const tags = useCollection(tagsQuery)

	const containData = computed(() => ((tags.value.length > 0) ? true : false))

	const loadedData = computed(() => ((tags.value) ? true : false))

	const deletedFilter = () => (
		containData ?
		tags.value.filter(({deleted}) => (deleted == true)) :
		null
	)

	const tagsDeleted = computed(() => ( deletedFilter() ))

	const pinedFilter = (val) => (
		containData ?
		tags.value.filter(({pined, deleted}) => (pined == val & deleted == false)) :
		null
	)

	const tagsPined = computed(() => ( pinedFilter(true) ))

	const tagsNoPined = computed(() => ( pinedFilter(false)	))
</script>

<template>
	<section v-if="loadedData">
		<section class="gn_title_main">
			<h1>Tags</h1>
		</section>
		
		<section class="gn_main">
			<CardComponent url="/add" type="icon" :load="true">
	    		<i class="las la-plus"></i>
			</CardComponent>
			
			<CardComponent
				v-if="tagsPined && containData"
				v-for="tag in tagsPined"
				:key="tag.id"
				:id="tag.id"
				:pined="tag.pined"
				:deleted="tag.deleted"
				:url="`/tag/${tag.url}`"
				:load="loadedData"
				type="title"
				to="tags"
				>
				{{ tag.title }}
			</CardComponent>

			<CardComponent
				v-if="tagsNoPined && containData"
				v-for="tag in tagsNoPined"
				:key="tag.id"
				:id="tag.id"
				:pined="tag.pined"
				:deleted="tag.deleted"
				:url="`/tag/${tag.url}`"
				:load="loadedData"
				type="title"
				to="tags"
				>
				{{ tag.title }}
			</CardComponent>
		</section>

		<TrashButton 
			v-if="tagsDeleted"
			:countContent="tagsDeleted.length" 
			content="tags"
		/>
	</section>
	<section v-else>
		<Loader />
	</section>	
</template>
