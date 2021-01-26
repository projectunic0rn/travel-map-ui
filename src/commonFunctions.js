export function calculateTravelScoreIndex(lat, long) {
  let travelScoreIndex;
  travelScoreIndex = (89 - Math.floor(lat)) * 360 + 180 + Math.floor(long);
  return travelScoreIndex;
}

