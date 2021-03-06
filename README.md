# devdb

БД средств измерения.

## Versions

* v0.7.0 - Добавлена страничка поиска результатов поверки во ФГИС Аршин.
* v0.6.0 - Новый алгоритм расчета режимов работы. Доработан интерфейс приложения ГС-2000.
* v0.5.3 - Повышена точность расчета режимов работы ГС-2000. Расчеты вынесены в отдельную библиотеку.
* v0.5.2 - Возвращает ближайшее меньшее к заданному значение расчетной концентрации.
* v0.5.1 - Проработка расчета ГС-2000. Бесконечный цикл при больших коэффициентах разбавления.
* v0.5.0 - Добавлен расчет ГС-2000.
* v0.4.4 - Улучшена стилизация страниц.
* v0.4.3 - Удален файл `public/ui.js`, который мешал импорту `lib/ui.js`.
* v0.4.2 - Добавлено `app.use(express.static('./lib'))` для использования импорта ES6 в `public/*.js`.
* v0.4.1 - Исправлена ошибка: не отображалась информация о записи ФГИС в разлеле "Реестр СИ".
* v0.4.0 - Переработка страницы БД Метролог.
* v0.3.0 - Используется `import` ES6.
* v0.2.1 - Patch: adapted for Android devices.
* v0.2.0 - The API FIF changed. Added link to pdf-documents.
* v0.1.0 - Add registry of mesurements instrument. This is first step on the long path.
