function dump(node, indent = 0) {
    const type = node.type;
    const desc = type === 'Root' ? '' : type === 'Element' ? node.tag : node.content
    console.log(`${'-'.repeat(indent)}${type}: ${desc}`)
    // 递归打印子节点
    if (node.children) {
        node.children.forEach(n => dump(n, indent + 2))
    }
}
function traverseNode(ast, context) {
    context.currentNode = ast;
    // 1.增加退出阶段的回调函数数组
    const exitFns = []
    const transforms = context.nodeTransforms;
    for (let transform of transforms) {
        // 2.转换函数可以返回另外一个函数，该函数即作为退出阶段的回调函数
        const onExit = transform(context.currentNode, context)
        if (onExit) {
            // 将退出阶段的回调函数添加到exitFns数组中
            exitFns.push(onExit)
        }
        if (!context.currentNode) return
    }
    const children = context.currentNode.children;
    if (children) {
        for (let i = 0; i < children.length; i++) {
            context.parent = context.currentNode;
            context.childIndex = i;
            traverseNode(children[i], context)
        }
    }
    // 在阶段处理的最后阶段执行缓存到exitFns中的回调函数
    // 注意，这里我们要反序执行
    let i = exitFns.length;
    while (i--) {
        exitFns[i]()
    }
}
function transform(ast, nodeTransforms) {
    const context = {
        currentNode: null,
        childIndex: 0,
        parent: null,
        replaceNode(node) {
            context.currentNode = node;
            context.parent.children[context.childIndex] = node;
        },
        // 删除当前节点
        removeNode() {
            if (context.parent) {
                context.parent.children.splice(context.childIndex, 1)
                context.currentNode = null;
            }
        },
        nodeTransforms,
    }
    traverseNode(ast, context)
    console.log(dump(ast))
}

module.exports = transform;