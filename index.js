const express = require('express');
const cookieParser = require('cookie-parser')
const app = express()
const index = require('./routes/index')
const authorize = require('./routes/authorize')

app.use(express.json())
app.use(cookieParser())
app.use(index)
app.use(authorize)
app.use('/contacts',require('./routes/contact'))
app.use('/calender',require('./routes/calender'))
app.use('/google',require('./routes/google/index'));
app.use(require('./routes/google/authorize'))
const port = process.env.PORT  || 3000
app.listen(port,()=>{
    console.log(`port is connected on ${port}`)
})
require('dotenv').config()