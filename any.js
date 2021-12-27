
const { asyncFulfilledTask, asyncRejectedTask } = require("./util")

// 核心：有一个成功就成功

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

const  rejectPromiseAll = Promise.any([asyncRejectedTask(2, 2000), asyncRejectedTask(3, 1000), asyncRejectedTask(4, 3000)])
console.log(rejectPromiseAll)
rejectPromise.then((res) => {
    console.log(res+"11111")
})

const  data = Promise.any([1, new Set(), 1])

// 谁先输出，为什么
console.log(data)

data.then((res) => {
    console.log(res)
})