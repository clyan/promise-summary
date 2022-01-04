## 为什么需要异步



## 实现异步的多种方式



# eventLoop

![image-20220104200900161](D:\my\promise-summary\imgs\image-20220104200900161.png)



## 微任务与宏任务

   1. callbacks

   2. generator

   3. promise

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
### reject

```
Promise.reject = function(data) {
    return new Promise((resolve, reject) => {
       reject(data)
    })
}
```

### then
### catch
### finally

### 链式异步执行任务
```js
let runner = new Promise((resolve, reject)=> {
    let chain = Promise.resolve();
    chain = chain.then(()=> {this.checkNodeVersion();});
    chain = chain.then(()=> {this.initArgs();});
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

// nextTick行为利用可以访问的微任务队列  
// 通过原生的Promise。 然后或MutationObserver。  
// MutationObserver有更广泛的支持，但是它在iOS的UIWebView中有严重的bug，当在触摸事件处理程序中触发时 ,它完全停止工作后触发几次  
// 所以，如果native Promise可用我们会用到它

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    // 在有问题的UIWebViews中，Promise。 然后不会完全断裂, but
    // 它可能会陷入一种奇怪的状态，即回调被推入微任务队列，但队列没有被刷新  
    // 处理一个计时器。 因此，我们可以通过添加一个空计时器来“强制”刷新微任务队列。  
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
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
  // Fallback to setImmediate.
  // 从技术上讲，它利用了(宏)任务队列  
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  // setTimeout的回退。
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

