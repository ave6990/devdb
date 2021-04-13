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
		if (config.rows_count < config.records_count && (config.page_num + 1) * config.rows_count < config.records_count) {
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
		$('#records').show()
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
			const table = await createTable(records, 'records_table')
			$('#records_table_div').empty().html(table)
			$('#records_table td').dblclick( (e) => {
				const t = e.target || e.srcElement
				const row_number = parseInt($(t).attr('id').slice(5)) - 2
				console.info('Clicked row: ', row_number)
				if (row_number >= 0) {
					createRecordTable(data.data[row_number])
				}
			} )
			showPageNum()
		},
		error: (err) => {
			$('#records_status').html('Ошибка обращения к БД')
			console.log('Error occured: public/mi_registry.js')
		},
	} )
	showPageNum()
}

const createTable = async (data, table_id) => {
	// it use the XLSX library yet
	const doc = await XLSX.utils.sheet_to_html(await XLSX.utils.aoa_to_sheet(data))
	// This code extract the table from html document.
	const table = (new DOMParser())
		.parseFromString(doc, 'text/html').body
		.getElementsByTagName('table')[0]
	table.id = table_id
	return table
}

const createRecordTable = (data) => {
	const titles = {
		'fgis_id': 'Ссылка ФИФ ОЕИ',
		'registry_number': 'Номер ГРСИ',
		'name': 'Наименование',
		'types': 'Тип СИ',
		'manufacturer_total': 'Производитель',
		'manufacturer': 'Производитель массив',
		'type_description': 'Описание типа СИ',
		'verification_document': 'Методика поверки',
		'procedure': 'Процедура',
		'mi_info': 'Сведения о типе СИ',
		'certificate_life': 'Срок действия',
		'serial_number': 'Зав. номер',
		'verification_interval': 'МПИ',
		'periodic_verification': 'Периодическая поверка',
		'interval_years': 'МПИ, лет',
		'interval_months': 'МПИ, мес.',
		'mi_status': 'Статус СИ',
		'publication_date': 'Дата публикации',
		'record_number': 'Номер записи',
		'party_verification': 'Поверка партии',
		'status': 'Статус',
		'sort_key': 'Ключ сортировки',
	}

	const fields = ['registry_number', 'mi_status', 'name', 'types',
		'manufacturer_total', 'procedure', 'type_description', 'verification_document',
		'periodic_verification', 'verification_interval', 'mi_info', 'serial_number', 'certificate_life',
		'party_verification', 'status', 'publication_date', 'record_number', 'fgis_id']

	let rows = ''

	for (const item of fields) {
		rows = `${rows}<tr><td class='gray'>${titles[item]}</td><td>${data[item]}</td></tr>`
	}

	table = `<table id='record_table'>${rows}</table>`

	$('#record_table_div').empty().html(table)
	$('#records').hide()
	$('#record').show()
}

const showPageNum = () => {
	$('#tb_page').val(config.page_num + 1)
	$('#lbl_page').html(` из ${parseInt(config.records_count / config.rows_count) + 1}`)
}
