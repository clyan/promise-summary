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