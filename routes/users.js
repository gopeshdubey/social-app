const express = require('express')
var router = express.Router()
var controller = require('../controller/users')

router.get('/getAllUsers', controller.getAllUsers)

module.exports = router;