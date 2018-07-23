var db=require('../dbconnection'); //reference of dbconnection.js


var tasks = module.exports = {

  checkStudentExists:function(email, callback) {
    db.query('SELECT COUNT(*) AS count FROM Students WHERE email IN (?);', [email], function(err, rows){
      callback(rows[0].count > 0);
    });
  },

  getStudentDetails:function(email, callback) {
    console.log("calling getStudentDetails");
    if (!Array.isArray(email)) {
      email = [email];
    }
    return query = db.query('SELECT * FROM Students WHERE email IN (?);', [email], callback);
  },

  registerStudents:function(teacher, students, callback) {
    console.log("calling registerStudents");

    var values = [];
    var new_students = [];
    for (var i=0; i < students.length; i++) {
      values.push([teacher, students[i]]);
      new_students.push([students[i]]);
    }

//    console.log(new_students);

    var sql='INSERT IGNORE INTO Students (`email`) VALUES ?';
    var query = db.query(sql, [new_students], function(err, rows) {
      if (err) {
        callback(err);
      }
      else {
        sql='INSERT IGNORE INTO Teachers_Students (`teacher_email`, `student_email`) VALUES ?';
        var query = db.query(sql, [values], callback);
      }
    });

  },

  getCommonStudents:function(teachers, callback){
    console.log("calling getCommonStudents");

    var i = 0;

    const sql_join=`SELECT DISTINCT student_email FROM Teachers_Students WHERE teacher_email = ? `;

    var sql=`${sql_join}`;

    for (i=1; i < teachers.length; i++) {
      sql += ` AND student_email IN (${sql_join})`;
    }

    var query = db.query(sql, teachers, callback);

  },

  suspendStudents:function(students, callback) {
    console.log("calling suspendStudents");

    try {

      var sql='UPDATE Students SET status = 0 WHERE email = ?;';

      var values = students;

      var query = db.query(sql, [values], callback);
    }
    catch (err) {
      callback(err);
    }

  },

  unsuspendStudents:function(students, callback) {
    console.log("calling suspendStudents");

    try {

      var sql='UPDATE Students SET status = 1 WHERE email = ?;';

      var values = students;

      var query = db.query(sql, [values], callback);
    }
    catch (err) {
      callback(err);
    }

  },

  retrieveForNotifications:function(teacher, notification, callback){

    console.log("calling getNotifiedStudents");

    try {
      // parse notification to extract student names using regex
      var mentions = notification.match(/@([A-Za-z0-9_]+\S*)/igm);

      if (mentions !== null) {
        mentions = mentions.map(function(p){return p.substring(1)});
      }

      var students = new Set();

      /*
        students = new Set(mentions.map(function(p){return p.substring(1)})); // ensure distinct values
      }*/

      // find students registered with teacher
      var sql = `SELECT DISTINCT student_email FROM Teachers_Students WHERE teacher_email = ?`;
      var query = db.query(sql, teacher, function(err, rows) {
        for (var i in rows) {
          students.add(rows[i].student_email);
        }
        for (var i in mentions) {
          students.add(mentions[i]);
        }

        //console.log("students");
        //console.log(students);

        // find students NOT suspended AND are actually stored in the Students table
        var sql = `SELECT email FROM Students WHERE status <> 0 AND email IN (?)`;
        var query = db.query(sql, [Array.from(students)], function(err, rows) {
          //  console.log(query.sql);
          const non_suspended_students = [];
          for (var i in rows) {
            non_suspended_students.push(rows[i].email);
          }

          const list = (Array.from(students)).filter(value => -1 !== non_suspended_students.indexOf(value));

          console.log("list");
          console.log(list);

          // return student list
          callback(false, list);
        });

      });

    }
    catch (err) {
      callback(err);
    }

  },

};

