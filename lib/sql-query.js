/**
* @description This module contain a functions to create a query.
* 
*/

/**
* @description To generate a query to create table in db.
* @param {string} table_name
* @param {Object.<string, string>} fields - List of table fields. 
*   The key is name of field, the value is data type and other properties of field.
* @return {string} query
*/
const createQuery = (table_name, fields) => {
    let query = Object.keys(fields).map( (field) => {
        return `${field} ${fields[field]}`
    } ).join(', ')

    query = `CREATE TABLE ${table_name}(id integer primary key autoincrement, ${query})`

    return query
}

/**
* @description To generate a query to insert data in table.
* @param {string} table_name
* @param {string[]} fields
* @return {string}
*/
const insertQuery = (table_name, fields) => {
    const columns = fields.join(', ')
    const values = fields.map((item) => `?`).join(', ')

    return `INSERT INTO ${table_name} (${columns}) VALUES (${values})`
}

module.exports = { createQuery, insertQuery }
