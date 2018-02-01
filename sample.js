'use strict';

const yelp = require('yelp-fusion');

const apiKey = 'dR_hIgVsCVGONjpI7XYbz0XxXUD2ye_JsvudVXNIO9KVBGMgsOjJWZ2XEdzZ_ZarkHr3iA-kLNUindT-mQXD76DIenrGjPRNJMsQYRgEKm7lh2R-pWSZfNydP5NvWnYx';

const searchRequest = {
  term:'Four Barrel Coffee',
  location: 'san francisco, ca'
};

const client = yelp.client(apiKey);

client.search(searchRequest).then(response => {

  const firstResult = response.jsonBody.businesses[0];
  const allResults = response.jsonBody.businesses;
  const prettyJson = JSON.stringify(firstResult, null, 4);

  //console.log(prettyJson);

allResults.forEach(result => {
  const prettyJson2 = JSON.stringify(result, null, 4);
  console.log(prettyJson2)
});
}).catch(e => {
  console.log(e);
});
