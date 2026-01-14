// controllers/listings.js
const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');

//get all the listings
router.get('/', async (req, res) => {
    try {
    const getAllListings = await Listing.find({}). populate('owner');
    console.log('all listings', getAllListings);
    res.render('listings/index.ejs', {
        listings: getAllListings,
    })} catch (error) {
        console.log(error);
        res.redirect('/')
    }   
});

router.get('/new', async (req,res) => {
    res.render('listings/new.ejs')
})

router.post('/', async (req, res) => {
    console.log('who is the user', req.session.user._id)
    req.body.owner = req.session.user._id
    console.log('get req body from form', req.body);
    await Listing.create(req.body)
    res.redirect('/listings')
});

router.get('/:listingId', async (req, res) => {
    try {
        const populatedListing = await Listing.findById(
            req.params.listingId
        ).populate('owner');
        // console.log('listing ID', req.params.listingId);
        // res.send('listing show page')
        res.render('listings/show.ejs', {
            listing: populatedListing
        });
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})

//DELETE/listing/:listingId
router.delete('/:listingId', async (req, res) => {
    try {
        // console.log('listingID', req.params.listingId);
        const listing = await Listing.findById(req.params.listingId);
        if (listing.owner.equals(req.session.user._id)) {
            console.log('Permission granted')
            await Listing.deleteOne();
            res.redirect('/listings')
        } else {
            res.send('You do not have the permission to delete this listing')
        }
        // console.log('user', req.session.user);
        // res.send(`a DELETE request was issued for ${req.params.listingId}`)
    } catch (error) {
        console.log(error);
        res.redirect('/')
    };
});

//edit the listing form
router.get('/:listingId/edit', async (req, res) => {
    try {
        const currentListing = await Listing.findById(req.params.listingId);
        console.log('listing ID', req.params.listingId)
        res.render('listings/edit.ejs', {
            listing: currentListing,
        })
    } catch (error) {
        console.log(error);
        res.redirect('/')
    };
})

router.put('/:listingId', async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.listingId);
    if (currentListing.owner.equals(req.session.user._id)) {
      await currentListing.updateOne(req.body);
      res.redirect('/listings');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


module.exports = router;
