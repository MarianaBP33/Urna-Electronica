const { Pool } = require('pg');
const state = require('../store/state');

const pool = new Pool({
    host: 'urna.cei0eeqehwlw.us-east-1.rds.amazonaws.com',
    user: 'postgres',
    password: 'Practicum123',
    database: 'postgres',
    port: '5432'

});


const getMunicipios = async(req, res) => {
    const response = await pool.query('SELECT municipio_nombre,municipio_id FROM urna.municipios');
    res.send(response.rows);
    console.log(response.rows)
};

const getEstados = async(req, res) => {
    const response = await pool.query('SELECT estado_nombre,estado_id FROM urna.estados');
    res.send(response.rows);
    console.log(response.rows)
};

const getPartidos = async(req, res) => {
    const response = await pool.query('SELECT partido_nombre, partido_id FROM urna.partido');
    res.send(response.rows);
};

const getElecciones = async(req, res) => {
    const response = await pool.query('SELECT eleccion_nombre FROM urna.elecciones');
    res.send(response.rows);
};

const createCandidato = async(req, res) => {
    const{nombreCandidato, municipioId, partidoId, puestoId} = req.body;
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('INSERT INTO urna.candidato (candidato_nombre, municipio_id, partido_id, eleccion_id, puesto_id ) VALUES ($1, $2, $3, $4, $5)',[nombreCandidato, municipioId, partidoId, eleccion_id, puestoId]);
    console.log(state.eleccion)
    console.log(response.rows)
    res.send('Candidato añadido');
};

const createCandidato2 = async(req, res) => {
    const{nombreCandidato, partidoId, puestoId} = req.body;
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('INSERT INTO urna.candidato (candidato_nombre, partido_id, eleccion_id, puesto_id ) VALUES ($1, $2, $3, $4)',[nombreCandidato, partidoId, eleccion_id, puestoId]);
    console.log(state.eleccion)
    console.log(response.rows)
    res.send('Candidato añadido');
};

const createCandidato3 = async(req, res) => {
    const{nombreCandidato, partidoId, puestoId} = req.body;
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('INSERT INTO urna.candidato (candidato_nombre, partido_id, eleccion_id, puesto_id ) VALUES ($1, $2, $3, $4)',[nombreCandidato, partidoId, eleccion_id, puestoId]);
    console.log(state.eleccion)
    console.log(response.rows)
    res.send('Candidato añadido');
};
 
const createEleccion = async(req, res) => {
    const{name} = req.body;
    await pool.query('INSERT INTO urna.elecciones (eleccion_nombre) VALUES ($1)',[name]);
    const response = await pool.query('SELECT eleccion_id FROM urna.elecciones WHERE eleccion_nombre = $1',[name])
    state.eleccion = response.rows
    console.log(state.eleccion[0])
    res.send('Persona añadida');
};

const getEleccion = async(req, res) => {
    const{name} = req.body;
    const{municipio} = req.body;
    state.municipio = municipio;
    console.log(state.municipio)
    const response = await pool.query('SELECT eleccion_id FROM urna.elecciones WHERE eleccion_nombre = $1',[name])
    state.eleccion = response.rows
    res.send('Persona añadida');
}

const getLocation = async(req, res) =>{
    const{estado, municipio} = req.body;
    state.estado = estado;
    state.municipio = municipio;
}

const getBoleta = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    //const {municipio_id} = state.municipio
    console.log(eleccion_id)
    //console.log(municipio_id)
    const response = await pool.query('SELECT candidato_id, municipio_id, candidato_nombre, partido_id, puesto_id FROM urna.candidato WHERE puesto_id = $1 AND eleccion_id = $2',[1,eleccion_id])
    res.send(response.rows);
    console.log(response.rows)
}

const getBoletaGober = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('SELECT candidato_id, candidato_nombre, partido_id, puesto_id FROM urna.candidato WHERE puesto_id = $1 AND eleccion_id = $2',[2,eleccion_id])
    res.send(response.rows);
    console.log(response.rows)
}
const getBoletaPresRep = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('SELECT candidato_id, candidato_nombre, partido_id, puesto_id FROM urna.candidato WHERE puesto_id = $1 AND eleccion_id = $2',[3,eleccion_id])
    res.send(response.rows);
    console.log(response.rows)
}
const postVote = async(req, res) => {
    const{nombreCandidato, municipioId, puestoId, partidoId} = req.body;
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('INSERT INTO urna.votos (candidato_nombre, eleccion_id, municipio_id, puesto_id, partido_id) VALUES ($1, $2, $3, $4, $5)',[nombreCandidato, eleccion_id, municipioId, puestoId, partidoId]);
    console.log(response.rows)
    res.send('Candidato añadido');
};

const getVotos = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('SELECT b.partido_id, a.eleccion_id, a.candidato_nombre,COUNT(a.candidato_nombre) as can FROM urna.votos as a left join urna.candidato as b on a.candidato_nombre = b.candidato_nombre WHERE a.eleccion_id = $1 AND a.puesto_id = 1 GROUP BY a.candidato_nombre, b.partido_id, a.eleccion_id ',[eleccion_id])
    res.send(response.rows);
    console.log(response.rows)
}


const getVotos2 = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('SELECT b.partido_id, a.candidato_nombre,COUNT(a.candidato_nombre) as can FROM urna.votos as a left join urna.candidato as b on a.candidato_nombre = b.candidato_nombre WHERE a.eleccion_id = $1 AND a.puesto_id = 2 GROUP BY a.candidato_nombre, b.partido_id ',[eleccion_id])
    res.send(response.rows);
    console.log(response.rows)
}

const getVotos3 = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('SELECT b.partido_id, a.candidato_nombre,COUNT(a.candidato_nombre) as can FROM urna.votos as a left join urna.candidato as b on a.candidato_nombre = b.candidato_nombre WHERE a.eleccion_id = $1 AND a.puesto_id = 3 GROUP BY a.candidato_nombre, b.partido_id ',[eleccion_id])
    res.send(response.rows);
    console.log(response.rows)
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
    getLocation
}; 