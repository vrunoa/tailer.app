const loader = require('../node_modules/monaco-editor/min/vs/loader.js')
loader.require.config({
  baseUrl: encodeURI(path.join(__dirname, '..', 'node_modules', 'monaco-editor', 'min'))
})
self.module = undefined
self.process.browser = true

loader.require(['vs/editor/editor.main'], () => {
  let editor = monaco.editor.create(document.getElementById('editor'), {
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true
  })
})
