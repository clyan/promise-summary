## 为什么需要异步
看一下两段代码

只涉及到计算（只用到cpu）的同步执行

```
console.log("1")
console.log("2")
```

getSyncData 模拟同步的获取一个网络数据，并且在3s后返回结果，那么2就要等3s后才能输出

```
console.log("1")
getSyncData(3000)
console.log("2")
```

那么你可能会问，为什么不换个位置, 如下： 很完美, 1 和 2 都立马就输出了，getSyncData 放最后一个，随便他多久

```
console.log("1")
console.log("2")
getSyncData(3000)
```

此时又多出一个2s的任务，那么就需要5s的时间，才能执行完以下的代码

```
console.log("1")
console.log("2")
getSyncData(3000)
getSyncData(2000)
```

改为异步就不一样了,  两个都是异步执行，最后就只需要3s就能才能执行完以下的代码

```
console.log("1")
console.log("2")
getAsyncData(3000)
getAsyncData(2000)
```

可以理解为两个接口， 一个接口获取页面的中的文章列表信息，一个接口时获取地理信息列表，这两个接口压根没有关联，需要同时获取，这就需要异步



但有时候异步接口之间也需要同步执行， 比如：先获取文章分类，再根据文章分类查询文章， 两个都为异步任务，但他们也需要同步（相对的概念）执行



## setTimeout 是ECMAScript （JS）的 API吗？

不是，在浏览器环境下，它是由window对象提供的，并不是 ECMAScript 规范中的，在其他环境下并不保证有setTimeoutAPI, 比如Node(虽说不保证，但node也实现了这个api,哈哈)
[setTimeout 是 JavaScript 本身的一部分还是只是浏览器提供的 api？](https://stackoverflow.com/questions/36754971/is-settimeout-a-part-of-javascript-it-self-or-it-is-just-an-api-that-the-browser)



# eventLoop



## 微任务与宏任务

**宏任务：**

网络请求:（fetch  XMLHttpRequest）

DOM事件： window.addEventListener 

定时任务：setTimeout、 setInterval

**微任务：**

Promise.then内的回调

MutationObserver（监听DOM树变化）

IntersectionObserver ( 用于检测元素是否可见) 

 Object.observe （已被废弃， https://github.com/luokuning/blogs/issues/1）

**其他：**node中存在的异步任务

setImmediate 



### 为什么要有宏任务，有了宏任务后为什么又要有微任务

定时器、网络请求这种都是在别的线程跑完之后通知主线程的普通异步逻辑，所以都是宏任务。

而高优任务的这三种也很好理解，MutationObserver 监听某个对象的变化的，变化是很瞬时的事情，肯定要马上响应，不然可能又变了，Promise 是组织异步流程的，异步结束调用 then 也是很高优的。

这就是浏览器里的 Event Loop 的设计：**设计 Loop 机制和 Task 队列是为了支持异步，解决逻辑执行阻塞主线程的问题，设计 MicroTask 队列的插队机制是为了解决高优任务尽早执行的问题。**

> 这篇文章讲的很直观

http://interview.poetries.top/fe-base-docs/browser/part4/lesson18.html#%E5%AE%8F%E4%BB%BB%E5%8A%A1

   1. callback
  ```js

  ```
   2. generator

   3. promise

      // 同步执行
  ```js
  new Promise((resolve, reject)=> {
      resolve('2')
  }).then((data)=> {
      console.log(data)
  })
  console.log("1")
  ```
   4. async await
      ```js
      const getData = () => new Promise((resolve, reject) => setTimeout(()=> resolve("data") ,1000))
      
      function *testD() {
        const data = yield getData();
        console.log("data", data);
        const data2 = yield getData();
        console.log("data2", data2);
        return "success";
      }
      
      const test = asyncToGenerator(testD);
      test().then(res => console.log(res));
      
      function asyncToGenerator(generatorFunc) {
        return function (...params) {
          const gen = generatorFunc.apply(this, ...params);
          return new Promise((resolve, reject) => {
            function step(key, arg) {
              let generatorResult;
              try {
                generatorResult = gen[key](arg)
              } catch (error) {
                return reject(error)
              }
              const {value, done} = generatorResult;
              if(done) {
                return resolve(value)
              } else {
                return Promise.resolve(value).then(function onResolve(data) {
                  step("next", data)
                }, function onReject(error) {
                  step("throw", error)
                })
              }
            }
            step("next")
          })
        }
      }
      ```

      
## Promise
### all

核心： 等待多个

```js
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
```
### any
```js
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
```
### allSettled

> 返回所有的结果，不管是成功的还是失败的

```js
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
```
### race

多个任务看谁跑得快，不管是失败还是成功，只要状态改变，就改变

```js
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
```
以上方法的核心特点： 根据传入的集合，决定新返回的promise的状态及其返回值

### resolve

> 返回一个成功fulfilled的promise

1. data 属于  Promise 直接返回 data 
2. 如果data 符合 thenable对象，则执行then **（queueMicrotask用于模拟异步）** [queueMicrotask](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide)
3. 其他情况直接resolve(data)

```js
Promise.resolve = function(data) {
    if(data instanceof Promise) {
        return data
    }
    return new Promise((resolve, reject) => {
       if(data && data.then && typeof data.then === 'function') {
           // 内置APi,用于异步执行任务
            queueMicrotask(()=>{data.then(resolve, reject)})
       } else {
            resolve(data)
       }
    })
}
```
**test**

```js
let thenable = {
    then: (resolve, reject) => {
      resolve(123)
    }
}
  
let pt = Promise.resolve(thenable) 

console.log(pt)
pt.then((res)=> {
    console.log(res)
})
```



### reject

> 返回一个成功rejected的promise

```js
Promise.reject = function(data) {
    return new Promise((resolve, reject) => {
       reject(data)
    })
}
```

### then
### catch
### finally

```js
Promise.prototype.finally = function(callback) {
    this.then(value => {
      return Promise.resolve(callback()).then(() => {
        return value;
      })
    }, error => {
      return Promise.resolve(callback()).then(() => {
        throw error;
      })
    })
}
```

### 链式异步执行任务
```js
let runner = new Promise((resolve, reject)=> {
    let chain = Promise.resolve();
    chain = chain.then(()=> {this.checkNodeVersion();}); // 检查node版本信息
    chain = chain.then(()=> {this.initArgs();}); // 初始化参数
    chain = chain.then(()=> {this.init();});
    chain = chain.then(()=> {this.exec();});
    chain.catch(err => {
        console.error(err)
    })
})
```

**链式执行任务：** 2后输出A, 再过1s输出B

```js
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
```





## Vue.nextick的实现原理

https://github1s.com/vuejs/vue/blob/HEAD/src/core/instance/render.js#L65

```
  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this)
  }
```

https://github1s.com/vuejs/vue/blob/HEAD/src/core/util/next-tick.js#L35

Promise -> MutationObserver -> setImmediate ->  setTimeout

```
/* @flow */
/* globals MutationObserver */

import { noop } from 'shared/util'
import { handleError } from './error'
import { isIE, isIOS, isNative } from './env'

export let isUsingMicroTask = false

const callbacks = []
let pending = false

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

let timerFunc

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks) 
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}

```

