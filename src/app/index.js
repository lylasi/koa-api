const path = require('path')

const Koa = require('koa')
const {koaBody} = require('koa-body')
const KoaStatic = require('koa-static')
const parameter = require('koa-parameter')

const errHandler=require('./errHandler')

// const userRouter = require('../router/user.route')
// const goodsRouter = require('../router/goods.route')
// 路由文件夹引入 读取 router文件夹下面的index.js
const router=require('../router')

const app = new Koa()

app.use(
    koaBody({
      multipart: true,
      formidable: {
        // 在配制选项option里, 不推荐使用相对路径
        // 在option里的相对路径, 不是相对的当前文件. 相对process.cwd()
        uploadDir: path.join(__dirname, '../upload'),
        keepExtensions: true,
      },
      parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],
    })
  )

// app.use(KoaBody.koaBody())
app.use(KoaStatic(path.join(__dirname,'../upload')))

// app.use(userRouter.routes())
// app.use(goodsRouter.routes())
// 引入所有路由 读取 router文件夹下面的index.js
app.use(router.routes()).use(router.allowedMethods()) // allowedMethods 允许所有提交方法
// app.use(router.routes())
// app.use(router.allowedMethods())

//统一错误处理
app.on('error', errHandler)
module.exports = app