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