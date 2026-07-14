console.clear()
console.log(`🟡 Iniciando la API del Mundial 2026`)

require('dotenv').config() // carga el .env en local

const express  = require('express')
const cors     = require('cors')
const morgan   = require('morgan')
const mongoose = require('mongoose')

const { partidosRouter , seleccionesRouter } = require('./router')
const { middleware404 , middleware500 } = require('./middlewares')

const app = express()

const PORT         = process.env.PORT || 3000
const DATABASE_URL = process.env.DATABASE_URL

    app.use(express.urlencoded({ extended : false }))
    app.use(express.json())
    app.use(cors())
    app.use(morgan(`dev`))

    app.use(`/api/partidos`    , partidosRouter)
    app.use(`/api/selecciones` , seleccionesRouter)

    app.use(middleware404)
    app.use(middleware500)
    app.use(`/api/login`, authRouter)

// Conectamos a Mongo y, solo si va bien, levantamos el servidor
mongoose.connect(DATABASE_URL)
    .then( () => {
        console.log(`✅ Conectado a MongoDB`)
        app.listen(PORT, () => console.log(`🔰 API escuchando en el puerto ${PORT}`))
    })
    .catch( error => {
        console.log(`❌ Error al conectar con MongoDB: ${error.message}`)
        process.exit(1)
    })