// export default function calculateTravelScoreIndex(lat, long) {
//     let travelScoreIndex;
//     if (lat > 0) {
//       lat = Math.floor(lat);
//     } else {
//       lat = Math.floor(lat) + 1;
//     }
//     if (long > 0) {
//       long = Math.floor(long);
//     } else {
//       long = Math.floor(long) + 1;
//     }
//     if (lat > 0 && long < 0) {
//       travelScoreIndex = (89 - lat) * 360 + 180 + long - 1;
//     } else if (lat > 0 && long >= 0) {
//       travelScoreIndex = (89 - lat) * 360 + 180 + long;
//     } else if (lat <= 0 && long < 0) {
//       travelScoreIndex = (90 - lat) * 360 + 180 + long - 1;
//     } else if (lat <= 0 && long >= 0) {
//       travelScoreIndex = (90 - lat) * 360 + 180 + long;
//     }
//     return travelScoreIndex;
//   }

export default function calculateTravelScoreIndex(lat, long) {
  let travelScoreIndex;
  travelScoreIndex = (89 - Math.floor(lat)) * 360 + 180 + Math.floor(long);
  return travelScoreIndex;
}
