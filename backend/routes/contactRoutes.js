const express = require('express');
const router = express.Router();
const { createContact, getContact } = require('../controller/contactController');
const { jwtToken, checkAdmin } = require('../middleware/auth');

router.get('/', jwtToken, checkAdmin, getContact);
router.post('/create', jwtToken,checkAdmin, createContact);

module.exports = router;

