const db=require('./sqlcon')
module.exports = {
    get(url){
        var stmt = db.prepare('SELECT title,artist,album,pubyear,url,duration,cover FROM CACHE WHERE URL = ?;')
        var res = stmt.get(url)
        return res
    },
    getall(){
        var stmt = db.prepare('SELECT title,artist,album,pubyear,url,duration,cover FROM CACHE;')
        var res = stmt.all()
        return res
    }

}