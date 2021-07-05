const items = {
	/*main: {
		url: '/',
		title: 'Главная',
	},
	conditions: {
		url: 'conditions',
		title: 'Условия микроклимата',
	},*/
	from_fgis: {
		url: 'mi_registry',
		title: 'Реестр СИ',
	},
	/*upload: {
		url: 'upload',
		title: 'Загрузка файлов на сервер',
	},*/
	calc: {
		url: '/',
		title: 'Метролог',
	},
}

const menu = document.getElementById('menu')

for (key in items) {
    const a = document.createElement('a')
    a.href = items[key].url
    a.textContent = items[key].title
    menu.append(a)
}
