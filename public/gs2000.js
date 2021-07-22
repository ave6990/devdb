import { calculate, coefficients } from './lib_gs2000.js'

const readData = () => {
    const coeff = coefficients[document.getElementById('diluent').value]
    const source_conc = parseFloat(document.getElementById('source_conc').value)
    const target_conc = parseFloat(document.getElementById('target_conc').value)
    return { coeff: coeff,
        source_conc: source_conc,
        target_conc: target_conc,
    }
}

document.getElementById('btn_calc').addEventListener('click', (event) => {
    const in_data = readData()
    const out_data = calculate(in_data)
    document.getElementById('result_conc').value = out_data.conc
    document.getElementById('valve_number').value = out_data.valves.join(', ')
} )
