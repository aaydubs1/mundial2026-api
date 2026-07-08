const { model } = require('mongoose')
const { seleccionSchema , partidoSchema } = require('./schemas')

// Creamos los modelos a partir de los esquemas y los exportamos.
const Seleccion = model(`Seleccion` , seleccionSchema)
const Partido   = model(`Partido`   , partidoSchema)

module.exports = {
    Seleccion,
    Partido
}