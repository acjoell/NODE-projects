const fs = require('node:fs/promises')

// Using promises
fs.readdir('.')
  .then(files => {
    files.forEach(file => {
      console.log(file)
    })
  })
  .catch(err => {
    console.error('Error reading directory:', err)
  })

// Using callback
fs.readdir('.', (err, files) => {
  if (err) {
    console.error('Error reading directory:', err)
    return
  }

  files.forEach(file => {
    console.log(file)
  })
})
