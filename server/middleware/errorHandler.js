// server/middleware/errorHandler.js
// Catches anything the chain drops
// Must be the last middleware mounted in index.js

function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err.message)

  const status = parseInt(err.status || err.code) || 500
  const message = err.message || 'Something went wrong'

  if (req.path.startsWith('/api')) {
    return res.status(status).json({ success: false, error: message })
  }

  // For page requests return a simple error page
  return res.status(status).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Error — mLab</title>
      <style>
        body { font-family: 'Trebuchet MS', sans-serif; color: #073f4e;
               display: flex; align-items: center; justify-content: center;
               height: 100vh; margin: 0; }
        .box { text-align: center; }
        h1   { font-size: 48px; margin: 0; color: #8ac052; }
        p    { font-size: 18px; }
        a    { color: #073f4e; }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>${status}</h1>
        <p>${message}</p>
        <a href="/">Go home</a>
      </div>
    </body>
    </html>
  `)
}

module.exports = errorHandler
