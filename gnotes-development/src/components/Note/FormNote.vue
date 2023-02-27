<script setup>
	import { doc, updateDoc } from "firebase/firestore"
	import { useFirestore } from 'vuefire'
	import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
	import { createEditor, handlerForm, formValidSend, formValidErrs } from './../functions'
	import { useRouter } from 'vue-router'
	import FormProcessing from './../FormProcessing.vue'
	import { commandCheck } from './../functions.js'

	const router = useRouter()
	const props = defineProps({
		form_action: Function,
		form_title: String,
		redirect: Boolean,
		userID: String,
		// Esto solo se usa en la edicion de notas
		id: String,
		title: String,
		tags: Array,
		pined: Boolean,
		deleted: Boolean,
		content: String,
	})

	let _editor = null
	const editorContentRef = ref(null)
	const content_ref = ref(null)
	const prossShow = ref(false)
	const prossState = ref("loading")

	const validCommand = (editorContent) => {
		commandCheck("listo", editorContent)
		commandCheck("proceso", editorContent)
		commandCheck("urgente", editorContent)
		commandCheck("error", editorContent)			
	}

	onMounted(async () => {
		_editor = await createEditor(content_ref.value)
		_editor.setData(props.content)
		
		editorContentRef.value = _editor.ui.view.element.querySelector(".ck-content")
		editorContentRef.value.addEventListener('keyup', (event) => {
			validCommand(editorContentRef.value)
		})
		
		validCommand(editorContentRef.value)

		const formAnim = document.querySelector(".gn_form_note")
		setTimeout(() => {
			formAnim.classList.add('load')
		}, 500)
	})

	onUpdated(() => {
		if (_editor !== null) {
			_editor.setData(props.content)
			validCommand(editorContentRef.value)
		}
	})

	onUnmounted(() => {
		_editor.destroy()
	})

	const submitForm = async e => {
		e.preventDefault()
		const errs = formValidErrs(e.target)
		
		if (errs.length) {
			formValidSend(errs, e.target)
		}
		else {
			if (props.form_title == "Content") {
				prossShow.value = true
			
				const st = await handlerForm(e, _editor, props.form_action)
				const status = await st.status
			
				if (typeof status == "string") {
					prossState.value = status

					setTimeout(() => {
						prossShow.value = false
					}, 1500)
				}
			}
			else {
				const st = await handlerForm(e, _editor, props.form_action)
				const status = await st.status
				const { redirectTo } = st

				if (status == "success") {
					router.push(`/note/${redirectTo}`)
				}
			}
		}
	}
	const cancelForm = () => {
		router.push("/")
	}
	const deleteNote = async () => {
		const status = async () => {
			try {
				const db = useFirestore()
				const refDoc = await doc(db, 'notes', props.id)
				const updated = await updateDoc(refDoc, {
					deleted: !props.deleted
				})

				return "success"
			} catch (err) {
				console.log(err)
				return "fail"
			}
		}
		const getStatus = await status()
		if (getStatus == "success") {
			if (props.deleted) {
				alert("Eliminado")
				cancelForm()			
			} else alert("Restaurado")
		}
		
		if (getStatus == "fail") alert("error al eliminar")
	}
	const handlePinedNote = async () => {
		try {
			const db = useFirestore()
			const noteRef = await doc(db, 'notes', props.id)
			const updated = await updateDoc(noteRef, {
				pined: !props.pined
			})
			return "success"
		} catch (err) {
			console.log(err)
			return "fail"
		}
	}
	const handleFocus = (event) => {
		event.target.parentElement.classList.remove("error")
	}
</script>

<template>
	<form class="gn_form_note" @submit="submitForm">
		<FormProcessing v-if="prossShow" :prossState="prossState" />

		<div class="gn_form_title">
			<h1>
				Gnotes <span>{{ form_title }}</span>
			</h1>
		</div>

		<div v-if="form_title == 'Content'" class="gn_form_options">
			<div class="gn_form_options_dots">
				<i class="las la-ellipsis-v"></i>
			</div>
			<ul class="gn_form_options_content">
				<li class="gn_form_option" @click="deleteNote">
					<i :class="`las la-trash-${deleted ? 'restore-alt' : 'alt'}`"></i>
					<span>{{ deleted ? 'Restaurar' : 'Eliminar' }}</span>
				</li>
				<li class="gn_form_option" @click="handlePinedNote">
					<i class="las la-thumbtack"></i>
					<span>{{ pined ? 'Desfijar' : 'Fijar' }}</span>
				</li>
			</ul>
		</div>

		<input type="hidden" id="userID" :value="userID">
		<input type="hidden" id="pined" :value="pined ?? false">

		<div class="gn_form_note_title gn_form_note_container">
			<!-- <label for="title">Titulo</label> -->
			<input 	autofocus maxlength="50" type="text" id="title" 
					placeholder="Coloca un titulo para tu Nota" 
					:value="title ?? ''" @focus="handleFocus" @blur="handleFocus"
			>

			<div class="title_error">
				<span>Debes colocar un titulo</span>
			</div>
		</div>
		<div class="gn_form_note_tags gn_form_note_container">
			<!-- 
				Hay que hacer un multiselector con los tags que ya existen en la DB
				para mejorar la UX
				Puede ser con Checkboxs
			-->
			<!-- <label for="tags">Tags</label> -->
			<input 	type="text" id="tags" 
					placeholder="Tags Eg: trabajo, escuela, juegos" 
					:value="tags ?? ''"
			>
		</div>
		<div class="gn_form_note_content gn_form_note_container">
			<!-- <label for="content">Nota</label> -->
			<section class="gn_form_note_content_editor">
				<div ref="content_ref"></div>
			</section>
		</div>

		<div class="gn_form_note_buttons">
			<button type="button" @click="cancelForm" class="gn_form_note_cancel">
				<i class="las la-arrow-left"></i>
				<span>
					Volver
				</span>
			</button>
			<button type="submit" class="gn_form_note_save">
				<i class="las la-save"></i>
				<span>
					Guardar
				</span>
			</button>
		</div>
	</form>
</template>