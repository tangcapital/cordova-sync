const exec = require('child_process').exec

function execute (command, cwd) {
  return new Promise((res, rej) => {
    exec(command, { cwd, maxBuffer: 1024 * 500 }, function (error, stdout, stderr) {
      if (error) return rej(error)
      res({ stdout, stderr })
    })
  })
}

module.exports = execute
