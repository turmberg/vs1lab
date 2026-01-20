// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();
//FROM A3
const global_radius = 1000000;

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
//FROM A3
const GeoTagExamples = require('../models/geotag-examples');
var geoTagStore = new GeoTagStore();

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

//ROOT
router.get('/', (req, res) => {
  const userLatitude = req.body.Latitude || ''; //TODO
  const userLongitude = req.body.Longitude || ''; //TODO
  const taglist = geoTagStore.getNearbyGeoTags(userLatitude, userLongitude, global_radius);
  res.render('index', { taglist, userLatitude, userLongitude});
});

//TAGGING

router.post('/tagging', (req, res) => {
  const userLatitude = req.body.Latitude || '';
  const userLongitude = req.body.Longitude || '';
  const name = req.body.TagName  || '';
  const hashtag = req.body.Hashtag  || '';
  const newTag = new GeoTag(name, userLatitude, userLongitude, hashtag);
  console.log(req.body);
  geoTagStore.addGeoTag(newTag);
  const taglist = geoTagStore.getNearbyGeoTags(userLatitude, userLongitude, global_radius);
  res.render('index', {taglist, userLatitude, userLongitude});
})

//DISCOVERY

router.get('/discovery', (req, res) => {
  res.redirect('/');
});

router.post('/discovery', (req, res) => {
  const userLatitude = req.body.Latitude || '';
  const userLongitude = req.body.Longitude || '';
  const keyword = req.body.Keyword || '';
  const taglist = geoTagStore.searchNearbyGeoTags(userLatitude, userLongitude, global_radius, keyword);

  res.render('index', {taglist, userLatitude, userLongitude});
});


// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...

router.get('/api/geotags', function(req, res) {
  const {keyword, latitude, longitude} = req.query;
  
  let searchResult = []

  if (keyword && latitude && longitude) {
    searchResult = geoTagStore.searchNearbyGeoTags(latitude, longitude, global_radius, keyword);
  }
  else if (latitude && longitude) {
    searchResult = geoTagStore.getNearbyGeoTags(latitude, longitude, global_radius);
  }
  else {
    searchResult = geoTagStore.getAll();
  }

  res.json(searchResult);

})


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...

router.post('/api/geotags', function(req, res) {

  const {name, latitude, longitude, hashtag} = req.body;
  if (!name || !latitude ||!longitude) {
    return res.status(400).json({error: 'geotag information nicht vollständig'});
  }
  var id = geoTagStore.getID();
  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag, id);
  geoTagStore.addGeoTag(newGeoTag);

  res
    .status(201)
    .location(`/api/geotags/${newGeoTag.id}`)
    .json(newGeoTag)
})


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...

router.get('/api/geotags/:id', function(req, res) {
  const id = req.params.id;
  const geoTag = geoTagStore.getGeoTagByID(id);
  if (geoTag == null) return res.status(404).json({error: 'GeoTag not found'});
  res.json(geoTag);
})


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...

router.put('/api/geotags/:id', function(req, res) {
  const name = req.body.name;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const hashtag = req.body.hashtag;
  const id = req.params.id;

  const existingTag = geoTagStore.getGeoTagByID(id);
  if (existingTag == null) return res.status(404).json({error: 'GeoTag not found'});

  geoTagStore.removeGeoTagByID(existingTag.id);
  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag, id);
  geoTagStore.addGeoTag(newGeoTag);

  res.json(newGeoTag);
})

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.delete('/api/geotags/:id', function(req, res) {
  const id = req.params.id;
  const geoTag = geoTagStore.getGeoTagByID(id);
  if (geoTag == null) return res.status(404).json({error: 'GeoTag not found'});
  geoTagStore.removeGeoTagByID(id);
  res.json(geoTag);
})

module.exports = router;
