var express = require('express');
var router = express.Router();
var authHelper = require('../../helper/googleauth');

/* GET /authorize. */
router.get('/google-authorize', async function(req, res, next) {
  // Get auth code
  const code = req.query.code;
  console.log(code)

  if (code) {
    let token;
    try {
      token = await authHelper.getTokenFromCode(code,res);
      console.log(token)
      res.json({token})
    } catch (error) {
        console.log(error)

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