const bcrypt = require('bcryptjs')

const { getUserInfo } = require('../service/user.service')
const { 
    userFormateError,
    userAlreadyExited,
    invalidPassword,
    userLoginError,
    userDoesNotExist
} = require('../constant/err.type')

const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body
  // 合法性
  if (!user_name || !password) {
    console.error('用户名或密码为空', ctx.request.body)
    ctx.app.emit('error', userFormateError, ctx)
    return
  }

  await next()
}

const verifyUser = async (ctx, next) => {
  const { user_name } = ctx.request.body

  try {
    const res = await getUserInfo({ user_name })
    if (res) {
      console.error('用户名已经存在', ctx.request.body)
      ctx.app.emit('error', userAlreadyExited, ctx)
      return
    }

  } catch (error) {
    ctx.app.emit('error', userAlreadyExited, ctx)
    return
  }
  await next()
}

const cryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body
  const salt = bcrypt.genSaltSync(10)
  ctx.request.body.password = bcrypt.hashSync(password, salt)
  await next()
}

const verifyLogin = async (ctx, next) => {

  const { user_name, password } = ctx.request.body
  try {
    const res = await getUserInfo({ user_name })

    //验证用户是否存在（不存在用户报错）
    if (!res) {
      console.error('用户不存在', { user_name })
      ctx.app.emit('error', userDoesNotExist, ctx)
      return
    }

    //密码不匹配的话报错
    if (!bcrypt.compareSync(password, res.password)) {
      console.error('密码不匹配', { user_name })
      ctx.app.emit('error', invalidPassword, ctx)
      return
    }
  } catch (error) {
    console.error(error)
    ctx.app.emit('error', userLoginError, ctx)
    return
  }

  await next()
}

module.exports = {
  userValidator,
  verifyUser,
  cryptPassword,
  verifyLogin,
}