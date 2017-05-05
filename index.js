#! /usr/bin/env node

require('./utils/proto')
const package = require('./package.json')
const watch = require('node-watch')
const program = require('commander')
const output = require('./utils/output')
const exec = require('./utils/exec')
const status = require('./utils/status')
const { createDirName, copyDir, isDir } = require('./utils/files')
const { invalidPath, invalidBuild, pathNotSupplied } = require('./messages')

program
.version(package.version)
.alias('csync')

program
.command('build [path_to_app]')
.option('-s, --source [path_to_src]', 'What is the name of the source subdirectory', 'src')
.option('-d, --dist [path_to_dist]', 'What is the name of the dist subdirectory', 'dist')
.option('-w, --watch', 'Watch web directory for changes')
.option('-p, --physical', 'Run the app on a physical device')
.on('--help', buildHelp)
.action(checkWatch(build))

program
.command('*')
.action(defaultCommand)

if (process.argv.slice(2).length) {
  program.parse(process.argv)
} else {
  defaultCommand()
}

function loader (steps) {
  status.start({
    pattern: '  {loader.bar}  |  {spinner.monkey}  |  {uptime}  '
  })
  return status.addItem('loader', {
    max: steps.length,
    steps: steps
  })
}

function checkWatch (fn) {
  return function () {
    const args = Array.fromArgs(arguments)
    const options = args[args.length - 1]
    const next = () => fn.apply(null, args)

    if (!options.watch || !options.source) return next()

    watchSrc(options.source, next)
  }
}

function watchSrc (srcName, fn) {
  const srcPath = createDirName('', srcName)
  const srcOutput = () => output(output.style('Watching for changes: ', 'green') + srcPath)
  const run = () => fn().then(srcOutput)

  watch(srcPath, { recursive: true }, function (evt, file) {
    output(output.style('File Changed: ', 'green') + file.replace(srcPath, ''))
    run()
  })

  run()
}

function build (app, options) {

  if (!app) return errorCommand({ message: pathNotSupplied + ' Cordova project' })

  const distPath = createDirName('', options.dist)
  const webPath = createDirName('')

  const wwwPath = createDirName(app, 'www')
  const appPath = createDirName(app)

  const progress = loader([
    'Project compiled successfully',
    'Moved compiled project to \''+wwwPath+'\'',
    'Cordova project cleaned successfully',
    'Cordova project prepared successfully',
    'Cordova project running successfully'
  ])

  return Promise.resolve(webPath)
  .then(isDir)
  .then((valid) => {
    if (!valid) return Promise.reject({message: web + invalidPath})
  })
  .then(() => exec('npm run csync', webPath))
  .then(() => progress.doneStep(true))
  .then(() => distPath)
  .then(isDir)
  .then((valid) => {
    if (!valid) return Promise.reject({message: distPath + invalidBuild})
  })
  .then(() => appPath)
  .then(isDir)
  .then((valid) => {
    if (!valid) return Promise.reject({message: app + invalidPath})
  })
  .then(() => copyDir(distPath, wwwPath))
  .then(() => progress.doneStep(true))
  .then(() => exec('cordova clean', appPath))
  .then(() => progress.doneStep(true))
  .then(() => exec('cordova prepare', appPath))
  .then(() => progress.doneStep(true))
  .then(() => exec(options.physical ? 'cordova run --device' : 'cordova run', appPath))
  .then(() => progress.doneStep(true))
  .then(() => status.stop())
  .catch(errorCommand)
}

function buildHelp () {
  output('  <path_to_app> Path of the Cordova project to be compiled to')
}

function errorCommand (err) {
  output.error(err.message)
  status.stop()
  process.exit(1)
}

function defaultCommand (env) {
  status.stop()
  program.outputHelp()
  process.exit(0)
}
