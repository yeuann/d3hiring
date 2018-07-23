var expect  = require('chai').expect;
var request = require('request');

const API_URL = 'http://localhost:8080/api/';

it('POST /api/register test case #1', function(done) {

  var request_body = {
    "teacher": "teacherken@gmail.com",
    "students":
      [
        "studentjon@example.com",
        "studenthon@example.com"
      ]
    };

  var test_url = `${API_URL}register`;

  request.post({url:test_url, form: request_body}, function(error, response, body) {
    //expect(body).to.equal('');
    expect(response.statusCode).to.equal(204);
    done();
  });
});

it('POST /api/register test case #2: with one invalid email address', function(done) {

  var request_body = {
    "message": "teacherken@gmail.com",
    "students":
      [
        "studentjon@example.com",
        "studenthon@example.com",
        "commonstudent1@@gmail.com"
      ]
    };

  var test_url = `${API_URL}register`;

  request.post({url:test_url, form: request_body}, function(error, response, body) {
    expect(body).to.equal('{"message":"Invalid email address(es): commonstudent1@@gmail.com"}');
    expect(response.statusCode).to.equal(500);
    done();
  });
});

it('POST /api/register test case #2: with two invalid email addresses', function(done) {

  var request_body = {
    "message": "teacherken@gmail.com",
    "students":
      [
        "studentjon@example.com",
        "studenthon@ example.com",
        "commonstudent1@@gmail.com"
      ]
    };

  var test_url = `${API_URL}register`;

  request.post({url:test_url, form: request_body}, function(error, response, body) {
    expect(body).to.equal('{"message":"Invalid email address(es): studenthon@ example.com,commonstudent1@@gmail.com"}');
    expect(response.statusCode).to.equal(500);
    done();
  });
});

it('POST /api/register test case #2: with a blank email address', function(done) {

  var request_body = {
    "message": "teacherken@gmail.com",
    "students":
      [
        "studentjon@example.com",
        "",
      ]
    };

  var test_url = `${API_URL}register`;

  request.post({url:test_url, form: request_body}, function(error, response, body) {
    expect(body).to.equal('{"message":"Invalid email address(es): "}');
    expect(response.statusCode).to.equal(500);
    done();
  });
});



it('GET /commonstudents test case #1: teacherken@gmail.com', function(done) {

  var test_case = ['teacher=teacherken%40gmail.com',
    {"students":
    ["commonstudent1@gmail.com",
     "commonstudent2@gmail.com",
     "studentagnes@example.com",
     "studenthon@example.com",
     "studentjon@example.com",
     "studentmary@gmail.com",
     "studentmiche@example.com",
     "student_only_under_teacher_ken@gmail.com"]
    }
  ];

  var test_url = `${API_URL}commonstudents`;

  request({url:`${test_url}?${test_case[0]}`}, function(error, response, body) {
    expect(body).to.equal(JSON.stringify(test_case[1]));
    expect(response.statusCode).to.equal(200);
    done();
  });

});

it('GET /commonstudents test case #2: teacherjoe@gmail.com', function(done) {

  var test_case = ['teacher=teacherjoe%40gmail.com',
    {"students":
    ["commonstudent1@gmail.com",
     "commonstudent2@gmail.com",
    ]}
  ];

  var test_url = `${API_URL}commonstudents`;

  request({url:`${test_url}?${test_case[0]}`}, function(error, response, body) {
    expect(body).to.equal(JSON.stringify(test_case[1]));
    expect(response.statusCode).to.equal(200);
    done();
  });

});

it('GET /commonstudents test case #3: teacherken@gmail.com and teacherjoe@gmail.com', function(done) {

  var test_case = ['teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com',
    {"students":
    ["commonstudent1@gmail.com",
     "commonstudent2@gmail.com",
    ]}
  ];

  var test_url = `${API_URL}commonstudents`;

  request({url:`${test_url}?${test_case[0]}`}, function(error, response, body) {
    expect(body).to.equal(JSON.stringify(test_case[1]));
    expect(response.statusCode).to.equal(200);
    done();
  });

});


