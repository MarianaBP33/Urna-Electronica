const { Pool } = require('pg');
const{encrypt, compare } = require('../helpers/handlerBcrypt')
const state = require('../store/state');
var bcrypt = require('bcryptjs');


const pool = new Pool({
    host: '159.89.189.44',
    user: 'postgres',
    password: 'root',
    database: 'postgres',
    port: '5432'
});

const loginCtrl = async(req,res) => {
    const{password} = req.body

    try{
        const user = await pool.query('SELECT username, password FROM usuarios WHERE password = $1',[password]);
        const psw = user.rows[0].password;
        const salt = bcrypt.genSaltSync();
        passwordHash = bcrypt.hashSync( psw, salt );
        const validPassword = bcrypt.compareSync( password, passwordHash);
        if(user.rows[0].username == 'registro' && validPassword){
            res.status(201).json({
                message:'Contraseña Válida',
            })
            return 
        }else if(user.rows[0].username == 'abrir' && validPassword){
            res.status(202).json({
                message:'Contraseña Válida',
            })
            return
        }else{
            res.status(400).json({
                message:'Contraseña Inválida',
                //token:tokenSession
            })
            return
        }
        //const checkPasswsord = await compare(password, psw.encrypt())
        //const tokenSession = await tokenSign(user)
        
    }catch(error){
        console.log(error);
        res.status(400).json({
            message:'Contraseña Inválida',
            //token:tokenSession
        })
    }
}


const getMunicipios = async(req, res) => {
    const response = await pool.query('SELECT municipio_nombre,municipio_id, estado_id FROM municipios');
    res.send(response.rows);
};

const getEstados = async(req, res) => {
    const response = await pool.query('SELECT estado_nombre,estado_id FROM estados');
    res.send(response.rows);
};

const getMunicipioFromState = async(req,res) =>{
    const{estado_id} = req.params;
    const response = await pool.query('SELECT municipio_nombre,municipio_id,estado_id FROM municipios WHERE estado_id = $1',[estado_id]);
    res.send(response.rows)
};

const getPartidos = async(req, res) => {
    const response = await pool.query('SELECT partido_nombre, partido_id FROM partido');
    res.send(response.rows);
};

const getElecciones = async(req, res) => {
    const response = await pool.query('SELECT eleccion_nombre FROM elecciones');
    res.send(response.rows);
};

const createCandidato = async(req, res) => {
    const{nombreCandidato, municipioId, partidoId, puestoId, estadoId} = req.body;
    const {eleccion_id} = state.eleccion[0]
    try{
        const response = await pool.query('INSERT INTO candidato (candidato_nombre, municipio_id, partido_id, eleccion_id, puesto_id, estado_id ) VALUES ($1, $2, $3, $4, $5,$6)',[nombreCandidato, municipioId, partidoId, eleccion_id, puestoId,estadoId]);
        res.status(200).json({
            message:'Candidato añadido',
        })
    }catch(error){
        res.status(400).json({
            message:'Conflicto de nombre o partido/puesto repetido',
        })
    }
};

const createCandidato2 = async(req, res) => {
    const{nombreCandidato, partidoId, puestoId, estadoId} = req.body;
    const {eleccion_id} = state.eleccion[0]
    try{
        const response = await pool.query('INSERT INTO candidato (candidato_nombre, partido_id, eleccion_id, puesto_id, estado_id) VALUES ($1, $2, $3, $4,$5)',[nombreCandidato, partidoId, eleccion_id, puestoId,estadoId]);
        res.status(200).json({
            message:'Candidato añadido',
        })
        return
    }catch(error){
        res.status(400).json({
            message:'Conflicto de nombre o partido/puesto repetido',
        })
    }
};

const createCandidato3 = async(req, res) => {
    const{nombreCandidato, partidoId, puestoId} = req.body;
    const {eleccion_id} = state.eleccion[0]
    try{
        const response = await pool.query('INSERT INTO candidato (candidato_nombre, partido_id, eleccion_id, puesto_id ) VALUES ($1, $2, $3, $4)',[nombreCandidato, partidoId, eleccion_id, puestoId]);
        res.status(200).json({
            message:'Candidato añadido',
        })
        return
    }catch(error){
        res.status(400).json({
            message:'Conflicto de nombre o partido/puesto repetido',
        })
    }
};
 
