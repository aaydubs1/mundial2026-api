const express = require('express')

const {
    getPartidos, getPartidoById, getPartidosByFase, getPartidosByJugado,
    postPartido, putPartido, patchPartido, deletePartido,
    getSelecciones, getSeleccionById,
    postSeleccion, putSeleccion, patchSeleccion, deleteSeleccion,
    postLogin
} = require('./controllers')

const { validarJugadoParam , validarPartidoBody } = require('./middlewares')

const partidosRouter    = express.Router()
const seleccionesRouter = express.Router()
const authRouter        = express.Router()


// ---------- Rutas de PARTIDOS ----------
partidosRouter.route(`/`)
    .get(  getPartidos )
    .post( validarPartidoBody , postPartido )

partidosRouter.get(`/fase/:fase`     , getPartidosByFase)
partidosRouter.get(`/jugado/:jugado` , validarJugadoParam , getPartidosByJugado)

partidosRouter.route(`/:_id`)
    .get(    getPartidoById )
    .put(    putPartido )
    .patch(  patchPartido )
    .delete( deletePartido )


// ---------- Rutas de SELECCIONES ----------
seleccionesRouter.route(`/`)
    .get(  getSelecciones )
    .post( postSeleccion )

seleccionesRouter.route(`/:_id`)
    .get(    getSeleccionById )
    .put(    putSeleccion )
    .patch(  patchSeleccion )
    .delete( deleteSeleccion )


// ---------- Ruta de LOGIN ----------
authRouter.route(`/`)
    .post( postLogin )


module.exports = {
    partidosRouter,
    seleccionesRouter,
    authRouter
}