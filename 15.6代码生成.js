const ast = require("./15.3.version2.ast");
const transform = require("./15.4ast转换");

function compile(template) {
    const _ast = ast(template);
    transform(_ast)
    const code = generate(ast.jsNode)
    return code;
}

function genNodeList(nodes, context) {
    const { push } = context;
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        genNode(node, context)
        if (i < nodes.length - 1) {
            push(', ')
        }
    }
}

function genArrayExpression(node, context) {
    const { push } = context;
    push('[')
    genNodeList(node.elements, context)
    push(']')
}

function genReturnStatement(node, context) {
    const { push } = context;
    push('return ')
    genNode(node.return, context)
}

function genStringLiteral(node, context) {
    const { push } = context;
    // 对于字符串字面量，只需要追加与node.value对应的字符串即可
    push(`'${node.value}'`)
}

function genCallExpression(node, context) {
    const { push } = context;
    const { callee, arguments: args } = node;
    push(`${callee.name}(`)
    genNodeList(args, context)
    push(')')
}
function genFunctionDecl(node, context) {
    const { push, indent, deIndent } = context;
    push(`function ${node.id.name}`)
    push('(')
    // 调用genNodeList为函数的参数生成代码
    genNodeList(node.params, context)
    push(') ')
    push('{')
    indent()
    node.body.forEach(n => genNode(n, context))
    deIndent()
    push('}')
}

function genNode(node, context) {
    switch (node.type) {
        case 'FunctionDecl':
            genFunctionDecl(node, context)
            break;
        case 'ReturnStatement':
            genReturnStatement(node, context)
            break;
        case 'CallExpression':
            genCallExpression(node, context)
            break;
        case 'StringLiteral':
            genStringLiteral(node, context)
            break;
        case 'ArrayExpression':
            genArrayExpression(node, context)
            break;
    }
}
function generate(node) {
    const context = {
        code: '',
        // 当前缩进的级别，初始值为0，即没有缩进
        currentIndent: 0,
        // 该函数用来换行
        // 另外，换行时应该保留缩进，所以要追加currentIndent * 2个空格字符
        newLine() {
            context.code += '\n' + '  '.repeat(context.currentIndent)
        },
        // 用来缩进，即让currentIndent自增后，调用换行函数
        indent() {
            context.currentIndent++
            context.newLine()
        },
        // 取消缩进
        deIndent() {
            context.currentIndent--
            context.newLine()
        },
        push(code) {
            context.code += code;
        }
    }
    genNode(node, context)
    return context.code;
}

module.exports = generate;