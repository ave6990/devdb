const form = document.forms.from_fgis
const btn_search = form.elements.btn_from_fgis
const btn_upload = form.elements.btn_upload
const btn_forward = form.elements.btn_forward
const btn_back = form.elements.btn_back
const btn_reset = form.elements.btn_reset
const tb_page = form.elements.tb_page
let journal = ''

let config = {
	records_count: 0,
	rows_count: 20,
	page_num: 0,
	pages_count: 0
}

// XLSX.json_to_xlsx Данные из ФГИС вывести на страницу в виде таблицы.

btn_reset.onclick = async() => {
	config.page_num = 0
	config.records_count = 0
	config.pages_count = 0
	show_page_num()
	journal = []
	$('#out_data').html('')
}

const show_page_num = () => {
	tb_page.value = config.page_num + 1
	$('#lbl_page').html(` из ${parseInt(config.records_count / config.rows_count) + 1}`)
}

const json_to_aoa = (data) => {
	let res = []
	let i = 0
	res[i] = ['Номер ГРСИ', 'Тип', 'Модификация', 'Зав. №', 'Документ', 'Дата поверки', 'Годен до', 'Запись в ФИФ']
	data.forEach((row) => {
		i += 1
		res[i] = [row['mi.mitnumber'], row['mi.mitype'], row['mi.modification'], row['mi.number'],
			row['result_docnum'], row['verification_date'], row['valid_date'], get_record_fif(row['vri_id'])]
	})
	return res
}

const get_record_fif = (num) => {
	return `https://fgis.gost.ru/fundmetrology/cm/results/${num}`
}

const renderXLSX = async (data) => {
//	const workSheet = await XLSX.utils.json_to_sheet(data)
	let result
	let records = await data.fgis.docs
	if (data.journal.len > 0) {
		console.log(`${data.journal.len} records upload to Journal. `)
	} else {
		result = records
	}
	const workSheet = await XLSX.utils.aoa_to_sheet(json_to_aoa(data.fgis.docs))
	const table = await XLSX.utils.sheet_to_html(workSheet)
	$('#out_data').html(table)
}

btn_forward.onclick = async () => {
	if (config.rows_count < config.records_count && config.page_num * config.rows_count < config.records_count) {
		console.log('Process next page')
		config.page_num += 1
		btn_search.onclick()
		show_page_num()
	}
}

btn_back.onclick = async () => {
	if (config.rows_count < config.records_count && config.page_num > 0) {
		console.log('Process previous page')
		config.page_num -= 1
		btn_search.onclick()
		show_page_num()
	}
}

tb_page.onchange = async () => {
	let num = parseInt(tb_page.value)
	let pages = parseInt(config.records_count / config.rows_count) + 1

	if (num < 1) num = 1
	if (num > pages) num = pages

	config.page_num = num - 1
	btn_search.onclick()
	show_page_num()
}

btn_search.onclick = async () => {
	const name_listbox = form.elements.verifier
//	const name = name_listbox[name_listbox.selectedIndex].value
	const res_filter = {
		fq: {
			verification_year: form.elements.tb_verification_year.value,
			org_title: encodeURI(`*${form.elements.tb_organisation.value}*`),
			'mi.number': `*${form.elements.tb_mi_serial_number.value}*`,
			'mi.mitnumber': `*${form.elements.tb_mi_type_number.value}*`,
		},
		q: '*',
		fl: 'vri_id,mi.mitnumber,mi.mitype,mi.modification,mi.number,verification_date,valid_date,result_docnum',
		sort: 'verification_date+desc,org_title+asc',
		rows: config.rows_count,
		start: config.rows_count * config.page_num,
	}

	$.ajax({
		url: 'from_fgis',
		method: 'POST',
		cache: false,
		contentType: 'application/json',
		encoding: 'utf-8',
		data: JSON.stringify({
			filter: res_filter,
			journal: journal,
		}),
		success: async (data) => {
			console.log('Successfull upload.')
			config.records_count = data.fgis.numFound
			show_page_num()
//			await renderXLSX(data.fgis.docs)
			await renderXLSX(data)
		},
		error: (err) => {
			console.log('Error occured: public/from_fgis.js')
		},
		complete: () => {
			console.log('Complete')
		}
	})
}

btn_upload.onclick = async () => {
	const file = document.getElementById('file').files[0]
	journal = await file.text()
}
