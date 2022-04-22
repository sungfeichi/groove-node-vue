const db=require('./sqlcon')
const GAP=4
module.exports = {
    /**
     * 
     * @param {string} name 
     */
    detail(name) {
        var stmt1 = db.prepare('SELECT AUTHOR,NAME,DESCRIPTION FROM PLAYLISTINFO WHERE NAME = ?;')
        var info = stmt1.get(name)
        var stmt = db.prepare('SELECT TITLE,ARTIST,ALBUM,PUBYEAR,URL,DURATION,WEIGHT FROM COLLECTION WHERE PLAYLIST = ?;')
        var col = stmt.all(name)
        return {info,col}
    },
    /**
     * 
     * @param {*} playlist 
     * @param {*} title 
     * @param {*}  
     * @param {*} album 
     * @param {*} pubyear 
     * @param {*} url 
     * @param {*} duration 
     * @param {*} weight
     */
    insertItem(playlist, title, artist, album, pubyear, url, duration, weight) {
        var stmt = db.prepare('INSERT INTO COLLECTION VALUES (?,?,?,?,?,?,?,?);')
        var info = stmt.run(playlist, title, artist, album, pubyear, url, duration,weight)
        return info.changes
    },
    /**
     * transaction
     * @param {*} playlist 
     * @param {*} items 
     */
    insertMany(playlist,items) {
		var wst = db.prepare('SELECT COALESCE(MAX(WEIGHT),0) as maxw FROM COLLECTION\
			WHERE PLAYLIST = ?')
		var maxw = wst.get(playlist).maxw
		console.log(maxw)
        var stmt = db.prepare('INSERT INTO COLLECTION (playlist, title, artist, album, pubyear, url, duration, weight)\
            VALUES (?, @title, @artist, @album, @pubyear, @url, @duration, ?);')
        db.transaction(()=>{
			items.map((item,index)=>{
				stmt.run(playlist,maxw+index+1,item)
			})
            // for(const item of items)
                // stmt.run(playlist,item)
        })()

        return true
    },
    updateOrder(playlist,url,start,end) {
		if(start<end){
			var stmt1=db.prepare('UPDATE COLLECTION SET WEIGHT = WEIGHT - 1\
				WHERE PLAYLIST = ? AND WEIGHT > ? AND WEIGHT <= ?;')
			stmt1.run(playlist,start,end)
			var stmt2=db.prepare('UPDATE COLLECTION SET WEIGHT = ?\
				WHERE PLAYLIST = ? AND URL = ? AND WEIGHT = ?;')
			var info=stmt2.run(end,playlist,url,start)
			return info.changes
		}
		else{
			stmt1=db.prepare('UPDATE COLLECTION SET WEIGHT = WEIGHT + 1\
				WHERE PLAYLIST = ? AND WEIGHT >= ? AND WEIGHT < ?;')
			stmt1.run(playlist,end,start)
			stmt2=db.prepare('UPDATE COLLECTION SET WEIGHT = ?\
				WHERE PLAYLIST = ? AND URL = ? AND WEIGHT = ?;')
			info=stmt2.run(end,playlist,url,start)
			return info.changes
		}
    },
    // changeItemWT(playlist, url, weight) {
        // var stmt_expand=db.prepare('UPDATE COLLECTION SET WEIGHT = ?\
			// WHERE PLAYLIST = ? AND URL = ?;')
        // var info=stmt_expand.run(weight,playlist,url)
        // // console.log(expandinfo.changes);
        // return info.changes
    // },	
    /**
     * 
     * @param {*} playlist 
     * @param {*} title 
     * @param {*} artist 
     * @param {*} album 
     * @param {*} pubyear 
     * @param {*} url 
     * @param {*} duration 
     * @param {*} weight
     */
     insertItemWT(playlist, title, artist, album, pubyear, url, duration, weight) {
        var stmt_expand=db.prepare('UPDATE COLLECTION SET WEIGHT=WEIGHT+'+GAP+' WHERE PLAYLIST=? AND WEIGHT>=?;')
        var expandinfo=stmt_expand.run(playlist,weight)
        // console.log(expandinfo.changes);
        var stmt = db.prepare('INSERT INTO COLLECTION VALUES (?,?,?,?,?,?,?,?);')
        var info = stmt.run(playlist, title, artist, album, pubyear, url, duration,weight)
        return info.changes
    },
    /**
     * 
     * @param {*} src 
     * @param {*} dst 
     * @returns ????????????????
     */
     copyToPlaylist(src,dst){
 // select row_number() over(order by name) as row,* from playlistinfo;
 //Starting with 1 and then incrementing by 1 (eg.1,2,3,4), 
 //regardless of the same data in the column to be ranked.
        var stmt=db.prepare('INSERT INTO COLLECTION\
            SELECT ? as playlist,TITLE,ARTIST,ALBUM,PUBYEAR,URL,DURATION,\
			(row_number() over(order by weight) +\
            (SELECT COALESCE(MAX(WEIGHT),0) FROM COLLECTION WHERE PLAYLIST = ?)) as weight\
            FROM COLLECTION WHERE PLAYLIST = ?;')
        var info = stmt.run(dst,dst,src)
        return info.changes
    },
    /**
     * 
     * @param {*} src 
     * @param {*} dst 
     * @returns ????????????????
     */
     albumcopyToPlaylist(src,dst){
        var stmt=db.prepare('INSERT INTO COLLECTION\
            SELECT ?,TITLE,ARTIST,ALBUM,PUBYEAR,URL,DURATION\
            FROM CACHE WHERE ALBUM = ?;')
        var info = stmt.run(dst,src)
        return info.changes
    },	
    // /**
    //  * 
    //  * @param {*} playlist 
    //  * @param {*} url 
    //  * @returns 
    //  */
    // deleteItem(playlist, url) {
    //     var stmt = db.prepare('DELETE FROM COLLECTION WHERE ROWID IN (SELECT MAX(ROWID) FROM COLLECTION WHERE PLAYLIST = ? AND url = ?);')
    //     var info = stmt.run(playlist, url)
    //     return info.changes
    // },
    /**
     * 
     * @param {*} playlist 
     * @param {*} url 
     * @param {*} weight 
     * @returns 
     */
    deleteItems(playlist, items) {
        var stmt = db.prepare('DELETE FROM COLLECTION \
        WHERE PLAYLIST = ? AND URL = @url AND WEIGHT = @weight;')
        var res = db.transaction(()=>{
            for(const item of items)
                stmt.run(playlist,item)
        })()
        return res
    },
    /**
     * 
     * @returns 
     */
    all() {
        var stmt = db.prepare('SELECT AUTHOR,NAME,DESCRIPTION FROM PLAYLISTINFO;')
        var res = stmt.all()
        return res;
    },
    /**
     * 
     * @param {*} author 
     * @param {*} name 
     * @param {*} description 
     * @returns 
     */
    add(author, name, description) {
        author = author || 'me'
        name = name || 'new playlist'
        var stmt = db.prepare('INSERT INTO PLAYLISTINFO (AUTHOR, NAME, DESCRIPTION) VALUES (?,?,?);')
        var info = stmt.run(author, name, description)
        return info.changes
    },
    /**
     * 
     * @param {*} oldname 
     * @param {*} newname 
     * @param {*} desciption 
     * @returns 
     */
    modify(oldname, newname, desciption) {
        //tt
        var stmt = db.prepare('UPDATE PLAYLISTINFO SET NAME = ?, DESCRIPTION = ? WHERE NAME = ?;')
        var info = stmt.run(newname, desciption, oldname)
        var stmt2=db.prepare('UPDATE COLLECTION SET PLAYLIST = ? WHERE PLAYLIST = ?;')
        var info2 = stmt2.run(newname,oldname)
        return info.changes
    },
    /**
     * 
     * @param {*} name 
     * @returns 
     */
    deletePlaylist(name){
        var stmt = db.prepare('DELETE FROM PLAYLISTINFO WHERE NAME = ?;')
        var info = stmt.run(name)
        var stmt2 = db.prepare('DELETE FROM COLLECTION WHERE PLAYLIST = ?;')
        var info2 = stmt2.run(name)
        return info.changes
    }
}