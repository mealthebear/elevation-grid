const earthRadius = 6371000;
const degreesToRadians = Math.PI / 180;
const radiansToDegrees = 180 / Math.PI;

// Convert the distance requested into degrees of latitude
const distanceToLat = (distance) => {
  return (distance / earthRadius) * radiansToDegrees;
}

/* 
Convert the distance requested into degrees of longitude 
NOTE: The distance you have to cover to change your longitude 
decreases as you head closer to the poles, so this function
also takes into account the latitude
*/
const distanceToLon = (distance, lat) => {
  let currentLat = lat;
  if (currentLat > 90) {
    currentLat = 180 - currentLat;
  }
  else if (currentLat < -90) {
    currentLat = -180 - currentLat;
  }

  const r = earthRadius * Math.cos(currentLat * degreesToRadians);

  // Subtract 2π (360°) from the radian value until it is between 0 and 2π
  let rads = distance / r;
  while (rads >= 2 * Math.PI) {
    rads -= 2 * Math.PI;
  }

  return rads * radiansToDegrees;
}

const findNextSquare = numOfDots => {
  return Math.ceil(Math.sqrt(numOfDots));
}

/*
This function checks that the longitude is between
-180 and 180 degrees (inclusive)
*/
const validateLongitude = lon => {
  if (lon > 180) {
    lon -= 360;
  } else if (lon < -180) { 
    lon += 360;
  }
  return lon;
}

/*
This function checks that the latitude is between
-90 and 90 degrees (inclusive), and adjusts the latitude
incrementer and longitude appropriately if the latitude
is changed
*/
const validateLatitude = (lat, lon, incrementer) => {
  if (lat > 90) {
    lat = 180 - lat;
    incrementer *= -1;
    if (lon > 0) {
      lon = lon - 180;
    } else {
      lon = lon + 180;
    }
  } else if (lat < -90) {
    lat = -180 - lat;
    incrementer *= -1;
    if (lon > 0) {
      lon = lon - 180;
    } else {
      lon = lon + 180;
    }
  }

  return {
    currentLat: lat,
    currentStartingLon: lon,
    currentLatIncrementer: incrementer,
  }
}

/*
This function returns a grid of coordinates. Each grid contains a number of
coordinates equal to the next largest square number that is greater than
numOfDots, has sides of length distance * 2, and is centered around coordinates
(lat, lon)
*/
const squareMaker = (numOfDots, distance, lat, lon) => {
  let elevationPoints = [];
  const squareSize = findNextSquare(numOfDots);
  const squareSideLength = distance * 2;
  // How far to go north from the epicenter
  let startingLat = lat + distanceToLat(distance);
  // How far to go west from the epicenter
  let startingLon = validateLongitude(lon - distanceToLon(distance, lat));
  // Reference point for longitude to reset to when we move to the next latitude
  let trueStartingLon = startingLon;
  /* 
  We know how far to go north or west, but that's only half the total distance.
  We also need to go the same distance to the south and east. We can multiply
  by 2 to achieve this. Then, divide by the side of the square (all sides are
  equal in length) to know how much to increment to get evenly spaced points
  (North to south  &  West to East)
  */
  let latIncrementer = distanceToLat(squareSideLength) / squareSize;
  let lonIncrementer = distanceToLon(squareSideLength, lat) / squareSize;

  for (let i = 0; i < squareSize; i++) {  
    // check that startingLat is valid
    trueStartingLon = validateLongitude(lon - distanceToLon(distance, startingLat));
    let {currentLat, currentStartingLon, currentLatIncrementer} = validateLatitude(startingLat, trueStartingLon, latIncrementer);
    startingLat = currentLat;
    trueStartingLon = currentStartingLon;
    latIncrementer = currentLatIncrementer;

    // set startingLon to trueStartingLon
    startingLon = trueStartingLon;

    // update lonIncrementer based on latitude
    lonIncrementer = distanceToLon(squareSideLength, startingLat) / squareSize;
    for (let j = 0; j < squareSize; j++) {
      let currentPoint = {
        latitude: startingLat,
        longitude: startingLon,
      };
      elevationPoints.push(currentPoint);
      startingLon += lonIncrementer;
      startingLon = validateLongitude(startingLon);
    }
    // Decrement Lat
    startingLat -= latIncrementer;
  }
  return elevationPoints;
}

module.exports = { squareMaker };