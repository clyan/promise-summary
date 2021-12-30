const promise = new Promise((resolve) => {
   setTimeout(()=> {
    resolve(1)
   }, 1000)
})
console.log(promise)