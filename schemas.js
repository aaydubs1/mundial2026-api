const { Schema } = require('mongoose')

// Esquema de la SELECCION (entidad ligera de apoyo).
const seleccionSchema = new Schema({
    nombre        : { type : String , required : true , trim : true , unique : true },
    codigo        : { type : String , required : true , trim : true , uppercase : true , unique : true }, // ESP, ARG...
    confederacion : { type : String , trim : true }, // UEFA, CONMEBOL...
    bandera       : { type : String , trim : true }  // URL de la imagen
}, { timestamps : true , versionKey : false })

// Sub-esquema con las 13 estadisticas de un equipo dentro de un partido.
// Se usa dos veces: para el local y para el visitante.
const estadisticasEquipoSchema = new Schema({
    posesion           : { type : Number , default : 0 }, // %
    distanciaRecorrida : { type : Number , default : 0 }, // km
    xG                 : { type : Number , default : 0 },
    grandesOcasiones   : { type : Number , default : 0 },
    tirosTotales       : { type : Number , default : 0 },
    atajadas           : { type : Number , default : 0 },
    sprints            : { type : Number , default : 0 },
    corners            : { type : Number , default : 0 },
    faltas             : { type : Number , default : 0 },
    pases              : { type : Number , default : 0 },
    entradas           : { type : Number , default : 0 },
    tirosLibres        : { type : Number , default : 0 },
    tarjetasAmarillas  : { type : Number , default : 0 }
}, { _id : false })

// Esquema del PARTIDO (entidad principal del CRUD).
const partidoSchema = new Schema({
    local            : { type : Schema.Types.ObjectId , ref : `Seleccion` , required : true },
    visitante        : { type : Schema.Types.ObjectId , ref : `Seleccion` , required : true },
    golesLocal       : { type : Number  , default : 0 },
    golesVisitante   : { type : Number  , default : 0 },
    penalesLocal     : { type : Number }, // opcional: solo si hay tanda
    penalesVisitante : { type : Number }, // opcional: solo si hay tanda
    fecha            : { type : Date },
    fase             : { type : String  , trim : true },
    estadio          : { type : String  , trim : true },
    jugado           : { type : Boolean , default : false },
    estadisticas     : {
        local     : { type : estadisticasEquipoSchema , default : () => ({}) },
        visitante : { type : estadisticasEquipoSchema , default : () => ({}) }
    }
}, { timestamps : true , versionKey : false })

module.exports = {
    seleccionSchema,
    partidoSchema
}