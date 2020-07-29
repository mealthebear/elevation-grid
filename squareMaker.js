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

const findNextSquare = numOfDots => {
  return Math.ceil(Math.sqrt(numOfDots));
}

const squareMaker = (numOfDots, distance, lat, lon) => {
  let elevationPoints = [];
  const squareSize = findNextSquare(numOfDots);
  let startingLat = lat + distanceToLat(distance);
  let startingLon = lon - distanceToLon(distance, lat);
  let trueStartingLon = startingLon;
  let latIncrementer = (distanceToLat(distance) * 2) / squareSize;
  let lonIncrementer = (distanceToLon(distance, lat) * 2) / squareSize;
}