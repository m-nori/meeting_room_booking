
module.exports = function(){
  return {
    index: function(req, res, next) {
      res.render("index");
    }
  };
};

