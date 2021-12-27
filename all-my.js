const { asyncFulfilledTask, asyncRejectedTask, canIterable } = require("./util")

Promise.all = function(iterable) {
    if(!canIterable(iterable)) {
        if(iterable === undefined) {
            throw new TypeError(`${ iterable } is not iterable (cannot read property Symbol(Symbol.iterator))`)
        } else {
            throw new TypeError(`${typeof iterable}  ${ iterable } is not iterable (cannot read property Symbol(Symbol.iterator))`)
        }
    }
    return new Promise(function(resolve, reject) {
        let result = [];
        for(let i = 0; i < iterable.length; i++) {
            Promise.resolve(iterable[i]).then(function(data) {
                result.push(data)
                if(result.length === iterable.length) {
                    resolve(result)
                }
            }, function(error) {
                return reject(error)
            })
        }
    })
}

const  fulfilledPromise = Promise.all([1, new Set(), asyncFulfilledTask(1, 2000)])
console.log(fulfilledPromise)
fulfilledPromise.then((res) => {
    console.log(res)
})

const  rejectPromise = Promise.all([1, new Set(), asyncRejectedTask(1, 2000)])
console.log(rejectPromise)
rejectPromise.then((res) => {
    console.log(res)
})

const  data = Promise.all([1, new Set(), 1])

// 谁先输出
console.log(data)
console.log(1)

data.then((res) => {
    console.log(res)
})