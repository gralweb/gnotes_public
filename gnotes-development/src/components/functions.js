import { Timestamp } from 'firebase/firestore'
import { convertsTag, convertsUrl } from './../store/functions'
import { tagsTemplate, noteTemplate } from './../store/template'

export const createEditor = (parentDiv) => {
	return (
	    ClassicEditor
    	.create( parentDiv, { 
    		placeholder: "Escribe el contenido de tu Nota aqui...",
    		toolbar: [ 
    			'heading', 'bold', 'italic',
    			'|', 'undo', 'redo', '|',
    			'link', 'blockquote',
    			'numberedList', 'bulletedList'
    		]
    	})
    	.then( async (newEditor) => (
    		await newEditor
    	))
   		.catch( error => (error))
    )
}

export const handlerForm = ( event, editor, form_action ) => {
	event.preventDefault()
	const { title, tags, pined, userID } = event.target

	const tagsUrl = []
	const form_data = {
		title: title.value,
		tags: tagsUrl,
		content: editor.getData(),
		url: convertsUrl(title.value),
		pined: JSON.parse(pined.value),
		deleted: false,
		userID: userID.value,
		date: Timestamp.fromDate(new Date())
	}

	const form_data_tags = []
	if (tags.value == '') tags.value = 'no-tag'

	if (tags.value !== '') convertsTag(tags.value).forEach(tag => {
		const tagData = tagsTemplate(
			form_data,
		    { 
		    	title: tag,
		    	url: convertsUrl(tag),
		    	pined: (tag == 'no-tag') ? true : false,
		    	deleted: false,
			}
		)

		tagsUrl.push(tagData.url)
		form_data_tags.push(tagData)
	})
	// Hay que hacer una validacion de datos para no enviar notas vacias
	// lo unico que puede estar sin datos son los tags
	// para notas sin tags
	
	const status = form_action( noteTemplate( form_data ), form_data_tags )
	const getStatus = async () => ( await status )

	return {
		status: getStatus(),
		redirectTo: form_data.url
	}
}

export const formValidSend = ( errData, formData ) => {
	if (errData.includes('title')) {
		formData.title.parentElement.classList.add('error')
	}
}

export const formValidErrs = ({ title }) => {
	const datosErr = []

	if (!title.value || !RegExp(/\w/g).test(title.value)) {
		datosErr.push('title')
	}

	return datosErr
}

export const commandCheck = ( command, content ) => {
	const allContent = []
	
	allContent.push(...content.querySelectorAll("li"))
	allContent.push(...content.querySelectorAll("p"))
	allContent.push(...content.querySelectorAll("h2"))
	allContent.push(...content.querySelectorAll("h3"))
	allContent.push(...content.querySelectorAll("h4"))

	if (allContent.length > 0) {
		allContent.forEach((item) => {
			(item.textContent.includes(`(${command})`))
			? item.classList.add(command)
			: item.classList.remove(command)
		})
	}
}

export const transformDate = (date) => {
	const days = [ 'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado' ]
	const months = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ]
	
	const time = new Date(date * 1000)
	const ampm = (time.getHours() > 12) ? 'PM' : 'AM'
	const transformHour = (time.getHours() > 12) ? (time.getHours() - 12) : time.getHours()
	
	const formatTime = `${days[time.getDay()]} ${time.getDate()} de ${months[time.getMonth()]} del ${time.getFullYear()} a las ${transformHour}:${time.getMinutes()} ${ampm}`
	
	return formatTime
}