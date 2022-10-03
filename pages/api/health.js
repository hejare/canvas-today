import Cors from 'cors'

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware( req, res, callback) {
  return new Promise((resolve, reject) => {
    callback(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler( req, res ) {
  await runMiddleware(req, res, cors)

  res.status(200).json({
    status: 'ok',
    timestamp: Date.now(),
  })
}



