
const yelp = require('yelp-fusion');

var async = require('async');

var f = {}
const apiKey = 'RkNiJ4yDAnrlEpzS2PhDwtd3eRrTdE4bNyi5spu79p3lSC1J3q0EXm0-AnycJyZ4DYHgij35oEylL2gyAtATExDHiq4edDEx4dJJXnLh3gvaayRJqKW1vPvMCm18WnYx';
const client = yelp.client(apiKey);

function yelp_api_call(lat, lng, radius, cb){
    const searchRequest = {
      //term:'Lebanese Taverna',
      //location: 'Fort Lauderdale, FL',
        latitude:lat,
        longitude: lng,
      // location: `${value.name}, ${value.state}, USA`,
      // location: `${name}, ${state}`,
        radius: radius,
        categories: 'titleloans',
        sort_by: 'distance'
      };
        
      client.search(searchRequest).then(response => {
        const allResults = response.jsonBody.businesses;
        cb(allResults);
      }).catch(e => {
        console.log(e);
        cb([]);
      });
}       
        
f.get_yelp_data = function(lat, lng, cb){
    console.log(lat, lng);
    async.waterfall([
        function(callback){
            console.log("1 yelp");
            yelp_api_call(lat, lng, 8000, results => {
                if(results.length >= 10){
                    callback(true, results);
                } else {
                    callback(null, results);
                }
            }) 
        },
        function(results, callback){
            console.log("2 yelp");
            yelp_api_call(lat , lng, 16000, results => {
                if(results.length >= 10){
                    callback(true, results);
                } else {
                    callback(null, results);
                }
            })
        },
        function(results, callback){
            console.log("3 yelp");
            yelp_api_call(lat, lng, 25000, results => {
                callback(null, results);
            })
        }  
    ],(e,results) => {
        console.log("4 yelp");
        cb(results);
    }); 
};      
        
        
module.exports = f;