it('GET /commonstudents test case #4: teacherken@gmail.com and teacherjoe@gmail.com and teacherdan@gmail.com', function(done) {

  var test_case = ['teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com&teacher=teacherdan%40gmail.com',
    {"students":
    ["commonstudent1@gmail.com"]}
  ];

  var test_url = `${API_URL}commonstudents`;

  request({url:`${test_url}?${test_case[0]}`}, function(error, response, body) {
    expect(body).to.equal(JSON.stringify(test_case[1]));
    expect(response.statusCode).to.equal(200);
    done();
  });

});


it('POST /api/suspend test case #1: with a proper email address', function(done) {

  var request_body = {
    "student" : "studentmary@gmail.com"
  };

  var test_url = `${API_URL}suspend`;

  request.post({url:test_url, form: request_body}, function(error, response, body) {
    expect(response.statusCode).to.equal(204);
    done();
  });
});


it('POST /api/suspend test case #2: with a blank email address', function(done) {

  var request_body = {
    "student" : ""
  };

  var test_url = `${API_URL}suspend`;

  request.post({url:test_url, form: request_body}, function(error, response, body) {
    expect(body).to.equal('{"message":"Unable to find  in database"}');
    expect(response.statusCode).to.equal(500);
    done();
  });
});

it('POST /api/suspend test case #3: with a wrongly-formatted email address', function(done) {

  var request_body = {
    "student" : "studentmary@@gmail.com"
  };

  var test_url = `${API_URL}suspend`;

  request.post({url:test_url, form: request_body}, function(error, response, body) {
    expect(body).to.equal('{"message":"Unable to find studentmary@@gmail.com in database"}');
    expect(response.statusCode).to.equal(500);
    done();
  });
});


it('POST /api/retrievefornotifications test case #1: with no mentions', function(done) {

  // get teacherken@gmail.com students first
  var test_case = ['teacher=teacherken%40gmail.com',
    {"students":
    ["commonstudent1@gmail.com",
     "commonstudent2@gmail.com",
     "studentagnes@example.com",
     "studenthon@example.com",
     "studentjon@example.com",
     "studentmary@gmail.com",
     "studentmiche@example.com",
     "student_only_under_teacher_ken@gmail.com"]
    }
  ];

  var test_url = `${API_URL}commonstudents`;

  var common_students = null;

  request({url:`${test_url}?${test_case[0]}`}, function(error, response, body) {
    expect(body).to.equal(JSON.stringify(test_case[1]));
    expect(response.statusCode).to.equal(200);
    common_students = JSON.parse(body);

    // test suspended student
    test_url = `${API_URL}suspend`;

    request.post({url:test_url,
      form:
      {
        "student" : "studentmary@gmail.com"
      }},
      function(error, response, body) {
        expect(response.statusCode).to.equal(204);

        var index = common_students.students.indexOf("studentmary@gmail.com");
        if (index > -1) {
          common_students.students.splice(index, 1);
        }

        var request_body = {
          "teacher":  "teacherken@gmail.com",
          "notification": "Hey everybody"
        };

        test_url = `${API_URL}retrievefornotifications`;

        request.post({url:test_url, form: request_body}, function(error, response, body) {
          expect(JSON.stringify(JSON.parse(body).recipients)).to.equal(JSON.stringify(common_students.students));
          expect(response.statusCode).to.equal(200);

          done();
        });


      }
    );

  });

});



it('POST /api/retrievefornotifications test case #2: with @student_only_under_teacher_ken@gmail.com', function(done) {

  // get teacherken@gmail.com students first
  var test_case = ['teacher=teacherjoe%40gmail.com',
    {"students":
    ["commonstudent1@gmail.com",
     "commonstudent2@gmail.com"
    ]}
  ];

  var test_url = `${API_URL}commonstudents`;

  var common_students = null;

  request({url:`${test_url}?${test_case[0]}`}, function(error, response, body) {
    expect(body).to.equal(JSON.stringify(test_case[1]));
    expect(response.statusCode).to.equal(200);
    common_students = JSON.parse(body);

    var request_body = {
      "teacher":  "teacherjoe@gmail.com",
      "notification": "Hello students! @student_only_under_teacher_ken@gmail.com"
    };

    test_url = `${API_URL}retrievefornotifications`;

    const mentions = ["student_only_under_teacher_ken@gmail.com"];

    request.post({url:test_url, form: request_body}, function(error, response, body) {
      expect(JSON.stringify(JSON.parse(body).recipients)).to.equal(JSON.stringify(common_students.students.concat(mentions)));
      expect(response.statusCode).to.equal(200);

      done();
    });

  });

});
