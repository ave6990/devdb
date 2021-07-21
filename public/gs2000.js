/* Коэффициенты разбавления */
const coefficients = {'воздух': [1176, 513, 253, 134, 70.4, 46.8, 36.3, 24.3, 14, 10.5],
    'азот': [1196, 522, 267, 136, 71.6, 47.6, 36.9, 24.7, 14.2, 10.7],
}

const readData = () => {
    const coeff = coefficients[document.getElementById('diluent').value]
    const source_conc = parseFloat(document.getElementById('source_conc').value)
    const target_conc = parseFloat(document.getElementById('target_conc').value)
    return { coeff: coeff,
        source_conc: source_conc,
        target_conc: target_conc,
    }
}

const calculate = ({coeff, source_conc, target_conc}) => {
    let res = 0
    let temp_res = target_conc
    let k = 0
    let k_list = []
    let accuracy = 0.1
    let temp_coeff = [...coeff]

    //while (Math.abs(res - target_conc) / target_conc > accuracy && temp_coeff.length > 1) {
    while (res < target_conc && temp_coeff.length > 1) {
        k = getClosest(source_conc / temp_res, temp_coeff)
        k_list.push(k)

        res = source_conc / calc_k(k_list)

        while (res > target_conc && k_list.length > 0 && temp_coeff.length > 1) {
            const temp_k = k

            k_list.splice(k_list.length - 1)
            console.info(...k_list)
            console.info(...temp_coeff)
            temp_coeff.splice(temp_coeff.indexOf(k), 1)
            k = getClosest(source_conc / temp_res, temp_coeff)
            k_list.push(k)
            res = source_conc / calc_k(k_list)
            if (res > target_conc) {
                k_list.splice(k_list.length - 1)
                if (temp_coeff.length > 1) {
                    k_list.push(temp_k)
                }
                if (k_list.length < 1) {
                    k_list.push(coeff[0])
                }
                res = source_conc / calc_k(k_list)
            }
        }


        temp_res = Math.abs(res - target_conc)
        temp_coeff.splice(temp_coeff.indexOf(k), 1)

        console.log({k_list: k_list, 
            res: res,
            temp_res: temp_res,
            k: calc_k(k_list),
        })
    }

    const index_list = k_list.map( (val) => {
        return coeff.indexOf(val)
    } )

    return {conc: res, valves: index_list, }
}

/* Расчет коэффициента разбавления, при включении
нескольких клапанов */
const calc_k = (list) => {
    const divider = list.map( (val) => {
        return 1 / (val -1)
    } )
    .reduce( (a, b) => {
        return a + b
    } )

    return 1 / divider + 1
}

/* Возвращает значение из массива `list` самое близкое к
заданному значению `value` */
const getClosest = (value, list) => {
    let temp_list = [...list]

    const sort_func = (a, b) => {
        if (Math.abs(a - value) > Math.abs(b-value)) {
            return 1
        }
        if (Math.abs(a - value) < Math.abs(b - value)) {
            return -1
        }
        else {
            return 0
        }
    }

    return temp_list.sort(sort_func)[0]
}

document.getElementById('btn_calc').addEventListener('click', (event) => {
    const in_data = readData()
    const out_data = calculate(in_data)
    document.getElementById('result_conc').value = out_data.conc
    document.getElementById('valve_number').value = out_data.valves.join(', ')
} )
