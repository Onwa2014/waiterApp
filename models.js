var mongoose = require('mongoose');

var WaiterShift = mongoose.model('WaiterShift', {
  username: String,
  password: String,
  Sunday: Boolean,
  Monday: Boolean,
  Tuesday: Boolean,
  Wednesday: Boolean,
  Thursday: Boolean,
  Friday: Boolean,
  Saturday: Boolean
});

module.exports = function(mongoURL){

  console.log(mongoURL);

  mongoose.connect(mongoURL);
  mongoose.connection.on("error",function(err){
    console.log(err);
  })

  return {
    WaiterShift
  }

}
