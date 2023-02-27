<script setup>
	import { collection, addDoc, query, where } from "firebase/firestore"
	import { useFirestore, useCollection, useCurrentUser } from "vuefire"
	import { onMounted } from 'vue'
	import FormNote from './FormNote.vue'
	// Hay que crear un estado global para comprobar si ya se a hecho alguna peticion
	// y asi no repetir si no es necesario para ahorrar recursos de Firebase
	const user = useCurrentUser()
	const db = useFirestore()
	// Debes cambiar el username para que sea dinamico
	// con el username autenticado
	const tags_olds = useCollection( query(collection(db, 'tags'), where("userID", "==", user.value.uid)) )
	// Add a new document with a generated id
	const noteTagsAdd = async function (note_data, tags_data) {
		try {
			const noteAdd = await addDoc(collection(db, "notes"), note_data)
			
			if (tags_data.length) {
				tags_data.forEach(async news => {
					// Hacemos un recorrido en la lista de tags guardados
					// para compararlos con los "nuevos", devuelve true o false
					// para luego guardar o no el tag en la DB
					const tags_exist = tags_olds.value.some(old => {
						return old.title === news.title
					})
					// Comprobamos si existe el tag en la DB
					// si no existe se guarda
					if (!tags_exist) await addDoc(collection(db, "tags"), news)
				})
			}
			// Cuando todo se a completado devolvemos "success" para redirigir a Home
			return "success"
		} catch(err) {
			return "err"
		}
	}

	onMounted(() => {
		const formAnim = document.querySelector(".gn_form_note")
		setTimeout(() => {
			formAnim.classList.add('load')
		}, 500)
	})
</script>

<template>
	<section class="gn_form_note_add">
		<!-- TODO : Propiedad redirect y hacer que sea a la nota creada -->
		<FormNote 
			form_title="Add"
			:redirect="true"
			:form_action="noteTagsAdd"
			:userID="user.uid"

			:id="''"
			:title="''"
			:tags="[]"
			:pined="false"
			:deleted="false"
			:content="''"
		/>		
	</section>
</template>
