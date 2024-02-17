function ast(tokens) {
    let token;
    let root = {
        type: 'Root',
        children: []
    }
    var stack = [root]
    while (tokens.length > 0) {
        token = tokens[0]
        switch (token.type) {
            case 'tag':
                tokens.shift();
                var element = {
                    type: 'Element',
                    tag: token.name,
                    props: [],
                    children: [],
                }
                if (stack.length > 0) {
                    stack[stack.length - 1].children.push(element)
                } else {
                    throw 'stack empty'
                }
                stack.push(element)
                break;
            case 'tagEnd':
                tokens.shift();
                stack.pop();
                break;
            case 'text':
                tokens.shift();
                var element = {
                    type: 'Text',
                    content: token.content
                }
                if (stack.length > 0) {
                    stack[stack.length - 1].children.push(element)
                } else {
                    throw 'stack empty'
                }
                break;
            case 'attrName':
                tokens.shift();
                var prop = {
                    name: token.content,
                }
                token = tokens[0]
                if (token.type == 'attrValue') {
                    prop.value = token.content
                    tokens.shift();
                }
                if (stack.length > 0) {
                    stack[stack.length - 1].props.push(prop)
                } else {
                    throw 'stack empty'
                }
                break;
            default:
                console.error(token)
                throw 'unexpected token'
        }
    }
    stack.pop();
    return root;
}
module.exports = ast;