/* 
Divides the Earth's circumference by 360 to get
a measureable distance for each degree of latitude (≈ 69 miles )  
*/
const oneDegreeOfLat = 24901 / 360;

/* 
JavaScript's Math.cos function only works with radians,
so this formula converts the given latitude to radians 
*/
const degreesToRadians = (lat) => {
  return (lat / 180) * Math.PI;
}

// Convert the distance requested into degrees of latitude
const distanceToLat = (distance) => {
  return distance / oneDegreeOfLat;
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

  let latRadians = Math.cos(degreesToRadians(currentLat));
  let horizontalDistance = oneDegreeOfLat * latRadians
  if (distance / horizontalDistance > 360) { 
    return 360;
  }
  return distance / horizontalDistance;
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
  let startingLat = lat + distanceToLat(distance);
  let startingLon = validateLongitude(lon - distanceToLon(distance, lat));
  let trueStartingLon = startingLon;
  let latIncrementer = (distanceToLat(distance) * 2) / squareSize;
  let lonIncrementer = (distanceToLon(distance, lat) * 2) / squareSize;

  for (let i = 0; i < squareSize; i++) {  
    // check that startingLat is valid
    trueStartingLon = validateLongitude(lon - distanceToLon(distance, startingLat));
    let {currentLat, currentStartingLon, currentLatIncrementer} = validateLatitude(startingLat, trueStartingLon, latIncrementer);
    startingLat = currentLat;
    trueStartingLon = currentStartingLon;
    latIncrementer = currentLatIncrementer;

    // set startingLon to trueStartingLon
    startingLon = trueStartingLon;

    // update lonIncrementer
    lonIncrementer = (distanceToLon(distance, startingLat));
    for (let j = 0; j < squareSize; j++) {
      let currentPoint = {
        latitude: startingLat,
        longitude: startingLon,
      };
      elevationPoints.push(currentPoint);
      startingLon += lonIncrementer;
      startingLon = validateLongitude(startingLon);
    }
    // Increment Lat
    startingLat -= latIncrementer;
  }
  return elevationPoints;
}

module.exports = { squareMaker };