const transform = require("./15.4ast转换");
const tokenzie = require("./15.2.version2.parser");
const ast = require('./15.3.version2.ast')
const tokens = tokenzie(`<div><p>Vue</p><p>Template</p></div>`)
// const tokens = tokenzie(``)
console.log(tokens)
const todo = ast(tokens)
console.log(JSON.stringify(todo, null, 4))
function transformElement(node, context) {
    console.log('transformElement进入阶段执行')
    if (node.type === 'Element' && node.tag === 'p') {
        node.tag = 'h1'
    }
    return () => {
        console.log('transformElement退出阶段执行')
    }
}

function transformText(node, context) {
    console.log('transformText进入阶段执行', node)
    if (node.type === 'Text') {
        context.replaceNode({ type: 'Element', tag: 'span' })
    }
    return () => {
        console.log('transformText退出阶段执行')
    }
}
transform(todo, [
    transformElement,
    transformText
])