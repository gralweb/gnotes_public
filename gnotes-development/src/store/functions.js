export const convertsTag = tagsStrings => {
	const cleanTags = []
	const newTags = tagsStrings
		.split(",")
		.forEach(t => {
			cleanTags.push(t.trim().toLowerCase())
		})
	return cleanTags
}

export const convertsUrl = titleString => {
	let replaceSpace = titleString.replaceAll(' ', '-')
	let titleToLowerCase = replaceSpace.toLowerCase()
	return titleToLowerCase
}
