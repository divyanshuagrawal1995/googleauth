var express = require('express');
var router = express.Router();
var authHelper = require('../helper/auth');
var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch')

/* GET /contacts */
router.get('/', async function(req, res, next) {
  let parms = { title: 'Contacts', active: { contacts: true } };

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    parms.user = userName;

    // const client = graph.Client.init({
    //   authProvider: (done) => {
    //     done(null, accessToken);
    //   }
    // });
    const client = graph.Client.init({
        authProvider:(done) =>{
            done(null,accessToken)
        }
    })

    try {
      
      const result = await client
      .api('/me/contacts')
      .top(10)
      .select('givenName,surname,emailAddresses')
      .orderby('givenName ASC')
      .get();

      parms.contacts = result.value;
      res.status(200).json( parms);
    } catch (err) {
      parms.message = 'Error retrieving contacts';
      parms.error = { status: `${err.code}: ${err.message}` };
      parms.debug = JSON.stringify(err.body, null, 2);
      res.status(503).json( parms);
    }

  }
  else{
      res.redirect('/')
  } 
});

module.exports = router;