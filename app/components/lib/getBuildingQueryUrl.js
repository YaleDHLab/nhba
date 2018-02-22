import _ from 'lodash';

/**
 * Method to construct a query url for finding buildings that
 * match 0 or more search fields or terms
 *
 * @args:
 *   {obj} state: a state object from the Search component
 *   {obj} selectFields: an array of objects with label, field keys
 * @returns:
 *   {str} a URI-escaped query string for building data
 * */

module.exports = (state, selectFields) => {
  let queryTerms = {};
  queryTerms = addSelectQueryTerms(state, selectFields, queryTerms);
  queryTerms = addSortQueryTerms(state, queryTerms);
  queryTerms = addUserLocationQueryTerms(state, queryTerms);
  return buildQueryUrl(queryTerms);
};

/**
 * Add a key for each search field, and one value to that key
 * for each value selected by the user in that field
 *
 * @args:
 *   {obj} state: a state object from the Search component
 *   {obj} selectFields: an array of objects with label, field keys
 *   {obj} queryTerms: each key is a query field, and the value's value
 *     is a list of values for that field
 * @returns:
 *   {obj}: returns the updated query terms
 * */

const addSelectQueryTerms = (state, selectFields, queryTerms) => {
  selectFields.map(field => {
    const values = Array.from(state[field]);
    if (values.length) queryTerms[field] = encodeValues(values);
  });
  return queryTerms;
};

/**
 * Prepare query values by handling whitespace in string values
 *
 * @args:
 *   [array] values: a list of values for the current field
 * @returns:
 *   [array]: the input array, except now strings with whitespace
 *     are underscore joined
 * */

const encodeValues = values => {
  const encodedValues = [];
  values.map(value => {
    encodedValues.push(encodeURIComponent(value));
  });
  return encodedValues;
};

/**
 * Add a sort option to the queryTerms if the user selected a sort mechanic
 *
 * @args:
 *   {obj} state: a state object from the Search component
 *   {obj} queryTerms: each key is a query field, and the value's value
 *     is a list of values for that field
 * @returns:
 *   {obj}: returns the updated query terms
 * */

const addSortQueryTerms = (state, queryTerms) => {
  if (state.sort && state.sort !== 'Sort by') {
    queryTerms.sort = state.sort;
  }
  return queryTerms;
};

/**
 * Add the user's location to the queryTerms if available
 *
 * @args:
 *   {obj} state: a state object from the Search component
 *   {obj} queryTerms: each key is a query field, and the value's value
 *     is a list of values for that field
 * @returns:
 *   {obj}: returns the updated query terms
 * */

const addUserLocationQueryTerms = (state, queryTerms) => {
  if (state.userLocation) {
    queryTerms.userLatitude = state.userLocation.latitude;
    queryTerms.userLongitude = state.userLocation.longitude;
  }
  return queryTerms;
};

/**
 * Build the query url to be returned to the Search component
 *
 * @args:
 *   {obj} queryTerms: each key is a query field, and the value's value
 *     is a list of values for that field
 * @returns:
 *   {str}: a url ready to query for buildings
 * */

const buildQueryUrl = queryTerms => {
  let url = 'buildings';
  if (queryTerms) {
    url += '?filter=true&';
    _.keys(queryTerms).map(field => {
      if (Array.isArray(queryTerms[field])) {
        queryTerms[field].map(queryTerm => {
          url += `${field}=${queryTerm}&`;
        });
      } else {
        url += `${field}=${queryTerms[field]}&`;
      }
    });
  }

  return url;
};
