const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "Cheifin420",
    host: "localhost",
    port: 5432,
    database: "grades"
})

module.exports = pool;