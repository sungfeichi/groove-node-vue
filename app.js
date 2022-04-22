const Koa = require('koa');
const cors = require('koa-cors');
const bodyParser = require('koa-body');
const controller = require('./controller');
// const koaStatic = require('koa-static')
// const koaRange=require('koa-range')
const staticFiles = require('./static-files');
const streamer=require('./simple_streamer')
const rest=require('./rest')
require('./libs/to')
const app = new Koa();
app.use(cors({
        origin: '*'
    }))
// const isProduction = process.env.NODE_ENV === 'production';

// log request URL:
app.use(async (ctx, next) => {
    ctx.request.url=decodeURI(ctx.request.url)
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

app.use(bodyParser({
    multipart: true,
	strict:false,
    formidable: {
        maxFileSize: 2000*1024*1024    // 设置上传文件大小最大限制，默认2M
    }}))
app.use(rest.restify())
// add controller:
const router=controller()
app.use(router.routes());
app.use(router.allowedMethods())

// app.use(koaRange)
// app.use(koaStatic('assets'))
// app.use(koaStatic('/vue/dist'))
// app.use(staticFiles('/assets',__dirname + '/assets'));

app.use(staticFiles(__dirname+'/groove/dist'));
app.use(streamer);
// opts.ROOT='/assets'
app.on('error',()=>{
    // console.error('app '+err);
})
const PORT=8080
app.listen(PORT);
console.log(`app started at port ${PORT}...`);