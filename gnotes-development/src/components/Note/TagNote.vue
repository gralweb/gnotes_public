<script setup>
	import { collection,  where, query } from 'firebase/firestore'
	import { useFirestore, useCollection, useCurrentUser } from 'vuefire'
	import { computed } from 'vue'
	import CardComponent from './../CardComponent.vue'
	import TrashButton from './../TrashButton.vue'
	import Loader from './../Loader.vue'

	const props = defineProps({
		// Esta props es la que se envia por el Path - Url 
		tag: String
	})

	const user = useCurrentUser()
	const db = useFirestore()
	const noteQuery = query(
		collection(db, 'notes'),
		where("userID", "==", user.value.uid),
		where('tags', 'array-contains', props.tag)
	)
	const notes = useCollection(noteQuery)

	const containData = computed(() => ((notes.value.length > 0) ? true : false))

	const loadedData = computed(() => ((notes.value) ? true : false))

	const deletedFilter = () => (
		containData ?
		notes.value.filter(({deleted}) => (deleted == true)) :
		null
	)

	const notesDeleted = computed(() => ( deletedFilter() ))

	const pinedFilter = (val) => (
		containData ?
		notes.value.filter(({pined, deleted}) => (pined == val & deleted == false)) :
		null
	)

	const notesPined = computed(() => (
		pinedFilter(true)
	))

	const notesNoPined = computed(() => (
		pinedFilter(false)
	))
</script>

<template>
	<section v-if="loadedData">
		<section class="gn_title_main">
			<h1><router-link to="/">Tags</router-link> > {{ tag }}</h1>
		</section>

		<section class="gn_main">
			<CardComponent url="/add" type="icon" :load="true">
	    		<i class="las la-plus"></i>
			</CardComponent>

			<CardComponent 
				v-if="notesPined && containData"
				v-for="note in notesPined"
				:key="note.id" 
				:id="note.id"
				:pined="note.pined"
				:deleted="note.deleted"
				:url="`/note/${note.url}`"
				:load="containData"
				to="notes"
				type="title"
				>
				{{ note.title }}
			</CardComponent>

			<CardComponent 
				v-if="notesNoPined && containData"
				v-for="note in notesNoPined"
				:key="note.id" 
				:id="note.id"
				:pined="note.pined"
				:deleted="note.deleted"
				:url="`/note/${note.url}`"
				:load="containData"
				to="notes"
				type="title"
				>
				{{ note.title }}
			</CardComponent>
		</section>

		<TrashButton 
			v-if="notesDeleted" 
			:countContent="notesDeleted.length" 
			content="notes"
		/>
	</section>
	<section v-else>
		<Loader />
	</section>
</template>