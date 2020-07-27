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

const squareMaker = (numOfDots, distance, lat, lon) => {
  const elevationPoints = [];
  const circleToSquareRatio = 4 / Math.PI
  const squareSize = Math.ceil(Math.sqrt(numOfDots * circleToSquareRatio));
  let startingLat = lat + distanceToLat(distance); 
  let startingLon = lon - distanceToLon(distance, lat);
  const latIncrementer = (distanceToLon(distance, lat) * 2) / squareSize;
  const lonIncrementer = (distanceToLat(distance) * 2) / squareSize;

  for (let i = 0; i < squareSize; i++) {
    for (let j = 0; j < squareSize; j++) {
      let currentPoint = {
        lat: startingLat,
        lon: startingLon,
      }
      if (haversine(currentPoint, {'lat': lat, 'lon': lon}, { 'unit': 'mile'}) <= distance) {
      elevationPoints.push(currentPoint);
      }
      startingLon += lonIncrementer;
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
