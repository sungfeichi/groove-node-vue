
const model = require('../model/playlist')
module.exports = [
    {
        action: "GET",
        url: "/api/playlist",
        async handler(ctx) {
            const playlist = ctx.query.name
            if (playlist) {
                var res = model.detail(playlist)
            }
            else {
                res = model.all()
            }
            ctx.rest(res)
        }
    },
    {
        action: "POST",
        url: "/api/playlist",
        async handler(ctx) {
            var res
            const method = ctx.request.body.method;
            if (method === 'add') {
                const { author, name, description } = ctx.request.body
                res = model.add(author, name, description)
            }
            else if (method === 'copyto') {
                const { src, dst } = ctx.request.body
                res = model.copyToPlaylist(src, dst)
            }
            else if (method === 'albumcopyto') {
                const { src, dst } = ctx.request.body
                res = model.albumcopyToPlaylist(src, dst)
            }			
            else if (method === 'expand') {
                const playlist = ctx.query.name
                const { title, artist, album, pubyear, url, duration, weight } = ctx.request.body
                res = model.insertItemWT(playlist, title, artist, album, pubyear, url, duration, weight)
            }
            // else if (method === 'insert') {
            //     const playlist = ctx.query.name
            //     const { title, artist, album, pubyear, url, duration, weight } = ctx.request.body
            //     res = model.insertItem(playlist, title, artist, album, pubyear, url, duration, weight)
            // }
            else if (method === 'insertMany') {
                const playlist = ctx.query.name
                const items = ctx.request.body.items
                res = model.insertMany(playlist, items)
            }
			// else if (method === 'changeItemWT'){
				// const playlist = ctx.query.name
				// const url = ctx.request.body.url
				// const weight = ctx.request.body.weight
				// res = model.changeItemWT(playlist, url, weight)
			// }
			else if (method === 'updateOrder'){
				const playlist = ctx.query.name
				const url = ctx.request.body.url
				const start = ctx.request.body.start
				const end = ctx.request.body.end
				res = model.updateOrder(playlist, url, start, end)
			}			
            ctx.rest(res)
        }
    },
    {
        action: "PUT",
        url: "/api/playlist",
        async handler(ctx) {
            const playlist = ctx.query.name
            const { newname, description } = ctx.request.body
            var res = model.modify(playlist, newname, description)
            ctx.rest(res)
        }
    },
    {
        action: "DELETE",
        url: "/api/playlist",
        async handler(ctx) {
            const playlist = ctx.query.name
            var res;
            const method = ctx.request.body.method;
            if (method === 'deleteItems') {
                const items = ctx.request.body.items
                res = model.deleteItems(playlist, items)
            }
            else if (method === 'deletePlaylist') {
                res = model.deletePlaylist(playlist)
            }
            ctx.rest(res)
        }
    },
]
