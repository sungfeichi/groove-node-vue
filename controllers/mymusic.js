const util = require('../libs/util')
const fs = require('fs')
module.exports = [
    {
        action: "GET",
        url: "/api/mymusic",
        async handler(ctx) {
            var res
            const url = ctx.request.query.url
            if (url) {
                res = await util.readmp3(url)
            }
            else {
                const mp3 = await util.scan()
                res = await Promise.all(
                    mp3.map(async p => {
                        return util.readmp3(p)
                    })
                )
            }
            ctx.rest(res)
        }
    },
    {
        action: "DELETE",
        url: "/api/mymusic",
        async handler(ctx) {
            var res;
            if (true) {
                const url = ctx.request.body.url
                res = await fs.promises.rm(url)
                if (res === undefined)
                    ctx.rest(res)
                else {
                    throw new Error('INTERNAL ERROR: file cannot remove')
                }
            }

        }
    },
]