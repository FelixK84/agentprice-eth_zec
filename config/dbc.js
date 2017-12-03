var mysql = require('mysql');

var Dbc = {

  getconnection: (callback) => {

      var connection = mysql.createConnection(
         {
           host    : 'localhost',
           user    : 'huc01',
           password: '$fkMYSQL$1q2w3e4r',
           database: 'btc_eth_zec_db'
         }
       );
       callback(null, connection);//null is the reason of err
   }
}

module.exports = Dbc;
