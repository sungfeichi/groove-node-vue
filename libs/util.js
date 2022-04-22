const MP3Tag = require('mp3tag.js')
const fs = require('fs')
const mp3Duration = require('mp3-duration');
 

async function scan() {
    let res = []
    try {
        const folders = (await fs.promises.readFile('./config.json')
            .then(v => JSON.parse(v))).folders
        for (const fd of folders) {
            await fs.promises.readdir(fd)
                .then(f => f.filter(str => str.endsWith('.mp3'))
                    .map(v => res.push(fd + '/' + v))
                    // .map(v => fd + '/' + v)
                )
            // res.push(...t)
        }
    } catch (err) {
        console.error(err);
    }
    return res

    // return new Promise((resolve, reject) => {
    //     const folders = require('./config.json').folders
    //     // console.log(folders);
    //     let res = Promise.all(folders.map(fd => {
    //         return new Promise((resolve, reject) => {
    //             let res = fs.promises.readdir(fd)
    //                 .then(f =>
    //                     f.filter(str => str.endsWith('.mp3')).map(v => fd + '/' + v)
    //                 ).catch(err => {
    //                     console.error(err)
    //                 })
    //             resolve(res)

    //         })
    //     }))
    // })


}
/**
 * --todo get mp3's ordinal numbers in an album
 * @param {*} path 
 * @returns 
 */
async function readmp3(path) {
    var buffer = await fs.promises.readFile(path)
    var duration=await mp3Duration(buffer)
    const mp3tag = new MP3Tag(buffer)
    mp3tag.read()
    var tags = mp3tag.tags, cover
    try {
        var { data, format } = mp3tag.tags.v2.APIC[0];
		//var base64String=''
		//for (var i = 0; i < data.length; i++) {
			//base64String += String.fromCharCode(data[i]);
		//}
		//base64String=Buffer.from(base64String,'binary').toString('base64')
        let base64String = Buffer.from(String.fromCharCode(...data),'binary').toString('base64')
        cover = `data:${format};base64,${base64String}`
    } catch (err) {
        cover = ''
    }
    return {
        title: tags.title,
        artist: tags.artist,
        album: tags.album,
        pubyear: tags.year,
        url: path,
        duration:duration,
        cover: cover
    }
}
module.exports = {
    scan, readmp3
}
// async function test() {
//     let a = await readmp3('./assets/red - taylor swift.mp3')
//     // let a = await scan()
//     console.log(a);
//     // const mp3 = await scan()
//     // // console.log(mp3);
//     // var res = await Promise.all(
//     //     mp3.map(async p => {
//     //         return readmp3(p)
//     //         // let info = await readmp3(p)
//     //         // // info.url = p
//     //         // return info
//     //     })
//     // )
//     // console.log(res);
// }
// test()