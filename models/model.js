
module.exports = function(mongoose, redisClient) {
  return {
    User: require('./user')(mongoose)
  }
}

