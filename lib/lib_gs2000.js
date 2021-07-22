/* Библиотека расчета режимов работы генератора ГС-2000.
* @author: ave6990
* @email: ave6990@ya.ru
* @version: 1.0
* @license: MIT
*/

/* Коэффициенты разбавления (паспортные значения) */
const coefficients = {'воздух': [1176, 513, 253, 134, 70.4, 46.8, 36.3, 24.3, 14, 10.5],
    'азот': [1196, 522, 267, 136, 71.6, 47.6, 36.9, 24.7, 14.2, 10.7],
}
const calculate = ({coeff, source_conc, target_conc}) => {
    let temp_coeff = [...coeff]
    let target_k = source_conc / target_conc
    let diff = source_conc
    let k_list = []

    while (temp_coeff.length > 1) {
        let k = getClosest(target_k, temp_coeff)
        temp_coeff.splice(temp_coeff.indexOf(k), 1)
        let res_k = calc_k([...k_list, k])
        let res_conc = source_conc / res_k

        if (Math.abs(res_conc - target_conc) < diff) {
            diff = Math.abs(res_conc - target_conc)
            k_list.push(k)
            target_k = source_conc / (target_conc - res_conc)
        } else {
            temp_coeff = []
        }

        /*console.log(`target_conc: ${target_conc}`)
        console.log(`res_conc: ${res_conc}`)
        console.log(`target_k: ${target_k}`)
        console.log(`k: ${k}`)
        console.log(`diff: ${diff}`)
        console.log(`k_list: ${k_list}`)
        console.log('\n')*/
    }

    const res = source_conc / calc_k(k_list)
    const index_list = k_list.map( (val) => {
        return coeff.indexOf(val) + 1
    } )

    return { conc: res, valves: index_list, }
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

/* Возвращает значение из массива `list` ближайшее большее
заданному значению `value` */
const getClosest = (value, list) => {
    let temp_list = [...list]

    const sort_func = (a, b) => {
        if (Math.abs(a - value) > Math.abs(b - value)) {
            return 1
        }
        if (Math.abs(a - value) < Math.abs(b - value)) {
            return -1
        }
        else {
            return 0
        }
    }

    temp_list.sort(sort_func)

    const filtered_list = temp_list.filter( (val) => {
        if (val >= value) {
            return true
        }

        return false
    } )

    if (filtered_list.length == 0) {
        return list[0]
    }

    return filtered_list[0]
}

const calc = (s_val, diluent) => {
    return (val) => {
        return calculate({coeff: coefficients[diluent],
            source_conc: s_val,
            target_conc: val, } )
    }
}

export { calculate, coefficients, calc }
