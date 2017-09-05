var Models = require('./models');
var session = require('express-session');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');

const mongoURL = process.env.MONGO_DB_URL || "mongodb://localhost/shifts";
const models = Models(mongoURL);
var WaiterShift = models.WaiterShift;
// var WaiterShift = shifts(mongoURL)
// console.log(WaiterShift);

module.exports = function(){
  var dbpassword = "amila";
  var dbusername = "Milonie";

  var allDaysSelected = []

  let getShift = function(req,res){
    var selectedDays = req.body.availableDays; //[]
    var  enteredUsername = req.params.username;


    WaiterShift.findOne({username:enteredUsername}, function(err, data){
      if(err){
        console.log(err);
      }
      else {
        if(!data){
          res.render('waiter',{username:enteredUsername});
        }
        else {
          // console.log("wwwwwwwwwwwwwwwww"+ selectedDays);
          res.render('waiter',{data:data , username:enteredUsername, days:selectedDays});
        }
  }
});
}

let addedDays = function(req,res){
      var selectedDays = req.body.availableDays; //[]
      var  enteredUsername = req.params.username;

    //go to db check if this waiter exists
      WaiterShift.findOne({username:enteredUsername}, function(err, data){
        if(err){
          console.log(err);
        }
        else {
          //if it does not exists
          if(!data){
            //create a new user
            var shift = new WaiterShift({username:enteredUsername})
            if (!Array.isArray(selectedDays)) {
                       selectedDays = [selectedDays]
               }
            selectedDays.forEach(function(day){
              shift[day] = true;
            });
            shift.save(function(err,result){
              if(err){
                console.log(err);
              }
              else {
                req.flash('msg', 'Thank you' + ' ' + enteredUsername + ' '+ 'you have selected to work on these days');
                req.flash('days', selectedDays);
                res.redirect("/waiter/" + enteredUsername);
              }
            })
          }
          else {
            //unselect all
            data.Monday = false
            data.Tuesday = false
            data.Wednesday = false
            data.Thursday = false
            data.Friday = false
            data.Saturday = false
            data.Sunday= false

            //now mark the selected days
            selectedDays.forEach(function(day){
              data[day] = true;
            });

            data.save(function(err,result){
              if(err){
                console.log(err);
              }
              else {
                req.flash('msg', 'Thank you' + ' ' + enteredUsername + ' '+ 'you have selected to work on these days');
                req.flash('days', selectedDays);
                res.redirect("/waiter/" + enteredUsername);
              }
            })
            // res.render('waiter',{selectedDays:data})
          }
        }
      });
    }

    let daysWithWaiters = function(req, res){
      var days = req.body.availableDays

      var waitersPerDay = {
        Monday: {
          waiters : []
        },
        Tuesday: {
          waiters : []
        },
        Wednesday: {
        waiters:[]
        },
        Thursday:{
          waiters:[]
        },
        Friday:{
          waiters:[]
        },
        Saturday:{
          waiters:[]
        },
        Sunday:{
          waiters:[]
        }
      }

      const SHIFT_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday","Sunday"];

      WaiterShift.find({}, function(err, shifts){
        // var color = [];
        if(err){
          console.log(err);
        }
        else{

          shifts.forEach(function(waiterShift){

            SHIFT_DAYS.forEach(function(shiftDay){
              // is this waiter working for the current day
              if (waiterShift[shiftDay]){
                //if so add this waiter name into the day list
                waitersPerDay[shiftDay].waiters.push(waiterShift.username);

              }
            });

          })


          for(var day in waitersPerDay){
            var currentDay = waitersPerDay[day];
            if(currentDay.waiters.length > 3) {
              currentDay.displayStyle = "blue";
            }
            else if(currentDay.waiters.length === 3){
                currentDay.displayStyle = "green";
            }
            else if(currentDay.waiters.length < 3){
                currentDay.displayStyle = "purple";
            }
          }

          console.log(waitersPerDay);

          res.render('days', {waitersPerDay:waitersPerDay});
        }
      })


      /*
      if(waitersPerDay[shiftDay].length < 3){
        var color = "blue";
      }
      else if(waitersPerDay[shiftDay].length === 3){
        var color = "green";
      }
      else if(waitersPerDay[shiftDay].length > 3) {
        var color = "purple";
      }
      else{
        var color = "black";
      }
      */

    }
    let login = function(req, res){
      var username = req.body.username;
      var password = req.body.password;
        var name = req.session.views;
        console.log(name);
        if(username === dbusername && password === dbpassword){
          res.render('waiter',{username: username});
        }
        else{
        res.redirect("/login")
      }
    };

    let loginScreen = function(req,res){
      res.render('login');
    }

  return {
    addedDays,
    getShift,
    daysWithWaiters,
    loginScreen,
    login
  }
};
