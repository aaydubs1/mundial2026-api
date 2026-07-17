console.clear()
console.log(`🌱 Añadiendo estadisticas avanzadas`)

require('dotenv').config()

const mongoose = require('mongoose')
const { Seleccion , Partido } = require('./models')
const datos = require('./data/estadisticas-avanzadas.json')

const DATABASE_URL = process.env.DATABASE_URL

const cargar = async () => {
    try {
        await mongoose.connect(DATABASE_URL)
        console.log(`✅ Conectado a MongoDB`)

        for( const d of datos ) {

            const selLocal     = await Seleccion.findOne({ codigo : d.localCodigo })
            const selVisitante = await Seleccion.findOne({ codigo : d.visitanteCodigo })

            if( !selLocal || !selVisitante ) {
                console.log(`❌ ${d.localCodigo} o ${d.visitanteCodigo} no existe, me lo salto`)
                continue
            }

            const partido = await Partido.findOne({
                $or : [
                    { local : selLocal._id     , visitante : selVisitante._id },
                    { local : selVisitante._id , visitante : selLocal._id }
                ]
            })

            if( !partido ) {
                console.log(`⏩ ${d.localCodigo}-${d.visitanteCodigo} no esta en la base, me lo salto`)
                continue
            }

            const directo = partido.local.equals(selLocal._id)
            partido.estadisticasAvanzadas = directo
                ? d.estadisticasAvanzadas
                : { local : d.estadisticasAvanzadas.visitante , visitante : d.estadisticasAvanzadas.local }

            await partido.save()
            console.log(`✅ ${d.localCodigo}-${d.visitanteCodigo}`)
        }

        console.log(`🌱 Estadisticas avanzadas cargadas`)
        process.exit(0)
    } catch (error) {
        console.log(`❌ Error: ${error.message}`)
        process.exit(1)
    }
}

cargar()