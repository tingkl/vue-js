const transform = require("./15.4ast转换");
const tokenzie = require("./15.2.version2.parser");
const ast = require('./15.3.version2.ast')
const tokens = tokenzie(`<div><p>Vue</p><p>Template</p></div>`)
const { transformElement, transformText, transformRoot } = require('./15.5.javascriptast')
const generate = require('./15.6代码生成')
// const tokens = tokenzie(``)
console.log(tokens)
const todo = ast(tokens)
console.log(JSON.stringify(todo, null, 4))

transform(todo, [
    transformRoot,
    transformElement,
    transformText
])
console.log(JSON.stringify(todo.jsNode, null, 4))
const code = generate(todo.jsNode)
console.log(code)


