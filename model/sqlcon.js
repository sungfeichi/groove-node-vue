const sql = require('better-sqlite3')
const options = {}
const db = sql('mp.db', options)
module.exports=db