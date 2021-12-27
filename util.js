/**
 * 返回一个成功的Promise
 * @param {*} data 
 * @param {*} delay 
 * @returns 
 */
const asyncFulfilledTask = function(data, delay) {
    return new Promise((resolve)=> {
        setTimeout(() => {
            resolve(data)
        }, delay)
    })
}

/**
 * 返回一个失败的Promise
 * @param {*} data 
 * @param {*} delay 
 * @returns 
 */
const asyncRejectedTask = function(data, delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(data)
        }, delay)
    })
}

/**
 * 判断是否是一个可迭代对象
 * @param {*} obj 
 * @returns 
 */
const  canIterable = obj => {
    return typeof obj === 'object' && obj !== null  && typeof obj[Symbol.iterator] === 'function'
};

module.exports =  {
    asyncFulfilledTask,
    asyncRejectedTask,
    canIterable
}