const fs = require('fs')
module.exports = {
	action: "GET",
	url: "/",
	async handler(ctx, next) {
		// ctx.response.type = 'text/html'
		// ctx.response.body = await fs.promises.readFile('./groove/dist/index.html')
		ctx.status = 200;
		ctx.redirect('/index.html')
	}
}