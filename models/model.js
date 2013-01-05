
module.exports = function(redis) {
  return {
    User: require('./user')(redis)
  }
}

