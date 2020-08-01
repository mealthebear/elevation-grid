// /.netlify/functions/elevation

const { squareMaker } = require('../squareMaker.js');

exports.handler = async (event, context) => {
  try {
    const pointData = squareMaker(100, 161000, 33.68, -117.86);
    console.log('This is the point data ****', pointData);
    console.log(pointData.length);
    return { 
      body: JSON.stringify({ elevationPoints: pointData }),
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
