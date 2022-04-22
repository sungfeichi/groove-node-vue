const Path = require('path');
const mime = require('mime');
const fs = require('fs')
function staticFiles(path) {
	return async (ctx, next) => {
		// 获取文件完整路径:
		let t=ctx.request.url.indexOf('?')
		if(t!=-1)
			ctx.request.url=ctx.request.url.substring(0,t)
		let fp = Path.join(path, ctx.request.url);
		try {
			var stats = await fs.promises.stat(fp)
		} catch (err) {
			await next()
			if (ctx.status) return
			else {
				console.error(err);
				ctx.status = 404
				return;
			}
		}
		ctx.status = 200
		ctx.response.type = mime.lookup(fp);
		ctx.body = await fs.promises.readFile(fp)
	}
}
module.exports = staticFiles;