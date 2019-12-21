const env =require('../env');
const credentials = {
    client :{
        id:env.GAPP_ID,
        secret:env.GAPP_PASSWORD
    },
    auth: {
        tokenHost: 'https://accounts.google.com/',
        authorizePath: 'o/oauth2/v2/auth',
        tokenPath: 'https://www.googleapis.com/oauth2/v4/token'
      }

}
const oauth2 = require('simple-oauth2').create(credentials)
const jwt = require('jsonwebtoken');

function getAuthUrl(){
    console.log(credentials.client)
    const returnVal = oauth2.authorizationCode.authorizeURL({
        redirect_uri:GREDIRECT_URI,
        access_type:'offline',
        scope:env.GSCOPES
    })
    console.log(`Generated auth url:${returnVal}`)
    return returnVal
}
async function getTokenFromCode(auth_code,res) {
    let result;
    try{

         result = await oauth2.authorizationCode.getToken({
            code: auth_code,
            client_id:env.GAPP_ID,
            client_secret:env.GAPP_PASSWORD,
            redirect_uri:env.GREDIRECT_URI,
            scope: env.GAPP_SCOPES,
            grant_type:'authorization_code'
          });
    }catch(err)
    {
         console.log(err)
    }
    
    const token = oauth2.accessToken.create(result);
    console.log('Token created: ', token.token);
    saveValuesToCookie(token,res)
    return token.token.access_token;
  }
  
  function saveValuesToCookie(token, res) {
    res.cookie('graph_access_token', token.token.access_token, {maxAge: 3600000, httpOnly: true});
    res.cookie('graph_refresh_token', token.token.refresh_token, {maxAge: 7200000, httpOnly: true});
    res.cookie('graph_token_expires', token.token.expires_at.getTime(), {maxAge: 3600000, httpOnly: true});
  }
  function clearCookies(res) {
    res.clearCookie('graph_access_token', {maxAge: 3600000, httpOnly: true});
    res.clearCookie('graph_refresh_token', {maxAge: 7200000, httpOnly: true});
    res.clearCookie('graph_token_expires', {maxAge: 3600000, httpOnly: true});
  }
  
  async function getAccessToken(cookies, res) {
    let token = cookies.graph_access_token;
  
    if (token) {
     
      const FIVE_MINUTES = 300000;
      const expiration = new Date(parseFloat(cookies.graph_token_expires - FIVE_MINUTES));
      if (expiration > new Date()) {
        return token;
      }
    }
  
    
    const refresh_token = cookies.graph_refresh_token;
    if (refresh_token) {
      const newToken = await oauth2.accessToken.create({refresh_token: refresh_token}).refresh();
      console.log(newToken)
      saveValuesToCookie(newToken, res);
      return newToken.token.access_token;
    }
  
   
    return null;
  }
exports.getTokenFromCode = getTokenFromCode;
exports.getAuthUrl = getAuthUrl;
exports.getAccessToken = getAccessToken
exports.clearCookies = clearCookies
exports.getTokenFromCode = getTokenFromCode