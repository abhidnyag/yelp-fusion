'use strict';

const yelp = require('yelp-fusion');

var mysql = require('mysql');

var async = require('async');
var search = require('./search');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "upworkdb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");


var sql = 'SELECT id, name, zip_codes, state, longitude, latitude FROM us_cities WHERE id > 40545';
con.query(sql, function (err, results, fields) {

    if (err) throw err;
 
  

  async.eachOfSeries(results, (value, key, callback1) => {
 
            search.get_yelp_data(value.latitude, value.longitude, allResults => {
          
            if(allResults.length == 0){
              callback1();
              return;
            }
        
            async.eachOfSeries(allResults, (r, k, callback2) => {
                saveData(value.id, r, callback2);
                console.log(value.id);
                
            }, () => {
                console.log("done");
                callback1();
            })
        });
    }, () => {
      console.log("done");
    }) 
    });   
});


function saveData(city_id, allResults, callback2){
  var name = allResults.name,
      
  coordinates = allResults.coordinates,

  location = allResults.location,
  
  phone = allResults.phone,

  distance = allResults.distance;
  
  var items;

  var insertData = {}; 

  insertData.name = name; 

  insertData.coordinates = coordinates;

  insertData.location = location;

  insertData.phone = phone;
  insertData.city_id = city_id;
  insertData.distance = distance;
  var keys = '(';
  var values = '(';
  for (var key in insertData) {
    if (insertData.hasOwnProperty(key)) {
        keys += key + ",";
        values += '"' + con.escape(insertData[key]) + '",'; 
    }
  }
  keys = keys.slice(0, -1) + ")";
  values = values.slice(0, -1) + ")";

  var i;
      for(i = 0; i < values.length; i++) {
      values = values.replace("'", "");
  }

  var sql = `INSERT INTO yelp_data_new ${keys} VALUES ${values} `;
 //var sql = `ALTER TABLE yelp_data_new ADD FOREIGN KEY (city_id) REFERENCES us_cities(id);`
  con.query(sql, function (err, result) {
      if (err) throw err;
      //console.log("1 record inserted");
      callback2();
    
  });  
}