/**
* Return a mapping from tour name to that name's index position
**/

module.exports = (buildings) => {
  let tours = new Set();
  buildings.map((d) => {
    if (d.tours) {
      d.tours.map((tour) => tours.add(tour))
    }
  })

  tours = Array.from(tours);
  let tourIdToIndex = {};
  tours.map((d, i) => {
    tourIdToIndex[d] = i
  })

  return tourIdToIndex;
}