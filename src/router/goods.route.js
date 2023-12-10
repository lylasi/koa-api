
//koa 类库
const Router = require('koa-router')

//middleware
const { auth, hadAdminPermission } = require('../middleware/auth.middleware')
//自定义文件
const {
    upload,
    create,
    update
} = require('../controller/goods.controller')

//设置路由前缀
const router = new Router({ prefix: '/goods' })

//文件上传接口
router.post('/upload', auth, hadAdminPermission, upload)

// 发布商品
router.post('/', auth, hadAdminPermission, create)

// 修改商品信息
router.put('/:id', auth, hadAdminPermission, update)


module.exports = router