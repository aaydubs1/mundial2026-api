const { model } = require('mongoose')
const { seleccionSchema , partidoSchema } = require('./schemas')

// El tercer argumento fuerza el nombre EXACTO de la coleccion (sin pluralizar en ingles)
const Seleccion = model(`Seleccion` , seleccionSchema , `selecciones`)
const Partido   = model(`Partido`   , partidoSchema   , `partidos`)

module.exports = {
    Seleccion,
    Partido
}