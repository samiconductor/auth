const errors = require('./errors')

module.exports = async (db, name, run, timeout = 10000) => {
  let result = null
  let timer = null

  if (!name) {
    throw new errors.InvalidTransactionError('Transaction name must not be empty.')
  }

  await db.exec(`savepoint ${name}`)

  try {
    result = await Promise.race([
      run(),
      new Promise((resolve, reject) => {
        timer = setTimeout(() => {
          reject(new errors.TransactionTimeoutError(`Transaction did not end before the timeout of ${timeout} milliseconds.`))
        }, timeout)
      })
    ])

    clearTimeout(timer)
  } catch(error) {
    await db.exec(`rollback to ${name}`)

    throw error
  }

  await db.exec(`release ${name}`)

  return result
}
