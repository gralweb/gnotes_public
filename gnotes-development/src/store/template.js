export const tagsTemplate = ( { date, userID }, { title, url, pined, deleted } ) => {
	const obj = { title, date, url, userID, pined, deleted }

	return obj
}

export const noteTemplate = ( { title, tags, content, date, url, userID, pined, deleted } ) => {
	const obj = { title, tags, content, date, url, userID, pined, deleted }

	return obj
}

export const userTemplate = ( { username, email, password, date } ) => {
	const obj = { username, email, password, date }

	return obj
}
