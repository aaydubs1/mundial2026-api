const { model } = require('mongoose')
const { seleccionSchema , partidoSchema , usuarioSchema } = require('./schemas')

const Seleccion = model(`Seleccion` , seleccionSchema , `selecciones`)
const Partido   = model(`Partido`   , partidoSchema   , `partidos`)
const Usuario   = model(`Usuario`   , usuarioSchema   , `usuarios`)

module.exports = {
    Seleccion,
    Partido,
    Usuario
}