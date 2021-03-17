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
		url: 'from_fgis',
		title: 'Данные из ФИГС',
	},
	upload: {
		url: 'upload',
		title: 'Загрузка файлов на сервер',
	},
}

for (key in items) {
	$('#menu_items').append(`<li id='${key}'><a href='${items[key].url}'>${items[key].title}</a></li>`)
}
