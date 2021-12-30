const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
function Promise(exector) {
    this.status = PENDING;
    this.value = void 0;
    const resolve = (value)=> {
        if(this.status === PENDING) {
            queueMicrotask(()=> {
                this.status = FULFILLED
                this.value = value
            })
        }
    }
    const reject = (value) => {
        if(this.status === PENDING) {
            queueMicrotask(()=> {
                this.status = REJECTED
                this.value = value
            })
        }
    }
    try {
        exector(resolve, reject)
    } catch (error) {
        reject(error)
    }
}

const promise = new Promise((resolve) => {
    setTimeout(()=> {
     resolve(1)
    }, 1000)
 })
 console.log(promise)