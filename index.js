const express = require('express')
const {config} = require('dotenv')
config()
const bodyParser = require('body-parser')

const AuthMiddleware = require('./routes/auth/index')

const app = express()
const port = 3000

app.use(bodyParser.json())

app.use('/auth',AuthMiddleware)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))