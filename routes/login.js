const Joi = require('joi')
const Boom = require('boom')
const jwt = require('jsonwebtoken')
const errors = require('../lib/errors')

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

        return reply.redirect('/').state('token', token)
      } catch(error) {
        if (errors.instanceOf(error,
          errors.NoResultsError,
          errors.InvalidCredentialsError
        )) {
          return reply.view('login', invalidLoginContext(request))
        }

        return reply(Boom.boomify(error))
      }
    },
    validate: {
      payload: schema,
      failAction: (request, reply, source, error) => {
        reply.view('login', validationErrorsContext(request, error))
      }
    }
  }
}

function invalidLoginContext(request) {
  const errors = {
    login: 'Invalid username and password'
  }

  return mergeRequestContext(request, {errors})
}

function validationErrorsContext(request, error) {
  const errors = error.data.details.reduce((fields, detail) => {
    return Object.assign(fields, {
      [detail.context.key]: detail.message
    })
  }, {})

  return mergeRequestContext(request, {errors})
}

function mergeRequestContext(request, ...contexts) {
  return Object.assign(request.payload, {
    password: null
  }, ...contexts)
}
