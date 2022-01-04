new Promise((resolve, reject)=> {
    resolve('2')
}).then((data)=> {
    console.log(data)
})
console.log("1")



new Promise((resolve, reject)=> {
    setTimeout(() => {
        resolve(4)
    }, 1000)
}).then((data)=> {
    console.log(data)
})
console.log("3")