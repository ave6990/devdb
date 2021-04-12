const items = {
	main: {
		url: '/',
		title: 'Главная',
	},
	conditions: {
		url: 'conditions',
		title: 'Условия микроклимата',
	},
	from_fgis: {
		url: 'mi_registry',
		title: 'Реестр СИ',
	},
	upload: {
		url: 'upload',
		title: 'Загрузка файлов на сервер',
	},
	calc: {
		url: 'mcalc',
		title: 'Метролог',
	},
}

for (key in items) {
	$('#menu_items').append(`<li id='${key}'><a href='${items[key].url}'>${items[key].title}</a></li>`)
}
