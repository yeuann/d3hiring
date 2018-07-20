// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var tasks = require('./models/tasks');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Middleware called.');
  console.log(req.body);
  next(); // make sure we go to the next routes and don't stop here
});


const isInvalidEmail = email => {
  const regexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;
  return !regexp.test(email);
}


router.route('/register').post(function(req, res) {
  try {
    var teacher = req.body.teacher;
    var students = req.body.students;

    if (!Array.isArray(students)) {
      students = [students];
    }

    var invalidEmails = students.filter(isInvalidEmail);
    if (invalidEmails.length > 0) {
      res.status(500).json({ message: "Invalid email address(es): " + invalidEmails });
      return;
    }

    tasks.registerStudents(teacher, students, function(err, rows) {
      if (err) {
        res.status(500).json({ message: err });
      }
      else {
        res.status(204).send();
      }
    });

   }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/commonstudents', function(req, res) {
  try {
    var teachers = req.query.teacher;
    //console.log(teachers);
    if (!Array.isArray(teachers)) {
      teachers = [teachers];
    }

    tasks.getCommonStudents(teachers, function(err, rows) {
      var students = [];
      for (var i=0; i < rows.length; i++) {
        students.push(rows[i].student_email);
      }
      res.status(200).json({'students': students });
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});



router.route('/suspend').post(function(req, res) {

  try {
    var student = req.body.student;

    tasks.getStudentDetails(student, function(err, rows) {
      if (err) {
        throw err;
      }
      else if (rows.length == 0) {
        res.status(500).json({ message: "Unable to find " + student + " in database"});
      }
      else {
        tasks.suspendStudents(student, function(err, rows) {
          res.status(204).send();
        }); // designed to accommodate an array of students even if it's size 1
      }
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.route('/unsuspend').post(function(req, res) {

  try {
    var student = req.body.student;

    tasks.getStudentDetails(student, function(err, rows) {
      if (err) {
        throw err;
      }
      else if (rows.length == 0) {
        res.status(500).json({ message: "Unable to find " + student + " in database"});
      }
      else {
        tasks.unsuspendStudents(student, function(err, rows) {
          res.status(204).send();
        }); // designed to accommodate an array of students even if it's size 1
      }
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});



router.route('/retrievefornotifications').post(function(req, res) {
  try {
    var students = [];
    tasks.retrieveForNotifications(req.body.teacher, req.body.notification, function(err, students) {
      if (err) {
        res.status(500).json({ message: err });
      }
      else {
        res.status(200).json({'recipients': students})
      }
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
