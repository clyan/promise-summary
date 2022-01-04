
const { asyncFulfilledTask, asyncRejectedTask } = require("./util")

// 核心：看谁跑的快

const  fulfilledPromise = Promise.race([1, new Set(), asyncFulfilledTask(1, 2000)])

console.log(fulfilledPromise)
fulfilledPromise.then((res) => {
    console.log(res)
})


const  rejectPromise = Promise.race([asyncFulfilledTask(2, 2000), asyncFulfilledTask(3, 1000), asyncRejectedTask(4, 500)])
console.log(rejectPromise)
rejectPromise.then((res) => {
    console.log(res)
})


const  data = Promise.race([1, new Set(), 1])

// 谁先输出，为什么
console.log("data", data)

data.then((res) => {
    console.log(res)
})