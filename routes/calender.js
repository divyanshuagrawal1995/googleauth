const express = require('express');
const router = express.Router();
const authHelper = require('../helper/auth');
const graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch')

router.get('/', async function(req, res, next) {
  let parms = { title: 'Calendar', active: { calendar: true } };

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    parms.user = userName;
    
    
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    
    const start = new Date(new Date().setHours(0,0,0));
    const end = new Date(new Date(start).setDate(start.getDate() + 7));
    
    try {
      const result = await client
      .api(`/me/calendarView?startDateTime=${start.toISOString()}&endDateTime=${end.toISOString()}`)
      .top(10)
      .select('subject,start,end,attendees')
      .orderby('start/dateTime DESC')
      .get();

      parms.events = result.value;
      console.log(result)
      res.json( parms);
    } catch (err) {
      parms.message = 'Error retrieving events';
      parms.error = { status: `${err.code}: ${err.message}` };
      parms.debug = JSON.stringify(err.body, null, 2);
      res.json( parms);
    }
    
  } else {
    res.redirect('/');
  }
});

module.exports = router;