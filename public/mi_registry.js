const config = {
	records_count: 0,
	rows_count: 20,
	page_num: 0,
	pages_count: 0,
}

$(document).ready( () => {
	$('#record').hide()
	getRecords()

	$('#btn_forward').click(async () => {
		if (config.rows_count < config.records_count && config.page_num * config.rows_count < config.records_count) {
			console.log('Process next page')
			config.page_num += 1
			getRecords()
		}
	} )

	$('#btn_previous').click(async () => {
		if (config.rows_count < config.records_count && config.page_num > 0) {
			console.log('Process previous page')
			config.page_num -= 1
			getRecords()
		}
	} )

	$('#btn_back').click(async () => {
		$('#record').hide()
	} )

	$('#tb_page').change(async () => {
		console.log(`Page number changed to ${$('#tb_page').val()}`)
		let num = parseInt($('#tb_page').val())
		let pages = parseInt(config.records_count / config.rows_count) + 1

		if (num < 1) num = 1
		if (num > pages) num = pages

		config.page_num = num - 1
		getRecords()
	} )

	$('#registry_number').change( () => {
		config.page_num = 0
		getRecords()
	} )

	$('#type').change( () => {
		config.page_num = 0
		getRecords()
	} )

	$('#records_status').click( () => {
		console.log('clicked_tb')
	} )
})

const getRecords = () => {
	$.ajax( {
		url: 'mi_registry',
		method: 'POST',
		cache: false,
		contentType: 'application/json',
		encoding: 'utf-8',
		data: JSON.stringify( {
			skip: config.page_num * config.rows_count,
			limit: config.rows_count,
			registry_number: $('#registry_number').val(),
			type: $('#type').val(),
		} ),
		success: async (data) => {
			config.records_count = data.total_count
			$('#records_status').html(`Записей в БД: ${data.total_count}`)
			for (rec of data.data) {
				rec.types = rec.types.join('; ').split(',').join('; ')
				rec.fgis_id = `https://fgis.gost.ru/fundmetrology/registry/4/items/${rec.fgis_id}`
			}
			let records = jsonToAOA(data.data,
				['registry_number', 'name', 'types', 'manufacturer_total', 'fgis_id'],
				['Номер ГРСИ', 'Наименование СИ', 'Тип СИ', 'Производитель', 'Ссылка ФГИС']
			)
			const table = await XLSX.utils.sheet_to_html(await XLSX.utils.aoa_to_sheet(records))
			$('#records_table').empty().html(table)
			showPageNum()
		},
		error: (err) => {
			$('#records_status').html('Ошибка обращения к БД')
			console.log('Error occured: public/mi_registry.js')
		},
	} )
	showPageNum()
}

const showPageNum = () => {
	$('#tb_page').val(config.page_num + 1)
	$('#lbl_page').html(` из ${parseInt(config.records_count / config.rows_count) + 1}`)
}
