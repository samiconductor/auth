module.exports = corsConfig()

function corsConfig() {
  const origin = corsOrigins()

  if (!origin) {
    return false // disable CORS
  }

  return {
    origin,
    credentials: true
  }
}

function corsOrigins() {
  if (process.env.CORS_ORIGINS) {
    return process.env.CORS_ORIGINS.split(',')
      .map(o => o.trim())
  }

  if (process.env.NODE_ENV === 'development') {
    return ['*']
  }
}
