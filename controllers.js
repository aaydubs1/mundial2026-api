const bcrypt = require('bcryptjs')
const { Partido , Seleccion , Usuario } = require('./models')

// ============ PARTIDOS ============

const getPartidos = async ( req , res , next ) => {
    try {
        const partidos = await Partido.find()
            .populate(`local`     , `nombre codigo bandera`)
            .populate(`visitante` , `nombre codigo bandera`)
        res.status(200).json({ message : `Lista de partidos`, data : partidos })
    } catch (error) {
        next(error)
    }
}

const getPartidoById = async ( req , res , next ) => {
    try {
        const { _id } = req.params
        const partido = await Partido.findById(_id)
            .populate(`local`     , `nombre codigo bandera`)
            .populate(`visitante` , `nombre codigo bandera`)
        if( !partido ){
            const error = new Error(`No existe ningun partido con el id ${_id}`)
            error.status = 404
            return next(error)
        }
        res.status(200).json({ message : `Partido encontrado`, data : partido })
    } catch (error) {
        next(error)
    }
}

const getPartidosByFase = async ( req , res , next ) => {
    try {
        const { fase } = req.params
        const partidos = await Partido.find({ fase })
            .populate(`local`     , `nombre codigo bandera`)
            .populate(`visitante` , `nombre codigo bandera`)
        res.status(200).json({ message : `Partidos de la fase ${fase}`, data : partidos })
    } catch (error) {
        next(error)
    }
}

const getPartidosByJugado = async ( req , res , next ) => {
    try {
        const { jugado } = req.params
        const partidos = await Partido.find({ jugado })
            .populate(`local`     , `nombre codigo bandera`)
            .populate(`visitante` , `nombre codigo bandera`)
        res.status(200).json({ message : `Partidos con jugado = ${jugado}`, data : partidos })
    } catch (error) {
        next(error)
    }
}

const postPartido = async ( req , res , next ) => {
    try {
        const partido = await Partido.create(req.body)
        res.status(201).json({ message : `Partido creado`, data : partido })
    } catch (error) {
        next(error)
    }
}

const putPartido = async ( req , res , next ) => {
    try {
        const { _id } = req.params
        const partido = await Partido.findByIdAndUpdate(_id , req.body , { new : true , runValidators : true })
        if( !partido ){
            const error = new Error(`No existe ningun partido con el id ${_id}`)
            error.status = 404
            return next(error)
        }
        res.status(200).json({ message : `Partido actualizado por completo`, data : partido })
    } catch (error) {
        next(error)
    }
}

const patchPartido = async ( req , res , next ) => {
    try {
        const { _id } = req.params
        const partido = await Partido.findByIdAndUpdate(_id , req.body , { new : true , runValidators : true })
        if( !partido ){
            const error = new Error(`No existe ningun partido con el id ${_id}`)
            error.status = 404
            return next(error)
        }
        res.status(200).json({ message : `Partido actualizado parcialmente`, data : partido })
    } catch (error) {
        next(error)
    }
}

const deletePartido = async ( req , res , next ) => {
    try {
        const { _id } = req.params
        const partido = await Partido.findByIdAndDelete(_id)
        if( !partido ){
            const error = new Error(`No existe ningun partido con el id ${_id}`)
            error.status = 404
            return next(error)
        }
        res.status(200).json({ message : `Partido eliminado`, data : partido })
    } catch (error) {
        next(error)
    }
}


// ============ SELECCIONES ============

const getSelecciones = async ( req , res , next ) => {
    try {
        const selecciones = await Seleccion.find()
        res.status(200).json({ message : `Lista de selecciones`, data : selecciones })
    } catch (error) {
        next(error)
    }
}

const getSeleccionById = async ( req , res , next ) => {
    try {
        const { _id } = req.params
        const seleccion = await Seleccion.findById(_id)
        if( !seleccion ){
            const error = new Error(`No existe ninguna seleccion con el id ${_id}`)
            error.status = 404
            return next(error)
        }
        res.status(200).json({ message : `Seleccion encontrada`, data : seleccion })
    } catch (error) {
        next(error)
    }
}

const postSeleccion = async ( req , res , next ) => {
    try {
        const seleccion = await Seleccion.create(req.body)
        res.status(201).json({ message : `Seleccion creada`, data : seleccion })
    } catch (error) {
        next(error)
    }
}

const putSeleccion = async ( req , res , next ) => {
    try {
        const { _id } = req.params
        const seleccion = await Seleccion.findByIdAndUpdate(_id , req.body , { new : true , runValidators : true })
        if( !seleccion ){
            const error = new Error(`No existe ninguna seleccion con el id ${_id}`)
            error.status = 404
            return next(error)
        }
        res.status(200).json({ message : `Seleccion actualizada por completo`, data : seleccion })
    } catch (error) {
        next(error)
    }
}

const patchSeleccion = async ( req , res , next ) => {
    try {
        const { _id } = req.params
        const seleccion = await Seleccion.findByIdAndUpdate(_id , req.body , { new : true , runValidators : true })
        if( !seleccion ){
            const error = new Error(`No existe ninguna seleccion con el id ${_id}`)
            error.status = 404
            return next(error)
        }
        res.status(200).json({ message : `Seleccion actualizada parcialmente`, data : seleccion })
    } catch (error) {
        next(error)
    }
}

const deleteSeleccion = async ( req , res , next ) => {
    try {
        const { _id } = req.params
        const seleccion = await Seleccion.findByIdAndDelete(_id)
        if( !seleccion ){
            const error = new Error(`No existe ninguna seleccion con el id ${_id}`)
            error.status = 404
            return next(error)
        }
        res.status(200).json({ message : `Seleccion eliminada`, data : seleccion })
    } catch (error) {
        next(error)
    }
}

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

        res.status(200).json({ message : `Login correcto`, data : { email : usuario.email , rol : usuario.rol } })
    } catch (error) {
        next(error)
    }

    
}


// POST /api/registro -> crea un usuario nuevo con rol "usuario"
const postRegistro = async ( req , res , next ) => {
    try {
        const { email , password } = req.body

        const existe = await Usuario.findOne({ email })
        if( existe ){
            const error = new Error(`Ya existe una cuenta con ese email`)
            error.status = 409
            return next(error)
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const usuario = await Usuario.create({ email , password : passwordHash })

        res.status(201).json({ message : `Cuenta creada`, data : { email : usuario.email , rol : usuario.rol } })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getPartidos, getPartidoById, getPartidosByFase, getPartidosByJugado,
    postPartido, putPartido, patchPartido, deletePartido,
    getSelecciones, getSeleccionById,
    postSeleccion, putSeleccion, patchSeleccion, deleteSeleccion, postLogin, postRegistro
}