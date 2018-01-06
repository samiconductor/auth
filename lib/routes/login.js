const Joi = require('joi')
const Boom = require('boom')
const jwt = require('jsonwebtoken')
const errors = require('../errors')

const schema = Joi.object().keys({
  username: Joi.string().empty('').trim().alphanum().max(50).required(),
  password: Joi.string().empty('').max(200).required()
})

module.exports = {
  method: 'POST',
  path: '/login',
  config: {
    auth: false,
    handler: async (request, reply) => {
      try {
        const user = await request.app.repos.user.withCredentials(
          request.payload.username,
          request.payload.password
        )
        const session = await request.app.repos.session.createForUser(user.id)
        const token = jwt.sign({
          sessionId: session.id
        }, process.env.JWT_SECRET)

        return reply().state('token', token)
      } catch(error) {
        if (errors.instanceOf(error,
          errors.NoResultsError,
          errors.InvalidCredentialsError
        )) {
          const message = 'Invalid username or password'
          const unauthorized = Boom.unauthorized(message)

          unauthorized.output.payload.errors = {message}

          return reply(unauthorized)
        }

        return reply(Boom.boomify(error))
      }
    },
    validate: {
      payload: schema,
      failAction: (request, reply, source, error) => {
        const invalidLogin = Boom.badRequest('Invalid login')

        invalidLogin.output.payload.errors = validationErrors(error)

        reply(invalidLogin)
      }
    }
  }
}

function validationErrors(error) {
  return error.data.details.reduce((fields, detail) => {
    return {
      ...fields,
      [detail.context.key]: detail.message
    }
  }, {})
}
