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

// Sub-esquema de un gol (quien lo marco).
const goleadorSchema = new Schema({
    nombre   : { type : String  , required : true , trim : true }, // "Lamine Yamal"
    equipo   : { type : String  , enum : [`local`, `visitante`] , required : true }, // a que equipo le cuenta
    minuto   : { type : Number },                    // minuto del gol
    penal    : { type : Boolean , default : false }, // si fue de penalti
    enPropia : { type : Boolean , default : false }  // si fue en propia puerta
}, { _id : false })

// Sub-esquema de un jugador en la alineacion de un partido.
const jugadorAlineacionSchema = new Schema({
    nombre     : { type : String  , required : true , trim : true },
    equipo     : { type : String  , enum : [`local`, `visitante`] , required : true },
    posicion   : { type : String  , enum : [`Portero`, `Defensa`, `Centrocampista`, `Delantero`] },
    titular    : { type : Boolean , default : true },
    sustituyeA : { type : String  , trim : true } // solo para suplentes
}, { _id : false })

// Esquema del PARTIDO (entidad principal del CRUD).
const partidoSchema = new Schema({
    local            : { type : Schema.Types.ObjectId , ref : `Seleccion` , required : true },
    visitante        : { type : Schema.Types.ObjectId , ref : `Seleccion` , required : true },
    golesLocal       : { type : Number  , default : 0 },
    golesVisitante   : { type : Number  , default : 0 },
    penalesLocal     : { type : Number }, // opcional: solo si hay tanda
    penalesVisitante : { type : Number }, // opcional: solo si hay tanda
    goleadores       : { type : [goleadorSchema] , default : [] }, // quien marco cada gol
    alineaciones     : { type : [jugadorAlineacionSchema] , default : [] }, // once inicial + cambios
    formacionLocal     : { type : String , trim : true }, // ej "4-3-3"
    formacionVisitante : { type : String , trim : true },
    fecha            : { type : Date },
    fase             : { type : String  , trim : true },
    estadio          : { type : String  , trim : true },
    jugado           : { type : Boolean , default : false },
    estadisticas     : {
        local     : { type : estadisticasEquipoSchema , default : () => ({}) },
        visitante : { type : estadisticasEquipoSchema , default : () => ({}) }
    }
    
    
}, { timestamps : true , versionKey : false })

// Esquema de USUARIO (para el login y registro).
const usuarioSchema = new Schema({
    email    : { type : String , required : true , trim : true , lowercase : true , unique : true },
    password : { type : String , required : true },
    rol      : { type : String , enum : [`usuario`, `admin`] , default : `usuario` }
}, { timestamps : true , versionKey : false })

module.exports = {
    seleccionSchema,
    partidoSchema,
    usuarioSchema
}
