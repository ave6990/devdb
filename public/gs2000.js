import { molar_mass, molar_volume, lel } from './converter.js'
import { reCalculate, calculate, coefficients, components, calcCoefficient } from './gs2000.lib.js'

const get_valves = () => {
    let valves = []

    for (let i = 1; i <= 10; i++) {
        valves.push(document.getElementById(`v${i}`))
    }
    return valves
}

/** Массив переключателей клапанов */
const valves = get_valves()

/** Обработчик событий на переключатели. */
valves.forEach( (valve) => {
    valve.addEventListener("change", (event) => {
        const states = read_valves_states()
        const in_data = readData()
        const out_data = reCalculate({coeff: in_data.coeff, 
            source_conc: in_data.source_conc, 
            valves: states,
        })
        out_data.target_unit = in_data.target_unit
        out_data.diluent = in_data.diluent
        out_data.component = in_data.component
        out_data.conc += h2sCorrection(out_data)
        displayResults(out_data)
    })
})

/** Коррекция расчета малых концентраций сероводорода согласно РЭ. */
const h2sCorrection = ({conc, component}) => {
    if (component = 'H2S' && conc >= 0.005 && conc <= 0.01) {
        log(`H2S коррекция:\n\t${conc} + 0.00025`)
        return 0.00025
    }
    return 0
}

/** Чтение и валидация концентрации исходной ГС. */
const readSourceConc = () => {
    const source_unit = document.getElementById('source_unit').value
    let source_conc = parseFloat(document.getElementById('source_conc').value.replace(',', '.'))
    const component = document.getElementById('component').value
    let k = 1

    if (source_unit == '%') {
        k = 10000
    }

    source_conc *= k

    if (source_conc > 20000) {
        warning('Содержание целевого компонента в исходной смеси не должно превышать 2 % об. (20000 млн-1)!')
        source_conc = 20000
    }

    if (lel[component]) {
        const lel05 = lel[component] / 2
        if (source_conc > lel05) {
            warning(`Содержание целевого компонента в исходной ГС не должно превышать 50 % НКПР (${component} - ${res_round(lel05 / 10000)} % об.)!`)
            source_conc = lel05
        }
    }

    document.getElementById('source_conc').value = source_conc / k
    
    return source_conc
}

/** Чтение и валидация целевой концентрации. */
const readTargetConc = () => {
    const source_conc = readSourceConc()
    let target_unit = document.getElementById('target_unit').value
    const diluent = document.getElementById('diluent').value
    const component = document.getElementById('component').value
    let target_conc = parseFloat(document.getElementById('target_conc').value.replace(',', '.'))
    let k = 1

    log('********Calculate*********')
    log(`Заданная концентрация:\n\t${target_conc} ${target_unit}`)
    if (target_unit == '%') {
        k = 10000
    } else if (target_unit == 'mg/m^3') {
        if (component == 'none') {
            warning('Для пересчета концентрации в мг/м^3 необходимо выбрать целевой компонент!')
            target_unit = 'ppm'
            document.getElementById('target_unit').value = target_unit
        } else {
            k = molar_volume[diluent] / molar_mass[component]
        }
    }

    target_conc *= k
    const max_k = calcCoefficient(coefficients[diluent])
    const min_k = coefficients[diluent][0]

    let max_conc = source_conc / max_k
    let min_conc = source_conc / min_k

    if (target_conc > max_conc) {
        target_conc = max_conc
        max_conc = res_round(convertUnits({
            conc: max_conc,
            target_unit: target_unit,
            diluent: diluent,
            component: component,
        }))

        k = max_k
        document.getElementById('target_conc').value = max_conc
        warning(`Концентрация ГС на выходе не может быть больше ${max_conc} ${target_unit}!`)
    }
    if (target_conc < min_conc) {
        target_conc = min_conc
        min_conc = res_round(convertUnits({
            conc: source_conc / min_k,
            target_unit: target_unit,
            diluent: diluent,
            component: component,
        }))

        k = min_k
        document.getElementById('target_conc').value = min_conc
        warning(`Концентрация ГС на выходе не может быть меньше ${min_conc} ${target_unit}!`)
    }

    return target_conc
}

document.getElementById('source_conc').addEventListener('change', readSourceConc)
document.getElementById('source_unit').addEventListener('change', readSourceConc)
document.getElementById('target_conc').addEventListener('change', readTargetConc)
document.getElementById('target_unit').addEventListener('change', readTargetConc)

components.forEach( (c) => {
    let option = document.createElement('option')
    option.value = c
    option.text = c
    document.getElementById('component').append(option)
} )

/* Округление результата (~ на 2 порядка точнее погрешности генератора) */
const res_round = (val) => {
    if (val == 0) {
        return 0
    }
    
    let exp = Math.log10(val)
    
    if (exp > 0) {
        exp = Math.ceil(exp)
    } else {
        exp = Math.floor(exp)
    }

    if (exp < 0) {
        exp = exp - 3
    } else {
        exp = exp - 5
    }

    if (exp < 0) {
        return Math.round(val * (10 ** Math.abs(exp))) / (10 ** Math.abs(exp))
    }

    return Math.round(val)
}

/** Чтение исходных данных. */
const readData = () => {
    const diluent = document.getElementById('diluent').value
    const source_unit = document.getElementById('source_unit').value
    let target_unit = document.getElementById('target_unit').value
    const component = document.getElementById('component').value
    let source_conc = readSourceConc()
    let target_conc = readTargetConc()

    return {
        component: component,
        diluent: diluent,
        coeff: coefficients[diluent],
        source_conc: source_conc,
        source_unit: source_unit,
        target_conc: target_conc,
        target_unit: target_unit,
    }
}

document.getElementById('btn_calc').addEventListener('click', (event) => {
    clear_valves()
    const in_data = readData()
    const out_data = calculate(in_data)
    out_data.target_unit = in_data.target_unit
    out_data.diluent = in_data.diluent
    out_data.component = in_data.component
    out_data.conc += h2sCorrection(out_data)

    displayResults(out_data)
} )

const warning = (message) => {
    log(`\nWARNING!!!:\n\t${message}\n`)
}

/** Вывод результата. */
const displayResults = (data) => {
    log(`Расчетная концентрация:\n\t${data.conc} ppm`)
    data.conc = convertUnits(data)
    log(`\t${data.conc} ${data.target_unit}\n\n`)
    document.getElementById('result_conc').value = `${res_round(data.conc)} ${data.target_unit}`
    data.valves.forEach( (valve) => {
        valves[valve - 1].checked = true
    } )
}

/** Конвертация единиц величин. */
const convertUnits = ({conc, target_unit, diluent, component}) => {
    if (target_unit == '%') {
        return conc / 10000
    } else if (target_unit == 'mg/m^3') {
        return conc * molar_mass[component] / molar_volume[diluent]
    }
    return conc
}

/** Сбросить положение переключателей. */
const clear_valves = () => {
    valves.forEach( (valve) => {
        valve.checked = false
    })
}

/** Вывести сообщение в текстовое поле лога. */
const log = (s) => {
    const textarea = document.getElementById('info')
    textarea.value += `\n${s}`
    textarea.scrollTop = textarea.scrollHeight
}

/** Очистить текстовое поле лога. */
const clearLog = () => {
    document.getElementById('info').value = ''
}

document.getElementById('info').addEventListener('dblclick', clearLog)

/** Прочитать положение переключателей. */
const read_valves_states = () => {
    const active_valves = valves.map( (valve, i) => {
        if (valve.checked == true) {
            return i + 1
        }
    })
    return active_valves.filter( (val) => {
        if (val) {
            return val
        }
    } )
}
