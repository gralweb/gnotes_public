<script setup>
	import { doc, updateDoc } from "firebase/firestore"
	import { useFirestore } from 'vuefire'
	import { onMounted } from 'vue'

	const props = defineProps({
		load: Boolean,
		url: String,
		type: String,
		id: String,
		to: String,
		pined: Boolean,
		deleted: Boolean
	})

	onMounted(() => {
		if (props.load) {
			const cards = document.querySelectorAll(".gn_card_container")
			setTimeout(() => {
				cards.forEach((card, index) => {
					const delayCalc = 70 * index
					card.style.transitionDelay = `${delayCalc}ms`
					card.classList.add('load')
				})
			}, 400)
		}
	})

	const deleteTag = async () => {
		const status = async () => {
			try {
				const db = useFirestore()
				const refDoc = await doc(db, props.to, props.id)
				const updated = await updateDoc(refDoc, {
					deleted: !props.deleted
				})

				// const deleteStatus = await deleteDoc(doc(db, props.to, props.id))
				return "success"
			} catch (err) {
				console.log(err)
				return "fail"
			}
		}
		const getStatus = await status()
		if (getStatus == "success") alert(props.deleted ? "Restaurado" : "Eliminado")
		else alert("error al eliminar")
	}

	const handlePined = async () => {
		try {
			const db = useFirestore()
			const refDoc = await doc(db, props.to, props.id)
			const updated = await updateDoc(refDoc, {
				pined: !props.pined
			})
			return "success"
		} catch (err) {
			console.log(err)
			return "fail"
		}
	}
</script>

<template>
	<section class="gn_card_container">
		<div v-if="type == 'title'" class="gn_form_options gn_card_options">
			<div 
				:class="`gn_form_options_dots gn_form_options_pined ${ pined ? 'pined' : '' }`" 
				:title="pined ? 'Desfijar' : 'Fijar'"
				@click="handlePined" 
				>
				<i class="las la-thumbtack"></i>
			</div>
			<div 
				:class="`gn_form_options_dots ${ deleted ? 'pined' : '' }`" 
				:title="deleted ? 'Restaurar' : 'Eliminar'"
				@click="deleteTag"
				>
				<i :class="`las la-trash-${deleted ? 'restore-alt' : 'alt'}`"></i>
			</div>
		</div>	
		<router-link :to="url" class="gn_card">
			<article class="gn_card_content">
				<p v-if="type === 'icon'" class="gn_card_content_icon">
					<slot></slot>
				</p>

				<p v-else class="gn_card_content_title">
					<slot></slot>
				</p>
			</article>
		</router-link>
	</section>
</template>