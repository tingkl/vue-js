function createStringLiteral(value) {
    return {
        type: 'StringLiteral',
        value
    }
}
function createIdentifier(name) {
    return {
        type: 'Identifier',
        name
    }
}

function createArrayExpression(elements) {
    return {
        type: 'ArrayExpression',
        elements
    }
}

function createCallExpression(callee, arguments) {
    return {
        type: 'CallExpression',
        callee: createIdentifier(callee),
        arguments
    }
}

// 转换文本节点
function transformText(node) {
    if (node.type !== 'Text') {
        return;
    }
    // 文本节点对应的JavaScript AST节点其实就是一个字符串字面量
    // 因此只需要使用node.content创建一个StringLiteral类型的节点即可
    // 最后将文本节点对应的JavaScript AST节点添加到node.jsNode属性下
    node.jsNode = createStringLiteral(node.content)
}

// 转换标签节点
function transformElement(node) {
    // 将转换代码编写在退出阶段的回调函数中
    // 这样可以保证该标签节点的子节点全部被处理完毕
    return () => {
        if (node.type !== 'Element') {
            return;
        }
        // 1.创建h函数调用语句
        // h函数调用的第一个参数是标签名称，因此我们以node.tag来创建一个字符串字面量节点作为第一个参数
        const callExp = createCallExpression('h', [createStringLiteral(node.tag)])
        // 2.处理h函数调用的参数
        callExp.arguments.push(node.children.length === 1
            // 如果当前标签节点只有一个子节点，则直接使用子节点的jsNode作为参数
            ? node.children[0].jsNode : createArrayExpression(node.children.map(c => c.jsNode)))

        // 3.将当前标签节点对应的JavaScript AST添加到jsNode属性下
        node.jsNode = callExp;
    }
}

// 转换Root根节点
function transformRoot(node) {
    // 将逻辑编写在退出阶段的回调函数中，保证子节点全部被处理完毕
    return () => {
        // 如果不是根节点，则什么都不做
        if (node.type !== 'Root') {
            return
        }
        // node 是根节点，根节点的第一个子节点就是模板的根节点
        // 当然，这里我们暂时不考虑模板存在多个根节点的情况
        const vnodeJSAST = node.children[0].jsNode;
        // 创建render函数的声明语句节点，将vnodeJSAST作为函数体的返回语句
        node.jsNode = {
            type: 'FunctionDecl',
            id: { type: 'Identifier', name: 'render' },
            params: [],
            body: [
                {
                    type: 'ReturnStatement',
                    return: vnodeJSAST
                }
            ]
        }
    }
}

module.exports = {
    transformRoot,
    transformElement,
    transformText
}