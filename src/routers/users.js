const express = require('express')
const routers = express.Router()
const validate = require('../middleware/validate')
const controller = require('../controllers/user')
const upload = require('../middleware/upload')

routers.get('/', validate, controller.getAll)
routers.post('/', upload.single('profile_image'), controller.Create)
routers.put('/:id', validate, upload.single('profile_image'), controller.Update)
routers.delete('/:id', validate, controller.Delete)

module.exports = routers
