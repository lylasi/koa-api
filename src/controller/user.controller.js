const jwt = require('jsonwebtoken')
const { 
  createUser,
  getUserInfo,
  updateById,
} = require('../service/user.service')

const { userRegisterError, userLoginError } = require('../constant/err.type')

const { JWT_SECRET } = require('../config/config.default')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body)
    const { user_name, password } = ctx.request.body

    // // 合法性
    // if (!user_name || !password) {
    //   console.error('用户名或密码为空', ctx.request.body)
    //   ctx.status = 400
    //   ctx.body = {
    //     code: '10001',
    //     message: '用户名或密码为空',
    //     result: '',
    //   }
    //   return
    // }
    // // 合理性
    // if (getUerInfo({ user_name })) {
    //   ctx.status = 409
    //   ctx.body = {
    //     code: '10002',
    //     message: '用户已经存在',
    //     result: '',
    //   }
    //   return
    // }
    // 2. 操作数据库
    try {
      const res = await createUser(user_name, password)
      // console.log(res)
      // 3. 返回结果
      ctx.body = {
        code: 0,
        message: '用户注册成功',
        result: {
          id: res.id,
          user_name: res.user_name,
        },
      }
    } catch (err) {
      console.log(err)
      ctx.app.emit('error', userRegisterError, ctx)
    }
  }

  async login(ctx, next) {
    const { user_name } = ctx.request.body
    //1. 获取用户信息（在token的payload种，记录id , user_name, is_admin)
    try {
      //从返回结果对象中提出password属性, 将剩下的属性放到res对象
      const { password, ...res } = await getUserInfo({ user_name })

      ctx.body = {
        code: 0,
        message: '用户登陆成功',
        result: {
          token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' }),
        }
      }
    } catch (err) {
      console.log(err)
      ctx.app.emit('error', userLoginError, ctx)
    }
    //2. 校验用户名密码
    //3. 生成token

  }

  async changePassword(ctx, next) {
    // 1. 获取数据
    const id = ctx.state.user.id
    const password = ctx.request.body.password

    // 2. 操作数据库
    if (await updateById({ id, password })) {
      ctx.body = {
        code: 0,
        message: '修改密码成功',
        result: '',
      }
    } else {
      ctx.body = {
        code: '10007',
        message: '修改密码失败',
        result: '',
      }
    }
    // 3. 返回结果
  }
}

module.exports = new UserController() 