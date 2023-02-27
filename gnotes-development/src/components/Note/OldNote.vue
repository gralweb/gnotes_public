<script setup>
	import { doc, collection, where, query } from 'firebase/firestore'
	import { useCollection, useFirestore } from 'vuefire'
	import { onMounted, ref } from 'vue'
	import FormNote from './FormNote.vue'

	const props = defineProps({
	// 	tag: String,
		id: String
	})

	const contentRef = ref(null)

	const db = useFirestore()
	const noteQuery = query(
		collection(db, 'notes'),
		where('username', '==', 'gralweb'),
		where('url', '==', props.id)
	)
	const note = useCollection(noteQuery)
	const noteTime = () => {
		const days = [ 'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado' ]
		const months = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ]
		
		const time = new Date(note.value[0].date.seconds * 1000)
		const ampm = (time.getHours() > 12) ? 'PM' : 'AM'
		const transformHour = (time.getHours() > 12) ? (time.getHours() - 12) : time.getHours()
		
		const formatTime = `${days[time.getDay()]} ${time.getDate()} de ${months[time.getMonth()]} del ${time.getFullYear()} a las ${transformHour}:${time.getMinutes()} ${ampm}`
		
		return formatTime
	}
	const editNote = () => {
		console.log("edit")
	}

	onMounted(() => {
		contentRef.value.innerHTML = note.value[0].content
	})
</script>

<template>
	<section class="gn_title_main">
		<h1>Note > {{ note[0].title }}</h1>
	</section>

	<section class="gn_note_main">
		<section class="gn_note_header">
			<section class="gn_note_tags">
				<router-link v-for="tag in note[0].tags" :to="`/tag/${ tag }`">
					#{{ tag }}
				</router-link>
			</section>
			<section class="gn_note_date">
				<span>Creado:</span> {{ noteTime() }}
			</section>
		</section>
		<section ref="contentRef" class="gn_note_content"></section>
	</section>
</template>
