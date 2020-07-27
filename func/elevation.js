// /.netlify/functions/elevation

const { 
  oneDegreeOfLat,
  degreesToRadians,
  distanceToLat,
  distanceToLon,
  squareMaker 
} = require('../util.js');

module.exports = async (event, context) => {
  try {
    const data = (haversine(
    {'latitude': 33.68, 'longitude': -117.84}, 
    {'latitude': 33.54, 'longitude': -117.65}, 
    {'unit': 'miles'}));

    return { 
      body: JSON.stringify(data),
      statusCode: 200,
    };
  }
  catch (error) {
    return { 
      body: error.toString(),
      statusCode: 500,  
    };
  }
}