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
				rec.publication_date = dateToString(new Date(rec.publication_date))
				console.log(rec.publication_date)
				rec.certificate_life = dateToString(new Date(rec.certificate_life))
				rec.fgis_id = `https://fgis.gost.ru/fundmetrology/registry/4/items/${rec.fgis_id}`
			}
			// jsonToTabel() from lib/ui.js
			const table = jsonToTable(data.data, {
					registry_number: 'Номер ГРСИ',
					name: 'Наименование',
					types: 'Тип СИ',
					manufacturer_total: 'Производитель',
					fgis_id: 'Ссылка ФГИС',
				},
				'records_table')
			$('#records_table_div').empty().html(table)
			$('#records_table td').dblclick( (e) => {
				const t = e.target || e.srcElement
				const row_number = parseInt($(t).parent().attr('id').slice(4))
				if (row_number >= 0) {
					createRecordTable(data.data[row_number])
				}
			} )
			showPageNum()
		},
		error: (err) => {
			$('#records_status').html('Ошибка обращения к БД')
			console.error('Error occured: public/mi_registry.js')
		},
	} )
	showPageNum()
}

const createRecordTable = (data) => {
	const titles = {
		'registry_number': 'Номер ГРСИ',
		'mi_status': 'Статус СИ',
		'name': 'Наименование',
		'types': 'Тип СИ',
		'manufacturer_total': 'Производитель',
		'procedure': 'Процедура',
		'type_description': 'Описание типа СИ',
		'verification_document': 'Методика поверки',
		'periodic_verification': 'Периодическая поверка',
		'verification_interval': 'МПИ',
		'mi_info': 'Сведения о типе СИ',
		'serial_number': 'Зав. номер',
		'certificate_life': 'Срок действия',
		'party_verification': 'Поверка партии',
		'status': 'Статус',
		'publication_date': 'Дата публикации',
		'record_number': 'Номер записи',
		'fgis_id': 'Ссылка ФИФ ОЕИ',
	}

	let rows = ''

	for (const item of Object.keys(titles)) {
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

const dateToString = (date, delimiter='.') => {
	const day = firstZero(date.getDate())
	if (isNaN(day)) {
		return undefined
	}
	const month = firstZero(date.getMonth() + 1)
	const year = date.getFullYear()
	return [day, month, year].join(delimiter)
}
