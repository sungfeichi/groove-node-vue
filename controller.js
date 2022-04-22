
const fs = require('fs')

function addRoute(router,pack){
    const mappedaction={'GET':router.get,'POST':router.post,'PUT':router.put,'DELETE':router.del}
    function add(r){
        if(mappedaction[r.action]){
            mappedaction[r.action].call(router,r.url,r.handler)
            console.log(`register URL mapping: ${r.action} ${r.url}`);
        }
        else{
            console.log(`invalid URL: ${r.url}`);
        }
    }
    if(pack.length){
        for(const r of pack)add(r)
    }
    else{
        add(pack)
    }
    
}
function addControllers(router,dir){
	// 这里可以用sync是因为启动时只运行一次，不存在性能问题:
	var files = fs.readdirSync(__dirname + '/'+dir);
	// 过滤出.js文件:
	var js_files = files.filter((f)=>{
		return f.endsWith('.js');
	});
	// 处理每个js文件:
	for (var f of js_files){
		console.log(`process controller: ${f}...`);
		let pack=require(__dirname+'/'+dir+'/'+f)
		addRoute(router,pack)
	}
}


module.exports=function(dir){
	dir=dir||'controllers'
	let router=require('koa-router')()
	addControllers(router,dir)
	return router
}