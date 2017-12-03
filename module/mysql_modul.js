var path = require('path');
var mysql = require('mysql');
var dbc = require(path.join(__dirname, '..', 'config', 'dbc'));

var Mysql_modul = {

  insert_ticker: (lastrate, callback) => {


    /*  the datum var has the format dd.MM.yyyy when it comes.
        for the query i need either integer or the timestamp format!  */
    dbc.getconnection((err, con) => {
        con.connect();

        var queryString = "INSERT INTO eth_zec SET ?";

        var values = {
          rate: lastrate,
          datetime: new Date()
        };

        con.query(queryString, values, (err, results, fields) => {
          con.end();
          if(err){
            callback(err);
          } else {
            callback(null, true)
          }
        });
    });
  },

  makedateobj: (date, time) => {
    //console.log(date);
    //console.log(time);
    var da = date.split("."); //dd[0].MM[1].yyyy[2]
    var ta = time.split(":"); //hh[0]:mm[1]:ss[2]
    for(var i = 0; i < da.length; i++){
        if(da[i].length <= 2){
          if(i == 1){
            if(da[i].indexOf("0") == 0){
              da[i] = parseInt(da[1])+1;
              da[i] = da[1].toString();
              if(da[i].length == 2){
                da[i] = da[i];
              } else {
                da[i] = '0' + da[1];
              }
            } else {
              da[i] = parseInt(da[1])+1;
              da[i] = da[1].toString();
            }
          } else {
            da[i] = da[i];
          }
        } else {
          da[i] = da[i];
        }
    };
    // new Date(2012,3,1,20,28,56,445); //year, month, day, hours, minutes, seconds, milliseconds
    //console.log(da[2] + "-" + da[1] + "-" + da[0] + "T" + ta[0] + ":" + ta[1])
    var dateobj = new Date(da[2] + "-" + da[1] + "-" + da[0] + "T" + ta[0] + ":" + ta[1]);
    //console.log(dateobj.getTime());
    return dateobj.getTime();
  },

  getdates: (user, callback) => {
    dbc.getconnection((err, con) => {
        con.connect();

        var queryString = "SELECT * FROM times WHERE ? ORDER BY arbeitsbeginn";

        var values = {
          user: user,
        };

        con.query(queryString, values, (err, results, fields) => {
          con.end();
          if(err){
            callback(err);
          } else {
            callback(null, results)
          }
        });
    });
  },

  makeoutput: (results, callback) => {
    var output = [];
    results.forEach((row, index) => {
      Time_modul.integertodateobj(row.arbeitsbeginn, (err, ab) => {
        Time_modul.integertodateobj(row.arbeitsende, (err, ae) => {
          var jsonobj = {
            'id': row.id,
            'user': row.user,
            'datum': ((ab.getDate()<10?'0':'') + ab.getDate()) + "." + ((ab.getMonth()<10?'0':'')+ ab.getMonth())+ "." + ab.getFullYear(),
            'arbeitsbeginn': ((ab.getHours()<10?'0':'')+ab.getHours()) + ":" + ((ab.getMinutes()<10?'0':'') + ab.getMinutes()),
            'arbeitsende':((ae.getHours()<10?'0':'')+ae.getHours()) + ":" + ((ae.getMinutes()<10?'0':'') + ae.getMinutes()),
            'stunden': Time_modul.millisecondstohours(Time_modul.getworkhours(ab, ae))
          }
          //console.log(row.arbeitsbeginn);
          output.push(jsonobj);
        });
      });
    });
    callback(null, output);
  },

  getworkhours: (ab, ae) => {
    var wh = ae-ab;
    return wh;
  },

  millisecondstohours: (mill) => {
    var ho = mill/1000/60/60;
    return ho;
  },

  integertodateobj: (integer, callback) => {
    var date = new Date(integer);
    callback(null, date);
  },

  update_time: (id, date, from, to, callback) => {

    dbc.getconnection((err, con) => {
      con.connect();

      var queryString = "UPDATE times SET arbeitsbeginn = ?, arbeitsende = ? WHERE id = ?";

      //console.log(Time_modul.makedateobj(date, from));

      var values = [
        Time_modul.makedateobj(date, from),
        Time_modul.makedateobj(date, to),
        id
      ];

      //console.log(values[0]);
      //console.log(values[1]);
      //console.log(values.id);
      //console.log(values.arbeitsbeginn);
      //console.log(values.arbeitsende);

      con.query(queryString, values, (err, results, fields) => {
        con.end();
        if(err){
          callback(err);
        } else {
          callback(null, true)
        }
      });
    });
  }
}

module.exports = Mysql_modul;
