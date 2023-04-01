const {httpError} = require('../helpers/handleError')
const{encrypt, compare } = require('../helpers/handlerBcrypt')
const{tokenSign} = require('../helpers/generateToken')
const { Pool } = require('pg');

const pool = new Pool({
    host: 'urna.cei0eeqehwlw.us-east-1.rds.amazonaws.com',
    user: 'postgres',
    password: 'Practicum123',
    database: 'postgres',
    port: '5432'

});

const loginCtrl = async(req,res) => {
    try{
        const{username, password} = req.body
        const user = await pool.query('SELECT username, password from urna.usuarios WHERE username = $1',[username])
        const checkPasswsord = await compare(password, user.body.password)
       // const tokenSession = await tokenSign(user)
        if(checkPasswsord){
            res.send({
                data:user.rows,
                //token:tokenSession
            })
        }
        if(!checkPasswsord){
            res.status(409)
            res.send({
                error: 'Contraseña Inválida'
            })
            return 
        }
    }catch(error){
        console.error(error)
    }
}

module.exports = {loginCtrl}