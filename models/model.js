
module.exports.model = function(redis) {
  return {
    User: require('./user').model(redis)
  }
}

