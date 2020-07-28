const haversine = require('haversine');
const oneDegreeOfLat = 24901 / 360;

const degreesToRadians = (lat) => {
  return (lat / 180) * Math.PI;
}

const distanceToLat = (distance) => {
  return distance / oneDegreeOfLat;
}

const distanceToLon = (distance, lat) => {
  let latRadians = Math.cos(degreesToRadians(lat));
  let horizontalDistance = oneDegreeOfLat * latRadians
  if (distance / horizontalDistance > 360) { 
    return 360;
  }
  return distance / horizontalDistance;
}

const squareMaker = (numOfDots, distance, lat, lon) => {  // -89 lat, -179 lon, 100 mile distance, 100 numofpoints
  let elevationPoints = [];
  const circleToSquareRatio = 4 / Math.PI 
  const squareSize = Math.ceil(Math.sqrt(numOfDots * circleToSquareRatio));
  let startingLat = lat + distanceToLat(distance); // -89 + (1.45) => -87.55
  let startingLon = lon - distanceToLon(distance, lat); // -179 - (83) => 96
  let trueStartingLon = lon - distanceToLon(distance, lat); // 96
  let latIncrementer = (distanceToLon(distance, lat) * 2) / squareSize; // 83 * 2 / 12 => 13.8
  const lonIncrementer = (distanceToLat(distance) * 2) / squareSize; // 1.45 * 2 / 12 => 0.24

  for (let i = 0; i < squareSize; i++) {
    if (startingLat > 90) {
      startingLat = 180 - startingLat;
      latIncrementer *= -1;
      if (startingLon >= 0) {
        trueStartingLon -= 180;
      } else {
        trueStartingLon += 180;
      }
    } else if (startingLat < -90) {
      startingLat = -180 - startingLat;
      latIncrementer *= -1;
      if (startingLon >= 0) {
        trueStartingLon -= 180;
      } else {
        trueStartingLon += 180;
      }
    }
    startingLon = trueStartingLon;
    for (let j = 0; j < squareSize; j++) {
      let currentPoint = {
        'latitude': startingLat,
        'longitude': startingLon,
      }
      if (haversine(currentPoint, {'latitude': lat, 'longitude': lon}, { 'unit': 'mile'}) <= distance) {
      elevationPoints.push(currentPoint);
      }
      startingLon += lonIncrementer;
      if (startingLon > 180) {
        startingLon -= 360;
      } else if (startingLon < -180) { //make sure -180 works with API
        startingLon += 360;
      }
    }
    startingLat -= latIncrementer;
  }
  return elevationPoints;
}

module.exports = {
  oneDegreeOfLat,
  degreesToRadians,
  distanceToLat,
  distanceToLon,
  squareMaker,
};
