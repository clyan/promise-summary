const { asyncFulfilledTask, asyncRejectedTask, canIterable } = require("./util")

Promise.any = function(iterable) {
    if(!canIterable(iterable)) {
        if(iterable === undefined) {
            throw new TypeError(`${ iterable } is not iterable (cannot read property Symbol(Symbol.iterator))`)
        } else {
            throw new TypeError(`${typeof iterable}  ${ iterable } is not iterable (cannot read property Symbol(Symbol.iterator))`)
        }
    }
    return new Promise(function(resolve, reject) {
        let count = 0
        for(let i = 0; i < iterable.length; i++) {
            Promise.resolve(iterable[i]).then(function(data) {
                return resolve(data)
            }, function(error) {
                count++
                if(count === iterable.length) {
                   resolve(error)
                   throw new AggregateError("All promises were rejected")
                }
            })
        }
    })
}

const  fulfilledPromise = Promise.any([1, new Set(), asyncFulfilledTask(1, 2000)])

console.log(fulfilledPromise)
fulfilledPromise.then((res) => {
    console.log(res)
})

const  rejectPromise = Promise.any([asyncFulfilledTask(2, 2000), asyncFulfilledTask(3, 1000), asyncRejectedTask(4, 3000)])
console.log(rejectPromise)
rejectPromise.then((res) => {
    console.log(res)
})

// const  rejectPromiseAll = Promise.any([asyncRejectedTask(2, 2000), asyncRejectedTask(3, 1000), asyncRejectedTask(4, 3000)])
// console.log(rejectPromiseAll)
// rejectPromise.then((res) => {
//     console.log(res+"11111")
// })

const  data = Promise.any([1, new Set(), 1])

// 谁先输出，为什么
console.log(data)

data.then((res) => {
    console.log(res)
})

Promise.any([])