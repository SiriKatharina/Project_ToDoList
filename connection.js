const {Client} = require('pg')

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "datenpost",
  database: "todos"
})

module.exports = client