import pug from 'pug'

const Calc = (req, res) => {
    let content = pug.renderFile('./views/gs2000.pug')
    res.render('index', { title: 'ГС-2000',
        header: 'Расчет режимов работы генератора ГС-2000',
        content: content }) 
}

export { Calc }
