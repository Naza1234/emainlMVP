const express = require('express');
const router = express.Router();
const userEmailController = require('../controllers/userEmail.controller');

router.post('/user-emails', userEmailController.createUserEmail);
router.get('/user-emails/:userid', userEmailController.findAllUserEmailsByUserId);
router.get('/user-emails/:id', userEmailController.findOneUserEmailById);
router.put('/user-emails/:id', userEmailController.updateOneUserEmailById);
router.delete('/user-emails/:id', userEmailController.deleteOneUserEmailById);

module.exports = router;
