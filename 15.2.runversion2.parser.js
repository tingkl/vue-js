const tokenzie = require("./15.2parser.version2");

const tokens = tokenzie(`<p name="1" id='ff  f33 ' v-if="vIf" emptyProp>  vu  e  <a @click="doClick" blankProp >  thisisa  </a> </p>`)
console.log(tokens);
// [
//     { type: 'tag', name: 'p' },
//     { type: 'attrName', content: 'name' },
//     { type: 'attrValue', content: '1' },
//     { type: 'attrName', content: 'id' },
//     { type: 'attrValue', content: 'ff  f33 ' },
//     { type: 'attrName', content: 'v-if' },
//     { type: 'attrValue', content: 'vIf' },
//     { type: 'attrName', content: 'emptyProp' },
//     { type: 'text', content: '  vu  e  ' },
//     { type: 'tag', name: 'a' },
//     { type: 'attrName', content: '@click' },
//     { type: 'attrValue', content: 'doClick' },
//     { type: 'attrName', content: 'blankProp' },
//     { type: 'text', content: '  thisisa  ' },
//     { type: 'tagEnd', content: 'a' },
//     { type: 'text', content: ' ' },
//     { type: 'tagEnd', content: 'p' }
// ]