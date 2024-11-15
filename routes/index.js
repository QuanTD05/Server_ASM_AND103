var express = require('express');
var router = express.Router();

// const carModel = require('../models/carModels')
// const COMMON = require('../bin/COMMON');

/* GET home page. */
router.get('/', async function(req, res, next) {

  res.render('index', { title: 'Express' });
});

module.exports = router;
