
const fs = require('fs')
module.exports = [
    {
        action: "GET",
        url: "/api/folders",
        async handler(ctx, next) {
            try {
                var folders = require('../config.json').folders
                ctx.rest(folders)
            } catch (err) {
                console.error(err)
                ctx.status=404
                return;
            }
        }
    },
    {
        action: "POST",
        url: "/api/folders",
        async handler(ctx, next) {
            var folders = require('../config.json').folders
            var item = ctx.request.body.item
			if(item){
                var rt = await fs.promises.stat(item)
                if (!rt.isDirectory()) throw new Error('request path not a directory')
                folders.push(item)
			}
                var [err,res] = await fs.promises.writeFile('./config.json',JSON.stringify({'folders':folders})).to()
				if(err){
					throw new Error(err)
				}
                ctx.rest(res)

            
        }
    },
    {
        action: "DELETE",
        url: "/api/folders",
        async handler(ctx, next) {
            var folders = require('../config.json').folders
            var item = ctx.request.body.item

                // var rt = await fs.promises.stat(item)
                // if (!rt.isDirectory()) throw new Error('request path not a directory')
				
                let idx=folders.indexOf(item)
				console.log(item,idx)
                if(idx!=-1){
                    folders.splice(idx,1)
                    var [err,res] = await fs.promises.writeFile('./config.json',JSON.stringify({'folders':folders})).to()
					if(err){
						throw new Error(err)
					}
					ctx.rest(idx)
                }
				else{
					throw new Error('path not found')
				}
                

        }
    }

]