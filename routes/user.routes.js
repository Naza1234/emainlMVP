const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/signup', userController.signupUser);
router.post('/login', userController.loginUser);
router.get('/:id', userController.findOneUserById);
router.put('/:id', userController.updateOneUserById);
router.delete('/:id', userController.deleteOneUserById);

module.exports = router;
