const express = require('express');
const router = express.Router();
const  Story = require('../models/Story');
const { ensureAuth, ensureGuest} = require('../middleware/auth');

//@desc Login/landing page
//@route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    });
})

router.get('/dashboard', ensureAuth, async (req, res) => {
    // console.log(req.user)
    try{
        const stories = await Story.find({user: req.user.id}).lean();

        res.render('dashboard',{
            name: req.user.firstName,
            stories
        });
    }
    catch(err){
        console.error(err.message);
        res.render('error/500');
    }
})

module.exports = router;