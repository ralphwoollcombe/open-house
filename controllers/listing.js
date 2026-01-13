// controllers/listings.js
const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');

router.get('/', (req, res) => {
    res.render('listings/index.ejs')
})

module.exports = router;
