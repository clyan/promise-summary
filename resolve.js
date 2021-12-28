let thenable = {
    then: (resolve, reject) => {
      resolve(123)
    }
}
  
console.log(Promise.resolve(1))  //这会造成一个死循环

let pt = Promise.resolve(thenable)
console.log(pt)
pt.then((res)=> {
    console.log(res)
})