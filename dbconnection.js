var mysql=require('mysql');
var connection=mysql.createPool({
  host:'localhost',
  user:'d3',
  password:'password',
  database:'d3hiring'
});

/*connection.connect(function(err) {
  console.log(err.code); // 'ECONNREFUSED'
  console.log(err.fatal); // true
});*/

/*connection.on('error', function(err) {
  console.log(err);
});*/

module.exports=connection;
