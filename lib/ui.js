const createTable = async (data, parent_id, table_id, editable = false) => {
	// it use the XLSX library yet
	const doc = await XLSX.utils.sheet_to_html(await XLSX.utils.aoa_to_sheet(data))
	// This code extract the table from html document.
	const table = (new DOMParser())
		.parseFromString(doc, 'text/html').body
		.getElementsByTagName('table')[0]
	table.id = table_id
	$(`#${parent_id}`).empty().html(table)
	if (editable) {
		editableCells(table_id)
	}
}

const editableCells = (table_id) => {
	$(`#${table_id} td`).click( (e) => {
		const t = e.target || e.srcElement
		const el_name = t.tagName.toLowerCase()

		if (el_name == 'input') {
			return false
		}

		const val = $(t).html()
		$(t).empty().append(`<input type='text' id='edit', value='${val}' />`)
		$('#edit').focus()
		$('#edit').blur( () => {
			const new_val = $('#edit').val()
			$(t).empty().html(new_val)
		} )
	} )
}
