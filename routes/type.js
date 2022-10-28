const express = require('express');

const TypeController = require('../controllers/type_controller');

const router = express.Router();

router.post('/setType', TypeController.setType);
router.post('/getType', TypeController.getType);

module.exports = {
  router: router,
};
