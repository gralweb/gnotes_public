<script setup>
	import { doc, query, where, updateDoc, addDoc, collection } from "firebase/firestore"
	import { useFirestore, useCollection, useCurrentUser } from 'vuefire'
	import { computed, ref } from 'vue'
	import { onBeforeRouteUpdate, useRouter } from 'vue-router'

	import FormNote from './FormNote.vue'
	import Loader from './../Loader.vue'
	
	const props = defineProps({
		// Esta props es la que se envia por el Path - Url 
		id: String,
	})
	// TODO : Refactorizar todo para poder reutilzar codigo y simplificar los componentes
	// Osea llevar las peticiones de la DB que se repiten en distintos componentes
	// un unico archivo de funciones del Store - DB ( lo que seria un CRUD )
	const router = useRouter()
	const user = useCurrentUser()
	const db = useFirestore()	
	const noteQuery = ref(query(
		collection(db, "notes"),
		where("userID", "==", user.value.uid),
		where("url", "==", props.id)
	))
	const note = useCollection(noteQuery)
	const userTags = useCollection(query(
		collection(db, 'tags'),
		where("userID", "==", user.value.uid)
	))

	onBeforeRouteUpdate((to, from) => {
		if(to.params.id !== from.params.id) {
			noteQuery.value = query(
			    collection(db, "notes"),
				where("userID", "==", user.value.uid),
				where("url", "==", to.params.id)
			)
		}
	})
	// TODO : Para mejorar el rendimiento de todo esto necesito hacer un estado global
	// para no pedir los datos de nuevo a firebase y ahorrar recursos y mejorar el flujo
	const updateNote = async ( newNoteData, tagsData ) => {
		// TODO : Hacer comparacion de tags para ver si hay que agregar nuevos tags
		// a la coleccion de tags
		try {
			const noteRef = await doc(db, 'notes', note.value[0].id)
			// TODO : Hacer condiciones para ver que se cambio y asi
			// actualizar solo el cambio y evitar escrituras innecesarias y ahorrar
			// recursos de firebase ( comparar newNoteData con note )
			const updated = await updateDoc(noteRef, newNoteData)
			// Recorremos los tags enviados por el formulario
			// para comparar con los de la BD
			tagsData.forEach(async tagData => {
				// Hacemos un recorrido en la lista de tags guardados
				// para compararlos con los "nuevos", devuelve true o false
				// para luego guardar o no el tag en la DB
				const tagExist = userTags.value.some(userTag => {
					return userTag.url === tagData.url
				})

				// Comprobamos si existe el tag en la DB
				// si no existe se guarda
				if (!tagExist) await addDoc(collection(db, "tags"), tagData)
			})

			router.replace({ path: `/note/${newNoteData.url}` })

			return "success"
		} catch (err) {
			console.log(err)
			return "fail"
		}
	}
	
	const noteData = computed(() => ( note.value[0] ))
	const containData = computed(() => ( note.value[0] ? true : false ))
</script>

<template>
	<section v-if="containData">
		<section class="gn_title_main gn_title_main_note">
			<h1>
				<router-link v-for="tag in noteData.tags" :to="`/tag/${ tag }`">
					#{{ tag }}
				</router-link>
				<span> > note > {{ noteData.title }}</span>
			</h1>
		</section>
		<section class="gn_form_note_add">
			<FormNote
				form_title="Content"
				:redirect="false"
				:form_action="updateNote"
				:userID="user.uid"
				:id="noteData.noteId"
				:title="noteData.title"
				:tags="noteData.tags"
				:pined="noteData.pined ?? false"
				:deleted="noteData.deleted ?? false"
				:content="noteData.content"
			/>
		</section>		
	</section>

	<section v-else>
		<Loader />
	</section>
</template>