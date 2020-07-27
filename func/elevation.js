// /.netlify/functions/elevation

const haversine = require('haversine');
const { 
  oneDegreeOfLat,
  degreesToRadians,
  distanceToLat,
  distanceToLon,
  squareMaker 
} = require('../util.js');

exports.handler = async (event, context) => {
  try {
    const pointData = squareMaker(100, 100, 33.68, -117.86)
    console.log('This is the point data ****', pointData);
    console.log(pointData.length);
    return { 
      body: JSON.stringify(pointData),
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
