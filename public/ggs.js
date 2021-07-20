import { gases } from '../gases.js'

const form = document.forms.calcForm
const gasList = form.elements.gas

gases.forEach((item) => {
	gasList.options[gasList.options.length] = new Option(`${item.name} (${item.formula})`, item.value)
})

const calc_n = () => {
	form.elements.n_gas.value = gasList.options[gasList.selectedIndex].value
}

const readData = () => {
	let n = form.elements.n_gas.value
	let x_source = form.elements.x_source.value
	let x_set = form.elements.x_set.value
	let q_set = form.elements.q_set.value

	return {
				'n': n,
				'x_source': x_source,
				'x_set': x_set,
				'q_set': q_set,
			}
}

const calculate = (data) => {
	let k = (data.x_source - data.x_set) / data.x_set
	let q_source = data.q_set / (k + 1)
	let q_diluent = q_source * k
	let n_calc = 1 / (data.x_source / (data.n * 100) + (100 - data.x_source) / 100)
	let qi_source = q_source / n_calc
	let qi_diluent = q_diluent

	return {
				'k': k,
				'n_calc': n_calc,
				'q_source': q_source,
				'q_diluent': q_diluent,
				'qi_source': qi_source,
				'qi_diluent': qi_diluent,
			}
}

calcButton.onclick = () => {
	let data = readData()
	let res = calculate(data)

	form.elements.qi_source.value = res.qi_source
	form.elements.qi_diluent.value = res.qi_diluent
	form.elements.n_calc.value = res.n_calc
}

gasList.onchange = () => {
	calc_n()
}

calc_n()
