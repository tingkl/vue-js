// 定义状态机的状态
const State = {
    initial: 1,   // 初始状态
    tagOpen: 2,   // 标签开始状态
    tagNameOpen: 3,   // 标签名称状态
    text: 4,      // 文本状态
    tagEnd: 5,    // 结束标签状态
    tagNameEnd: 6, // 结束标签名称状态
    tagNameOpenBlank: 7, // 标签名开始空白状态
    attrName: 8, // 属性名状态
    attrValueOpen: 9, // 属性值开始状态
    attrValue: 10, // 属性值状态
    attrValueEnd: 11, // 属性值结束状态
    tagNameEndBlank: 12, // 标签名结束空白状态
}

// 一个辅助函数，用于判断是否是字符
function isAlpha(char) {
    return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z'
}

function isAlphaOrNumber(char) {
    return (char >= '0' && char <= '9') || isAlpha(char)
}

function isNotLeftArrow(char) {
    return char != '<'
}

function isBlank(char) {
    return /\s/.test(char)
}

// 接收模板字符串作为参数，并将模板切割为Token返回
function tokenzie(str) {
    // 状态机的当前状态为：初始状态
    let currentState = State.initial
    // 用于缓存字符
    const chars = []
    // 生成的Token会存储到tokens数组中,并作为函数的返回值返回
    const tokens = []
    let quoat = ''; // 属性值开始的时候为 " or '
    let anotherQuoat = '';
    // 使用while循环开启自动机，只要模板字符串没有被消费尽，自动机就会一直运行
    while (str) {
        // 查看第一个字符，注意，这里只是查看，没有消费该字符
        const char = str[0]
        switch (currentState) {
            // 状态机当前处于初始状态
            case State.initial:
                if (char === '<') {
                    // 1. 状态机切换到标签开始状态
                    currentState = State.tagOpen
                    // 2. 消费字符串 <
                    str = str.slice(1)
                } else if (isNotLeftArrow(char)) {
                    // 1. 遇到字母，切换到文本状态
                    currentState = State.text
                    // 2. 将当前字母缓存到chars数组
                    chars.push(char)
                    // 3. 消费当前字符
                    str = str.slice(1)
                } else {
                    throw 'initial ' + char;
                }
                break;
            // 状态机当前处于标签开始状态
            case State.tagOpen:
                console.log('tagOpen', char)
                if (isAlpha(char)) {
                    // 1. 遇到字母，切换到标签名称状态
                    currentState = State.tagNameOpen;
                    // 2. 将档期字符缓存到chars数组
                    chars.push(char)
                    // 3. 消费当前字符
                    str = str.slice(1)
                } else if (char === '/') {
                    // 1. 遇到字符/，切换到结束标签状态
                    currentState = State.tagEnd
                    console.log('State.tagEnd')
                    // 2. 消费字符/
                    str = str.slice(1)
                } else if (isBlank(char)) {
                    str = str.slice(1)
                } else {
                    throw 'tagOpen ' + char;
                }
                break;
            // 状态机当前处于标签名称状态
            case State.tagNameOpen:
                console.log('tagNameOpen', char)
                if (isAlphaOrNumber(char)) {
                    // 1. 遇到字母，由于当前处于标签名称状态，所以不需要切换状态
                    // 但需要将当前字符缓存到chars数组
                    chars.push(char)
                    // 2. 消费当前字符
                    str = str.slice(1)
                } else if (char === '>') {
                    // 1. 遇到字符 >，切换到初始状态
                    currentState = State.initial
                    // 2. 同时创建一个标签Token，并添加到tokens数组中
                    // 注意，此时chars数组中缓存的字符就是标签名称
                    tokens.push({
                        type: 'tag',
                        name: chars.join('')
                    })
                    // 3. chars数组内容已经被消费，清空它
                    chars.length = 0
                    // 4. 同时消费当前字符 >
                    str = str.slice(1)
                } else if (isBlank(char)) {
                    currentState = State.tagNameOpenBlank
                    tokens.push({
                        type: 'tag',
                        name: chars.join('')
                    })
                    chars.length = 0;
                    str = str.slice(1)
                } else {
                    console.log('tagNameOpen', char)
                    throw 'tagNameOpen ' + char;
                }
                break;
            // 状态机当前处于文本状态
            case State.text:
                console.log('text', char)
                if (isNotLeftArrow(char)) {
                    // 1. 遇到字母，保持状态不变，但应该将当前字符缓存到chars数组
                    chars.push(char)
                    // 2. 消费当前字符
                    str = str.slice(1)
                } else if (char === '<') {
                    // 1. 遇到字符<，切换到标签开始状态
                    currentState = State.tagOpen
                    // 2. 从 文本状态 --> 标签状态，此时应该创建文本Token
                    tokens.push({
                        type: 'text',
                        content: chars.join('')
                    })
                    // 3. chars数组内容已经被消费，清空它
                    chars.length = 0
                    // 4. 同时消费当前字符 <
                    str = str.slice(1)
                } else {
                    throw 'text ' + char;
                }
                break
            // 状态机当前处于标签结束状态
            case State.tagEnd:
                if (isAlpha(char)) {
                    // 1. 遇到字母，切换到结束标签名称状态
                    currentState = State.tagNameEnd
                    // 2. 将当前字符缓存到chars数组
                    chars.push(char)
                    // 3. 消费当前字符
                    str = str.slice(1)
                } else if (isBlank(char)) {
                    str = str.slice(1)
                } else {
                    throw 'tagEnd ' + char;
                }
                break
            // 状态机当前处于结束标签名称状态
            case State.tagNameEnd:
                if (isAlphaOrNumber(char)) {
                    chars.push(char)
                    str = str.slice(1)
                } else if (char === '>') {
                    currentState = State.initial
                    tokens.push({
                        type: 'tagEnd',
                        content: chars.join('')
                    })
                    chars.length = 0
                    str = str.slice(1)
                } else if (isBlank(char)) {
                    currentState = State.tagNameEndBlank
                    str = str.slice(1)
                } else {
                    throw 'tagEndName ' + char;
                }
                break
            case State.tagNameEndBlank:
                if (isBlank(char)) {
                    str = str.slice(1)
                } else if (char === '>') {
                    currentState = State.initial;
                    str = str.slice(1)
                } else {
                    throw 'tagNameEndBlank ' + char
                }
                break;
            case State.tagNameOpenBlank:
                console.log('tagNameOpenBlank', char)
                if (isBlank(char)) {
                    str = str.slice(1)
                } else if (isAlpha(char) || char === '@') {
                    currentState = State.attrName;
                    chars.push(char)
                    str = str.slice(1)
                } else if (char == '>') {
                    currentState = State.initial
                    str = str.slice(1)
                } else {
                    throw 'tagNameOpenBlank ' + char
                }
                break;
            case State.attrName:
                console.log('attrName', char)
                if (isBlank(char)) {
                    currentState = State.tagNameOpenBlank;
                    tokens.push({
                        type: 'attrName',
                        content: chars.join('')
                    })
                    chars.length = 0;
                    str = str.slice(1)
                } else if (char === '>') {
                    currentState = State.initial;
                    tokens.push({
                        type: 'attrName',
                        content: chars.join('')
                    })
                    chars.length = 0;
                    str = str.slice(1)
                } else if (isAlphaOrNumber(char) || char === '-') {
                    chars.push(char)
                    str = str.slice(1)
                } else if (char == '=') {
                    currentState = State.attrValueOpen;
                    tokens.push({
                        type: 'attrName',
                        content: chars.join('')
                    })
                    chars.length = 0;
                    str = str.slice(1)
                } else {
                    throw 'attrName ' + char
                }
                break;
            case State.attrValueOpen:
                if (char === '"' || char === "'") {
                    quoat = char;
                    if (quoat == '"') {
                        anotherQuoat = "'"
                    } else {
                        anotherQuoat = '"'
                    }
                    currentState = State.attrValue
                    str = str.slice(1)
                } else {
                    throw 'attrValueOpen ' + char
                }
                break;
            case State.attrValue:
                if (isAlphaOrNumber(char) || isBlank(char) || char == anotherQuoat) {
                    chars.push(char)
                    str = str.slice(1)
                } else if (char == quoat) {
                    currentState = State.attrValueEnd;
                    tokens.push({
                        type: 'attrValue',
                        content: chars.join('')
                    })
                    chars.length = 0;
                    str = str.slice(1)
                } else {
                    throw 'attrValue ' + char
                }
                break;
            case State.attrValueEnd:
                if (isBlank(char)) {
                    currentState = State.tagNameOpenBlank
                    str = str.slice(1)
                } else if (char == '>') {
                    currentState = State.initial
                    str = str.slice(1)
                } else {
                    throw 'attrValueEnd ' + char
                }
                break;
            default:
                throw 'default ' + currentState;
        }
    }
    return tokens;
}
module.exports = tokenzie;