//
// 传参为一个 Promise, 则直接返回它。
// 传参为一个 thenable 对象，返回的 Promise 会跟随这个对象，采用它的最终状态作为自己的状态。
// 其他情况，直接返回以该值为成功状态的promise对象。
Promise.resolve = function(data) {
    if(data instanceof Promise) {
        return data
    }
    return new Promise((resolve, reject) => {
       if(data && data.then && typeof data.then === 'function') {
            queueMicrotask(()=>{data.then(resolve, reject)})
       } else {
            resolve(data)
       }
    })
}
let thenable = {
    then: (resolve, reject) => {
      resolve(123)
    }
}
console.log(Promise.resolve(1))
let pt = Promise.resolve(thenable)
console.log(pt)
pt.then((res)=> {
    console.log(res)
})