const createEleccion = async(req, res) => {
    const{name} = req.body;
    await pool.query('INSERT INTO elecciones (eleccion_nombre) VALUES ($1)',[name]);
    const response = await pool.query('SELECT eleccion_id FROM elecciones WHERE eleccion_nombre = $1',[name])
    state.eleccion = response.rows
    res.send('Persona añadida');
};

const getEleccion = async(req, res) => {
    const{name} = req.body;
    const response = await pool.query('SELECT eleccion_id FROM elecciones WHERE eleccion_nombre = $1',[name])
    state.eleccion = response.rows
    res.send('Persona añadida');
}

const getLocation = async(req, res) =>{
    const{estado, municipio} = req.body;
    const{municipioName} = req.body;
    const{estadoName} = req.body;
    const response = await pool.query('SELECT municipio_id FROM municipios WHERE municipio_nombre = $1',[municipioName])
    const response2 = await pool.query('SELECT estado_id FROM estados WHERE estado_nombre = $1',[estadoName])

    state.municipio = response.rows;
    state.estado = response2.rows;

    res.send('added')
}

const getBoleta = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const {municipio_id} = state.municipio[0]
    const response = await pool.query('SELECT candidato_id, municipio_id, candidato_nombre, partido_id, puesto_id FROM candidato WHERE puesto_id = $1 AND eleccion_id = $2 AND municipio_id =$3',[1,eleccion_id, municipio_id])
    res.send(response.rows);
}

const getBoletaGober = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const {estado_id} = state.estado[0]
    const response = await pool.query('SELECT candidato_id, candidato_nombre, partido_id, puesto_id, estado_idFROM candidato WHERE puesto_id = $1 AND eleccion_id = $2 and estado_id =$3',[2,eleccion_id,estado_id])
    res.send(response.rows);
}
const getBoletaPresRep = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('SELECT candidato_id, candidato_nombre, partido_id, puesto_id FROM candidato WHERE puesto_id = $1 AND eleccion_id = $2',[3,eleccion_id])
    res.send(response.rows);
}
const postVote = async(req, res) => {
    const{nombreCandidato, municipioId, puestoId, partidoId, estadoId} = req.body;
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('INSERT INTO votos (candidato_nombre, eleccion_id, municipio_id, puesto_id, partido_id, estado_id) VALUES ($1, $2, $3, $4, $5, $6)',[nombreCandidato, eleccion_id, municipioId, puestoId, partidoId,estadoId]);
    res.send('Candidato añadido');
};

const getVotos = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const{municipio_id} = state.municipio[0]
    console.log(municipio_id)
    const response = await pool.query('SELECT b.partido_id, a.eleccion_id, a.candidato_nombre,COUNT(a.candidato_nombre) as can FROM votos as a left join candidato as b on a.candidato_nombre = b.candidato_nombre WHERE a.eleccion_id = $1 AND a.puesto_id = 1 AND a.municipio_id = $2 GROUP BY a.candidato_nombre, b.partido_id, a.eleccion_id ',[eleccion_id,municipio_id])
    res.send(response.rows);
}


const getVotos2 = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const {estado_id} = state.estado[0]
    const response = await pool.query('SELECT b.partido_id, a.candidato_nombre,COUNT(a.candidato_nombre) as can FROM votos as a left join candidato as b on a.candidato_nombre = b.candidato_nombre WHERE a.eleccion_id = $1 AND a.puesto_id = 2 AND a.estado_id = $2 GROUP BY a.candidato_nombre, b.partido_id ',[eleccion_id, estado_id])
    res.send(response.rows);
}

const getVotos3 = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('SELECT b.partido_id, a.candidato_nombre,COUNT(a.candidato_nombre) as can FROM votos as a left join candidato as b on a.candidato_nombre = b.candidato_nombre WHERE a.eleccion_id = $1 AND a.puesto_id = 3 GROUP BY a.candidato_nombre, b.partido_id ',[eleccion_id])
    res.send(response.rows);
}

module.exports = {
    getMunicipios,
    createEleccion,
    getPartidos,
    createCandidato,
    createCandidato2,
    createCandidato3,
    getElecciones,
    getBoleta,
    getBoletaGober,
    postVote,
    getBoletaPresRep,
    getEleccion,
    getVotos,
    getVotos2,
    getVotos3,
    getEstados,
    getLocation,
    getMunicipioFromState,
    loginCtrl
    
}; 