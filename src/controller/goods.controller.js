const path = require('path')

const {
    fileUploadError,
    unSupportedFileType,
    publishGoodsError,
    invalidGoodsID,
} = require('../constant/err.type')

const {
    createGoods,
    updateGoods,
    // removeGoods,
    // restoreGoods,
    // findGoods,
} = require('../service/goods.service')

class goodsController {
    async upload(ctx, next) {
        // ctx.body='成功上传'
        console.log(ctx.request.files)
        const { file } = ctx.request.files
        console.log('file get:', file)
        //MIME Type :https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
        const fileTypes = ['image/jpeg', 'image/png']
        if (file) {
            //MIME Type :https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
            if (!fileTypes.includes(file.mimetype)) {
                return ctx.app.emit('error', unSupportedFileType, ctx)
            }
            ctx.body = {
                code: 0,
                message: '商品图片上传成功',
                result: {
                    goods_img: path.basename(file.filepath),
                },
            }
        } else {
            return ctx.app.emit('error', fileUploadError, ctx)
        }

    }

    async create(ctx) {
        // console.log(ctx.request)
        // 直接调用service的createGoods方法
        try {
            const { createdAt, updatedAt, ...res } = await createGoods(
                ctx.request.body
            )
            ctx.body = {
                code: 0,
                message: '发布商品成功',
                result: res,
            }
        } catch (err) {
            console.error(err)
            return ctx.app.emit('error', publishGoodsError, ctx)
        }
    }

    async update(ctx) {
        try {
            const res = await updateGoods(ctx.params.id, ctx.request.body)

            if (res) {
                ctx.body = {
                    code: 0,
                    message: '修改商品成功',
                    result: '',
                }
            } else {
                return ctx.app.emit('error', invalidGoodsID, ctx)
            }
        } catch (err) {
            console.error(err)
        }

    }
}


module.exports = new goodsController()