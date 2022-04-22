const path = require('path');
const mime = require('mime');
const fs = require('fs')
// const Stream = require('stream');
async function streamer(ctx, next) {

	let path = ctx.request.url.substring(1);
	let range = ctx.headers.range
	try {
		var stats = await fs.promises.stat(path)
	} catch (err) {
		// await next()
		// if (ctx.status) return
		// else {
		console.error(err);
		ctx.status = 404
		return;
		// }
	}
	ctx.response.type = mime.lookup(path);
	ctx.set('Accept-Ranges', "bytes")
	ctx.set('Keep-Alive', 'timeout=5')
	if (!range) {
		// range = 'bytes=0-'
		ctx.status = 200
		ctx.set('Content-Length', stats.size - 0)
		// ctx.set('Cache-Control','public, max-age=0')
		var data = fs.createReadStream(path)
		ctx.body = data
	}
	else {
		ctx.status = 206
		let startBytes = range.replace(/bytes=/, '').split('-')[0] - '0'

		var rangestr = 'bytes ' + startBytes + '-' + (stats.size - 1) + '/' + stats.size
		// console.log(rangestr);
		ctx.set('Content-Length', stats.size - startBytes)
		ctx.set('Content-Range', rangestr)
		// ctx.set('Cache-Control','public, max-age=0')
		data = fs.createReadStream(path, {
			start: startBytes,
			end: stats.size
		})
		ctx.body = data
	}
}


module.exports = streamer;