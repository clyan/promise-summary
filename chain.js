const { asyncFulfilledTask, asyncRejectedTask } = require("./util")
/**
 * @description 异步顺序调用
 * @param {*} tasks 
 * @returns 
 */
function sequenceTasks(tasks) {
  function recordValue(results, value) {
    results.push(value);
    return results;
  }
  var pushValue = recordValue.bind(null, []);
  return tasks.reduce(function (promise, task) {
    return promise.then(task).then(pushValue);
  }, Promise.resolve());
}
function A() {
    return new Promise((resolve) => {
        setTimeout(()=> {
            console.log('A')
            resolve('A')
        }, 2000) 
    })
}
function B() {
    return new Promise((resolve) => {
        setTimeout(()=> {
            console.log('B')
            resolve('B')
        }, 1000) 
    })
}  

const result = sequenceTasks([A,B])
result.then(res=> {
    console.log(res)
})