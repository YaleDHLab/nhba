/**
* This function processes the response from an api call
* for all available tour data and sets state on the
* component to which the function is bound. The state
* object contains a mapping from tourId to title & vice versa
*
* @args
*   err: an error object from the api call (if any)
*   res: a response from the api call (if any)
**/

import _ from 'lodash'

module.exports = function(err, res, callback) {
  if (err) { console.warn(err) } else {
    let tourIdToTitle = {};
    let tourIdToIndex = {};
    let tourTitleToId = {};
    res.body.map((tour) => {
      tourIdToTitle[tour.tour_id] = tour.post_title;
      tourTitleToId[tour.post_title] = tour.tour_id;
    })

    _.keys(tourIdToTitle).map((tourId, idx) => {
      tourIdToIndex[tourId] = idx;
    })

    this.setState({
      tourIdToTitle: tourIdToTitle,
      tourIdToIndex: tourIdToIndex,
      tourTitleToId: tourTitleToId
    }, () => {
      if (callback) callback()
    })
  }
}
