const coefficients = {'воздух': [1176, 513, 253, 134, 70.4, 46.8, 36.3, 24.3, 14, 10.5],
    'азот': [1196, 522, 267, 136, 71.6, 47.6, 36.9, 24.7, 14.2, 10.7],
}

const readData = () => {
    const diluent = document.getElementById('diluent').value
    const source_conc = parseFloat(document.getElementById('source_conc').value)
    const target_conc = parseFloat(document.getElementById('target_conc').value)
    return { diluent: diluent,
        source_conc: source_conc,
        target_conc: target_conc,
    }
}

const calculate = ({diluent, source_conc, target_conc}) => {
    let res = 0
    let temp_res = target_conc
    let k = 0
    let k_list = []
    let index_list = []

    while (Math.abs(res - target_conc) / target_conc > 0.05) {
        k = getClosest(source_conc / temp_res, coefficients[diluent], k_list)
        index_list.push(coefficients[diluent].indexOf(k) + 1)
        k_list.push(k)
        res = source_conc / calc_k(k_list)
        temp_res = Math.abs(res - target_conc)
        console.log({k: calc_k(k_list), 
            res: res,
            temp_res: temp_res,
            k: k,
            index_list: coefficients[diluent].indexOf(k),
        })
    }

    return {conc: res, valves: index_list, }
}

const calc_k = (list) => {
    const divider = list.map( (val) => {
        return 1 / (val -1)
    } )
    .reduce( (a, b) => {
        return a + b
    } )

    return 1 / divider + 1
}

const getClosest = (value, list, k_list) => {
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

    let i = 0
    temp_list.sort(sort_func)[0]

    while (k_list.indexOf(temp_list[i]) >= 0) {
        i++
    }

    return temp_list[i]
    //return temp_list.sort(sort_func)[0]
}

document.getElementById('btn_calc').addEventListener('click', (event) => {
    const in_data = readData()
    const out_data = calculate(in_data)
    document.getElementById('result_conc').value = out_data.conc
    document.getElementById('valve_number').value = out_data.valves.join(', ')
} )
