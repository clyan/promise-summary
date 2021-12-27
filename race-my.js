const { asyncFulfilledTask, asyncRejectedTask, canIterable } = require("./util")

Promise.race = function(iterable) {
    if(!canIterable(iterable)) {
        if(iterable === undefined) {
            throw new TypeError(`${ iterable } is not iterable (cannot read property Symbol(Symbol.iterator))`)
        } else {
            throw new TypeError(`${typeof iterable}  ${ iterable } is not iterable (cannot read property Symbol(Symbol.iterator))`)
        }
    }
    return new Promise(function(resolve, reject) {
        for(let i = 0; i < iterable.length; i++) {
            Promise.resolve(iterable[i]).then(function(data) {
                return resolve(data)
            }, function(error) {
                return reject(error)
            })
        }
    })
}

// 核心：看谁跑的快

const  fulfilledPromise = Promise.race([1, new Set(), asyncFulfilledTask(1, 2000)])

console.log(fulfilledPromise)
fulfilledPromise.then((res) => {
    console.log(res)
})


const  rejectPromise = Promise.race([asyncFulfilledTask(2, 2000), asyncFulfilledTask(3, 1000), asyncRejectedTask(4, 3000)])
console.log(rejectPromise)
rejectPromise.then((res) => {
    console.log(res)
})


const  data = Promise.race([1, new Set(), 1])

// 谁先输出，为什么
console.log(data)

data.then((res) => {
    console.log(res)
})