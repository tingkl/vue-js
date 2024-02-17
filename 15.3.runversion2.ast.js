const tokenzie = require("./15.2parser.version2");
const ast = require('./15.3ast.version2')
const tokens = tokenzie(`<p name="1" id='ff  f33 ' v-if="vIf" emptyProp>  vu  e  <a @click="doClick" blankProp >  thisisa  </a> </p>`)
console.log(tokens);
console.log(JSON.stringify(ast(tokens), null, 4))