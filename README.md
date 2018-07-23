# d3hiring

## Link(s) to the hosted API

1. http://homeless.sg:8080/api/register
2. http://homeless.sg:8080/api/commonstudents
3. http://homeless.sg:8080/api/suspend
4. http://homeless.sg:8080/api/retrievefornotifications

## Instructions for running local instance of API server
1. First, install [MySQL](https://dev.mysql.com/downloads/mysql/).
2. Run `npm init`
3. Run `npm install`
4. Run `node server.js` in the local directory. The port is set to 8080 by default

## MySQL database setup details

User: d3@localhost
Database: d3hiring

TABLE Teacher_Students
[teacher_email]
[student_email]

TABLE Students
[email]
[status]
- 0 // suspended
- 1 // active
