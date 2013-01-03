//File name: 'post.js'

var redis = require('redis').createClient();

//Post: Constructor
var Post = module.exports.Post = function(p){
  //p is an optional object
  var p = p || 0;
  this.id;
  this.title = p.title || "";
  this.body = p.body || "";
  this.author = p.author || "anon";
  return this;
};

//Post: Save
Post.prototype.save = function(fn){
  var self = this;
  //Get a new id for the post
  redis.incr('nextPostId', function(err, id){
    self.id = id;
    if (err) throw err;
    //Transaction
    redis.multi()
      .set('pid:' + self.id + ':title', self.title)
      .set('pid:' + self.id + ':body', self.body)
      .set('pid:' + self.id + ':author', self.author)
      .lpush('posts', self.id)
    .exec(function(err){
      if (err) throw err;
      fn(err, self.id);
    });
  });
  return this;
};

//Delete
module.exports.delete = function(id, fn){
  keys = [
    'pid:' + id + ':title',
    'pid:' + id + ':body',
    'pid:' + id + ':author'
  ];
  redis.del(keys, function(err){
    if (err) throw err;
    redis.lrem('posts', 1, id, function(err){
      if (err) throw err;
      fn(err);
    });
  });
};

//Get
module.exports.get = function(id, fn){
  var post = new Post();
  post.id = id;
  redis.get('pid:' + id + ':title', function(err,res){
    if (err) throw err;
    post.title = res;
  });
  redis.get('pid:' + id + ':body', function(err,res){
    if (err) throw err;
    post.body = res;
  });
  redis.get('pid:' + id + ':author', function(err,res){
    if (err) throw err;
    post.author = res;
    fn(err, post);
  });
};
