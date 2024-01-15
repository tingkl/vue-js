const obj = { name: 'obj' }
const proto = { bar: 1, name: 'proto' }
const child = reactive(obj)
const parent = reactive(proto)
Object.setPrototypeOf(child, parent)
function reactive(obj) {
    return new Proxy(obj, {
        set(target, key, newVal, receiver) {
            const oldValue = target[key]
            const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
            console.log('before', key, type, target, newVal, receiver)
            // const res = Reflect.set(target, key, newVal, receiver)
            const res = Reflect.set(target, key, newVal)
            console.log('after', key, type, target, newVal, receiver)
            // if (oldValue !== newVal && (oldValue === oldValue || newVal === newVal)) {
            //     console.log('trigger', key, type)
            // }
            return res;
        }
    })
}
console.log(child.bar)
child.bar = 2
console.log(child.bar, child.__proto__.bar)
