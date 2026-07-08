// Middleware para rutas no encontradas (404).
// Va DESPUES de todas las rutas: si ninguna respondio, cae aqui.
const middleware404 = ( req , res , next ) => {
    const error = new Error(`El endpoint al que llamas no existe`)
    error.status = 404
    next(error)
}

// Middleware central de errores (500). Tiene 4 parametros para que Express lo reconozca.
// Todo lo que se pase a next(error) acaba aqui.
const middleware500 = ( error , req , res , next ) => {
    const status = error.status || 500
    res.status(status).json({ message : error.message, data : null })
}

// Validacion del param :jugado -> debe ser true o false, y lo normaliza a Boolean.
const validarJugadoParam = ( req , res , next ) => {
    const { jugado } = req.params
    const jugadoNormalizado = String(jugado).trim().toLowerCase()

    if( jugadoNormalizado !== `true` && jugadoNormalizado !== `false` ){
        const error = new Error(`El parametro jugado debe ser true o false`)
        error.status = 400
        return next(error)
    }

    req.params.jugado = jugadoNormalizado === `true`
    next()
}

// Validacion del body al crear un partido -> local y visitante son obligatorios.
const validarPartidoBody = ( req , res , next ) => {
    const { local , visitante } = req.body

    if( !local || !visitante ){
        const error = new Error(`Un partido necesita equipo local y visitante`)
        error.status = 400
        return next(error)
    }

    next()
}

module.exports = {
    middleware404,
    middleware500,
    validarJugadoParam,
    validarPartidoBody
}