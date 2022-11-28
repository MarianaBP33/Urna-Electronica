const { Pool } = require('pg');
const state = require('../store/state');

const pool = new Pool({
    host: 'databasepracticum.cqhtxazsnp33.us-east-1.rds.amazonaws.com',
    user: 'postgrePracticum',
    password: 'Practicum2022',
    database: 'postgres',
    port: '5432'

});

const getMunicipios = async(req, res) => {
    const response = await pool.query('SELECT municipio_nombre,municipio_id FROM schema2.municipios');
    res.send(response.rows);
};

const getPartidos = async(req, res) => {
    const response = await pool.query('SELECT partido_nombre, partido_id FROM schema2.partido');
    res.send(response.rows);
};

const getElecciones = async(req, res) => {
    const response = await pool.query('SELECT eleccion_nombre FROM schema2.elecciones');
    res.send(response.rows);
};

const createCandidato = async(req, res) => {
    const{nombreCandidato, municipioId, partidoId, puestoId} = req.body;
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('INSERT INTO schema2.candidato (candidato_nombre, municipio_id, partido_id, eleccion_id, puesto_id ) VALUES ($1, $2, $3, $4, $5)',[nombreCandidato, municipioId, partidoId, eleccion_id, puestoId]);
    console.log(state.eleccion)
    console.log(response.rows)
    res.send('Candidato añadido');
};

const createCandidato2 = async(req, res) => {
    const{nombreCandidato, partidoId, puestoId} = req.body;
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('INSERT INTO schema2.candidato (candidato_nombre, partido_id, eleccion_id, puesto_id ) VALUES ($1, $2, $3, $4)',[nombreCandidato, partidoId, eleccion_id, puestoId]);
    console.log(state.eleccion)
    console.log(response.rows)
    res.send('Candidato añadido');
};

const createCandidato3 = async(req, res) => {
    const{nombreCandidato, partidoId, puestoId} = req.body;
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('INSERT INTO schema2.candidato (candidato_nombre, partido_id, eleccion_id, puesto_id ) VALUES ($1, $2, $3, $4)',[nombreCandidato, partidoId, eleccion_id, puestoId]);
    console.log(state.eleccion)
    console.log(response.rows)
    res.send('Candidato añadido');
};
 
const createEleccion = async(req, res) => {
    const{name} = req.body;
    await pool.query('INSERT INTO schema2.elecciones (eleccion_nombre) VALUES ($1)',[name]);
    const response = await pool.query('SELECT eleccion_id FROM schema2.elecciones WHERE eleccion_nombre = $1',[name])
    state.eleccion = response.rows
    console.log(state.eleccion[0])
    res.send('Persona añadida');
};

const getEleccion = async(req, res) => {
    const{name} = req.body;
    const{municipio} = req.body;
    state.municipio = municipio;
    console.log(state.municipio)
    const response = await pool.query('SELECT eleccion_id FROM schema2.elecciones WHERE eleccion_nombre = $1',[name])
    state.eleccion = response.rows
    res.send('Persona añadida');
}

const getBoleta = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    //const {municipio_id} = state.municipio
    console.log(eleccion_id)
    //console.log(municipio_id)
    const response = await pool.query('SELECT candidato_id, municipio_id, candidato_nombre, partido_id, puesto_id FROM schema2.candidato WHERE puesto_id = $1 AND eleccion_id = $2',[1,eleccion_id])
    res.send(response.rows);
    console.log(response.rows)
}

const getBoletaGober = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('SELECT candidato_id, candidato_nombre, partido_id, puesto_id FROM schema2.candidato WHERE puesto_id = $1 AND eleccion_id = $2',[2,eleccion_id])
    res.send(response.rows);
    console.log(response.rows)
}
const getBoletaPresRep = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('SELECT candidato_id, candidato_nombre, partido_id, puesto_id FROM schema2.candidato WHERE puesto_id = $1 AND eleccion_id = $2',[3,eleccion_id])
    res.send(response.rows);
    console.log(response.rows)
}
const postVote = async(req, res) => {
    const{nombreCandidato, municipioId, puestoId} = req.body;
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('INSERT INTO schema2.votos (candidato_nombre, eleccion_id, municipio_id, puesto_id) VALUES ($1, $2, $3, $4)',[nombreCandidato, eleccion_id, municipioId, puestoId]);
    console.log(response.rows)
    res.send('Candidato añadido');
};

const getVotos = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('SELECT candidato_nombre,COUNT(candidato_nombre) as can FROM schema2.votos WHERE eleccion_id = $1 AND puesto_id = 1 GROUP BY candidato_nombre',[eleccion_id])
    res.send(response.rows);
    console.log(response.rows)
}

const getVotos2 = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('SELECT candidato_nombre,COUNT(candidato_nombre) as can FROM schema2.votos WHERE eleccion_id = $1 AND puesto_id = 2 GROUP BY candidato_nombre',[eleccion_id])
    res.send(response.rows);
    console.log(response.rows)
}

const getVotos3 = async(req, res) => {
    const {eleccion_id} = state.eleccion[0]
    const response = await pool.query('SELECT candidato_nombre,COUNT(candidato_nombre) as can FROM schema2.votos WHERE eleccion_id = $1 AND puesto_id = 3 GROUP BY candidato_nombre',[eleccion_id])
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
    getVotos3
}; 