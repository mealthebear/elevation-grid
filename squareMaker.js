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

const validateLongitude = lon => {
  if (lon > 180) {
    lon -= 360;
  } else if (lon < -180) { 
    lon += 360;
  }
  return lon;
}

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