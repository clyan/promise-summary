## 为什么学
## 为什么有需要异步
## 实现异步的多种方式
## 微任务与宏任务
   1. callback
   2. generator
   3. promise
   4. async await
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

## Vue.nextick的实现原理
