require('dotenv').config()
const CONNECTION_STRING = process.env.CONNECTION_STRING
const {Sequelize} = require('sequelize')

const db = new Sequelize(CONNECTION_STRING)

module.exports = db