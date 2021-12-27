const { asyncFulfilledTask, asyncRejectedTask, canIterable } = require("./util")

// 核心：不关失败与否，结果都要告诉我
Promise.allSettled = function(iterable) {
    if(!canIterable(iterable)) {
        if(iterable === undefined) {
            throw new TypeError(`${ iterable } is not iterable (cannot read property Symbol(Symbol.iterator))`)
        } else {
            throw new TypeError(`${typeof iterable}  ${ iterable } is not iterable (cannot read property Symbol(Symbol.iterator))`)
        }
    }
    return new Promise(function(resolve, reject) {
        let result = []
        for(let i = 0; i < iterable.length; i++) {
            Promise.resolve(iterable[i]).then(function(data) {
                result.push({
                    status: 'fulfilled',
                    value: data
                })
                if(result.length === iterable.length) {
                    return resolve(result)
                }
            }, function(error) {
                result.push({
                    status: 'rejected',
                    value: error
                })
                if(result.length === iterable.length) {
                    return resolve(result)
                 }
            })
        }
    })
}

const  fulfilledPromise = Promise.allSettled([1, new Set(), asyncFulfilledTask(1, 2000)])

console.log(fulfilledPromise)
fulfilledPromise.then((res) => {
    console.log(res)
})


const  rejectPromise = Promise.allSettled([asyncFulfilledTask(2, 2000), asyncFulfilledTask(3, 1000), asyncRejectedTask(4, 3000)])
console.log(rejectPromise)
rejectPromise.then((res) => {
    console.log(res)
})


const  data = Promise.allSettled([1, new Set(), 1])

// 谁先输出，为什么
console.log(data)

data.then((res) => {
    console.log(res)
})