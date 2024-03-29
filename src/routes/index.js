const{ Router } = require('express')
const router = Router();

const { loginCtrl,getMunicipios, createEleccion, getPartidos, getLocation,createCandidato, createCandidato2, createCandidato3, getElecciones, getBoleta,getBoletaGober, postVote, getBoletaPresRep, getEleccion, getVotos, getVotos2, getVotos3, getEstados, getMunicipioFromState} = require('../controllers/index.controller')
router.get('/municipios',getMunicipios);
router.get('/partidos',getPartidos);
router.get('/estados',getEstados)
//router.get('/municipioFromState',getMunicipioFromState)
router.get('/municipios/:estado_id',getMunicipioFromState)

router.post('/eleccion',createEleccion);
router.post('/location',getLocation);

router.post('/candidato',createCandidato);
router.post('/candidato2',createCandidato2);
router.post('/candidato3',createCandidato3);

router.get('/eleccion',getElecciones);

router.get('/boleta',getBoleta);
router.get('/boletaGober',getBoletaGober)
router.get('/boletaPresRep',getBoletaPresRep)

router.post('/boleta',postVote);
router.get('/resultados',getVotos);
router.get('/resultados2',getVotos2);
router.get('/resultados3',getVotos3);


router.post('/abrir',getEleccion);

router.post('/login', loginCtrl);



module.exports = router;
