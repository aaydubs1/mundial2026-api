console.clear()
console.log(`🌱 Cargando datos en la base de datos`)

require('dotenv').config()

const mongoose = require('mongoose')
const fs       = require('fs')
const bcrypt   = require('bcryptjs')
const { Seleccion , Partido , Usuario } = require('./models')

const DATABASE_URL = process.env.DATABASE_URL

const cargarDatos = async () => {
    try {
        await mongoose.connect(DATABASE_URL)
        console.log(`✅ Conectado a MongoDB`)

        // Limpiamos las colecciones antes de volver a cargar
        await Seleccion.deleteMany()
        await Partido.deleteMany()

        // 1) Cargamos las selecciones
        const selecciones = JSON.parse(fs.readFileSync(`./data/selecciones.json` , `utf-8`))
        const seleccionesCreadas = await Seleccion.insertMany(selecciones)
        console.log(`✅ ${seleccionesCreadas.length} selecciones cargadas`)

        // Mapa codigo -> _id para enlazar los partidos por codigo (ESP, ARG...)
        const mapaSelecciones = {}
        seleccionesCreadas.forEach( seleccion => {
            mapaSelecciones[seleccion.codigo] = seleccion._id
        })

        // 2) Cargamos los partidos, cambiando los codigos por los _id reales
        const partidos = JSON.parse(fs.readFileSync(`./data/partidos.json` , `utf-8`))
        const partidosConReferencias = partidos.map( partido => ({
            ...partido,
            local     : mapaSelecciones[partido.localCodigo],
            visitante : mapaSelecciones[partido.visitanteCodigo]
        }))

        const partidosCreados = await Partido.insertMany(partidosConReferencias)
        console.log(`✅ ${partidosCreados.length} partidos cargados`)

        // 3) Creamos un usuario de administracion para el login
        await Usuario.deleteMany()
        const passwordHash = await bcrypt.hash(`mundial2026`, 10)
        await Usuario.create({ email : `admin@mundial.com`, password : passwordHash })
        console.log(`✅ usuario admin creado (admin@mundial.com / mundial2026)`)

        console.log(`🌱 Datos cargados correctamente`)
        process.exit(0)
    } catch (error) {
        console.log(`❌ Error al cargar los datos: ${error.message}`)
        process.exit(1)
    }
}

cargarDatos()