var tokens = [
    { type: 'tag', name: 'p' },
    { type: 'attrName', content: 'name' },
    { type: 'attrValue', content: '1' },
    { type: 'attrName', content: 'id' },
    { type: 'attrValue', content: 'ff  f33 ' },
    { type: 'attrName', content: 'v-if' },
    { type: 'attrValue', content: 'vIf' },
    { type: 'attrName', content: 'emptyProp' },
    { type: 'text', content: '  vu  e  ' },
    { type: 'tag', name: 'a' },
    { type: 'attrName', content: '@click' },
    { type: 'attrValue', content: 'doClick' },
    { type: 'attrName', content: 'blankProp' },
    { type: 'text', content: '  thisisa  ' },
    { type: 'tagEnd', content: 'a' },
    { type: 'text', content: ' ' },
    { type: 'tagEnd', content: 'p' }
]

function ast(tokens) {
    let token;
    let root = {
        type: 'root',
        children: []
    }
    var stack = [root]
    while (tokens.length > 0) {
        token = tokens[0]
        switch (token.type) {
            case 'tag':
                tokens.shift();
                var element = {
                    type: 'element',
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
                    type: 'text',
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

`<p name="1" id='ff  f33 ' v-if="vIf" emptyProp>  vu  e  <a @click="doClick" blankProp >  thisisa  </a> </p>`
console.log(JSON.stringify(ast(tokens), null, 4))
var demo = {
    "type": "root",
    "children": [
        {
            "type": "element",
            "tag": "p",
            "props": [
                {
                    "name": "name",
                    "value": "1"
                },
                {
                    "name": "id",
                    "value": "ff  f33 "
                },
                {
                    "name": "v-if",
                    "value": "vIf"
                },
                {
                    "name": "emptyProp"
                }
            ],
            "children": [
                {
                    "type": "text",
                    "content": "  vu  e  "
                },
                {
                    "type": "element",
                    "tag": "a",
                    "props": [
                        {
                            "name": "@click",
                            "value": "doClick"
                        },
                        {
                            "name": "blankProp"
                        }
                    ],
                    "children": [
                        {
                            "type": "text",
                            "content": "  thisisa  "
                        }
                    ]
                },
                {
                    "type": "text",
                    "content": " "
                }
            ]
        }
    ]
}