var express = require('express');
var router = express.Router();
var authHelper = require('../helper/auth');

/* GET /authorize. */
router.get('/authorize', async function(req, res, next) {
  // Get auth code
  const code = req.query.code;

  if (code) {
    let token;

    try {
      token = await authHelper.getTokenFromCode(code,res);
      
      res.json({token})
    } catch (error) {
      res.json({ title: 'Error', message: 'Error exchanging code for token', error: error });
    }
  } else {
    res.json({ title: 'Error', message: 'Authorization error', error: { status: 'Missing code parameter' } }) ;
  }
});

router.get('/signout', function(req, res, next) {
    authHelper.clearCookies(res);
  
    res.redirect('/');
  })
module.exports = router