/**
* Method to construct a query url for finding buildings that
* match 0 or more search fields or terms
*
* @args:
*   {obj} state: a state object from the Search component
*   {obj} selectFields: an array of objects with label, field keys
* @returns:
*   {str} a URI-escaped query string for building data
**/

module.exports = (state, selectFields) => {
  let queryTerms = {}
  selectFields.map((field) => {
    let values = Array.from(state[field]);

    if (field == 'tour_ids') {
      values = getTourIds(state, values)
    }

    if (values.length) {
      queryTerms[field] = encodeValues(values)
    }
  })

  return buildQueryUrl(queryTerms);
}

/**
* Get the list of selected tour ids
*
* @args:
*   {obj} state: a state object from the Search component
*   [array] values: a list of selected tour titles
* @returns:
*   [array]: an array of selected tour ids
**/

const getTourIds = (state, values) => {
  let tourValues = [];
  values.map((value) => {
    tourValues.push(state.tourTitleToId[value])
  });
  return tourValues;
}

/**
* Prepare query values by handling whitespace in string values
*
* @args:
*   [array] values: a list of values for the current field
* @returns:
*   [array]: the input array, except now strings with whitespace
*     are underscore joined
**/

const encodeValues = (values) => {
  let encodedValues = [];
  values.map((value) => {
    typeof value == 'string' ?
        encodedValues.push(value.split(' ').join('_'))
      : encodedValues.push(value)
  })
  return encodedValues;
}

/**
* Build the query url to be returned to the Search component
*
* @args:
*   {obj} queryTerms: each key is a query field, and the value's value
*     is a list of values for that field
* @returns:
*   {str}: a url ready to query for buildings
**/

const buildQueryUrl = (queryTerms) => {
  let url = 'buildings';
  if (queryTerms) {
    url += '?filter=true&'
    _.keys(queryTerms).map((field) => {
      url += field + '=' + queryTerms[field].join('+') + '&'
    })
  }
  return url;
}
