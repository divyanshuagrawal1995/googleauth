const express = require('express')
const router = express.Router()
const authHelper = require('../helper/auth');

router.get('/',async(req,res,next)=>{
    let accessToken
    let params ={title:'Home',active:{home:true}};
    
    accessToken = await authHelper.getAccessToken(req.cookies,res);
   const userName = req.cookies.graph_user_name;
    
  if (accessToken && userName) {
    params.user = userName;
    params.debug = `User: ${userName}\nAccess Token: ${accessToken}`;
  } else {
    params.signInUrl = authHelper.getAuthUrl();
    params.debug = params.signInUrl;
  }
    res.json(params)
})
module.exports = router