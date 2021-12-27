const { asyncFulfilledTask, asyncRejectedTask } = require("./util")

// 核心： 全部成功则成功
// all接收，数组、Set、 Map集合
// 返回: promise

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

// 谁先输出，为什么
console.log(data)
console.log(1)

data.then((res) => {
    console.log(res)
})