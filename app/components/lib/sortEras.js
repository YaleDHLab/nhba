/**
 * Helper function that takes as input a list of eras
 * and returns them sorted by the first value in the
 * given era range
 *
 * @args:
 *   {array} eras: an array of all era strings, each of which should
 *     have the form 'x-y'
 * @returns:
 *   {array}: an array of the extant eras, sorted by their first year
 * */

module.exports = eras =>
  eras.sort((a, b) => {
    try {
      const aStart = parseInt(a.split('-')[0]);
      const bStart = parseInt(b.split('-')[0]);
      return aStart < bStart;
    } catch (err) {
      return true;
    }
  });
