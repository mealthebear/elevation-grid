// /.netlify/functions/elevation

const axios = require('axios');
const polyline = require('@mapbox/polyline');
const { squareMaker } = require('../squareMaker.js');

exports.handler = async (event, context) => {
  try {
    const pointData = squareMaker(100, 16000, 33.68, -117.86);
    // console.log('This is the point data ****', pointData);
    // console.log(pointData.length);
    // test comment
    const elevation = await axios.get(
      process.env.FREE_TOPO_API, 
      { params: {
          locations: polyline.encode(pointData),
        }
      }
    );
    return { 
      body: JSON.stringify({topology: elevation.data.results}),
      statusCode: 200,
    };
  }
  catch (error) {
    return { 
      body: error.message,
      statusCode: 500,  
    };
  }
}
