const Koa     = require('koa');
const app     = new Koa();
const Limiter = require('../');
// x-response-time

app.use(async function (ctx, next) {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

//use the r-limiter middleware to limit ip request
app.use(async(ctx, next) => {
    let result = await Limiter({id: ctx.ip, maxPerSecond: 5});
    if (!result.isOutOfLimit) {
        await next();
    }else{
        let err = new Error('Too many requests!');
        err.status = err.statusCode || err.status || 429;
        throw err;
    }
})

// logger
app.use(async function (ctx, next) {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// response
app.use(ctx => {
    ctx.body = 'Hello World';
});

app.listen(3000);