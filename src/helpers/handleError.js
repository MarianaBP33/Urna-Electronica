const httpError = (res, err) =>{
    res.status(500)
    res.send({
        error: 'Algo ocurrió'
    })
}

module.exports = {httpError}