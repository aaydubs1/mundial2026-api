const { model } = require('mongoose')
const { seleccionSchema , partidoSchema , usuarioSchema } = require('./schemas')

const Seleccion = model(`Seleccion` , seleccionSchema , `selecciones`)
const Partido   = model(`Partido`   , partidoSchema   , `partidos`)
const Usuario   = model(`Usuario`   , usuarioSchema   , `usuarios`)

// POST /api/login -> comprueba email y contraseña
const postLogin = async ( req , res , next ) => {
    try {
        const { email , password } = req.body

        const usuario = await Usuario.findOne({ email })
        if( !usuario ){
            const error = new Error(`Credenciales incorrectas`)
            error.status = 401
            return next(error)
        }

        const coincide = await bcrypt.compare(password, usuario.password)
        if( !coincide ){
            const error = new Error(`Credenciales incorrectas`)
            error.status = 401
            return next(error)
        }

        res.status(200).json({ message : `Login correcto`, data : { email : usuario.email } })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    Seleccion,
    Partido,
    Usuario
}