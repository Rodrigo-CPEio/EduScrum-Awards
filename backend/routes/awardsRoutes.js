// backend/routes/awardsRoutes.js
const express = require('express');
const router = express.Router();
const awardsCtrl = require('../controllers/awardsController');

router.get('/', awardsCtrl.listar);
router.post('/', awardsCtrl.criar);
router.get('/:target', awardsCtrl.listarPorAlvo);
router.delete('/:id', awardsCtrl.apagar);

module.exports = router;